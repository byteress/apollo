<?php

declare(strict_types=1);

/**
 * Simple TTL cache.
 *
 * Uses APCu when the extension is available; falls back to serialised files
 * in the system temp directory.
 */
class Cache
{
    /**
     * Retrieve a cached value, or null if the key is missing / expired.
     *
     * @return array<string, mixed>|null
     */
    public static function get(string $key): ?array
    {
        if (function_exists('apcu_fetch')) {
            /** @var array<string, mixed>|false $val */
            $val = apcu_fetch($key, $success);
            return ($success && is_array($val)) ? $val : null;
        }

        $file = self::filePath($key);
        if (!file_exists($file)) {
            return null;
        }

        $raw = file_get_contents($file);
        if ($raw === false) {
            return null;
        }

        /** @var array{expires: int, data: array<string, mixed>}|false $entry */
        $entry = unserialize($raw);
        if (!is_array($entry) || time() > $entry['expires']) {
            @unlink($file);
            return null;
        }

        return $entry['data'];
    }

    /**
     * Store a value in the cache for $ttl seconds.
     *
     * @param array<string, mixed> $data
     */
    public static function set(string $key, array $data, int $ttl): void
    {
        if (function_exists('apcu_store')) {
            apcu_store($key, $data, $ttl);
            return;
        }

        file_put_contents(
            self::filePath($key),
            serialize(['expires' => time() + $ttl, 'data' => $data]),
            LOCK_EX
        );
    }

    private static function filePath(string $key): string
    {
        return sys_get_temp_dir() . '/apollo_' . md5($key) . '.cache';
    }
}
