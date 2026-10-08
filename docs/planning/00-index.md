# Kern Planning Index

> NOTE: Lane-report history API (`sys_session_get_history`) was unavailable at synthesis time (classifier outage). This index and parts 01–09 are reconstructed strictly from the synthesis contract hints. File paths below are contract-named anchors only; full paths are marked TBD pending lane-report recovery. Do not treat verdicts as lane quotes.

## Domain map

| Key | Domain | Part file |
|-----|--------|-----------|
| P | Primitives | `01-primitives.md` |
| C | Components | `02-components.md` |
| D | Docs (Mintlify) | `03-docs.md` |
| B | Blocks (registry + viewer) | `04-blocks.md` |
| G | Playground (unified customizer) | `05-playground.md` |
| F | Foundations (theory) | `06-foundations.md` |
| — | Demos (web + mobile coverage) | `07-demos.md` |
| — | Correctness (P0/P1/P2) | `08-correctness.md` |
| — | Onboarding (CLI / MCP / skill) | `09-onboarding.md` |

## Batch order

1. **08-correctness P0 fixes first** (truth-pass jobs unblock everything else).
2. **01-primitives** (standalone gaps G1–G8; rn-reusables adapter preconditions).
3. **02-components** (domain scope, sidebar from `FAMILY_GROUPS`, reference move).
4. **04-blocks** (registry block type, viewer anatomy, categories).
5. **05-playground** (unified customizer; R3 sidebar wireframe + R4 mapping).
6. **06-foundations** (theory-only; theme-page split).
7. **03-docs** (Mintlify-tabs pattern, no-framework-migration, shared corpus).
8. **07-demos** (undemoed web + mobile lists; after P0).
9. **09-onboarding** (CLI / MCP / skill use cases; M3 system part; show/hide policy).

Rationale: correctness P0 before new surface area; primitives before components before blocks; playground after blocks; docs/demos/onboarding last as integrators.

## Decisions owed

- [ ] Confirm domain-letter mapping (P/C/D/B/G/F) with orchestrator.
- [ ] Confirm batch order above (esp. blocks vs. playground sequencing).
- [ ] rn-reusables adapter: adopt vs. fork vs. RN-explicit positioning (Part 01).
- [ ] Reference-move destination for components (Part 02).
- [ ] Mintlify-tabs as canonical pattern + shared-corpus location (Part 03).
- [ ] Block-category taxonomy sign-off (Part 04).
- [ ] Unified-customizer scope: single route vs. per-domain customizers (Part 05).
- [ ] Foundations stays theory-only — confirm no code in this cycle (Part 06).
- [ ] Demo-coverage bar: which undemoed items block release (Part 07).
- [ ] Lane execution order for P0/P1/P2 (Part 08).
- [ ] Onboarding show/hide policy + M3 system-part placement (Part 09).
