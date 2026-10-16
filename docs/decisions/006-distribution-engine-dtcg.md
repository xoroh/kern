# 006. Distribution engine: own-the-code CLI over DTCG tokens, multi-design-system by adapters

Status: accepted (2026-10-14)

## Context

How Kern reaches a project was an open question with three candidate
shapes: an npm component package (like most design systems), a registry +
CLI that vendors source into the consumer's repo (shadcn's model), or both
as parallel doors. A parallel external blueprint review proposed a fourth
framing — Kern as a zero-dependency, cross-platform *meta* design system
engine with DTCG at the base and design-system presets on top. This ADR
records what was decided after reconciling that blueprint against measured
facts about this repo.

Facts established at decision time (measured, not assumed):

- `kern add` already vendors web **and native** components; the Button's
  closure is 4 code files (button, circular-progress, focus-ring, utils/cn)
  plus a receipt. The CLI README's "native refused" line was stale.
- A vendored web component builds **only** if the consumer's Tailwind
  compiles its class strings, and Tailwind's automatic detection does not
  reliably scan `node_modules` — which forced an explicit `@source` line
  for package consumers (measured: 2 of 11 utilities found by automatic
  detection, 11 of 11 with an explicit scan). Vendored code in the
  consumer's own `src` has no such problem.
- NativeWind v5 is RC0, pinned to `react-native-css@3.1.0-rc.0`, has a
  known Android animation-cancellation issue, and **rejects `:root.dark`
  selectors** — breaking the paste-in brand block on native.
- The DTCG projection already exists: `src/dtcg.json` is a validated
  DTCG 2025.10 document with 421 tokens — but **0 aliases and 0
  `$description`s**: the current custom-schema source is fully flattened
  on the way out.
- "Zero-dependency" is false as shipped: `circular-progress.tsx` imports
  runtime values (`feedbackTiming`, `resolveFeedbackVariant`) from
  `@xoroh/kern-tokens`; a vendored Button's build fails without it.
- `@xoroh/kern-primitives` is a shared behavior kernel (controllable
  state, focus trap, dismiss policy, selection) consumed by **both**
  renderers — not a mobile-only primitive set.

## Decision

1. **One distribution door: own the code.** `kern add` is the product;
   the CLI is not a convenience. Users never install `@xoh/kern` as a UI
   dependency.
2. **Ownership lifecycle before launch.** `kern list`, `kern diff`,
   `kern upgrade` (and `kern info`) ship before the door opens publicly.
   Owning code without an upgrade bridge freezes consumers at the version
   they copied; receipts (per-file hashes) already carry the data.
3. **Packages are internal infrastructure, not a product.** They remain
   the registry source the CLI vendors from, the floor, and what
   `apps/site` consumes. No marketed package door.
4. **Retire the zero-dependency claim; declare the floor.** The honest
   dependency floor is `@xoroh/xern-tokens` + `@xoroh/kern-primitives` +
   `@base-ui/react` + `class-variance-authority` + `clsx` +
   `tailwind-merge` — radix-parallel, documented plainly. Radix is never
   adopted; React Aria is a later, adapter-shaped addition.
5. **NativeWind is removed.** Native styling = `StyleSheet` + typed
   tokens (current architecture). Cross-platform parity lives at the API
   and token level, not at the class-string level. Tailwind v4 remains the
   web-only styling dialect; vanilla CSS modules are explicitly out of
   scope.
6. **DTCG becomes the canonical token source.** `kern.tokens.json` (+
   `presets/*.tokens.json`) is the only hand-maintained token artifact;
   web CSS vars, native TS tokens, and (later) bridges are generated. The
   migration is contained by output stability: token names — —
   `--sys-*` — do not move, so components, the site, class strings,
   and the contrast gates are untouched. **Acceptance: generated outputs
   byte-stable against the pre-migration pipeline.**
7. **Namespace stays; M3 becomes a preset.** The `sys.*` role contract is
   the engine's contract and M3 is its first preset and default. Kern's
   independence from M3 comes from the swap mechanism and adapter
   architecture, not from renaming. Neutralizing the semantic vocabulary
   is deferred until the first foreign preset forces the answer.
8. **Three-tier taxonomy is formalized**: `ref` (primitives, scale-based
   names) → `sys` (semantic roles, the only tier components consume) →
   `comp` (component tokens). Modes move to files/sets
   (light/dark, identical token names) in preference to
   `sys.color.light.*` group nesting.
9. **Aliases and descriptions become mandatory.** Every `sys`/`comp`
   token binds via `{ref.…}` aliases and carries `$description` — the
   AI-context layer — with engine metadata (`cssVar`, pairing, contrast
   floor) in `$extensions."org.xoroh.kern"`.
10. **Meta-design-system = adapters in, bridges out.** External DTCG
    documents (design tools, other systems' exports) map into the `sys`
    contract via preset adapters; the shadcn bridge
    (`--primary: var(--sys-color-primary)`) exports reverse mappings so
    shadcn-registry components restyle under Kern. Other preset families
    (Carbon, Fluent, …) are deferred to demonstrated demand.
11. **Users extend by three sanctioned levels**: presets (values of
    existing roles), extension files (new roles/primitive/component tokens
    merged at `kern build`, never overwritten by upgrades), and direct
    edits (component code or core files, receipt-tracked divergence).
    `kern check` extends the contrast and pairing gates to user files.
12. **CLI surface**: `init` · `build` · `add` · `switch` · `list` ·
    `diff` · `upgrade` · `info`. Transactional throughout — the CLI never
    executes installs itself. Generic engine, narrow launch surface
    (Base UI, Tailwind, StyleSheet, the M3 preset); the architecture ships
    the slots, launch ships one thing per slot.

## Consequences

- The native door gets materially cheaper: no engine version contract, no
  RC to ride, no Metro/Babel/PostCSS machinery to template, no animation
  engine watch-list. The cost is class-string parity, which buys less
  than API + token parity anyway.
- The shadcn bridge later makes the entire shadcn-registry ecosystem
  compatible surface Kern doesn't have to write components for.
- The DTCG migration is contained to the token pipeline package + the
  CLI's `build` + preset files; byte-stable outputs are the gate that
  proves it. No component, site, or gate rewrites.
- We lose, by design: shadcn's Tailwind-parity-on-native, and any
  no-Tailwind web offering. Both documented, not apologized for.
- The open risk carried forward: vocabulary. The contract is M3-shaped
  until a foreign preset proves otherwise. The first adapter that has to
  map a non-M3 role set into `sys.*` is the evaluation point, expected
  with the first external preset.
- The `@source "./components"` line added to `packages/kern/src/theme.css`
  during evaluation stays: with no marketed package door it now serves
  internal consumers (the site, monorepo apps) only, and is documented as
  such.
