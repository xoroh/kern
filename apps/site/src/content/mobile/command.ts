import type { ComponentDoc } from "../types";

export const command: ComponentDoc = {
  slug: "command",
  name: "Command",
  oneLiner:
    "Command palettes are a modal dialog with a search field and a grouped, scrollable list of actions.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Command",
    variants: [],
    elevation: 3,
  },
  parts: ["Command"],
  // The contract, read off the component: the leading field is a real text
  // input, and every row in the list is a pressable with its own label.
  keyboard: [
    {
      key: "Type",
      action:
        "Filters the actions as you type. The field at the top of the palette is a real text input, so the list is reachable without seeing it.",
    },
    {
      key: "Double-tap (TalkBack / VoiceOver)",
      action:
        "Activates an action in the list. Each row is a `menuitem` pressable named by its label, and a disabled one announces as unavailable.",
    },
    {
      key: "Double-tap on the close control (TalkBack / VoiceOver)",
      action:
        'Dismisses the palette. It is a real button labelled "Close command palette", not a decoration.',
    },
  ],
  customization: {
    supported: [
      "`actions` are data — `key`, `label`, optional `group`, `keywords`, `icon`, `disabled`, `onPress`.",
      "`group` renders Material 3's command-group heading over a flat list.",
      "`keywords` makes an action findable under alternative names.",
    ],
    notSupported: [
      "There is no `renderAction` prop. Rows are uniform so the list stays scannable.",
      "There is no `shortcut` or `kbd` prop here. Key hints are content you put in the label or beside it.",
      "There is no nesting or sub-commands. The list is flat with group headings.",
    ],
  },
  api: [
    {
      name: "actions",
      type: "CommandAction[]",
      note: "`{ key, label, group?, keywords?, icon?, disabled?, onPress? }`. The whole palette is data.",
    },
    {
      name: "group",
      type: "string",
      note: 'Material 3\'s "command group" — a heading over the flat list, so a long list reads as sections rather than as one run of rows.',
    },
    {
      name: "keywords",
      type: "string[]",
      note: "Alternative names an action is findable under. This is what lets a command be reached the way someone THINKS of it rather than only the way its label is written.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an action: keeps it visible and announces it as unavailable.",
    },
    {
      name: "style",
      type: "StyleProp<ViewStyle>",
      note: "React Native styles.",
    },
  ],
  aria: [
    "It is a modal dialog, so it interrupts and traps — appropriate for a palette summoned over everything and dismissed on a keypress.",
    "The leading search field is what makes it operable without seeing the list: type, and the actions filter.",
    "`group` headings are what give the list structure for someone hearing it read out, and `keywords` are what make finding an action possible when the label is not the word in your head.",
    "Disabled actions stay in the list and announce as disabled, so an unavailable command is discoverable rather than missing.",
  ],
};
