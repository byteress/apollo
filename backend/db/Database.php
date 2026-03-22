<?php

declare(strict_types=1);

/**
 * PDO database connection – singleton.
 *
 * Mirrors the pattern used in bitress/phploginsystem (db/Database.php).
 * Connection credentials are read from the constants defined in
 * config/Configuration.php (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS,
 * DB_CHARSET).
 *
 * Usage:
 *   $db = Database::getInstance();
 *   $stmt = $db->prepare('SELECT * FROM posts WHERE id = :id');
 *   $stmt->execute([':id' => $id]);
 */
class Database extends PDO
{
    private static ?self $_instance = null;

    public function __construct(
        string $host,
        int    $port,
        string $name,
        string $user,
        string $pass,
        string $charset
    ) {
        $dsn = "mysql:host={$host};port={$port};dbname={$name};charset={$charset}";

        try {
            parent::__construct($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            throw new RuntimeException('Database connection failed: ' . $e->getMessage(), 500, $e);
        }
    }

    private function __clone() {}

    public static function getInstance(): static
    {
        if (self::$_instance === null) {
            self::$_instance = new self(
                DB_HOST,
                DB_PORT,
                DB_NAME,
                DB_USER,
                DB_PASS,
                DB_CHARSET
            );
        }

        return self::$_instance;
    }
}
