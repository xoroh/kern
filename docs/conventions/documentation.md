# Documentation rules

Status: draft

We follow open standards instead of inventing our own. When a standard
evolves, we re-align — this file records what we follow and where it lands.

## Standards we follow

| Standard | Source | Applies to |
|---|---|---|
| Diátaxis documentation framework | https://diataxis.fr | Doc structure (quadrants below) |
| Google developer documentation style guide | https://developers.google.com/style | Prose voice for all user-facing docs |
| Agent Skills specification | https://agentskills.io/specification | `.agents/skills/` format and layout |
| Material Design 3 | https://m3.material.io | Design canon, via the kern skill |

## Diátaxis mapping

| Quadrant | Home | Examples |
|---|---|---|
| Tutorials (learning) | `apps/docs/` getting-started | Install Kern, first Button |
| How-to (task) | `apps/docs/` guides | Theme swapping, EmDash setup |
| Reference (information) | Generated from code + tokens | Props tables, token values |
| Explanation (understanding) | Concepts, skill canon | Theming model |

Our addition on top: **skills as machine-readable reference**. Diátaxis
predates AI agents; `.agents/skills/kern/` carries the same knowledge in
agent-activatable form. Human and agent docs must agree — update both.

## Principles

1. One canonical source per fact. Docs explain and link — never compete.
2. Code/config is canonical for values; docs are canonical for meaning,
   ownership, boundaries, decisions.
3. Update docs in the same change as the code. Never defer.
4. Link, don't duplicate. Small clarifying examples are fine; mirrors aren't.
5. Smallest valid owner: package truth lives with the package, repo truth
   in `docs/`, product truth in `apps/docs/`, agent truth in skills.
6. Voice follows the Google style guide: second person, present tense,
   sentence case, scannable headings.

## Status labels

Every doc declares one, right after the title:

- `placeholder` — structure only, needs real content
- `draft` — written, not yet reviewed against implementation
- `current` — verified accurate
- `stale` — suspected out of date (fix or re-verify)
- `deprecated` — phased out, kept as reference

## Merge gate

Before merge: behavior docs updated, changeset added for `packages/`
changes, skill refs updated if guidance changed, `Status:` lines correct,
`bun run lint` clean, README indexes list new files. No empty placeholders,
no unrelated edits, no pasted source values.
