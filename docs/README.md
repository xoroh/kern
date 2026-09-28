# Kern docs map

Three doc kinds. Don't mix them.

- **Product docs** → `apps/site/` (kern.xoroh.org): component pages, guides,
  `llms.txt`. Written for users (human + AI).
- **Contributor docs** → `docs/` (this folder): process and decisions for
  people working in this repo. See `releases.md`.
- **Agent knowledge** → `.agents/skills/`: `kern` (design authority), `docs`
  (how to keep all of the above updated).

Rule: update docs in the same change as the code — never defer it.
The `docs` skill (`.agents/skills/docs/SKILL.md`) defines exactly where each
change type goes.
