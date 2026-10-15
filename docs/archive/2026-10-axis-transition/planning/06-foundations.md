# 06 — Foundations (lanes R4 + R6 + color-usage add)

**Goal:** theory-only domain (no components): tokens, color, type, elevation, shape, motion, states, theme
reference, accessibility, icons — plus the missing color-usage guidance.

**Research verdict:** foundations are already consolidated and theory-only (all figures from `content/foundations/*`,
registry `FOUNDATIONS` `foundations/shell.tsx:34-105` with reading order + K-deviation chips). M3 map (R4):
Color (scheme roles/light-dark/HCT seed — ours: role-grammar bands `content/foundations/color.ts:36-55`, 45 M3
roles + 13 kern extras `:62-76,169-171`), Typography (15 M3 roles → our 30 styles `--md-sys-typescale-*`,
`check-typescale.mjs`), Elevation (typed `RestingElevation` `content/types.ts:31` vs `m3-elevation.ts`), Shape
(corner ladder `foundations/theme/index.tsx:249-270`), Motion (ours foundations-only — no per-component slot),
States (hover/focus/pressed overlays `content/foundations/states.ts` + token-table state column). `/foundations/theme`
reads everything live from the package (swatches, deltas, `resolveThemeLayers` matrix, `PhonePreview`/`RoleProof`).

**Design:** reference-page look: swatch grids, ladders, tiles, live values, zero configuration UI (configuration
lives in G). M3-structure order: color → typography → elevation → shape → motion → states.

## Work items (ordered)

- [x] Split `/foundations/theme`: theory (roles exist, what they mean) stays; configuration moves to G.
      Landed `a98468f` (B6 foundations batch) — theme-page split in place (`routes/foundations/theme/`),
      configuration lives in the Playground studio.
- [x] COLOR-USAGE GAP (new — others have it, we don't): role→surface map (which role for which surface, per
      M3 usage + our 13 extras), usage rules (do/don't, contrast pairs, tonal pairing), live examples. New
      `content/foundations/color-usage.ts` + gate that every role in the map exists in tokens.
      Landed `a98468f` + hardening: `SURFACE_SLOTS` (page/containers/ink pairings, do/don't in `body`,
      `kernExtra` flags for the 13 extras) and `check-tokens.mjs` §(d) — map names only shipped roles,
      covers every shipped role (orphans fail), dedup + slot-count asserted.
- [x] Motion: keep foundations-only (document the choice; per-component motion stays out of grammar).
      Landed: `MotionPage` section "Foundations only, by decision" (`$page.tsx`) states the ruling — the token
      grammar carries no per-component motion slot; a component reaches for the shared grid, not a private
      vocabulary. (Closes the 02-components grammar-gap note.)
- [x] Icons gallery stays shared corpus (used by guides too — import, don't copy).
      Verified 2026-10-09: `components/icons/icon-gallery.tsx` renders in BOTH `/foundations/icons` and the
      icons guide — one component, registry-backed, no copy.

**Gates:** `check-typescale`, token gates, `check:docs` chain.
**Out of scope:** new tokens (D6 needs design sign-off — using tokens is agent-safe, changing values is not).
