# Apollo – PHP Backend

A lightweight PHP script that proxies the **Facebook Graph API** so that the
page access token is never exposed in the browser.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/posts` | Return recent Facebook page posts |
| `GET` | `/health` | Health-check |

### `GET /api/posts`

| Query param | Type | Default | Description |
|-------------|------|---------|-------------|
| `limit` | int | `10` | Number of posts to return (1–100) |
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

## Requirements

- PHP 8.1 or newer
- `curl` extension enabled (enabled by default in most PHP installations)
- A web server (Apache with `mod_rewrite`, or Nginx – see below)

## Setup

### Apache

```bash
cd backend

# 1. Configure environment variables
cp .env.example .env
# Edit .env and fill in FB_ACCESS_TOKEN

# 2. Point your virtual host document root at the backend/ directory
#    The included .htaccess routes all requests to index.php automatically
#    (requires mod_rewrite to be enabled)
```

### Nginx

Add the following inside your `server` block:

```nginx
root /path/to/backend;
index index.php;

location / {
    try_files $uri /index.php$is_args$args;
}

location ~ \.php$ {
    include fastcgi_params;
    fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

### Built-in PHP server (development only)

```bash
cd backend
cp .env.example .env
# Edit .env and fill in FB_ACCESS_TOKEN
php -S localhost:8000
```

The API will be available at <http://localhost:8000>.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FB_ACCESS_TOKEN` | ✅ | — | Facebook page access token |
| `CORS_ORIGINS` | ❌ | `http://localhost:5173,http://localhost:4173` | Comma-separated allowed origins |
| `CACHE_TTL_SECONDS` | ❌ | `60` | Seconds to cache first-page `/api/posts` results in memory |

## Architecture Highlights

- **No external dependencies** – a single `index.php` with no Composer packages required.
- **Inline `.env` loader** – reads `backend/.env` at startup (same format as the previous Python backend).
- **In-memory TTL cache** – uses [APCu](https://www.php.net/manual/en/book.apcu.php) when the extension is available; falls back to a file-based cache in the system temp directory. First-page `/api/posts` responses are cached for `CACHE_TTL_SECONDS` seconds to avoid hitting Facebook's rate limits on every page load.
- **Cursor-based pagination** – pass the `after` cursor from any response's `paging.cursors.after` field to load the next page of posts. Paginated requests bypass the cache.
- **Graceful error handling** – network timeouts return HTTP 504; connectivity errors return HTTP 503; Facebook API errors are forwarded with their original status code.
- **CORS** – configurable via `CORS_ORIGINS`; handles `OPTIONS` preflight requests.

