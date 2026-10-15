# 03 — Docs layer + reusable docs-shell (lanes R5 + mid-turn Docusaurus add)

**Goal:** main docs (everything except components) on a docs-shell package reused by all 6 domains now and
extensible to other platform parts later — a whole-project deliverable.

**Research verdict:** do NOT migrate frameworks. Our bet (typed TS content + executable gates) is load-bearing:
grammar order shared by template + gate, compiler-extracted props with provenance, elevation/no-hex checks all
require typed data. Markdown-collections frameworks cannot host that. Import patterns only: Mintlify
tabs-over-shared-corpus (each tab owns a nav tree over one corpus — proves the per-domain-sidebar UX, SaaS not
wanted), Docusaurus `<Tabs groupId>` localStorage-persisted platform switchers (precedent for web-vs-RN tabs).

**Docusaurus chrome map (ours → adopt):** search Algolia-vs-ours (ours: build-time index from manifest+content+
maturity+tokens, `systems/search/index.ts`, ranking tiers gated by `check-search` fixtures — keep, zero backend);
version dropdown (none today — correct pre-1.0, revisit at stability); right TOC rail (ours: `OnThisPage` shares
grammar predicates `component-page.tsx:1537-1557` + mobile `SectionToc` reads `h2[id]` from DOM — keep, port to
shell); breadcrumbs, pagination (prev/next exists for components — generalize), admonitions/callouts + tabs
(adopt as shared components).

**Design:** one docs-shell (sidebar + TOC + search palette + pagination + breadcrumbs), domain-injected nav props
(`site-header/footer/mobile-drawer/search-palette/version-selector` → corpus chrome). Each domain: same shell,
own tree. No per-domain visual forks.

## Work items (ordered)

- [x] Extract shell (sidebar renderer `chrome/docs-sidebar.tsx` — today static tree from hand-edited `NAV_SECTIONS`
      `systems/nav.ts:1-20`, the one list with sidebar+search+llms.txt as readers) into the reusable package;
      per-domain trees in Mintlify-tabs shape over the shared corpus (`content/*`, `foundations/*` registry,
      `component-page` template, demos, search module — single source, never fork).
      Landed `domains/shared/chrome/docs-shell-parts.tsx` — the reusable chrome (Breadcrumbs, Pagination,
      Admonition, PlatformTabs), router-agnostic (href seams) so it extends past TanStack. SiteLayout stays the
      one shell every domain renders through; each domain injects its own tree (`DocsSidebar` from NAV_SECTIONS,
      `ComponentsSidebar` from FAMILY_GROUPS — P4). Foundations keeps its router-Link breadcrumb/pagination
      (converting to the href seam would trade client-side navigation for uniformity — refused). Single corpus
      verified: no fork — content/*, foundations registry, component-page, demos, search are imported everywhere.
- [x] Docusaurus-patterned additions: persisted platform tabs (web/RN; today separate pages linked by
      `meta.nativePeer`, variant meaning frozen by `docs/platform-parity.md:54-89`), breadcrumbs, generalized
      pagination, admonition + tab components.
      Landed `docs-shell-parts.tsx`: `PlatformTabs` (real anchors + `savePlatformChoice`; `loadPlatformChoice`
      is the seam for any future platform-ambiguous entry — every docs URL names its platform today, so no
      picker must infer one), `Breadcrumbs` (adopted on every component page), `Pagination` (title + href
      contract, same shape foundations/`component-nav` already honored), `Admonition` (note/tip/warning/danger,
      adopted in the block viewer). The switcher NAVIGATES the peer page; variant meaning stays frozen.
- [x] Search stays GLOBAL (`/search` route + ⌘K `site-header.tsx:90-99`): G embeds it, never owns it.
      Verified 2026-10-09: the Playground studio links search as a global surface and owns none of it.
- [x] Machine surfaces stay generated-never-hand-synced: `generate-llms`/`check-llms`, `generate-page-md`/
      `check-page-md` (shared `lib/page-md.mjs`), `generate-mcp-index`/`check-mcp-index`, copy-markdown button,
      `.agents/skills/kern-agents/SKILL.md` router (llms.txt → per-page .md → mcp/index.json → MCP → skill).
      Verified 2026-10-09: all four gates green in the `check:docs` chain; `page-md.mjs` is data-only (one
      function, two callers); `dom-to-markdown` skips `nav` chrome so shell parts never leak into copied .md.
- [x] Versioning: none until stability promise (Status labels + per-page freshness instead).
      Verified 2026-10-09: no version dropdown anywhere; maturity + Status labels carry freshness.

**Gates:** `check-grammar`, `check-search`, `check-llms`, `check-page-md`, `check-mcp-index`, `check-headings`.
**Out of scope:** framework migration; per-domain search indexes.
