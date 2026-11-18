<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# wedplan-client

Next.js 16 App Router client for a wedding-planning app. Currently just the `create-next-app` scaffold plus Better Auth.

## Stack quirks

- Next **16.4.6**, React **19.3**, App Router under `src/app`, Turbopack is the default builder.
- `next.config.ts` turns on `cacheComponents`, `partialPrefetching`, and `reactCompiler`:
  - PPR is the default. Uncached reads (`fetch`, `cookies()`, `headers()`, MongoDB) must be under `<Suspense>`, wrapped in `"use cache"` + `cacheLife`/`cacheTag`, or the route must export `instant = false` — otherwise `next build` fails prerendering.
  - Do not export `runtime` from routes/layouts (`edge` is unsupported under Cache Components).
  - React Compiler is on: don't add `useMemo`/`useCallback` for render performance.
- Tailwind **v4** with no `tailwind.config.*`. Tokens are CSS vars plus `@theme inline` in `src/app/globals.css`. CSS is compiled by the `@tailwindcss/turbopack` loader declared in `next.config.ts` — don't remove that `turbopack.rules` entry or add a PostCSS config.
- Route types are generated into `.next/types` and referenced by `next-env.d.ts`; `LayoutProps<"/">` / `PageProps` are globals. Don't edit `next-env.d.ts`, and run `npm run dev` or `npm run build` to regenerate route types before typechecking newly added routes.

## Commands

```bash
npm run dev
npm run lint        # bare `eslint`; `next lint` was removed in Next 16
npx eslint --fix
npx tsc --noEmit    # no typecheck script exists
npm run build
```

- `next build` no longer lints, and there is no test runner, CI, or pre-commit hook. Verify with `npm run lint && npx tsc --noEmit && npm run build`; only `build` catches Cache Components/prerender errors.

## Auth and data

- `.env` (gitignored) needs `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
- `src/lib/auth.ts` is server-only: module-level `MongoClient` + `mongodbAdapter`, email/password enabled. The only auth route is the catch-all `src/app/api/auth/[...all]/route.ts`.
- `src/lib/auth-client.ts` has two clients: `authClient` is configured with a hardcoded `baseURL: "http://localhost:3000"`, while the re-exported `signIn`/`signUp`/`useSession` come from a second, unconfigured `createAuthClient()`. Use `authClient.*` in new code instead of extending those exports.
- No `middleware`/`proxy` or session guards exist yet — auth is wired but nothing is protected.

## UI conventions

- shadcn is configured `style: "base-nova"` over **Base UI** (`@base-ui/react`), not Radix. Add components with `npx shadcn@latest add <component>`; don't import `@radix-ui/*` or expect Radix APIs (`asChild` — Base UI uses a `render` prop). Base UI docs are bundled at `node_modules/@base-ui/react/docs/`.
- `cn` is the `cn` npm package re-exported from `src/lib/utils.ts`; don't add `clsx`/`tailwind-merge`.
- Animation uses `motion`.

## Layout

- `src/app` — routes and root layout; `src/components/ui` — shadcn components (only `button.tsx` so far); `src/lib` — auth and utils.
- `@/*` maps to `src/*`.
- `src/app/page.tsx` is still the starter page.
