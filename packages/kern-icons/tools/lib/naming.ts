/**
 * Icon naming.
 *
 * One canonical name per icon: **kebab-case**, ASCII, no leading digit problems
 * (names may start with a digit — `10k`, `360` — which is fine for a string
 * literal union but not for an identifier).
 *
 * Upstream Material Symbols files use snake_case (`add_shopping_cart.svg`) and
 * encode the filled axis as a `-fill` suffix. Brand assets dropped into
 * `assets/brand/` use kebab-case with the filled variant in a sibling
 * `filled/` directory.
 */

/** Marker suffix that distinguishes the FILL 1 asset from the FILL 0 asset. */
export const FILLED_SUFFIX = "-fill";

/** Characters allowed in an icon name. */
const VALID_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Normalises any separator run to a single hyphen and lower-cases. */
export function toKebab(stem: string): string {
  return stem.replace(/[_\s]+/g, "-").toLowerCase();
}

/** Strips the `.svg` extension. */
export function stripSvgExtension(fileName: string): string {
  return fileName.replace(/\.svg$/i, "");
}

/**
 * Splits an **upstream Material Symbols** stem into its icon name and fill axis.
 *
 * Upstream names are snake_case and the fill axis is appended with a hyphen
 * (`format_color_fill-fill.svg`), so the hyphen suffix is unambiguous — the name
 * itself can never contain one. Doing the split before kebab conversion is what
 * keeps `format_color_fill` from being mistaken for the filled variant of a
 * hypothetical `format-color`.
 */
export function splitMaterialStem(fileName: string): {
  name: string;
  filled: boolean;
} {
  const stem = stripSvgExtension(fileName);
  const filled = stem.endsWith(FILLED_SUFFIX);
  const base = filled ? stem.slice(0, -FILLED_SUFFIX.length) : stem;
  return { name: fromMaterialFileStem(base), filled };
}

/** Upstream Material Symbols file stem for an icon name (snake_case). */
export function toMaterialFileStem(name: string): string {
  return name.replace(/-/g, "_");
}

/** Icon name for an upstream Material Symbols file stem. */
export function fromMaterialFileStem(stem: string): string {
  return stem.replace(/_/g, "-").toLowerCase();
}

/**
 * Icon name for a brand asset file name.
 *
 * Brand assets do not encode the fill axis in the file name at all — the filled
 * variant lives in `assets/brand/filled/<name>.svg` — so the stem is the name.
 */
export function brandIconName(fileName: string): string {
  return toKebab(stripSvgExtension(fileName));
}

export function isValidIconName(name: string): boolean {
  return VALID_NAME.test(name);
}

/** `add-shopping-cart` → `AddShoppingCart`. */
export function toPascalCase(name: string): string {
  return name
    .split("-")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Object-literal key for a registry entry. Bare identifiers are emitted
 * unquoted; kebab-case names (the common case) are double-quoted.
 */
export function toObjectKey(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : `"${name}"`;
}

/** Chunk id used to split the registry by first character (`a`…`z`, `0`). */
export function toChunkId(name: string): string {
  const head = name[0];
  return head !== undefined && /[a-z]/.test(head) ? head : "0";
}

export const CHUNK_IDS = [
  "0",
  ..."abcdefghijklmnopqrstuvwxyz".split(""),
] as const;

export type ChunkId = (typeof CHUNK_IDS)[number];

/**
 * Locale-independent comparison. `localeCompare` reorders hyphens and digits
 * per ICU rules, which would make regeneration machine-dependent; code-unit
 * order is what a byte diff needs.
 */
export function compareIconNames(a: string, b: string): number {
  const ca = toChunkId(a);
  const cb = toChunkId(b);
  if (ca !== cb) return CHUNK_IDS.indexOf(ca) - CHUNK_IDS.indexOf(cb);
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Sorts names the way the generator emits them: chunk first, then name. */
export function sortIconNames(names: ReadonlyArray<string>): Array<string> {
  return [...names].sort(compareIconNames);
}
