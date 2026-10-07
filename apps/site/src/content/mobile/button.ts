import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "The button is the standard action control: five Material 3 treatments, four sizes, one press.",
  features:
    "Reach for a button when tapping causes something: submit, save, open, confirm. The variant axis mirrors the web union exactly — `primary` is Material 3's filled button, `tonal` and `outlined` the quieter pair, `ghost` the text button, and `elevated` the one treatment that raises — because the variant law is one meaning per name across both renderers, not one name count. `color=\"danger\"` re-paints any of the five in the error roles instead of adding a sixth vocabulary word. `size` walks the compact `xs`, the default height, the small `sm`, the large `xl` and the square `icon` box. `loading` swaps in the progress indicator and blocks the press until it clears, and `icon` renders beside the label with the same icon `gap` the web pair uses.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Button",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "color: primary · danger",
      "size: xs · default · sm · xl · icon",
      "shape: pill · rounded · square",
    ],
    // M3 tabulates two rows: `button (elevated)` at level 1 and `buttons
    // (filled, tonal, outlined)` at level 0. The family claims 0 — the base
    // treatment — same as the web page; `elevated`'s row is in Customization.
    elevation: 0,
  },
  parts: ["Button"],
  customization: {
    supported: [
      "`variant` is the treatment axis and `size` the box axis; `color` and `shape` cross both, and the four compose freely.",
      "`children` is the label — strings and numbers render as label text, any other node renders as-is.",
      "`icon` renders beside the label with the M3 icon `gap`; `iconPosition` chooses the side. Placement is order, not margin, so the pair flips automatically under RTL with no insets to mirror.",
      "`loading` shows the embedded indicator (`loadingValue` for determinate 0–1, `loaderStyle` for the style), reports `busy` and blocks presses until it clears.",
      "`block` stretches the button full width.",
      "`labelStyle` restyles the label; `style` is a pressable style function or value. `buttonStyles` is exported for the treatment without the component — it takes the same `color`/`shape`/`block` options object positionally-optional callers skip.",
      "Note the two elevation rows Material 3 tabulates: `button (elevated)` rests at level 1, `buttons (filled, tonal, outlined)` at level 0. The page claims the base, 0; the `elevated` variant's row is this note — and on native the raised treatment separates by its surface fill rather than a shadow, so the level-1 row is the spec's, not the paint's.",
    ],
    notSupported: [
      "There is no `tone` override outside `color`. The treatment names the emphasis; a button painted outside it is a different component's job.",
      "There is no icon-only accessibility handling beyond `labelStyle`: a glyph-only button must carry its own accessibility label from the pressable props.",
    ],
  },
  api: [
    {
      name: "variant",
      type: 'NativeButtonVariantInput ("elevated" | "primary" | "tonal" | "outlined" | "ghost", plus "filled" | "text" aliases)',
      default: '"primary"',
      note: "The treatment. One meaning per name with the web union — `primary` is M3's filled button. There is no sixth: an error action is `color=\"danger\"` on any of the five.",
    },
    {
      name: "color",
      type: 'NativeButtonColor ("primary" | "danger")',
      default: '"primary"',
      note: "The error treatment, not a variant. `danger` re-paints the variant's structure in the error roles.",
    },
    {
      name: "size",
      type: 'NativeButtonSize ("xs" | "default" | "sm" | "xl" | "icon")',
      default: '"default"',
      note: "The box axis. `icon` makes the button square; smaller sizes widen the hit slop so the touch target holds (`xs` 10, `sm` 8, default 4, `xl` 0 past its 48 height).",
    },
    {
      name: "shape",
      type: 'NativeButtonShape ("pill" | "rounded" | "square")',
      default: '"pill"',
      note: "The corner role: the M3 full pill, the stepped-down large corner, or none. The theme still owns the radii.",
    },
    {
      name: "block",
      type: "boolean",
      default: "false",
      note: "Full-width button via `alignSelf: stretch`.",
    },
    {
      name: "loading",
      type: "boolean",
      default: "false",
      note: "Shows the embedded progress indicator, reports `busy` and blocks presses like `disabled` does.",
    },
    {
      name: "loadingValue",
      type: "number",
      note: "0–1 determinate progress while loading. Omit for the loop.",
    },
    {
      name: "loaderStyle",
      type: "LoadingIndicatorStyle",
      note: "Style of the embedded indicator. Defaults to the M3 ring.",
    },
    {
      name: "icon",
      type: "ReactNode",
      note: "Renders beside the label with the icon `gap`. A glyph-only button is `size=\"icon\"` plus an accessibility label from the pressable props.",
    },
    {
      name: "iconPosition",
      type: '"start" | "end"',
      default: '"start"',
      note: "Which side of the label the icon renders on. Order, not margin, so RTL flips the pair automatically.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The label. Strings and numbers render as label text; any other node renders as-is.",
    },
    {
      name: "onPress",
      type: 'PressableProps["onPress"]',
      note: "The action. Fires on the pressable, so the usual pressable event contract applies.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      note: "Dims the button to half opacity, stops presses and reports `disabled` state.",
    },
    {
      name: "labelStyle",
      type: "StyleProp<TextStyle>",
      note: "Restyles the label text only when `children` is text.",
    },
    {
      name: "style",
      type: 'PressableProps["style"]',
      note: "Pressable style — function or value, merged after `buttonStyles`. `buttonStyles` is exported for the treatment alone.",
    },
  ],
  aria: [
    "Every button is a `button` role pressable reporting `disabled` in its accessibility state — the state is announced, not just painted.",
    "A loading button reports `busy` alongside `disabled`, so assistive tech announces the wait, not just the block.",
    "A glyph-only button is an unnamed control unless the pressable props give it an accessibility label; the text treatment is the one that names itself.",
    "The Android ripple follows the treatment's ink, and press feedback dims the surface — the control responds before the action completes.",
  ],
};
