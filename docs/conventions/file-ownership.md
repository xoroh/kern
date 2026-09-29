# File ownership

Status: current

Layers and who may import whom:

```
packages/kern-theme/src/     # tokens.json + themes/*.json + resolver, contrast, tones, functional, generated CSS
packages/kern/src/           # web-only React package
  components/                # web components — imports ../web-theme, ../utils, @xoroh/kern-theme
  utils/                     # pure helpers (cn, cnState) — imports nothing
  web-theme.ts               # web theme runtime — imports @xoroh/kern-theme
  theme.css                  # 1-line wrapper: @import "@xoroh/kern-theme/theme"
  tokens.ts                  # re-export of @xoroh/kern-theme
packages/kern-native/src/    # React Native package — imports @xoroh/kern-theme only
packages/kern-icons/src/     # icon registry + Icon renderers — imports nothing from the above
packages/kern-start/src/     # web composition (blocks, scaffolds) — imports @xoroh/kern only
packages/mcp/src/            # MCP server — generated registry + bundled token data
```

## Rules

1. **kern-theme is the bottom.** It imports nothing from the other packages.
   Web and native resolve roles/tokens through `@xoroh/kern-theme`.
2. **kern (web) never imports kern-native, and vice versa.** They are peers
   around the theme; genuinely shared logic belongs in `kern-theme` (pure) or
   in the consuming app.
3. **Barrel discipline.** Consumers use package exports only (`@xoroh/kern`,
   `@xoroh/kern-native`, `@xoroh/kern-theme`, …). Deep `src/` paths are
   blocked by the `exports` map — restructure inside freely, keep exports
   stable.
4. **Stubs stay unwired.** A component joins `index.ts` only when its
   implementation lands, with docs + changeset in the same change.
5. **Domain needs** ship as `@xoroh/kern-theme` presets plus composed screens
   in the consuming app — use-case packs are not a core concept here.

## Enforcement

Review-enforced until violations earn automation (candidate: dependency-cruiser
with the rules above). Do not add lint machinery for boundaries alone.
