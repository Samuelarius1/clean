-- Apply once after schema.sql to extend an existing CleanPro database.
-- This migration is additive and does not seed customer, booking, testimonial, or business data.
USE faiths_cleanpro;

CREATE TABLE customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

ALTER TABLE bookings
  ADD COLUMN customer_id BIGINT UNSIGNED NULL AFTER id,
  ADD COLUMN preferred_time TIME NULL AFTER preferred_date,
  ADD COLUMN property_type VARCHAR(40) NULL AFTER address,
  ADD COLUMN price_quote DECIMAL(10,2) NULL AFTER property_type,
  ADD COLUMN reference_hash CHAR(64) NULL AFTER status,
  ADD COLUMN reference_created_at TIMESTAMP NULL,
  ADD CONSTRAINT fk_bookings_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  ADD UNIQUE KEY uq_bookings_reference_hash (reference_hash),
  ADD KEY idx_bookings_customer_created (customer_id, created_at);

ALTER TABLE bookings
  MODIFY COLUMN status ENUM('new','contacted','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'new';

CREATE TABLE service_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

ALTER TABLE services
  ADD COLUMN detailed_description TEXT NULL,
  ADD COLUMN image_path VARCHAR(255) NULL,
  ADD COLUMN category_id BIGINT UNSIGNED NULL,
  ADD COLUMN estimated_minutes SMALLINT UNSIGNED NULL,
  ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL;

CREATE TABLE service_packages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500) NULL,
  price DECIMAL(10,2) NOT NULL,
  estimated_minutes SMALLINT UNSIGNED NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_packages_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  KEY idx_packages_service (service_id, active)
) ENGINE=InnoDB;

CREATE TABLE availability_slots (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_id BIGINT UNSIGNED NULL,
  slot_date DATE NOT NULL,
  starts_at TIME NOT NULL,
  ends_at TIME NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_availability_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE KEY uq_availability_slot (service_id, slot_date, starts_at),
  KEY idx_availability_public (active, slot_date, starts_at)
) ENGINE=InnoDB;

CREATE TABLE booking_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  old_status VARCHAR(24) NULL,
  new_status VARCHAR(24) NOT NULL,
  changed_by_admin_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_status_history_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_status_history_admin FOREIGN KEY (changed_by_admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  KEY idx_status_history_booking (booking_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE gallery_images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description VARCHAR(500) NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(80) NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE testimonials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_testimonials_public (approved, published, created_at)
) ENGINE=InnoDB;

CREATE TABLE faqs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(300) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_faq_public (published, sort_order)
) ENGINE=InnoDB;

CREATE TABLE website_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reset_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  KEY idx_reset_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE api_rate_limits (
  bucket_key CHAR(64) PRIMARY KEY,
  window_started_at DATETIME NOT NULL,
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  KEY idx_rate_window (window_started_at)
) ENGINE=InnoDB;

CREATE TABLE admin_activity_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  KEY idx_activity_created (created_at)
) ENGINE=InnoDB;
