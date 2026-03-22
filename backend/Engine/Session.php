<?php

declare(strict_types=1);

/**
 * Secure session manager.
 *
 * Mirrors the pattern used in bitress/phploginsystem (E/Session.php).
 *
 * Usage:
 *   Session::startSession();          // called once in init.php
 *   Session::set('user_id', 42);
 *   Session::get('user_id');          // → 42
 *   Session::has('user_id');          // → true
 *   Session::remove('user_id');
 *   Session::destroy();
 */
class Session extends SessionHandler
{
    private static ?self $_instance = null;

    private string $sessionName     = 'apollo_session';
    private int    $maxLifetime      = 1800;   // 30 minutes
    private bool   $secure           = true;
    private bool   $httpOnly         = true;
    private string $sameSite         = 'Strict';

    private function __construct()
    {
        session_name($this->sessionName);

        // PHP 7.3+ supports the array form which includes SameSite
        session_set_cookie_params([
            'lifetime' => $this->maxLifetime,
            'path'     => '/',
            'domain'   => '',
            'secure'   => $this->secure,
            'httponly' => $this->httpOnly,
            'samesite' => $this->sameSite,
        ]);

        ini_set('session.use_cookies',       '1');
        ini_set('session.use_only_cookies',  '1');
        ini_set('session.cookie_secure',     $this->secure   ? '1' : '0');
        ini_set('session.cookie_httponly',   $this->httpOnly ? '1' : '0');
        ini_set('session.gc_maxlifetime',    (string) $this->maxLifetime);

        session_start();

        // Rotate the session ID on every request to prevent fixation
        session_regenerate_id(true);
    }

    // -------------------------------------------------------------------------
    // Bootstrap
    // -------------------------------------------------------------------------

    public static function startSession(): void
    {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    public static function set(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    public static function get(string $key): mixed
    {
        return $_SESSION[$key] ?? null;
    }

    public static function has(string $key): bool
    {
        return isset($_SESSION[$key]);
    }

    public static function remove(string $key): void
    {
        unset($_SESSION[$key]);
    }

    public static function destroySession(): void
    {
        session_destroy();
    }
}
