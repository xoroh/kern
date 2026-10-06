/**
 * a11y-derive.mjs — the Part 7 expectation rules, shared by generate-a11y.mjs
 * and check-a11y.mjs. ONE copy of the rules: the gate re-derives every
 * `derived` entry from the live content docs and diffs it against the file,
 * so a generator bug (or a content edit without regen) fails the gate
 * instead of shipping stale expectations.
 *
 * HONESTY MODEL (answers ground-up-plan open question 3 partially):
 * - These are EXPECTATIONS, not measurements. No axe runner exists in this
 *   repo, so nothing here was observed in a browser. Every file carries
 *   measured:false and says so.
 * - `derived` = a mechanical restatement of a claim the page already makes
 *   (keyboard rows, aria lines, nonInteractive flag, stated gaps). It adds
 *   machine-readability, not new knowledge. The basis names the source.
 * - `authored` = new human judgment, merged from src/a11y-overrides/. The
 *   generator never emits it; only a person does. Zero authored entries ship
 *   until someone exercises judgment (inventing axe verdicts by eye without
 *   running axe would be fabrication, so the overrides dir starts empty).
 */

/**
 * @param {object} doc a ComponentDoc (slug, parts, keyboard, aria,
 *   nonInteractive, accessibilityGaps)
 * @param {string} exportName one entry of doc.parts
 * @param {boolean} hasLiveDemo registry presence for this export
 * @returns {Array} derived expectation entries
 */
export function deriveExpectations(doc, exportName, hasLiveDemo) {
  const out = [];
  if (!hasLiveDemo) return out;

  const kb = doc.keyboard ?? [];
  const aria = doc.aria ?? [];
  const gaps = doc.accessibilityGaps ?? [];

  if (doc.nonInteractive) {
    out.push({
      rule: "focusable",
      expect: "pass",
      provenance: "derived",
      basis: `${exportName} is a non-interactive part (${doc.slug}.ts: nonInteractive) — takes no focus, so no keyboard trap or missing-focus-indicator finding can apply`,
    });
  } else if (kb.length > 0) {
    out.push({
      rule: "keyboard-operable",
      expect: "pass",
      provenance: "derived",
      basis: `keyboard contract carries ${kb.length} row(s) in ${doc.slug}.ts — every operable action has a documented key`,
    });
  } else {
    // No interactivity assertion here (design verdict on Part 7): the rule
    // keys off the page-level flag, so a static sub-part (DialogTitle,
    // DialogDescription) would inherit a false "is interactive". The softened
    // template is true for both cases — the contract is unwritten, full stop.
    out.push({
      rule: "keyboard-operable",
      expect: "gap",
      provenance: "derived",
      basis: `${doc.slug}.ts documents no keyboard rows for ${exportName} — the contract is unwritten, treat as a gap not a pass`,
    });
  }

  if (aria.length > 0) {
    out.push({
      rule: "aria-contract",
      expect: "pass",
      provenance: "derived",
      basis: `aria contract carries ${aria.length} line(s) in ${doc.slug}.ts — roles, names and states are stated, not assumed`,
    });
  } else if (!doc.nonInteractive) {
    // Same softening as above: no "is interactive" assertion.
    out.push({
      rule: "aria-contract",
      expect: "gap",
      provenance: "derived",
      basis: `${doc.slug}.ts states no aria contract for ${exportName} — screen-reader behaviour is unclaimed`,
    });
  }

  for (const gap of gaps) {
    out.push({
      rule: "known-gap",
      expect: "fail",
      provenance: "derived",
      basis: `stated gap in ${doc.slug}.ts: ${gap}`,
    });
  }

  return out;
}
