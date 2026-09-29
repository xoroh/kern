# Kern UI — by Xoroh

Status: current

Open design system based on Material Design 3: tokens, web and native
components, documentation, and tooling. MIT licensed and usable by
people and AI agents.

- Documentation: https://kern.xoroh.org
- Hub: https://xoroh.org

## Structure

- `apps/site/` — kern.xoroh.org (TanStack Start: component docs and live examples)
- `apps/mobile/` — "Kern" (empty Expo host with native theme and font wiring)
- `packages/kern-theme/` — `@xoroh/kern-theme`: tokens + themes + tones + feedback spec (platform-free)
- `packages/kern/` — `@xoroh/kern`: web components (React, on Base UI)
- `packages/kern-native/` — `@xoroh/kern-native`: React Native components (StyleSheet + tokens)
- `packages/kern-icons/` — `@xoroh/kern-icons`: multi-set icon registry + `Icon` (web + native)
- `packages/kern-start/` — `@xoroh/kern-start`: web composition (blocks, navigation, panes, scaffolds)
- `packages/cli/` — private, reserved for a future installer CLI
- `packages/mcp/` — MCP server (`@xoroh/kern-mcp`): list/get components, tokens, audits
- `.agents/skills/` — agent skills (kern design + docs upkeep)

## License

MIT License — see `LICENSE`.
