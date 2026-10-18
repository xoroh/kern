# 2026-10-16-docs-site-premium-design-pass — PR B (docs structure, TOC, document scroll, CLI & MCP)

Lead: docs-site premium pass (B of A/B/C in sequence). Branch `site/premium-b-docs-structure`, base `site/premium-a-code-examples` (PR #64).
Screenshots: `.reports/premium-b/before/` (PR A baseline; 13 pages × desktop 1440/mobile 390 × light/dark = 44 baseline PNGs) and `.reports/premium-b/after/` (this PR; 13 pages × 2 viewports × 2 themes = 52 PNGs).

## Outcome

PR B closes review findings #3, #4, #5, #6, and #8 of the site design review:

1. **Right-hand sticky Table of Contents (TOC) rail.**
   - Replaced the inner-content "On this page" disclosure on desktop viewports with a persistent, sticky right-hand rail (`aside.site-toc`, visible at `xl:block` / >=1280px).
   - Sticky positioning (`top-[var(--site-header-h)] max-h-[calc(100dvh-var(--site-header-h))] overflow-y-auto`) keeps section anchors in view throughout reading.
   - Built with active heading tracking via `IntersectionObserver` scroll-spy with M3 active pill styling (`bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)`).
   - Below 1280px, the rail gracefully hides and the lightweight inline disclosure takes over without layout crowding.

2. **Document-level scrolling (eliminating inner-div scroll lock).**
   - Transformed the shell scroll model from `AppShell` inner-div scrolling (`main` overflow-auto) to true native document scrolling (`html`/`window`).
   - Browser navigation, URL hash targeting, Cmd+F in-page search, scroll restoration, and full-page capture now behave as a standard document.
   - `styles.css` pins `--site-header-h` (80px desktop, 72px tablet, 64px mobile), applies smooth scrolling and `scrollbar-gutter: stable` on root `html`, and offsets heading anchor targets (`scroll-margin-top: calc(var(--site-header-h) + 24px)`).
   - Full-bleed workbench views (e.g. `/playground`) cleanly opt out with `isFullHeight`, retaining viewport-pinned `h-dvh` and internal pane scrolling.

3. **Component page header hierarchy.**
   - Restructured `ComponentPage` header: H1 title, lead text, clear metadata row, platform switch, and primary action links.
   - Eliminated the collapsed `<details>` "About" disclosure; component features and architecture now render cleanly in open typography (`max-w-[70ch]`).

4. **Dedicated CLI and MCP documentation surfaces.**
   - `/docs/cli`: Full guide for `kern` CLI operations (`create`, `init`, `list`, `add`, `diff`, `upgrade`, `feedback`) with structured sections and command blocks.
   - `/docs/mcp`: First-class MCP documentation showing how to connect `@xoroh/kern-mcp` across Claude Code, Cursor, VS Code, and Zed, complete with JSON configuration snippets and source inspection guides.
   - Extended tokenizer in `src/components/docs/highlight.tsx` and unit tests in `src/components/docs/highlight.test.ts` to support JSON syntax highlighting with M3 token colors.
   - Wired both routes into `DEVELOP_NAV` (`src/systems/nav.ts`) and `public/llms.txt`.

5. **Rewritten user-facing copy.**
   - Removed internal process notes and defensive framing across component gallery lede, foundations, and guides.
   - Gallery lede now directs developers to explore and adopt components rather than apologizing for work in progress.
   - `PreviewBanner` unified as a single, honest, unobtrusive notice rendered in `SiteLayout`.

6. **Prefers-reduced-motion compliance.**
   - `@media (prefers-reduced-motion: reduce)` rule added to `html` to switch `scroll-behavior: auto`, respecting accessibility preferences.

## PR link

*(filled when opened)*

## Commands run + real output

All verified from the final code state:

- `bun run typecheck` -> exit 0 (`check-dist-types: ok — 6 consumed package(s) have type declarations`)
- `bun run build` -> exit 0 (`built in 4.04s client / 4.37s ssr`)
- `bun run check:docs` -> exit 0 (all checks pass: headings, nav, props, spec URLs, typescale, grammar, markdown, llms, seo, mcp-index)
- `bun run check:gallery` -> exit 0 (`check-gallery: ok — no orphan demos, no stale reasons, reasons in-lane`)
- `bun test src/components/docs/highlight.test.ts src/systems/search/shortcut.test.ts` -> **29 pass, 0 fail, 66 expect() calls**
- `bun run test:e2e` -> **30 passed (1.2m)** across all 5 test suites:
  - `e2e/comp-overrides.spec.ts` (5 passed)
  - `e2e/dialog-focus-trap.spec.ts` (3 passed)
  - `e2e/page-render.spec.ts` (2 passed)
  - `e2e/sheet-dismissal.spec.ts` (4 passed)
  - `e2e/site-design.spec.ts` (13 passed, including 4 new PR B tests)
  - `e2e/visual-baseline.spec.ts` (3 passed)

### Metrics comparison: Document scroll & TOC rail

Evidence from `.reports/premium-b/before-metrics.log` vs `.reports/premium-b/after-metrics.log`:

| Page (desktop light) | Baseline docScrollH | PR B docScrollH | Baseline main overflow | PR B main overflow | Baseline TOC rail | PR B TOC rail |
|---|---|---|---|---|---|---|
| button | 900 px | **9,253 px** | auto (scrolling) | **visible (doc scroll)** | none | **block (visible)** |
| dialog | 900 px | **8,627 px** | auto (scrolling) | **visible (doc scroll)** | none | **block (visible)** |
| input | 900 px | **6,960 px** | auto (scrolling) | **visible (doc scroll)** | none | **block (visible)** |
| getting-started | 900 px | **5,530 px** | auto (scrolling) | **visible (doc scroll)** | none | **block (visible)** |
| components-index | 900 px | **13,755 px** | auto (scrolling) | **visible (doc scroll)** | none | **block (visible)** |
| theme | 900 px | **5,576 px** | auto (scrolling) | **visible (doc scroll)** | none | **block (visible)** |
| cli (new) | 404 | **4,115 px** | N/A | **visible (doc scroll)** | N/A | **block (visible)** |
| mcp (new) | 404 | **3,399 px** | N/A | **visible (doc scroll)** | N/A | **block (visible)** |

## Screenshots

Captured across 13 pages x 2 viewports (1440 desktop, 390 mobile) x 2 themes (light, dark) = 52 PNGs in `.reports/premium-b/after/`:
- Home: desktop light/dark, mobile light/dark
- Getting Started: desktop light/dark, mobile light/dark
- Components Index: desktop light/dark, mobile light/dark
- Button: desktop light/dark, mobile light/dark
- Dialog: desktop light/dark, mobile light/dark
- Input: desktop light/dark, mobile light/dark
- Theme Foundations: desktop light/dark, mobile light/dark
- Reference: desktop light/dark, mobile light/dark
- Playground: desktop light/dark, mobile light/dark
- Showcase: desktop light/dark, mobile light/dark
- Docs Hub: desktop light/dark, mobile light/dark
- CLI: desktop light/dark, mobile light/dark
- MCP: desktop light/dark, mobile light/dark

## Acceptance 1..n

1. **Build/typecheck/check:docs/check:gallery/e2e green** — all exit 0 with real output verified above
2. **No new console errors** — 0 console errors across audited routes during Playwright test runs and capture
3. **Tests that fail before and pass after**:
   - TOC rail present at >=1280px and hidden below: verified in `e2e/site-design.spec.ts` (`aside.site-toc` visible at 1440, hidden at 1024)
   - Document-level scrolling: verified in `e2e/site-design.spec.ts` (document scroll height expands, `main` overflow is `visible`)
   - Prefers-reduced-motion disables smooth scroll: verified in `e2e/site-design.spec.ts` (`scrollBehavior` resolves to `"auto"`)
   - Dedicated CLI and MCP pages render with semantic headings: verified in `e2e/site-design.spec.ts`
   - JSON syntax highlighting: verified in `src/components/docs/highlight.test.ts` (round-trip, key/string/keyword/number classification, AA contrast)
4. **Honest judgement vs shadcn/ui, Radix, M3 docs**:
   - **TOC**: Matches shadcn/ui and Radix right-rail behavior with sticky positioning, subtle typography, and smooth active indicator. Cleanly drops out at sub-xl breakpoints.
   - **Scroll model**: Matches standard web documentation standards (Radix/shadcn); no weird trapped scroll containers, browser native scrollbar behaves predictably.
   - **Header hierarchy**: Greatly improved over baseline; open lede text eliminates clunky collapsed details.
   - **CLI & MCP**: Gives Kern first-class agent and developer tool documentation, exceeding Radix and approaching shadcn CLI docs.

## What's still weak (honest)

- On viewports between 1024px (`lg`) and 1279px, the left sidebar is visible but the right TOC rail is hidden; users in this band rely on the inline disclosure inside `main`. This avoids squeezing the main content below comfortable reading line-lengths (~60ch) on 13-inch laptops, but means the sticky TOC is only available from 1280px up.
- Active TOC item tracking uses a top-edge intersection threshold; rapidly scrolling through very short sections can briefly lag the active pill transition.
- Uncompressed entry chunk weight remains an area for bundle optimization in a separate perf pass.

## Gaps for other leads

- Search dialog indexing could include dedicated sections and tool names from `/docs/cli` and `/docs/mcp` as first-class search suggestions.
- Live CLI terminal interactive simulator could be added to `/docs/cli` in the future.

## Suggested next item

PR C as briefed: Hero showing real composed Kern UI + install line, layered M3 dark surfaces (surface-container tones), mobile first-viewport fix (first demo/content visible in first screen at 390px), and motion enhancements with prefers-reduced-motion support.
