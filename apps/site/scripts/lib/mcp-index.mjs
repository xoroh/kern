/**
 * Machine index of the docs corpus (5D agent surfaces).
 *
 * Shared by generate-mcp-index (the emitter: writes public/mcp/index.json)
 * and check-mcp-index (the gate: every docs page is indexed). One function
 * with two callers, so the gate can never disagree with the emitter about
 * what the index contains — the same arrangement as scripts/lib/page-md.mjs.
 *
 * Data-only: every entry comes from the content docs, the foundations
 * registry, and the hand-edited nav (for the theme reference page's
 * title/one-liner — the same source llms.txt reads, never a copy). Nothing
 * is invented — page URLs are the routes the site serves, md URLs are the
 * files generate-page-md emits.
 */

/** The full index document the emitter writes and the gate re-derives. */
export function buildMcpIndex(families, foundations, theme) {
  const pages = [];
  for (const [platform, docs] of Object.entries(families)) {
    for (const doc of docs) {
      pages.push({
        kind: "family",
        platform,
        slug: doc.slug,
        title: doc.name,
        oneLiner: doc.oneLiner,
        page: `/components/${platform}/${doc.slug}`,
        md: `/md/${platform}/${doc.slug}.md`,
      });
    }
  }
  for (const page of foundations) {
    pages.push({
      kind: "foundations",
      slug: page.slug,
      title: page.title,
      oneLiner: page.oneLiner,
      page: `/foundations/${page.slug}`,
      md: `/md/foundations/${page.slug}.md`,
    });
  }
  // The theme reference page (/foundations/theme) is a docs page, not a
  // registry page: its title/one-liner come from the nav leaf (the same
  // source llms.txt links), its URLs from the route it serves and the file
  // generate-page-md emits. A docs page outside the families + FOUNDATIONS
  // census is exactly the omission this entry exists to prevent.
  if (!theme?.title || !theme?.oneLiner) {
    throw new Error(
      "buildMcpIndex: no theme page facts — resolve the /foundations/theme nav leaf before calling",
    );
  }
  pages.push({
    kind: "theme",
    slug: "theme",
    title: theme.title,
    oneLiner: theme.oneLiner,
    page: "/foundations/theme",
    md: "/md/foundations/theme.md",
  });
  return {
    name: "kern-docs-corpus",
    generatedBy:
      "apps/site/scripts/generate-mcp-index.mjs — do not hand-edit; regenerate with `bun run generate`",
    surfaces: {
      map: "/llms.txt",
      mdPattern:
        "per-page markdown at /md/{web|mobile}/<slug>.md and /md/foundations/<slug>.md",
    },
    count: pages.length,
    pages,
  };
}
