# Part 08 — Correctness

> NOTE: Lane reports unreadable at synthesis time (history API outage). Severities and lane order below follow the synthesis contract; item details TBD pending lane-report recovery.

## Goal

Triage all known defects into a P0/P1/P2 table and fix them in lane order, P0 first.

## Research verdict

Correctness gates the release: P0 defects block all demo/docs/onboarding work, P1 defects block domain completion, and P2 defects are scheduled polish — with lanes executed in dependency order rather than in parallel.

## Work items

| Priority | Definition | Work |
|----------|------------|------|
| P0 | Blocks release / breaks truth | Fix first, in lane order; demos/docs/onboarding wait |
| P1 | Blocks domain completeness | Fix after P0, in lane order |
| P2 | Polish / non-blocking | Schedule after P1, in lane order |

- [ ] Build P0/P1/P2 table (defect, severity, owning lane, paths TBD).
- [ ] Fix P0 in lane order (lanes run in dependency sequence).
- [ ] Fix P1 in lane order, then schedule P2.
- [ ] Gate: P0 empty before Parts 03/07/09 proceed.

## Design

No user-facing surface: correctness work is invisible by design — shared chrome and domain chrome remain unchanged; success reads as existing pages rendering correctly under M3.

## Gates

- P0 table empty and verified; P1/P2 tracked with owners.

## Out of scope

- New features, coverage expansion, documentation rewrites.
