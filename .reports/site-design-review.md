# Kern docs site: product review (premium bar)

Date: 2026-10-16 23:15 CEST. Source: kern.xoroh.org does not respond (connection failed), so this is a fresh clone of xoroh/kern @ `f887255` (#58), `apps/site` built and served with `vite preview` on the box. Screenshots: Chromium headless (Playwright), desktop 1440×900 and mobile 390×844, light and dark, in this folder as `<page>-<desktop|mobile>-<light|dark>.png`. `*-desktop-light-full.png` are meant to be full-page but only capture the viewport, because the app shell scrolls an inner container (`body` is 900px tall) — that is itself finding #10.

Pages: home, install (`/docs/getting-started`), components index (`/components/web`), button, dialog, text field (`/components/web/input`, since Kern has no "text-field" slug), theme (`/foundations/theme`), CLI/MCP (`/docs/reference`, the API index; there is no dedicated CLI or MCP page).

## Verdict

**Not premium yet. A solid, honest, well-structured "good" docs site that reads as an internal M3 reference, not a product people adopt on sight.** The bones are better than most: a real catalogue with 95/96 live demos, a consistent component-page template (Demo, Usage, Semantic DOM, Accessibility, Props, Tokens, Limitations, FAQ, Spec), Copy as Markdown / .md per page, a working dark mode, an expressive hero. What keeps it below shadcn/Radix/Vercel: no syntax highlighting, no demo↔code pairing, dense paragraphs of process-talk instead of crisp developer copy, a permanent "unpublished" banner and toolbar chips that say "not ready" on every page, weak visual hierarchy on component pages (meta row, collapsed "About", tiny captions), and a hero that sells a mood rather than showing code or real UI.

## Top 10 weaknesses

1. **No syntax highlighting in any code block.** 6 `<pre>` blocks on Button, 4 on Input, 0 highlighted tokens; flat grey blocks with a lone clip icon. shadcn/Vercel/Radix all ship themed highlighting, filenames, tabs (npm/pnpm/bun) and line highlights. — `install-desktop-light.png`, `button-desktop-light-full.png`
2. **Demos and code are separate.** The Demo section shows rendered variants with a monospace caption (`variant — elevated · primary …`); the code lives further down under Usage. Premium docs pair each example with a Preview/Code tab and copy button. — `button-desktop-dark.png`, `dialog-desktop-light-full.png`
3. **Permanent "packages are unpublished (0.0.0)" banner plus "Preview" chip and "Preview · 0.0.0" meta on every page.** Honest, but the first thing a visitor reads is "you can't install this". Combined with the install steps using `bun <checkout>/packages/kern-cli/src/kern.ts`, the getting-started path is not a real path. — `home-desktop-light.png`, `install-desktop-light.png`
4. **Copy reads like internal process notes, not developer docs.** Theme page intro is a 6-line paragraph ("Every swatch on this page is read from the package, not copied into the site…"); component index blurb "Live demos for 95 of 96 families — the rest say so on their card instead of showing an empty tile". Top-tier docs lead with one sentence of value and a code sample. — `theme-desktop-dark.png`, `components-desktop-light.png`
5. **Component page header hierarchy is weak.** Under the H1: one-line description, a collapsed "▸ ABOUT", a grey meta row (`Preview · 0.0.0 · @xoroh/kern · elevation Level 0 · M3 spec ↗`) and two outlined pill buttons, all at similar weight. "▸ ON THIS PAGE" is a collapsed pill at the top instead of a right-rail TOC on 1440px. — `dialog-desktop-light-full.png`, `button-desktop-dark.png`
6. **Wasted width on desktop and no right-rail TOC.** At 1440 the content column plus left nav leaves the right ~25% empty on doc pages (install page column is ~500px). shadcn/Radix use that rail for "On this page". — `install-desktop-light.png`, `theme-desktop-dark.png`
7. **Search shortcut shows ⌘K but Ctrl+K did nothing on Linux/Chromium**; the search screenshot after Ctrl+K + typing "dialog" shows the unchanged home page. Search is a first-class adoption tool. — `search-desktop-light.png`
8. **Dark mode is flat black with low-contrast surfaces.** Sidebar, page and cards are near-identical blacks; the purple demo well on Button is the only surface shift; destructive buttons read as salmon/brick. M3 dark should use tonal surface containers (surface-container-low/high) for depth. — `button-desktop-dark.png`, `theme-desktop-dark.png`
9. **Mobile: chrome eats the first screen.** On 390px the banner takes three lines, then the "ON THIS PAGE" pill, breadcrumbs, H1 + Web/React Native toggle crammed on one row, meta wrapping; the first demo starts ~560px down. The hero's two tiles are cropped ("Shape your ideas↗" clipped). — `button-mobile-dark.png`, `home-mobile-light.png`
10. **Scroll architecture and page reach.** The whole app scrolls inside an inner container (document height = viewport), which breaks full-page capture, browser find/scroll restoration expectations and some extensions; API index is a 418-row plain table with "real" status column and no filtering — the closest thing to a CLI/MCP page, while no page explains the CLI or MCP server end to end. — `mcp-desktop-light.png`

## What top-tier docs do that Kern doesn't (yet)

- Preview/Code tabs on every example, highlighted code, package-manager tabs, copy-with-feedback, file names (shadcn, Radix, Vercel).
- Right-rail sticky TOC, generous reading width, a calm type scale with clear H1 → lead → H2 rhythm (Radix, Vercel).
- One-command install that actually works, shown above the fold; "Installation" page per component with CLI + manual tabs (shadcn).
- A hero that shows the product: real components composed into a believable app screen, plus the install command (shadcn, Vercel Geist).
- Dedicated CLI and MCP/AI pages with copy-paste config for Cursor/Claude/VS Code (shadcn, Vercel AI SDK).
- Command palette search that indexes components, props and headings, with keyboard support on every OS.
- Dark mode designed, not inverted: layered surfaces, tuned code theme (M3 docs, Vercel).
- Polished motion on interactions (tab underline, palette open, copy confirm), kept subtle.

## Proposed design pass (2–3 PRs)

**PR A — Code and examples (highest value).** Shiki (or equivalent) highlighting with light/dark themes tied to tokens; shared `<CodeBlock>` with filename, copy feedback and package-manager tabs; `<Example>` with Preview/Code tabs, used on the Demo section of all component pages (start with the top-20 per ADR 013); fix Ctrl+K on non-Mac.

**PR B — Page layout, hierarchy, copy.** Right-rail sticky TOC ≥1280px (replace "ON THIS PAGE" pill), wider reading column, component header redesign (H1, lead, single meta line, platform toggle, actions grouped), "About" expanded into a short lead; shorten banner to a dismissible one-liner (or show only on install pages); rewrite intros on Getting started, Theme, Components index to one value sentence + code; dedicated CLI and MCP pages. Move scrolling to the document.

**PR C — Visual polish: hero, dark mode, mobile, motion.** Hero shows composed real UI + install command; dark mode uses M3 surface-container tonal layers and a tuned code theme; mobile: compact header, banner collapsed, platform toggle below H1, demos within first viewport; subtle motion tokens on tabs, palette, copy, theme switch. Screenshot-diff before/after at 1440/390 light/dark.

## xoroh.org `apps/site/src/kern-pending/`

Not found. Checked: every branch of github.com/xoroh/xoroh (main, chore/atlas-registry-runtime, site/tanstack-start, site/xoroh-org-polish, site/xoroh-org-v0, site/xoroh-org-v1) — no such path; no other xoroh repo matching xoroh.org/site names is reachable; laptop search of `~/Desktop/Business` (depth 7) found no `kern-pending` directory. A wider laptop search could not run (laptop repeatedly unreachable). It is likely uncommitted work in the rebuild thread's worktree/scratch dir.

---

## Update 2026-10-17 ~09:10 CEST — PR A opened (premium pass, A of A/B/C)

Branch `site/premium-a-code-examples`, **PR #64** (base main; release hold stands — not merged). Full evidence: `kern-site-a/.reports/2026-10-16-docs-site-premium-design-pass-A.md`, screenshots in `kern-site-a/.reports/premium-a/{before,after}/`.

Fixed in A: #1 (token-painted syntax highlighting, web+dark, AA-gated), #2 (Preview/Code pairing for the top-20 cut, 12 new example files, code compiled in check:docs), #7 (Ctrl+K/⌘K plus a `/` fallback chord; platform-aware key cap; the exact Ctrl+K failure did not reproduce on this box at 937e8730 — defensive fixes + unit tests).

Noted honestly: #3 (unpublished banner) deliberately untouched in A (copy/hierarchy work is B); Lighthouse mobile perf 93/87/65 vs paired baseline 89/84/42 (button +23; no regression; remaining deficit = pre-existing ~2.4MB uncompressed entry chunk — handoff item for a perf lead; vite preview serving uncompressed text measurably skews local numbers).
