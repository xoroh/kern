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
  "kern-menu-popup min-w-28 max-w-[280px] rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-surface-container) p-2 shadow-(--sys-elevation-level2) outline-none";

export const menuItemClass =
  "kern-menu-item relative flex min-h-12 cursor-pointer items-center gap-2 rounded-(--sys-shape-corner-extra-small) px-3 text-sm leading-5 font-medium tracking-[0.00625rem] text-(--sys-color-on-surface) outline-none select-none transition-colors duration-200 ease-(--sys-motion-easing-standard) before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] data-disabled:pointer-events-none data-disabled:text-(--sys-color-on-surface)/38 data-disabled:before:opacity-0 data-highlighted:before:opacity-[var(--sys-state-hover)]";

export const menuSeparatorClass =
  "kern-menu-separator mx-2 my-1 h-px bg-(--sys-color-outline-variant)";
