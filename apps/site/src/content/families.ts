/**
 * The gallery's family taxonomy — DATA, not layout code.
 *
 * The groups are the M3 purposes the blueprint rules (SITE-REDESIGN-full-site-map
 * §3b, the S18 family grouping): Action · Containment · Communication ·
 * Navigation · Selection · Text input. kern also ships surface types that no
 * M3 purpose describes (type and shape utilities, layout helpers) — those sit
 * in a visibly named `utilities` group rather than being forced into a purpose
 * they do not serve, or dumped into a silent "Other" (spec R2).
 *
 * The map is keyed by FAMILY SLUG (the content page's slug, which is also the
 * canonical route segment). A slug the map does not know renders in
 * `utilities` and is visible there — never dropped, never invisible.
 */

export type FamilyGroupId =
  | "action"
  | "containment"
  | "communication"
  | "navigation"
  | "selection"
  | "text-input"
  | "utilities";

export type FamilyGroup = {
  id: FamilyGroupId;
  title: string;
  blurb: string;
};

export const FAMILY_GROUPS: FamilyGroup[] = [
  {
    id: "action",
    title: "Action",
    blurb: "Components that do something when invoked — commands, menus, buttons.",
  },
  {
    id: "containment",
    title: "Containment",
    blurb: "Surfaces that hold content — cards, dialogs, sheets, panes, lists.",
  },
  {
    id: "communication",
    title: "Communication",
    blurb: "Components that report status — progress, banners, snackbars, feedback.",
  },
  {
    id: "navigation",
    title: "Navigation",
    blurb: "Components that move between views — bars, rails, tabs, drawers.",
  },
  {
    id: "selection",
    title: "Selection",
    blurb: "Components that choose values — controls, chips, pickers.",
  },
  {
    id: "text-input",
    title: "Text input",
    blurb: "Components that enter data — fields, forms, labels.",
  },
  {
    id: "utilities",
    title: "Utilities and surfaces",
    blurb:
      "kern's own surface types — typography, shape and layout helpers. No M3 purpose describes these, so they are grouped here, visibly, rather than forced into one.",
  },
];

/**
 * Family slug → purpose. Every known family slug on both platforms is listed;
 * anything missing lands in `utilities` and shows up there (see `familyFor`).
 */
export const FAMILY_OF: Record<string, FamilyGroupId> = {
  // Action
  button: "action",
  "button-group": "action",
  "extended-fab": "action",
  fab: "action",
  "fab-menu": "action",
  "icon-button": "action",
  "icon-button-target": "action",
  "loading-button": "action",
  "split-button": "action",
  link: "action",
  command: "action",
  "context-menu": "action",
  menu: "action",
  "menu-group-list": "action",
  "menu-screen": "action",
  "menu-sheet": "action",
  menubar: "action",
  // Containment
  accordion: "containment",
  card: "containment",
  collapsible: "containment",
  dialog: "containment",
  "alert-dialog": "containment",
  sheet: "containment",
  "sheet-handle": "containment",
  "sheet-surface": "containment",
  "bottom-sheet": "containment",
  "bottom-sheet-picker": "containment",
  "dock-sheet": "containment",
  "snap-sheet": "containment",
  "entity-sheet": "containment",
  "action-sheet": "containment",
  popover: "containment",
  "preview-card": "containment",
  drawer: "containment",
  pane: "containment",
  split: "containment",
  "list-detail": "containment",
  "supporting-pane": "containment",
  "app-shell": "containment",
  sidebar: "containment",
  table: "containment",
  "scroll-area": "containment",
  "list-item": "containment",
  // Communication
  badge: "communication",
  banner: "communication",
  "circular-progress": "communication",
  "linear-progress": "communication",
  progress: "communication",
  "loading-indicator": "communication",
  "loading-region": "communication",
  loader: "communication",
  "page-loader": "communication",
  "boot-indicator": "communication",
  "boot-splash": "communication",
  skeleton: "communication",
  snackbar: "communication",
  sonner: "communication",
  tooltip: "communication",
  meter: "communication",
  "empty-state": "communication",
  "error-boundary": "communication",
  "kern-error-boundary": "communication",
  "milestone-trio": "communication",
  "success-transform": "communication",
  // Navigation
  "navigation-bar": "navigation",
  "navigation-bar-item": "navigation",
  "navigation-drawer": "navigation",
  "navigation-menu": "navigation",
  "navigation-rail": "navigation",
  "top-app-bar": "navigation",
  tabs: "navigation",
  "secondary-tabs": "navigation",
  toolbar: "navigation",
  pagination: "navigation",
  // Selection
  checkbox: "selection",
  "checkbox-group": "selection",
  "radio-group": "selection",
  switch: "selection",
  toggle: "selection",
  "toggle-group": "selection",
  "segmented-button": "selection",
  chip: "selection",
  "filter-chip-row": "selection",
  slider: "selection",
  select: "selection",
  "native-select": "selection",
  autocomplete: "selection",
  combobox: "selection",
  "country-select": "selection",
  calendar: "selection",
  "time-picker": "selection",
  // Text input
  input: "text-input",
  "input-otp": "text-input",
  textarea: "text-input",
  field: "text-input",
  fieldset: "text-input",
  label: "text-input",
  form: "text-input",
  "number-field": "text-input",
  search: "text-input",
  // Utilities and surfaces
  text: "utilities",
  shape: "utilities",
  "shape-art": "utilities",
  "aspect-ratio": "utilities",
  separator: "utilities",
  kbd: "utilities",
  blocks: "utilities",
  "kern-pressable": "utilities",
};

/** The group a family belongs to. Unknown slugs land in `utilities` — visible. */
export function familyFor(slug: string): FamilyGroupId {
  return FAMILY_OF[slug] ?? "utilities";
}
