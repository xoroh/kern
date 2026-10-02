# What kern's test suite does and does not prove

Status: current · measured 2026-10-03 · every figure below re-derived from the
repo, not carried forward

**Read this before treating a green CI run as evidence about behaviour.** This
file exists because "the tests pass" and "the thing works" are different claims,
and this repo's CI is evidence for the first and only partly for the second. A
contributor who trusts CI green more than this document allows will ship a
regression the suite was never able to catch.

---

## 1. What actually runs

Two runners, both real, both in CI on every push and PR.

| Runner | Command | Scope | Suites | Tests |
|---|---|---|---|---|
| **vitest** | `bun run test` | `@xoroh/kern-tokens` | 5 | 47 |
| | | `@xoroh/kern` (web + primitives) | 44 | 455 |
| | | `@xoroh/kern-icons` | 3 | 76 |
| | `bun run test:native` | `@xoroh/kern-native`, non-rn files | 4 | 41 |
| **jest + RNTL** | `bun run test:native:jest` | `@xoroh/kern-native`, `*.rntest.tsx` | 34 | 331 |
| | | **total** | **90** | **950** |

`bun run test:all` runs all five commands. CI runs the same set per package with
the working directory set to that package, so a failure names the package.

### The two-runner split is a trap worth knowing

`kern-native` is tested by **both** runners, and they do not overlap:

- `bun run test:native` (vitest) runs only files that do **not** end
  `.rntest.tsx`
- `bun run test:native:jest` runs **only** `*.rntest.tsx`

Running the wrong one is not a partial signal, it is a **misleading** one: a
`*.rntest.tsx` suite looks absent rather than failing, and "41 tests" reads as
coverage when 331 were skipped. This has already cost a cycle in this repo. If
you add a native render test, it goes in a `.rntest.tsx` file and only
`test:all` or `test:native:jest` will ever see it.

---

## 2. What never runs

### There is no end-to-end suite. There never has been.

Measured, not assumed:

- **no** e2e/browser runner is declared in any `package.json` — no Playwright,
  Puppeteer, WebdriverIO, or Cypress, at any version
- **no** test file matches `.e2e.*`, `.spec.*`, or an `e2e/` directory
- **no** CI step launches a browser

So there is **no** automated evidence that any component works in a real
browser: no assertion that a dialog traps focus, that a sheet scrolls, that a
route resolves, or that the site builds and renders a page end to end. Anything
this document implies about runtime behaviour rests on jsdom and on the
component's own unit tests.

`apps/site` does **build** in CI (`vite build`), which proves the bundle
compiles and the route tree generates. It proves nothing about what renders.

### The spec-URL gate asserts nothing today

`apps/site/scripts/check-spec-urls.mjs` exists and is wired into `check:docs`.
Measured output:

```
check-spec-urls: 0 external citation(s) checked
check-spec-urls: inventory 37 real component page(s), 4 tab(s)
```

**Zero** of the site's content pages currently set `specUrl` — the only match
for that key anywhere under `apps/site/src/content/` is its declaration in
`types.ts`. So the gate verifies that a 37-slug inventory file has no entry
pointing at a missing M3 path, and nothing else. The `--live` identity check it
documents (fetch each URL, assert the page names the component) is **not** run
by CI. Treat "spec URLs verified" as unverified.

I could not find the "17 shell invariants" figure referenced in the 0020
dispatch anywhere in this repository — no gate, doc, or fixture uses it. Rather
than repeat a number I cannot locate or re-derive, this document states the
measured position above. If such an artifact exists elsewhere, it belongs in
this file and the omission should be corrected.

---

## 3. The nearest honest proxies

There is no e2e layer. These are the gates that actually constrain behaviour,
and it is worth being precise about what each can and cannot catch.

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
  generated artifacts are current, and the registry is internally consistent.
- **Green CI does not mean:** the component was seen by a human, works in a
  browser, or is reachable by keyboard. No automated layer here can tell you
  any of that.
- **Visual changes need a painted check.** Screenshot or drive the change
  yourself and say so in the PR. That step is manual in this repo by necessity,
  not by oversight.
- **A new native render test belongs in a `.rntest.tsx`** and is only run by
  `test:native:jest` / `test:all`.

---

## 5. Known gaps, named so they are not re-discovered

These are absent, not broken. None is asserted anywhere in CI.

1. **No e2e / browser automation.** No focus-trap, no scroll, no route
   resolution, no real-render evidence for web or site.
2. **No visual regression.** Nothing compares rendered output against a
   baseline. The elevation, colour, and typescale gates are structural; a
   regression that keeps the structure and changes the pixels passes all of
   them.
3. **`check-spec-urls` asserts 0 citations.** Its documented `--live`
   identity check is not wired.
4. **The two native runners can silently under-report**, as described in §1.
5. **Shell invariants are not a measured category here.** If they exist, they
   are not asserted by a gate in this repo.

## Improvements

1. **Add a real e2e layer before the first release.** Even three Playwright
   specs — dialog focus trap, sheet dismissal, one full page render — would
   replace §2's "no evidence" with "some evidence", and would catch the class of
   defect no unit test in this repo can see.
2. **Wire `check-spec-urls --live`, or delete the gate.** A gate that asserts
   zero things while presenting as a verification is worse than no gate: it
   occupies the slot where a real check would go. This is the same
   "passes because it never looked" class as the generated-artifact census gap.
3. **Make the runner split impossible to get wrong.** Have
   `bun run test:native` print the `.rntest.tsx` count it skipped and point at
   `test:native:jest`, so the misleading partial run announces itself.
4. **Report coverage as a floor, never as a claim.** `check:coverage` should
   print what it does not measure alongside what it does, the way this document
   does.