# 009. One generated registry plus --system

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

Site, CLI, and MCP each need the component list. Hand-kept copies drift.

## Decision

One generated `ComponentRecord` registry is the single source feeding site, CLI, and MCP. CLI and MCP gain `--system` to select a design system.

## Rationale

Single source of truth; system selection is explicit at every surface. Checked against VISION principles 2–4.

## Status

Accepted. Execution: roadmap D-STRUCTURE.
