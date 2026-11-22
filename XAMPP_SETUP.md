# Faith’s Walk CleanPro — XAMPP setup

This project uses a Vite/React frontend and a separate PHP/MySQL JSON API. **The frontend preview does not include a PHP runtime or a live MySQL database.** Run these backend checks in XAMPP before using the application with real customer data.

## 1. Requirements

- XAMPP with Apache 2.4, MySQL/MariaDB, PHP 8.1+ and the `pdo_mysql` and `fileinfo` extensions enabled.
- Node.js 20+ and pnpm 10+ for local frontend development.
- Apache `.htaccess` overrides enabled (`AllowOverride All`) so the API, database-folder and upload protections apply.

## 2. Put the project under XAMPP

Copy the project to `C:\xampp\htdocs\faith-cleanpro`. The API will then be available at `http://localhost/faith-cleanpro/backend`.

Copy `backend/config/local.example.php` to `backend/config/local.php`. Edit **only the untracked local copy** with your XAMPP database credentials and a unique application secret of at least 32 random characters. `local.php` is ignored by Git and is denied by Apache. Never add database credentials or the real application secret to a committed file. For a deployed environment, inject these values as server environment variables and set `APP_ENV` to `production`; production requires explicit database values.

The example uses the standard local XAMPP `root` account with an empty password. Keep that only for a private local installation. Create a least-privilege MySQL account and a strong password for any server accessible to others.

## 3. Create and populate the database

In phpMyAdmin, create a database named `faith_cleanpro` with `utf8mb4_unicode_ci`. Import the SQL files in this order:

1. `database/migrations/001_core.sql`
2. `database/migrations/002_content.sql`
3. `database/migrations/003_visit_analytics.sql`
4. `database/seeds/001_services.sql`
5. `database/seeds/002_faqs.sql`
6. `database/seeds/003_public_settings.sql`

The service and FAQ seed files intentionally add no sample records. Add the business’s actual services and answers in the owner dashboard before publishing. Public email, phone, physical address and social URLs are also blank rather than invented; add verified details in **Settings**. Only publish customer photos or testimonials after receiving permission.

## 4. Create the sole owner account

The only administrator identity accepted by the API is `samuelarius437@gmail.com`. Public admin registration is not available. The bootstrap script requires a new password with at least 12 characters and stores only a `password_hash()` value; login checks it with `password_verify()` and throttles failed attempts.

From PowerShell in the project directory, set a one-time password without writing it to a source file or shell command history:

```powershell
$secure = Read-Host -AsSecureString "Create a unique owner password (12+ characters)"
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$env:CLEANPRO_INITIAL_ADMIN_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
try {
  & "C:\xampp\php\php.exe" ".\database\seeds\bootstrap_admin.php"
} finally {
  Remove-Item Env:CLEANPRO_INITIAL_ADMIN_PASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
}
```

Choose a unique password; the previously requested `12345678` is rejected because it is too weak. The bootstrap script refuses to create or replace an administrator if an owner account already exists. There is intentionally no public password-reset endpoint; use a private, verified owner recovery procedure instead of weakening account security.

## 5. Connect the React frontend

Copy `.env.example` to `.env.local` and set the API URL for your installation:

```dotenv
VITE_API_URL=http://localhost/faith-cleanpro/backend
```

From a terminal in the project directory:

```bash
pnpm install
pnpm dev
```

The local Vite origin `http://localhost:5173` is allowed by default. To use a different local or production frontend, add its exact origin to `CLEANPRO_ALLOWED_ORIGINS` in the ignored `backend/config/local.php` (comma-separated, no wildcard). The API allows credentialed requests only from configured origins. Keep the browser frontend and API on the same HTTPS site in production so the `HttpOnly`, `SameSite=Strict` session cookies work reliably.

## 6. Smoke-test in XAMPP

- Open `http://localhost/faith-cleanpro/backend/routes/services.php`; verify it returns a successful JSON response (the initial catalogue is intentionally empty).
- Add the business’s verified services from the owner dashboard, then confirm the public service list loads those records from PHP/MySQL.
- Create the owner account, sign in at `/admin/login`, then update public contact settings, review a booking, and check `/admin/manage` pages.
- Submit a test booking using a test email. Its reference is shown once on the confirmation page; `/tracking` verifies the reference plus that email. Registering/signing in before booking also associates it with the customer’s private account history.
- Upload test JPEG/PNG/WebP images smaller than 5 MB; uploads reject SVG, executable files, oversize images and oversized dimensions.
- Grant analytics consent and visit a public page. The dashboard aggregates daily page views and rotating, keyed daily visitor hashes. It never stores the raw visitor IP, full user-agent, query string, or form contents, and removes visit records older than 90 days during collection.

## 7. Operational limits and production notes

- Booking requests and contact messages are saved to MySQL, but SMTP/email notifications and online payments are not configured. A quote is not revenue; the dashboard does not report revenue.
- Customer accounts use hashed passwords, `HttpOnly`/`SameSite=Strict` sessions and per-customer booking queries. The owner-only API uses a separate protected session and CSRF tokens for writes. Keep HTTPS enabled in production.
- Database migrations and uploaded files contain business/customer data. Keep them outside public web access where possible; maintain encrypted backups and an explicit retention/deletion process for customer records.
- For a public deployment, host the PHP API on an HTTPS PHP host, set `APP_ENV=production`, configure `DB_*`, `CLEANPRO_APP_SECRET`, the exact allowed frontend origin and `CLEANPRO_PUBLIC_API_URL` as server variables, then set the frontend’s build-time `VITE_API_URL` to that API. Vercel can serve the Vite frontend, but it does **not** execute these PHP route files from the static Vite build.
- PHP/MySQL could not be executed in this workspace because PHP and a database server are not installed here. The PHP routes and SQL need the XAMPP smoke test above before production use.
