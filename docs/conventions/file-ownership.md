# File ownership

Status: draft

Layers and who may import whom:

```
packages/kern/src/
  theme/        # tokens + presets — bottom layer, imports nothing in src/
  utils/        # pure helpers (cn) — imports theme types only
  react/        # React components — imports theme, utils
  react-native/ # React Native components — imports theme, utils
  blocks/       # use-case packs — imports core, never each other
```

## Rules

1. **Core never imports blocks.** `react/`, `react-native/`, `theme/`,
   `utils/` must
   not reference `blocks/<anything>`.
2. **Blocks are isolated.** `blocks/mobility` cannot import
   `blocks/<other>` — shared composition moves down into core.
3. **Theme is the bottom.** Nothing in `theme/` imports sibling layers.
4. **Barrel discipline.** Consumers use package exports only
   (`@xoroh/kern`, `@xoroh/kern/native`, …). Deep paths (`…/src/…`) are
   blocked by the `exports` map — restructure freely inside, keep exports
   stable.
5. **Stubs stay unwired.** A component joins `index.ts` only when its
   implementation lands, with docs page + changeset in the same change.

## Enforcement

Review-enforced until violations earn automation (candidate:
dependency-cruiser with the rules above). No eslint in this repo yet —
do not add lint machinery for boundaries alone.
