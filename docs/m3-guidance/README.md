# M3 guidance

The teaching half of the component documentation, one file per family.

## Why this folder exists

A component page carries the REFERENCE: the live demo, the coded example, the
props table, the keyboard and screen-reader contracts, the limitations, the
spec link, and the customization surface where one is real. Everything a
reader has to look up to use the component correctly lives there, and nothing
else does — so a page can be read in one pass and checked by a gate.

The GUIDANCE — what the component is for, when to reach for it, what the
Material 3 spec says about it, the do/don't pair, the token table, the
anatomy, the deviations, the FAQ — lives here instead. It is longer, it is
read once, and it belongs to the spec rather than to the component's
contract. Splitting the two is what lets the page stay a reference and the
guidance stay teachable.

This is the one standard (ADR-115): every component page has ONE shape, and
this folder is where the guidance half of that page went.

## The rules

- **One file per family**, named after the family slug: `button.md`,
  `select.md`, `list-item.md`. The web and native pages of a family share
  one file, with a `## Web` and a `## Native` section.
- **Platform-marked.** A section that only one renderer has carries that
  renderer's marker. A reader never has to guess which platform a rule is
  about.
- **Fixed sub-order inside a platform:** Features → Usage → Tokens → Anatomy
  → Deviations → FAQ. The order is the reading order.
- **Generated, not hand-edited.** The files are rendered from
  `manifest.json` by `apps/site/scripts/migrate-guidance.mjs`, and
  `apps/site/scripts/check-guidance.mjs` re-renders them and compares
  byte-for-byte. Edit the manifest through the migration script, not the
  markdown.
- **Nothing is lost in the move.** The gate asserts that every string the
  manifest holds appears in the rendered file — the zero-lost-lines check.

## The manifest

`manifest.json` holds the moved content verbatim, per family per platform.
It is the source the files are rendered from and the record of what the pages
used to carry. It is data, not prose: a machine can read it, and the gate can
compare it to the rendered output.

## Where the pages link

Each component page carries one guidance line in its header, pointing at this
folder's file for its family. The machine surfaces (the page markdown that
feeds the MCP index and `llms.txt`) carry the guidance inline, so an agent
reads the reference AND the teaching without following a link.
