# Part 05 — Playground

> NOTE: R3/R4 lane reports unreadable at synthesis time (history API outage). Content below follows the synthesis contract only; full file paths TBD pending lane-report recovery.

## Goal

Ship one unified customizer, wired to the R3 sidebar wireframe and the R4 mapping.

## Research verdict

A single unified customizer replaces per-domain playgrounds; its navigation follows the R3 sidebar wireframe and its control-to-token binding follows the R4 mapping, keeping customization consistent across all domains.

## Work items

- [ ] Build unified customizer (single entry; per-domain modes, not per-domain pages).
- [ ] Wire R3 sidebar wireframe (navigation structure per R3 spec; paths TBD).
- [ ] Apply R4 mapping (control → token/prop bindings per R4 spec).
- [ ] Gate: every customizable token is reachable from the unified customizer.

## Design

M3-based customizer surface: shared chrome (docs shell + customizer frame, controls panel) is identical for all domains; domain chrome is only the preview canvas content (the domain's own components/blocks under customization).

## Gates

- Unified customizer live; R3 wireframe implemented; R4 mapping fully bound.

## Out of scope

- Foundations theory (Part 06), docs-shell search index internals (Part 03).
