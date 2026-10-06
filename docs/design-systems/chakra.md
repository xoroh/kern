# Chakra UI v3 — part-by-part vs kern

**Identity:** Panda-token theming (`createSystem`, tokens/recipes), 120 components, per-token-class theming docs, self-hosted search, AI nav entries, install-chip hero.
**Sources:** OSS-DEEP-WEB-chakra-ui.md; chakra-ui.com/docs.

## Parts: they-have / we-will-have
- 120 components (incl. layout primitives box/flex/grid/stack, clip, code-block, color-picker, combobox, data-list, steps, timeline): Y / **B** for M3-overlapping; layout primitives = G (kern uses start panes + native layouts; decide if Box/Flex/Stack primitives needed).
- Recipes/slot-recipes + semantic tokens (`{value, description}`, `{}` refs): Y / steal as the ergonomics model for kern's semantic layer over M3 system tokens.
- Theming track (19 files: colors→spacing→radii→shadows→typography→recipes…): Y / kern Foundations should match this granularity.
- Charts 16: Y / **R**.
- Snippets (`npx @chakra-ui/cli snippet add`): Y / kern `add` flow equivalent.
- Playground / props index / showcases.json / blog: Y / kern site tracks (props index + showcases-as-JSON = cheapest social proof).

## Patterns to carry
ExampleTabs (preview/code + Stackblitz); react-docgen→JSON→PropTable; build-time MDX rewrites; live token tables from theme source; dependency-free search; single typed nav with AI entries.
