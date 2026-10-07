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
| [`components.md`](components.md) | Which components exist, real or stub | **generated** — `bun run generate:components` |
| [`platform-parity.md`](platform-parity.md) | How web and native correspond; where they differ | hand-written, counts from the generated inventory |
| [`releases.md`](releases.md) | How versioning and publishing work | hand-written |
| [`verification-limits.md`](verification-limits.md) | **What the test suite does and does not prove** — 950 unit tests, no e2e layer, no visual regression | hand-written, figures measured |

## Conventions

[`conventions/`](conventions/) — file ownership, documentation rules,
changesets, parity, stubs. Each one is a rule, not a description.

## Decisions

[`adr/`](adr/) — accepted decisions with their context. One problem per
file, numbered, status `accepted` / `superseded`.

| ADR | Decision |
| --- | --- |
| [001](adr/001-esm-only.md) | ESM-only package output |
| [002](adr/002-base-ui-primitives.md) | Base UI primitives for web components |
| [003](adr/003-generated-inventory.md) | Generate the component inventory; never hand-edit it |

## Plans

[`plan/`](plan/) — the roadmap and per-area plans.
[`plan/README.md`](plan/README.md) holds the tracker table and the locked
system law; each work item gets its own file with its decisions and
acceptance criteria.

## Reading order

New to the repo:

1. [`architecture.md`](architecture.md) — the shape of the thing.
2. [`.agents/skills/kern/SKILL.md`](../.agents/skills/kern/SKILL.md) — the
   design authority.
3. [`conventions/file-ownership.md`](conventions/file-ownership.md) — what
   may import what.
3a. [`conventions/primitives.md`](conventions/primitives.md) — the two-layer
   shape of `@xoroh/kern-primitives` (renderer-agnostic logic below, Base
   UI-shaped widget layer above) and the extraction sequence. Enforced by
   `check:primitives`.
4. [`CONTRIBUTING.md`](../CONTRIBUTING.md) — the per-PR requirements.
4a. [`verification-limits.md`](verification-limits.md) — what green CI does
   and does not prove. Read it before trusting a passing run as evidence that
   something works.
5. [`plan/README.md`](plan/README.md) — what is being built next.

Building UI with Kern: the package README for the package you need
(`packages/kern/README.md`), then
[`platform-parity.md`](platform-parity.md) if you touch both renderers.