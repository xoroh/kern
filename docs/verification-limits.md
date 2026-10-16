# What kern's test suite does and does not prove

Status: current · measured 2026-10-16 · every figure below re-derived from the
repo, not carried forward

**Read this before treating a green CI run as evidence about behaviour.** This
file exists because "the tests pass" and "the thing works" are different claims,
and this repo's CI is evidence for the first and only partly for the second. A
contributor who trusts CI green more than this document allows will ship a
regression the suite was never able to catch.

---

## 1. What actually runs

Three runners, all real, all in CI on every push and PR.

| Runner | Command | Scope | Suites | Tests |
|---|---|---|---|---|
| **vitest** | `bun run test` | `@xoroh/kern-tokens` | 6 | 70 |
| | | `@xoroh/kern-contracts` | 2 | 32 |
| | | `@xoroh/kern-material-3` | 13 | 102 |
| | | `@xoroh/kern` (web) | 77 | 831 |
| | | `@xoroh/kern-icons` | 5 | 85 |
| | `bun run test:native` | `@xoroh/kern-native`, non-rn files | 9 | 103 |
| **jest + RNTL** | `bun run test:native:jest` | `@xoroh/kern-native`, `*.rntest.tsx` | 50 | 449 |
| **playwright** | `bun run test:e2e` | site in chromium via `vite preview` :4173 | 6 | 17 |
| | | **total** | **168** | **1689** |

The old "107 suites / 1049 tests" figure (2026-10-07) is stale: the unit
suites grew (kern 55→77 files, tokens 5→6, native jest 36→50 suites), the
contracts/material-3 packages joined the fan-out, and the e2e layer doubled
from 3 specs to 6. Re-derived 2026-10-16 by running each command after
`bun run build`: kern-tokens 6/70, kern-contracts 2/32, kern-material-3
13/102, kern 77/831, kern-icons 5/85, kern-native vitest 9/103, kern-native
jest 50 suites / 449 tests, e2e 6 spec files / 17 tests. (`libs/`
kern-primitives, 16 test files, is frozen pending deletion and runs outside
the fan-out; the Axis thread owns its successor suites.)

Two caveats, both measured this run:

- The vitest counts above require a prior `bun run build`. Without `dist`,
  `@xoroh/kern` fails 9 files in transform and `@xoroh/kern-native` fails
  all 5 with `Failed to resolve entry for package "@xoroh/kern-tokens"` —
  which reads as broken tests but is a missing build. CI builds before it
  tests, so CI does not hit this; a local run that skips the build does.
- The jest total is green: **449/449 across 50 suites** (2026-10-16). The
  2026-10-07 `fab-family.rntest.tsx` failure is resolved — nothing is
  quarantined.

`bun run test:all` runs the four unit commands (not e2e). CI runs the same
unit set per package with the working directory set to that package, plus
the dedicated `e2e` job, so a failure names the package or the e2e layer.

### The two-runner split is a trap worth knowing

`kern-native` is tested by **both** runners, and they do not overlap:

- `bun run test:native` (vitest) runs only files that do **not** end
  `.rntest.tsx`
- `bun run test:native:jest` runs **only** `*.rntest.tsx`

Running the wrong one is not a partial signal, it is a **misleading** one: a
`*.rntest.tsx` suite looks absent rather than failing, and "46 tests" reads as
coverage when 344 were skipped. This has already cost a cycle in this repo. If
you add a native render test, it goes in a `.rntest.tsx` file and only
`test:all` or `test:native:jest` will ever see it.

---

## 2. What runs, and what it still does not prove

### The end-to-end suite is six specs, not coverage

Measured, not assumed (2026-10-16):

- **runner declared**: `@playwright/test ^1.63.0` is a root devDependency
- **invocation**: `bun run test:e2e` → `playwright test --config
  e2e/playwright.config.ts`, project `chromium`, `workers: 1`
- **CI job**: `e2e` in `.github/workflows/ci.yml` — installs chromium
  (`bun x playwright install --with-deps chromium`), builds the site, runs
  `check-spec-urls.mjs --live`, serves the build with `vite preview
  --port 4173`, waits on `curl --fail http://localhost:4173/`, then
  `bun run test:e2e`
- **placement**: repo-root `e2e/` is deliberate — `scripts/` holds only
  `check:*` gates and `check:workflow` fails any `scripts/check-*.mjs` no
  package.json script runs, so an e2e helper there would trip a live gate

Each spec file and what it proves:

- `e2e/dialog-focus-trap.spec.ts` — the dialog opens as a named
  (`aria-labelledby`), modal (`aria-modal="true"`) dialog with focus already
  inside; `Tab` / `Shift+Tab` cycle past every control without ever reaching
  interactive page content behind the dialog (Base UI focus-guard sentinels
  are the mechanism, not a leak); `Escape` dismisses and returns focus to
  the trigger. Would catch removal of kern's explicit `aria-modal` or the
  trap itself — invisible to every jsdom unit test.
- `e2e/sheet-dismissal.spec.ts` — the "Right sheet" opens as a named dialog
  anchored to its side (`data-slot="sheet-content"`); `Escape` dismisses it
  for real (detached from the accessibility tree, not merely transparent);
  focus returns to the trigger; the sheet reopens after dismissal (no stuck
  exit-animation state). Pins the close affordance the repo has already lost
  once to a bad merge.
- `e2e/page-render.spec.ts` — the home page and one component detail page
  are **painted**, not merely attached: the spec rasterises the viewport and
  counts real pixels (`e2e/support/painted.ts`, thresholds 8 distinct colours
  / 1% non-dominant), plus `<title>`, exactly one `<h1>`, design tokens
  resolving to real colours, zero console errors, zero failed requests.
  Catches the white-screen class — HTTP 200 with an empty picture — that
  every other assertion in a browser suite is blind to.

Local proof 2026-10-07 against `vite preview :4173`: **9/9 green**
(3 dialog + 4 sheet + 2 page-render), so nothing is quarantined and no
tracking issue was needed. Three more specs landed since, all green in the
`e2e` CI job on `main`:

- `e2e/site-design.spec.ts` (5 tests) — desktop header/homepage controls
  usable, theme toggle persists dark across reload, phone drawer replaces
  desktop tabs, search opens/filters/restores focus, phone layouts stay in
  the viewport (incl. the `/playground` hydration case).
- `e2e/comp-overrides.spec.ts` — comp-token CSS variables resolve real
  computed styles in a real browser (fallback values + ancestor overrides);
  would fail loudly if Tailwind skipped the arbitrary-value syntax.
- `e2e/visual-baseline.spec.ts` — screenshot SEED (captures home + one
  component page to `test-results/baseline/`, asserts title/one-h1 only).
  Captures, never pins: a committed pixel baseline sight-unseen would pin
  whatever the renderer emitted.

If a spec ever goes red in CI, the rule is: fix
it or quarantine it with a tracking issue — never a silent skip.

What six specs do **not** prove: every other component in a browser, any
viewport but Desktop Chrome + phone widths, keyboard behaviour outside
dialog/sheet, or visual correctness (see §5.2 — still no visual regression;
the seed above is the precursor, not the gate).
"Some evidence" replaced "no evidence"; it did not replace a human looking
at the page.

### The spec-URL gate asserts 25 citations — and `--live` is now wired

`apps/site/scripts/check-spec-urls.mjs` runs inside `check:docs`. Measured
2026-10-07 output:

```
check-spec-urls: 204 content page(s)
check-spec-urls: 25 external citation(s) checked
check-spec-urls: inventory 37 real component page(s), 4 tab(s)
check-spec-urls: ok
```

The old "0 citations checked" paragraph is stale: 25 content pages now
record `specUrl`, so the shape/path/slug/tab/trap rules and the static
identity check all have input. The `--live` landed-page identity check
(fetch each URL, assert the landed page names the claimed component —
identity, never status code) verifies the same 25 and passes:

```
check-spec-urls --live: 25 URL(s) identity-checked
check-spec-urls --live: ok — every landed page names its component
```

**Decision (this task): WIRE, not delete.** `--live` was opt-in and
therefore dark in practice — nothing in CI ever passed the flag. It is now
an explicit step of the `e2e` job (network-bound like the specs, not a
hermetic gate), so the identity check runs on every push and PR. Deleting
was rejected: the gate is mutation-proved logic defending a class the repo
has already defended once (fabricated citations, the inverse fabrication,
the wrong-component mis-citation), and it finally has input worth
defending. If the citation count returns to zero, `--live` degrades to a
no-op pass and this section must say so again.

I could not find the "17 shell invariants" figure referenced in the 0020
dispatch anywhere in this repository — no gate, doc, or fixture uses it. Rather
than repeat a number I cannot locate or re-derive, this document states the
measured position above. If such an artifact exists elsewhere, it belongs in
this file and the omission should be corrected.

---

## 3. The nearest honest proxies

The e2e layer (§2) is real but three specs thin. These are the gates that
actually constrain behaviour, and it is worth being precise about what each
can and cannot catch.

| Proxy | Asserts | Cannot catch |
|---|---|---|
| `check:coverage` | every shipped component is exercised by at least one test | that the test asserts anything meaningful about it |
| `check:workflow` | every `check:*` gate is actually invoked by a workflow | that the gate itself is correct — it proves wiring, not behaviour |
| `check:parity` | the registry, the parity contract's counts, and cross-renderer structure agree | anything about runtime rendering |
| `check:kern` | the design law is executable: token roles exist in every scheme, no raw hex in components, radii from the shape scale, off-scale `elevation:` values | that a component looks right |
| `check:docs` / `check:typescale` / `check-headings` | site content matches the generated inventory; type roles resolve; headings are addressable | that the documented behaviour is the real behaviour |
| `check:generated` + `check:generated:census` | every generator's output byte-matches a fresh run, **and** every generated artifact in the tree is claimed by a generator | — |

`check:coverage` is the closest thing to a coverage gate and the weakest of
these as a behaviour claim: a component with one `expect(true)` passes it.

---

## 4. What this means for a PR

- **Green CI means:** types resolve, unit tests pass, the design law holds, the
  generated artifacts are current, the registry is internally consistent,
  the 25 M3 citations land on the pages they claim, and a dialog, a sheet,
  comp-token overrides, site-design flows, and painted pages were exercised
  in a real chromium.
- **Green CI does not mean:** the component was seen by a human, every
  component works in a browser, or every flow is reachable by keyboard.
  Six specs prove six things; the rest of the runtime still rests on
  jsdom and on someone driving the change.
- **Visual changes need a painted check.** Screenshot or drive the change
  yourself and say so in the PR. The painted-verify spec catches a
  white screen, not an ugly one — that step is still manual.
- **A new native render test belongs in a `.rntest.tsx`** and is only run by
  `test:native:jest` / `test:all`.

---

## 5. Known gaps, named so they are not re-discovered

These are absent, not broken. None is asserted anywhere in CI.

1. **Browser automation is six specs thin.** Dialog focus-trap, sheet
    dismissal, comp-token overrides, site-design flows, two painted pages,
    and a screenshot seed are proven (§2). No focus-trap, no
    scroll, no route resolution, no real-render evidence for anything else
    on web or site.
2. **No visual regression.** Nothing compares rendered output against a
   baseline. The elevation, colour, and typescale gates are structural; a
   regression that keeps the structure and changes the pixels passes all of
   them.
3. **`check-spec-urls` is only as good as its input.** 25 citations recorded
    and `--live` wired as of 2026-10-07 (§2). If pages stop recording
    `specUrl`, both degrade toward asserting nothing — watch the
    "N external citation(s) checked" number, not the `ok`.
4. **The two native runners can silently under-report**, as described in §1.
5. **Shell invariants are not a measured category here.** If they exist, they
   are not asserted by a gate in this repo.

## Improvements

1. ~~**Add a real e2e layer before the first release.** Even three Playwright
    specs — dialog focus trap, sheet dismissal, one full page render — would
    replace §2's "no evidence" with "some evidence", and would catch the class of
    defect no unit test in this repo can see.~~ **Done 2026-10-07** (this
    task): the three specs run in the `e2e` CI job and §2 names what each
    proves. The next step is a fourth spec wherever the next browser-only
    defect lands, not a new layer.
2. ~~**Wire `check-spec-urls --live`, or delete the gate.**~~ **Done
    2026-10-07** (this task): **wired** — `--live` is a step of the `e2e`
    job, identity-checking 25 citations. See §2 for why deletion was
    rejected.
3. **Make the runner split impossible to get wrong.** Have
   `bun run test:native` print the `.rntest.tsx` count it skipped and point at
   `test:native:jest`, so the misleading partial run announces itself.
4. **Report coverage as a floor, never as a claim.** `check:coverage` should
   print what it does not measure alongside what it does, the way this document
   does.