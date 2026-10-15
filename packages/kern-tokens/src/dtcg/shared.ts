/**
 * Shared DTCG 2025.10 helpers (KERN-019/020).
 *
 * Reference: [DTCG Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/),
 * a stable Final Community Group Report — NOT a W3C Recommendation. This code
 * follows its normative clauses (group `$type` inheritance, `$extends` deep
 * merge, local RFC6901 `$ref` pointers), not inconsistent nonnormative
 * examples. No official released JSON Schema is assumed from the spec's
 * exploratory editor note; `validate.ts` is the implementation's own schema.
 */

export const DTCG_SPEC_VERSION = "2025.10" as const;
/** Vendor namespace for Kern provenance that has no standard encoding. */
export const KERN_EXTENSION = "org.xoroh.kern" as const;

function fail(what: string): never {
  throw new Error(`DTCG interchange: ${what}`);
}

/** `#rrggbb` → `[r, g, b]` in 0..1, six decimals. Deterministic, documented. */
export function hexToComponents(hex: string): [number, number, number] {
  const m = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) fail(`"${hex}" is not a six-digit sRGB hex`);
  const round = (v: number) => Math.round(v * 1e6) / 1e6;
  return [
    round(parseInt(m[1], 16) / 255),
    round(parseInt(m[2], 16) / 255),
    round(parseInt(m[3], 16) / 255),
  ];
}

export function componentsToHex(components: [number, number, number]): string {
  const byte = (v: number) => {
    if (typeof v !== "number" || v < 0 || v > 1) {
      fail(`sRGB component ${v} is outside 0..1`);
    }
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${byte(components[0])}${byte(components[1])}${byte(components[2])}`;
}

/** `"150ms"` / `"0.2s"` → a DTCG duration string (validated, passed through). */
export function asDuration(value: string): string {
  if (!/^\d+(\.\d+)?(ms|s)$/.test(value.trim())) {
    fail(`"${value}" is not a duration`);
  }
  return value.trim();
}

/** `"8px"` → `{ value: 8, unit: "px" }`. Percentages are never guessed. */
export function asDimension(value: string): { value: number; unit: string } {
  const m = /^(-?\d+(\.\d+)?)(px|rem|ms|s)?$/.exec(value.trim());
  if (!m) fail(`"${value}" is not a dimension`);
  return { value: Number(m[1]), unit: m[3] ?? "px" };
}

/** `"cubic-bezier(0.2, 0, 0, 1)"` → `[0.2, 0, 0, 1]`. */
export function asCubicBezier(value: string): [number, number, number, number] {
  const m = /^cubic-bezier\(([^)]+)\)$/.exec(value.trim());
  if (!m) fail(`"${value}" is not a cubic-bezier`);
  const parts = m[1].split(",").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    fail(`"${value}" is not a cubic-bezier`);
  }
  return parts as [number, number, number, number];
}

/** `"8%"` → `0.08`. State opacities are the only percent-to-number path. */
export function asOpacityNumber(value: string): number {
  const m = /^(\d+(\.\d+)?)%$/.exec(value.trim());
  if (!m) fail(`"${value}" is not a percent opacity`);
  return Math.round((Number(m[1]) / 100) * 1e6) / 1e6;
}

export type ParsedShadow = {
  offsetX: { value: number; unit: string };
  offsetY: { value: number; unit: string };
  blur: { value: number; unit: string };
  spread: { value: number; unit: string };
  color: {
    colorSpace: "srgb";
    components: [number, number, number];
    alpha: number;
  };
};

/**
 * Parse the FIRST layer of a CSS box-shadow into a DTCG `shadow` composite.
 * Multi-layer shadows collapse to their first layer in the standard
 * projection; the FULL string is always preserved alongside in
 * `$extensions[org.xoroh.kern].css`, so the projection is lossy but never
 * lossy-silent. `"none"` returns null (level 0 has no shadow to project).
 */
export function parseFirstShadow(shadow: string): ParsedShadow | null {
  if (shadow.trim() === "none") return null;
  const first = shadow.split(/,(?![^(]*\))/)[0].trim();
  const colorMatch =
    /(rgba?\([^)]+\)|#[0-9a-f]{3,8})\s*$/.exec(first) ??
    /^((?:rgba?\([^)]+\)|#[0-9a-f]{3,8}))\s*/.exec(first);
  if (!colorMatch) fail(`cannot parse shadow color in "${shadow}"`);
  const colorText = colorMatch[1];
  const lengths = first
    .replace(colorText, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (lengths.length < 2) fail(`cannot parse shadow offsets in "${shadow}"`);
  const dim = (s: string) => asDimension(s.endsWith("px") ? s : `${s}px`);
  let alpha = 1;
  let hex = colorText;
  const rgba =
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(
      colorText,
    );
  if (rgba) {
    const toHex = (v: string) => Number(v).toString(16).padStart(2, "0");
    hex = `#${toHex(rgba[1])}${toHex(rgba[2])}${toHex(rgba[3])}`;
    if (rgba[4] !== undefined) alpha = Number(rgba[4]);
  }
  return {
    offsetX: dim(lengths[0]),
    offsetY: dim(lengths[1]),
    blur: dim(lengths[2] ?? "0px"),
    spread: dim(lengths[3] ?? "0px"),
    color: { colorSpace: "srgb", components: hexToComponents(hex), alpha },
  };
}

/** Deterministic JSON: sorted keys, 2-space. Byte-identical reruns. */
export function stableStringify(value: unknown): string {
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = sortKeys((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}
