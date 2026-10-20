import type { ComponentDoc } from "../types";

export const accordion: ComponentDoc = {
  slug: "accordion",
  name: "Accordion",
  oneLiner:
    "The accordion is a stack of disclosure sections where opening one can close the rest, keyed by section index.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Accordion",
    variants: [],
    elevation: "surface",
  },
  parts: ["Accordion"],
  // The contract, read off the component: each header is a button-role
  // pressable that reports its expanded state, and a closed section's
  // content is unmounted rather than hidden.
  keyboard: [
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Activates a section header. It is a button pressable, and it reports its expanded state, so the toggle is announced before it happens.",
    },
    {
      key: "Swipe (TalkBack / VoiceOver)",
      action:
        "Moves between the section headers in order. A closed section's content is unmounted, so nothing hidden leaks into the accessibility tree.",
    },
  ],
  customization: {
    supported: [
      "`sections` is data: each entry carries a `title`, the `content` node and an optional `accessibilityLabel` for when the visible title is not the right announcement.",
      "`value` / `defaultValue` / `onValueChange` are the controlled-uncontrolled pair, keyed by section INDEX.",
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
      name: "value",
      type: "number[]",
      note: "Controlled open section indexes.",
    },
    {
      name: "defaultValue",
      type: "number[]",
      default: "[]",
      note: "Uncontrolled starting set. Omit `value` to let the accordion own the state.",
    },
    {
      name: "onValueChange",
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
