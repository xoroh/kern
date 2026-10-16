# 008. System-scoped URLs

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: superseded. Date: 2026-10-16. Superseded by [018](018-component-page-tabs.md) (tabs URL) and [020](020-no-backward-compat.md) (no redirects).

## Context

One foundation serves many design systems. Flat component URLs do not scale past M3.

## Decision (original)

System-scoped URLs `/components/<system>/<platform>/<name>` with generated 301 redirects from current paths.

## Rationale

Each system owns its components; URLs make the owner explicit and scale to 10+ systems. Checked against VISION principles 1–2.

## Status

Superseded. Current rule: one page per component at `/components/<system>/<name>` with Web/Native tabs (018); no redirects — nothing is published, so there is nobody to redirect (020).
