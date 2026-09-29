/**
 * Runtime name resolution — contract names to registered registry names.
 *
 * `Icon` renderers accept the full contract (`MaterialSymbolsName` snake_case
 * glyphs, `IconSemantic` meaning aliases, kebab-case names, and `set:name`
 * qualifications) and normalise to a `{ set, name }` pair here. Call sites stay
 * compile-time checked via the `IconNameInput` union; a contract name with no
 * committed shape data resolves to `null` and the renderers degrade to nothing
 * with a dev warning naming the fix (add it to `config/kern-icon-set.txt` and
 * regenerate).
 *
 * Resolution order: `set:name` → that set · semantic alias → its pinned
 * default-set target · unqualified name → the requested or default set · miss →
 * `null`.
 */

import { DEFAULT_ICON_SET, getIconSet } from "./registry";
import { SEMANTIC_ICONS } from "./semantic";
import type { IconNameInput, ResolvedIconName } from "./types";

const SEMANTIC_MAP: Readonly<Record<string, string>> = SEMANTIC_ICONS;

/** `add_shopping_cart` → `add-shopping-cart`. */
function toCanonical(name: string): string {
  return name.replace(/_/g, "-").toLowerCase();
}

function qualify(set: string, name: string): ResolvedIconName | null {
  const canonical = toCanonical(name);
  const iconSet = getIconSet(set);
  if (!iconSet?.names.has(canonical)) return null;
  return { set, name: canonical };
}

/**
 * Resolves anything an `Icon` accepts to a `{ set, name }` pair that exists in
 * the registry, or `null` when nothing matches.
 *
 * `set` overrides the set for **unqualified** names only — `set:name` and
 * qualified alias targets carry their own set, because the point of a semantic
 * alias is that `back` is one glyph on every surface.
 */
export function resolveIconName(
  input: IconNameInput | (string & {}),
  set?: string,
): ResolvedIconName | null {
  if (typeof input !== "string" || input.length === 0) return null;
  const colon = input.indexOf(":");
  if (colon !== -1) {
    return qualify(input.slice(0, colon), input.slice(colon + 1));
  }
  const alias = SEMANTIC_MAP[input];
  if (alias !== undefined) {
    const target = alias.indexOf(":");
    return qualify(alias.slice(0, target), alias.slice(target + 1));
  }
  return qualify(set ?? DEFAULT_ICON_SET, input);
}
