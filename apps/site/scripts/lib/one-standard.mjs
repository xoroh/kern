/**
 * The one-standard rules — the FLIPS, as a pure function.
 *
 * ADR-115 / the approved proposal end with two hard requirements:
 *
 *   1. KEYBOARD: every covered component page states a keyboard contract
 *      (`keyboard` with at least one row) or declares itself non-interactive
 *      (`nonInteractive: true`). "Not yet written" is no longer a state a
 *      page may sit in.
 *   2. EXAMPLE: every covered component family carries at least one CODED
 *      example, registered in the showcase registry under one of its parts.
 *      A family that renders can show its own code.
 *
 * The functions live here (not in the gate script) so the fail-before tests
 * can run them against a fixture: a page whose keyboard table is stripped
 * must be NAMED by the rule, and a family whose fences are removed must be
 * NAMED by the other.
 */

/**
 * The families the ONE STANDARD does not cover.
 *
 * The standard is a standard for COMPONENT pages: a component family has a
 * live demo, a coded example, a props table, a keyboard contract and a
 * customization section where it is real. Not every page in the corpus is a
 * component page, and pretending otherwise would either force a keyboard
 * contract onto a static poster or exempt the whole corpus.
 *
 * Two groups sit outside it:
 *
 *  - INFRASTRUCTURE: the primitives and the shell the components are built
 *    on (a link, a focus ring, the theme pages). They have no component
 *    contract to state.
 *  - SITE CHROME: the site's own furniture (the hero, the footer, the
 *    boot splash). They are the site's, not the library's.
 *
 * A family in this list is EXEMPT from the keyboard and example flips. The
 * list is data, in one place, so the gate and the docs cannot disagree
 * about who is covered.
 */
export const OUTSIDE_ONE_STANDARD = {
  // Infrastructure — the primitives and the shell.
  link: "infrastructure: a link is a primitive, not a component family",
  "focus-ring": "infrastructure: a focus ring is a primitive",
  "app-ready": "infrastructure: the app-ready helper is a primitive",
  theme: "infrastructure: the theme pages are foundations, not components",
  fonts: "infrastructure: the font pages are foundations, not components",
  "overlay-modality":
    "infrastructure: the overlay kernel is a primitive, not a component",
  "field-context":
    "infrastructure: the field context is a primitive, not a component",
  "bottom-sheet-surface":
    "infrastructure: the sheet surface is a primitive, not a component",
  presentation:
    "infrastructure: the presentation primitives are not components",
  utils: "infrastructure: the utility pages are not components",
  "state-layer":
    "infrastructure: the state layer is a paint helper, not a component",
  "supporting-pane": "a block: the supporting pane is block furniture",
  "search-bar": "folded into the Search family (the proposal's fold)",

  // Site chrome — the site's own furniture.
  "site-footer": "site chrome: the site's footer is not the library's",
  hero: "site chrome: the homepage hero is not the library's",
  "top-bar": "site chrome: the site's top bar is not the library's",
  "page-loader": "site chrome: the route loader is the site's",
  "boot-splash": "site chrome: the boot splash is the site's",
  "boot-indicator": "site chrome: the boot indicator is the site's",
  "error-boundary": "site chrome: the error boundary is the site's",
  "kern-error-boundary": "site chrome: the error boundary is the site's",
  "preview-card": "site chrome: the preview card is the site's",
  "milestone-trio": "site chrome: the milestone strip is the site's",
};

/** Whether the one standard covers this family. */
export function isCovered(slug) {
  return !(slug in OUTSIDE_ONE_STANDARD);
}

/**
 * The two flips, as rules over a page list.
 *
 * @param pages   the content docs: `{ file, doc }`
 * @param registered  the export names that carry a coded example
 * @returns the violations, as human-readable strings naming the page
 */
export function oneStandardViolations(pages, registered) {
  const violations = [];
  const families = new Map();

  for (const { file, doc } of pages) {
    const slug = doc.slug;
    if (!isCovered(slug)) continue;

    const hasTable = (doc.keyboard?.length ?? 0) > 0;
    const declaredNonInteractive = doc.nonInteractive === true;
    if (!hasTable && !declaredNonInteractive) {
      violations.push(
        `${file}: no keyboard contract — add a \`keyboard\` table, or set ` +
          `\`nonInteractive: true\` when the part genuinely has no key interaction`,
      );
    }
    if (hasTable) {
      for (const row of doc.keyboard ?? []) {
        if (!row.key?.trim() || !row.action?.trim()) {
          violations.push(
            `${file}: a keyboard row is missing its key or its action`,
          );
        }
      }
    }

    if (!families.has(slug)) {
      families.set(slug, { parts: [], files: [] });
    }
    families.get(slug).parts.push(...(doc.parts ?? []));
    families.get(slug).files.push(file);
  }

  for (const [slug, family] of families) {
    const hasFence = family.parts.some((part) => registered.has(part));
    if (!hasFence) {
      violations.push(
        `${family.files[0]}: the family "${slug}" has no coded example — ` +
          `register one under ${family.parts.join(" / ")} in the showcase registry`,
      );
    }
  }

  return violations;
}
