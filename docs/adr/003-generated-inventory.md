# 003. Generated component inventory

Status: accepted

## Context

Agents and tools need a truthful inventory of every component (name, platform,
path, real/stub status) and the ability to quote component source inline
without hitting the filesystem at runtime.

## Decision

`packages/mcp/scripts/generate-manifest.mjs` generates `manifest.ts` (typed
inventory) and `component-sources.ts` (embedded sources) plus
`docs/components.md`. Generated files are committed; CI regenerates and diffs
(`git add -N` + `git diff --exit-code`) so drift fails the build.

## Consequences

- Inventory is never hand-edited (biome overrides keep generated files
  untouched by format/lint).
- Adding a component file makes `generate:components` the only maintenance
  step.
