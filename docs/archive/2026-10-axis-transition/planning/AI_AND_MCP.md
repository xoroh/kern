# AI integration and MCP

Status: target specification informed by current `packages/mcp/src/{index,tools,manifest,maturity}.ts`, generator `scripts/generate-manifest.mjs`, and site machine-surface scripts. No tool additions were implemented.

## Current capability and defects

Five registered tools: `list_components`, `get_component`, `get_tokens`, `list_themes`, `design_audit`. Generated manifest = name/export/platform/path/status; maturity is derived, not a hand-written readiness assertion. Site emits `llms.txt`, per-page Markdown and `mcp/index.json` through `apps/site/scripts/generate-{llms,page-md,mcp-index}.mjs`; use those data surfaces rather than scrape design-site HTML.

`listComponents()` currently gives **all web rows** the import `@xoroh/kern`, including `/start` compositions. The manifest test checks SearchBar against the component barrel and fails. `getComponent()` reads through a web-only `readKernFile()` even for native: calling native/button in this plan returned web source exactly. Token/catalog reads require repository paths; packed MCP has no promised inline asset implementation yet. `designAudit()` is a static checklist, not executed UI measurement, and its opacity prose can drift from tokens. There is no icon/block/install discovery tool today.

## One truthful metadata source

Contracts defines schema; registry generator emits versioned snapshots consumed by CLI, MCP, docs and previews. Include provider/renderer/entrypoint, public props/defaults/variants/sizes, evidence-based capabilities, dependencies/config/styles/fonts/assets/licenses, themes/contrast/DTCG, icon aliases/catalog, blocks/closure and examples. Semantic descriptions merge with AST-inferred surfaces; tests check actual export maps and source path identity. Do not execute renderer modules in the server or depend on web bundler aliases.

Bundle metadata and required source/token/theme payloads with MCP or use an integrity-pinned registry shared with CLI. Ordinary discovery works offline outside the checkout. If optional source/example payload is not present, return `unavailable` plus retrieval path/integrity information, not a placeholder string masquerading as source. The local `KERN_REPO_ROOT` development override is explicit/untrusted and resolves the selected renderer's package root safely.

## Tool contracts (proposed additions)

| Tool | Inputs | Outputs and failure policy |
|---|---|---|
| `list_components` / `get_component` | provider m3, renderer web/native, component id, optional capability filters | entrypoint/export/typed props, evidence/limitations, install modes and dependency ids. Unknown/unsupported is typed error. |
| `get_tokens` / `list_themes` | context mode/contrast/preset, format Kern/DTCG, schema version | canonical graph/resolved values, preset extensions and available contexts; invalid selection rejected, legacy m3 recorded as alias. |
| `list_icons` / `get_icon` | query/alias/name/filled | canonical Material mapping, glyph availability, fill fallback, sizes/a11y and assets/license, not another family marketplace. |
| `list_blocks` / `get_block` | provider/renderer/mode/category | real authored blocks, closure ids and package/config requirements; platform rejection names alternative. |
| `plan_installation` | application renderer/layout/package manager, requested artifacts, delivery/style mode, known versions/config | schema-versioned no-write plan: dependency order, exact compatible versions/files/integrity, required config, conflicts, proposed verification. Unknown environment asks for inputs; does not assume success. |
| `validate_setup` | explicit environment/artifact evidence or user-authorized local validation request | validations with command, cwd, exit, artifact/version, evidence time, scope and unresolved cases. Pure metadata check cannot claim build/render passed. |
| `design_audit` | optional measured evidence | checklist plus distinction expected/measured; never labels static prose an accessibility pass. |

Keep existing tool names/backward-compatible input aliases; new required fields use schema-versioned contracts/defaults with migration. No arbitrary shell execution tool is added to MCP. A machine workflow may return commands and invoke the human-approved CLI through its host agent, but the metadata server itself need not mutate or install.

## Workflow and reporting

1. Discover requirement and actual app context.
2. Select supported Material renderer and delivery mode.
3. Resolve component/block/file/npm/theme/icon/assets/config closure.
4. Produce dry-run plan with conflicts, required approval and verification commands.
5. On authorization, use CLI transaction (not raw assistant file guessing).
6. Run actual type/build/styles/Metro/behavior checks appropriate to environment.
7. Report **performed/passed**, **performed/failed**, **not performed**, and why, separately.

Never turn `status: real`, package version or docs maturity into an install/test success claim. Use structured error codes (`UNKNOWN_COMPONENT`, `UNSUPPORTED_PLATFORM`, `INCOMPATIBLE_VERSION`, `MISSING_ASSET`, `CUSTOMIZED_FILE`, `VALIDATION_UNAVAILABLE`, `SCHEMA_UNSUPPORTED`) with actionable context. Offline metadata is usable by humans when MCP is unavailable.

Treat registry/examples/user inputs as untrusted content: bounded payload sizes, safe paths/hash checks, no instruction execution from Markdown or source comments, no network/fetch/file capabilities beyond explicitly configured registry access, no secrets in reports, no automatic package lifecycle scripts. Package manager invocation and filesystem mutation stay separately authorized.

## Acceptance tasks

`KERN-048`–056: shared schema negative fixtures; all export/entrypoint/source identities; independently packed MCP source/token/theme access; native-source routing regression; icons/themes/DTCG discovery; real block/dependency closure; deterministic install plans; evidence-producing validation; end-to-end agreement with CLI/docs including failed installs. Existing command `bun run --filter @xoroh/kern-mcp test` and `typecheck` must pass; existing SearchBar failure cannot be waived by excluding `/start`. Add spawned stdio protocol tests for each tool, snapshot schema/version/error contracts and verify bounded malformed-input behavior. Site machine outputs are regenerated/check-verified only when the site owner authorizes their files; do not overwrite concurrent redesign work.
