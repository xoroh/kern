# Per-component documentation grammar

Status: current

Every component reference page in the site follows one fixed section order. The
order is not a style preference: it is the order in which a reader actually
needs the information, and it is the order that lets a page be checked by a gate
rather than reviewed by eye.

This file defines the grammar. It does not define the pages. Pages are **data**:
one folder per component under `apps/site/src/content/<platform>/<slug>.ts`,
typed by `apps/site/src/content/types.ts` and rendered by
`apps/site/src/components/docs/component-page.tsx`. `apps/site/**` is `site-se`'s
to own and build. Where the grammar and an existing page disagree, the page is
wrong until it is migrated.

## Why a grammar and not a template

A template produces pages that look alike and say the same nothing. A grammar
constrains *structure* and leaves the content to the component. The test of a
good component page is that a reader can answer four questions without opening
the source:

1. What is this, and when do I reach for it?
2. What does it look like — in the states that actually occur?
3. How do I change it, and what am I not allowed to change?
4. What exactly does the API accept?

Sections that answer none of those are cut. Sections that answer one of them are
required, in this order.

## The grammar

Each section below is marked **required**, **conditional**, or **omit**. A page
that omits a required section is incomplete. A page carrying a conditional
section without meeting its condition is noise — cut it.

| # | Section | Rule | Answers |
|---|---|---|---|
| 1 | Metadata strip | required | — |
| 2 | Showcase | required | 2 |
| 3 | Features | required | 1 |
| 4 | Customization | conditional | 3 |
| 5 | Deviations | conditional | 3 |
| 6 | API | required | 4 |

### 1. Metadata strip — required

A single row of facts, above the fold, before any prose:

- **Status** — `real` or `stub`, matching the generated inventory. A page that
  disagrees with `docs/components.md` is stale by definition; the inventory is
  generated, so it is the authority.
- **Package** — `@xoroh/kern`, `@xoroh/kern-native`, or `@xoroh/kern/start`.
- **Native peer** — the counterpart export, or "none" where the component is
  deliberately single-renderer. Deliberate asymmetry is named in
  `docs/parity-contract.md`; a page that says "none" without that backing is
  making a claim the parity gate cannot check.
- **Variants** — the variant axes and their values, or "none".
- **Resting elevation** — the M3 level, or "surface".

The elevation value is not free text. It comes from
`packages/kern-tokens/src/m3-elevation.ts`, which transcribes M3's
[component elevation table](https://m3.material.io/styles/elevation/tokens), and
it is asserted by `bun run check:kern`. A page whose elevation contradicts that
module is a defect in the page.

### 2. Showcase — required

Live, interactive, using the real component from the package. Not a screenshot,
not a code fence, not a reimplementation.

Every value of every variant axis appears, and every state the component
actually has (hover, focus-visible, disabled, selected, error, loading) appears
at least once. A showcase that shows only the default state documents nothing a
reader could not get from the type signature.

### 3. Features — required

Prose, second person, present tense, per the Google style guide. What the
component is for and when to reach for it instead of the neighbour. Two to five
sentences. This section is the only place a component page is allowed to
persuade; the rest is reference.

If the honest answer is "this is a thin wrapper over a Base UI primitive", say
that, and link the primitive. `switch` is 23 lines wrapping one primitive, and a
page that oversells it is worse than a page that admits it.

### 4. Customization — conditional

**Include when** the component accepts `className`, or exposes tokens a consumer
is expected to change. **Omit when** the component is fully closed — no
`className`, no themable surface.

States what is supported (`className` passthrough, a `variant` prop, CSS
custom properties) and what is not. The "not" is the load-bearing half: a reader
who assumes a `size` prop exists will waste an afternoon. Name the M3 token
(`--md-sys-shape-corner-large`), not its resolved value.

### 5. Deviations — conditional

**Include when** the component does something the M3 spec does not describe, or
describes differently. **Omit when** the component is conformant with no caveats.

Each entry names the deviation id, what M3 specifies, what kern does, and why.
A deviation with no id is not a deviation, it is an undocumented fork: the ids
live with the roles they justify, in `packages/kern-tokens/src/m3-roles.ts`
(`KERN_EXTRA_ROLES`) and `m3-elevation.ts` (`KERN_UNASSIGNED_ELEVATION`), and
`bun run check:kern` fails on one that is not registered there.

### 6. API — required

Generated from the type, or transcribed exactly from it — never paraphrased.

Props table: name, type, default, required. A prop with a non-obvious behaviour
(sets an ARIA attribute, controls focus, implies another prop) says so in the
row. `Input.errorMessage` implies `error` and wires `aria-describedby`; a page
that lists it as an optional string is actively misleading.

Events and the ARIA contract belong here too: the roles the component sets, the
keyboard interactions it implements, and what it hands back to assistive tech.
The parity contract's assertions are the source; a page that contradicts them is
a defect in the page.

## Consistency rules

1. **One component, one page.** Compound parts (`Dialog`, `DialogTitle`,
   `DialogActions`) are documented on their parent's page, not given pages of
   their own. The denominator for "every component is documented" is the
   component, not the export.
2. **No duplicated values.** No page pastes a token value, a dp number, or a
   colour. Link the token. Values in prose are values that go stale silently.
3. **The generated inventory is the index.** `docs/components.md` lists what
   exists; the pages explain it. Neither restates the other.
4. **A page never claims a gate result.** "M3 conformant" is a claim
   `check:kern` makes, not a page. Link the gate.

## Enforcement status

**This grammar is enforced.** The validator is
`apps/site/scripts/check-docs.mjs`, run as `bun run check:docs` from
`apps/site`. It landed with the first pages rather than before them, for the
reason this section originally gave: a validator that passes over zero pages is
the "gate that passes while changing nothing" failure mode.

It asserts, over the content folders:

- every required section has content, and each conditional section is either
  populated or absent — never present-but-empty;
- the metadata strip's elevation agrees with `m3-elevation.ts`. Where M3 names
  the component, the page must claim a level the spec permits. Where the level
  is a kern decision, the page must carry that decision's deviation id;
- a deviation id resolves to a registered id in `m3-roles.ts`
  (`KERN_EXTRA_ROLES`) or `m3-elevation.ts` (`KERN_UNASSIGNED_ELEVATION`);
- `meta.status` matches `docs/components.md`, and no family spans mixed
  `real`/`stub` rows;
- every part a family claims exists in the generated inventory, and no export
  is claimed by two families (consistency rule 1);
- no prose contains a raw hex colour or a dp literal (consistency rule 2);
- at least one content page exists — the failure mode named above.

Coverage is printed on every run (`17/333` inventory exports at the time of
writing) so the undocumented remainder is visible in the log rather than in an
incident. A component that neither elevation inventory covers is reported as a
**gap**, not a failure: its elevation is unasserted by any gate, and saying so
is the honest state.

The validator was mutation-tested on landing: twelve deliberate violations of
the rules above, each one confirmed to fail the gate for the expected reason. A
gate that passes is not evidence that it catches anything.
