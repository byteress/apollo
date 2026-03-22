# Apollo – PHP Backend

A lightweight PHP backend that proxies the **Facebook Graph API** so that the
page access token is never exposed in the browser.

Built with **OOP / PDO-style architecture** (inspired by
[bitress/phploginsystem](https://github.com/bitress/phploginsystem)) and
managed with **Composer**.

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
- Composer 2.x
- `curl` extension enabled (default in most PHP installations)
- A web server (Apache with `mod_rewrite`, or Nginx)

## Setup

```bash
cd backend

# 1. Install Composer dependencies
composer install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and fill in FB_ACCESS_TOKEN
```

### Apache

The included `.htaccess` routes all requests to `index.php` automatically
(requires `mod_rewrite` to be enabled). Point your virtual host document root
at the `backend/` directory.

### Nginx

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
php -S localhost:8000
```

The API will be available at <http://localhost:8000>.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FB_ACCESS_TOKEN` | ✅ | — | Facebook page access token |
| `CORS_ORIGINS` | ❌ | `http://localhost:5173,http://localhost:4173` | Comma-separated allowed origins |
| `CACHE_TTL_SECONDS` | ❌ | `60` | Seconds to cache first-page `/api/posts` results in memory |

## Project Structure

```
backend/
├── composer.json           # Composer manifest
├── composer.lock           # Locked dependency versions
├── index.php               # Thin entry point
├── .htaccess               # Apache mod_rewrite catch-all
├── .env.example            # Environment variable template
├── config/
│   ├── Configuration.php   # Application constants (sourced from .env)
│   └── init.php            # Bootstrap: autoload → Dotenv → CORS → Session → DB
├── db/
│   └── Database.php        # PDO singleton (mirrors bitress/phploginsystem)
└── Engine/
    ├── Cache.php           # TTL cache (APCu when available, file fallback)
    ├── Cors.php            # CORS header handling
    ├── FacebookService.php # Facebook Graph API client (Guzzle)
    ├── Router.php          # Request router (FastRoute)
    └── Session.php         # Secure session manager
```

## Composer Dependencies

| Package | Purpose |
|---------|---------|
| `vlucas/phpdotenv` | Loads `.env` files into `$_ENV` |
| `guzzlehttp/guzzle` | HTTP client for Facebook Graph API requests |
| `nikic/fast-route` | Lightweight request router |

## Architecture Highlights

- **OOP structure** – every concern lives in its own class; `index.php` is a
  4-line entry point.
- **Composer autoload** – classmap autoloading for `app/` classes; no manual
  `require` calls needed.
- **vlucas/phpdotenv** – safe `.env` loading; existing environment variables
  are never overwritten.
- **Guzzle HTTP client** – handles connection timeouts (504) and connectivity
  errors (503) with typed exceptions.
- **FastRoute dispatcher** – zero-overhead routing with proper 404/405
  responses.
- **In-memory TTL cache** – uses APCu when available, falls back to serialised
  temp files. First-page `/api/posts` responses are cached for
  `CACHE_TTL_SECONDS` seconds. Paginated requests (with `after`) bypass the cache.
- **CORS** – configurable via `CORS_ORIGINS`; handles `OPTIONS` preflight.


