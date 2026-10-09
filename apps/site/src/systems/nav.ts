/**
 * Site nav — the single typed source every wayfinding surface reads.
 *
 * WHY
 *
 * The docs sidebar tree, the ⌘K/static search entries, and (Part 6) llms.txt
 * each maintained their own list of "the site's pages". Three lists of the
 * same truth drift: a page added to the sidebar but not to search is
 * unfindable from the palette, and an llms.txt generated from neither is a
 * third opinion. This file is the one list. It is HAND-EDITED — routes change
 * by human decision, not by data — but edited exactly once, with the sidebar,
 * search, and llms.txt as readers, never authors.
 *
 * Each leaf carries:
 * - label/href: what the sidebar renders (unchanged rendering, same tree).
 * - hint: the one-line description search shows under the title and llms.txt
 *   will use as the page description. Written once, read twice.
 * - group: the search group ("Guides" | "Pages"). Decided per leaf by a human
 *   because no section maps cleanly (Docs holds both a guide and pages).
 */
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

export const NAV_SECTIONS: NavSection[] = [
  {
    // Foundations first (Phase 3 grammar): tokens, color, type, elevation,
    // shape, motion and states are what every component page reads from, so
    // the sidebar opens on the layer everything else assumes. Order is
    // presentation only — check-nav is order-independent, and check-llms /
    // search read the same leaves whatever the sequence.
    label: "Foundations",
    leaves: [
      {
        label: "Foundations",
        href: "/foundations",
        hint: "Tokens, theme, accessibility, icons — the layer beneath",
        group: "Pages",
      },
      {
        label: "Theme",
        href: "/foundations/theme",
        hint: "Color roles in the active theme",
        group: "Pages",
      },
      {
        label: "Accessibility",
        href: "/foundations/accessibility",
        hint: "How kern components stay accessible",
        group: "Pages",
      },
      {
        label: "Icons",
        href: "/foundations/icons",
        hint: "Icon sets and usage",
        group: "Pages",
      },
    ],
  },
  {
    label: "Docs",
    leaves: [
      {
        label: "Overview",
        href: "/docs",
        hint: "Three ways in, one system underneath",
        group: "Pages",
      },
      {
        label: "Guides",
        href: "/docs/guides",
        hint: "How-to guides for common tasks",
        group: "Guides",
      },
      {
        label: "Use cases",
        href: "/docs/use-cases",
        hint: "CLI, MCP and skills — what each surface does",
        group: "Guides",
      },
      {
        label: "API reference",
        href: "/docs/api",
        hint: "API reference for the public utility surface",
        group: "Guides",
      },
      {
        label: "Reference",
        href: "/reference",
        hint: "Concept and contract reference",
        group: "Pages",
      },
      {
        label: "Contributing",
        href: "/docs/contributing",
        hint: "How to contribute to kern",
        group: "Pages",
      },
    ],
  },
  {
    label: "Components",
    leaves: [
      {
        label: "All components",
        href: "/components",
        hint: "Documented family by family",
        group: "Pages",
      },
      {
        label: "Web",
        href: "/components/web",
        hint: "Web component families",
        group: "Pages",
      },
      {
        label: "Native",
        href: "/components/mobile",
        hint: "Native component families",
        group: "Pages",
      },
    ],
  },
  {
    label: "Patterns",
    leaves: [
      {
        label: "Patterns",
        href: "/patterns",
        hint: "Product shapes composed from shipped components",
        group: "Pages",
      },
    ],
  },
  {
    label: "Playground",
    leaves: [
      {
        label: "Playground",
        href: "/playground",
        hint: "Repaint the system, or search it",
        group: "Pages",
      },
    ],
  },
  {
    // The hub exists as an honest placeholder (no blocks ship yet), but it
    // is still a destination: without a leaf here the sidebar orphans it
    // and check-nav's zero-orphan rule would fail on the tree's silence.
    label: "Showcase",
    leaves: [
      {
        label: "Showcase",
        href: "/showcase",
        hint: "Blocks, templates, and example apps built from kern",
        group: "Pages",
      },
    ],
  },
  {
    // Primitives (P domain): the headless behavior kernel shared by the web
    // and native renderers. One leaf — the landing links every module page,
    // and $module instances need no leaf (dynamic segments are instances of
    // their hub, per check-nav's skip rule).
    label: "Primitives",
    leaves: [
      {
        label: "Primitives",
        href: "/primitives",
        hint: "Headless behavior kernel for web and native",
        group: "Pages",
      },
    ],
  },
  {
    label: "Start",
    leaves: [
      {
        label: "Getting started",
        href: "/getting-started",
        hint: "From install to a themed component",
        group: "Guides",
      },
      {
        label: "Changelog",
        href: "/changelog",
        hint: "What changed, newest first",
        group: "Pages",
      },
      {
        label: "About",
        href: "/about",
        hint: "What kern is and why it exists",
        group: "Pages",
      },
      {
        label: "Community",
        href: "/community",
        hint: "Where to ask and share",
        group: "Pages",
      },
    ],
  },
];

/** Every leaf, flat — the shape search and llms.txt consume. */
export const NAV_LEAVES: NavLeaf[] = NAV_SECTIONS.flatMap((s) => s.leaves);
