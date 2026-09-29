/**
 * SVG standards gate.
 *
 * Every asset that enters the pipeline — Material Symbols sync output or a
 * hand-dropped brand SVG — is checked against the icon contract before it can
 * produce generated code:
 *
 *   1. Single colour. Paint is `currentColor` or omitted; no gradients,
 *      patterns, masks, clip paths, filters, embedded rasters, or text.
 *   2. Fill geometry only. Strokes are rejected: icons render at 24dp from
 *      filled outlines with a 2px-equivalent visual weight, and stroke widths do
 *      not scale predictably between web and React Native rasterisation.
 *   3. Square viewBox. Non-square sources cannot be centred on the 24x24 grid
 *      without distortion.
 *
 * Violations are collected (not thrown) so a single `generate` run reports every
 * offending asset at once.
 */

import type { SvgDocument } from "./svg";
import { UNSUPPORTED_TAGS } from "./svg";

export interface ValidationIssue {
  readonly file: string;
  readonly message: string;
}

export interface ValidationResult {
  readonly ok: boolean;
  readonly issues: ReadonlyArray<ValidationIssue>;
}

/** Attributes that introduce colour or paint other than the inherited `currentColor`. */
const PAINT_ATTRIBUTES = [
  "fill",
  "stroke",
  "stop-color",
  "flood-color",
  "lighting-color",
  "color",
] as const;

/** Values that count as "inherit the theme colour". */
function isThemeColour(value: string | undefined): boolean {
  if (value === undefined) return true;
  const v = value.trim().toLowerCase();
  return v === "" || v === "currentcolor" || v === "none" || v === "inherit";
}

/** Attributes that reference another element (`url(#…)`), which we cannot inline. */
function hasUrlReference(value: string | undefined): boolean {
  return value?.includes("url(") ?? false;
}

export function validateSvgDocument(
  doc: SvgDocument,
  file: string,
): ValidationResult {
  const issues: Array<ValidationIssue> = [];
  const push = (message: string) => issues.push({ file, message });

  // --- root ---------------------------------------------------------------
  const viewBox = doc.rootAttrs.viewBox ?? doc.rootAttrs.viewbox;
  if (!viewBox) {
    push("missing viewBox — icons must declare an explicit square viewBox");
  } else {
    const parts = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
      push(`unparseable viewBox "${viewBox}"`);
    } else if (parts[2] !== parts[3]) {
      push(`viewBox "${viewBox}" is not square — icons render on a 24x24 grid`);
    }
  }

  if (!isThemeColour(doc.rootAttrs.fill)) {
    push(
      `root fill "${doc.rootAttrs.fill}" is not currentColor — icons inherit theme colour`,
    );
  }

  // --- elements -----------------------------------------------------------
  for (const el of doc.elements) {
    if (UNSUPPORTED_TAGS.has(el.tag)) {
      push(
        `<${el.tag}> is not supported — icons are flat single-colour path geometry`,
      );
      continue;
    }

    for (const attr of PAINT_ATTRIBUTES) {
      const value = el.attrs[attr];
      if (value !== undefined && !isThemeColour(value)) {
        push(
          `<${el.tag}> ${attr}="${value}" hardcodes colour — use currentColor`,
        );
      }
      if (hasUrlReference(value)) {
        push(
          `<${el.tag}> ${attr} references another element (${value}) — inline the geometry instead`,
        );
      }
    }

    const stroke = el.attrs.stroke;
    if (stroke !== undefined && !isThemeColour(stroke) && stroke !== "none") {
      push(`<${el.tag}> uses stroke="${stroke}" — icons are fill-only`);
    }
    if (
      el.attrs["stroke-width"] !== undefined &&
      stroke !== "none" &&
      stroke !== undefined
    ) {
      push(
        `<${el.tag}> uses stroke-width — outline the stroke into fill geometry before dropping it in`,
      );
    }

    for (const ref of ["clip-path", "mask", "filter"] as const) {
      if (hasUrlReference(el.attrs[ref])) {
        push(
          `<${el.tag}> ${ref}="${el.attrs[ref]}" cannot be flattened into a single path`,
        );
      }
    }

    if (el.attrs.opacity !== undefined && el.attrs.opacity !== "1") {
      push(
        `<${el.tag}> opacity="${el.attrs.opacity}" — bake transparency into the colour token instead`,
      );
    }
    if (
      el.attrs["fill-opacity"] !== undefined &&
      el.attrs["fill-opacity"] !== "1"
    ) {
      push(
        `<${el.tag}> fill-opacity="${el.attrs["fill-opacity"]}" — icons are single-colour and opaque`,
      );
    }
    if (el.attrs.transform !== undefined) {
      push(
        `<${el.tag}> transform="${el.attrs.transform}" — apply the transform in your editor first`,
      );
    }
  }

  return { ok: issues.length === 0, issues };
}
