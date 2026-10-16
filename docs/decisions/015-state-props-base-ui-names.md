# 015. State props follow Base UI names

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

Binary and press-state controls need one prop vocabulary across web (Base UI), Kern, and Axis.

## Decision

State props follow Base UI names: binary controls use `checked` / `defaultChecked` / `onCheckedChange`; press-state controls use `pressed` / `defaultPressed` / `onPressedChange`.

## Rationale

One vocabulary across foundations; Axis parity and Kern implementations stay substitutable. Checked against VISION principles 1, 6.

## Status

Accepted. Execution: component contract / parity rows; Axis `docs/COMPONENT_CONTRACT.md` §6 mirrors this.
