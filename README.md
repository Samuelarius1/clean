# Faith’s Walk CleanPro

A responsive React + TypeScript + Vite website with a PHP REST API and MySQL persistence, designed for local development with XAMPP. The service catalogue, enquiries, bookings, FAQs, business contact settings, customer accounts, consent-based analytics and owner dashboard are connected to the PHP API. The initial database contains no invented services, FAQs, contact details or customer records; the preview itself does not run PHP/MySQL.

## Stack

- React 18, TypeScript, Vite and React Router
- Material UI theme/CSS baseline, Framer Motion, Lucide, SWR and Recharts
- PHP 8.1+ JSON API with PDO prepared statements and MySQL/MariaDB
- XAMPP local API, with ordered SQL migrations and minimal brand settings; no sample services or customer content

## Project layout

```text
src/                     React routes, components, hooks, API services and styles
backend/config/           API bootstrap and ignored local configuration
backend/controllers/      Reserved controller layer for expanded API modules
backend/middleware/       Owner/customer session and CSRF guards
backend/routes/           Public, customer and owner JSON endpoints
backend/models/            Database-backed service models
backend/uploads/           Validated JPEG, PNG and WebP uploads
 database/migrations/      Ordered MySQL schema
database/seeds/            Minimal business settings; no sample services or FAQs
```

Some original root-level prototype components are retained for reference; the active Vite entry is `src/main.tsx` and the production app uses `src/`.

## Quick start

1. Complete the database, local configuration and owner-bootstrap steps in [XAMPP_SETUP.md](./XAMPP_SETUP.md).
2. Copy `.env.example` to `.env.local` and set the local PHP API URL.
3. Install frontend packages and start the Vite dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Build the frontend with `pnpm build`.

## Security and privacy

- The sole admin identity is fixed server-side to `samuelarius437@gmail.com`; public admin registration is disabled. The bootstrap script requires a strong password (12+ characters), hashes it using `password_hash()`, and never stores a plaintext password.
- Customer and owner sessions use separate `HttpOnly`, `SameSite=Strict` cookies. Authenticated writes require a session CSRF token; PDO queries are parameterized and customer booking queries are scoped by the signed-in customer ID.
- Analytics are opt-in. The API stores a daily HMAC visitor hash and public page path, not a raw IP address or form contents, and prunes events older than 90 days.
- Never commit `backend/config/local.php`, `.env.local`, database credentials, the application secret, customer exports, or uploaded customer images.

## Verification caveat

`pnpm build` validates the frontend. PHP and MySQL are not installed in the v0 workspace, so the API, migrations, session cookies and uploads have not been executed here. Follow the XAMPP smoke-test checklist before using the backend with real bookings or deploying it.
