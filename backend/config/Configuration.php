<?php

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Application constants – sourced from environment variables loaded by
// EnvLoader before this file is included.
// ---------------------------------------------------------------------------

define('FB_GRAPH_BASE', 'https://graph.facebook.com/v25.0');

define(
    'FB_POST_FIELDS',
    'id,message,created_time,full_picture,'
    . 'attachments{description,media,url,subattachments},'
    . 'likes.summary(true).limit(0),'
    . 'comments.summary(true).limit(0),'
    . 'shares'
);

define('FB_ACCESS_TOKEN', $_ENV['FB_ACCESS_TOKEN'] ?? '');

define('CACHE_TTL_SECONDS', (int)($_ENV['CACHE_TTL_SECONDS'] ?? 60));

define(
    'CORS_ORIGINS',
    array_values(
        array_filter(
            array_map('trim', explode(',', $_ENV['CORS_ORIGINS'] ?? 'http://localhost:5173,http://localhost:4173'))
        )
    )
);

// ---------------------------------------------------------------------------
// Database constants
// ---------------------------------------------------------------------------

define('DB_HOST',    $_ENV['DB_HOST']     ?? 'localhost');
define('DB_PORT',    (int)($_ENV['DB_PORT'] ?? 3306));
define('DB_NAME',    $_ENV['DB_NAME']     ?? '');
define('DB_USER',    $_ENV['DB_USER']     ?? 'root');
define('DB_PASS',    $_ENV['DB_PASS']     ?? '');
define('DB_CHARSET', $_ENV['DB_CHARSET']  ?? 'utf8mb4');

// ---------------------------------------------------------------------------
// JWT constants
// ---------------------------------------------------------------------------

define('JWT_SECRET',     $_ENV['JWT_SECRET']      ?? '');
define('JWT_ALGORITHM',  $_ENV['JWT_ALGORITHM']   ?? 'HS256');
define('JWT_TTL',        (int)($_ENV['JWT_TTL']   ?? 3600));   // seconds
