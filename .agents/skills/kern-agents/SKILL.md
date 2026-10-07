---
name: kern-agents
description: Consume Kern UI as an AI agent — machine surfaces (llms.txt page map, per-page .md, mcp/index.json, MCP server) for answering how-to-use-a-component questions. Use instead of scraping site HTML or guessing APIs.
license: MIT
---

# Kern agents — consume Kern without scraping HTML

You are an agent answering a question about Kern usage. Prefer the machine
surfaces below, in order. Never scrape rendered pages; never invent props,
imports, or token names.

## Decision tree

- **"Does Kern have X / where is the Y page?"** → `/llms.txt` (the complete
  page map: every nav leaf, foundations page, and component family).
- **"How do I use component Z (props, tokens, a11y)?"** → its per-page `.md`
  (`/md/{web|mobile}/<slug>.md`, `/md/foundations/<slug>.md`) — grammar order,
  same content the page renders. Every docs page links its own via the
  View .md affordance next to Copy as Markdown.
- **"List/search the whole corpus as data"** → `/mcp/index.json` (one entry
  per docs page: title, one-liner, page route, `.md` URL).
- **"Give me source / tokens / audit this screen"** → the MCP server
  (`packages/mcp`: `list_components`, `get_component`, `get_tokens`,
  `list_themes`, `design_audit`).
- **Design judgement** (colors, type, shape, compliance) → the `kern` skill.
  Docs/process questions → the `docs` skill.

## Rules

1. Props, imports, and install targets come from the page's `.md` (Props
   table + Demo section) or `get_component` — never from memory.
2. Token names come from `get_tokens` or the `.md` Tokens section — never
   hardcoded hex, never invented roles.
3. Web and native are different surfaces: `/md/web/<slug>.md` vs
   `/md/mobile/<slug>.md`, `@xoroh/kern` vs `@xoroh/kern/native`.
4. If a surface and a page disagree, the page wins and the surface is stale —
   say so instead of picking silently.
5. Depth lives in per-page files: `/llms.txt` stays an index, this skill
   stays a router — quote the `.md`, don't paste it here.
