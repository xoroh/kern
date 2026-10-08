# Change routing

Which file to edit for which change. One table, no judgement calls.

## Product docs → `apps/site/` (kern.xoroh.org)

For users, human and AI.

| Change | Update |
| --- | --- |
| New or removed web component | `/components/web` |
| New or removed native component | `/components/mobile` |
| A component's props or variants | its page on `/components/web` or `/components/mobile` |
| Install or first-run flow | `/getting-started` |
| Theme, presets, contrast, token reference | `/theme` |
| Task walkthrough (swap the theme, use in RN) | `/docs/guides` |
| Anything a user would search for | `/docs` index |

## Reference and contributor docs → `docs/`

| Change | Update |
| --- | --- |
| Any component added, removed, or re-statused | `bun run generate:components` (never hand-edit `docs/components.md`), then `docs/platform-parity.md` coverage + gaps |
| A `variant` meaning added or changed | `docs/platform-parity.md` variant-law table |
| A new package, or a dependency direction change | `docs/architecture.md` + an ADR in `docs/adr/` |
| A token pipeline change | `docs/architecture.md` token pipeline + `.agents/skills/kern/references/kern-tokens.md` |
| Import, peer range, or publish config | the package README + `docs/releases.md` if publishable |
| A new convention | `docs/conventions/` + the index table in `docs/conventions/documentation.md` |
| Release flow or bump policy | `docs/releases.md` |
| Roadmap item state | `docs/plan/README.md` tracker row, and the plan file's log |
| An internal `@xoroh/*` dependency (peer range, `workspace:` placement) | `docs/releases.md` §Preflight — peers ship, `workspace:*` stays in `devDependencies` only. Gate: `bun run preflight:publish` |

## Agent knowledge → `.agents/skills/`

| Change | Update |
| --- | --- |
| A design rule, anti-pattern, or audit criterion | `.agents/skills/kern/SKILL.md` compliance table + the matching `.agents/skills/kern/references/*.md` |
| A component authoring pattern | `.agents/skills/kern/references/code-conventions.md` |
| A token value or role mapping | `.agents/skills/kern/references/kern-tokens.md` |
| A theme/preset authoring rule | `.agents/skills/kern/references/theme-variants.md` + the router section in `.agents/skills/kern-agents/SKILL.md` |
| An MCP server tool (add/change/fix) | `packages/mcp/src/tools.ts` + `packages/mcp/README.md` tool table + the router in `.agents/skills/kern-agents/SKILL.md` + a changeset |
| The per-page .md, MCP index, or llms.txt emission or gate | `apps/site/scripts/generate-*` + `check-*` + `scripts/lib/*` (one function, two callers — emitter and gate stay in step) |
| A naming or parity rule | `.agents/skills/kern/references/code-conventions.md` + `docs/conventions/parity.md` |
| The doc-upkeep process itself | this skill |

## Root files

| Change | Update |
| --- | --- |
| Package list, install command, apps | `README.md` |
| Per-PR requirements, checklists, gates | `CONTRIBUTING.md` |
| Decision authority, system law, ADR policy | `GOVERNANCE.md` |
| Where to ask, support window | `SUPPORT.md` |
| Reporting channel, risk surface | `SECURITY.md` |
| Skill routing | `AGENTS.md` (one line per topic — no detail) |

## Nothing to update

A change that touches only tests, or only CI config, or only a private
refactor with no observable change, needs no doc edit. It may still need a
changeset — check `docs/conventions/changesets.md`.

## Verify before you claim done

```bash
bun run generate:components   # then confirm docs/components.md is clean
bun x changeset status         # parses; exit 0
bun run lint
```

And check the links you added resolve — a relative link to a file you
renamed is the most common way a docs PR breaks the build of the site.