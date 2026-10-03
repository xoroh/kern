import type { ComponentDoc } from "../types";

export const command: ComponentDoc = {
  slug: "command",
  name: "Command",
  oneLiner:
    "Command palettes are a modal dialog with a search field and a grouped, scrollable list of actions.",
  features:
    "Reach for a command palette when the app has many actions and the fast path is typing one: an editor's commands, a console's operations. It is Material 3's shape — a modal dialog with a leading search field and a grouped, scrollable action list — and the native form of the same idea cmdk made common. Actions are data, and the two fields worth using are `group` and `keywords`. `group` gives the flat list its headings (Material 3's \"command group\"), and `keywords` is what makes an action findable under a name other than its label, so a command can be reached the way someone thinks of it rather than only the way it is written.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Exact web counterpart, checked in the web inventory.
    nativePeer: "Command",
    variants: [],
    elevation: 3,
  },
  parts: ["Command"],
  deviations: [
    {
      id: "K11",
      spec: "M3's component elevation table names no command palette and no searchable list. It tabulates menus at level 2 and modal dialogs at level 3; neither describes a filtered list of actions.",
      kern: "The command surface rests at elevation level 3.",
      why: "A command palette is summoned over everything and dismissed on a keypress — it behaves like a dialog even though it is built on the combobox primitive. Dialog height is what keeps it visually above the page it interrupts. Registered as K11 in the kern deviations registry — review-m3 ruled this resting elevation a kern choice, not a transcription of M3, so the citation is the registry rather than a spec row.",
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
