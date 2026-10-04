/**
 * Foundation typography — the type styles, keyed by role. The Foundation Type
 * page renders each one with its OWN tokens — the specimen IS the token, so a
 * wrong token is visible rather than merely wrong.
 *
 * The token package keeps two scales: `typography.scale` (the base 15) and
 * `typography.scaleEmphasized` (the emphasized 15). 30 styles total, which is
 * what the page claims and what is counted below.
 */
import { type Json, tokens } from "./tokens";

export type TypeStyle = {
  /** `display-large` or `emphasized.display-large`. */
  role: string;
  emphasized: boolean;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
};

const typo = (tokens.typography ?? {}) as Json;
const family = String(typo.webFamily ?? typo.family ?? "");

function stylesFrom(scaleNode: unknown, emphasized: boolean): TypeStyle[] {
  const scale = (scaleNode ?? {}) as Json;
  return Object.keys(scale)
    .sort()
    .map((name) => {
      const r = (scale[name] ?? {}) as Json;
      return {
        role: emphasized ? `emphasized.${name}` : name,
        emphasized,
        fontFamily: family,
        fontSize: String(r.size ?? ""),
        fontWeight: String(r.weight ?? ""),
        lineHeight: String(r.lineHeight ?? ""),
        letterSpacing: String(r.tracking ?? ""),
      };
    });
}

export const TYPE_STYLES: TypeStyle[] = [
  ...stylesFrom(typo.scale, false),
  ...stylesFrom(typo.scaleEmphasized, true),
];

export const TYPE_STYLE_COUNT = TYPE_STYLES.length;
