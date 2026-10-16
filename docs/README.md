# Kern docs map

Status: current

Four doc kinds. Don't mix them.

- **Product docs** → `apps/site/` (kern.xoroh.org): component pages, guides,
  getting started. Written for users, human and AI.
- **Reference** → `docs/`: generated inventory, parity, releases. Derived
  from code; regenerate rather than edit.
- **Contributor docs** → `docs/` (this folder): process, conventions,
  decisions.
- **Agent knowledge** → `.agents/skills/`: `kern` (design authority),
  `kern-agents` (consume Kern as an agent via the machine surfaces),
  `docs` (how to keep all of the above updated).

Rule: update docs in the same change as the code — never defer. The `docs`
skill (`.agents/skills/docs/SKILL.md`) defines exactly where each change type
goes.

## Reference

| Doc | What it answers | Source |
| --- | --- | --- |
| [`architecture.md`](architecture.md) | What the packages are and how they fit together | hand-written |
| [`architecture/kern-axis-migration-and-roadmap.md`](architecture/kern-axis-migration-and-roadmap.md) | **Authoritative plan**: migration phases, decisions, risks, validation | hand-written |
| [`components.md`](components.md) | Which components exist, real or stub | **generated** — `bun run generate:components` |
| [`platform-parity.md`](platform-parity.md) | How web and native correspond; where they differ | hand-written, counts from the generated inventory |
| [`parity-contract.md`](parity-contract.md) | The cross-renderer parity contract (observable semantics) | hand-written |
| [`binding-contract.md`](binding-contract.md) | Framework binding rules (what each renderer may assume) | hand-written |
| [`*-family-reference.md`](button-family-reference.md) | Per-family deep references (button, display-overlays, feedback, form, navigation) | hand-written |
| [`elevation-audit.md`](elevation-audit.md) | Resting-elevation audit, every web concept | **generated** — `bun run audit:elevation` |
| [`releases.md`](releases.md) + [`versioning.md`](versioning.md) | How versioning and publishing work | hand-written |
| [`site-design.md`](site-design.md) | Docs-site design system (chrome, grammar, verification) | hand-written |
| [`verification-limits.md`](verification-limits.md) | **What the test suite does and does not prove** — 1689 tests, 6 e2e specs, no visual regression | hand-written, figures measured |

## Conventions

[`conventions/`](conventions/) — file ownership, documentation rules,
changesets, parity, stubs. Each one is a rule, not a description.

## Decisions

[`decisions/`](decisions/) — the canonical decision record (001–020, consolidated; the old `adr/` location is removed). One problem per
file, numbered, status `accepted` / `superseded`. Full index: [`decisions/README.md`](decisions/README.md).

| ADR | Decision |
| --- | --- |
| [001](decisions/001-esm-only.md) | Dual ESM + CJS package output |
| [002](decisions/002-base-ui-primitives.md) | Base UI primitives for web components |
| [003](decisions/003-generated-inventory.md) | Generate the component inventory; never hand-edit it |
| [004](decisions/004-stability-windows.md) | 1.0 stability carve-out (hard cuts before 1.0; deprecation window from 1.0) — `proposed` |
| [005](decisions/005-theming-pipeline.md) | Theming pipeline explicit: matrix artifact, override-only presets, engine boundary |
| [006](decisions/006-distribution-engine-dtcg.md) | Distribution engine: own-the-code CLI over DTCG tokens, multi-design-system by adapters |
| [007](decisions/007-axis-native-foundation.md) | Axis is the native foundation; `kern-primitives` dropped once Axis is ready |
| [008](decisions/008-system-scoped-urls.md) | System-scoped URLs (superseded by 018 and 020) |
| [009](decisions/009-generated-registry-and-system-flag.md) | One generated registry plus `--system` |
| [010](decisions/010-kern-m3-rename-and-no-global-registration.md) | Rename `kern-material-3` to `kern-m3` (hard rename, no alias); `@xoroh/kern` does not register M3 globally |
| [011](decisions/011-install-docs-release-availability.md) | Install docs honesty until publish |
| [012](decisions/012-cli-publishable.md) | Kern CLI is publishable in 0.1.0 |
| [013](decisions/013-docs-depth.md) | Docs depth bar for 0.1.0 |
| [014](decisions/014-button-variant-names.md) | M3 button variant names (hard cut) |
| [015](decisions/015-state-props-base-ui-names.md) | State props follow Base UI names |
| [016](decisions/016-hct-tonal-palettes.md) | HCT tonal palettes and full color roles |
| [017](decisions/017-per-system-packages.md) | Per-system preset plus per-platform widgets |
| [018](decisions/018-component-page-tabs.md) | One docs page per component with Web/Native tabs (supersedes 008) |
| [019](decisions/019-ai-chat-in-kern.md) | AI chat styled parts live in Kern, voice deferred |
| [020](decisions/020-no-backward-compat.md) | No backward compatibility before the first public release (0.1.0 Preview); merges old `adr/007` |

## Plans

[`architecture/kern-axis-migration-and-roadmap.md`](architecture/kern-axis-migration-and-roadmap.md) —
the authoritative roadmap (tracker, decisions, risks, validation). The old
[`plan/`](plan/) and [`planning/`](planning/) directories are archived
history (see `docs/archive/2026-10-axis-transition/ARCHIVE_INDEX.md`); their
README stubs say so and must not be cited as the plan.

## Reading order

New to the repo:

1. [`architecture.md`](architecture.md) — the shape of the thing.
2. [`.agents/skills/kern/SKILL.md`](../.agents/skills/kern/SKILL.md) — the
   design authority.
3. [`conventions/file-ownership.md`](conventions/file-ownership.md) — what
   may import what.
3a. [`conventions/primitives.md`](conventions/primitives.md) — the post-cutover
   primitives boundary: `libs/kern-primitives` frozen pending the Axis-side
   deletion, `@xoroh/axis` as the behavior kernel, retargeted gates.
   Enforced by `check:primitives`.
4. [`CONTRIBUTING.md`](../CONTRIBUTING.md) — the per-PR requirements.
4a. [`verification-limits.md`](verification-limits.md) — what green CI does
   and does not prove. Read it before trusting a passing run as evidence that
   something works.
5. [`architecture/kern-axis-migration-and-roadmap.md`](architecture/kern-axis-migration-and-roadmap.md) —
   what is being built next (phases, decisions, risks).

Building UI with Kern: the package README for the package you need
(`packages/kern/README.md`), then
[`platform-parity.md`](platform-parity.md) if you touch both renderers.