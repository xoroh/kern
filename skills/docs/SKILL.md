---
name: docs
description: Discipline for keeping Kern docs updated. Use when changing code, tokens, skills, or repo process — defines what to update, where, and the definition of done.
---

# Docs discipline

Docs update in the **same change** as the code. Never defer.

## Where things go

```
Code/behavior/token change  → apps/docs/ component page (+ llms content later)
                              + changeset if packages/ changed
Design-canonical knowledge  → skills/kern/ (+ references/)
Agent process knowledge     → skills/docs/ (this skill)
Repo process/decisions      → docs/ (+ ADRs for why)
One-line pointers only      → AGENTS.md / README.md (never detail)
```

## Skill maintenance (including this file)

- `SKILL.md` stays a router (<150 lines): frontmatter with trigger
  phrases, decision tree, pointers. Detail lives in `references/`.
- Frontmatter `description` must say **when to use** the skill — that's
  how agents discover it.
- After editing any skill, re-verify: grep for stale paths and check
  relative links resolve.
- Porting from private sources: sweep for leaks first
  (`xoroh-platform`, `libs/kern`, internal product names, mailboxes,
  backend domains). If in doubt, generalize or drop it.

## Definition of done

- `apps/docs` page exists/updated for every user-facing change.
- Changeset added for every `packages/` change.
- Skill refs updated if agent guidance changed.
- No detail creep into `AGENTS.md` / `README.md`.
