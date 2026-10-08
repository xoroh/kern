# 05 — Playground domain (lanes R3 + R4 verdict)

**Goal:** one big customizer app (Meta-playground-shaped): theme configuration + all customization in one place.

**Research verdict:** today the playground is three split halves: `/playground` hub (a door, not a destination —
`routes/playground/index.tsx:1-8`), `/theme-configurator` studio (left token controls `theme-configurator.tsx:
208-327`, right live preview `style={vars}` `:330-375`, code fence from the SAME object `:128-131,380-403`,
honesty boundaries `:407-435`), and ~50 distributed per-component configurators (`showcase/registry.ts:86-134`,
harness `showcase/configurator.tsx:1-18`, flagship e.g. `BUTTON_CONFIGURATOR` `showcase/configurators/button.tsx:
57-95`). State `{seedHex, preset, dark, contrast, radius}` (5 knobs, ~200 words of instruction copy, no persist,
no URL sync). Presets JSON-first + validated (`themes/*.json`, `resolve.ts` `defineThemePreset` + `contrastIssues`,
24-cell `matrix.json` + `check:theme-matrix`) — opposite tradeoff to shadcn (CSS-file presets, 3 knobs
`{theme, radius, mode}`, zero checks). Our contrast axis is the differentiator (shadcn has none). Missing export
artifact: the actual `themes/<customer>.json` file content.

**Design:** unified customizer: left rail (component picker + per-prop knobs), center live stage (themed container,
var-swap repaints), right/bottom code (JSX + preset from same values object), top theme controls (seed/preset/
mode/density over per-component knobs), boundaries footer. M3-based, same shell as other domains.

## Work items (ordered)

- [ ] R3 sidebar wireframe (280px, top-to-bottom): 01 swatch preset rows (3 dots = primary/secondary/
      surface-container read live) → 02 brand seed (one-line caption, explanation to `<details>`) → 03 shape
      chips+slider → 04 Light/Dark + Standard/Medium/High segmented → 05 sticky export footer with PRIMARY
      action Copy-preset-`.json` (prefilled `themes/<id>.json`), TS/CSS secondary, Reset. Copy above fold ~200→~30 words.
- [ ] `brand` becomes "+ New brand…" (prefilled export, template stays empty); tenants from `registerVariant`
      render in a badged "Tenant (session)" group (presentation-only split).
- [ ] Persist + URL-sync studio state (refresh/share-safe); preview becomes component gallery (judge theme across
      surfaces, not one card); preset rows gain swatches (tenant indistinguishable today — `theme-configurator.tsx:250-261`).
- [ ] Absorb `/theme-configurator` + hub + per-family configurator panels into the one app; `THEME_CONFIGURATOR_HREF`
      stays global (`playground-links.ts:25`); search embedded, not owned.

**Gates:** `check:theme-matrix`, `gen-theme-matrix`, `check:docs` chain, contrast gates.
**Out of scope:** seed algorithm change (primary-family approximation is documented honesty — keep).
