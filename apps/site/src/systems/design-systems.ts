/**
 * Design-system registry — the one list of systems kern documents.
 *
 * WHY
 *
 * Kern hosts multiple design systems over time but documents exactly one
 * today: Material 3. Every wayfinding surface (nav, footer, the Foundations
 * hub, search hints) names the system through this file, so the second
 * system lands as data, not as a nav refactor.
 *
 * ADDING A SYSTEM
 *
 * 1. One entry below (`id`, `label`, `status: "planned"` → `"current"`).
 * 2. `src/content/systems/<id>/` — that system's foundations + component
 *    barrels (see `src/content/systems/m3/` for the shape).
 * 3. `src/routes/foundations/<id>/` — that system's hub + pages (copy the
 *    `m3/` dir; old top-level paths stay as redirect stubs, per the
 *    `throw redirect` convention check-nav exempts).
 * 4. Components stay on the shared platform gallery until a system ships its
 *    own renderer set — then nest to `/components/<id>/<name>` with
 *    Web/Native tabs the same way foundations nests today.
 */

export type DesignSystem = {
  /** URL/folder slug, e.g. "m3". */
  id: string;
  /** Full name, e.g. "Material 3". */
  label: string;
  /** Short name for tight surfaces, e.g. "M3". */
  short: string;
  /** Only one system is current at a time. */
  status: "current" | "planned";
  /** Where this system's foundations live. */
  foundationsHref: string;
  /**
   * Where this system's components live. Shared gallery until a system
   * ships its own renderer set (see ADDING A SYSTEM above).
   */
  componentsHref: string;
  /** One line for hub cards and nav hints. */
  blurb: string;
};

export const DESIGN_SYSTEMS: DesignSystem[] = [
  {
    id: "m3",
    label: "Material 3",
    short: "M3",
    status: "current",
    foundationsHref: "/foundations/m3",
    componentsHref: "/components",
    blurb:
      "The current system — tokens, theme, and components, all read from the packages kern ships.",
  },
];

/** The system every unqualified page describes. */
export const CURRENT_SYSTEM_ID = "m3";

export function systemById(id: string): DesignSystem | undefined {
  return DESIGN_SYSTEMS.find((s) => s.id === id);
}
