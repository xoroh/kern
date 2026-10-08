# Part 01 — Primitives

> NOTE: R1 lane report unreadable at synthesis time (history API outage). Content below follows the synthesis contract only; full file paths TBD pending lane-report recovery.

## Goal

Close standalone primitive gaps (G1–G8), set rn-reusables adapter preconditions, and lock RN-explicit positioning.

## Research verdict

Standalone primitives ship first as framework-agnostic units; the rn-reusables adapter is gated on preconditions rather than assumed, and React Native positioning stays explicit (no implicit web-position fallbacks).

## Work items

- [ ] Close standalone gaps G1–G8 (scope per R1 report; paths TBD).
- [ ] Record rn-reusables adapter preconditions (version pin, token dependency, API surface) before any adapter code.
- [ ] Apply RN-explicit positioning rule (no web-default position inheritance on native).
- [ ] Gate: primitives are independently importable with no cross-domain imports.

## Design

M3-based primitive pages: shared chrome (docs shell, `OnThisPage` rail, search, pager) is uniform; domain chrome is the primitive anatomy layout (props table, states, platform tabs with RN-explicit notes) — no custom page frames.

## Gates

- G1–G8 checklist complete; adapter preconditions documented; RN positioning rule enforced.

## Out of scope

- Components, blocks, playground, and theming work (see Parts 02/04/05/06).
