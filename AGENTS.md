# Shopify app development — size-guide

This app is scaffolded from the Shopify React Router app template (forked from the Remix template). It is an **embedded** Shopify app: React Router 7 (framework mode) + Vite, Shopify CLI-driven dev, Prisma/SQLite session storage, Polaris UI.

Use the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) for all Shopify API and platform work. If missing, install it in the agent host per that page (or `npx skills add Shopify/shopify-ai-toolkit --list` for skill-compatible hosts) — do not add tooling to this repo.

## Commands

- `npm run dev` — runs `shopify app dev` (CLI, not Vite directly). It provisions env vars, a Cloudflare tunnel, and via `shopify.web.toml` runs `predev` (`prisma generate`) and `dev` (`prisma migrate deploy && react-router dev`). Don't run `react-router dev` or `vite` standalone; auth/tunnel will be broken.
- `npm run setup` — `prisma generate && prisma migrate deploy` (needed if you hit "table `main.Session` does not exist").
- `npm run typecheck` — must do `react-router typegen` first (generates route types) then `tsc --noEmit`; use the script, not bare `tsc`.
- `npm run lint` (eslint, cached), `npm run build`, `npm run deploy` (Shopify CLI deploy).
- Node version is enforced (`engine-strict=true`): `>=20.19 <22 || >=22.12`.
- Uses **npm** (package-lock.json, `npm exec` in shopify.web.toml) despite the pnpm-workspace.yaml boilerplate.

## Structure & conventions

- File-based routing via `@react-router/fs-routes` (`app/routes.js` → `flatRoutes()`). Naming matters:
  - `app.jsx` is the authenticated app shell (App Bridge provider, auth); all embedded admin pages are `app.*` routes so they nest under it.
  - Top-level `auth.*`, `webhooks.*` routes are outside the shell and must not require session UI.
- Authenticate + query via the `shopify` export from `app/shopify.server.js`: `const { admin } = await shopify.authenticate.admin(request)`.
- DB: Prisma + SQLite (`prisma/schema.prisma`, `dev.sqlite`); sessions stored through `@shopify/shopify-app-session-storage-prisma`. After schema changes run `prisma migrate dev` locally (deploys run `migrate deploy` in `setup`/Dockerfile).
- App config lives in `shopify.app.toml`: access scopes (`write_products,write_metaobjects,write_metaobject_definitions`), app-specific webhook subscriptions (`app/uninstalled`, `app/scopes_update` — handle routes exist in `app/routes/`), and declarative metaobject/metafield definitions. Webhook topics and scopes changes go here, not in code.
- App URLs in `shopify.app.toml` are placeholders (`https://example.com`) updated automatically by `shopify app dev` (`automatically_update_urls_on_dev`).

## Embedded-app gotchas

- Inside the iFrame, use `Link` (react-router or Polaris) not `<a>`, `useSubmit` not raw forms, and the `redirect` returned from `authenticate.admin` — not react-router's `redirect`.
- App-specific webhooks belong in `shopify.app.toml` (auto-synced on deploy); shop-specific webhooks registered in `afterAuth` won't update during normal dev.
- Windows ARM64 Prisma failure (`query_engine-windows.dll.node` not valid): set `PRISMA_CLIENT_ENGINE_TYPE=binary`.
