# PepFinds

A curated product discovery platform. Every product is hand-picked by the
site owner and sourced from Chinese marketplaces (Weidian, Taobao, 1688),
with direct purchase links through buying agents (Oopbuy, Kakobuy, ACBuy,
OrientDig, Superbuy, BaseTao, MuleBuy).

## Stack

- **Next.js 15** (App Router, Server Actions) + TypeScript
- **Tailwind CSS v4** + Framer Motion
- **PostgreSQL** + **Prisma ORM**
- Single-admin auth: signed JWT session cookie (jose), middleware-gated `/admin`

## Project layout

```
prisma/schema.prisma         Database schema (Product, AgentLink)
prisma/migrations/           Checked-in SQL migrations
src/middleware.ts            Auth gate for /admin
src/lib/
  db.ts                      Prisma client singleton
  session.ts                 JWT session tokens (edge-safe)
  auth.ts                    Cookie/session + password helpers (Node)
  products.ts                Data access layer (all queries live here)
  validation.ts              Zod schemas for the product form
  agents.ts / marketplaces.ts  Agent & marketplace registries
  actions/                   Server actions (auth, product CRUD)
src/app/(site)/              Public pages: home, /search, /product/[slug]
src/app/admin/               Admin: login, dashboard, create/edit product
```

## Local development

1. **Environment** — copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — PostgreSQL connection string
   - `ADMIN_PASSWORD` — the password for `/admin`
   - `AUTH_SECRET` — random 32+ chars
     (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

2. **Database** — either point `DATABASE_URL` at a hosted database (Neon free
   tier works), or run a local one:

   ```bash
   npx prisma dev        # local Postgres, keep it running in its own terminal
   ```

   Use the printed `DATABASE_URL`, and append `&pgbouncer=true` to it (the
   local server needs Prisma's pgbouncer-compatible mode).

   Then apply migrations: `npx prisma migrate deploy`

3. **Run**:

   ```bash
   npm install
   npm run dev
   ```

   Site: http://localhost:3000 · Admin: http://localhost:3000/admin

## Deploying (Vercel)

1. Create a PostgreSQL database (Vercel Marketplace → Neon is the easiest).
2. In the Vercel project settings, add the environment variables:
   `DATABASE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET`
   (use different, strong values than your local `.env`).
3. Apply the schema to the production database once, from your machine:

   ```bash
   npx dotenv -v DATABASE_URL="<production-url>" -- npx prisma migrate deploy
   ```

   …or simply set the Vercel **build command** to
   `prisma migrate deploy && next build` so every deploy applies pending
   migrations automatically.
4. Push to GitHub — Vercel builds and deploys.
   (`postinstall` runs `prisma generate` automatically.)

## Managing the catalog

- `/admin` — sign in with `ADMIN_PASSWORD`.
- **New product** — title, description, image URLs, category, tags, source
  marketplace, per-agent purchase links, plus *Published* and *Featured*
  toggles. Drafts are invisible to visitors; a product needs at least one
  image and one agent link before it can be published.
- Edit or delete any product from the dashboard list.

Visitors can browse the homepage (featured + new arrivals), search by title,
description, tag, or category at `/search`, and open agent purchase links
from each product page. While the catalog is empty, both surfaces show a
"being curated" empty state.
