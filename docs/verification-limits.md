# What kern's test suite does and does not prove

Status: current · measured 2026-10-07 · every figure below re-derived from the
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
| **vitest** | `bun run test` | `@xoroh/kern-tokens` | 5 | 48 |
| | | `@xoroh/kern` (web + primitives) | 55 | 526 |
| | | `@xoroh/kern-icons` | 3 | 76 |
| | `bun run test:native` | `@xoroh/kern-native`, non-rn files | 5 | 46 |
| **jest + RNTL** | `bun run test:native:jest` | `@xoroh/kern-native`, `*.rntest.tsx` | 36 | 344 |
| **playwright** | `bun run test:e2e` | site in chromium via `vite preview` :4173 | 3 | 9 |
| | | **total** | **107** | **1049** |

The old "90 suites / 950 tests" figure (2026-10-03) is stale: the unit
suites grew and the e2e layer below is new. Re-derived 2026-10-07 by running
each command after `bun run build`: kern-tokens 5/48, kern 55/526, kern-icons
3/76, kern-native vitest 5/46, kern-native jest 36 suites / 344 tests, e2e
3 spec files / 9 tests green against a local preview (§2).

Two caveats, both measured this run:

- The vitest counts above require a prior `bun run build`. Without `dist`,
  `@xoroh/kern` fails 9 files in transform and `@xoroh/kern-native` fails
  all 5 with `Failed to resolve entry for package "@xoroh/kern-tokens"` —
  which reads as broken tests but is a missing build. CI builds before it
  tests, so CI does not hit this; a local run that skips the build does.
- The jest total includes **1 pre-existing failure** observed 2026-10-07:
  `src/components/fab-family.rntest.tsx` (343 passed, 1 failed of 344).
  It is a native-component assertion, unrelated to the e2e lane, and is
  recorded here so nobody reads the 1049 as "all green".

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

### The end-to-end suite exists and is wired — but it is three specs, not coverage

Measured, not assumed (2026-10-07):

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
tracking issue was needed. If a spec ever goes red in CI, the rule is: fix
it or quarantine it with a tracking issue — never a silent skip.

What three specs do **not** prove: every other component in a browser, any
viewport but 1400×1000 Desktop Chrome, keyboard behaviour outside
dialog/sheet, or visual correctness (see §5.2 — still no visual regression).
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
  and two pages were seen painted in a real chromium.
- **Green CI does not mean:** the component was seen by a human, every
  component works in a browser, or every flow is reachable by keyboard.
  Three specs prove three things; the rest of the runtime still rests on
  jsdom and on someone driving the change.
- **Visual changes need a painted check.** Screenshot or drive the change
  yourself and say so in the PR. The painted-verify spec catches a
  white screen, not an ugly one — that step is still manual.
- **A new native render test belongs in a `.rntest.tsx`** and is only run by
  `test:native:jest` / `test:all`.

---

## 5. Known gaps, named so they are not re-discovered

These are absent, not broken. None is asserted anywhere in CI.

1. **Browser automation is three specs thin.** Dialog focus-trap, sheet
    dismissal, and two painted pages are proven (§2). No focus-trap, no
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