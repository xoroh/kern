# Kern site (`kern.xoroh.org`)

TanStack Start app: component docs + playground. Private workspace member,
never published.

## Prereqs

`@xoroh/kern` resolves to `packages/kern/dist` (gitignored), so build the
library first — fresh clones must do this before `dev`/`typecheck`/`build`
here:

```bash
bun run build --filter @xoroh/kern
# or: bun --cwd packages/kern run build
```

## Scripts

```bash
bun run dev          # vite dev on :3000 (from apps/site)
bun run typecheck    # tsr generate + tsc --noEmit
bun run build        # vite build (SSR + Cloudflare worker entry)
bun run preview      # vite preview
bun run deploy       # build + wrangler deploy (needs Cloudflare auth)
```

Routes live in `src/routes`; `src/routeTree.gen.ts` is generated (gitignored,
do not hand-edit). Styling: Tailwind v4 (`@tailwindcss/vite`) + Kern theme
(`@xoroh/kern/theme`, currently 6 vars — the role layer lands here per
REVIEW.md §1).
