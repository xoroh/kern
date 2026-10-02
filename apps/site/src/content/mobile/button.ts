import type { ComponentDoc } from "../types";

export const button: ComponentDoc = {
  slug: "button",
  name: "Button",
  oneLiner:
    "The button is the standard action control: five Material 3 treatments, two sizes, one press.",
  features:
    "Reach for a button when tapping causes something: submit, save, open, confirm. The variant axis mirrors the web union exactly — `primary` is Material 3's filled button, `tonal` and `outlined` the quieter pair, `ghost` the text button, and `elevated` the one treatment that raises — because the variant law is one meaning per name across both renderers, not one name count. `size` walks the default height, the compact `sm` and the square `icon` box. Children that are text render as the label; anything else renders as-is, which is how a button gets a leading glyph.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Button",
    variants: [
      "variant: elevated · primary · tonal · outlined · ghost",
      "size: default · sm · icon",
    ],
    // M3 tabulates two rows: `button (elevated)` at level 1 and `buttons
    // (filled, tonal, outlined)` at level 0. The family claims 0 — the base
    // treatment — same as the web page; `elevated`'s row is in Customization.
    elevation: 0,
  },
  parts: ["Button"],
  customization: {
    supported: [
      "`variant` is the treatment axis and `size` the box axis; the two compose freely.",
      "`children` is the label — strings and numbers render as label text, any other node renders as-is.",
      "`labelStyle` restyles the label; `style` is a pressable style function or value. `buttonStyles` is exported for the treatment without the component.",
      "Note the two elevation rows Material 3 tabulates: `button (elevated)` rests at level 1, `buttons (filled, tonal, outlined)` at level 0. The page claims the base, 0; the `elevated` variant's row is this note — and on native the raised treatment separates by its surface fill rather than a shadow, so the level-1 row is the spec's, not the paint's.",
    ],
    notSupported: [
      "There is no `color` or `tone` override. The treatment names the emphasis; a button painted outside it is a different component's job.",
      "There is no loading state. A busy button is the `LoadingButton`; bolting a spinner onto this one hides the label contract.",
      "There is no icon-only accessibility handling beyond `labelStyle`: a glyph-only button must carry its own accessibility label from the pressable props.",
    ],
  },
  api: [
    {
      name: "variant",
      type: 'NativeButtonVariant ("elevated" | "primary" | "tonal" | "outlined" | "ghost")',
      default: '"primary"',
      note: "The treatment. One meaning per name with the web union — `primary` is M3's filled button.",
    },
    {
      name: "size",
      type: 'NativeButtonSize ("default" | "sm" | "icon")',
      default: '"default"',
      note: "The box axis. `icon` makes the button square; `sm` shrinks the label and doubles the hit slop.",
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
    "A glyph-only button is an unnamed control unless the pressable props give it an accessibility label; the text treatment is the one that names itself.",
    "The Android ripple follows the treatment's ink, and press feedback dims the surface — the control responds before the action completes.",
  ],
};
