/**
 * Versioned Kern authoring schema (KERN-018) — authoritative storage.
 *
 * Kern's `tokens.json` is a CUSTOM authoring format: sparse palettes with
 * `{oklch, srgb}`, role tables, scales and schemes. This module is its
 * versioned schema: the shape new code validates against before touching the
 * graph, and the version coordinate consumers pin.
 *
 * DTCG 2025.10 is INTERCHANGE, not storage: `dtcg/export.ts` projects this
 * schema outward, `dtcg/import.ts` converts inward. No second editable DTCG
 * mirror is maintained — two mirrors is how values drift while both look
 * canonical.
 */

/** Authoring schema version. Bump with a changeset when the shape changes. */
export const TOKEN_SCHEMA_VERSION = "1.0.0" as const;

/** The foundation groups every authoring document must carry. */
export const TOKEN_GROUPS = [
  "palettes",
  "typography",
  "shape",
  "elevation",
  "motion",
  "states",
  "spacing",
] as const;

export type TokenGroup = (typeof TOKEN_GROUPS)[number];

/** Hard bounds for untrusted input: no URL dereference, no deep recursion. */
export const MAX_DOCUMENT_DEPTH = 12;
export const MAX_DOCUMENT_NODES = 20000;

function fail(what: string): never {
  throw new Error(`Invalid token source: ${what}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Fail-loud validation for an authoring token document. Returns nothing —
 * validity is the absence of a throw, and every throw names the path.
 */
export function validateTokenSource(doc: unknown, path = "$"): void {
  if (!isPlainObject(doc)) fail(`${path} is not an object`);
  for (const group of TOKEN_GROUPS) {
    if ((doc as Record<string, unknown>)[group] === undefined) {
      fail(`${path} is missing foundation group "${group}"`);
    }
  }
  checkDepth(doc as Record<string, unknown>, path, 0);
}

function checkDepth(
  node: Record<string, unknown>,
  path: string,
  depth: number,
): void {
  if (depth > MAX_DOCUMENT_DEPTH) {
    fail(`${path} exceeds max depth ${MAX_DOCUMENT_DEPTH}`);
  }
  let count = 0;
  for (const key of Object.keys(node)) {
    // Prototype pollution from tokens is not a theoretical risk: a token file
    // is data that becomes object keys, and `__proto__` as a key rewrites the
    // object it lands on. Reject it at the boundary, not at the use site.
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      fail(`${path} carries a prototype key "${key}"`);
    }
    count += 1;
    if (count > MAX_DOCUMENT_NODES) {
      fail(`${path} exceeds max nodes ${MAX_DOCUMENT_NODES}`);
    }
    const value = node[key];
    if (isPlainObject(value)) {
      checkDepth(value, `${path}.${key}`, depth + 1);
    }
  }
}
