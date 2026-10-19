# 016. HCT tonal palettes and full color roles

> **Direction rule.** The roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

## Context

The tonal engine (OKLCH steps, 12-role repaint) diverges from the M3 spec, so generated schemes drift from what Material tooling produces.

## Decision

M3 colors use spec-correct HCT tonal palettes (via `@material/material-color-utilities`) with 0–100 ramps and full-scheme role mapping. Executed as an additive spike first, then a review-gated cutover.

## Rationale

Spec-correct color keeps Kern schemes interoperable with the Material ecosystem instead of a lookalike fork.

## Status

Superseded by [021](021-hct-primary-tonal-engine-for-m3.md). Date: 2026-10-16 (superseded 2026-10-17). Roadmap: D-HCT. Cutover completed: HCT is the primary tonal engine for Kern M3.
