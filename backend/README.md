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
  ]
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

| Variable | Required | Description |
|----------|----------|-------------|
| `FB_ACCESS_TOKEN` | ✅ | Facebook page access token |
| `CORS_ORIGINS` | ❌ | Comma-separated allowed origins (default: Vite dev servers) |

## Connecting the Frontend

Update `src/services/api.ts` to call the backend instead of the Graph API
directly:

```ts
export const fetchFacebookPosts = async (): Promise<FacebookPost[]> => {
  const url = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/posts?limit=6`
    : 'http://localhost:8000/api/posts?limit=6';

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail ?? 'Failed to fetch Facebook posts.');
  }

  return (data.data ?? []) as FacebookPost[];
};
```

Add `VITE_API_URL=http://localhost:8000` to your frontend `.env.local` when
running both services locally.
