# Kern roadmap gap audit — 2026-10-19 (read-only, vs origin/main `7434d369`)

**Outcome.** Audited `docs/VISION.md` (6 principles), decisions 001–020 (+021 on an
unpushed local branch), and roadmap §§F/H/I/K against `origin/main` (`7434d369`,
PR #61 kern-m3 rename merged 2026-10-17 07:01 CEST) plus the 12 open PR branches.
Headline: the **Axis cutover is done on main** (consumers on `@xoroh/axis`,
`libs/` frozen-but-present), the **kern-m3 rename landed**, and **structure work
is mid-flight across a stacked/conflicting PR set**. Nothing in §§F/H/I/K status
sections reflects post-#61 reality — the "stale since 2026-10-17" claim checks out.
No files outside this report were touched; no branch switched
(stayed on `structure/2-no-global-registration`, 3 local commits).

## Commands run + real output (short, all read-only)

- `git rev-parse origin/main` → `7434d369`; `git log --oneline origin/main..HEAD` →
  3 local commits (`c3c32e0b` structure/2, `36337e70` lint, `59388741` reports).
- `gh pr list --state open` → 12 open PRs (#59 CONFLICTING, rest MERGEABLE);
  heads recorded in §PR table below.
- `git grep -l "@xoroh/kern-primitives" origin/main -- packages apps scripts` →
  only `packages/kern-tokens/README.md` (prose) + `scripts/check-layers.mjs`
  (comments). Zero live importers.
- `git grep -l "@xoroh/axis" origin/main -- packages/kern-native/src` → 30+ native
  components; `-- packages/kern/src` → `menu-family.tsx`, `sheet-family.tsx`,
  `presentation.tsx`, `utils/assignRef.ts`.
- `git show origin/main:packages/kern/src/index.ts` → `import "@xoroh/kern-m3";`
  side-effect global registration (decision 010 violated on main; fixed in PR #67).
- `git grep -c -- --system` → zero hits on origin/main **and all 12 PR branches**.
- `git grep -n "server.tool(" origin/main -- packages/mcp/src/index.ts` → 12 tools.
- `git ls-tree origin/docs/usage-presentation-quality apps/site/src/routes/components/`
  → `$system/$component.tsx` exists (new) alongside `web/` + `mobile/` indexes.
- `git show fix/m3-fidelity:docs/decisions/` → `021-hct-primary-tonal-engine-for-m3.md`
  present **locally only** (origin/fix/m3-fidelity tip `e08c4d02` lacks it; local
  adds `a071afcc` + merge `3a088c95`).
- `gh run list --limit 8` → PR #67 runs green (`39136654304` success, matches local
  "CI 14/14" note); PR #69/#70/#71 runs fail in ~12s–2m (12 Oct-19 runs, all
  `failure` on those three branches).

## Acceptance 1 — VISION principle × decision matrix

Legend: **DONE** (on origin/main) / **IN PR #n** / **NOT STARTED**. Evidence is
`origin/main` file:line or `origin/<branch>` path.

| # | Principle / decision | Verdict | Evidence |
|---|---|---|---|
| V1 | Each system owns its components | DONE (structure mid-flight) | `packages/kern` (M3 web) + `packages/kern-native` (M3 native) + `packages/kern-m3` (preset) on main; no shared themed renderer package exists (`git ls-tree origin/main packages/` = 8 pkgs, no `kern-web`/`kern-native-shared`). Full per-system split (010/017) completes in PR #67 |
| V2 | Two doors: npm + CLI vendoring | PARTIAL — IN PR #60 | CLI `kern add/list/diff/upgrade` works on main (`packages/kern-cli/src/kern.ts`: "vendored components (Mode 1) + dependency install (Mode 2)"); packed-outside-checkout reads bundled `registry.json` (`packages/kern-cli/src/manifest.ts:72-112`). npm door correctly shut pre-release. What's missing: install docs put source-first only in PR #60 (main's `getting-started.tsx:150-152` still checkout-implied); `--system` flag nowhere (see 009) |
| V3 | AI-first (metadata, MCP, CLI, llms.txt) | DONE on main, `--system` missing | 12 `server.tool(` in `packages/mcp/src/index.ts:33-143`; generated `manifest.ts` (COMPONENTS inventory); `apps/site/public/llms.txt` generated + per-page `.md` + `/mcp/index.json` (`apps/site/package.json:16` generate chain). MCP reads checkout files via `KERN_REPO_ROOT`/dist-relative (`packages/mcp/src/tools.ts:45-60`) with "published bundles will inline" note — inlining not yet done |
| V4 | Tokens follow DTCG | DONE | `packages/kern-tokens/src/dtcg/{export,import,validate,shared,retained}.ts` + `DTCG_SPEC_VERSION = "2025.10"` (`shared.ts`); checked-in `src/dtcg.json`; validation via `validate.ts` + `dtcg.test.ts` |
| V5 | Kern consumes Axis for native behavior | DONE (consumers), libs/ deletion pending | `kern-native` + 3 web files import `@xoroh/axis` (vendored `vendor/axis/axis-bed35547.tgz`, `file:` spec); zero live `@xoroh/kern-primitives` importers; `libs/kern-primitives/` still present + in `workspaces` (`package.json` root). KERN-WEB relocation done (`packages/kern/src/components/web-behavior.ts:1-30`) |
| V6 | Prefer OSS, no monoliths | DONE | Deps are small OSS (`base-ui`, `cva`, `clsx`, `tailwind-merge`, `react-native-svg@15`); 8 independent packages |
| 001 | ESM+CJS dual output | DONE | `packages/kern/package.json`: `main`+`module`+`types`, exports `.`, `./theme`, `./styles`, `./tokens`, `./utils`, `./start`; `check:publish` (publint+attw) gates |
| 002 | Base UI for web only | DONE | `@base-ui/react` dep of `@xoroh/kern` only (`packages/kern/package.json`); `check:layers` enforces `start/`→`@xoroh/kern` only |
| 003 | Generated inventory | DONE | `packages/mcp/scripts/generate-manifest.mjs` → `manifest.ts` + `docs/components.md`; committed + CI-diffed |
| 004 | 1.0 stability carve-out | PROPOSED (unchanged) | Still `proposed, pending founder sign-off`; 020 operationalizes the pre-1.0 half |
| 005 | Theming pipeline | DONE | `pipeline.ts`, `themes/matrix.json`, `check:theme-matrix`, compact preset pattern all on main |
| 006 | Distribution engine (CLI vendoring) | DONE (engine), `--system` missing | `kern add` closure works; no `--system` anywhere (see 009) |
| 007 | Axis native foundation | DONE (consumer side) | See V5 |
| 008 | System-scoped URLs | SUPERSEDED by 018; 018 IN PR #60 | Main still serves `/components/$platform/*` + `web/` + `mobile/` (`apps/site/src/routes/components/`); PR #60 adds `$system/$component.tsx` but KEEPS `web/`+`mobile/` indexes (not the 018 one-page-with-tabs yet) |
| 009 | One registry + `--system` | HALF — registry DONE, `--system` NOT STARTED | Single live registry proven: `packages/mcp/src/manifest.ts` (workspace) + `packages/kern-cli/src/registry.json` (same rows + version/releaseSet, `manifest.ts:7` "emitted by generate:components alongside the manifest"); site reads generated sources. `--system`: zero hits on main and all 12 PR branches |
| 010 | kern-m3 rename + no global registration | HALF — rename DONE, registration IN PR #67 | `packages/kern-m3/` exists, `kern-material-3` gone, no alias (`ls-tree packages/`); preset is platform-free (deps: only `@xoroh/kern-tokens`). BUT `packages/kern/src/index.ts:5` still `import "@xoroh/kern-m3"` side-effect on main → fixed by PR #67 (`registerM3()` explicit + `entry-purity.test.ts` + `check:layers` rule, CI 14/14 green) |
| 011 | Install docs honesty | PARTIAL — IN PR #60 (+ unpushed local branch) | Main `getting-started.tsx:150-152`: "resolves from a checkout — the registry command runs at release" (honest but not source-first). PR #60 rewrites to "Source path first — available now … Registry path — available at release". Local-only `fix/preview-install-honesty` (banner + at-release marking, `4f58f390`) is NOT in any open PR |
| 012 | CLI publishable in 0.1.0 | DONE (manifest state) | `@xoroh/kern-cli` publish-shaped, 8 public packages; hold still on (no publish) |
| 013 | Docs depth (top-20 + thin pages) | IN PR #60/#62, bar not recorded | No top-20 list file on main (only mentions in 013/README/roadmap). PR #60 adds m3 family pages + depth; PR #62 drives undocumented-exports to zero (check-docs coverage gate now fails → burn-down in progress). Thin-page contract: no `thin` contract text found in gates |
| 014 | Button variant names | NOT STARTED (aliases live on main, all PRs) | Canonical `filled/tonal/outlined/text/elevated` present AND `BUTTON_VARIANT_ALIASES` still in 9 files (web+native `button.tsx`, `link-button`, `loading-button`, `index.ts`, size tests) on main AND on fix/m3-fidelity, render-adoption, usage-presentation PRs |
| 015 | State props follow Base UI | DONE | `onCheckedChange`/`checked` verified in `packages/kern-native/src/components/checkbox.tsx:73-101`; web mirrors |
| 016 | HCT tonal palettes | SPIKE on main, CUTOVER local-only | Main: no `@material/material-color-utilities` dep (`kern-tokens/package.json` deps = only fontsource). Local `fix/m3-fidelity@a071afcc` adds the dep + cutover (`seed-theme.ts` −153/+…, `hct.ts`, ADR-021) — unpushed, and the branch CONFLICTS with main (pre-rename base) |
| 017 | Per-system preset + per-platform widgets | DONE (M3 shape) | `kern-m3` (preset, platform-free) + `@xoroh/kern` (web) + `@xoroh/kern-native` (native); no shared-widget package; no second system yet (correct — M3 first) |
| 018 | One page per component, Web/Native tabs | IN PR #60 (partial) | See 008: `$system/$component.tsx` added but platform indexes retained; tabs not verified |
| 019 | AI chat parts in Kern | NOT STARTED | Zero `chat` hits in `packages/kern/src` + `packages/kern-native/src` on main; no chat branch among the 12 PRs. Correct per D-AI-CHAT (post-structure), but the placement ADR has no execution lane yet |
| 020 | No backward compat | DONE on main, enforced going forward | Hard rename `kern-m3` with no alias; `BUTTON_VARIANT_ALIASES` is the known remaining violation (014 covers its removal); only redirect on main is the canonical-slug part→family (`$platform/$component.tsx:58`), not legacy-compat |
| 021 | HCT primary tonal engine | LOCAL ONLY (unpushed) | `docs/decisions/021-hct-primary-tonal-engine-for-m3.md` exists only on local `fix/m3-fidelity`; origin PR #59 branch lacks it. Needs rebase onto post-#61 main + review |

## Acceptance 2 — targeted verifications (a–l)

- (a) Each system owns its components: **yes**. No `kern-web`/`kern-native-shared`
  themed renderer; the only cross-system code is the Axis/preset/token layer, all
  neutral. Residual: `libs/kern-primitives` directory + workspace entry remain
  (frozen, zero importers) — deletion is the last cutover step, still open.
- (b) DTCG: **yes** — document (`src/dtcg.json`), export/import/validate/retained
  modules, spec pin `2025.10`, tests.
- (c) npm + `kern add`: npm door shut (correct, unpublished); `kern add`
  vendors with closure + receipts + `list/diff/upgrade`; packed CLI falls back to
  bundled `registry.json`. **No `--system` flag** on any branch — the one gap.
- (d) AI-first: metadata (`ComponentEntry` manifest, `ComponentRecord` contracts),
  **12 MCP tools**, `llms.txt` + per-page `.md` + `/mcp/index.json`, all generated.
  MCP server still reads checkout files at runtime (inline-registry TODO open).
- (e) Single registry: **yes, exists** — workspace `manifest.ts` ⇄ bundled
  `registry.json` (same generator, `releaseSet` pinned). Site/CLI/MCP consume it.
  Only the `--system` selector is missing.
- (f) URLs: main = old platform shape; PR #60 = `$system` route added, platform
  indexes still present, no tab consolidation yet. 020 tension (redirects) noted
  in the ADR itself — owner ruling still needed before the URL migration lands,
  and PR #60 keeps both shapes alive (flag: pick 018 tabs, delete the old).
- (g) `libs/kern-primitives`: present, frozen, zero live importers (only prose/
  comment mentions). Web KERN-WEB relocation done. Deletion PR is the remaining
  step (blocked on nothing — can go once #67 + vendor refresh merge).
- (h) kern-m3 preset: platform-free (single dep `kern-tokens`); web/native widget
  packages separate per 017. **DONE.**
- (i) Install docs: honest on main, source-first wording in PR #60; banner work
  sits on a local-only branch (needs a PR or port).
- (j) Docs depth: top-20 list + thin-page contract **not recorded anywhere**;
  PRs #60/#62 do the content burn-down without the bar file.
- (k) Button names: canonical names shipped, **old aliases still live** (9 files).
- (l) AI chat: **nothing built** (correct sequencing — post-structure).

## Acceptance 3 — roadmap cross-check (§§F/H/I/K on origin/main `7434d369`)

Roadmap status sections describe pre-#48/#61 reality (baseline SHA `f0774ae7`,
PRs ≤#23, `kern-material-3` name). Stale-confirmed. Item-by-item:

**§F.1 (do first):** KERN-001 (ownership map) — superseded by per-PR reports, close it.
KERN-003 (capability inventory) — DONE via generated manifest/registry (003/009).
KERN-004 (Xoroh freeze) — still correctly downscoped/out-of-scope. KERN-006
(planning validation) — DONE (this plan + archive index exist). KERN-063
(community polish) — still valid, Phase-6 tail.

**§F.2 (blocked):** KERN-007/016 (approvals) — still valid framing; KERN-029/059
(device/SR) — still open, D-DEVICE methodology stands, zero device runs anywhere.
KERN-078 (19 GHSA vs zero-alert) — carry: verify once, don't re-litigate.
KERN-083/084 (NO-GO/publish) — still unsigned, HOLD intact. KERN-064–075 (P7) —
still excluded.

**§F.3 (defect backlog):** mostly DONE-or-moved: M3 coupling/`--comp-*` counts need
re-measure post-#61 (still valid as re-verify); `libs/`-move fallout DONE;
CLI `init` staleness → check against PR #65-adjacent work (carry); MCP preset-rename
test health DONE (tests green per #67 CI); icons F-01–F-06 → carry into #60/#62
lane (unverified here); theming stages → superseded by HCT cutover lane (#59);
AUD-001/`kern.json` renderer defect → re-verify on current main (carry);
stale `architecture.md`/`releases.md`, F1 form scope, `docs/plan` row 11 → carry,
small.

**§F.4 invariants:** all still valid as standing gates; `check:layers` extended
(#67), `check:props` BASELINE=471 on main (`check-props.mjs:96-97`) — H-18's
474-row note is stale numbers, live class of issue remains.

**§H:** H-01 (lint) DONE; H-02 (CI red) → re-verify: #67 green 14/14, but #69/#70/#71
runs failing ~12s–2m on 2026-10-19 (new red, needs triage — likely gate/fast-fail,
not the old 7-job signature); H-03 (hydration #418) DONE-fixed, hosted-confirm via
current runs; H-04 (open PRs) → the 12-PR list in this report supersedes it;
H-05 (dependabot majors) carry; H-06/07/08 (publish rights/approver/envs) unchanged,
still pre-release-gated; H-09 (web assumptions in Axis) DONE for the transferred
set (KERN-WEB relocation); H-10 (device gap) still open; H-11 (DTCG drift) gated
(zero-`--*` gates on main); H-12 (advisories) carry one-line re-verify; H-13
(ledger trust) → this audit is the re-verification; H-14 (preserved work) → local
`fix/preview-install-honesty` + stashes need disposition (see below); H-15 (dup
React) carry to pack-proof; H-16 (CLI/MCP closure) DONE except `--system`;
H-17 (CLI privacy) DONE-superseded by D-CLI-PUBLISH; H-18 (check-props 474 vs 471)
→ numbers stale, class alive (BASELINE 471 on main).

**§I:** D-NAME/D-DEP/D-FOUNDATION/D-STACK/D-SPLIT/D-DTCG/D-DEVICE/D-RELEASE/D-NOGO/
D-GHSA/D-P7 positions all still stand. D-STRUCTURE: rename third DONE (#61),
registry DONE, `--system` NOT STARTED, no-global-registration IN #67,
10+-systems shape DONE for M3. D-URLS: IN #60 partial (needs 018-tabs ruling +
020-redirect ruling). D-CLI-PUBLISH/D-AXIS-SHIP: stand; vendor at `bed35547` on
main, `82c3179` in #63/#66 (duplicate pair — land one, close the other).
D-AI-CHAT: stands, unstarted (correct). D-DOCS-DEPTH: bar file missing, content
in #60/#62. D-BUTTON-NAMES: NOT STARTED (aliases live). D-HCT: spike done,
cutover local-only (#59 conflicted).

**§K (11 criteria):** (1) Axis package — Axis-repo side, not verified here;
(2) native-mobile proof — device runs still missing; (3) `libs/` deletion — OPEN
(zero importers achieved, dir remains); (4) M3 preserved — yes; (5) neutral-only
sharing — yes (KERN-WEB relocated); (6) no dup/stale refs — `axis-bed35547`
current on main, `workspace:*` check carry; (7) clean-clone CI — #67 green is the
latest proof; (8) H-items — see above; (9) docs truthful — in flight (#60/#62);
(10) histories coherent — 12 open PRs + local-only branches need landing order
(see below); (11) HOLD intact — yes.

## Acceptance 4 — ordered "what's left to Preview 0.1.0 (near-Alpha)"

Smallest-PR granularity; merge in this order (each unblocks the next):

1. **Land ONE vendor refresh (#63 or #66, close the other).** Identical
   `bed35547→82c3179` + `check-stale-tarball.mjs`. #69/#71 both bundle the same
   swap — rebase them after.
2. **Land #67 (structure/2, no global registration).** Green 14/14. Unblocks
   010 DONE, entry-purity gate, and every theme-touching PR.
3. **Rebase + land #59 (fix/m3-fidelity) or split it.** CONFLICTING (pre-rename
   base). Contains ADR-021 + HCT cutover (local-only commits) — the XL item.
   Suggested split: (3a) HCT cutover + 021 first, (3b) fidelity states after.
   Until this lands, 016 stays "spike".
4. **Land #60 (usage/presentation) + #62 (gate1 zero-exports) + #64/#70 (site A/B).**
   Docs-depth content; record the **top-20 list + thin-page contract** file
   (013 bar) as part of #60 — one small commit, currently missing everywhere.
5. **Button-alias removal PR (014 hard cut, new).** Delete
   `BUTTON_VARIANT_ALIASES` in 9 files + codemod site/tests/docs. Nothing covers
   this — smallest standalone PR in the list.
6. **`--system` flag PR (009 remainder, new).** CLI `add/list` + MCP tools accept
   `--system` (default `m3`); registry already carries what it needs. Small.
7. **URL consolidation PR (018, new, needs two owner rulings).** Tabs at
   `/components/<system>/<name>`; delete `web/`+`mobile/` duplicates that #60
   keeps; rule on 020-vs-redirects tension explicitly.
8. **`libs/kern-primitives` deletion PR (new, small).** Zero importers already;
   remove dir + workspace entry + `LEGACY_REL` shims in `check-primitives.mjs`.
9. **Land #65 → #68 (theme toggle → Hero/TopBar/SiteFooter) and #69 → #71
   (render adoption → Toast/Portal).** Both stacks are MERGEABLE but their CI
   runs are red as of today — triage the ~12s fast-fail first (probably gate
   fallout from #61 rename or stale tarball, not code).
10. **Port or PR the local `fix/preview-install-honesty` branch** (banner +
    at-release marking) — currently invisible to every open PR.
11. **AI chat (019): no code until 1–8 land** (per D-AI-CHAT). First slice when
    ready: M3 message/markdown/typing-indicator parts.
12. Publish-hygiene tail: H-06/07/08 answers, H-12 one-line re-verify, device
    matrix-or-waiver (D-DEVICE), then Preview bar judgment per `.team/rules.md`
    DoD (screenshots, user-eye check, dogfood, Lighthouse, cross-review, lesson).

Dependencies: 1 → (rebase 9b) → 2 → 3 → 4/5/6/7/8 (parallelizable) → 9 → 10 → 12.

## What's still weak (honest)

- The 12-PR stack has **no landing order recorded anywhere**; #59 conflicts,
  #63/#66 duplicate, #69/#71 embed the vendor swap, #70 stacks on #64, #68 on
  #65. Without the order in §"Acceptance 4", merges will collide.
- #69/#70/#71 CI is red today and nobody has triaged it (12s failures smell like
  a gate/fast-fail, possibly rename fallout — 10 minutes to confirm, still undone).
- Two pieces of work live **only on local branches** (ADR-021 + HCT cutover on
  `fix/m3-fidelity`; install-honesty banner on `fix/preview-install-honesty`) with
  no PR carrying them — exactly the H-14 loss-risk class.
- The 013 bar (top-20 list) and 009 `--system` are decisions with **zero
  executing artifacts** — accepted but never scheduled.
- Roadmap §§B/H still narrate the `f0774ae7`/PR-#23 world; after this audit the
  cheapest fix is a freshness addendum pointing here, not a rewrite.

## Gaps for other leads

- **Axis Lead:** consumer side is done (30+ native files on `@xoroh/axis`), but
  Kern pins `axis-bed35547` while two Kern PRs carry `82c3179` — confirm what
  changed in `82c3179` (Toast/Portal/Render APIs that #69/#71 need?) and bless one
  vendor PR. Also: Axis `docs/decisions/010-ai-chat-models.md` exists per the
  roadmap footnote — verify it matches Kern 019 before either side builds chat.
- **Site Lead:** install-honesty banner work is local-only (`fix/preview-install-
  honesty`); #60 already rewrites the install copy — coordinate so the banner and
  copy land together, and confirm the 018-tabs vs 020-redirects ruling with the
  Kern Lead before #60 grows a second URL shape it must later delete.

## Suggested next item

Triage the #69/#70/#71 red runs first (10-minute job, unblocks two stacks), then
land the vendor refresh (#63 vs #66 — pick one, close the other) and #67 in that
order. Everything structural (HCT, aliases, `--system`, URLs, `libs/` deletion)
rebases cleanly only after those three are on main.
