# Faith’s Walk CleanPro

A React + TypeScript + Vite public website with a PHP REST API and MySQL persistence. The API is the source of service listings, bookings, contact submissions and admin dashboard records; the frontend does not generate database success states or sample records.

## Requirements

- Node.js 20+ and pnpm (or npm)
- XAMPP with Apache, PHP 8.1+ and MySQL/MariaDB
- PHP extensions: `pdo_mysql`, `mbstring`

## Frontend setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Vite runs at `http://localhost:5173`. The central API client reads `VITE_API_BASE_URL` (default `http://localhost/faiths-CleanPro/backend/public/api`). Set this to the actual URL of the API directory under your XAMPP `htdocs` folder. For a different frontend origin, update the backend `FRONTEND_ORIGIN` to exactly match it.

## XAMPP and database setup

1. Copy or clone this repository into `C:\xampp\htdocs\faiths-CleanPro` (Windows) or the equivalent XAMPP `htdocs` directory.
2. Start Apache and MySQL from the XAMPP control panel. Enable `mod_rewrite` and allow `.htaccess` overrides for the API directory.
3. In phpMyAdmin or the MySQL client, import `backend/database/schema.sql`. It creates the `faiths_cleanpro` database and empty application tables. No demonstration services or customers are inserted.
4. Copy `backend/.env.example` to `backend/.env`, then set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `FRONTEND_ORIGIN`, and `ADMIN_EMAIL`. Keep this file private and out of version control. For local XAMPP, the default database user is often `root` with an empty password; configure a password for production.
5. Make `backend/uploads` writable by the web server only if you later enable file uploads. The current API intentionally does not accept uploads.
6. Ensure the API responds at `http://localhost/faiths-CleanPro/backend/public/api/services`. With an empty database it returns an empty list, which the website presents as an honest empty state.

SQL commands if importing manually:

```sql
CREATE DATABASE faiths_cleanpro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then select that database and execute `backend/database/schema.sql` (the schema also safely creates/selects the database).

## Initial admin account

Only `samuelarius437@gmail.com` is allowed to authenticate. The PHP API verifies this on the server and also checks the active `admin_users` row and password hash. Create the account once from a trusted terminal in the repository root:

```bash
php backend/scripts/create-admin.php
```

The script prompts for a display name and a new password (12 characters minimum), hashes it with PHP `password_hash`, and does not print or store the plaintext password. The requested `12345678` password is deliberately not accepted because it is short and guessable; set a unique, longer password instead. Do not expose the setup script through a web route. There is no public registration route.

Admin sessions use HTTP-only, SameSite=Strict cookies, idle expiration, session ID rotation at login, CSRF checks on authenticated requests and a server-side email allowlist. Use HTTPS in production so session cookies are secure.

## API

All responses use `{ "success": boolean, "message": string, "data": any }`.

- `GET /services` and `GET /services/{slug}` — active service catalogue and details
- `POST /bookings` — validate and persist a booking request
- `POST /contact` — validate and persist a contact request
- `POST /admin/login` — allowlisted admin login
- `GET /admin/dashboard` — authenticated counts and recent bookings; requires session cookie and `X-CSRF-Token`
- `GET /admin/services`, `POST /admin/services`, `PATCH /admin/services/{id}` — administer service visibility and add services
- `PATCH /admin/bookings/{id}/status` — update booking workflow status
- `GET /admin/messages`, `PATCH /admin/messages/{id}/status` — review and update incoming messages
- `POST /admin/logout` — authenticated logout; requires `X-CSRF-Token`

All database access uses PDO prepared statements. Configure Apache so the `.htaccess` file is honored. Never expose PHP error details to API clients; server-side errors go to the PHP error log.

## Implementation scope and production checklist

The public site includes responsive Home, About, Services, Service detail, Booking, Contact and admin routes. Service listings/details, booking requests, contact messages, admin metrics, service creation/visibility and booking/message status updates use the PHP API and MySQL. Empty database tables are shown as empty states; no customer, booking, service, testimonial or performance figures are seeded as examples.

The supplied specification also requests a customer account system, booking availability and reference lookup, gallery and testimonial management, editable business content, FAQs, CSV/report exports, image uploads and related admin modules. These are not represented as working features in this build and must be completed before calling the entire requested platform production-ready. PHP/XAMPP is not installed in the v0 workspace, so run the backend under XAMPP and validate `backend/database/schema.sql`, API routes and admin flows there before deployment. Configure HTTPS, server-side rate limiting, backups, mail delivery and production database credentials before handling real customer data.

The existing repository may contain prior experimental files; the Vite entry point is `src/main.tsx` and the PHP application is isolated under `backend/`.
