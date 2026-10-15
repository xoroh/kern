/**
 * Primitives (P domain) wayfinding — the sidebar section, in `NavSection` shape.
 *
 * Extracted from `systems/nav.ts` for the same reason `component-nav.ts` is
 * its own file: the P domain owns its own list. `nav.ts` splices this section
 * into `NAV_SECTIONS` rather than re-listing the modules, so the sidebar,
 * the ⌘K palette and llms.txt read one list and cannot drift.
 *
 * The leaves are the landing plus one per kernel module. Module leaves use
 * the `$module` route (`/primitives/$module`), which `check-nav` resolves by
 * the dynamic-parent rule rather than a file per href.
 */
import type { NavSection } from "../../systems/nav";
import { PRIMITIVE_MODULES } from "./modules";

export const PRIMITIVES_NAV: NavSection = {
  label: "Primitives",
  leaves: [
    {
      label: "Primitives",
      href: "/primitives",
      hint: "Headless behavior kernel for web and native",
      group: "Pages",
    },
    ...PRIMITIVE_MODULES.map((m) => ({
      label: m.title,
      href: `/primitives/${m.slug}`,
      hint: m.blurb,
      group: "Pages" as const,
    })),
  ],
};
