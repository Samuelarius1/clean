<?php
declare(strict_types=1);

final class ServiceModel
{
    public function __construct(private PDO $pdo)
    {
    }

    public function publishedCatalog(): array
    {
        $statement = $this->pdo->query('SELECT id, name, slug, category, summary, description, features_json, price_from, image_url, is_featured AS featured FROM services WHERE is_published = 1 ORDER BY display_order, id');
        $services = $statement->fetchAll();
        foreach ($services as &$service) {
            $features = json_decode((string) ($service['features_json'] ?? '[]'), true);
            $service['features'] = is_array($features) ? array_values(array_filter($features, 'is_string')) : [];
            unset($service['features_json']);
        }
        unset($service);
        return $services;
    }

    public function isPublic(int $id): bool
    {
        $statement = $this->pdo->prepare('SELECT id FROM services WHERE id = :id AND is_published = 1 LIMIT 1');
        $statement->execute(['id' => $id]);
        return (bool) $statement->fetchColumn();
    }
}
