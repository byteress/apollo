# Apollo – FastAPI Backend

A lightweight FastAPI service that proxies the **Facebook Graph API** so that the
page access token is never exposed in the browser.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/posts` | Return recent Facebook page posts |
| `GET` | `/health` | Health-check (excluded from OpenAPI docs) |

### `GET /api/posts`

| Query param | Type | Default | Description |
|-------------|------|---------|-------------|
| `limit` | int | `10` | Number of posts to return (1–25) |
| `after` | string | _(none)_ | Pagination cursor from a previous response's `paging.cursors.after` field |

**Example response**

```json
{
  "data": [
    {
      "id": "123456789_987654321",
      "message": "New build just dropped 🔥",
      "created_time": "2025-06-01T12:00:00+0000",
      "full_picture": "https://...",
      "likes": { "summary": { "total_count": 42 } },
      "comments": { "summary": { "total_count": 7 } },
      "shares": { "count": 3 }
    }
  ],
  "paging": {
    "cursors": {
      "before": "before_cursor_string",
      "after": "after_cursor_string"
    }
  }
}
```

## Setup

```bash
cd backend

# 1. Create a virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in FB_ACCESS_TOKEN

# 4. Start the development server
uvicorn main:app --reload --port 8000
```

The API will be available at <http://localhost:8000>.  
Interactive docs (Swagger UI) are at <http://localhost:8000/docs>.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FB_ACCESS_TOKEN` | ✅ | — | Facebook page access token |
| `CORS_ORIGINS` | ❌ | `http://localhost:5173,http://localhost:4173` | Comma-separated allowed origins |
| `CACHE_TTL_SECONDS` | ❌ | `60` | Seconds to cache first-page `/api/posts` results in memory |

## Architecture Highlights

- **Shared HTTP client** – a single `httpx.AsyncClient` is created at startup via
  FastAPI's `lifespan` context manager, enabling connection reuse across requests.
- **In-memory TTL cache** – first-page `/api/posts` responses are cached for
  `CACHE_TTL_SECONDS` seconds to avoid hitting Facebook's rate limits on every
  page load. Paginated requests (with an `after` cursor) bypass the cache.
- **Cursor-based pagination** – pass the `after` cursor from any response's
  `paging.cursors.after` field to load the next page of posts.
- **Typed responses** – Pydantic models validate and document the API responses
  in Swagger UI automatically.
- **Graceful error handling** – network timeouts return HTTP 504; connectivity
  errors return HTTP 503; Facebook API errors are forwarded with their original
  status code.
