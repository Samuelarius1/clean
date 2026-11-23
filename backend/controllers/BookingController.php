<?php
declare(strict_types=1);

final class BookingController
{
    public function __construct(private BookingModel $bookings)
    {
    }

    public function submit(array $data): string
    {
        return $this->bookings->create($data);
    }

    public function lookup(string $reference, string $email): ?array
    {
        return $this->bookings->findForCustomerLookup($reference, $email);
    }
}
