import type { ComponentDoc } from "../types";

export const carousel: ComponentDoc = {
  slug: "carousel",
  name: "Carousel",
  oneLiner:
    "The carousel shows a set of items one at a time — one active slide, one tab stop, an index that never disagrees with itself.",
  features:
    "Reach for a carousel when the items are peers and the screen can only show one at a time: a gallery, a rotating set of cards, a pick from a small collection. The carousel owns WHICH item is active — controlled or uncontrolled, clamped so it can never blank itself — and one roving model from `@xoroh/kern-primitives` drives both the track and the dot row, so the two cannot show different slides. `loop` is opt-in because Material 3's default is to clamp at the ends, and swiping never re-indexes on its own: the active index only changes by an explicit press, so anyone using assistive tech is never moved without acting.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Carousel",
    variants: ["layout: single · peek"],
    // M3's "carousel" row rests at level 0 — `shadow: none` is the conformant
    // state and the carousel carries no elevation token. Asserted on absence.
    elevation: 0,
  },
  parts: ["Carousel"],
  customization: {
    supported: [
      "`items` is data: each carries a stable `value` (the key), optional `content`, an `accessibilityLabel` and its own `disabled` flag.",
      "`index` / `defaultIndex` / `onIndexChange` are the controlled-uncontrolled pair for the active item.",
      "`layout` is `single` (one full slide, paged) or `peek` (neighbours visible); `carouselStyles` is exported for the treatments without the component.",
    ],
    notSupported: [
      "There are no Previous/Next buttons — navigation is the dot row and pressing an item. The dots ARE the controls contract on native.",
      "Swiping scrolls the track but does not change the active index. A carousel that silently re-indexes on a flick is unpredictable for anyone using assistive tech; the host decides via `onIndexChange`.",
      "There is no autoplay and no timing contract. Rotation is a host behaviour, and it should stop for anyone who cannot chase a moving target.",
    ],
  },
  api: [
    {
      name: "items",
      type: "readonly CarouselItem[]",
      required: true,
      note: "The data. Each item is `{ value, content?, accessibilityLabel?, disabled? }` — `value` is the stable key, the label is what gets announced.",
    },
    {
      name: "index",
      type: "number",
      note: "Controlled active index. Out-of-range values are clamped — a carousel can never blank itself.",
    },
    {
      name: "defaultIndex",
      type: "number",
      default: "0",
      note: "Uncontrolled starting index. Omit `index` to let the carousel own the state.",
    },
    {
      name: "onIndexChange",
      type: "(index: number) => void",
      note: "Fires with the next active index — the only way the index moves, together with pressing a slide or a dot.",
    },
    {
      name: "accessibilityLabel",
      type: "string",
      default: '"Carousel"',
      note: "The region's name. The region announces as a group with this label — see the ARIA contract for the platform difference.",
    },
    {
      name: "loop",
      type: "boolean",
      default: "false",
      note: "Wrap from last to first. Off by default because M3 clamps at the ends; on, the roving model wraps.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Stops navigation and takes every slide and dot out of the tab order.",
    },
    {
      name: "layout",
      type: 'CarouselLayout ("single" | "peek")',
      default: '"single"',
      note: "`single` fills the viewport and pages; `peek` shows the neighbours with a gap between slides.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the region. `carouselStyles` is exported for the track, item and control treatments.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-carousel"',
      note: "Test hook for the region; the track, dots and each item carry their own derived IDs.",
    },
  ],
  aria: [
    "The track is ONE tab stop — the roving model, shared with the web peer — and the active item is the stop inside it; each slide reports `selected` only when it is the active one.",
    'Platform difference, recorded rather than papered over: web announces the region as a carousel via `aria-roledescription`; React Native has no roledescription concept, so the region is a labelled `group` and the announcement is "group, <label>".',
    'Each dot is a `button` labelled "<item label>, N of M" — position is spoken, so a dot row is navigable without seeing it.',
    "Each slide reports `image` role with its label; an item with no `accessibilityLabel` falls back to `value`, which is why a real label is required in practice.",
  ],
};
