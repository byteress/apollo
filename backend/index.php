<?php

declare(strict_types=1);

// ---------------------------------------------------------------------------
// .env loader (no external dependencies required)
// ---------------------------------------------------------------------------

function loadEnv(string $path): void
{
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);
        // Strip surrounding single or double quotes
        if (preg_match('/^([\'"])(.*)\1$/', $value, $m)) {
            $value = $m[2];
        }
        if (!array_key_exists($key, $_ENV)) {
            $_ENV[$key] = $value;
            putenv("{$key}={$value}");
        }
    }
}

loadEnv(__DIR__ . '/.env');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const FB_GRAPH_BASE  = 'https://graph.facebook.com/v25.0';
const FB_POST_FIELDS = 'id,message,created_time,full_picture,'
    . 'attachments{description,media,url,subattachments},'
    . 'likes.summary(true).limit(0),'
    . 'comments.summary(true).limit(0),'
    . 'shares';

$cacheTtl     = (int)($_ENV['CACHE_TTL_SECONDS'] ?? 60);
$rawOrigins   = $_ENV['CORS_ORIGINS'] ?? 'http://localhost:5173,http://localhost:4173';
$allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $rawOrigins))));

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

header('Content-Type: application/json');

$path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($path === '/api/posts' && $method === 'GET') {
    handlePosts($cacheTtl);
} elseif ($path === '/health' && $method === 'GET') {
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(404);
    echo json_encode(['detail' => 'Not Found']);
}

// ---------------------------------------------------------------------------
// Handler: GET /api/posts
// ---------------------------------------------------------------------------

function handlePosts(int $cacheTtl): void
{
    $accessToken = $_ENV['FB_ACCESS_TOKEN'] ?? '';
    if ($accessToken === '') {
        http_response_code(500);
        echo json_encode(['detail' => 'FB_ACCESS_TOKEN is not configured on the server.']);
        return;
    }

    // Validate & clamp `limit`
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $limit = max(1, min(100, $limit));

    $after = isset($_GET['after']) && $_GET['after'] !== '' ? (string)$_GET['after'] : null;

    // Serve from cache on first page
    $cacheKey = 'apollo_posts_' . $limit;
    if ($after === null && $cacheTtl > 0) {
        $cached = cacheGet($cacheKey);
        if ($cached !== null) {
            echo json_encode($cached);
            return;
        }
    }

    // Build request to Facebook Graph API
    $queryParams = ['fields' => FB_POST_FIELDS, 'limit' => $limit];
    if ($after !== null) {
        $queryParams['after'] = $after;
    }

    $url = FB_GRAPH_BASE . '/me/posts?' . http_build_query($queryParams);

    $ch = curl_init($url);
    if ($ch === false) {
        http_response_code(503);
        echo json_encode(['detail' => 'Could not initialise HTTP client.']);
        return;
    }

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$accessToken}"],
    ]);

    $body    = curl_exec($ch);
    $errno   = curl_errno($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body === false || $errno !== 0) {
        if ($errno === CURLE_OPERATION_TIMEDOUT) {
            http_response_code(504);
            echo json_encode(['detail' => 'Request to the Facebook API timed out. Please try again.']);
        } else {
            http_response_code(503);
            echo json_encode(['detail' => 'Could not reach the Facebook API. Please try again later.']);
        }
        return;
    }

    /** @var array<string,mixed>|null $payload */
    $payload = json_decode((string)$body, true);

    if ($httpCode < 200 || $httpCode >= 300) {
        $fbMessage = (is_array($payload) ? ($payload['error']['message'] ?? null) : null)
            ?? 'Failed to fetch Facebook posts.';
        http_response_code($httpCode);
        echo json_encode(['detail' => $fbMessage]);
        return;
    }

    $data   = is_array($payload) ? ($payload['data']   ?? []) : [];
    $paging = is_array($payload) ? ($payload['paging'] ?? null) : null;

    $result = ['data' => $data, 'paging' => $paging];

    if ($after === null && $cacheTtl > 0) {
        cacheSet($cacheKey, $result, $cacheTtl);
    }

    echo json_encode($result);
}

// ---------------------------------------------------------------------------
// TTL cache helpers  (APCu when available, file-based fallback)
// ---------------------------------------------------------------------------

/**
 * @return array<string,mixed>|null
 */
function cacheGet(string $key): ?array
{
    if (function_exists('apcu_fetch')) {
        /** @var array<string,mixed>|false $val */
        $val = apcu_fetch($key, $success);
        return ($success && is_array($val)) ? $val : null;
    }

    $file = cacheFile($key);
    if (!file_exists($file)) {
        return null;
    }
    $raw = file_get_contents($file);
    if ($raw === false) {
        return null;
    }
    /** @var array{expires:int,data:array<string,mixed>}|false $entry */
    $entry = unserialize($raw);
    if (!is_array($entry) || time() > $entry['expires']) {
        @unlink($file);
        return null;
    }
    return $entry['data'];
}

/**
 * @param array<string,mixed> $data
 */
function cacheSet(string $key, array $data, int $ttl): void
{
    if (function_exists('apcu_store')) {
        apcu_store($key, $data, $ttl);
        return;
    }

    $file = cacheFile($key);
    file_put_contents($file, serialize(['expires' => time() + $ttl, 'data' => $data]), LOCK_EX);
}

function cacheFile(string $key): string
{
    return sys_get_temp_dir() . '/apollo_' . md5($key) . '.cache';
}
