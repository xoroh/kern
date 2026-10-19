# `@xoroh/kern-mcp`

MCP server: the action layer for AI users of Kern. Skills (`.agents/skills/kern/`)
tell an agent what's right; this server lets it *do things* — list
components, fetch source and tokens, audit screens.

## Use (any MCP host: Claude Code, Cursor, VS Code, Zed)

```json
{ "mcpServers": { "kern": { "command": "bunx", "args": ["@xoroh/kern-mcp"] } } }
```

Inside this monorepo, point it at the workspace so component SOURCES resolve
(`get_component` source bytes are the one thing never bundled):

```json
{ "env": { "KERN_REPO_ROOT": "/path/to/kern" } }
```

## Tools

| Tool | What it does |
|---|---|
| `list_components` | Component inventory with platform, entrypoint, subpath import and `real`/`stub` status |
| `get_component` | Source of one component from its own renderer's package (code if real, pointer if stub) |
| `get_tokens` | `base` tokens or a theme preset id from `list_themes` (`material-3`/`sharp`/`brand`/`compact`; no legacy aliases) |
| `get_dtcg` | DTCG 2025.10 interchange document (all foundations + sys roles) |
| `list_themes` | Theme catalog (same file the visual builder will read) |
| `list_icons` / `get_icon` | Semantic icon map + catalog count; unknown names refuse (missing renders null) |
| `list_blocks` / `get_block` | Composed blocks with files and component dependencies |
| `install_plan` | Deterministic no-write install plan, evidence-labelled (`resolved-closure` vs `metadata-only`) |
| `validate_install` | Receipt-vs-destination diff; customized files reported, never fixed |
| `design_audit` | Compliance checklist (mirrors the skill's audit table) |

## Distribution status

The registry (`manifest.ts`), the runtime data bundle (`bundled-data.ts`:
base tokens, theme presets + catalog, DTCG, block metadata) and the docs
corpus index (`docs-index.json`) are all generated at build time and packed,
so inventory, plans, tokens, blocks and validation work anywhere with no
checkout to read. Component SOURCES still resolve through a checkout
(`KERN_REPO_ROOT` overrides) and say so explicitly when absent — verbatim
source is never embedded, and every tool names what it could not reach
instead of inventing it. `install_plan` runs the real CLI planner when
`@xoroh/kern-cli` is installed beside the server (`resolved-closure`) and
labels metadata-only output when it is not.

## License

MIT — see root `LICENSE`.
