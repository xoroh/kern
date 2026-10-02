import type { ComponentDoc } from "../types";

export const menuSheet: ComponentDoc = {
  slug: "menu-sheet",
  name: "Menu sheet",
  oneLiner:
    "The menu sheet hosts a grouped action menu in a bottom sheet — the same menu data as the menu screen, with a dismissal path around it.",
  features:
    'Reach for a menu sheet when a grouped set of actions should arrive from the bottom edge and leave without ceremony: an overflow menu, a contextual set of commands. The data is the SAME the `MenuScreen` takes — groups of actions with labels, supporting lines and an optional destructive flag — so an action can move between the two surfaces without being rewritten. The sheet hosts through `SheetSurface` rather than re-implementing dismissal: one place owns scrim, Escape and focus return, so a fix there lands here too. A destructive action is expressed as a ROLE — error ink on the error container — not as a variant axis, so the component count does not grow a "danger" treatment.',
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "MenuSheet",
    variants: [],
    // Ships `--md-sys-elevation-level1` (modal sheet; M3's "bottom sheet
    // (modal)" rests at level 1). No registry row is keyed under this slug, so
    // the claim is reported as unasserted — a registry gap, not a page gap.
    // Claimed level 1, unasserted by the elevation table — see the gap report.
    elevationBacked: false,
    elevation: 1,
  },
  parts: ["MenuSheet"],
  customization: {
    supported: [
      "`groups` is the shared menu data: `{ heading?, actions }` per group, actions carrying label, supporting line, icon, disabled and destructive flags.",
      "`open` / `defaultOpen` / `onOpenChange` are the controlled-uncontrolled pair for the modal.",
      "`className` is passed through and merged after the sheet's surface classes.",
    ],
    notSupported: [
      "No submenus or nested groups. A group is a heading and a flat list of actions — a tree is a different control.",
      "The destructive flag is a ROLE, not a variant: there is no `tone` axis to configure and no way to paint a destructive action as neutral by forgetting a prop.",
      "Icons on actions are decorative — the label names the action; an icon-only menu row is not this component.",
    ],
  },
  api: [
    {
      name: "title",
      type: "string",
      required: true,
      note: "The sheet's name — passed to the shell as its accessible label and painted as the heading. The heading is styled text, not a dialog title element; the LABEL is what names the surface.",
    },
    {
      name: "groups",
      type: "readonly MenuGroup[]",
      required: true,
      note: "The menu data shared with `MenuScreen`: `{ heading?, actions }` per group. An ungrouped list is one group without a heading.",
    },
    {
      name: "open",
      type: "boolean",
      note: "Controlled open state for the modal.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      note: "Initial state when uncontrolled.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      note: "Fires on every dismissal path — scrim and Escape both end here. Closing after an action is the host's call.",
    },
    {
      name: "className",
      type: "string",
      note: "Passed through and merged after the sheet's surface classes.",
    },
    {
      name: "testID",
      type: "string",
      default: '"kern-menu-sheet"',
      note: "Test hook for the sheet's surface.",
    },
  ],
  aria: [
    "Each group is a `group` named by its heading; an ungrouped list is one unnamed list rather than a group with an empty name, so no blank label is offered.",
    "Each action is a button named by its label with its supporting line beneath; the icon is `aria-hidden` decoration, and a destructive action is announced by its LABEL, with colour only reinforcing it.",
    'Everything else inherits `SheetSurface`\'s contract: `role="dialog"`, `aria-modal` set by hand over the primitive, scrim and Escape to dismiss, focus returned to the trigger.',
  ],
};
