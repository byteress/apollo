<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

/**
 * Authentication – placeholder class.
 *
 * Handles password hashing (Argon2id) and JWT issuance / verification.
 * All public methods that touch the database are stubbed and marked TODO
 * so they can be wired up once the schema is defined.
 *
 * Password hashing  → PHP built-in password_hash() with PASSWORD_ARGON2ID
 * Token format      → JWT (firebase/php-jwt), algorithm from JWT_ALGORITHM
 * Token lifetime    → JWT_TTL seconds (default 3600)
 *
 * Usage:
 *   // Hash a password before storing
 *   $hash = Auth::hashPassword($plaintext);
 *
 *   // Verify a login attempt
 *   if (Auth::verifyPassword($plaintext, $storedHash)) { ... }
 *
 *   // Issue a token after successful login
 *   $token = Auth::issueToken(['user_id' => 42, 'role' => 'admin']);
 *
 *   // Decode & validate an incoming token
 *   $payload = Auth::decodeToken($token);
 */
class Auth
{
    // -------------------------------------------------------------------------
    // Password helpers  (Argon2id)
    // -------------------------------------------------------------------------

    /**
     * Hash a plaintext password using Argon2id.
     */
    public static function hashPassword(string $plaintext): string
    {
        return password_hash($plaintext, PASSWORD_ARGON2ID);
    }

    /**
     * Verify a plaintext password against a stored Argon2id hash.
     */
    public static function verifyPassword(string $plaintext, string $hash): bool
    {
        return password_verify($plaintext, $hash);
    }

    /**
     * Return true if the stored hash needs to be rehashed
     * (e.g. after a cost-factor change).
     */
    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_ARGON2ID);
    }

    // -------------------------------------------------------------------------
    // JWT helpers
    // -------------------------------------------------------------------------

    /**
     * Issue a signed JWT for the given payload claims.
     *
     * Standard claims (iat, exp) are added automatically.
     *
     * @param  array<string, mixed> $claims  Application-specific claims.
     * @throws RuntimeException  If JWT_SECRET is not configured.
     */
    public static function issueToken(array $claims): string
    {
        if (JWT_SECRET === '') {
            throw new RuntimeException('JWT_SECRET is not configured on the server.', 500);
        }

        $now     = time();
        $payload = array_merge($claims, [
            'iat' => $now,
            'exp' => $now + JWT_TTL,
        ]);

        return JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);
    }

    /**
     * Decode and verify a JWT, returning its payload as an associative array.
     *
     * @return array<string, mixed>
     * @throws RuntimeException  On invalid / expired tokens or missing secret.
     */
    public static function decodeToken(string $token): array
    {
        if (JWT_SECRET === '') {
            throw new RuntimeException('JWT_SECRET is not configured on the server.', 500);
        }

        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGORITHM));
            return (array) $decoded;
        } catch (ExpiredException $e) {
            throw new RuntimeException('Token has expired.', 401, $e);
        } catch (SignatureInvalidException $e) {
            throw new RuntimeException('Token signature is invalid.', 401, $e);
        } catch (\Exception $e) {
            throw new RuntimeException('Invalid token: ' . $e->getMessage(), 401, $e);
        }
    }

    /**
     * Extract the Bearer token from the Authorization header, or return null.
     */
    public static function tokenFromHeader(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($header, 'Bearer ')) {
            return substr($header, 7);
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // TODO: Database stubs – wire up once the schema is defined
    // -------------------------------------------------------------------------

    /**
     * TODO: Look up a user by identifier (email / username), verify the
     * password, and return a signed JWT on success.
     *
     * @param  array<string, mixed> $credentials  e.g. ['email'=>'...', 'password'=>'...']
     * @throws RuntimeException  On invalid credentials or DB errors.
     */
    public static function login(array $credentials): string
    {
        // TODO: query the users table, call verifyPassword(), call issueToken()
        throw new RuntimeException('Auth::login() is not yet implemented.', 501);
    }

    /**
     * TODO: Create a new user record with a hashed password.
     *
     * @param  array<string, mixed> $data  Registration fields.
     * @throws RuntimeException  On validation failure or DB errors.
     */
    public static function register(array $data): void
    {
        // TODO: validate $data, call hashPassword(), insert into users table
        throw new RuntimeException('Auth::register() is not yet implemented.', 501);
    }

    /**
     * TODO: Invalidate the given token (e.g. add to a token-blocklist table).
     */
    public static function logout(string $token): void
    {
        // TODO: persist token to blocklist until its exp timestamp
        throw new RuntimeException('Auth::logout() is not yet implemented.', 501);
    }

    /**
     * TODO: Return the authenticated user's payload from the current request,
     * throwing if no valid token is present.
     *
     * @return array<string, mixed>
     * @throws RuntimeException  401 if no valid Bearer token is found.
     */
    public static function user(): array
    {
        $token = self::tokenFromHeader()
            ?? throw new RuntimeException('Unauthenticated.', 401);

        return self::decodeToken($token);
    }
}
