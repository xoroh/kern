# Quality and release gates

Status: proposed release standard plus **inspected existing commands**. Current results are only those actually run in [CURRENT_STATE.md](CURRENT_STATE.md). Passing audit-history commands are not fresh passes. Every release ledger entry records command/cwd/exit/time/artifact hash/environment/test count and limitations.

## Existing executable baseline

Commands in this table exist in inspected package scripts or as actual files. Unless measured in CURRENT_STATE, their result is **not run here**. Build/generation/preflight may write artifacts; run only with authorized ownership or in a disposable copy. Never run root `check:cold` in the dirty checkout: it deletes dependency/dist directories. `check:generated` regenerates/restores bytes and must not run concurrently with user/site edits.

| Gate / exact invocation from root unless noted | Success means | Blocks release? |
|---|---|---|
| `bun install --frozen-lockfile --ignore-scripts` (disposable/CI) | cold deterministic dependency resolution; needed lifecycle operations individually reviewed | yes; isolate, don't install over user's dirty lockfile |
| `bun run lint` | Biome check, no blocking errors; formatter **not** `--write` | yes; distinguish pre-existing dirt and modified ownership |
| `bun run typecheck` | five library TS projects exit0 | yes, but incomplete alone |
| `bun run --filter @xoroh/kern-cli typecheck`; `--filter @xoroh/kern-mcp typecheck` | tooling type surfaces exit0 | yes; root omits these |
| `bun run --cwd apps/site typecheck`; `--cwd apps/mobile typecheck` | built-declaration/site and mobile typechecks exit0 | yes; needs current dist prerequisite |
| `bun run test:all` | tokens/primitives/web/icons + native Vitest + native Jest nonempty suites pass | yes; both native runners mandatory |
| `bun run --filter @xoroh/kern-cli test`; `--filter @xoroh/kern-mcp test` | installer and MCP suites pass | yes; root test:all omits them |
| `bun run test:scripts` | codeowners/script suite passes | yes |
| `bun run check:layers`; `check:primitives`; `check:consumption` | no forbidden/upward edges, primitive graph reachable, every adoption disposition reasoned | yes; 11 deliberate unadopted exports aren't an automatic defect |
| `bun run check:kern`; `check:elevation-parity`; `check:currency` | true design law and in-repo provenance held, no false-positive prose or unresolved required elevation rulings | yes after parser/ruling fix; report-only omissions also need disposition |
| `bun run check:coverage`; `check:parity`; `check:registry-paths` | binding/helpers correctly classified; counts/exports/paths and behavioral rulings agree | yes; counts alone don't prove all variants |
| `bun run check:contrast`; `check:theme-matrix` | role pair checks/waivers valid and 30 expected cells/deltas in sync | yes |
| `bun run icons:check` | source paths/grid/boundary/generated freshness/reachability checks valid | yes; reachability report is not bundle-size proof |
| `bun run check:generated:census`; `check:ts-policy`; `check:stale-refs`; `check:workflow` | generated files accounted, TS pins true, no stale package refs, scripts wired in CI | yes |
| `bun run build:locked` | authorized locked root build and generators succeed without race | yes; snapshot artifact lineage |
| `bun run check:generated` in disposable snapshot | generators produce no unexpected diff | yes; inspect generator inputs, don't overwrite owned tree |
| `bun run check:dist`; `check:dist:types`; `check:pack`; `check:publish`; `preflight:publish` after build | existing exports/types/tarballs/ranges pass known checks | yes, but consumer installs still required |
| `node apps/site/scripts/check-blocks.mjs` | current block manifest/import/files/export constraints true | yes; target closure tests added separately |
| `bun run --cwd apps/site check:docs`; `check:gallery`; `check:snippets` | all current docs/gallery/snippet routes/machine outputs agree with built APIs | yes; RN preload required by scripts; fixes owned by site executor |
| `bun run --cwd apps/site build` | docs/preview machine artifacts and production application build | yes |
| `bun run test:e2e` | existing Playwright dialog/sheet/page tests pass against configured host | yes; `e2e/playwright.config.ts`, configured preview prerequisite inspected before execution |

Mobile CI currently invokes nonexistent `bun run bundle`; `KERN-012` adds a real script (recommend Expo export to a disposable output), then `.github/workflows/ci.yml` must invoke it and record Metro result. Do **not** claim a current `bundle` command exists because CI refers to it.

## Required new coverage (not runnable root scripts today)

Implementation tasks add actual test files/scripts and wire CI before these become gates. Suggested script names below are **proposed**, not commands this plan ran or assumed present. Each new gate has a negative fixture proving it can fail for its intended defect.

| Proposed gate/task | How run once implemented | Measurable pass / blocker |
|---|---|---|
| Foundation schema/reference goldens, `KERN-017`/018/021/022 | token Vitest tests + proposed `check:tokens-schema` | all foundations/types/references/cycles/units and 30 context values preserved; any unapproved diff blocks |
| DTCG roundtrip/import/export, `KERN-019`/020 | token adapter tests + proposed `check:dtcg` | standards-valid fixtures, full mapping, semantic value+alias roundtrip, unsupported/loss errors; no silent dropping; blocks |
| Theme host/seed/preset scope, `KERN-023`/029/066 | web theme Vitest + native RNTL + browser/device scenarios | controlled/OS/storage/contrast/nested presets/reduced motion remain live; blocks |
| Provider/export/capability contracts, `KERN-024`/025/032/049 | renderer suites + proposed `check:contracts` | every public UI/helper capability linked to real test or reason; falsified metadata rejected; blocks |
| Full family behavioral/a11y, `KERN-027`–029/070–073 | web testing library/axe + native RNTL and live accessibility session | keyboard/back/focus/name/value/error/disabled/modal isolation and product scenarios; required failures block |
| Icon rendering, `KERN-030`/031/067 | proposed `test:icons:render`; actual DOM SSR/browser + RN SVG RNTL/device | every semantic alias resolves, fill/size/RTL/decorative/meaning matches, no web RN dependency; blocks |
| CSS consumer fixture, `KERN-033`/044 | packed styles in Vite/SSR with and without Tailwind | all variant/state classes/keyframes/variables exist; computed color/geometry/override order match goldens; blocks |
| CLI graph/transaction/receipts/upgrades, `KERN-036`–041/047 | CLI Vitest fixtures + spawned packed bin | complete relative/self/package/asset/platform closure; failed/late conflict leaves files unchanged; customized source preserved; blocks |
| Block closure, `KERN-040`/053 | registry negative DAG fixtures + all three block installs | both modes compile/render with required symbols, unsupported native early refusal; real advertised native block passes; blocks |
| MCP stdio/standalone, `KERN-050`–056 | spawned packed server in no-checkout temp app | all declared tools return accurate platform/source/tokens/icon/blocks/plans/errors; performed vs unavailable truthful; blocks |
| Consumer matrix, `KERN-043`–046/074 | proposed `test:consumers` runner installing **tarballs** | standalone + workspace web/RN, package/hybrid/snapshot, compiled CSS/Metro/peers/types; no private paths/aliases; blocks |
| Visual regression, `KERN-059`/079 | Playwright `toHaveScreenshot` baseline suite, native approved screenshots | reviewed deterministic key-state/theme/RTL baselines, actual diff assertions not seed-only PNGs; required differences block |
| Accessibility breadth, `KERN-059`/078 | family/page axe assertions + keyboard manual scripts, native screen readers | no critical/serious violations in supported scenarios; contrast/touch/200% text/no-motion; documented approved exceptions only; blocks |
| License/security/provenance, `KERN-077`/078 | proposed `check:licenses`/artifact SBOM + bounded dependency audit | MIT/upstream notices/licenses actually in artifacts, no secrets/private app code, known critical security findings resolved; blocks |
| ReleaseSet/artifacts, `KERN-079`/080 | pack listing/hash/integrity + registry compatibility tests + changeset dryrun in disposable copy | complete source/runtime/types/CSS/native/assets/licenses, internal ranges coherent, CLI/MCP bins work without checkout; blocks |

## Coverage isn't a filename count

Coverage gate currently fails `presentation` classification; exempt it **with binding tests**, not exclude presentation-layer behavior wholesale. Each public export/capability has observable acceptance or justified no-counterpart. Track coverage by behavioral families/states/renderer and exact export manifest; raw percentage is supplemental. No arbitrary coverage percentage target is invented from the audits. Nonempty required suites matter: parent accounts `--passWithNoTests` is insufficient product evidence.

Visual comparisons record fonts/browser/OS/theme/viewport and approved tolerance; a baseline update requires design approval, not automatic acceptance to make CI green. Device gesture and accessibility cases cannot be substituted by RN mocks/RN-web. Timings reduced for deterministic screenshots must not remove separate motion tests.

## CI/release execution

Run existing source/policy/unit gates first; build locked; run generated/dist/tarball checks; then consumers, E2E/native/device, docs, license/security/product acceptance. Expensive platform jobs can fan out over immutable artifact hashes; prevent generators/builders racing over shared dist. Add CLI/contracts to matrices and test/root aggregation, never just the job label. Capture cold isolated checkout results in CI; dirty working tree being nonempty is not itself a failure, but release evidence must identify the exact candidate bytes.

## 0.1.0 Preview NO-GO checklist

- [ ] All P0/P1 tasks and mission-required P2 deliverables completed with their acceptance evidence; no known consumer/data-safety defect waived as polish.
- [ ] Approved Material default + Xoroh compatibility themes, 30-cell goldens, DTCG full foundation import/export/reference tests, web/native outputs and a11y pass.
- [ ] Preserved public components/variants/icons and explicit tested platform mappings/exceptions; native font/theme/Metro/modal/gesture scope proven.
- [ ] Compiled public CSS, all package artifacts/export conditions/licenses/source payloads and CLI/MCP independently consume/install in both layouts.
- [ ] Native source installation, complete block/component dependency closure, customized-file-safe upgrades and rollback tested.
- [ ] Machine docs/metadata match actual exports and tools; no static checklist reported as executed validation.
- [ ] Xoroh canaries and grouped product rollout accepted, private-only generic paths removed, domain adapters legitimate, rollback rehearsed and feedback owned.
- [ ] Existing plus newly added gates run on the actual release candidate; baseline failures cannot be relabeled passes. Release notes state Preview instability and intentional limitations.
- [ ] Namespace/IP/licenses/security/support/governance approved; no secrets in code/artifacts; reproducible releaseSet artifact hashes recorded.
- [ ] Owner explicitly lifts HOLD and authorizes versioning/publication. Planning or green CI does not authorize `npm publish`, pushing Git or setting `RELEASE_CHANGESSETS`.

P2 polish tasks may remain only if their deliverables are not required by this checklist and the owner records the accepted risk. Do not postpone essential native/DTCG/standalone/source/Xoroh scope behind the word Preview.
