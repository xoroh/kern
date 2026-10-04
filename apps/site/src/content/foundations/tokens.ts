/**
 * Foundations token accessors — shared prelude for the per-topic modules.
 *
 * Source of truth:
 *   packages/kern-tokens/src/tokens.json      — base, elevation, motion,
 *                                               shape, spacing, spectrum,
 *                                               states, typography
 *   packages/kern-tokens/src/themes/kern.json — the 58 colour roles per scheme
 *
 * NOTE (flagged in .team/reports/site-se-foundations.md): the rebuild dispatch
 * named `packages/kern-theme/src/tokens.json` as the source. That package does
 * not exist — `packages/kern-tokens` is the real one, measured from the tree.
 *
 * MEASURED FIXES (post-reboot re-read, node script against the JSON sources):
 *   - `typography` is structured as `scale.*` + `scaleEmphasized.*` + `roles.*`
 *     + `family`/`fontFaces` — enumerating its top-level keys produced 6 empty
 *     "styles". TYPE_STYLES now walks the two real scales (15 + 15 = 30).
 *   - `$comment` keys are PROSE, not tokens; `group()` drops them so a comment
 *     can never render as a value row (Elevation/States/Motion showed one).
 */

import kernTheme from "@xoroh/kern-tokens/themes/kern.json";
import tokensJson from "@xoroh/kern-tokens/tokens.json";

export type Json = Record<string, unknown>;

export const tokens = tokensJson as Json;
export const theme = kernTheme as Json;

/** Flatten a nested token object into dotted keys with scalar leaves. */
export function flatten(
  node: unknown,
  prefix = "",
  out: Record<string, unknown> = {},
) {
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Json)) {
      // `$comment` is documentation riding along with the tokens, not a token.
      if (k === "$comment") continue;
      if (v && typeof v === "object") flatten(v, `${prefix}${k}.`, out);
      else out[`${prefix}${k}`] = v;
    }
  }
  return out;
}

export type Leaf = { key: string; value: unknown };

export function group(name: string): Leaf[] {
  const flat = flatten(tokens[name] ?? {});
  return Object.entries(flat).map(([key, value]) => ({ key, value }));
}

/** The direct children of a token group, as `{ key, node }` pairs. */
export function subgroups(name: string): { key: string; node: Json }[] {
  const node = (tokens[name] ?? {}) as Json;
  return Object.entries(node)
    .filter(([k, v]) => k !== "$comment" && v && typeof v === "object")
    .map(([key, v]) => ({ key, node: v as Json }));
}
