<?php
declare(strict_types=1);

final class BookingModel
{
    public function __construct(private PDO $pdo)
    {
    }

    public function create(array $data): string
    {
        $reference = 'FW-' . strtoupper(bin2hex(random_bytes(5)));
        $statement = $this->pdo->prepare('INSERT INTO bookings (reference, customer_id, service_id, customer_name, customer_email, customer_phone, service_address, preferred_date, preferred_time, notes) VALUES (:reference, :customer_id, :service_id, :name, :email, :phone, :address, :preferred_date, :preferred_time, :notes)');
        $statement->execute([
            'reference' => $reference,
            'customer_id' => $data['customer_id'],
            'service_id' => $data['service_id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'preferred_date' => $data['preferred_date'],
            'preferred_time' => $data['preferred_time'],
            'notes' => $data['notes'],
        ]);
        return $reference;
    }

    public function findForCustomerLookup(string $reference, string $email): ?array
    {
        $statement = $this->pdo->prepare('SELECT b.reference, b.preferred_date, b.preferred_time, b.status, b.quoted_amount, b.created_at, s.name AS service_name FROM bookings b INNER JOIN services s ON s.id = b.service_id WHERE b.reference = :reference AND b.customer_email = :email LIMIT 1');
        $statement->execute(['reference' => $reference, 'email' => $email]);
        $result = $statement->fetch();
        return $result ?: null;
    }
}
