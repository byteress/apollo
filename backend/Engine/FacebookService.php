<?php

declare(strict_types=1);

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;

/**
 * Fetches posts from the Facebook Graph API using Guzzle.
 *
 * Depends on the FB_ACCESS_TOKEN, FB_GRAPH_BASE, and FB_POST_FIELDS constants
 * defined in config/Configuration.php.
 */
class FacebookService
{
    private Client $http;

    public function __construct()
    {
        $this->http = new Client([
            'timeout' => 15,
            'headers' => ['Authorization' => 'Bearer ' . FB_ACCESS_TOKEN],
        ]);
    }

    /**
     * Retrieve a page of posts from the authenticated Facebook page.
     *
     * @return array{data: list<array<string, mixed>>, paging: array<string, mixed>|null}
     * @throws RuntimeException  On network failure or a non-2xx Graph API response.
     */
    public function getPosts(int $limit, ?string $after): array
    {
        $params = ['fields' => FB_POST_FIELDS, 'limit' => $limit];
        if ($after !== null) {
            $params['after'] = $after;
        }

        try {
            $response = $this->http->get(FB_GRAPH_BASE . '/me/posts', [
                'query'       => $params,
                'http_errors' => false,
            ]);
        } catch (ConnectException $e) {
            $isTimeout = str_contains(strtolower($e->getMessage()), 'timed out')
                || str_contains(strtolower($e->getMessage()), 'timeout');
            if ($isTimeout) {
                throw new RuntimeException(
                    'Request to the Facebook API timed out. Please try again.',
                    504
                );
            }
            throw new RuntimeException(
                'Could not reach the Facebook API. Please try again later.',
                503
            );
        }

        $statusCode = $response->getStatusCode();

        /** @var array<string, mixed>|null $payload */
        $payload = json_decode((string) $response->getBody(), true);

        if ($statusCode < 200 || $statusCode >= 300) {
            $message = (is_array($payload) ? ($payload['error']['message'] ?? null) : null)
                ?? 'Failed to fetch Facebook posts.';
            throw new RuntimeException($message, $statusCode);
        }

        return [
            'data'   => is_array($payload) ? ($payload['data']   ?? []) : [],
            'paging' => is_array($payload) ? ($payload['paging'] ?? null) : null,
        ];
    }
}
