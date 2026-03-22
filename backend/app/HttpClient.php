<?php

declare(strict_types=1);

/**
 * Thin cURL wrapper for outbound HTTP GET requests.
 */
class HttpClient
{
    private int $timeout;

    /** @var string[] */
    private array $defaultHeaders;

    /**
     * @param string[] $defaultHeaders  Raw header strings, e.g. ["Authorization: Bearer token"]
     */
    public function __construct(int $timeout = 15, array $defaultHeaders = [])
    {
        $this->timeout        = $timeout;
        $this->defaultHeaders = $defaultHeaders;
    }

    /**
     * Perform a GET request and return the response body and HTTP status code.
     *
     * @param  array<string, mixed> $params  Query-string parameters to append.
     * @return array{body: string, status: int}
     * @throws RuntimeException  On connection failure or timeout.
     */
    public function get(string $url, array $params = []): array
    {
        if ($params !== []) {
            $url .= '?' . http_build_query($params);
        }

        $ch = curl_init($url);
        if ($ch === false) {
            throw new RuntimeException('Could not initialise HTTP client.', 503);
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $this->timeout,
            CURLOPT_HTTPHEADER     => $this->defaultHeaders,
        ]);

        $body   = curl_exec($ch);
        $errno  = curl_errno($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($body === false || $errno !== 0) {
            if ($errno === CURLE_OPERATION_TIMEDOUT) {
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

        return ['body' => (string) $body, 'status' => $status];
    }
}
