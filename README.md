# cellulo-bff

A production-ready **Fastify + TypeScript BFF (Backend for Frontend)** that acts as the API layer between the `cellulo` Next.js frontend and the [Airalo Partner API](https://sandbox-partners-api.airalo.com/v2).

---

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Start dev server (with hot reload)
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with tsx watch |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run compiled production server |
| `pnpm lint` | Check formatting with Prettier |

---

## API Endpoints

All routes are prefixed with `/api/v1`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/packages` | List all eSIM packages (optional `?country=XX`) |
| `GET` | `/api/v1/packages/:countryCode` | List eSIM packages for a specific country |
| `GET` | `/api/v1/orders` | List orders |
| `POST` | `/api/v1/orders` | Create a new order |
| `GET` | `/api/v1/esims` | List eSIMs |
| `GET` | `/api/v1/esims/:iccid` | Get eSIM by ICCID |

---

## Environment Variables

See `.env.example` for all required variables:

- `PORT` — Server port (default: `3001`)
- `NODE_ENV` — Environment (`development` | `production` | `test`)
- `AIRALO_BASE_URL` — Airalo API base URL
- `AIRALO_CLIENT_ID` — Airalo OAuth2 client ID
- `AIRALO_CLIENT_SECRET` — Airalo OAuth2 client secret
- `JWT_SECRET` — Secret for `@fastify/jwt`
- `DATABASE_PATH` _(optional)_ — Path to the SQLite database file (default: `./data/cellulo.db`)
- `PACKAGE_SYNC_INTERVAL_MS` _(optional)_ — How often the background sync fetches packages from Airalo in milliseconds (default: `21600000` = 6 hours)

---

## Background Package Sync

On startup the BFF immediately fetches all packages from Airalo (paginating through every page) and upserts them into a local SQLite database (`./data/cellulo.db` by default). The sync then repeats on a configurable interval (default: every 6 hours).

This ensures packages are always available and up to date without putting real-time load on the Airalo API.

The database file is created automatically. The `data/` directory is excluded from version control.

---

## Railway Deployment

1. Connect this repository to Railway.
2. Set all environment variables in the Railway dashboard.
3. Railway will auto-detect the `Dockerfile` and build the multi-stage image.
4. The app exposes port `3001` — configure Railway's port setting accordingly.

---

## Architecture

- **Service layer** (`src/services/airalo/`) handles all Airalo API communication including OAuth2 token management with in-memory caching (60s expiry buffer).
- **Routes** (`src/routes/`) delegate to the service layer — no direct Airalo calls from route handlers.
- **Plugins** (`src/plugins/`) register `@fastify/cors`, `@fastify/jwt`, and `@fastify/rate-limit`.
- **Config** (`src/config/env.ts`) validates all environment variables at startup using `zod`.
- **Database** (`src/db/database.ts`) initialises a SQLite database via `better-sqlite3` with WAL mode enabled for concurrent reads.
- **Jobs** (`src/jobs/packageSync.ts`) runs a background timer that periodically fetches all Airalo packages (paginated) and upserts them into SQLite.