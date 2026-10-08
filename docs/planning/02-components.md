# 02 — Components domain (lanes R6 + R2 verdict)

**Goal:** a separated components domain whose sidebar holds just components, well organized — the catalog.

**Research verdict:** component pages are the strongest surface (page grammar lede→demo→props→tokens→
semantic-dom→a11y→limitations→faq→spec enforced by shared `systems/grammar.ts:29-91` imported by template AND
gate so they "cannot disagree"; template `components/docs/component-page.tsx` ~1600 lines; props
compiler-extracted + hand-`note` merged, `check-props` gated). Gallery grouping already comes from
`content/families.ts` (`FAMILY_GROUPS`) — that taxonomy becomes C's sidebar.

**Design:** M3-catalog look: family-grouped sidebar, per-family pages in the existing grammar, gallery index.
Shared chrome (header/footer/search) + domain sidebar. No theory pages here.

## Work items (ordered)

- [ ] Move `apps/site/src/routes/components/**` (4 files incl `$platform/$component.tsx` with canonical-slug 301
      `:55-75` + prev/next `systems/component-nav.ts`) into the components domain, preserving URLs or 301s
      (reuse the `styles/$page.tsx` slug-preserving redirect shape).
- [ ] Move `routes/docs/reference.tsx` → components `/reference` (it is a component index, not main docs).
- [ ] Sidebar generated from `FAMILY_GROUPS`; `/components/web` + `/components/mobile` galleries stay, pages live once.
- [ ] Move `/patterns` → Blocks (R6: all 6 cards link into C; D must have NO components) — or rewrite all targets
      cross-domain if kept.
- [ ] Content model stays in shared corpus (`content/web/**`, `content/mobile/**` ~190 files, `types.ts`,
      `index.ts` dual discovery glob+readdir) — imported, never copied.

**Gates:** `check:grammar`, `check-props`, `check-component-nav`, `check:docs` chain.
**Out of scope:** per-component motion slot (grammar gap — foundations owns motion; revisit in 06).
