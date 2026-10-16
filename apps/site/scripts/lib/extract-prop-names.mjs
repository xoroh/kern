/**
 * Union/intersection-aware property collection for `generate-props.mjs`.
 *
 * A component Props alias is often a union (`ChipProps = FilterChipProps |
 * ActionChipProps`): member-only names (`value`, `defaultValue`,
 * `onValueChange` — filter-only selection state) ARE the component's API,
 * and the content `api` table documents them. Calling
 * `type.getProperties()` on the union itself sees only the members' common
 * properties, so those rows read as stale and `check-props` fails on valid
 * documentation. The same blindness applies to intersections nested the
 * other way round, so both are walked.
 *
 * Rule: a name carried by ANY member of a union or intersection is carried
 * by the type. Every occurrence is yielded (no name deduplication here):
 * the row builder keeps the first *usable* occurrence per name, so an
 * intrinsic occurrence (e.g. the DOM `color` attribute, whose declaration
 * is unusable for a row) must not shadow the component's own local
 * declaration of the same name later in the walk.
 *
 * Shared as a module (not inlined in the generator) so the rule has a unit
 * test: `extract-prop-names.test.mjs`.
 */

/**
 * @param {import("typescript").Type} type the alias's type from the checker
 * @returns {import("typescript").Symbol[]} property symbols in walk order
 */
export function collectTypeSymbols(type) {
  const out = [];
  const seen = new Set();
  (function walk(t) {
    if (!t || seen.has(t)) return;
    seen.add(t);
    if (t.isUnion?.() || t.isIntersection?.()) {
      for (const member of t.types ?? []) walk(member);
      return;
    }
    for (const sym of t.getProperties?.() ?? []) out.push(sym);
  })(type);
  return out;
}
