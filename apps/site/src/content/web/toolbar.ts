import type { ComponentDoc } from "../types";

export const toolbar: ComponentDoc = {
  slug: "toolbar",
  name: "Toolbar",
  oneLiner: "Toolbars hold the controls that act on the content below them.",
  features:
    "Reach for a toolbar when a set of controls belongs to a surface and should stay reachable while that surface is used: a text editor's formatting bar, a table's bulk actions, a canvas's tools. Group related controls and separate the groups, because a single unbroken row of icons is a memory test. Keep it to actions on what is below it — navigation and settings belong elsewhere. If the bar has only two or three controls, a row of buttons does the job and a toolbar adds nothing but a container.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "Toolbar",
    // No variant axis. One treatment.
    variants: [],
    // M3's row "toolbar" rests at level 2, and the bar ships
    // `--md-sys-elevation-level2` to match. Asserted against the spec, unlike
    // most of the overlays around it.
    elevation: 2,
  },
  parts: [
    "Toolbar",
    "ToolbarRoot",
    "ToolbarGroup",
    "ToolbarButton",
    "ToolbarSeparator",
  ],
  deviations: [
    {
      id: "K3",
      spec: "Material 3 defines no tonal surface role. Its surface roles are the surface, surface-dim, surface-bright and the surface-container family.",
      kern: "The toolbar's bar is painted with `--md-sys-color-surface-tonal`, a role kern adds beyond M3's 45.",
      why: "A toolbar needs a track that reads as a container for its controls rather than as content, and none of M3's surface-container roles is tuned for a rounded bar holding pressed states. The role is registered as K3 in the role inventory, so it is a declared addition rather than a colour invented in a stylesheet. The token is what deviates; this is the component whose whole surface depends on it.",
    },
  ],
  anatomy: [
    {
      name: "ToolbarRoot",
      role: "The bar. Holds the controls and moves focus between them.",
    },
    {
      name: "ToolbarGroup",
      role: "A run of related controls, so the bar reads as sections rather than a line of icons.",
    },
    {
      name: "ToolbarButton",
      role: "One control. A real button in the toolbar's focus order.",
    },
    {
      name: "ToolbarSeparator",
      role: "A divider between groups.",
    },
    { name: "Toolbar", role: "The namespace object: all of the parts above." },
  ],
  customization: {
    supported: [
      "`className` on every part, merged after that part's own classes.",
      "The bar is a rounded tonal track with a level-2 lift — see Deviations for the track colour.",
      "Groups and separators let the bar be divided without new component types.",
    ],
    notSupported: [
      "There is no `orientation` prop. The bar is horizontal; a vertical toolbar is the root's `className` and its own layout.",
      "There is no `variant`, `size` or `density` prop. One height, one treatment.",
      "There is no `label` prop on the bar. The toolbar's accessible name is the root's `aria-label`, because the bar is a landmark and landmarks need names.",
    ],
  },
  api: [
    {
      name: "aria-label",
      type: "string",
      note: "The accessible name of the toolbar landmark. With two toolbars on a page, this is what distinguishes them — without it, the landmark list has two identical entries.",
    },
    {
      name: "className",
      type: "string",
      note: "Accepted on every part, merged after that part's classes.",
    },
    {
      name: "disabled",
      type: "boolean",
      note: "On a button. Disabled controls are skipped rather than left as dead stops in the focus order.",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      note: "On the root: which way the controls are laid out and which arrow keys move between them. The visual layout is still `className`.",
    },
  ],
  aria: [
    "The root is a toolbar landmark, so it appears in a screen reader's landmark list and can be jumped to directly.",
    "It needs an `aria-label` — a landmark with no name is indistinguishable from every other unnamed landmark on the page.",
    "Arrow keys move between the controls and focus is managed as a group, which is the WAI-ARIA toolbar pattern and the reason to use this rather than a plain row of buttons.",
    "Separators are decorative; the grouping is what a screen reader hears.",
  ],
};
