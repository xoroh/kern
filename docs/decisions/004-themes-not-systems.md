# ADR-004: Themes, not design systems

Status: accepted
Date: 2026-09-28

## Context

Customers want different looks (M3 default, sharp/premium, brand skins).
Options: multiple full systems vs one implementation with swappable themes.

## Decision

One M3-based implementation; designs ship as token presets
(`m3`, `sharp`, `brand` template, future platform-adaptive). A second
system only if a customer explicitly funds it.

## Consequences

- One component to maintain per control; N looks via tokens.
- The Studio story becomes theme pick + brand customization, not
  system selection.
