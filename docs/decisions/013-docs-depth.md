# 013. Docs depth bar for 0.1.0

> **Direction rule.** The roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

## Context

Full pages for everything do not fit 0.1.0; thin stubs everywhere break the Preview quality bar (correct docs).

## Decision

Full pages for the top 20 components on web AND native; every other component gets a thin but correct page (example, API table, a11y notes). Enforced by a `check:docs` gate.

## Rationale

Depth where users land most, correctness everywhere — no stub may lie about what a component does.

## Status

Accepted. Date: 2026-10-16. Roadmap: D-DOCS-DEPTH (top-20 list + thin-page contract recorded before the content pass).
