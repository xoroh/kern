# ADR-003: Base UI as web behavior foundation

Status: accepted
Date: 2026-09-28

## Context

Accessible behavior (dialogs, menus, focus, popovers) is expensive to own.
Candidates: Radix, Base UI, hand-rolled.

## Decision

Build web components on `@base-ui/react` (MUI team, MIT): unstyled
headless primitives + Kern theme/styling on top. Kern owns looks and
tokens, never accessibility mechanics.

## Consequences

- Full a11y behavior inherited and maintained upstream.
- Native side gets the same treatment via small headless primitives
  (self-owned simple components; primitives only for overlays).
