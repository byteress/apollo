<?php

declare(strict_types=1);

require_once __DIR__ . '/config/init.php';

$router = new Router();
$router->dispatch();
