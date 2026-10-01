---
name: docs
description: Discipline for keeping Kern docs and skills updated. Use when changing code, tokens, components, skills, or repo process — routes to documentations, skills, or the change-routing map for detail.
license: Apache-2.0
---

# Docs & skills upkeep

Docs update in the **same change** as the code. Never defer.

- Where each change type goes → [`references/documentations.md`](references/documentations.md)
- Authoring or maintaining skills → [`references/skills.md`](references/skills.md)
- Which file to edit per change kind → [`references/change-routing.md`](references/change-routing.md)

## Definition of done

- `apps/site` page exists/updated for every user-facing change.
- `apps/mobile` gallery section exists/updated for every real native component.
- `bun run generate:components` re-run and its output committed after any
  component add/remove. `docs/components.md` is **generated** — never
  hand-edited.
- `docs/platform-parity.md` coverage table and gap list updated in the same
  change as the component surface.
- Changeset added for every `packages/` change
  (`docs/conventions/changesets.md`).
- Skill refs updated if agent guidance changed.
- `bun run lint` clean, `Status:` lines correct and actually verified.
- No detail creep into `AGENTS.md` / `README.md`.

## The two rules people break

1. **Editing generated output.** `docs/components.md`,
   `packages/mcp/src/manifest.ts`, `packages/mcp/src/component-sources.ts`,
   `tokens.css`, `tones.css`, and `motion.css` are all generated. Fix the
   generator or run it; a hand-patch is reverted by the next regen and hides
   the bug.
2. **Marking `Status: current` without checking.** `current` is a claim that
   every path, name, and command in the page still exists. Re-read the code
   the page describes before writing it.

## When a page and the code disagree

The code wins on values and names; the doc wins on meaning, ownership, and
decisions. So: if the code is right, fix the doc in the same change. If the
doc describes the intent and the code drifted, that is a bug — file it
against the owning workstream rather than editing around it, and say so in
your report.