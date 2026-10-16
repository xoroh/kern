# 010. kern-m3 rename and no global registration

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

`kern-material-3` is verbose and the web package risks implying M3 is the global default.

## Decision

Rename `kern-material-3` to `kern-m3` (keep compat), and `@xoroh/kern` does not register M3 globally. A `check:layers` rule enforces the split.

## Rationale

Short system identity; no system is privileged as the universal default — each system owns its components. Checked against VISION principle 1.

## Status

Accepted. Execution: roadmap D-STRUCTURE.
