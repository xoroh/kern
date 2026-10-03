import type { ComponentDoc } from "../types";

export const command: ComponentDoc = {
  slug: "command",
  name: "Command",
  oneLiner:
    "Commands are searchable lists of actions and destinations, filtered as you type.",
  features:
    "Reach for a command palette when there are many things to do or places to go and finding them by typing beats hunting through menus: an app's action palette, a jump-to-record field, a settings search. Each option carries its own keywords, so people can find a thing by the word they would use for it rather than the word you named it with. Group related options and label the groups, because a flat filtered list of forty actions is still forty actions. If the set is small enough to see all at once, a menu is quicker than a search box.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Command",
    // No variant axis. The query is the axis.
    variants: [],
    // kern's own decision. M3's component elevation table names no command
    // palette. The surface ships `--md-sys-elevation-level3` and the choice is
    // registered as K11. See Deviations.
    elevation: 3,
  },
  parts: [
    "Command",
    "CommandRoot",
    "CommandInput",
    "CommandContent",
    "CommandList",
    "CommandItem",
    "CommandGroupLabel",
    "CommandSeparator",
    "CommandEmpty",
  ],
  deviations: [
    {
      id: "K11",
      spec: "M3's component elevation table names no command palette and no searchable list. It tabulates menus at level 2 and modal dialogs at level 3; neither describes a filtered list of actions.",
      kern: "The command surface rests at elevation level 3.",
      why: "A command palette is summoned over everything and dismissed on a keypress — it behaves like a dialog even though it is built on the combobox primitive. Dialog height is what keeps it visually above the page it interrupts. Registered as K11 in the kern deviations registry — review-m3 ruled this resting elevation a kern choice, not a transcription of M3, so the citation is the registry rather than a spec row.",
    },
  ],
  anatomy: [
    {
      name: "CommandRoot",
      role: "The field. Takes the options as data and owns the query and the selection.",
    },
    {
      name: "CommandInput",
      role: "The query box. Filtering happens as it changes.",
    },
    {
      name: "CommandContent",
      role: "The list surface. Portals to the end of the document and positions itself against the input.",
    },
    { name: "CommandList", role: "The scrollable set of matching options." },
    {
      name: "CommandItem",
      role: "One row. Carries a leading icon and a trailing keyboard hint alongside its label.",
    },
    {
      name: "CommandGroupLabel",
      role: "Names a run of related options, so the filtered list still reads as sections.",
    },
    {
      name: "CommandSeparator",
      role: "A divider between runs of options.",
    },
    {
      name: "CommandEmpty",
      role: "What to show when the query matches nothing — the only thing on screen that says the filter is too narrow.",
    },
    { name: "Command", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after the part's own classes.",
      "Options are data — `value`, `label`, optional `keywords`, `icon`, `shortcut`, `disabled`, `onSelect` — so a command palette is a list you pass in, not markup you write.",
      "The surface is the surface-container roles at dialog height, so it reads as summoned rather than embedded.",
    ],
    notSupported: [
      "There is no `filter` prop. Matching is case-insensitive over the label plus any `keywords`, and that is the only strategy shipped.",
      "There is no `size` or `variant` prop.",
      "There is no `multiple` prop. A command chooses one option; a multi-select list is not this component.",
      "There is no `elevation` prop. The resting level is a registered decision — see Deviations.",
    ],
  },
  api: [
    {
      name: "options",
      type: "readonly CommandOption[]",
      note: "The rows, as data on `CommandRoot`. Each carries `value`, `label`, and optionally `keywords`, `icon`, `shortcut`, `disabled` and `onSelect`. Filtering and rendering both come from this.",
    },
    {
      name: "onValueChange",
      type: "(value: string | null, eventDetails?) => void",
      note: "Fires when an option is chosen, with its value. Nullable — nothing chosen is `null` rather than an empty string.",
    },
    {
      name: "keywords",
      type: "string[]",
      note: "On an option: extra search terms matched against the query, alongside the label. This is how someone finds a thing by the word they would use for it rather than the word you named it with.",
    },
    {
      name: "shortcut",
      type: "string",
      note: "On an option: the trailing keyboard hint, rendered in a `Kbd`. Text to display, not a binding — the shortcut is wired by the host.",
    },
    {
      name: "onSelect",
      type: "(value: string) => void",
      note: "On an option: invoked after it is chosen, in addition to `onValueChange` on the root. Use it for per-option behaviour.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On an option: it stays visible but cannot be chosen.",
    },
  ],
  aria: [
    "The input is a combobox with `aria-expanded`, and the list is a listbox of options, so the structure is the WAI-ARIA combobox pattern rather than a styled search box.",
    "Up/Down move through the matching options and Enter chooses one; typing narrows the list without moving focus.",
    "`CommandEmpty` is what a screen reader reaches when nothing matches, so an empty result is announced rather than silently blank.",
    "Each option's `shortcut` is display text for sighted readers — it is not a binding and does not announce one.",
  ],
};
