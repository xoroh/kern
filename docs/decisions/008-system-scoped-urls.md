# 008. System-scoped URLs

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

One foundation serves many design systems. Flat component URLs do not scale past M3.

## Decision

System-scoped URLs `/components/<system>/<platform>/<name>` with generated 301 redirects from current paths.

## Rationale

Each system owns its components; URLs make the owner explicit and scale to 10+ systems. Checked against VISION principles 1–2.

## Status

Accepted. Execution: roadmap D-STRUCTURE (phased, after small fixes; large migration PRs review-gated).
