# Part 03 — Docs (Mintlify + Docusaurus chrome)

> NOTE: R5 lane report unreadable at synthesis time (history API outage). Content below follows the synthesis contract + docs-chrome deep-add; full file paths TBD pending lane-report recovery.

## Goal

Standardize docs on the Mintlify-tabs pattern, rule out framework migration, build the shared corpus, and spec the reusable docs-shell package informed by the Docusaurus chrome audit.

## Research verdict

Docs stay on the current stack (no framework migration); Mintlify-style tabs become the canonical pattern, a shared corpus serves all domains, and Docusaurus chrome (search, versioning, TOC rail, breadcrumbs, pagination, admonitions, tabs) is mapped to our equivalents and productized as one reusable docs-shell package.

## Docusaurus chrome map (adopt / adapt / skip)

| Docusaurus feature | Our equivalent | Decision |
|--------------------|----------------|----------|
| Search: Algolia DocSearch (hosted index) vs. local/Pagefind (build-time index) | Build-time index | Adopt build-time local index (no external service dependency); keep adapter seam for Algolia later |
| Version dropdown | Versioned docs (lanes' versioning) | Adopt: version picker in docs shell, versions as first-class shell prop |
| Right-side TOC rail | `OnThisPage` rail + `SectionToc` | Adopt: `OnThisPage` as the rail, `SectionToc` as the section renderer — both owned by the shell |
| Breadcrumbs | Breadcrumb trail | Adopt for clarity (domain › section › page) |
| Pagination (prev/next) | Prev/next pager | Adopt, driven by sidebar order |
| Admonitions/callouts | Callout component | Adopt shared callout set (note/warning/danger/success) |
| Tabs | Mintlify-tabs pattern | Adopt Mintlify-tabs as canonical (see below) |

## Work items

- [ ] Adopt Mintlify-tabs pattern as canonical tab component (paths TBD).
- [ ] Confirm no-framework-migration decision and record rationale.
- [ ] Build shared corpus (common snippets/partials consumed by all domains; location TBD).
- [ ] Spec + build reusable docs-shell package (whole-project deliverable): sidebar + `OnThisPage`/`SectionToc` TOC rail + build-time search index + pagination + breadcrumbs + callouts + Mintlify-tabs — shared by all 6 domains now, extensible to other platform parts later.
- [ ] Gate: every domain page renders through the docs shell with no per-domain chrome forks.

## Design

M3-based docs surface: shared chrome (shell header, `FAMILY_GROUPS`-style sidebar, `OnThisPage` rail, search, pager, breadcrumbs) is identical across domains; domain chrome is limited to content components (tabs, callouts, live examples). No per-domain header/sidebar variants.

## Gates

- Tabs standardized; no-migration recorded; shared corpus live; docs-shell package consumed by all 6 domains.

## Out of scope

- Component/block implementation (Parts 02/04); Algolia hosted search (deferred adapter only).
