/**
 * Shared menu surface classes.
 *
 * These were previously private to `menu.tsx`. A component that composes its
 * own trigger onto the menu root — `FabMenu`, `SplitButton` — needs the same
 * surface, and duplicating the string would let the two drift into two
 * visually different menus with the same `role="menu"`. One definition, both
 * importers.
 */

export const menuPopupClass =
  "kern-menu-popup min-w-48 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) p-2 shadow-(--md-sys-elevation-level2) outline-none";

export const menuItemClass =
  "kern-menu-item flex min-h-12 cursor-pointer items-center gap-2 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)";

export const menuSeparatorClass =
  "kern-menu-separator mx-2 my-1 h-px bg-(--md-sys-color-outline-variant)";
