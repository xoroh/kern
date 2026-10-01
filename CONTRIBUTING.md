# Contributing to Kern

Status: current

Bun monorepo. `bun install` to start, `bun run build` before you expect
anything to resolve. Understand the packages first:
[`docs/architecture.md`](docs/architecture.md).

## Per-PR requirements

1. **Changeset** — every PR touching a published package under `packages/`
   adds one: `bun run changeset`. Check what would release:
   `bun x changeset status`. Docs-only and CI-only changes need none. The
   rules for choosing a bump and naming packages are in
   [`docs/conventions/changesets.md`](docs/conventions/changesets.md).
2. **Docs in the same change** — never defer. If you changed a component,
   token, or convention, update the matching page: the site
   (`apps/site/`), the generated inventory (`bun run generate:components`),
   the parity tables, or the skill refs. The docs skill
   ([`.agents/skills/docs/SKILL.md`](.agents/skills/docs/SKILL.md)) says
   exactly where each change type goes.
3. **Lint clean** — `bun run lint` passes; `bun run format` fixes. Config:
   `biome.json` (lint + format + import order).
4. **Types and tests pass** — `bun run typecheck` and `bun run test:all`
   (vitest for theme/web/icons/start, Jest + React Native Testing Library for
   native).
5. **Gates green** — `bun run check:m3`, `bun run check:contrast`, and
   `bun run check:publish` when you touched `package.json` `exports`,
   `files`, or peers. `check:m3` is the design law made executable, not a
   formality.
6. **Conventional commits** — `feat:`, `fix:`, `docs:`, `chore:`,
   `refactor:`, `ci:`.
7. **Design work** — read [`.agents/skills/kern/SKILL.md`](.agents/skills/kern/SKILL.md)
   first. The system law is locked: M3 semantics, unprefixed M3-canonical
   names, hard cuts over deprecation shims, and Kern stays standalone — no
   downstream product references anywhere in code or docs.

## Adding a component

The full checklist is in
[`docs/conventions/parity.md`](docs/conventions/parity.md) and
[`docs/conventions/stubs.md`](docs/conventions/stubs.md). Short version:
M3-canonical name → implement on the renderer family that owns the change →
freeze the `variant` meaning → export from the barrel with its props type →
tests beside the file → changeset → regenerate the inventory → update the
parity page.

Composition (blocks, scaffolds) belongs in `@xoroh/kern/start` and stays
domain-free: auth, routing, and tenancy arrive as props and slots, never as
dependencies.

## Generated files

Never hand-edit these; fix the generator.

```
packages/kern-tokens/src/tokens.css      bun run generate:tokens
packages/kern-tokens/src/tones.css       bun run generate:tones
packages/kern-tokens/src/motion.css      bun run generate:motion
packages/mcp/src/manifest.ts            bun run generate:components
packages/mcp/src/component-sources.ts   bun run generate:components
docs/components.md                      bun run generate:components
```

`bun run build` runs every generator, so a clean build proves they are
reproducible.

## Flow

Fork/branch → PR against `main` → review → merge. Versioning and publishing
run through the **Version Packages** PR (see
[`docs/releases.md`](docs/releases.md)) — never publish by hand. Publishing
itself is founder-gated.

## Reporting bugs

Use the repository issue templates (`.github/ISSUE_TEMPLATE/`). For
security issues, do **not** open a public issue — see
[`SECURITY.md`](SECURITY.md).

## Code of conduct

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — Contributor Covenant.