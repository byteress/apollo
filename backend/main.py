from __future__ import annotations

import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Apollo Facebook Posts API", version="1.0.0")

# Allow the Vite dev server and any production origin to reach this backend.
# Tighten CORS_ORIGINS in production by setting the env var explicitly.
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:4173")
CORS_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

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


@app.get("/api/posts", summary="Fetch the latest Facebook page posts")
async def get_posts(limit: int = 10) -> dict[str, Any]:
    """Return the most recent Facebook page posts.

    Query Parameters
    ----------------
    limit : int
        Maximum number of posts to return (default 10, max 25).
    """
    access_token = os.getenv("FB_ACCESS_TOKEN")
    if not access_token:
        raise HTTPException(
            status_code=500,
            detail="FB_ACCESS_TOKEN is not configured on the server.",
        )

    limit = max(1, min(limit, 25))

    url = f"{FB_GRAPH_BASE}/me/posts"
    params: dict[str, str | int] = {
        "fields": FB_POST_FIELDS,
        "limit": limit,
    }
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params=params, headers=headers)

    payload: dict[str, Any] = response.json()

    if not response.is_success:
        fb_message: str = (
            payload.get("error", {}).get("message", "Failed to fetch Facebook posts.")
        )
        raise HTTPException(status_code=response.status_code, detail=fb_message)

    return {"data": payload.get("data", [])}


@app.get("/health", include_in_schema=False)
async def health() -> dict[str, str]:
    return {"status": "ok"}
