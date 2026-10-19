# Kern cleanup lane — outcome 2026-10-19 (~05:10 CEST, Kern Lead)

Scope: merge the 2026-10-19 queue (PRs #59–#74) to zero open PRs. All merges
squash. Verified with `git log origin/main`, `gh pr list`, `gh pr view --json
state`, and green CI on every merged HEAD.

## Merged to `main` (oldest → newest)

| PR | What | Main after |
|---|---|---|
| #73 | bun 1.4.3 pin (lockfile fix) | `82bf0462` |
| #74 | gap audit + site design review (reports) | `07a74073` |
| #67 | no global M3 registration | `c2f079b6` |
| #59 | M3 fidelity + HCT cutover + ADR-021 | `08f5738e` |
| #60 | usage-presentation (system routes, install honesty, top-20) | `16be443d` |
| #62 | undocumented exports to zero (coverage gate fails on gaps) | `73037cfd` |
| #66 | Axis vendor `82c3179` + stale-tarball gate | `b28f3b28` |
| #69 | `render` adoption, casts removed | `49173cd5` |
| #65 | UseColorScheme + ThemeToggle port | `4f27c411` |
| #68 | Hero/TopBar/SiteFooter marketing compositions | `a4c2ae82` |
| #64 | site premium A | `b16daf02` |
| #71 | Axis Toast/Portal adoption (ADR-020; mobile showcase migrated) | `39444403` |
| #70 | site premium B | `fc5b2df3` |

## Closed without merge

- #63 (Axis vendor `82c3179`) — **duplicate of #66**; both commits contained in
  the kept line. Closed with pointer comment; remote branch deleted.

## Still open

- #72 (this roadmap consolidation) — merge last.

## Review evidence notes

- #60's 20 screenshots (5 pages × 1440/390 × light/dark) were reviewed at merge
  time (verdict: premium, install-honest, none blocking) but never committed.
  The untracked `.reports/2026-10-19-kern-integration-lane/` PNG folder on the
  main checkout was therefore deleted, not committed — the verdict stands above.
- Local-gate environment notes (laptop only, CI unaffected): `preflight:publish`
  needs a real `npm` binary (absent on this laptop; the gate deliberately packs
  with npm, so no shim — CI's `gates` job covers it, green on every merged HEAD
  above); `check:generated`'s site-manifest step shells to `npx biome` (also
  absent) — verified content-fresh by regenerating and formatting with the
  repo-pinned biome (byte-identical, gate green).

## Suggested next item

Roadmap item 1: re-vendor Axis to `b85a5c3` (Axis #57 compound Select/Tooltip,
#60 OverlayRoot/PortalHost — one root PortalHost, drop Kern Modal wrapping).
