# ADR-002: Bun workspaces, no Nx/Turbo

Status: accepted
Date: 2026-09-28

## Context

One app + a few packages. Nx/Turbo add caching/orchestration at the cost of
config, plugins, and (for Nx Cloud) tokens that break forks.

## Decision

Plain Bun workspaces (`apps/*`, `packages/*`), one lockfile. Revisit task
orchestration only when builds get slow or polyglot.

## Consequences

- Zero extra installs; `bun install` is the whole setup.
- No remote caching; acceptable at this size.
