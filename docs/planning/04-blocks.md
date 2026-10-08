# Part 04 — Blocks

> NOTE: R2/R-lane reports unreadable at synthesis time (history API outage). Content below follows the synthesis contract only; full file paths TBD pending lane-report recovery.

## Goal

Define the registry block type, lock viewer anatomy, and fix the block category taxonomy.

## Research verdict

Blocks are registry-typed compositions over components with a fixed viewer anatomy; categories are a closed taxonomy so every block is browsable, searchable, and previewable in one consistent viewer.

## Work items

- [ ] Define registry block type (schema for block metadata, props, examples; paths TBD).
- [ ] Lock viewer anatomy (fixed regions: preview, code, props, variants — per lane spec).
- [ ] Fix block categories (closed taxonomy; every block assigned exactly one).
- [ ] Gate: registry validates; viewer renders all categories without per-category forks.

## Design

M3-based block viewer: shared chrome (docs shell + viewer frame) is uniform; domain chrome is the block preview surface itself (category-specific example content only, never layout forks).

## Gates

- Block type schema merged; viewer anatomy frozen; category taxonomy applied to all blocks.

## Out of scope

- Primitive gaps (Part 01), playground customizer (Part 05), demo coverage (Part 07).
