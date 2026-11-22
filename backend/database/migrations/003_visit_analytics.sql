-- Add privacy-conscious first-party visit analytics to existing databases.
USE faiths_cleanpro;

CREATE TABLE IF NOT EXISTS visit_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  visitor_hash CHAR(64) NOT NULL,
  page_path VARCHAR(240) NOT NULL,
  referrer_host VARCHAR(190) NULL,
  device_type ENUM('mobile','tablet','desktop','unknown') NOT NULL DEFAULT 'unknown',
  visited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_visit_events_date (visited_at),
  KEY idx_visit_events_visitor_date (visitor_hash, visited_at),
  KEY idx_visit_events_path_date (page_path, visited_at)
) ENGINE=InnoDB;
