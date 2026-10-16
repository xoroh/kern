# 003. Generated component inventory

Status: accepted

## Context

Agents and tools need a truthful inventory of every component (name, platform,
path, real/stub status) and the ability to quote component source inline
without hitting the filesystem at runtime.

## Decision

`packages/mcp/scripts/generate-manifest.mjs` generates `manifest.ts` (typed
inventory) plus `docs/components.md`. Generated files are committed; CI
regenerates and diffs
(`git add -N` + `git diff --exit-code`) so drift fails the build.

> **Amended.** This ADR previously also claimed the script generates
> `component-sources.ts`. It no longer does: the embedded-source blob was
> deleted (474KB of generated text nothing read) and the generator carries an
> explicit comment saying so — `COMPONENT_SOURCES IS DELIBERATELY NOT GENERATED.
> Do not re-add it verbatim.`

## Consequences

- Inventory is never hand-edited (biome overrides keep generated files
  untouched by format/lint).
- Adding a component file makes `generate:components` the only maintenance
  step.
