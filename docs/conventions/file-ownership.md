# File ownership

Status: current

Layers and who may import whom:

```
packages/kern-tokens/src/     # tokens.json + themes/*.json + resolver, contrast, tones, functional, feedback, generated CSS
packages/kern/src/           # web-only React package
  components/                # web components — imports ../utils, ../web-theme, @xoroh/kern-tokens, @base-ui/react/*
  utils/                     # pure helpers (cn, cnState) — imports nothing
  web-theme.ts               # web theme runtime (useKernTheme, applyKernTheme) — imports @xoroh/kern-tokens
  theme.css                  # 1-line wrapper: @import "@xoroh/kern-tokens/theme"
  tokens.ts                  # re-export of @xoroh/kern-tokens
packages/kern-native/src/    # React Native package — imports @xoroh/kern-tokens only
packages/kern-icons/src/     # icon registry + Icon renderers (web + native) — imports nothing from the above
packages/kern/src/start/src/     # web composition (blocks, navigation, panes, scaffolds, link) — imports @xoroh/kern only
packages/mcp/src/            # MCP server — generated registry + bundled component sources and token data
scripts/                     # repo gates: check-kern.mjs
```

## Rules

1. **kern-tokens is the bottom.** It imports nothing from the other packages.
   Web and native resolve roles/tokens through `@xoroh/kern-tokens`.
2. **kern (web) never imports kern-native, and vice versa.** They are peers
   around the theme; genuinely shared logic belongs in `kern-tokens` (pure) or
   in the consuming app.
3. **Barrel discipline.** Consumers use package exports only (`@xoroh/kern`,
   `@xoroh/kern-native`, `@xoroh/kern-tokens`, …). Deep `src/` paths are
   blocked by the `exports` map — restructure inside freely, keep exports
   stable.
4. **Stubs stay unwired.** A component joins `index.ts` only when its
   implementation lands, with docs + changeset in the same change. See
   [`stubs.md`](stubs.md).
5. **Domain needs** ship as `@xoroh/kern-tokens` presets plus composed screens
   in the consuming app — use-case packs are not a core concept here.
   Composition belongs in `@xoroh/kern/start` (web), reached only through
   props and slots, never through app dependencies.

## Direction of dependency

```
kern-tokens ──> kern ──> /kern/start
    │           │          │
    └───────────┴──────────┴──> kern-native   (peers, not a chain)
                          │
kern-icons ───────────────┘   (independent; peers react / react-native)

mcp ──> reads everything, imports nothing from it
```

`kern-icons` sits outside the chain on purpose: it renders glyphs and needs
no tokens. `@xoroh/kern-icons` declares `react`, `react-native`, and
`react-native-svg` as optional peers and resolves the right renderer through
the `react-native` export condition.

## Generated files — never hand-edited

| File | Generator |
| --- | --- |
| `packages/kern-tokens/src/tokens.css` | `bun run generate:tokens` |
| `packages/kern-tokens/src/tones.css` | `bun run generate:tones` |
| `packages/kern-tokens/src/motion.css` | `bun run generate:motion` |
| `packages/mcp/src/manifest.ts` | `bun run generate:components` |
| `docs/components.md` | `bun run generate:components` |

The generated header in each file says so. If output looks wrong, fix the
generator — never the artifact.

## Enforcement

Review-enforced until violations earn automation (candidate: dependency-cruiser
with the rules above). The gates that *are* automated:

| Gate | Checks |
| --- | --- |
| `bun run check:kern` | Every role present in every scheme; tokens only, no raw values; shape scale only |
| `bun run check:contrast` | 4.5:1 text / 3:1 UI across presets × modes × contrast levels |
| `bun run check:publish` | `publint` + `attw --pack` on all six publishable packages |
| `bun run icons:check` | Committed icon registry matches the Material Symbols source |

Do not add lint machinery for boundaries alone.