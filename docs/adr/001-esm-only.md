# 001. Package output format

Status: accepted (amended 2026-09-29)

## Context

Packages must work from modern bundlers (ESM), older tooling (CJS), and
TypeScript under every module resolution mode.

## Decision

Ship **dual output** — `esm` + `cjs` — with split type declarations
(`index.d.ts` + `index.d.cts`) via `tsup --dts --dts-resolve`. Subpath
exports pin `import`/`require` conditions explicitly.

(Originally drafted as ESM-only; the CJS leg was added before first publish
because `require` consumers and attw's node10 resolution both failed without
it. The "esm-only" file name is kept for the ADR trail.)

## Consequences

- `publint` + `attw --pack` are release gates (`check:publish` per package).
- `prepare` builds on install; CI installs with `--ignore-scripts` and builds
  explicitly to avoid double work.
