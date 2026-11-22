# Admin and visit analytics setup

## Create the sole permitted administrator

The API login allowlist is restricted to `samuelarius437@gmail.com` through the backend `ADMIN_EMAIL` setting. Keep that value private to the server configuration; never place admin credentials in frontend code or commit environment files.

Do not use the password `12345678` or any reused/short password. The admin creation script now requires a unique password of at least 16 characters and stores only PHP's `password_hash(..., PASSWORD_DEFAULT)` output. It does not write the plaintext password to the database or source code.

1. Configure the PHP backend environment and MySQL connection using `backend/.env.example` as a reference. Set `ADMIN_EMAIL=samuelarius437@gmail.com`.
2. For a new database, import `backend/database/schema.sql`. For an existing installation, apply the migrations in order; apply `backend/database/migrations/003_visit_analytics.sql` after the earlier platform migration.
3. From the project root, run `php backend/scripts/create-admin.php` in a trusted local PHP/XAMPP terminal. Enter the administrator name and a newly generated, unique password when prompted. The script exits if the allowlisted account already exists; it does not reset existing credentials.
4. Open `/admin` and sign in using that email and the password you just created. If the account already exists and its password needs changing, use a trusted, server-side password reset procedure; do not put a password in chat, source code, or SQL as plaintext.

## Visit analytics

Public page views are sent to the PHP API and stored in MySQL. The admin dashboard's **Analytics** tab shows page views, approximate unique browser sessions, daily counts, popular pages, and referring hostnames for 7, 30, or 90 days. Admin and account routes are excluded. A random session identifier is held only in browser `sessionStorage`; the database stores its SHA-256 hash, a normalized page path, coarse device category, and referrer hostname—not raw IP addresses, complete referrer URLs, or user-agent strings.

For existing databases, apply `backend/database/migrations/003_visit_analytics.sql` before relying on the dashboard. Analytics will remain empty until public pages receive visits. The dashboard data endpoint requires an authenticated admin session and CSRF token.
