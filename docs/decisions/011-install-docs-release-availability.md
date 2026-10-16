# 011. Install docs honesty until publish

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

Packages are not published yet (release HOLD). Install docs showing bare npm commands imply availability.

## Decision

Install docs keep npm commands marked “available at release”; source install (CLI vendoring) is primary until publish.

## Rationale

Honest docs; no phantom installs. Vendoring is the real path pre-publish. Checked against VISION principles 3–4 and the quality bar (correct docs).

## Status

Accepted. Execution: roadmap release hold / D-RELEASE.
