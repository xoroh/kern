import type { ComponentDoc } from "../types";

export const accordion: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  oneLiner:
    "The accordion is a stack of disclosure sections where opening one can close the rest, keyed by section index.",
  features:
    "Reach for the accordion when several sections compete for the same vertical space and the reader usually needs only one: an FAQ, a settings group, a filter stack. Sections are DATA, not children — you pass an array of `{ title, content }` and the accordion owns the headers, the toggle state and the disclosure. By default opening a section closes the others (`multiple` opts out of that), and the open set is a plain index array, so controlled and uncontrolled use are the same shape. Closed sections are unmounted, not hidden, so a collapsed accordion costs nothing to render.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Accordion",
    variants: [],
    elevation: "surface",
  },
  parts: ["Accordion"],
  customization: {
    supported: [
      "`sections` is data: each entry carries a `title`, the `content` node and an optional `accessibilityLabel` for when the visible title is not the right announcement.",
      "`expanded` / `defaultExpanded` / `onExpandedChange` are the controlled-uncontrolled pair, keyed by section INDEX.",
      "`style` is a React Native `ViewStyle`. `accordionStyles` is exported if you want the frame without the component.",
    ],
    notSupported: [
      "Sections are not children. There is no `AccordionItem` to compose — the header layout, the toggle and the disclosure are the accordion's, so they stay consistent across every instance.",
      "There is no per-section disabled flag and no async loading of a section's content.",
      "There is no animation contract. Content mounts when open and unmounts when closed; a reveal transition is yours to add around it.",
    ],
  },
  api: [
    {
      name: "sections",
      type: "NativeAccordionSection[]",
      required: true,
      note: "The data. Each entry is `{ title, content, accessibilityLabel? }` — the accordion renders the header and the disclosure from it.",
    },
    {
      name: "expanded",
      type: "number[]",
      note: "Controlled open section indexes. The key type is the index because that is what the public API has always been.",
    },
    {
      name: "defaultExpanded",
      type: "number[]",
      default: "[]",
      note: "Uncontrolled starting set. Omit `expanded` to let the accordion own the state.",
    },
    {
      name: "onExpandedChange",
      type: "(expanded: number[]) => void",
      note: "Fires with the WHOLE next open set, not the toggled index — the same shape for single and `multiple`.",
    },
    {
      name: "multiple",
      type: "boolean",
      default: "false",
      note: "Allow several sections open at once. Without it the accordion is single-toggle: opening a section closes the others.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles for the frame. `accordionStyles` is exported for the treatment without the component.",
    },
  ],
  aria: [
    "Each header is a `button` role pressable labelled by the section title (or `accessibilityLabel` when the title is not the right announcement) and reports `expanded` in its accessibility state.",
    "The disclosure itself carries no role: the header's `expanded` state is what tells assistive technology that content follows.",
    "Content that is closed is unmounted, so nothing hidden leaks into the accessibility tree.",
  ],
};
