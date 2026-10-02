import type { ComponentDoc } from "../types";

export const collapsible: ComponentDoc = {
  slug: "collapsible",
  name: "Collapsible",
  oneLiner:
    "The collapsible is one disclosure: a title row that reveals or hides the content beneath it.",
  features:
    "Reach for a collapsible when a single block of content is optional to the task in front of the reader: advanced options, a legal footnote, the detail behind a summary. The title is a prop and the content is children, so the trigger layout stays the accordion's sibling's — and stays consistent — while what is revealed is entirely yours. Open state is the usual controlled-uncontrolled pair, and the content is unmounted while closed rather than hidden.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Collapsible",
    variants: [],
    elevation: "surface",
  },
  parts: ["Collapsible"],
  customization: {
    supported: [
      "`title` is the whole trigger row; `children` is the revealed content.",
      "`expanded` / `defaultExpanded` / `onExpandedChange` are the controlled-uncontrolled pair for the one open flag.",
      "`style` is a React Native `ViewStyle` for the wrapper.",
    ],
    notSupported: [
      "There is no custom trigger slot. The title row is a `Text` in a fixed pressable — if you need a rich trigger, the disclosure you want is composed from `Pressable` yourself.",
      "There is no `disabled` prop and no animation contract: content mounts when open and unmounts when closed.",
      "It is one disclosure, not a stack. For several sections with single-open behaviour, use the `Accordion`.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The trigger row's text, and its accessibility label — the pressable is labelled by this string.",
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The revealed content. Unmounted while closed, so a collapsed block renders nothing.",
    },
    {
      name: "expanded",
      type: "boolean",
      note: "Controlled open state.",
    },
    {
      name: "defaultExpanded",
      type: "boolean",
      default: "false",
      note: "Uncontrolled starting state. Omit `expanded` to let the component own it.",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: boolean) => void",
      note: "Fires with the next open flag on every toggle.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the wrapper.",
    },
  ],
  aria: [
    "The title row is a `button` role pressable labelled by `title`, reporting `expanded` in its accessibility state.",
    "The revealed content carries no role of its own — the trigger's `expanded` state is the announcement that it follows.",
  ],
};
