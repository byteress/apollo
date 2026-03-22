<?php

declare(strict_types=1);

/**
 * Handles Cross-Origin Resource Sharing (CORS) headers.
 *
 * Allowed origins are read from the CORS_ORIGINS constant defined in
 * config/Configuration.php.
 */
class Cors
{
    /**
     * Emit CORS headers and terminate on OPTIONS preflight requests.
     */
    public static function apply(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, CORS_ORIGINS, true)) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Vary: Origin');
        }

        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: *');
        header('Access-Control-Allow-Credentials: true');

        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
