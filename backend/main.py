from __future__ import annotations

import logging
import os
import time
import warnings
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

FB_GRAPH_BASE = "https://graph.facebook.com/v25.0"
FB_POST_FIELDS = ",".join(
    [
        "id",
        "message",
        "created_time",
        "full_picture",
        "attachments{description,media,url,subattachments}",
        "likes.summary(true).limit(0)",
        "comments.summary(true).limit(0)",
        "shares",
    ]
)

CACHE_TTL_SECONDS = int(os.getenv("CACHE_TTL_SECONDS", "60"))

_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:4173")
CORS_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# ---------------------------------------------------------------------------
# Pydantic response models
# ---------------------------------------------------------------------------


class PostsResponse(BaseModel):
    data: list[dict[str, Any]]
    paging: dict[str, Any] | None = None


class HealthResponse(BaseModel):
    status: str


# ---------------------------------------------------------------------------
# In-memory TTL cache  (keyed by limit; bypassed when an `after` cursor is used)
# ---------------------------------------------------------------------------


@dataclass
class _CacheEntry:
    timestamp: float
    data: list[dict[str, Any]]
    paging: dict[str, Any] | None


_cache: dict[int, _CacheEntry] = {}


def _cache_get(limit: int) -> tuple[list[dict[str, Any]], dict[str, Any] | None] | None:
    entry = _cache.get(limit)
    if entry and time.monotonic() - entry.timestamp < CACHE_TTL_SECONDS:
        return entry.data, entry.paging
    return None


def _cache_set(
    limit: int,
    data: list[dict[str, Any]],
    paging: dict[str, Any] | None,
) -> None:
    _cache[limit] = _CacheEntry(timestamp=time.monotonic(), data=data, paging=paging)


# ---------------------------------------------------------------------------
# Lifespan – create a single shared HTTP client for connection reuse
# ---------------------------------------------------------------------------

_http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> Any:
    global _http_client
    if not os.getenv("FB_ACCESS_TOKEN"):
        warnings.warn(
            "FB_ACCESS_TOKEN is not set. /api/posts will return HTTP 500.",
            RuntimeWarning,
            stacklevel=1,
        )
    _http_client = httpx.AsyncClient(timeout=15)
    try:
        yield
    finally:
        await _http_client.aclose()
        _http_client = None


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Apollo Facebook Posts API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get(
    "/api/posts",
    response_model=PostsResponse,
    summary="Fetch the latest Facebook page posts",
)
async def get_posts(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Number of posts to return per page (1–100).",
    ),
    after: str | None = Query(
        default=None,
        description="Pagination cursor from a previous response's `paging.cursors.after` field.",
    ),
) -> PostsResponse:
    """Return Facebook page posts with cursor-based pagination.

    Pass the ``after`` cursor from a previous response's ``paging.cursors.after``
    to fetch the next page.  First-page results (no cursor) are cached for
    ``CACHE_TTL_SECONDS`` seconds to reduce Facebook API calls.
    """
    access_token = os.getenv("FB_ACCESS_TOKEN")
    if not access_token:
        raise HTTPException(
            status_code=500,
            detail="FB_ACCESS_TOKEN is not configured on the server.",
        )

    # Serve from cache when fetching the first page
    if after is None:
        cached = _cache_get(limit)
        if cached is not None:
            return PostsResponse(data=cached[0], paging=cached[1])

    if _http_client is None:
        raise HTTPException(status_code=503, detail="Service is not ready yet.")

    url = f"{FB_GRAPH_BASE}/me/posts"
    params: dict[str, str | int] = {"fields": FB_POST_FIELDS, "limit": limit}
    if after:
        params["after"] = after
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = await _http_client.get(url, params=params, headers=headers)
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Request to the Facebook API timed out. Please try again.",
        )
    except httpx.RequestError as exc:
        logger.error("Facebook API request failed: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="Could not reach the Facebook API. Please try again later.",
        )

    payload: dict[str, Any] = response.json()

    if not response.is_success:
        fb_message: str = payload.get("error", {}).get(
            "message", "Failed to fetch Facebook posts."
        )
        raise HTTPException(status_code=response.status_code, detail=fb_message)

    data: list[dict[str, Any]] = payload.get("data", [])
    paging: dict[str, Any] | None = payload.get("paging")

    if after is None:
        _cache_set(limit, data, paging)

    return PostsResponse(data=data, paging=paging)


@app.get("/health", response_model=HealthResponse, include_in_schema=False)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")
