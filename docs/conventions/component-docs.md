# Per-component documentation grammar

Status: current

Every component reference page in the site follows ONE page shape. The shape is
not a style preference: it is the order in which a reader actually needs the
information, and it is the order that lets a page be checked by a gate rather
than reviewed by eye.

There are no tiers. Decision 013 split the families into a "top 20" that
carried full pages and every other family that carried a thin-but-correct
page; that split is **superseded** (ADR-115, the one standard). Every
component page is the same shape, and the half that used to differ between
families — the teaching — lives in one place per family
(`docs/m3-guidance/<family>.md`).

This file defines the grammar. It does not define the pages. Pages are
**data**: one file per component under
`apps/site/src/content/<platform>/<slug>.ts`, typed by
`apps/site/src/content/types.ts` and rendered by
`apps/site/src/components/docs/component-page.tsx`. Where the grammar and an
existing page disagree, the page is wrong until it is migrated.

## Why a grammar and not a template

A template produces pages that look alike and say the same nothing. A grammar
constrains *structure* and leaves the content to the component. The test of a
good component page is that a reader can answer four questions without opening
the source:

1. What is this, and how do I write it?
2. What exactly does the API accept?
3. How does it behave for keyboard and screen-reader users?
4. Where does it stop, and what does the spec say?

Sections that answer none of those are cut. Sections that answer one of them
are required, in this order.

## The one standard page

Eight slots. Seven of them are sections (h2); the eighth is the lede, which is
the page header rather than a section. The order is fixed and identical for
every family:

| # | Section | Rule | Answers |
|---|---|---|---|
| — | Lede (h1, one-liner, metadata strip) | required | — |
| 1 | Demo | required | 1 |
| 2 | Example | required | 1 |
| 3 | Props | required | 2 |
| 4 | Accessibility | required | 3 |
| 5 | Limitations | conditional | 4 |
| 6 | Spec | required | 4 |
| 7 | Customization | conditional | 4 |

**Required** means the slot renders on every page, with an honest fallback
where the content is not written yet ("Not yet documented — interactive, so
the contract exists; it just has not been written up here yet") rather than a
silent absence. **Conditional** means the slot renders only when the content
carries it, and a conditional slot without its content is noise: cut it.

The predicates that decide the conditional slots live in
`apps/site/src/systems/grammar.ts` — `hasLimitations` (a known accessibility
gap, or the exemption notice) and `hasCustomization` (at least one supported
line, or at least one line naming what is NOT supported). The template and the
gate apply the SAME functions, so they cannot disagree about what a page
should show.

### Lede — required

The page header: the h1, the one-liner (one sentence, ≤200 chars) and the
metadata strip. The strip is reference, not guidance, so it stays: status
(`real`/`stub`, matching the generated inventory), package, native peer,
variant axes, resting elevation, and the four external links.

The elevation value is not free text. It comes from
`packages/kern-m3/src/kern-elevation.ts`, which transcribes M3's
[component elevation table](https://m3.material.io/styles/elevation/tokens), and
it is asserted by the docs gate. A page whose elevation contradicts that
module is a defect in the page.

The lede carries the one-liner and NOTHING else. The features prose — the
"reach for X when…" pitch — moved to the guidance file; a lede that rendered
it as well would say it twice, on two surfaces that drift apart.

### 1. Demo — required

Live, interactive, using the real component from the package. Not a
screenshot, not a code fence, not a reimplementation.

Every value of every variant axis appears, and every state the component
actually has (hover, focus-visible, disabled, selected, error, loading) appears
at least once. A demo that shows only the default state documents nothing a
reader could not get from the type signature. The states the component
registers are listed on the page as `states`, carried over from the token
table that moved to the guidance file.

### 2. Example — required

The family's coded usage example — the thing a reader copies. This is the
"doing" half of the documentation: the Do/Don't rules in the guidance file
say what is right, the example shows it.

The slot always renders. A family with no registered example says so ("No
coded example is registered for X yet — that is a gap in the site, not in the
package"), because a heading over nothing is noise and a heading over an
admission is a report. The fence itself is compiled by the example gate
(`check-example-code`), which today holds the floor for the most-used exports;
every family is to carry one.

### 3. Props — required

Generated from the type, or transcribed exactly from it — never paraphrased.

Props table: name, type, default, required. A prop with a non-obvious
behaviour (sets an ARIA attribute, controls focus, implies another prop) says
so in the row. `Input.errorMessage` implies `error` and wires
`aria-describedby`; a page that lists it as an optional string is actively
misleading.

A row may carry `for: ["PartA", ...]` to document a prop only on the parts
whose types carry it (compound families: `nativeButton` on triggers,
`initialFocus` on content). Rows without `for` document the prop on every
part in the file. The props gate fails a `for` that names a non-part or a
name nothing scoped carries; the page renders per-part tables merged by name,
so a scoped row lands exactly where the type carries it.

### 4. Accessibility — required

The keyboard contract (a table of key → action) plus the screen-reader
contract (the ARIA notes), plus the known gaps where a gap exists.

A component with no keyboard behaviour (`Skeleton`, `Separator`) says so with
`nonInteractive: true` — the flag means "no keyboard contract by nature",
never "not yet written". A component without it is interactive-but-
undocumented, and the page says exactly that rather than dropping the section.
Silent absence is the failure this exists to prevent: a reader cannot tell
"we covered it" from "nobody wrote it".

The old semantic-dom slot is dissolved, not moved: the anatomy half went to
the guidance file, and the roles half merged into this section, because "what
it hands to assistive tech" is a contract, not a mental model.

### 5. Limitations — conditional

**Include when** the component has a known accessibility gap, or the page
carries a `grammarExempt` notice. **Omit when** there is no boundary on
record — a heading over nothing is noise.

A gap we know about is a fact; a gap we hide is a defect. The exemption
notice states why a page cannot meet the grammar; the gate lists exempt pages
rather than silently passing them.

### 6. Spec — required

The Material 3 source link. A URL, or "none" — recorded as "this component
has no Material 3 source", which is a different claim from "not recorded yet"
and is kept distinct on purpose. The deviations themselves are guidance now
(see below), so this section is the link, not a table of records.

### 7. Customization — conditional

**Include when** the component really offers an extension surface: at least
one supported line (`className` passthrough, a variant axis, tokens a consumer
is expected to change), or at least one line naming what is NOT supported.
**Omit when** the component is fully closed.

The "not" half is load-bearing: a reader who assumes a `size` prop exists
will waste an afternoon. Name the M3 token (`--sys-shape-corner-large`), not
its resolved value.

## What stays on the page — the reference core

`meta`, `oneLiner`, `parts`, `api`, `keyboard`, `aria`, `accessibilityGaps`,
`nonInteractive`, `customization`, `grammarExempt`, `states`.

## What moved — the teaching half

These fields left the pages on 2026-10-19 and now live in
`docs/m3-guidance/<family>.md`, one file per family, moved **verbatim**:

- `features` — the pitch ("reach for X when…").
- `usage` — the Do/Don't pair.
- `tokens` — the M3 token table per state.
- `anatomy` — the part/role decomposition.
- `deviations` — the spec-vs-kern records, with their registered ids.
- `faq` — the answered questions.

The page keeps the reference; the guidance file keeps the teaching. A page
that still carries one of those fields says the same thing twice, and the
guidance file goes stale the moment the page is edited — so the guidance gate
fails any page that has one.

### The guidance file

`docs/m3-guidance/<family>.md`, generated, never hand-edited. Its shape:

```
# <Family> — M3 guidance

<!-- the generated header -->

## Web        (the moved content, per platform)
### Features
### Usage      (Do / Don't)
### Tokens
### Anatomy
### Deviations from Material 3
### FAQ

## Native     (the same, where the family exists on both renderers)
```

`docs/m3-guidance/manifest.json` holds the moved values verbatim, per family
per platform. It is the receipt: the gate re-renders each guidance file from
the manifest and compares it byte-for-byte, and asserts that every string the
manifest holds appears in the file (the zero-lost-lines check). A hand-edit to
a guidance file is caught; a dropped line is caught.

### The guidance link line

The page header carries one line linking to the family's guidance file. It is
the single addition the move allowed on the page: readers who want the
teaching need to be able to find it, and a link says where it is without
duplicating it.

## The machine surface

Every component page emits a `.md` (`public/md/<platform>/<slug>.md`, and the
MCP index points at it). It carries the page's sections in grammar order, plus
a `## M3 guidance` section with the family's guidance, so an agent reading
the `.md` gets the whole page — reference AND teaching — from one file.

## Consistency rules

1. **One component, one page.** Compound parts (`Dialog`, `DialogTitle`,
   `DialogActions`) are documented on their parent's page, not given pages of
   their own. The denominator for "every component is documented" is the
   component, not the export.
2. **No duplicated values on the page.** No page pastes a token value, a dp
   number, or a colour. Link the token. Values in prose are values that go
   stale silently. The rule binds the PAGE: the guidance file is the M3
   mapping, where a quoted spec dimension ("the 3px indicator") is a
   citation, and the token table carries resolved values by definition.
3. **The generated inventory is the index.** `docs/components.md` lists what
   exists; the pages explain it. Neither restates the other.
4. **A page never claims a gate result.** "M3 conformant" is a claim
   `check:kern` makes, not a page. Link the gate.
5. **One shape, no tiers.** Every family carries the same sections. There is
   no "full page" and no "thin page" — a family that lacks content fails the
   gate like any other.

## Enforcement status

**This grammar is enforced.** Four gates, all run by `bun run check:docs`
from `apps/site`:

- **`scripts/check-grammar.mjs`** — the template renders exactly
  `GRAMMAR_ORDER`, in order; the conditional sections are gated on the shared
  predicates; the lede renders the h1 and the one-liner and nothing else; the
  required/conditional split partitions the order. The template's headings are
  read from the template itself rather than from a second list, so renaming a
  section component cannot make the gate drift.
- **`scripts/check-guidance.mjs`** — the guidance corpus: every family has a
  file and a manifest entry, each file equals a fresh render from the
  manifest, every manifest string appears in the file (zero lost lines), no
  page still carries a moved field, and a page whose token table moved keeps
  the `states` list it carried over.
- **`scripts/check-docs.mjs`** — the content: the metadata strip's elevation
  agrees with `kern-elevation.ts`; a deviation id resolves to a registered id
  and a kern-decision elevation carries its decision's deviation (read from
  the guidance manifest, where the records live now); every part a family
  claims exists in the generated inventory and no export is claimed by two
  families; no page prose contains a raw hex colour or a dp literal; at least
  one content page exists.
- **`scripts/check-page-md.mjs`** — every page emits a well-formed `.md` in
  grammar order, with its guidance section.

The gates ship with their break-it tests: `scripts/check-docs.test.mjs` and
`scripts/check-guidance.test.mjs` fail on the real tree when a family loses
its guidance, when a page regains a moved field, or when a guidance file is
hand-edited. A gate that passes is not evidence that it catches anything.
