/**
 * Shape-law predicate shared by `scripts/check-kern.mjs` (imported there;
 * this module exists so the rule has unit tests via `test:scripts`).
 *
 * Legal radius classes (existing branches unchanged):
 * - `rounded[-<dir>]-(none|full)` — literal extremes.
 * - `rounded[-<dir>]-[inherit]` — inheritance passthrough.
 * - `rounded[-<dir>]-(--sys-shape-corner-<corner>)` — a scale role
 *   (corner validity is enforced by the separate token-validity leg).
 *
 * Plus the A4 component-token branch:
 * - `rounded[-<dir>]-[var(--comp-<slot>,var(--sys-shape-corner-<corner>))]`
 *   where the fallback `<corner>` must be a real scale key. This can only
 *   reject classes the token-validity leg already rejects (same key set),
 *   so it adds no new violations — it just names the intended syntax.
 *
 * Everything else (`rounded-[12px]`, `rounded-3xl`, …) is illegal: radii
 * come from the shape scale.
 */

/** Match the A4 component-token class and capture slot + fallback corner. */
const COMP_RE =
  /^rounded(?:-[a-z]{1,2})?-\[var\(--comp-([a-z][a-z0-9-]*),var\(--sys-shape-corner-([a-z-]+)\)\)\]$/;

export function isShapeLegal(cls, shapeKeys) {
  if (/^rounded(?:-[a-z]{1,2})?-(?:none|full)$/.test(cls)) return true;
  if (/^rounded(?:-[a-z]{1,2})?-\[inherit\]$/.test(cls)) return true;
  if (/^rounded(?:-[a-z]{1,2})?-\(--sys-shape-corner-[a-z-]+\)$/.test(cls)) {
    return true;
  }
  const comp = COMP_RE.exec(cls);
  if (comp !== null) return shapeKeys.has(comp[2]);
  return false;
}
