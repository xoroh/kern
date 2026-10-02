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
  `kern-tokens`, `kern-icons`, or `kern-native`.

### Amended 2026-10-02 (P2b-5): the composition tier composes via `@xoroh/kern`

`@xoroh/kern/start` is the web **composition tier** — scaffolds, navigation and
layout blocks. It ships from the same package as a subpath, which made it easy
to forget that it is a *consumer* of the widget layer and not a second one.

**Rule: `kern-start` composes the widget layer through `@xoroh/kern` only. It
must not import `@base-ui/react` directly.**

The reason is substitution, not tidiness. The widget layer is where kern's
prop surface, tokens and behaviour live; a direct import from `start` would
create a second path to the primitive, and a future primitive swap (the P2c-2
shape spec) would have to be applied in two places — with nothing to catch the
place someone forgot. Compositing through `@xoroh/kern` keeps exactly one
boundary to move.

This is **enforced**, not documented: `check:layers` asserts zero direct
`@base-ui/react` imports under `packages/kern/src/start/`, so a direct import
fails the gate instead of quietly creating a second boundary. The property
already held when this amendment was written — the rule exists so it cannot
regress, and so the next reader does not have to measure it.
