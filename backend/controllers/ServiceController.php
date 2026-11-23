<?php
declare(strict_types=1);

final class ServiceController
{
    public function __construct(private ServiceModel $services)
    {
    }

    public function listPublic(): never
    {
        try {
            success($this->services->publishedCatalog());
        } catch (Throwable $error) {
            error_log('Public services query failed: ' . $error->getMessage());
            fail_request(503, 'Services are temporarily unavailable.');
        }
    }
}
