# Parity policy

Status: current

How a change decides whether it owes the other renderer something. The
current state of parity — names, counts, gaps — is in
[`../platform-parity.md`](../platform-parity.md). This page is the rule.

## The rule

**Same meanings, same tokens, same spec — different renderer.**

The system language is written once, in `@xoroh/kern-theme` (tokens,
themes, tones, feedback) and `@xoroh/kern-icons` (registry). Those are
platform-free and shared. Widgets and composition are implemented per
renderer family: DOM (`kern` + `kern-start`) versus React Native
(`kern-native`). This mirrors how M3 ships Material Web, Material Compose,
and Android from one specification.

Consequences:

- A **token** change is automatically parity-complete. Edit `tokens.json`,
both renderers change.
- A **component** change is not. Adding a web component creates a native gap
  until native implements it — and that gap is recorded, not hidden.

## What must match

| Aspect | Rule |
| --- | --- |
| Concept name | Identical, M3-canonical, unprefixed (`Separator`, not `Divider` or `NativeSeparator`) |
| `variant` meaning | Frozen per component, identical on both sides. One prop name, one meaning |
| Size scale | Same scale where the platform allows it |
| Color, shape, elevation, motion | Same resolved values — they come from `kern-theme` |
| Touch target | 48dp minimum on both |
| Structure and behavior | M3 structure. The renderer differs; the anatomy does not |
| Accessibility semantics | Same role and label intent |

## What may differ, and must be written down

Differences are legitimate when the platform genuinely differs. They are only
acceptable if they appear in the parity page's gap or exception table:

- **Primitive choice.** Web `Dialog` uses Base UI; native uses RN `Modal`.
- **API shape.** Web exports multipart parts (`DialogRoot`,
  `DialogContent`); native composes internally and exports one component.
- **A platform-mandated value set.** RN `ActivityIndicator` has two sizes,
  so native `Loader` takes `small` / `large` while web takes `sm` /
  `default` / `lg`.
- **No mobile analogue.** Tooltips and key hints are interaction concepts
  that do not transfer.

A difference that is *not* written down in the parity page is treated as an
oversight in review.

## Prohibitions

- **No bridge names.** Do not add `WebButton` / `NativeButton` pairs to make
  a mismatch disappear. Fix the concept name once.
- **No one-sided prop meaning.** If web `variant` means emphasis and native
  means shape, one of them is wrong — do not document it as a difference.
- **No invented coverage.** Do not add a native-only name to make a table
  look balanced. A missing component is a gap to schedule.
- **No `Native*` prefix on components.** The `Native*Props` *type* prefix is
  fine where RN event types force it; the component name stays canonical.

## Counting a component (the concept rule)

**Ratified 2026-10-01 (P2b-1).** This exists because the same set was measured
three different ways in one task, giving three plausible numbers, and the wrong
ones were silent.

Source of truth is the generated registry,
`packages/mcp/src/manifest.ts` (`name`, `export`, `platform`, `path`, `status`).
Refresh with `bun run generate:components`. **A count is stated in concepts, never
in source files.**

A registered row is a **concept** unless it is a **sub-part**:

> A name is a sub-part when stripping a part suffix yields a name that is **already
> a registered row on the same platform**.

So `table-body` is a part of a registered `table`, and `accordion-root` is a part
of `accordion`. But `segmented-button` is **not** a part of any registered
`segmented` — it stands alone as a concept.

Two failure modes this rule exists to prevent, both of which shipped:

- **Stripping too much.** Treating `-button`/`-tab`/`-body`/`-head` as always-part
  suffixes rewrites `segmented-button` into `segmented`, which then looks
  web-only. `segmented-button` ships on **both** sides, so the wrong set tells you
  to build something that exists. Strip only when the result is a real row.
- **Stripping nothing.** Counting every registry row as a concept invents
  web-only rows for `table-body` / `tabs-tab`, whose parents are already shared.

**Counts are claims about work; verify before dispatching.** Spot-check 2-3
members you already know are symmetric (`segmented-button`, `command`,
`snackbar`) before a derived set sends anyone to build. A wrong set is usually
self-consistent and produces no error.

Current measured state (registry: 314 rows, web 236 / native 78): **45 shared
concepts, 26 native-only, 34 web-only, 0 stubs.** Per-component contracts live in
[`../parity-contract.md`](../parity-contract.md).

## When you add or change a component

1. Decide the concept and its canonical M3 name first. Check
   [`../platform-parity.md`](../platform-parity.md) — if the concept already
   exists on the other side, reuse its name exactly.
2. Freeze the `variant` meaning if the component is new, and add it to the
   variant-law table in the parity page.
3. Implement on the renderer family that owns the change.
4. Update the coverage table and the gap list in the parity page. Counts
   come from `bun run generate:components`; never hand-edit
   `docs/components.md`. **Count concepts per the rule above, not files.**
5. If a prop differs, add a row to the prop-difference table with the reason.
6. If the component is a **behaviour**, add its row to
   [`../parity-contract.md`](../parity-contract.md) — written as `role` / label /
   state, never as primitive internals, so no future primitive ruling can
   invalidate it.

Steps 4 and 5 are what make the parity page true. A component landed without
them makes the page a lie within one commit.

## Verifying

```bash
bun run generate:components   # refresh docs/components.md
bun run check:m3              # naming law + token-only roles
bun run check:contrast        # 4.5:1 text / 3:1 UI across presets and modes
bun run test:all              # web + icons + start + native render tests
```