# Part 02 — Components

> NOTE: R2 lane report unreadable at synthesis time (history API outage). Content below follows the synthesis contract only; full file paths TBD pending lane-report recovery.

## Goal

Lock the components domain boundary, drive the sidebar from `FAMILY_GROUPS`, and execute the reference move.

## Research verdict

Components form a bounded domain over primitives with family-grouped navigation; the sidebar is generated from the `FAMILY_GROUPS` source of truth, and reference material moves out of the component pages into its dedicated location.

## Work items

- [ ] Define components domain boundary (what lives in components vs. primitives/blocks; paths TBD).
- [ ] Build sidebar from `FAMILY_GROUPS` (single source of truth; remove hand-maintained entries).
- [ ] Execute reference move (reference content to dedicated reference location; leave redirects/stubs as lanes specified).
- [ ] Gate: sidebar renders solely from `FAMILY_GROUPS` with no drift.

## Design

M3-based component pages: shared chrome (docs shell, `FAMILY_GROUPS` sidebar, `OnThisPage` rail, pager) is uniform; domain chrome is the family-grouped component layout (anatomy, variants, reference links) — families differ in content, never in frame.

## Gates

- Domain boundary documented; sidebar generated from `FAMILY_GROUPS`; reference move complete.

## Out of scope

- Primitive gaps (Part 01), blocks registry (Part 04), docs corpus changes (Part 03).
