# 018. One docs page per component with Web/Native tabs

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

Splitting every component into separate web and native pages doubles the page count and hides parity.

## Decision

Docs keep one page per component at `/components/<system>/<name>` with Web/Native tabs. No platform URL segment, no redirects — nothing is published (see 020). Supersedes 008.

## Rationale

One page shows both implementations and their parity side by side; tabs scale to 10+ systems without URL sprawl. Checked against the docs-depth bar (013).

## Status

Accepted. Supersedes: [008](008-system-scoped-urls.md). Execution: roadmap D-STRUCTURE.
