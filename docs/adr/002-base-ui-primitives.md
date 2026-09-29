# 002. Base UI primitives for web components

Status: accepted

## Context

Web components need accessible behavior (focus management, dismissal, typeahead)
without adopting a whole framework's visual style.

## Decision

Compose web widgets on `@base-ui/react` headless primitives. Kern owns all
styling (Tailwind + `--md-sys-*` tokens) and the public prop surface; Base UI
owns behavior. Native counterparts implement the same contract on React Native
primitives.

## Consequences

- One behavior source on web; no re-implementing focus traps and menus.
- `@base-ui/react` is a dependency of `@xoroh/kern` only — never of
  `kern-theme`, `kern-icons`, or `kern-native`.
