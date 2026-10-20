import type { ComponentDoc } from "../types";

export const carousel: ComponentDoc = {
  slug: "carousel",
  name: "Carousel",
  oneLiner:
    "The carousel shows a set of items one at a time — one active slide, one tab stop, an index that never disagrees with itself.",
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
  // The contract, read off the component: the track is one roving stop, the
  // dots are buttons, and a swipe scrolls the track WITHOUT moving the index.
  keyboard: [
    {
      key: "Enter / Space via external keyboard",
      action:
        "Activates the focused dot, which makes that slide the active one. The slides are announced as images rather than as buttons, so the dot row is the control that takes a key.",
    },
    {
      key: "Swipe + double-tap (TalkBack / VoiceOver)",
      action:
        "Moves through the slides; the track is ONE tab stop and the active slide is the stop inside it. Double-tap on a slide or a dot makes it the active one — a swipe alone scrolls the track and does not move the index, because the host decides that.",
    },
  ],
  customization: {
    supported: [
      "`items` is data: each carries a stable `value` (the key), optional `content`, an `accessibilityLabel` and its own `disabled` flag.",
      "`value` / `defaultValue` / `onValueChange` are the controlled-uncontrolled pair for the active item.",
      "`layout` is `single` (one full slide, paged) or `peek` (neighbours visible); `carouselStyles` is exported for the treatments without the component.",
    ],
    notSupported: [
      "There are no Previous/Next buttons — navigation is the dot row and pressing an item. The dots ARE the controls contract on native.",
      "Swiping scrolls the track but does not change the active index. A carousel that silently re-indexes on a flick is unpredictable for anyone using assistive tech; the host decides via `onValueChange`.",
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
      name: "value",
      type: "number",
      note: "Controlled active index. Out-of-range values are clamped — a carousel can never blank itself.",
    },
    {
      name: "defaultValue",
      type: "number",
      default: "0",
      note: "Uncontrolled starting index. Omit `value` to let the carousel own the state.",
    },
    {
      name: "onValueChange",
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
