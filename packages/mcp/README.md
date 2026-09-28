# `@xoroh/kern-mcp`

MCP server: the action layer for AI users of Kern. Skills (`skills/kern/`)
tell an agent what's right; this server lets it *do things* — list
components, fetch source and tokens, audit screens.

## Use (any MCP host: Claude Code, Cursor, VS Code, Zed)

```json
{ "mcpServers": { "kern": { "command": "bunx", "args": ["@xoroh/kern-mcp"] } } }
```

Inside this monorepo, point it at the workspace (until the registry is
bundled at publish — see below):

```json
{ "env": { "KERN_REPO_ROOT": "/path/to/kern" } }
```

## Tools

| Tool | What it does |
|---|---|
| `list_components` | Component inventory with `real`/`stub`/`tangled`/`review` status |
| `get_component` | Source of one component (code if real, pointer if stub) |
| `get_tokens` | `base` tokens or `m3`/`sharp`/`brand` presets |
| `design_audit` | Compliance checklist (mirrors the skill's audit table) |

## Next step before 0.1.0

Bundle the registry at build time (inline `manifest.ts` already is; inline
component sources + tokens too) so the published server works without
`KERN_REPO_ROOT`. Then `bunx @xoroh/kern-mcp` works everywhere.

## License

Apache License 2.0 — see root `LICENSE`.
