# 017. Per-system preset plus per-platform widgets

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

Ten design systems need a package shape that scales: shared preset data per system, widgets per platform.

## Decision

Each design system ships a preset package (tokens, themes, M3 data — e.g. `kern-m3`) plus per-platform widget packages (web and native implementations). No universal themed package across systems, no compat shims between shapes (see 020).

## Rationale

Preset data and widget code version independently per system; adding a system adds packages, never edits a shared themed core. Checked against VISION principle 1.

## Status

Accepted. Execution: roadmap D-STRUCTURE (with the `kern-m3` rename in 010).
