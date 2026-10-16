# 014. M3 button variant names

> **Direction rule.** The roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

## Context

Button variant names drifted from the M3 spec, so spec readers and code readers use different words for the same thing.

## Decision

Canonical variants: `filled` / `tonal` / `outlined` / `text` / `elevated`. Implemented as a review-gated migration (codemod across packages, site, tests; hard cut, no deprecation — see 020).

## Rationale

M3-canonical names keep docs, spec references, and props aligned across web and native.

## Status

Accepted. Date: 2026-10-16. Roadmap: D-BUTTON-NAMES.
