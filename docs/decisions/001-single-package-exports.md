# ADR-001: Single package with subpath exports

Status: accepted
Date: 2026-09-28

## Context

Kern serves web (React), native (React Native), themes, and future
frameworks. Options: one package per platform vs one package, many entries.

## Decision

One package, `@xoroh/kern`, with subpath exports (`.`, `./native`,
`./next`, `./theme`, `./tokens`, `./utils`). One version, one changelog.

## Consequences

- Consumers update once; no inter-package version ranges to manage.
- Split into per-platform packages only if release cadences diverge at 1.x.
