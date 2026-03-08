# cellulo-bff

Backend for Frontend (BFF) for Cellulo — built with Fastify + TypeScript.

Acts as the API layer between the Cellulo Next.js frontend and the Airalo Partner API.

## Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify
- **Language**: TypeScript
- **Package manager**: pnpm
- **Hosting**: Render (free tier)
- **Database**: Supabase (coming in Phase 3)

## Setup

```bash
pnpm install
cp .env.example .env
# fill in your values in .env
pnpm dev
```

## Available Endpoints

| Method | Path             | Description  |
| ------ | ---------------- | ------------ |
| GET    | `/api/v1/health` | Health check |

## Deployment (Render)

1. Connect this repo to Render
2. Set build command: `pnpm install && pnpm build`
3. Set start command: `node dist/index.js`
4. Add all env vars from `.env.example`
