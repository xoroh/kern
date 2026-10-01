# Documentations

Fast map. Detail lives with the docs themselves — this file only says what
lives where.

- Product docs → `apps/site/` — for users, human and AI.
- Reference + contributor docs → `docs/` — architecture, generated
  inventory, parity, releases, conventions, ADRs, plans.
- Agent knowledge → `.agents/skills/` — design (`kern`), upkeep (`docs`).

Which file to edit for a given change:
[`change-routing.md`](change-routing.md).

Rules: same change as the code, never defer. Voice and structure per
`docs/conventions/documentation.md`. One-line pointers only in `AGENTS.md` /
`README.md`.

Generated, never hand-edited: `docs/components.md`,
`packages/mcp/src/manifest.ts`, `packages/mcp/src/component-sources.ts`,
`packages/kern-theme/src/{tokens,tones,motion}.css`.