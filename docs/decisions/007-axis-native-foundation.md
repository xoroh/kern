# 007. Axis is the native foundation

> Rule: the roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

Status: accepted. Date: 2026-10-16.

## Context

Kern shipped its own private behavior kernel (`libs/kern-primitives`) shared by web and native. The target architecture moves native behavior into Axis (`@xoroh/axis`), the independent React Native counterpart of Base UI.

## Decision

Axis is the native foundation. Kern consumes `@xoroh/axis` through its public entry only. `libs/kern-primitives` is frozen and dropped once Axis is release-ready (cutover gated on Axis release-ready, not on publication; pre-publish via vendored tarball, semver at first authorized publish).

## Rationale

One native behavior owner; no duplicate kernels; Kern keeps design-system implementations while Axis owns neutral native behavior. Checked against VISION principles 1, 6.

## Status

Accepted. Execution: roadmap §§C–D, Phase 4 and D-FOUNDATION-CHOICE / D-DEP.
