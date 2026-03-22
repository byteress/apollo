<?php

declare(strict_types=1);

/**
 * Fetches posts from the Facebook Graph API.
 *
 * Depends on the FB_ACCESS_TOKEN, FB_GRAPH_BASE, and FB_POST_FIELDS constants
 * defined in config/Configuration.php.
 */
class FacebookService
{
    private HttpClient $http;

    public function __construct()
    {
        $this->http = new HttpClient(15, ['Authorization: Bearer ' . FB_ACCESS_TOKEN]);
    }

    /**
     * Retrieve a page of posts from the authenticated Facebook page.
     *
     * @return array{data: list<array<string, mixed>>, paging: array<string, mixed>|null}
     * @throws RuntimeException  Forwarded from HttpClient or on a non-2xx Graph API response.
     */
    public function getPosts(int $limit, ?string $after): array
    {
        $params = ['fields' => FB_POST_FIELDS, 'limit' => $limit];
        if ($after !== null) {
            $params['after'] = $after;
        }

        $result = $this->http->get(FB_GRAPH_BASE . '/me/posts', $params);

        /** @var array<string, mixed>|null $payload */
        $payload = json_decode($result['body'], true);

        if ($result['status'] < 200 || $result['status'] >= 300) {
            $message = (is_array($payload) ? ($payload['error']['message'] ?? null) : null)
                ?? 'Failed to fetch Facebook posts.';
            throw new RuntimeException($message, $result['status']);
        }

        return [
            'data'   => is_array($payload) ? ($payload['data']   ?? []) : [],
            'paging' => is_array($payload) ? ($payload['paging'] ?? null) : null,
        ];
    }
}
