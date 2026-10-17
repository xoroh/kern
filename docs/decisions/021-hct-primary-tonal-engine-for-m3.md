# 021. HCT / material-color-utilities as primary tonal engine for Kern M3

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-17. Roadmap: D-HCT. Supersedes [016](016-hct-tonal-palettes.md) (review-gated spike completed; cutover accepted).

## Context

ADR 016 introduced an additive HCT spike (`@material/material-color-utilities`, 0–100 tonal ramps, full-scheme role mapping via `SchemeTonalSpot`) while leaving the legacy OKLCH path (50–950 steps, 12-role accent repaint) in `themeFromSeed` until review. That divergence meant M3 dynamic schemes drifted from what official Material Design tooling produces, repainted only accent roles while leaving surface, error, outline, and fixed roles static, and kept two conflicting tonal models in the codebase.

Under ADR 020 (no backward compatibility before 0.1.0 Preview), maintaining dual paths, transitional shims, or defensive fallbacks is prohibited: there is one clean current API per thing.

## Decision

1. **HCT (`@material/material-color-utilities`) is the primary tonal engine for Kern M3.** M3 dynamic scheme generation (`themeFromSeed`) produces the full 45 M3 spec roles (primary, secondary, tertiary, error, surface, surface containers, outline, inverse, fixed) via `SchemeTonalSpot` with 0–100 tonal ramps.
2. **Remove the OKLCH path for M3.** No compat barrels, no aliases, no shims, and no fallbacks. `themeFromSeed` does not fall back to OKLCH.
3. **Tonal engine choice is per system.** Kern is a multi-system design library. Kern M3 adopts HCT for spec fidelity with Material Design 3. Other design systems choose their own canonical tonal engine (e.g. OKLCH for systems requiring perceptual uniform curves). The engine choice belongs to the system preset, not global tokens.

## Rationale

- **Spec correctness:** Produces identical schemes to official Material Design 3 tooling (m3.material.io, Theme Builder) rather than an approximate lookalike fork.
- **Full-scheme dynamic color:** In M3, dynamic color moves surface, container, outline, and error roles alongside accents. A 12-role repaint was a divergence; full-scheme generation is the spec contract.
- **Clean architecture (ADR 020):** Hard cutover removes legacy OKLCH calculation from M3 without carrying dead code or transitional shims.

## Status

Accepted. Date: 2026-10-17. Supersedes ADR 016. Applied to `@xoroh/kern-material-3` (`themeFromSeed`), `@xoroh/kern-tokens` (`hct.ts`), and site documentation.
