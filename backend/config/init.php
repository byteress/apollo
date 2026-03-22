<?php

declare(strict_types=1);

// ---------------------------------------------------------------------------
// 1. Autoloader – resolves class names to files inside app/
// ---------------------------------------------------------------------------

spl_autoload_register(function (string $class): void {
    $file = __DIR__ . '/../app/' . $class . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// ---------------------------------------------------------------------------
// 2. Load .env into $_ENV (triggers autoload of EnvLoader)
// ---------------------------------------------------------------------------

EnvLoader::load(__DIR__ . '/../.env');

// ---------------------------------------------------------------------------
// 3. Define application constants from the loaded environment
// ---------------------------------------------------------------------------

require_once __DIR__ . '/Configuration.php';

// ---------------------------------------------------------------------------
// 4. Apply CORS headers and handle OPTIONS preflight (triggers autoload of Cors)
// ---------------------------------------------------------------------------

Cors::apply();
