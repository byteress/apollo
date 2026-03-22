<?php

declare(strict_types=1);

/**
 * Simple front-controller router.
 *
 * Resolves the request path/method to the appropriate handler method and
 * converts any RuntimeException into a JSON error response.
 */
class Router
{
    public function dispatch(): void
    {
        header('Content-Type: application/json');

        $path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        try {
            if ($path === '/api/posts' && $method === 'GET') {
                $this->handlePosts();
            } elseif ($path === '/health' && $method === 'GET') {
                echo json_encode(['status' => 'ok']);
            } else {
                http_response_code(404);
                echo json_encode(['detail' => 'Not Found']);
            }
        } catch (RuntimeException $e) {
            http_response_code($e->getCode() ?: 500);
            echo json_encode(['detail' => $e->getMessage()]);
        }
    }

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

    private function handlePosts(): void
    {
        if (FB_ACCESS_TOKEN === '') {
            throw new RuntimeException('FB_ACCESS_TOKEN is not configured on the server.', 500);
        }

        $limit = max(1, min(100, (int) ($_GET['limit'] ?? 10)));
        $after = (isset($_GET['after']) && $_GET['after'] !== '') ? (string) $_GET['after'] : null;

        // Serve from cache on first page
        $cacheKey = 'apollo_posts_' . $limit;
        if ($after === null && CACHE_TTL_SECONDS > 0) {
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                echo json_encode($cached);
                return;
            }
        }

        $service = new FacebookService();
        $result  = $service->getPosts($limit, $after);

        if ($after === null && CACHE_TTL_SECONDS > 0) {
            Cache::set($cacheKey, $result, CACHE_TTL_SECONDS);
        }

        echo json_encode($result);
    }
}
