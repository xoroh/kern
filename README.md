# Kern UI — by Xoroh

Status: current

An open Material Design 3 design system: tokens, web and native components,
documentation, and tooling. MIT licensed and usable by people and AI agents.

- Documentation: https://kern.xoroh.org
- Hub: https://xoroh.org

## Install

```bash
bun add @xoroh/kern @xoroh/kern-tokens
```

Web components need `@base-ui/react`, `react`, `react-dom`, and Tailwind CSS
v4 with utilities mapped to the MD3 roles:

```tsx
import "@xoroh/kern/theme";

import { Button } from "@xoroh/kern";

export function Save() {
  return <Button variant="primary">Save</Button>;
}
```

React Native:

```tsx
import { Button, KernThemeProvider } from "@xoroh/kern-native";

export function Save({ onPress }: { onPress: () => void }) {
  return (
    <KernThemeProvider>
      <Button variant="primary" onPress={onPress}>
        Save
      </Button>
    </KernThemeProvider>
  );
}
```

Per-package detail lives in each package's README.

## Packages

| Package | Directory | What it is |
| --- | --- | --- |
| `@xoroh/kern-tokens` | `packages/kern-tokens` | Tokens (`tokens.json`), theme presets, contrast overlays, tones, feedback spec, variant registry. Platform-free: no React, no DOM |
| `@xoroh/kern` | `packages/kern` | Web components (React, on Base UI) + the web theme runtime |
| `@xoroh/kern/start` | `packages/kern/src/start` | Web composition: blocks, top app bar, navigation, panes, scaffolds |
| `@xoroh/kern-native` | `packages/kern-native` | React Native components (StyleSheet + tokens) + the native scheme hook |
| `@xoroh/kern-icons` | `packages/kern-icons` | Material Symbols registry and the `Icon` renderer (web + native) |
| `@xoroh/kern-mcp` | `packages/mcp` | MCP server: list components, fetch source and tokens, audit screens |
| `@xoroh/cli` | `packages/cli` | Private placeholder for a future `kern add` installer. Not implemented, never published |

Six packages publish; each versions independently.

## Apps

- `apps/site/` — kern.xoroh.org (TanStack Start): the documentation site. It
  imports and dogfoods `@xoroh/kern`, `@xoroh/kern-tokens`,
  `@xoroh/kern-icons`, and `@xoroh/kern/start`.
- `apps/mobile/` — "Kern": an Expo host wiring the native theme and fonts.

## Documentation

| Where | What |
| --- | --- |
| https://kern.xoroh.org | Product docs for users: getting started, components, theme, guides |
| [`docs/`](docs/README.md) | Contributor docs: architecture, parity, releases, conventions |
| [`.agents/skills/`](.agents/skills/) | Agent knowledge: `kern` (design authority), `docs` (upkeep discipline) |

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) first — it lists the per-PR
requirements (changeset, docs in the same change, lint, tests, conventional
commits). [`docs/architecture.md`](docs/architecture.md) explains how the
packages fit together, and [`AGENTS.md`](AGENTS.md) routes an agent to the
right skill.

## Development

```bash
bun install
bun run build          # generators + all package builds
bun run lint
bun run typecheck
bun run test:all
bun run check:m3       # M3 contract: roles, tokens, shape scale
bun run check:contrast # WCAG across presets x modes x contrast levels
bun run check:publish  # publint + are-the-types-wrong, all 6 packages
```

## License

MIT License — see [`LICENSE`](LICENSE).