# Kern–Axis Migration and Roadmap — Authoritative Plan

Status: **active — the single source of truth.** Created 2026-10-16.
Supersedes `docs/architecture/0.1.0-preview-redesign.md` and the entire
`docs/planning/` + `docs/plan/` effort, archived with index at
`docs/archive/2026-10-axis-transition/ARCHIVE_INDEX.md`.
Do not implement from archived files.

How to use this document: execute phases in order (§E). Each phase lists
entry conditions, tasks with acceptance criteria, and exit gates. §J gives the
exact validation commands (derived from manifests and workflows — never
invented). §H is the issue/risk register, §I the decision register. If a fact
below disagrees with the repository, the repository wins: re-verify, record
the discrepancy, and proceed.

Conventions: **Verified** = observed by the planning agent via read/git/gh/npm
on 2026-10-15/16. **Reported** = claimed by an earlier artifact, not
re-observed. **Unverified** = could not be established. SHAs and counts are
point-in-time; Phase 0 re-pins them.

---

## A. Executive summary

**Goal.** Extract Kern's existing primitives implementation
(`libs/kern-primitives`, private `@xoroh/kern-primitives`) into **Axis**
(`xoroh/axis`), an independent, mobile-native (React Native, Expo-hosted)
primitives project published as **`@xoroh/axis`**; migrate Kern to consume
Axis through its public package interface; and carry the remaining Kern
roadmap to completion — ending with two independently maintainable projects.

**Intended architecture.** Kern remains the open-source, AI-native design
foundation — *"One foundation. Every design system."* — owning tokens (with
DTCG 2025.10 interchange), Material Design 3 implementations for web
(`@xoroh/kern`, Base UI behavior + Tailwind v4 styling) and native
(`@xoroh/kern-native`, StyleSheet + tokens), icons, contracts, CLI source
vendoring, MCP/AI surfaces, docs, and blocks. Axis owns composable,
design-system-neutral, native-mobile behavior primitives (Base UI as
*architectural inspiration only* — composable responsibilities, accessible
interaction, controllable behavior — never its DOM platform). Dependency
direction after migration: Kern → `@xoroh/axis` (public interface only);
Axis depends on nothing from Kern. Shared code is shared only where genuinely
neutral; M3 implementations stay per-design-system and are never collapsed.

**Current state (verified).** Kern `main`/`origin/main` is at `f0774ae7`
(merge of PR #23, MIT-license copy alignment, 2026-10-15T23:45Z; prior
`87c2d6f4` merge of PR #22). CI is red on `main` with the same 7-failure
signature across the last two CI runs (§H-02).
During the prior planning task a concurrent owner session created local
branch `license/mit-demo` at `44351411` (49 archive renames + the same
demo fix; local-only, unpushed) — see §B.2.
Axis `development` is at `638a1a1`
with only scaffolding: an empty private `@xoroh/axis-core` placeholder, no
`src/`, no native stack. The primitives to extract are 16 React-only,
renderer-agnostic behavior modules (81+ exports, 16 test files; an archived
audit reports 194 executed cases — re-verify in Phase 1) with 42
consumer files in Kern — but several modules (`positioning`,
`VISUALLY_HIDDEN_STYLE`, parts of `press`/`focusTrap`/`portal`) carry web
assumptions that must be rewritten, not renamed, for native. Kern CI is red
at HEAD: `biome check` reports 240 errors, and the HEAD CI run fails in
gates (lint), site typecheck, E2E, three package builds, and MCP tests.

**Scope.** Phases 0–7 below: freeze baseline → extraction design + public
contract → extract/rename → Axis package readiness → Kern integration →
cross-repo verification → remaining Kern roadmap → independent operations.
No publication, deployment, push, merge, or destructive Git operation is
authorized by this plan. Axis website/playground and broader design-system
expansion are explicitly deferred. Private-monorepo (Xoroh product) adoption
work (old P7, KERN-064–075) is out of scope and stays blocked pending
separate owner authorization.

**Completion criteria.** §K. In short: Axis genuinely native-mobile (not a
renamed web library) owning its public contract; Kern consuming it via the
public interface with no duplicate/private-source/stale references; both
independently buildable, testable, verifiable; blocking failures resolved or
explicitly deferred; docs, agent instructions, and release procedures updated.

---

## B. Verified repository baseline

### B.1 Locations and identity

| Repo | Local path | Remote | Default branch | Local branch | HEAD | Tree | Sync |
|---|---|---|---|---|---|---|---|
| Kern | `/home/novexo/Desktop/Business/xoroh-monorepo/kern` | `https://github.com/xoroh/kern.git` | `main` (verified via `gh repo view`) | worktree on local `license/mit-demo`; `main` at `f0774ae7` (Merge PR #23, 2026-10-15T23:45Z) | `f0774ae7` | worktree: 1 unstaged banner edit + 5 untracked plan/archive entries (see B.2); `main` tree clean | `main` in sync with `origin/main`; worktree branch `44351411` is 1 ahead / 2 behind `origin/main` (unpushed, no upstream) |
| Axis | `/home/novexo/Desktop/Business/xoroh-monorepo/axis` | `https://github.com/xoroh/axis.git` | `development` (verified) | `development` | `638a1a1dd4a57127a02e91a3f1a0ae909d00717c` | clean | `0 / 0` vs `origin/development` |
| Xoroh (umbrella) | `/home/novexo/Desktop/Business/xoroh-monorepo/xoroh` | `https://github.com/xoroh/xoroh.git` | `main` (verified) | `main` | `1a1b2c9` (MIT-license switch, 2026-10-16; was `156cc28` at session start) | clean | `0 / 0` vs `origin/main` |

No duplicate or backup checkouts of Kern/Axis exist (filesystem search:
no second working copy; only `~/.local/bin/kern-*` helper scripts, IDE
metadata, and bun caches matched the name). The parent container
`/home/novexo/Desktop/Business/xoroh-monorepo/` is **not** a Git repository.
Sibling checkouts `novexo`, `xoroh-platform` (private product monorepo),
`xoroh-visual`, and `prod-*-backups` were identified but not inspected beyond
Git state, per inspection-only rules; the private product monorepo must not
be modified or depended upon.

### B.2 Kern Git detail (verified)

- Session-start state (prior task): branch `main` at `87c2d6f4`, clean
  tree, `0/0` vs `origin/main`.
- **Current state (audit 2026-10-16):** `main`/`origin/main` advanced to
  `f0774ae7` (merge PR #23 `license/kern-mit-project-copy`, owner,
  2026-10-15T23:45Z — 1-line MIT demo-copy fix). The worktree remains on
  local branch `license/mit-demo` (`44351411`, parent `87c2d6f4`, no
  upstream — local-only, unpushed): it carries the 49 archive renames plus
  the same demo fix, i.e. 1 ahead / 2 behind `origin/main`
  (verified `rev-list --left-right --count` = `1 2`). The demo-fix content
  is identical on both lines, so a future merge should apply cleanly, but
  that merge is the owner's call. **Do not switch branches** (checking out
  `main` would revert the archived paths in the worktree); do not amend,
  rebase, or push `license/mit-demo`.
- **Concurrent activity during this planning task (not the planning
  agent's doing; preserved untouched):** at 01:32 CEST an owner session
  created local branch `license/mit-demo` (`44351411`, parent `87c2d6f4`,
  no upstream — local-only, unpushed) and committed 50 files: the 49
  staged archive renames from this task (0 content changes, pure renames)
  plus their own 1-line demo fix (`apps/site/src/demos/web/layout.tsx`:
  `"Apache-2.0."` → `"MIT."`, part of the Xoroh MIT-license switch also
  landed in `xoroh@1a1b2c9`). The prior planning agent created no commits,
  pushed nothing, and modified no tracked content except the superseded
  banner prepended to the archived redesign copy (6 added lines, unstaged).
  New files from the planning task (`ARCHIVE_INDEX.md`, `SUPERSEDED.md`,
  two redirect stubs, this plan) remain untracked in the worktree — the
  owner must commit them (see audit finding A-P0-1).
- Stashes (2, preserved, never to be dropped without owner review):
  `wip-preserve`, and `WIP on main: e565c7f docs(parity): registry rows
  393 -> 394 for the web Split row`.
- Worktrees: 1 (the checkout itself). No tags. Remote branches:
  `origin/main`, `origin/fix/biome-lint-main` (PR #18),
  `origin/dependabot/github_actions/actions/setup-node-7` (PR #20),
  `origin/dependabot/github_actions/actions/upload-artifact-7` (PR #19).
- Recent history: `f0774ae7` Merge #23 (MIT demo-copy) ← `0a967e68` demo-copy
  fix ← `87c2d6f4` Merge #22 (sync/kern-finalize) ← `96126de9`
  e2e light-scheme pin ← `2865af4b` hydration-stack output ← merge of
  `origin/main` ← `6ae3d764` preview-audit record ← `09c44404` web/native
  parity ← `65c9eb3d` CLI feedback/pm ← `65eadac1` primitives→libs move ←
  `dd8bda16` CLI C1-S/C2/C3. The earlier "47 local-only commits" report is
  **not verifiable in current state** (0 ahead/behind): the
  sync/kern-finalize line was merged via PR #22, which resolves that claim.
- PRs (verified via `gh`): #21 merged (release-workflow protection +
  action pinning), #22 merged (Preview sync + internal primitives move),
  #18 OPEN (`fix/biome-lint-main` → `main`, 2026-10-13),
  #19 OPEN (dependabot `upload-artifact` 4.6.2→7.0.2),
  #20 OPEN (dependabot `setup-node` 4.4.0→7.1.0). Open issues: none in
  kern/axis/xoroh.
- Branch protection (`kern`, `main`, verified via API): strict status checks,
  `enforce_admins: true`, required PR reviews with dismiss-stale-reviews,
  required context: `cold-install` only, no bypass restrictions.
- Actions posture (verified in workflow files): `permissions: contents: read`
  by default; all `uses:` SHA-pinned with version comments
  (`checkout@3d3c42e… # v7`, `setup-bun@0c5077e… # v2`,
  `upload-artifact@ea165f8… # v4`); release workflow gates publishing on
  `ref == main && vars.RELEASE_CHANGESSETS == 'true'` with `npm-publish`
  environment approval. No repo-level Actions variables are set
  (`RELEASE_CHANGESSETS` unset at repo level — env-level value unverified).

### B.3 Axis Git detail (verified)

> Freshness note 2026-10-16: the baseline below is the verified
> point-in-time record at Axis `638a1a1` (kept as history). It is
> superseded by extraction slices 1–3: Axis `development` is now at
> `1f10b92e` with `packages/axis/` (`@xoroh/axis@0.0.0`, 14 behavior
> modules + tests, RNTL suites, extended CI) — see the Phase 2
> execution log. Per §A, the repo wins on any remaining divergence.

- 2 commits total: `638a1a1` (CI + manual releases) on top of `14f9c07`
  (scaffold). No stashes, 1 worktree, no tags. Remote branches:
  `origin/development`, `origin/dependabot/github_actions/actions/checkout-7.0.1`
  (PR #2, OPEN). No environments configured. CI (`ci.yml`): push/PR on
  `development` + dispatch; one `validate` job (checkout v4 + setup-bun v2
  pinned SHAs, `bun install --frozen-lockfile`, `bun test`);
  `permissions: contents: read`. Changesets configured (`access: public`,
  `baseBranch: development`, no pending `.md` files).
- Package state: single workspace `packages/core` = **empty private
  placeholder** `@xoroh/axis-core@0.1.0` (`private: true`, no
  `exports`/`main`/`types`, no `src/`). `@xoroh/axis` does not exist anywhere.
  Zero matches for `react-native`, `expo`, `react-dom`, `base-ui`, `DTCG`,
  `tokens`, `primitives` outside the `exports`-substring. No
  `ios|android|app.json|metro|Podfile|gradle` files. `tests/monorepo.test.ts`
  asserts only the placeholder identity. `docs/RELEASING.md` mandates manual
  releases, never publishes the placeholder, and warns `npm whoami` ≠ scope
  rights.

### B.4 Xoroh umbrella (verified)

Docs/portal repo, **not** an npm package: root `package.json`
(`xoroh@0.0.0`, `private: true`, Apache-2.0, workspaces `apps/*`, no
scripts) and `apps/site` (`site@0.0.0`, private, no build/test scripts).
Single `ci.yml` asserts file existence only. Dependabot PR #3 OPEN
(`checkout` 4.4.0→7.0.1). License switched to MIT during this task
(`1a1b2c9`, owner session; was Apache-2.0 at session start). Relevant only
for shared conventions (community files, CI posture).

### B.5 Kern workspace map (verified manifests, all `0.0.0` MIT)

Root `kern@0.0.0` private, `packageManager bun@1.3.8`, workspaces
`apps/* packages/* libs/*`. TypeScript 5.9.3 exact; Biome `^2.5.14`;
Changesets; Playwright; `publint`, `@arethetypeswrong/cli` (`attw`).

| Package (manifest name) | Path | Role | Key deps |
|---|---|---|---|
| `@xoroh/kern-tokens` | `packages/kern-tokens` | canonical token store, resolver, presets, generators, DTCG interchange | `@fontsource-variable/inter` only |
| `@xoroh/kern-material-3` | `packages/kern-material-3` | M3 preset data + elevation | `@xoroh/kern-tokens` |
| `@xoroh/kern` (web) | `packages/kern` | M3 web renderer (Base UI behavior, Tailwind v4) + `/start` composition tier | `@base-ui/react`, primitives, tokens, material-3, cva/clsx/tailwind-merge; peers react/react-dom/Base UI |
| `@xoroh/kern-native` | `packages/kern-native` | M3 React Native renderer (StyleSheet + tokens) | primitives, tokens, material-3, `react-native-svg@15`; peers `react ^19`, `react-native >=0.86 <0.89` |
| `@xoroh/kern-primitives` (**private**) | `libs/kern-primitives` | unstyled behavior kernel shared by both renderers | peer `react >=18`; test-only `react-dom`, jsdom, testing-library |
| `@xoroh/kern-icons` | `packages/kern-icons` | Material Symbols registry + dual DOM/RN-SVG renderers | peers react, react-native(*), react-native-svg(*) |
| `@xoroh/kern-contracts` | `packages/kern-contracts` | pure metadata/schema, no UI deps | none |
| `@xoroh/kern-cli` (docs claim **private**, bin `kern`) | `packages/kern-cli` | source-vendoring installer (`create/init/add/list/diff/upgrade`) | contracts, typescript — **contradiction flagged (H-17):** manifest has no `private` field and sets public `publishConfig`, while docs say never-published |
| `@xoroh/kern-mcp` (`packages/mcp`) | `packages/mcp` | MCP server (12 tools), generated 418-row manifest | MCP SDK, CLI, icons, zod |
| `mobile` (private) | `apps/mobile` | Expo 57 / RN 0.86.3 / React 19.2.3 host, `bundle` via `expo export` | kern-native (workspace) |
| site (private) | `apps/site` | TanStack Start docs/playground/gallery/blocks (Cloudflare `kern.xoroh.org`) | workspace packages |

Primitives detail (verified source read): `libs/kern-primitives/src/` holds
16 modules × (`.ts` + `.test.ts`) + `index.ts` — `a11y, collection,
dismissPolicy, dismissWiring, focusTrap, mergeRefs, overlayModality, portal,
positioning, presence, press, roving, selection, slot, time,
useControllableState` — 81+ barrel exports. No `react-dom`, `react-native`,
`expo`, DOM, or browser API imports in non-test source (only React hooks +
pure TS); the header comment + `scripts/check-primitives.mjs` enforce
no-imports-of-tokens/native via transitive graph walk (SheetSurface-incident
rule). `adoption.json` records 70 adopted / 11 deliberately not-yet-adopted
exports (`collection` unit: not verified to qualify for native;
`ref-composition` unit: low value, unmeasured duplication). Importer files:
40 raw `grep -rl` matches (audit 2026-10-16), of which ~30 are real
component files (27 RN + 3 web: `menu-family`/`sheet-family`/`presentation`);
the rest are the site primitives-docs mirror, snippet fixtures, generated
files, and symbol-name-only matches — Phase 0.3 rebuilds this list exactly.

Tokens/DTCG (verified): canonical store is custom
`packages/kern-tokens/src/tokens.json` (sparse palettes
`{oklch, srgb}`, 58 roles, 5 theme ids, 30 resolved matrix cells);
**DTCG 2025.10 is interchange, not storage** —
`src/dtcg/{export,import,validate,shared,retained}.ts` with
`DTCG_SPEC_VERSION = "2025.10"` referencing
`https://www.designtokens.org/TR/2025.10/format/`. No `style-dictionary`
dependency anywhere. Generators emit `tokens.css` (`--sys-*`), `comp-tokens`
(`--comp-*`), tones/motion CSS, Tailwind adapter, `dtcg.json`, theme matrix.

AI-first surfaces (verified): `.agents/skills/{kern,kern-agents,docs}`,
`@xoroh/kern-mcp`, `apps/site/public/llms.txt` + generator/check scripts,
`packages/kern-contracts` validators, `AGENTS.md` router. AI stays Kern's
ecosystem concern; Axis exposes only the metadata its public API needs
(public export inventory for discovery), never AI dependencies in primitives.

### B.6 Outstanding Git work to preserve (do not drop, reset, merge, or push)

1. PR #18 branch `fix/biome-lint-main` (lint/format fix — its own CI still
   red, §H). 2. PR #19/#20 dependabot major bumps. 3. Stash `wip-preserve`.
   4. Stash `e565c7f` registry 393→394 note. 5. Local branch
   `license/mit-demo` (`44351411`, owner session, unpushed — do not push,
   amend, or rebase; Phase 0 decides its PR fate). 6. Axis PR #2 + Xoroh
   PR #3 dependabot (inspection-only here).

### B.7 What could not be verified (limitations)

- `RELEASE_CHANGESSETS` at environment level; `NPM_TOKEN` existence
  (intentionally absent per TODO — secret values never inspected).
- `@xoroh` npm-scope publish rights: `npm view @xoroh/axis` and
  `@xoroh/axis-core` both `E404` (nothing published under either name —
  availability-looking but **not** proof of scope ownership); logged npm user
  is `novexonl`. Trademark / `axis.xoroh.org` domain control unchecked.
- Advisory state: Dependabot reports **0 open alerts** on kern and axis
  (verified 2026-10-16); the archived "19 GHSA" figure is historical and
  unreproduced. Code-scanning is not configured ("no analysis found").
- No device/simulator runs exist anywhere (no macOS/device gate has ever run);
  native behavior evidence is emulator-less (vitest + jest/RNTL + Metro
  bundle) — the device gap is a standing risk (§H).
- Per-step CI log contents beyond failed-step names (§H.2) were not pulled;
  Phase 5 reads the logs.

---

## C. Target architecture and ownership

### C.1 One foundation, two projects

Kern — *"One foundation. Every design system."* — is the AI-native design
foundation and ecosystem: foundations, tokens, typography, themes, icons,
independent design-system implementations, components, blocks, metadata,
AI documentation/discovery, validation, agent workflows. Production-useful
depth is preserved; nothing is cut to make the diagram smaller.

Axis is an **independent, mobile-native primitives project**: composable,
design-system-neutral behavior primitives for native-mobile interaction, in
the spirit of Base UI (clear responsibilities, accessible patterns,
controllable behavior, reliable composition into higher-level systems) but
implemented natively — **never a copy of Base UI's DOM architecture.**

### C.2 Ownership split

| Concern | Owner | Notes |
|---|---|---|
| Behavior primitives, native-mobile-first (state models, overlay modality, dismiss policy, roving/focus management, selection/collection, press/gesture state, presence, slot/ref composition, time utils — each with a native binding) | **Axis** (`@xoroh/axis`) | React Native implementation; Expo host for proof; no DOM/CSS/browser APIs; no token reads |
| M3 web components + `/start` composition tier | Kern (`@xoroh/kern`) | Base UI stays a dependency of this package only (ADR-002, still standing) |
| M3 native components (87 components + shell/theme/fonts) | Kern (`@xoroh/kern-native`) | consumes Axis, not a copy of it |
| Canonical tokens, resolver, presets, generators, DTCG interchange | Kern (`@xoroh/kern-tokens`) | Axis never owns token authoring |
| M3 preset data, elevation | Kern (`@xoroh/kern-material-3`) | preset `material-3`, generic namespace |
| Icons (registry + dual renderers) | Kern (`@xoroh/kern-icons`) | independent foundation, not an Axis dep |
| Contracts/schema, CLI, MCP/registry, AI surfaces, site, blocks, mobile host | Kern | CLI/MCP resolve Axis through its public manifest, not source |
| Release automation, versioning, changelogs per project | Each project independently | coordination only where contracts intersect (see §E.7) |

Dependency direction: `kern*, mobile, site → @xoroh/axis` (declared
semver dependency on the published-style interface, resolved via workspace
only inside a disposable verification setup — never `workspace:*` in
shipped metadata). Axis has zero dependencies on Kern packages, the Kern
checkout, or the parent container. This supersedes the archived
redesign §10.2 "no dependency in either direction" model per owner
instruction (see §I, D-DEP — settled, no fresh approval).

### C.3 Native-mobile definition (evidence-based)

The stack is determined from the checkout, not assumed: `kern-native`
peers `react-native >=0.86 <0.89` + `react ^19` with `react-native-svg@15`;
`apps/mobile` runs Expo ~57 / RN 0.86.3 / React 19.2.3 with a working
`expo export` bundle. Axis therefore targets **React Native (≥0.86 <0.89
initially) + React 19, proven via an Expo 57 host** — confirmed/adjusted in
Phase 1 (D-STACK). Native obligations: platform accessibility
(`accessibility*` props, screen-reader roles/states), interaction semantics
(Pressable/gesture state, not Enter/Space key handling), focus management
(accessibility-focus, modal containment — not DOM traps/tabindex), lifecycle
and Animated-backed presence, `onLayout`/`measure`-based positioning (not
viewport-rect math), StyleSheet-compatible value flow (never CSS vars).

### C.4 DTCG interoperability boundary

- Authoring, validation, and `dtcg.json` export/import stay in
  `@xoroh/kern-tokens` (DTCG 2025.10; re-verify the TR reference in Phase 1).
- Axis consumes **projected native values** (sRGB/dp scheme objects or the
  validated DTCG JSON document) and must pass a gate asserting **zero
  `--*` CSS-variable references and zero web-token imports** in source and
  packed output.
- No new token system is created inside Axis. Token-type/reference/output
  validation stays Kern's; Axis validates only that its inputs satisfy its
  documented native value contract.
- Proof separation (archived §10 guardrail, retained): Axis verification
  evidence must never be cited as Kern Native device/parity proof, nor
  Kern evidence as Axis proof. Each project's device, parity, and
  consumer claims stand on its own runs and artifacts.

### C.5 AI-first placement

Machine-readable metadata, discovery, agent workflows, and validation stay
Kern's ecosystem layer. Axis contributes exactly one artifact: an accurate
public-export/API inventory emitted from its own source (consumed by Kern's
MCP/docs tooling if genuinely useful — decided in Phase 3, never forced).

### C.6 Public API expectations

`@xoroh/axis` exposes one stable entry (`.`) with named behavior modules and
hooks, full `.d.ts`, ESM+CJS, `react-native` export condition (as kern-native
already ships), `peerDependencies` on `react` + `react-native`, no runtime
dependencies beyond carefully justified ones. Kern consumes **only** this
entry — no deep imports, no relative cross-repo imports, no `workspace:*`
in shipped fields.

---

## D. Migration inventory

Conventions: **Move** = transfer source + history narrative into Axis (fresh
native binding where noted). **Remain** = stays in Kern. **Rewrite** =
re-implemented for native in Axis; Kern copy removed after cutover.
**Replace** = Kern switches its import to `@xoroh/axis`. Statuses
`OPEN`/`GATED` refer to Phase-1 AX0 confirmation.

### D.1 Primitives modules (`libs/kern-primitives/src/` → Axis)

| Module | Purpose | Disposition | Rationale / blocker |
|---|---|---|---|
| `useControllableState.ts` | controlled/uncontrolled state hook | **Move** (as-is, RN-verified) | pure React; 26 importing files (21 RN + 2 web + docs) |
| `selection.ts` | selection model + `useSelection` | **Move** (verify call sites first) | pure model; redesign flagged missing call-site evidence — AX0 confirms |
| `collection.ts` | collection model | **Move GATED** on native adoption proof | `adoption.json`: no verified native consumer; do not transfer speculatively |
| `roving.ts` | roving-focus model | **Move model + Rewrite bindings** | model pure; DOM roving-tabindex → RN accessibility-focus |
| `focusTrap.ts` | focus-trap model | **Move model + Rewrite bindings**; `createFocusTrapModel` prune-or-adopt (no runtime consumers reported) | web trap semantics ≠ modal containment |
| `press.ts` | press state model + `usePress` | **Move core + Rewrite activation**; `createPressModel` prune-or-adopt | Enter/Space activation is web; native = Pressable/gestures |
| `presence.ts` | presence state model | **Move model + Rewrite animation wiring** | RN Animated integration is Axis work |
| `dismissPolicy.ts` / `dismissWiring.ts` | overlay dismissal triggers | **Move policy + Rewrite trigger sources** | Escape/backdrop-click are web; native = back button, swipe, scrim |
| `overlayModality.ts` | modality stack registry | **Move** (consumer binds RN Modal) | registry itself is platform-free |
| `portal.ts` | portal registry | **Move + Rewrite host binding** | registry is a pure Map+sequence (no DOM) already consumed by **both** presentations; only the host binding is per-renderer (`createPortal` vs RN `Modal`). Prior REWRITE-OR-EXCLUDE verdict corrected by audit 2026-10-16; AX0 confirms the host-binding design |
| `positioning.ts` | floating-rect/viewport math | **Split per symbol (AX0 confirms)** | `resolveFloatingRect` (RN-consumed via `resolvePopoverOrigin`) moves — the math is unit-agnostic ("CSS px on web, dp on native") by design. `clampRectToViewport` / `resolveFloatingOrigin` (zero direct callers; viewport-clamp semantics differ under safe areas/notches) stay excluded unless AX0 proves a native caller. Prior blanket EXCLUDE corrected by audit 2026-10-16 |
| `slot.ts` | slot/element composition | **Move** (RN-verified) | `cloneElement`/composition patterns apply; verify against RN |
| `mergeRefs.ts` | ref composition | **Move GATED** on measured duplication | `adoption.json`: value unmeasured; move only with a consumer |
| `a11y.ts` (id/dir helpers) | id scope, dir resolution | **Move** | pure; `VISUALLY_HIDDEN_STYLE` **excluded** (CSS hiding has no native meaning; stays in Kern web if still needed) |
| `time.ts` | time parsing/format | **Move** | pure |
| `index.ts` barrel | public export list | **Rewrite** as Axis public contract | Axis owns its API; Kern barrel deleted at cutover |
| `adoption.json`, `check:consumption` posture | adoption gate | **Replicate** in Axis (own gate + own not-yet-adopted ledger) | no silent widening of Axis API |
| `check-primitives.mjs` posture | boundary gate | **Replicate** in Axis (no token/renderer imports) + Kern retargets its gate at `@xoroh/axis` boundary | graph-walk enforcement, not grep |

### D.2 What stays in Kern (never moves)

- `packages/kern-native/**` — the M3 native implementation (87 components,
  shell, theme, fonts). It becomes Axis's largest consumer, not its donor.
- `packages/kern/**` (incl. `/start`), `packages/kern-tokens/**`,
  `packages/kern-material-3/**`, `packages/kern-icons/**`,
  `packages/kern-contracts/**` (pure; Axis defines its own API — sharing a
  dependency is allowed only if AX0 proves genuine neutrality),
  `packages/kern-cli/**`, `packages/mcp/**`, `apps/**`, `e2e/**`,
  `parity/**`, `scripts/**` (updated, not moved).
- `libs/kern-primitives/` itself is **deleted at cutover** (hard-cut law,
  no shim package). Removal is Phase 4's last step, after all consumers
  resolve to `@xoroh/axis` and gates pass.

### D.3 Manifests, build, and tooling changes

| Item | Change |
|---|---|
| `packages/kern-native/package.json` | dep `@xoroh/kern-primitives: ^0.0.0`/`workspace:*` → `@xoroh/axis` semver; imports rewritten module-by-module |
| `packages/kern/package.json` + `menu-family.tsx`, `sheet-family.tsx`, `presentation.tsx` (+ any other primitive importers found by AST scan in Phase 0) | same replacement on the web side |
| `packages/kern-cli/src/init.ts` (+ test) | **no symbol imports** (audit 2026-10-16: the two `@xoroh/kern-primitives` hits are `file:` scaffold path strings for native overrides, zero imported symbols) — but the scaffold `file:` coupling must still be resolved at cutover | point scaffold at `@xoroh/axis` (or inline the small needed helper with tests) per-symbol in Phase 4; AX0 records the exact scaffold rows |
| `apps/site`, `apps/mobile` manifests/tooling | import maps updated; no `workspace:*` leakage into anything Axis publishes |
| `scripts/check-primitives.mjs` | retargeted: asserts Kern imports primitives **only** via `@xoroh/axis` public entry (plus keeps the no-tokens-in-primitives direction for any residual shared code) |
| `scripts/check-consumption.mjs`, `check-layers.mjs`, `check-coverage.mjs`, registry generator, MCP manifest (419 rows: 302 web + 117 native — corrected 2026-10-16, was 418/301) | updated for the new package identity; primitive rows' ownership transfers to Axis discovery |
| `libs/kern-primitives` build (`tsup` esm+cjs+dts, `publint`+`attw`) | re-created under Axis ownership in `packages/core` (renamed package dir per D-NAME) with equivalent rigor |
| `.changeset/` (74 pending entries incl. `kern-primitives-publish-metadata.md`, `primitives-*.md`, `repoint-*.md`) | Phase 1 audits every primitives-related changeset for stale identity/paths; superseded ones are removed, the rest rewritten to the new package name |
| Skills (`kern`, `kern-agents`), `llms.txt` generators, `docs/components.md`, parity docs | Phase 4/6 updates; agent instructions must describe the Axis boundary truthfully |

### D.4 Naming and identity disposition

- `@xoroh/axis-core` / `axis-core`: placeholder, **retired**. Inventory of
  references (verified complete 2026-10-15): `packages/core/package.json`,
  `packages/core/README.md`, `tests/monorepo.test.ts`, root `README.md`,
  `docs/RELEASING.md`, `bun.lock`. All rewritten in Phase 2; no
  `@xoroh/axis-primitives` or further names introduced without an AX0-proven
  architectural reason (D-SPLIT).
- Canonical target: **`@xoroh/axis`** (task-preferred). The archived
  redesign's `xoroh-axis` intention is overridden, pending owner confirmation
  (D-NAME) after npm-availability + trademark + `axis.xoroh.org` checks.
  Neither `@xoroh/axis` nor `@xoroh/axis-core` is published today (both E404).

---

## E. Phased roadmap

Rules for all phases: same safety posture as this task (no pushes, merges,
publishes, deploys, approvals, history rewrites, or destructive ops; Axis and
all non-Kern checkouts inspection-only until the extraction pull request is
explicitly authorized — the plan prepares every change as reviewable work,
it does not execute cross-repo writes itself). Record SHAs before/after each
phase. Phases overlap only where stated.

### Phase 0 — Baseline and planning freeze (entry: this plan merged to `main`)

1. Re-pin baselines: `git rev-parse HEAD` + `git status` in kern/axis/xoroh;
   `gh pr list` (open) per repo; `gh run list` latest conclusions; record in
   the phase log. Confirm the 0/0 sync still holds.
2. Triage preserved work without merging, pushing, or dropping: PR #18 (rebase-or-close
   decision after lint ownership is assigned), PR #19/#20 (major-bump risk
   review), the two stashes (apply-or-keep-stashed, owner decides), and the
   `license/mit-demo` branch (owner's commit; record its intended PR fate —
   never amend, rebase, or push it from this plan's work).
3. Freeze the consumer inventory: AST scan of every `@xoroh/kern-primitives`
   importer (rebuild the importer list — ~40 raw `grep` matches at audit
   time, ~30 real component files — with test/dist excluded), per-symbol
   usage counts (note zero-consumer symbols: `createPressModel`,
   `createFocusTrapModel`, `dismissTriggersFor`, `composeEventHandlers`,
   pure selection helpers, `clampRectToViewport`, `resolveFloatingOrigin`),
   and the exact `kern-cli` scaffold `file:` rows. Output:
   `docs/architecture/axis-extraction-inventory.md` (new, Kern-owned).
   **Done 2026-10-16** (see that file: per-module file:symbol map,
   ~40-symbol zero-consumer list, manifest/lockfile/script/CI/docs
   references, AX0 open items).
4. Establish change control: `main` (kern/xoroh) and `development` (axis)
   stay the integration branches; extraction work happens on feature
   branches; `docs/planning/README.md` + `docs/plan/README.md` stubs and the
   archive index are the only sanctioned pointers to old material.
5. Repair dangling doc references listed in `ARCHIVE_INDEX.md` (SUPPORT,
   GOVERNANCE, skills, conventions, `fonts.ts`/`App.tsx` comments,
   binding-contract). Changesets are immutable — leave them, note them.
   **Done 2026-10-16** (9 files repointed at archive paths; verified zero
   remaining live references outside changesets and the plan's own
   intentional mentions).
- Exit gate: inventory doc landed; open-PR/stash/demo-fix dispositions
  recorded with owners; no new cross-repo writes.
  (2026-10-16 execution: inventory landed as
  `docs/architecture/axis-extraction-inventory.md`; `license/mit-demo`
  pushed with PR #24 open — merge blocked on owner review + D-NAME/D-NOGO;
  stashes intact and backed up to `/tmp/opencode/kern-baseline-backup-20261016/`.)

### Phase 1 — Extraction design and public contract

1. **AX0 audit** (gates everything): per-module verdicts confirming or
   correcting §D.1 against actual consumers/tests; license/authorship scan
   of candidate files; dependency closure proof (no token/renderer/DOM
   imports in the transfer set); retained-in-Kern behavior list
   (`positioning`, `VISUALLY_HIDDEN_STYLE`, unadopted units without proof).
2. Settle **D-NAME, D-STACK, D-SPLIT, D-DTCG** (§I) with evidence; define the
   Axis public API (module list, hook signatures, export conditions,
   peer ranges `react ^19` / `react-native >=0.86 <0.89` initial, Expo 57
   host baseline); write the Axis API contract doc (lives in Axis after
   extraction; draft lives in Kern during Phase 1).
3. Resolve blocking questions: `portal` replacement design; `press`
   native activation model; `focusTrap` containment model; DTCG native-value
   input shape; which (if any) `kern-contracts` schemas Axis may share.
4. Audit the 74 pending changesets + `adoption.json` + registry/MCP rows for
   the new identity.
- Exit gate: AX0 map + public contract + decision log signed by owner;
  **no source has moved yet.**

### Phase 2 — Extract and rename Axis

(Executed as an explicitly authorized Axis-side change; prepared reviewably.)

1. Transfer only AX0-approved material into `xoroh/axis` (own repo,
   `development` branch line): sources with new native bindings where §D.1
   requires rewrites — web assumptions are re-implemented, never copied.
2. Apply package identity: retire `@xoroh/axis-core` everywhere (§D.4);
   single package `@xoroh/axis` with correct `name/version/license(MIT)/
   repository.directory/exports/main/module/types/files/publishConfig`;
   rename the package directory if it misleads (`packages/core` → a name
   matching the product, e.g. `packages/axis`).
3. Port tests (vitest unit + jest/RNTL native-behavior, mirroring kern-native
   runners) and docs; update `tests/monorepo.test.ts`, root `README.md`,
   `docs/RELEASING.md` to describe the real package.
- Exit gate: Axis checkout builds from clean clone; zero
  `@xoroh/kern-*`/workspace/relative-cross-repo references in source;
  placeholder name fully gone (`grep` proof).
- Execution log 2026-10-16 (owner mandate). Slice 1 (Axis `de50f65`):
  identity + `time`/`useControllableState` (29 tests). Slice 2 (Axis
  `9bf2ceb`): 12 behavior modules + tests (154 passing), public barrel
  per contract, `check:boundary` gate, toolchain + extended CI. Both
  merged to Axis `development` as PR xoroh/axis#3 (merge `e2e2fab1`,
  `validate` green). Slice 3 = native verification, NO new modules
  (Axis `ce340bb`, PR xoroh/axis#5 open): jest + RN preset mirroring
  kern-native's runner (jest 30 / RN 0.87 / RNTL 14), four
  `*.rntest.tsx` behavior suites (12 tests: controllable state,
  multi-selection, press binding, overlay stack, portal registry,
  floating-rect math) consuming the public `./index` entry only
  (boundary-gate enforced, mutation-verified); CI + `test:all`
  extended. `collection`/`mergeRefs` do NOT transfer — their gates
  fail on dated audit evidence, see `axis-extraction-inventory.md`
  `collection`/`ref-composition` rows (2026-10-16).
- Native-integration evidence (Workstream C, emulator-independent level).
  RNTL suites green in Axis CI. Metro/Expo-host leg proven on the
  designated verification host: kern `apps/mobile` (Expo 57) `expo
  export` (android + ios) with the shipped Axis ESM `dist/index.js`
  imported through the app's own babel + resolver config produced real
  Hermes bundles (ios + android, ~2MB each) containing the Axis public
  markers — scratch probe, fully reverted, no repo coupling. Lesson:
  raw `metro build` CLI is not runnable under the bun-store symlink
  layout (Metro's file-map cannot hash store paths, including its own
  runtime polyfills); the Expo host is the designated Metro runner,
  and adoption-time bundling stays gated by kern CI's existing
  bundle + artifact-verification steps. Physical-device runs remain
  an explicit Phase 3 gate — nothing here claims them.

### Phase 3 — Axis native-mobile package readiness

Verify, in Axis, every item in §G: native behavior + accessibility on the
Expo host, build/declarations/exports, dependency correctness, packed
artifact + clean-app consumer proof (install packed tarball into a fresh RN
app, exercise representative interactions), DTCG-boundary gate (zero CSS-var
references), MIT/metadata, standalone CI extension (`typecheck`, `lint`,
`build`, `test`, `pack` jobs added to `ci.yml`), changesets/versioning dry
run, docs build. **Deferred, explicitly:** Axis website/playground,
multi-design-system expansion, publication itself.
- Exit gate: §G checklist green with evidence recorded against the Axis
  commit; pre-release name/domain/trademark checks cleared or carried as
  named blockers (D-NAME).

### Phase 4 — Kern integration

> ⚠ BLOCKED pending D-FOUNDATION-CHOICE (recorded 2026-10-16). Steps
> 1–3 and the exit gate below assume Axis as the single native
> foundation (single-target replacement; global "no duplicate primitive
> implementation"). That conflicts with the owner decision that Axis is
> under consideration and React Native Primitives stays choosable.
> No Phase 4 integration work (especially step 3) executes until the
> decision resolves to (a) per-foundation hard-cut or (b) confirmed
> Axis-only. Phase 0/1 inventory and gate work is unaffected.

1. Replace internal primitive dependencies with the `@xoroh/axis` public
   interface in `kern-native` (~28 files), web (`menu-family`,
   `sheet-family`, `presentation`, + Phase-0 AST stragglers), CLI, and site
   tooling — module by module, keeping tests green.
2. Retarget gates (`check-primitives` as Axis-boundary gate, consumption/
   layers/coverage/registry/MCP updates); update skills, `llms.txt`
   generators, `docs/components.md`, parity docs.
3. **Delete `libs/kern-primitives/`** only after: zero importers
   (`grep` + AST proof), gates green, and packed-consumer verification done.
   No shim, no alias (hard-cut law).
- Exit gate: no `@xoroh/kern-primitives` string outside the archive; Kern
  builds/tests/typechecks without `libs/`; M3 implementations untouched in
  behavior.
- Integration order (recorded 2026-10-16; no code adoption this cycle).
  Kern cannot consume `@xoroh/axis` until Axis publishes: the package is
  `0.0.0` + `private`-root + HOLD-intact, publication is release-policy
  gated and not authorized here, and a cross-repo `file:` dependency would
  violate repo independence and the boundary both gates enforce. Ordered
  plan, no premature PRs: (1) Axis PR #5 merged → (2) first Axis publish
  under release authorization (D-RELEASE pre-publication actions) →
  (3) kern-native adopts one module behind the public API with
  consumer + RNTL proofs, old code removed only at zero importers →
  (4) `libs/kern-primitives` deleted per the hard-cut law above.
  First-candidate consumer when (2) lands: `useControllableState`
  (18 importer files, suite-backed) — vertical slice, not a doc edit.

#### Foundation compatibility evidence (2026-10-16, verified facts only)

Compatibility is never inferred from names. `unknown` means unobserved
in-repo, not "probably fine".

| Dimension | Base UI (web) | Axis (candidate native) | React Native Primitives (candidate native) |
|---|---|---|---|
| Coverage | Dialog/Tooltip/Combobox/Checkbox/Toggle/Toast consumed by `@xoroh/kern`; 302 web manifest rows | 14 behavior modules, 0 components, 0 releases | unknown (zero in-repo references) |
| Public API | `@base-ui/react@1.8.0`, subpath imports | single `.` entry, ESM+CJS+d.ts, RN-first export condition; peers `react>=18` only | unknown |
| Behavior | owns web Portal/trap/positioning (kernel never replaces a Base UI part) | contract-only (press begin/end/cancel, presence lifecycle, policy-vs-trigger dismissal, ordered portal registry) | unknown |
| Accessibility | ARIA roles/states in parity rows; `axe-core` in web devDeps | RN `accessibility*` roles/states required by contract; one harness probe; no device/SR runs anywhere | unknown |
| Styling | Tailwind v4 + CSS vars; web-only `clip` hiding excluded from Axis | zero CSS-var strings (gated); caller-provided dp/color values; theme resolved consumer-side | unknown |
| Peers | `@base-ui/react ^1.8.0`, `react>=18`, `react-dom>=18` | `react>=18` only (RN range declared when native bindings land) | unknown |
| Native compat | N/A | targets RN ≥0.86 <0.89 + React 19; Expo 57 host export proven (scratch, reverted); no device runs | unknown |
| Tests | web vitest + `testedBy` per parity row | vitest 150 + jest-RNTL 12 + contract test; boundary gate | unknown |
| Maintenance | external `@base-ui/react`, ADR-002 web-only | sibling repo, changesets, manual releases, HOLD | unknown (ownership/licensing unassessed) |

Existing selection-ready surface (configure, don't invent): `parity/contract.ts`
(foundation-neutral observable semantics + per-foundation `nativeContract`/
`testedBy`), MCP `ComponentEntry.platform` + CLI `renderer→platform`
(the selection channels a foundation choice would extend),
`kern-contracts` `ComponentRecord` (`capabilities: verified|unverified|
unsupported`), `adoption.json` + `check:consumption` (adopt-with-consumer
ledger pattern), retargetable gates (`check-primitives/-layers/-parity/
-coverage`). None names a second foundation yet — shape sufficient,
content empty for RNP.

#### Axis documentation-site staged plan (owner-gated start)

Goal: neutral, documentation-focused site (Base UI clarity as the bar):
install, components, APIs, examples, accessibility, development,
contribution. Explicitly NOT a styled design system or second product
identity. Constraints: reuse Xoroh infrastructure where it doesn't couple
Axis to Kern; no Axis CLI/MCP (Kern tooling stays the AI surface);
passive discovery metadata first (`keywords`, docs index for agents).
Stages with entry criteria: (1) metadata (`keywords` + docs index) once
the component contract lands; (2) site scaffold (`apps/docs`) once the
first real component API is frozen; (3) per-component pages + a11y
guidance as components land; (4) deployment approach when release
operations are authorized. Until then the site stays an empty slot and
must not gate primitives work.

### Phase 5 — Cross-repository verification

Validate three ways: Axis alone (clean clone → install/typecheck/lint/
test/build/pack/consumer-proof), Kern alone (full §J matrix), and the
integration (packed `@xoroh/axis` tarball installed into a disposable Kern
consumer setup — proving no `workspace:*`, private-source, or dist-local
leak). Investigate every §H failure from logs — never suppress. Re-enumerate
GHSA advisories, re-run device-gap analysis, confirm all Dependabot PRs'
 disposition.
- Exit gate: evidence ledger green or explicitly deferred with owner sign;
  histories/branches coherent and synchronized. Release-plumbing gate
  (added 2026-10-16): `changeset status` must exit 0 — the invalid-tree
  family (kern/kern-native→primitives, mcp→cli) is currently red and the
  extraction reshapes exactly this tree, so AX0 must include its
  resolution plan.

### Phase 6 — Resume the remaining Kern roadmap

Reconcile every §F item against the new architecture (re-verify, don't
trust old `[x]` marks — several gates are red at this baseline). Move tasks
to Axis only where ownership genuinely belongs there (Axis-native bugs found
during integration). Preserve feature depth, AI-first support, design-system
independence, DTCG interchange.

### Phase 7 — Independent project operations

Independent CI (extended Axis `ci.yml`; Kern `ci.yml` unchanged in shape),
independent versioning/changelogs/releases per repo (Changesets in both;
Axis `baseBranch: development` already correct), CODEOWNERS for Axis
(missing today — required), coordination rule for intersecting contracts
(DTCG input shape, Axis public API bumps: semver + cross-repo verification
before Kern adopts), environment/approval hygiene (Axis needs no
`npm-publish` environment until publication is separately authorized).
Publication and production deployment remain separate, explicitly authorized
actions — this plan authorizes neither.

Dependency graph: `0 → 1 → 2 → 3 → 4 → 5`, then `6 ∥` (roadmap resumes once
5's integration evidence is stable) `→ 7`. Decisions D-NAME/D-STACK/D-SPLIT
block Phase 2; D-DTCG blocks Phase 4; release/APPROVAL decisions (§I)
block only actual publication, never planning or verification.

---

## F. Complete remaining Kern roadmap

Old `[x]` marks are **claims to re-verify**, not facts (the ledger predates
merge #22 and several gates are red). Status below = worst of (old mark,
current evidence). Owner of all rows: Kern, except where `→ Axis` is noted.

### F.1 From MASTER_TODO (archived): not started — do first

| ID | Task | Acceptance |
|---|---|---|
| KERN-001 | Working-tree ownership map | Phase 0 log covers it; close with evidence |
| KERN-003 | Frozen public capability inventory | AST export/type/helper/state/test/doc matrix; unknowns explicit (Phase 0.3 subsumes the primitives slice; the rest stays) |
| KERN-004 | Bound-usage freeze (historical Xoroh sets) | **Downscope**: the 683/455/138 product-monorepo scan is out of scope; freeze only Kern-internal bindings + public-artifact surface |
| KERN-006 | Planning-graph/handoff validation | Satisfied by this plan's creation; close with a link-check + ID reconciliation pass |
| KERN-063 | Community/troubleshooting polish (P2) | link/route checks; lowest priority, Phase 6 tail |

### F.2 From MASTER_TODO: blocked — carry with owners

- KERN-007 (implementation/architecture approval) → superseded by owner
  approval of **this plan**; close on sign-off.
- KERN-016 (migration/rollback approval) → re-scope to Kern↔Axis rollback
  (revert-to-`libs/` procedure in Phase 4); product-migration half stays
  blocked/out-of-scope.
- KERN-029 (native hosts/fonts/gestures proof), KERN-059 (a11y +
  screenshot measurement) → device/SR methodology decision (D-DEVICE);
  emulator-less evidence (Metro bundle, RNTL, screenshots where runnable)
  is the interim bar, honestly labeled.
- KERN-078 (security/a11y/native risks) → reconcile the archived "19 GHSA"
  claim against the verified zero-alert API state, decide on code-scanning,
  and keep device runs under D-DEVICE.
- KERN-083/084 (NO-GO sign, publication authorization) → remain unsigned/
  unauthorized; release decisions in §I.
- KERN-064–075 (P7 product adoption) → **excluded**: remain blocked, owned
  by a separate authorization, tracked outside this plan. This plan must not
  complete, reference-implement, or depend on them.

### F.3 From audits: concrete defect backlog (re-verify each, then fix)

Preview audit: M3 coupling in `resolve.ts`/contracts (verify post-A2 state);
234 `--comp-*`-with-0-consumers claim (re-measure after A4 wiring);
`libs/`-move fallout — DONE (`65eadac1`) but 12+ hardcoded `packages/*`
tool paths must be re-checked for `libs/` coverage; CLI `init` static-starter
staleness; MCP preset-rename test health.
Icons audit F-01 (1.8 MB static registry, no `./icons/*` subpaths),
F-02 (`icons:check` red on playground names — verify; PR #18 touches this
area), F-03 (3912-name typecheck vs 1341 resolve), F-04 (no native-renderer
test executes `Icon.native.tsx`), F-05/F-06 (decorative-a11y, kebab naming).
Theming audit stages 1–4 (rename stabilization, static/runtime split, native
decoupling codemod with 0-component-import gate, registry/docs alignment).
Full preview audit (2026-10-15): AUD-001 `check:kern` false positives on
intended `var(--comp-*,var(--sys-*))`; 4 untracked proof files disposition;
staged N9 rename sequencing; C1 surface gaps + `kern.json` renderer defect
(written never read); stale `architecture.md`/`releases.md`; F1 issue-form
scope (CLI-only GitHub form, 90-day retention — unchanged).
`docs/plan` row 11 remainder: site shell/scaffold documentation page.

### F.4 Standing invariants (never regress)

Layering (`check:layers`), primitives/Axis boundary, consumption/coverage,
contrast (1656 checks + 3 waivers), theme-matrix (30 cells), parity
(92 shared baseline + classified exceptions), elevation parity, generated
freshness/census, stale-refs, ts-policy, workflow-gate coverage,
`publint`+`attw`+preflight per publishable package, DTCG round-trip
fixtures, MCP/CLI packed-outside-checkout proofs, site `check:docs` family,
E2E suite, Metro `bundle` + artifact asserts.

---

## G. Axis initial package-readiness checklist

All verified in `xoroh/axis` from a clean clone unless noted. Evidence
(commit SHA + command output) recorded per item.

- [ ] **Identity**: `@xoroh/axis`, MIT, `repository.directory` correct,
  `axis-core` fully retired (§D.4 grep proof); no `@xoroh/axis-primitives`
  or extra names (D-SPLIT).
- [ ] **Runtime**: RN ≥0.86 <0.89 + React 19 peers (confirm/adjust D-STACK);
  no `react-dom`/DOM/CSS/browser imports in `src` (AST proof); Expo 57
  proof host builds (`expo export`) and exercises representative
  interactions.
- [ ] **Exports/API**: single `.` entry (+ `react-native` condition),
  ESM+CJS+d.ts, named behavior modules per Phase-1 contract; no deep-import
  reliance inside Kern.
- [ ] **Build/types**: `tsup` (or chosen builder) clean; `publint` +
  `attw --pack` green; `check:dist`-equivalent export/type assertions.
- [ ] **Tests**: unit (vitest) + native-behavior (jest/RNTL) suites incl.
  accessibility roles/states, gesture/press flows, modality/dismissal,
  presence lifecycle; adoption ledger for not-yet-adopted exports.
- [ ] **Dependencies**: zero `@xoroh/kern-*`/workspace/relative-cross-repo
  refs in source **and** packed output (scan proof); peers declared, not
  bundled (duplicate-React consumer test).
- [ ] **Archive + consumer proof**: `npm pack --dry-run` clean; packed
  tarball installed into a fresh RN app renders + interacts (representative
  coverage, failures recorded not hidden).
- [ ] **DTCG boundary**: zero `--*` CSS-var strings in source/pack;
  native-value input contract documented + validated; DTCG JSON fixture
  round-trips through the documented path.
- [ ] **Metadata**: MIT LICENSE, README (scope, install, usage, support),
  CHANGELOG via changesets, `RELEASING.md` updated for the real package.
- [ ] **CI**: `ci.yml` extended — install (`--frozen-lockfile`),
  typecheck, lint, unit+native tests, build, pack validation; still
  `contents: read`, SHA-pinned actions; CODEOWNERS added.
- [ ] **Versioning**: changesets flow exercised (`status` + `version`
  dry-run on a branch); no publish (unauthorized).
- [ ] **Docs build**: API reference + contributor docs build from a clean
  clone; examples verified (maps archived §10.4 docs-build gate; website
  and playground stay deferred).
- [ ] **Release prep (no publish)**: name availability re-check, trademark
  + `axis.xoroh.org` status recorded (D-NAME); `npm-publish`-equivalent
  environment deliberately **not** created until publication is authorized.
- [ ] **Kern integration readiness**: Kern's Phase-4 adoption order
  documented (kern-native first, then web/CLI/site); breaking-change policy
  (semver + cross-repo verification before Kern bumps).
- [ ] **Explicitly deferred**: website, playground, multi-system expansion,
  second-scope packages, publication, deployment.

---

## H. Known issues and risk register

Severity: **P0** blocks the migration milestone stated; **P1** must resolve
before Kern-integration cutover; **P2** may defer with owner sign.
All baselines re-verified 2026-10-15/16 — earlier numbers are not quoted as
current without the evidence noted.

| # | Issue (task §12 mapping) | Current evidence | Severity / milestone | Disposition / acceptance |
|---|---|---|---|---|
| H-01 | Full lint red (~240 diagnostics) | Was `bun run lint` → **240 errors, 58 warnings, 7 infos**, exit 1. **Resolved 2026-10-16 on the PR branch:** safe autofix (~85%) + hand edits (dead code, template/optional chains, dead branch, a11y corrections, 2 reasoned suppressions, generated-artifact biome scoping) → **exit 0, zero diagnostics locally**; overlap with PR #18 (8 files) documented for its rebase. Hosted confirmation pending next CI run | P0 / Phase 5 | Confirm green `Lint and format check` on hosted CI; acceptance: `bun run lint` exit 0 on `main` |
| H-02 | Broad CI red at HEAD | Runs `38825478289` (main, post-#23) and `38820551374` (merge #22) fail identically in 7 jobs (see forensics 2026-10-16). **Root causes established:** (a) pkg kern/material-3/native Build + mcp Test = one config defect: pkg legs run per-package builds with no prior root build, but `--dts-resolve` and runtime `main → ./dist` resolution require workspace deps' dists (all dists gitignored). **Fixed** (`ci.yml`: root-build step in `pkg` legs) and verified locally (all three builds green, mcp 29/29 pass vs 15/6/1). (b) apps Typecheck = missing gitignored `routeTree.gen.ts` on clean runners. **Fixed** (`ci.yml`: `generate:routes` step) and verified locally (site typecheck exit 0). (c) gates Lint = 240 errors, owned by PR #18 (whose lint step passes). (d) e2e = single `/playground` hydration #418, CI-only (local 26/26 green). Fixes (a)+(b) committed, pushed (PR #24), and hosted-verified (run `38840474594`: all 7 pkg legs, typecheck green). Follow-ups from hosted CI: (e) gates contrast/preflight need the same root build (fixed in `ci.yml`, pushed, awaiting run); (f) `apps` now reaches `check-props`, which fails on pre-existing content-vs-type drift (474 stale rows vs 471 ratchet; zero overlap with this branch's files — separate content-lane backlog, owner: site-se) | P0 / Phase 5 | CI confirmation on `main` after PR #24 merge; K11 + check-props need registry/content owner decisions; acceptance: green CI or per-item deferral. Never weaken gates |
| H-03 | `/playground` hydration error (CI-only, local green) | CI run `38825478289` e2e: 25/26 pass; sole failure `site-design.spec.ts:98` with minified React #418 (`args[]=HTML`, server/client HTML mismatch) on `/playground` only. Local 2026-10-16: **26/26 green** (fresh build + preview). Leads eliminated: `Math.random` is handler-scoped (`shuffle()`), `loadPlaygroundState` is SSR-safe, route state derives from URL search. **Root cause found 2026-10-16 via dev hydration trace:** playground dashboard composed `Table.Header (th) > Table.Row (tr) > Table.Head (thead)` — inverted vs the correct `Table.Head > Table.Row > Table.Header` used in demos; invalid nesting forces parser repair → mismatch. **Fixed** (8-line composition swap); dev subtree warnings gone; full local e2e 26/26 on fresh dist. Hosted confirmation pending next CI run | P1 / Phase 5 | Confirm green E2E on hosted CI; acceptance: `test:e2e` green in CI |
| H-04 | Open PR set | Kern #18/#19/#20, Axis #2, Xoroh #3 all OPEN (verified 2026-10-16; max PR number is 23, #23 merged); #18's own CI red (gates+3 pkgs+apps fail, e2e passes) | P1 / Phase 0 | Dispositions recorded in Phase 0; acceptance: merged or closed with reason, no stale red PRs at cutover |
| H-05 | Dependabot action-reference pinning | #19/#20 bump `setup-node` 4.4→7.1 / `upload-artifact` 4.6→7.0 (majors — plugin/API risk); #2/#3 bump `checkout` 4.4→7.0. Kern repo otherwise already on v7 pins | P1 / Phase 0–5 | Review changelogs in disposable branches; acceptance: merged pins + green CI, or documented hold |
| H-06 | npm `@xoroh` publish rights unconfirmed | `npm view` E404 for both names (nothing published — good, but not proof of ownership); `npm whoami` = `novexonl`; `RELEASING.md` warns identity ≠ rights | P0 for release / Phase 1 | Scope-access check without publishing (`npm access` / org roles); acceptance: written confirmation of who may publish, or publication stays unauthorized |
| H-07 | Single-member release team | `release` team = Novexonl only (verified API) **and** branch protection requires `0` approving reviews with code-owner reviews off → approvals not independent | P1 / Phase 7 | Add second approver and/or require ≥1 approving review; acceptance: owner decision recorded |
| H-08 | Release/prod gating + absent credentials | `npm-publish` + `production` envs require `release`-team review, admins cannot bypass (verified); `NPM_TOKEN` absent by design, `RELEASE_CHANGESSETS` unset at repo level | P0 for release / Phase 7 | Keep; acceptance: no publish path works without approval (negative test documented) |
| H-09 | Web assumptions smuggled into Axis | `positioning` viewport math, `VISUALLY_HIDDEN_STYLE`, Enter/Space press, DOM trap/tabindex, portal, backdrop-click dismissal — all present in candidate sources (verified reads) | P0 / Phase 2 | §D.1 rewrite dispositions + AX0 proof; acceptance: Phase-3 native-behavior tests, zero web-API strings in Axis `src`/pack |
| H-10 | Native behavior/platform/testing gaps | No device/SR runs ever; SVG mocked in both runners; Modal/Animated/Linking/OS-theme headless-only; inline-style perf unmeasured; F-04 (no native icon-renderer execution) | P1 / Phase 3–5 | D-DEVICE methodology; acceptance: Expo-host proof + RNTL coverage + honestly labeled unverified-platform list |
| H-11 | DTCG/token ownership ambiguity | Resolved in design (§C.4, DTCG 2025.10 interchange, Kern owns authoring) — residual risk is drift: Axis inventing token reads or Kern leaking CSS vars into the native path | P1 / Phase 3–4 | Zero-`--*` gate in Axis; acceptance: gate green in CI on both repos |
| H-12 | Security/release hardening leftovers | **Dependabot alerts: 0 open on kern and axis** (verified API 2026-10-16) — the archived "19 GHSA untriaged" figure is historical and does not reproduce; code-scanning shows "no analysis found" (CodeQL not configured) on both; NO-GO unsigned; private advisories process exists (`SECURITY.md`) | P1 / Phase 5 | Reconcile the 19-advisory claim against the zero-alert API state, decide on code-scanning setup; acceptance: triage log + NO-GO successor decision under this plan |
| H-13 | Premature-verification ledger trust | Archived MASTER_TODO marks 60 tasks verified while gates are red (independent audit FAIL 72/100) | P0 process / Phase 6 | §F re-verification rule; acceptance: every carried claim re-evidenced at current HEAD |
| H-14 | Preserved-work loss risk | 2 stashes, staged demo fix, 3 dependabot branches, PR #18 branch | P0 / Phase 0 | Disposition log; acceptance: nothing dropped without owner sign |
| H-15 | Consumer duplication / dual React | Bundled-primitives duplicate-state question open since CURRENT_STATE; Axis must prove no duplicate React/context in packed-consumer test | P1 / Phase 3+5 | Packed-consumer proof with duplicate-context assertions; acceptance: green |
| H-16 | CLI/MCP closure over Axis | CLI scaffold `file:` refs + MCP manifest/registry rows reference the old identity; vendored closures must resolve `@xoroh/axis` without checkout dependence | P1 / Phase 4 | Per-symbol inventory (Phase 0.3) → updated resolvers + packed-outside-checkout proofs |
| H-17 | `kern-cli` privacy contradiction | Manifest had **no `private` field** with public `publishConfig` while docs said never-published — and pending changeset `oss-transformation-implementation.md` bumps `@xoroh/kern-cli: minor`, so the first authorized release would have published it. **Fixed 2026-10-16** (`"private": true`, matching `libs/kern-primitives` convention; workspace-local use unaffected). Side effect: `changeset status` gains a third invalid-tree line (mcp→cli) on top of two pre-existing ones (kern/kern-native→primitives) — the status check was already red and is not run in CI; the invalid-tree family must go green before any release (Phase 5 gate). Remaining release coupling: public `@xoroh/kern-mcp` depends on unpublished cli (`^0.0.0`) — resolve (bundle/publish/drop) before any release | P1 / Phase 1 (manifest fix done, uncommitted); release coupling P2 | Manifest fix verified (`changeset status` output recorded); acceptance: docs+manifest+workflow agree (done) and invalid-tree family green before release |
| H-18 | check-props content-vs-type drift (474 vs 471 ratchet) | Pre-existing on `main` (zero overlap with PR #24 files — verified by filename intersection; unmasked when K11 fix let `check:docs` proceed). Systemic class: compound-part pages document Root-level controlled props (`open/value/disabled/...`) the part types don't carry. Not adjudicable without per-component docs-vs-type calls | P1 / content lane (site-se) | Burn down 3+ rows per the gate's documented defect class and lower BASELINE in the same commit, or owner exception. Never raise BASELINE without removals |

## I. Decision register

**Established (standing, not re-decided):** Kern tagline/scope (§C.1);
per-design-system implementations never collapsed; Base UI for web only
(ADR-002); DTCG 2025.10 interchange with Kern-owned authoring (ADR-006 +
`DTCG_SPEC_VERSION`, re-verify reference); AI-first in Kern, never as Axis
dependency; MIT licensing; ESM-only (ADR-001); hard cuts, no shims;
publication HOLD until explicit authorization.

| ID | Question | Position / options | Blocks |
|---|---|---|---|
| D-NAME | Canonical package name | **Resolved for internal readiness 2026-10-16 (owner mandate): working name Axis, package `@xoroh/axis`, single package.** Naming audit: no `kern-axis`/`rn-primitives` legacy names in Kern (only current `@xoroh/kern-primitives` imports, migrating in Phase 4); Axis `axis-core` refs confined to the 6 known placeholder locations (Phase 2 rename scope). Trademark: web search inconclusive — no legal clearance claimed; domain `axis.xoroh.org` NXDOMAIN (unclaimed, not proof). Publication still requires release-policy authorization | Phase 2 |
| D-DEP | Kern↔Axis dependency model | **Settled by owner instruction** (audit 2026-10-16): Kern Native → Axis through the public package API; Axis independent of Kern (assignment §§3.3, 7). The archived no-dependency model stays superseded and must not be restored. No fresh approval required | — (settled) |
| D-FOUNDATION-CHOICE | One native foundation vs choosable foundations | **Owner decision recorded 2026-10-16, resolution pending:** Axis is the initial native foundation *under consideration* (not settled); React Native Primitives must remain a choosable alternative; Kern may depend on Axis, never the reverse; no universal themed implementation; no Axis CLI/MCP (Kern tooling is the AI surface). **Conflicts in this plan:** Phase 4 steps 1–3 + exit gate (single-target replacement, global no-duplication hard-cut), §K.6 ("no duplicate primitive implementation"), and the "second provider (rejected)" non-blocking note below. Options: (a) re-scope uniqueness per chosen foundation (hard-cut per foundation, two named providers permitted) — preserves all cutover discipline; or (b) confirm Axis-only and explicitly retire the RNP-choosable requirement. Evidence for the decision: foundation compatibility matrix of 2026-10-16 (see Phase 4 evidence block; RNP column is unknown — zero in-repo references to `react-native-primitives`/`@rn-primitives`, verified by grep; the only `RNP` hits mean "RN Paper", a surveyed design system). Until resolved, Phase 4 integration is blocked; inventory/gate work proceeds | Phase 4 (blocks integration, not inventory) |
| D-STACK | Native stack baseline | Presume RN ≥0.86 <0.89 + React 19 + Expo 57 host (evidence §C.3); adjust only on AX0 findings. locked: Expo CLI 57.0.27 / `expo ~57.0.25` / RN 0.86.3 / React 19.2.3
(`bun.lock` + `apps/mobile` manifest); peers RN `>=0.86 <0.89`, React
`^19`. D-STACK evidence-backed 2026-10-16 — recommend RN 0.86.x + React
19 + Expo SDK 57 proof host; no device available, so device proof stays
under D-DEVICE. No NativeWind (ADR-006), no web styling in Axis | Phase 2 |
| D-SPLIT | One package vs many | Single `@xoroh/axis` until AX0 proves a split (no `axis-primitives` etc. without evidence) | Phase 2 |
| D-DTCG | DTCG reference + native input shape | Confirm `2025.10` TR reference resolves; freeze Axis's native-value input contract in Phase 1 | Phase 4 |
| D-DEVICE | Device/SR verification methodology | **Methodology established 2026-10-16:** automated bar = RNTL suites + Metro `bundle` + Expo 57 host proofs (all available in-repo/CI); physical-device runs are an explicit Phase 3 gate with an owner-approved matrix-or-waiver — no device run is claimed before it executes. Emulator-less evidence is honestly labeled, never cited as device proof | Phase 3 |
| D-RELEASE | Publish rights, 2nd approver, HOLD lift, `NPM_TOKEN`/`RELEASE_CHANGESSETS` | Internal readiness verified 2026-10-16: all manifests `0.0.0` (HOLD intact), release workflow still gated on `main` + var + `npm-publish` env, CLI now `private:true`. Owner actions (2nd approver, HOLD lift, credentials) remain pre-publication and are not authorized here; publication itself stays forbidden | Phase 7 / publication |
| D-NOGO | NO-GO successor sign-off under this plan | **Extraction authorized 2026-10-16 by explicit owner mandate** (proceed with the Kern–Axis migration incl. Axis extraction once technical preconditions satisfied; preconditions not waived). Recorded here as the mandate's scope, not as release approval | Phase 5 (release sign-off still separate) |
| D-GHSA | Advisory triage + code-scanning | Dependabot shows 0 open alerts (verified) contradicting the archived "19 GHSA" claim — reconcile; decide whether to enable code-scanning (currently "no analysis found") | Phase 5 |
| D-P7 | Product-monorepo adoption | **Stays out of scope**, separately authorized or not at all | — (excluded) |
| Non-blocking (record, don't stall) | Axis website/playground; `kern info`; `mcp` rename; icon `./icons/*` codegen timing; starter matrix; F1 scope; provider-registry placement (deferred: may live neither in Axis (not neutral) nor `libs/` (deleted); trigger: a workstream needing it); second provider (SUPERSEDED 2026-10-16 — the "rejected" position is replaced by D-FOUNDATION-CHOICE, pending resolution) | Decided in Phase 6/7 or later; must not gate Phases 0–5 | — |

## J. Exact validation commands and acceptance criteria

All commands exist in manifests/workflows today (verified). Run from repo
root unless `cwd` noted. Never claim a pass without output.

**Kern — install/build:** `bun install --frozen-lockfile`;
`bun run build` (tokens build + generators + `scripts/build-order.mjs`);
`bun run check:cold` (DESTRUCTIVE to workspace — disposable runner only);
`bun run build:locked` (authorized/disposable full locked build).
**Kern — per-package matrix** (`pkg` CI job runs each): for
`@xoroh/kern-tokens`, `@xoroh/kern-material-3`, `@xoroh/kern-primitives`
(path `libs/kern-primitives`), `@xoroh/kern`, `@xoroh/kern-icons`,
`@xoroh/kern-native`, `@xoroh/kern-mcp`: `build`, `test`, `typecheck`,
`check:publish` (each package's own script); plus `test:jest` for
kern-native. Root fan-outs: `bun run typecheck`, `bun run test`,
`bun run test:native`, `bun run test:native:jest`, `bun run test:all`,
`bun run test:scripts`.
**Kern — gates** (`gates` job, each must exit 0): `bun run lint`
(locally green 2026-10-16 on the PR branch — H-01; hosted confirmation pending), `check:contrast`, `check:kern`,
`check:theme-matrix`, `check:layers`, `check:native-theme`,
`check:xoroh-leaks`, `check:workflow`, `check:ts-policy`,
`check:stale-refs`, `check:elevation-parity`, `icons:sync`,
`check:generated` + census + elevation, `check:pack` + registry-paths,
`check:primitives`, `check:coverage`, `preflight:publish`, `icons:check`,
plus the `gates`-job regenerate-and-diff step (inline in CI — there is no
`regen-diff` script; the job re-runs the generators then diffs).
Also CI-enforced but easy to miss: `check:currency`, `check:parity`,
`check:consumption` (`dist-gates` job), `check:generated:census`,
`check:elevation`, and `test:scripts`.
**Dist:** `check:dist`, `check:dist:types`
(`dist-gates` job: build → parity/currency/consumption/dist — green at HEAD).
**Apps:** site `build`, `typecheck` (current: FAIL — H-02), `check:docs`,
`check:gallery`; mobile `typecheck`, `bundle` (`expo export` + artifact
asserts). **E2E:** `bun run test:e2e` (playwright, preview `:4173`;
locally green 2026-10-16 on the PR branch, hosted confirmation pending — H-02/H-03); baseline in `test-results/baseline/`.
**Release verification (no publish):** `bun run check:publish`,
`bun run preflight:publish`, `npm pack --dry-run` per package.

**Axis — today:** `bun install --frozen-lockfile`, `bun test` (only gates
that exist). **Phase 3 adds** (mirroring Kern rigor):
`tsc --noEmit` (typecheck script), `biome check .` (lint script),
per-package `build` (`tsup` esm+cjs+dts), `test` (vitest) + `test:jest`
(RNTL), `check:publish` (`publint` + `attw --pack`), `npm pack --dry-run`,
packed-tarball-into-clean-RN-app consumer proof, zero-`--*` DTCG-boundary
scan, Expo `bundle` on the proof host. CI extends `ci.yml` accordingly.

**Git/release verification:** `git status --short --branch`,
`git rev-list --left-right --count HEAD...origin/<branch>`,
`gh pr list --repo xoroh/<kern|axis|xoroh> --state open`,
`gh run list --repo xoroh/<repo> --limit 10`,
`gh api repos/xoroh/kern/branches/main/protection`,
`changeset status` (dry-run, disposable).

Acceptance per failing check (current baselines → resolved condition):
lint 240e/58w/7i → exit 0; site typecheck fail → exit 0; e2e fail → all
specs pass in CI; pkg builds (kern, kern-native, material-3) fail → `tsup`
clean; mcp test fail → suite green. Each resolution lands as its own
reviewable change with the failing log linked — suppression (deleting or
weakening a gate, skipping a spec, narrowing a check) is forbidden.

## K. Completion criteria

The migration is complete only when **all** hold:

1. Axis owns the approved extracted implementation and its public package
   contract (§G green with evidence at an Axis commit).
2. Axis is genuinely native-mobile: no DOM/CSS/browser APIs, native
   accessibility/focus/gesture/lifecycle behavior proven on the Expo host
   (H-09/H-10 closed or explicitly deferred with owner sign).
3. Kern consumes Axis through the public interface: zero
   `@xoroh/kern-primitives` references outside the archive; `libs/`
   removed; gates retargeted and green.
4. Kern retains its M3 web + native implementations with behavior preserved
   (parity/inventory re-verified, §F.4 invariants green).
5. Sharing is neutral-only: no token/renderer reads in Axis; DTCG boundary
   documented, gated, and validated (§C.4).
6. No duplicate primitive implementation, private-source import, stale
   (`axis-core`, old-path) reference, or `workspace:*` in shipped metadata
   remains (scan proofs in both repos + packed outputs).
7. Both projects independently buildable, testable, verifiable from clean
   clones; CI green on `main` (kern/xoroh) and `development` (axis).
8. H-01–H-18 resolved or explicitly deferred with owner sign and a named
   follow-up.
9. Docs, skills, `llms.txt`/MCP discovery, and release procedures describe
   the new architecture truthfully (§F.4 + Phase 6).
10. Histories and default branches coherent and synchronized; no
    unauthorized commits, pushes, merges, tags, or releases occurred
    (final `git status`/`gh` audit in Phase 7).
11. No publication, deployment, or release occurred without explicit
    authorization (HOLD intact unless lifted by owner action D-RELEASE).

---

## Appendix — evidence map (where each claim was observed)

- Kern HEAD/sync/stashes/worktrees/branches: `git` in
  `/home/novexo/Desktop/Business/xoroh-monorepo/kern` (2026-10-16;
  worktree on `license/mit-demo@44351411`, `main`/`origin/main` at
  `f0774ae7` after owner-merged PR #23).
- Axis/Xoroh state, PRs (#18–23, Axis #1–2, Xoroh #1–3; #21/#22/#23 merged,
  #18/#19/#20 + Axis #2 + Xoroh #3 open), runs
  (`38825478289` latest main CI + `38820551374`, identical 7-failure
  signature), protection (cold-install required, admins enforced, 0
  required approving reviews), teams (release = 1 member), environments,
  Dependabot alerts (0 open kern/axis; code-scanning unconfigured):
  `gh` API/CLI as `Novexonl` (2026-10-16).
- Manifests/exports/scripts: `package.json` files (root, `packages/*`,
  `libs/kern-primitives`, `apps/*`) + `.changeset/config.json` files.
- Primitives platform proof: full read of `libs/kern-primitives/src/*.ts`
  (imports) + `index.ts` barrel + `adoption.json`.
- Consumers: `grep -rl @xoroh/kern-primitives` (40 raw matches,
  node_modules/dist excluded; ~30 real component files) + per-module
  consumer audit 2026-10-16.
- DTCG: `packages/kern-tokens/src/dtcg/{shared,export}.ts`
  (`DTCG_SPEC_VERSION = "2025.10"`).
- Lint: `bun run lint` → 240 errors / 58 warnings / 7 infos.
- npm: `npm view @xoroh/axis|axis-core` → E404; `npm whoami` → `novexonl`.
- Archive: 49 files `git mv` → `docs/archive/2026-10-axis-transition/`
  (30 `planning/` + 9 `plan/` + 3 `architecture/` + 7 `audits/`);
  index + `SUPERSEDED.md` + 2 redirect stubs + 6-line superseded banner on
  the archived redesign copy (sole modification to archived bodies).
  During the prior planning task an owner session committed the 49 staged
  renames plus its own demo fix as `license/mit-demo@44351411`
  (local-only, unpushed); `main`/`origin/main` have since advanced to
  `f0774ae7` via owner-merged PR #23. Neither planning agent created
  commits, and no pushes or Axis/private-repo modifications occurred
  (Axis HEAD `638a1a1` clean; Xoroh moved `156cc28`→`1a1b2c9` by the owner
  session only, clean and in sync).
- Execution 2026-10-16 (baseline recovery): backup verified at
  `/tmp/opencode/kern-baseline-backup-20261016/` (patch, diff, tar +
  SHA256SUMS + manifest; stashes kept intact); planning baseline
  committed (`d1d6def0` docs, `7aaf851b` CI, `402a7d48` CLI privacy);
  branch merged with `origin/main` (`c5badbcb`, clean) and pushed;
  PR #24 open (mergeable, awaiting owner review; D-NAME/D-NOGO block
  merge). Hosted CI on PR #24 (run `38833031513`): all 7 pkg legs +
  cold-install + dist-gates green; site typecheck green (apps now fails
  later at `Check site docs` — 6 pre-existing K11 errors, unmasked);
  gates/lint + e2e/#418 unchanged. Axis/Xoroh untouched throughout.
- Audit corrections applied 2026-10-16 (this pass): `main` SHA/sync,
  importer counts, portal/positioning per-symbol verdicts, CLI zero-import
  proof, latest CI run, zero-alert advisory state, H-17 CLI-privacy flag,
  §J omissions, `main`-vs-branch relations.
- Deliberately not re-verified: env-level `RELEASE_CHANGESSETS`, secret
  values, device runs, per-step CI log text (§B.7).
