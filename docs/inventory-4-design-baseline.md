# Inventory-4 design-input baseline (WP0 part 2, D951/G0)

Date: 2026-11-04. G0 = lead acceptance of component-inventory-4 at 85% effective
(D951; `2be7d5b6` thread, reports `component-inventory-4.md`). Retargeted from ≥95%:
residue is cosmetic precision (line cites, list exhaustiveness); 0 phantom routes /
components / wrong roles / wrong files in 80 fresh R4 rows.

This note diffs the accepted pack against the provisional §Findings (a)–(d) in
`kern-design-prep-v1.md` (lead `plans/`). Design WPs (WP1/WP2/WP4) build on this.

## (a) 8 AUDIT surfaces — RESOLVED, trusted input

R1 seed-35602 failing surfaces (driver-mobile 46 rows, desk-mobile 7, passenger-mobile 2,
web-passenger 3, web-balance 1, web-base 1, kern-react 5, kern-expo 20) were each fully
re-opened in inventory-3 (R1: 446 rows, 104 changed) and again in the completion redo
(1213 rows, 342 changed), plus R2/R3/R4 follow-ups. Every row re-opened ≥1 extra time
past R1. Treat all rows on these surfaces as trusted design input (same cosmetic
residue caveat as the rest of the pack).

## (b) MS-012 — STILL OPEN, gates WP4 BillingPage to skeleton-only

"Tenant payout-request + usage-invoice pay/top-up actions — verify vs Stage 2/5 reports
before building." No Stage 2/5 verification reports exist in lead `reports/` (checked
2026-11-04; only per-area billing-*/financials-* lane reports). No change since the
provisional note. WP4 builds the BillingPage skeleton only; pay/top-up actions wait
for the owning lane's verification.

## (c) t()/role/guard fields — RESOLVED

ROLES pass holds (0 `unknown`); the 2 ungated permission gaps MS-039/MS-040 stay flagged
(not unknowns). Redos re-verified guard evidence per row; S2 route-count check (11 missing
rows added, 0 phantoms) confirms role coverage is complete.

## (d) Counts — SUPERSEDED, use final numbers

Provisional §Findings quoted 680 screens / 1306 components (+16 clusters, 99 drift, 40 MS).
Final accepted pack: **691 screens** (680 + 11 S2 missing rows), **1306 components**
(1012 local CMP + 294 KOS), 16 clusters, 99 drift items (+5 message clusters MC-01..05,
5 message drift MD-01..05 in MESSAGES.md), 40 missing MS + 7 message gaps M2-01..07,
50 Novu workflows. Sources: `xoroh-platform/docs-temp/component-inventory/` (INDEX.md,
COVERAGE.md with B1–B10 read logs, AUDIT.md §1–§12, SCREENS.md, COMPONENTS.md,
MESSAGES.md, REFERENCES.md).

## Standing rules for design execution (unchanged)

M3 + `--sys-*` tokens only (kern/packages already clean, C2); no raw hex/rgba; no
shadcn/radix/lucide-outside-registry; one component per cluster; Kern owns
visuals+contracts only (Q3 split: product compositions live in platform libs after
transfer — designed here as Kern-component compositions, never merged into Kern OSS);
no publish/tag/release ever; WP3 waits for G1 on WP1/WP2.
