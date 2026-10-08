# Part 07 — Demos

> NOTE: R7 lane report unreadable at synthesis time (history API outage). Content below follows the synthesis contract only; full coverage lists TBD pending lane-report recovery.

## Goal

Cover the undemoed web + mobile inventory, with P0 correctness fixes first.

## Research verdict

Demo coverage is driven by explicit undemoed lists for web and mobile; P0 correctness fixes land before any new demo work so demos showcase fixed, not broken, behavior.

## Work items

- [ ] P0 correctness fixes first (per Part 08; no new demos on broken surfaces).
- [ ] Publish undemoed web list (inventory from R7 report; paths TBD) and demo each item.
- [ ] Publish undemoed mobile list (inventory from R7 report) and demo each item.
- [ ] Gate: undemoed lists empty (or explicitly deferred with reasons).

## Design

M3-based demo surfaces: shared chrome (docs shell + demo frame) is uniform; domain chrome is the demo content per platform (web vs. mobile canvases), with identical navigation and pager behavior.

## Gates

- P0 green; web + mobile undemoed lists cleared or deferred by decision.

## Out of scope

- New components/blocks (Parts 02/04); onboarding flows (Part 09).
