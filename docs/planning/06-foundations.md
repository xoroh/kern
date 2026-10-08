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

- [ ] Split `/foundations/theme`: theory (roles exist, what they mean) stays; configuration moves to G.
- [ ] COLOR-USAGE GAP (new — others have it, we don't): role→surface map (which role for which surface, per
      M3 usage + our 13 extras), usage rules (do/don't, contrast pairs, tonal pairing), live examples. New
      `content/foundations/color-usage.ts` + gate that every role in the map exists in tokens.
- [ ] Motion: keep foundations-only (document the choice; per-component motion stays out of grammar).
- [ ] Icons gallery stays shared corpus (used by guides too — import, don't copy).

**Gates:** `check-typescale`, token gates, `check:docs` chain.
**Out of scope:** new tokens (D6 needs design sign-off — using tokens is agent-safe, changing values is not).
