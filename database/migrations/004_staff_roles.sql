ALTER TABLE admin_users
  ADD COLUMN role ENUM('admin', 'manager') NOT NULL DEFAULT 'manager' AFTER display_name,
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER role;

UPDATE admin_users
SET role = 'admin'
WHERE email = 'samuelarius437@gmail.com';

