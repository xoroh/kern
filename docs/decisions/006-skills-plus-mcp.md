# ADR-006: Skills plus MCP for AI access

Status: accepted
Date: 2026-09-28

## Context

AI is a first-class consumer. Options: static skills, live MCP server,
`llms.txt`, or all three.

## Decision

All three, layered: Agent Skills (`.agents/skills/`, per agentskills.io)
for knowledge, `@xoroh/kern-mcp` (stdio, `bunx`) for actions
(list/get/audit), `llms.txt` on the docs site later for zero-integration
reading.

## Consequences

- Skills work in 50+ clients with zero infra; MCP needs one small
  maintained package; `llms.txt` is nearly free with the docs app.
