# Kern vision

> **Direction rule.** The roadmap is the single source for planned work; VISION is the test every decision is checked against; ideas only move to the roadmap through an ADR. Roadmap: [`docs/architecture/kern-axis-migration-and-roadmap.md`](architecture/kern-axis-migration-and-roadmap.md).

Status: current. Owner vision, 2026-10-16. This file states direction; it does not plan work. For the plan, read the roadmap. For past decisions, read [`docs/decisions/`](decisions/README.md) and [`docs/adr/`](adr/001-esm-only.md) (see [`docs/README.md`](README.md)).

## North star

Kern is the open-source multi-design-system platform for web and React Native.

**One foundation. Every design system.**

## Who it is for

- Product teams shipping web and React Native apps from one foundation.
- Design-system authors shipping a second, third, tenth system on the same foundation.
- Human developers and AI agents alike — every surface a person reads, an agent can read too.

## Principles

1. **Each design system owns its own components.** Never one universal themed component. M3 is first; the structure must scale to 10+ systems.
2. **Two doors in.** Install from npm, or vendor source shadcn-style with the Kern CLI. Both stay supported.
3. **AI-first is mandatory.** Component metadata, MCP server, CLI, and `llms.txt` are product surfaces, not extras.
4. **Tokens follow DTCG.** The DTCG document is the interchange contract; authoring and validation live in `@xoroh/kern-tokens`.
5. **Kern consumes Axis for native behavior.** Axis owns unstyled native behavior primitives; Kern owns styled design-system components on top. Kern never re-implements what Axis owns, and Axis never depends on Kern.
6. **Prefer OSS, no paid extras, no monoliths.** Small composable packages over frameworks; open dependencies over commercial ones.

## Non-goals

- Not a single universal component set themed per brand. Per-system implementations are the product.
- Not a native behavior-primitive library — that is Axis.
- Not a proprietary platform, component marketplace, or paid tier.
- Not a monolith: packages version independently; apps stay thin hosts.

## Quality bar

- **0.1.0 Preview is near-Alpha quality:** complete, correct, polished, with correct docs. Not a sketch, not a stub set.
- **Alpha follows after debugging and improvement** of that Preview — the Preview is the feature-complete baseline, Alpha is the hardened one.

## Kern and Axis

Kern is the styled design-system platform (tokens, M3 web + native implementations, icons, CLI, MCP, site, blocks). Axis (`@xoroh/axis`, sibling repo `xoroh/axis`) is the unstyled, token-free React Native primitive layer — the native counterpart of Base UI. Dependency direction is one-way: Kern may consume Axis through its public package interface; Axis never depends on Kern. Details live in the roadmap (§C) and [`docs/decisions/007-axis-native-foundation.md`](decisions/007-axis-native-foundation.md).

## Existing direction docs (link, don't duplicate)

- Roadmap (single source for planned work): [`docs/architecture/kern-axis-migration-and-roadmap.md`](architecture/kern-axis-migration-and-roadmap.md).
- Decisions: [`docs/decisions/`](decisions/README.md) (owner decisions 2026-10-16) and [`docs/adr/`](adr/001-esm-only.md) (standing architecture ADRs 001–006).
- Architecture: [`docs/architecture.md`](architecture.md). Design canon: [`.agents/skills/kern/SKILL.md`](../.agents/skills/kern/SKILL.md).
