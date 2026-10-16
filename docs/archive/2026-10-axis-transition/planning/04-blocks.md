# 04 — Blocks domain (lane R2 verdict)

**Goal:** shadcn-style blocks subdomain: composed sections with live preview + code side by side, installable
as a unit.

**Research verdict:** shadcn block = registry entry (`type: "registry:block"`, `registryDependencies`,
`dependencies`, multi-file `files[]`, categories) + viewer (Preview/Code tabs, style/theme/viewport toolbar,
copy, install command) + category browsing. Our gap is precise: manifest (`packages/mcp/src/manifest.ts:12`,
rows `{name, export, platform, path, status}` from `generate-manifest.mjs` scanning `AREAS`) has no block type,
no `files[]`, no primitive-dependency list — a "block" today is N component rows sharing `src/start/*.tsx`.
Closest existing chrome: `showcase/example.tsx:57` (Example tier: title + Preview/Code APG tabs + Copy/Export/
Repro + permalink; Block→Template ladder `example.tsx:7`), `showcase/registry.ts:65` (`EXAMPLES`+`CONFIGURATORS`
keyed by export), install picker `component-page.tsx:484` (npm/bun/pnpm/yarn tabs, persisted; no `kern add` tab —
CLI unpublished, teaching it would be a lie `:477`). Composition tier exists with a tier law
(`docs/architecture.md:133`: Component → Block (slot-driven, domain-free) → Scaffold; lower never imports
higher): `start/blocks.tsx`, `navigation.tsx`, `panes.tsx` (`ListDetail`, `Inspector`), `scaffolds.tsx`
(`AppShell` regions), `top-app-bar.tsx`.

**Design:** blocks-domain chrome: category sidebar, card grid of live mini-renders, per-block page
(title → toolbar → Preview/Code tabs → deps → prev/next). Blocks import only primitives + `cn`
(`packages/kern/src/utils/cn.ts`), theme via vars only, zero hex.

## Work items (ordered)

- [x] Manifest: `type: "block"` + `files[]` + `registryDependencies` (kern primitive list) + categories
      (Sidebar, Dashboard, Auth, Settings, …); generator + gate. Landed `930f0f6`:
      `apps/site/src/blocks/manifest.ts` (BlockEntry: name/title/category/description/file/files/
      registryDependencies/dependencies) + `check-blocks.mjs` gate (wired into `check:docs`,
      mutation-proven: fake registryDependency fails).
- [x] Viewer: Preview/Code tabs + toolbar (theme/viewport/copy/install `kern add <block>`) reusing
      `showcase/example.tsx` + `copy-button.tsx` (clipboard + execCommand fallback).
      Landed `930f0f6`: `domains/blocks/block-viewer.tsx` reuses `Example` (Preview/Code APG tabs) —
      the Code tab is the block's real source (`?raw`), so the fence cannot drift from the file
      `kern add` vendors. Install command + npm peers + registry deps in the toolbar with CopyButton.
- [x] `/showcase` shell → blocks index (replace honest-placeholder with real content when first blocks ship);
      `/patterns` → blocks patterns page. Landed `930f0f6`: `/showcase` is the live blocks catalog
      (3 real blocks) + `/showcase/$block` per-block pages with prev/next; `/patterns` content moved to
      `domains/blocks/patterns.tsx` (route file thinned to registration).
- [x] CLI `add` learns multi-file block entries (closure already handles relative imports — `closure.ts:36-100`).
      Landed `930f0f6`: `kern add <block>` vendors root + declared siblings under `<dest>/blocks/`,
      receipt `blocks:` entry beside `components:` (merge preserves both), collision name-space refusal.
      6 new tests incl. a two-file fixture block (15/15 green).

**Blocks shipped (real-only, D8):** `settings-screen` (Settings), `auth-form` (Auth),
`empty-search` (Dashboard) — each composed only from `@xoroh/kern` + `@xoroh/kern/start` + `react`.

**Gates:** manifest/block gates (new), `check:docs` chain, receipt tests (`add.test.ts`).
**Out of scope:** fake blocks (showcase stays honest until real ones ship — D8 real-only).
