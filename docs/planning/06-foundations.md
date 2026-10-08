# Part 06 — Foundations (theory + color usage)

> NOTE: R3 lane report unreadable at synthesis time (history API outage). Content below follows the synthesis contract + color-usage gap add; full file paths TBD pending lane-report recovery.

## Goal

Keep foundations theory-only (with the theme-page split) and close the color-usage gap: swatches exist, usage guidance does not.

## Research verdict

Foundations ship as theory pages only — no runtime code this cycle — with theme content split onto its own page; on top of that, a color-usage workstream adds the missing role→surface guidance (which roles for which surfaces, with do/don't rules) that other systems ship and we lack.

## Work items

- [ ] Keep foundations theory-only (no component/token runtime code in this part).
- [ ] Execute theme-page split (theme content to dedicated theme page; paths TBD).
- [ ] Color-usage: role→surface map (which color roles apply to which surfaces, light + dark).
- [ ] Color-usage: usage rules (do/don't: contrast, state layers, on-colors, error/success handling).
- [ ] Color-usage: examples (per-role applied examples on real surfaces).
- [ ] Gate: every shipped swatch has a documented role, allowed surfaces, and a do/don't example.

## Design

M3-based foundations pages: shared chrome (docs shell, TOC rail) throughout; domain chrome is the theory layout itself — swatch grids paired with usage tables and do/don't example cards, theme page visually parallel to foundations index.

## Gates

- Theory-only boundary held; theme split complete; color-usage map + rules + examples published.

## Out of scope

- Token implementation, component code, customizer work (Parts 01/02/05).
