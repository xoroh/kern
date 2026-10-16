# 012. Kern CLI is publishable in 0.1.0

> **Direction rule.** The roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR.

## Context

Source vendoring is a product door, so the CLI that owns it must ship with the release — not stay an unpublished helper.

## Decision

`@xoroh/kern-cli` ships as a publishable package in 0.1.0 (eight public packages total). No publish happens until the release hold lifts.

## Rationale

`kern add` / `init` / `list` / `diff` / `upgrade` are how users take ownership of code; an unpublished installer cannot be the product door.

## Status

Accepted. Date: 2026-10-16. Roadmap: D-CLI-PUBLISH (supersedes the earlier `private:true` direction).
