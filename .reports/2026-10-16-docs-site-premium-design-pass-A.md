# 2026-10-16-docs-site-premium-design-pass — PR A (code and examples)

Lead: docs-site premium pass (A of A/B/C in sequence). Branch `site/premium-a-code-examples`, base `main` @ 937e8730.
Screenshots: `.reports/premium-a/before/` (pristine main; 11 pages × desktop 1440/mobile 390 × light/dark = 44 PNGs) and `.reports/premium-a/after/` (this PR; same matrix + 2 detail captures = 46 PNGs).
Machine note: the laptop rebooted mid-session (see `.team/lessons.md` 2026-10-17 rows); all numbers below are from paired back-to-back runs after the reboot on the same load window.

## Outcome

PR A closes review findings #1, #2 and #7 of the site design review:

1. **Syntax highlighting, painted from tokens.** New `src/components/docs/highlight.tsx`: dependency-free tokenizer (tsx/bash/css) that only *classifies* text into `tok-*` spans; `styles.css` paints every class from `--sys-color-*` roles in light and `.dark`. No highlight library, no hex in the theme — the code surface reads the same token layer the components do (dogfood, VISION principle 6). AA is measured, not eyeballed: against `surface-container-high` (`#e5e5e5` light / `#171717` dark) — keyword/tag/command (primary) 5.11:1 / 10.52:1, string (tertiary) 5.13:1 / 10.55:1, number/type/flag (secondary) 5.12:1 / 10.52:1, comment/operator (on-surface-variant) 6.20:1 / 12.09:1 — and pinned by an automated contrast gate in `highlight.test.ts` so a future token regeneration that breaks the floor fails `check:docs`.
2. **Code blocks earn their surface.** The shared `Code` block takes `language` + `filename` (shadcn-style filename tab in the header) and Copy shows "Copied" only when text actually reaches the clipboard, with an `execCommand` fallback on insecure origins. Package-manager tabs (npm/bun/pnpm/yarn, persisted `kern-pkg-manager`) are one shared `InstallTabs` used by getting-started *and* the component Installation blocks, so the commands cannot drift; the install command row sits on the same `surface-container-high` code surface with highlighted tokens. The component page's import statement is highlighted too.
3. **Preview/Code pairing to the top-20 cut.** 12 new example files (Tabs, Select, Slider, RadioGroup, Toggle, Badge, Chip, Snackbar, Tooltip, Separator, Fab, Textarea) join the 8 family demos that already paired → **20/20 target exports carry Preview/Code examples**. The cut is recorded literally as `PAIRED_EXPORTS` in the new `scripts/check-example-code.mjs`, which compiles every fence through `demoExportSource` (the same builder the Export/Repro buttons copy) against the real package types and is wired into `check:docs` — no paired export can regress without a type error.
4. **Search palette shortcuts.** Pure matchers in `src/systems/search/shortcut.ts` (+`shortcut.test.ts`): Ctrl+K/⌘K primary, **`/` as a fallback chord** outside text entry — the environments that swallow Ctrl+K (browser omnibox/WM/IME) are what the review hit. The header key cap is platform-aware post-mount (`Ctrl K` off-mac, `⌘K` on mac) so SSR never mismatches; the accessible name stays byte-identical "Search (Command K)" (the e2e suite matches it exactly and `e2e/` is outside this PR's scope).

## PR link

*(filled when opened)*

## Commands run + real output

All from the final code state:

- `bun run typecheck` → exit 0 (`check-dist-types: ok — 6 consumed package(s) have type declarations`)
- `bun run build` → exit 0 (`✓ built`)
- `bun test src/components/docs/highlight.test.ts src/systems/search/shortcut.test.ts` → **26 pass, 0 fail, 56 expect() calls**
- `bun --preload ./scripts/preload-rn.mjs scripts/check-example-code.mjs` → `check-example-code: ok — 27 fence(s) compile`
- `bun run check:docs` → exit 0 (an earlier run failed 3/5 of `scripts/lib/extract-prop-names.test.mjs` on 5000 ms timeouts while the machine sat at load average 40; those fixtures compile standalone strings in a temp dir and cannot be affected by this PR's code — re-ran green as recorded above)
- `bun run check:gallery` → exit 0 (`check-gallery: ok — no orphan demos, no stale reasons, reasons in-lane`); `bun run check:snippets` → exit 0
- runtime verification (Playwright harness against the built site): button page highlighted-token spans **32** (the token classes did not exist before), `/` opens palette **PASS**, Ctrl+K opens+filters **PASS**, copy→"Copied" **PASS**, install tabs + pnpm command switch **PASS**, header key cap `Ctrl K` on non-mac **PASS**, **0 console errors** across the 8 audited pages
- `bun run test:e2e` → **26 passed (1.1 m)** on the final build (an interim full-suite run at load 20+: first 26 passed (3.5 m); one post-reboot attempt failed all 26 on a missing `chromium-headless-shell` binary — environment, reinstalled, re-ran green)

### Lighthouse 13.5.0, paired before/after (same load window, gzip metrology)

`vite preview` serves text uncompressed, while production hosts gzip by default — so a session-only gzip proxy (not committed) makes the lab reflect production. Mobile preset, `--only-categories=performance,accessibility` (JSONs in `.reports/premium-a/lighthouse/`):

| page | baseline perf | PR A perf | baseline FCP/LCP | PR A FCP/LCP | a11y (equal) |
|---|---|---|---|---|---|
| home | **89** | **93** | 2.9 s / 2.9 s | 2.6 s / 2.6 s | 96 / 96 |
| getting-started | **84** | **87** | 3.2 s / 3.2 s | 3.1 s / 3.1 s | 100 / 100 |
| components/web/button | **42** | **65** | 7.1 s / 7.6 s | 5.7 s / 5.7 s | 97 / 97 |

Full-category run on PR A: best-practices 100 and SEO 100 on all three audited pages. **No regression; button +23 points** (chunk-shape change from the new example modules moving the deepest page off the main path).

## Screenshots

- Before/after pairs (8 core pages × 4 variants): home, getting-started, components index, button, dialog, input, theme, reference.
- Extra coverage (3 pages × 4 variants, both sides): playground, showcase, docs hub.
- Detail captures: `button-example-code-tab-desktop-light.png` (Code tab open: tags primary, strings tertiary, "Code"+"Copy" affordances) and `getting-started-code-detail-desktop-dark.png` (dark code surfaces, filename tab).

## Acceptance 1..n

1. **Build/typecheck/check:docs/check:gallery/e2e green** — all exit 0 with real output above ✅
2. **No new console errors** — 0 errors across 8 audited pages in the runtime harness; e2e green ✅
3. **Tests that fail before and pass after** — `highlight.test.ts` + `shortcut.test.ts` + `check-example-code.mjs` did not exist before (gate would fail: wired into `check:docs`); at runtime, `/` chord did not open the palette before (pristine handler matched only ctrl/meta chords at 937e8730) and the key cap was `⌘K` on Linux before ✅
4. **WCAG 2.2 AA** — highlighted tokens measured ≥5.1:1 light / ≥10.5:1 dark, gated in `highlight.test.ts`; Lighthouse a11y 96–100, unchanged from baseline (paired) ✅
5. **Lighthouse ≥95** — **not reached on mobile performance** (93/87/65 post-A). A11y/BP/SEO ≥95 ✅. Performance is pre-existing bundle weight (see gaps); paired runs prove no regression from this PR ✅ (for the no-regression half)
6. **Screenshots desktop+mobile, light+dark** — 44 before / 46 after PNGs as above ✅

## What's still weak (honest)

- The highlighter is a heuristic state machine, not a full grammar; it is unit-tested against the constructs our docs emit (JSX, imports, comments, bash commands/flags, CSS at-rules) and the AA gate pins colors, but exotic syntax can mis-classify without failing a gate.
- The AA gate measures against hardcoded default-preset hex values; a token regeneration that changes those hexes requires re-measuring the constants (documented in the test header) or the gate pins a stale floor.
- The pristine session found **Ctrl+K already working** (`Control+K opens palette: true`, tested at 937e8730) — review finding #7 did not reproduce on this machine. What the PR fixes is real but defensive: the `/` fallback, pure+tested matchers, and the platform-correct key cap. The `aria-label` is intentionally unchanged.
- The e2e suite covers search ("Search (Command K)") but PR A adds no e2e spec for the new behaviors: `e2e/` is outside this PR's declared scope, so runtime verification lived in the session harness. Spec coverage for `/`, install tabs and copy feedback is a follow-up for whoever owns `e2e/`.
- Mobile Lighthouse perf <95 is owned by the ~2.4MB uncompressed client `dist` entry chunk (whole library + showcase registry, every route). This PR doesn't claim to fix it; the paired runs disprove a regression and quantify the gap.

## Gaps for other leads

- **Performance/bundle**: split the `dist`/showcase chunk or precompress assets + serve gzip at the edge; that is the entire remaining mobile-perf deficit (numbers + JSONs above). Worth its own perf brief, not a design PR.
- **vite preview lab gap**: consider a `bun run preview:gzip` or precompressed-assets decision so local Lighthouse stops undercounting production.
- **Pre-existing a11y items** (selectors untouched by this diff — the Lighthouse a11y category is *identical* baseline↔PR A at 96/100/97): `label-content-name-mismatch` on the site-header logo link, `color-contrast` on the home preview-note copy and on the snackbar demo's Discard button. Chat/design or component leads.
- **e2e scope**: add specs for `/`, install tabs, copy feedback, code-tab tokens when `e2e/` passes to a PR that owns it.

## Suggested next item

PR B as briefed: TOC/scroll-spy, header hierarchy + copy sweep, dedicated `/docs/cli` and `/docs/mcp` pages, one-scroll document layout — with its own before/after matrix; the entry-chunk perf work should not block it.
