# AGENTS.md — Kern UI (`xoroh/kern`)

Bun monorepo. `bun install` to start. Never commit secrets.

One topic per line — load the skill, specifics live there:

- Design (UI, tokens, theming, audits) → `.agents/skills/kern/SKILL.md`
- Consume Kern as an agent (llms.txt, per-page .md, MCP) → `.agents/skills/kern-agents/SKILL.md`
- Docs & skills upkeep → `.agents/skills/docs/SKILL.md`
- Releases → `docs/releases.md`
- Token values → `packages/kern-tokens/src/tokens.json` (canonical; DTCG interchange in `packages/kern-tokens/src/dtcg.json`)
- Direction → `docs/VISION.md` (test every decision against it), `docs/decisions/` (ADR per owner decision), `docs/IDEAS.md` (not planned work), roadmap `docs/architecture/kern-axis-migration-and-roadmap.md` (single source for planned work)
