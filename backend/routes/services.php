<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../models/ServiceModel.php';
require_once __DIR__ . '/../controllers/ServiceController.php';
require_method('GET');
(new ServiceController(new ServiceModel(database())))->listPublic();
