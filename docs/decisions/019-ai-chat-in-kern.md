# 019. AI chat styled parts live in Kern, voice deferred

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

AI chat UI needs a home on the Kern side: styled chat parts and blocks versus behavior models.

## Decision

AI chat styled parts and blocks live in Kern design systems; unstyled behavior models live in Axis. Voice UI is deferred — no voice work until text chat ships.

## Rationale

Behavior in Axis, styling in Kern — the same split as every other family; deferring voice keeps the first slice shippable. Checked against VISION principles 1, 5.

## Status

Accepted. No components built yet; placement only. Models side: Axis `docs/decisions/010-ai-chat-models.md`.
