/**
 * Site nav — the single typed source every wayfinding surface reads.
 *
 * WHY
 *
 * The docs sidebar tree, the ⌘K/static search entries, and llms.txt each
 * maintained their own list of "the site's pages". Three lists of the same
 * truth drift. This file is the one list. It is HAND-EDITED — routes change
 * by human decision — but edited exactly once, with the sidebar, search, and
 * llms.txt as readers, never authors.
 *
 * v3 — ONE DOCS TREE. The five-tab split made Foundations its own header
 * door, which asked readers to pick a door before they knew what was in it:
 * foundations material is documentation. Now the docs door owns the whole
 * reference, and this file groups the truth the sidebar renders as one
 * merged tree:
 *
 *   FOUNDATIONS_NAV — the design half (M3 canon order, then Kern)
 *   DEVELOP_NAV     — the developer half (guides, API, primitives)
 *   COMPONENTS_NAV / BLOCKS_NAV / STUDIO_NAV / PROJECT_NAV — the catalog,
 *     the composed work, the tool, and the project pages
 *
 * The foundations order mirrors the M3 canon (tokens → color → type →
 * shape → elevation → motion → states) with Kern's additions (theme,
 * icons, accessibility) after, matching `foundations/shell.tsx`.
 *
 * Each leaf carries:
 * - label/href: what the sidebar renders.
 * - hint: the one-line description search shows under the title and llms.txt
 *   uses as the page description.
 * - group: the search group ("Guides" | "Pages").
 */
import { PRIMITIVES_NAV } from "../domains/primitives/primitives-nav";

export type NavLeaf = {
  label: string;
  href: string;
  hint: string;
  group: "Guides" | "Pages";
};

export type NavSection = {
  label: string;
  leaves: NavLeaf[];
};

/** The design half of the docs tree. M3 canon order, then Kern. */
export const FOUNDATIONS_NAV: NavSection[] = [
  {
    label: "Overview",
    leaves: [
      {
        label: "Design systems",
        href: "/foundations",
        hint: "The systems kern documents — M3 today, shaped for more",
        group: "Pages",
      },
    ],
  },
  {
    label: "Material 3",
    leaves: [
      {
        label: "Material 3",
        href: "/foundations/m3",
        hint: "The current system — tokens, theme, and the layer beneath",
        group: "Pages",
      },
      {
        label: "Tokens",
        href: "/foundations/m3/tokens",
        hint: "The token architecture — naming, roles, bands",
        group: "Pages",
      },
      {
        label: "Color",
        href: "/foundations/m3/color",
        hint: "M3 role system, pairing law, usage rules",
        group: "Pages",
      },
      {
        label: "Typography",
        href: "/foundations/m3/type",
        hint: "M3 type scale, specimens, roles",
        group: "Pages",
      },
      {
        label: "Shape",
        href: "/foundations/m3/shape",
        hint: "M3 corner scale and shape ladder",
        group: "Pages",
      },
      {
        label: "Elevation",
        href: "/foundations/m3/elevation",
        hint: "M3 levels, shadows, surface depth",
        group: "Pages",
      },
      {
        label: "Motion",
        href: "/foundations/m3/motion",
        hint: "Easing, durations, springs",
        group: "Pages",
      },
      {
        label: "States",
        href: "/foundations/m3/states",
        hint: "State layers, interaction states, focus",
        group: "Pages",
      },
      {
        label: "Theme",
        href: "/foundations/m3/theme",
        hint: "M3 color roles in the active theme",
        group: "Pages",
      },
    ],
  },
  {
    label: "Resources",
    leaves: [
      {
        label: "Icons",
        href: "/foundations/icons",
        hint: "Icon sets and usage",
        group: "Pages",
      },
      {
        label: "Accessibility",
        href: "/foundations/accessibility",
        hint: "How kern components stay accessible",
        group: "Pages",
      },
    ],
  },
];

/** The developer half of the docs tree — guides, API, primitives. */
export const DEVELOP_NAV: NavSection[] = [
  {
    label: "Develop",
    leaves: [
      {
        label: "Getting started",
        href: "/docs/getting-started",
        hint: "From install to a themed component",
        group: "Guides",
      },
      {
        label: "Guides",
        href: "/docs/guides",
        hint: "How-to guides for common tasks",
        group: "Guides",
      },
      {
        label: "Tooling",
        href: "/docs/use-cases",
        hint: "CLI, MCP and skills — what each surface does",
        group: "Guides",
      },
      {
        label: "CLI",
        href: "/docs/cli",
        hint: "kern create / init / add / diff / upgrade / feedback",
        group: "Guides",
      },
      {
        label: "MCP server",
        href: "/docs/mcp",
        hint: "Connect any MCP host — Claude Code, Cursor, VS Code, Zed",
        group: "Guides",
      },
      {
        label: "API utilities",
        href: "/docs/api",
        hint: "API reference for the public utility surface",
        group: "Guides",
      },
      {
        label: "Contributing",
        href: "/docs/contributing",
        hint: "How to contribute to kern",
        group: "Pages",
      },
    ],
  },
  // Primitives (P domain): the headless behavior kernel shared by the web
  // and native renderers.
  PRIMITIVES_NAV,
];

/** The catalog door. */
export const COMPONENTS_NAV: NavSection[] = [
  {
    label: "Components",
    leaves: [
      {
        label: "All components",
        href: "/components",
        hint: "Documented family by family, filterable by platform in place",
        group: "Pages",
      },
      {
        label: "API reference",
        href: "/reference",
        hint: "Every export in the generated manifest",
        group: "Pages",
      },
    ],
  },
];

/** Composed work. */
export const BLOCKS_NAV: NavSection[] = [
  {
    label: "Blocks",
    leaves: [
      {
        label: "All blocks",
        href: "/showcase",
        hint: "Blocks, templates, and example apps built from kern",
        group: "Pages",
      },
      {
        label: "Patterns",
        href: "/patterns",
        hint: "Product shapes composed from shipped components",
        group: "Pages",
      },
    ],
  },
];

/** The tool. */
export const STUDIO_NAV: NavSection[] = [
  {
    label: "Studio",
    leaves: [
      {
        label: "Theme studio",
        href: "/playground",
        hint: "Repaint the system, or search it",
        group: "Pages",
      },
    ],
  },
];

/** Project pages — not a door, but part of the site's truth. */
export const PROJECT_NAV: NavSection[] = [
  {
    label: "Project",
    leaves: [
      {
        label: "About",
        href: "/about",
        hint: "What kern is and why it exists",
        group: "Pages",
      },
      {
        label: "Changelog",
        href: "/changelog",
        hint: "What changed, newest first",
        group: "Pages",
      },
      {
        label: "Community",
        href: "/community",
        hint: "Where to ask and share",
        group: "Pages",
      },
      {
        label: "License",
        href: "/legal/license",
        hint: "MIT license terms",
        group: "Pages",
      },
      {
        label: "Security",
        href: "/legal/security",
        hint: "How to report vulnerabilities",
        group: "Pages",
      },
    ],
  },
];

/**
 * Every section, all doors — the completeness view. Search and llms.txt read
 * NAV_LEAVES (flat); the section sidebar picks the door's slice instead of
 * rendering this.
 */
export const NAV_SECTIONS: NavSection[] = [
  ...FOUNDATIONS_NAV,
  ...COMPONENTS_NAV,
  ...BLOCKS_NAV,
  ...STUDIO_NAV,
  ...DEVELOP_NAV,
  ...PROJECT_NAV,
];

/** Every leaf, flat — the shape search and llms.txt consume. */
export const NAV_LEAVES: NavLeaf[] = NAV_SECTIONS.flatMap((s) => s.leaves);
