# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Status

Storefront products, categories and stock are read from Postgres (Drizzle). No carts, orders, payments, reviews, wishlists, variants or deployment exist yet. Better Auth tables are not defined, so auth calls will fail until they are generated and migrated.

## Commands

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` (ESLint 9 flat config) and `npm run typecheck` (`tsc --noEmit`)
- `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` (drizzle-kit); `npm run db:seed` loads the sample catalog (idempotent)
- No test runner is configured.

## Architecture

- Next.js 16 App Router under `src/app`, TypeScript, Tailwind v4 (via `@tailwindcss/postcss`), import alias `@/*` → `src/*`.
- `src/db/index.ts` exports the Drizzle `db` client (and the raw `client`) on postgres-js (`drizzle-orm/postgres-js`, `prepare: false` for Supabase's pooler) against Supabase Postgres, and throws at import if `DATABASE_URL` is unset. Tables go in `src/db/schema.ts` (`categories` 1→N `products` 1→1 `stock`; prices stored as `price_cents`; snake_case column casing is set in both `db` and `drizzle.config.ts`). Read queries are in `src/db/queries.ts`; seed data is in `src/db/seed.ts`.
- `src/data/catalog.ts` holds only static editorial content and pure helpers (`formatPrice`, `getStockState`). It must not import `db`, since client components use it. Home and product pages use `revalidate = 60` so stock stays reasonably fresh; `next build` needs `DATABASE_URL`.
- `drizzle.config.ts` reads `.env.local` then `.env`, connects with `DIRECT_URL` (fallback `DATABASE_URL`), and writes migrations to `./drizzle`.
- `src/lib/auth.ts` is the Better Auth server instance (Drizzle `pg` adapter, `nextCookies()` plugin). It is exposed through `src/app/api/auth/[...all]/route.ts`; `src/lib/auth-client.ts` is the React client.
- Better Auth's schema must be added to `src/db/schema.ts` (generate with `npx @better-auth/cli generate`), then migrate.

## Database conventions

- Money is integer cents (`price_cents`), never floats. Convert to dollars only at the read boundary (`toProduct` in `src/db/queries.ts`) and format with `formatPrice`.
- Stock lives in its own `stock` table, one row per product (PK = `product_id`, `ON DELETE CASCADE`). Stock is per product, not per size; `sizes` is display-only until variants exist. Read stock with a `leftJoin` + `coalesce(quantity, 0)`, so a missing row means sold out.
- Non-negative values are enforced by CHECK constraints (`price_cents >= 0`, `quantity >= 0`). Keep new numeric invariants in the database, not only in app code.
- `products.category_id` is `ON DELETE RESTRICT`. Hide products with `is_active = false` instead of deleting them, and filter on `is_active` in every storefront query.
- Look up products and categories by `slug` (unique), never by numeric `id` in URLs.
- Display policy (`LOW_STOCK_THRESHOLD`, `getStockState`) stays in code, not in the DB.
- Client components import only types from `@/db/queries` (`import type`), never runtime db code.
- Schema changes: edit `schema.ts` → `npm run db:generate` → review and commit the SQL in `drizzle/` → `npm run db:migrate`. Do not use `db:push` except on throwaway databases.
- Multi-row writes that must succeed together go in `db.transaction()`. Seeds use idempotent upserts (`onConflictDoUpdate` keyed on `slug` / `product_id`); keep `db:seed` re-runnable. Standalone scripts must `await client.end()` or the process hangs.
- Cached pages can show stock up to 60s old. Any future checkout or order write must re-check stock at write time.

## Environment

Copy `.env.example` to `.env.local`: `DATABASE_URL` (app runtime: Supabase session pooler `postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres`, IPv4; switch to the transaction pooler on `:6543` for serverless deploys), `DIRECT_URL` (drizzle-kit migrations only: `postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres`, IPv6, occasionally refuses connections, so re-run on `ECONNREFUSED`; falls back to `DATABASE_URL` if unset). Percent-encode `$` in passwords as `%24`: Next expands `$` in env files, the scripts don't. The `<ref>.supabase.co` API host does not accept Postgres connections. Other vars: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. `.env.example` is un-ignored in `.gitignore`; other `.env*` files are ignored.
