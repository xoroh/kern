/**
 * Builds the icon catalog from local assets.
 *
 * Two sources feed one catalog:
 *
 *   `assets/material/rounded/`  upstream Material Symbols Rounded, synced by
 *                               `tools/sync.ts` from a pinned npm tarball.
 *                               snake_case stems, `-fill` = FILL 1.
 *   `assets/brand/`             custom icons, hand-dropped.
 *                               kebab-case stems, filled variant in `filled/`.
 *
 * Each entry is normalised onto the 24x24 grid at build time, so the runtime
 * never touches a source viewBox and never scales anything.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { ICON_SPEC, PATHS, readIconSet, readSourceConfig, rel } from "./config";
import {
  brandIconName,
  isValidIconName,
  sortIconNames,
  splitMaterialStem,
  toMaterialFileStem,
} from "./naming";
import {
  concatPathData,
  parseViewBox,
  transformPathData,
  viewBoxToTransform,
} from "./path";
import { parseSvg, primitiveToPathData, readViewBox } from "./svg";
import type { ValidationIssue } from "./validate";
import { validateSvgDocument } from "./validate";

export type IconOrigin = "material" | "brand";

export interface CatalogEntry {
  /** Canonical kebab-case icon name. */
  readonly name: string;
  readonly origin: IconOrigin;
  /** FILL 0 path data, re-based onto `0 0 24 24`. */
  readonly outline: string;
  /** FILL 1 path data, re-based onto `0 0 24 24`. */
  readonly filled: string;
  /** True when no distinct FILL 1 asset exists and the filled state reuses the outline. */
  readonly filledIsOutline: boolean;
  /** `evenodd` when any source shape requested it, else omitted. */
  readonly fillRule?: "evenodd";
  /** Package-relative path of the FILL 0 asset, for diagnostics. */
  readonly sourceFile: string;
}

export interface Catalog {
  readonly entries: ReadonlyArray<CatalogEntry>;
  readonly byName: ReadonlyMap<string, CatalogEntry>;
  /**
   * Every upstream Material Symbols glyph stem in the synced cache
   * (snake_case), regardless of the allowlist — the full `MaterialSymbolsName`
   * contract.
   */
  readonly symbols: ReadonlyArray<string>;
  readonly issues: ReadonlyArray<ValidationIssue>;
  readonly warnings: ReadonlyArray<string>;
}

export interface BuildCatalogOptions {
  /** Ignore `config/kern-icon-set.txt` and include every synced Material icon. */
  readonly full?: boolean;
  /** Fail fast on the first validation issue instead of collecting all of them. */
  readonly strict?: boolean;
}

interface NormalizedShape {
  readonly d: string;
  readonly fillRule?: "evenodd";
}

function normalizeShapeFile(
  file: string,
  label: string,
): {
  shape: NormalizedShape | null;
  issues: ReadonlyArray<ValidationIssue>;
} {
  const source = readFileSync(file, "utf8");
  const doc = parseSvg(source);
  const result = validateSvgDocument(doc, label);
  if (!result.ok) return { shape: null, issues: result.issues };

  const box = parseViewBox(readViewBox(doc));
  if (!box) {
    return {
      shape: null,
      issues: [
        { file: label, message: "could not determine a source viewBox" },
      ],
    };
  }

  const parts: Array<string> = [];
  let fillRule: "evenodd" | undefined =
    doc.rootAttrs["fill-rule"] === "evenodd" ? "evenodd" : undefined;
  for (const el of doc.elements) {
    const d = primitiveToPathData(el);
    if (d.length > 0) parts.push(d);
    const rule = el.attrs["fill-rule"] ?? el.attrs["clip-rule"];
    if (rule === "evenodd") fillRule = "evenodd";
  }

  if (parts.length === 0) {
    return {
      shape: null,
      issues: [{ file: label, message: "no paintable geometry found" }],
    };
  }

  const transform = viewBoxToTransform(box, ICON_SPEC.viewBoxSize);
  const d = concatPathData(
    parts.map((p) =>
      transformPathData(p, { ...transform, precision: ICON_SPEC.precision }),
    ),
  );

  return { shape: { d, fillRule }, issues: [] };
}

function listSvgFiles(dir: string): Array<string> {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .sort();
}

interface AssetPair {
  outline?: string;
  filled?: string;
}

/**
 * Pairs FILL 0 and FILL 1 assets for one directory.
 *
 * `split` decides how a file name maps to `{ name, filled }`: Material Symbols
 * encode the fill axis as a `-fill` stem suffix, while brand assets keep the
 * filled variant in a sibling `filled/` directory (paired by the caller).
 */
function pairAssets(
  dir: string,
  files: ReadonlyArray<string>,
  split: (fileName: string) => { name: string; filled: boolean },
): Map<string, AssetPair> {
  const pairs = new Map<string, AssetPair>();
  for (const file of files) {
    const { name, filled } = split(file);
    if (!isValidIconName(name)) continue;
    const bucket = pairs.get(name) ?? {};
    if (filled) bucket.filled = path.join(dir, file);
    else bucket.outline = path.join(dir, file);
    pairs.set(name, bucket);
  }
  return pairs;
}

/**
 * Brand assets: `assets/brand/<name>.svg` is FILL 0 and
 * `assets/brand/filled/<name>.svg` is FILL 1. Keeping the fill axis in the
 * directory rather than the file name means a brand icon may legitimately be
 * called `color-fill` without the parser guessing wrong.
 */
function pairBrandAssets(): Map<string, AssetPair> {
  const outlineDir = PATHS.brandAssets;
  const filledDir = path.join(PATHS.brandAssets, "filled");
  const pairs = pairAssets(outlineDir, listSvgFiles(outlineDir), (f) => ({
    name: brandIconName(f),
    filled: false,
  }));

  for (const file of listSvgFiles(filledDir)) {
    const name = brandIconName(file);
    if (!isValidIconName(name)) continue;
    const bucket = pairs.get(name) ?? {};
    bucket.filled = path.join(filledDir, file);
    pairs.set(name, bucket);
  }

  return pairs;
}

export function buildCatalog(options: BuildCatalogOptions = {}): Catalog {
  const sourceConfig = readSourceConfig();
  const allowlist = options.full ? null : new Set(readIconSet());
  const issues: Array<ValidationIssue> = [];
  const warnings: Array<string> = [];
  const entries: Array<CatalogEntry> = [];

  const fail = (issue: ValidationIssue): never => {
    throw new Error(`[icons] ${issue.file}: ${issue.message}`);
  };

  const collect = (list: ReadonlyArray<ValidationIssue>) => {
    issues.push(...list);
    if (options.strict && list.length > 0)
      fail(list[0] ?? { file: "?", message: "unknown" });
  };

  // --- Material Symbols Rounded -------------------------------------------
  const materialPairs = pairAssets(
    PATHS.materialAssets,
    listSvgFiles(PATHS.materialAssets),
    splitMaterialStem,
  );

  if (materialPairs.size === 0) {
    warnings.push(
      `no Material Symbols found in ${rel(PATHS.materialAssets)} — run \`bun run sync\` first`,
    );
  }

  // The full upstream glyph contract, in canonical emission order.
  const symbols = sortIconNames([...materialPairs.keys()]).map(
    toMaterialFileStem,
  );

  for (const [name, files] of materialPairs) {
    if (allowlist && !allowlist.has(name)) continue;
    if (!files.outline) {
      collect([
        { file: name, message: "filled asset exists without an outline asset" },
      ]);
      continue;
    }
    const relOutline = rel(files.outline);

    const outline = normalizeShapeFile(files.outline, relOutline);
    collect(outline.issues);
    if (!outline.shape) continue;

    let filled = outline.shape;
    if (files.filled) {
      const filledResult = normalizeShapeFile(files.filled, rel(files.filled));
      collect(filledResult.issues);
      if (filledResult.shape) filled = filledResult.shape;
    }

    entries.push({
      name,
      origin: "material",
      outline: outline.shape.d,
      filled: filled.d,
      // Roughly a third of Material Symbols are identical in both FILL states
      // (a magnifier has no "filled" reading). Recording that lets the emitter
      // store the path once instead of twice.
      filledIsOutline: filled.d === outline.shape.d,
      fillRule: outline.shape.fillRule ?? filled.fillRule,
      sourceFile: relOutline,
    });
  }

  // --- Brand / custom icons ------------------------------------------------
  const brandPairs = pairBrandAssets();

  for (const [name, files] of brandPairs) {
    if (!files.outline) {
      collect([
        {
          file: `${name}.svg`,
          message:
            "brand icon has only a filled asset — add the outline variant",
        },
      ]);
      continue;
    }
    const relOutline = rel(files.outline);

    const outline = normalizeShapeFile(files.outline, relOutline);
    collect(outline.issues);
    if (!outline.shape) continue;

    let filled = outline.shape;
    if (files.filled) {
      const filledResult = normalizeShapeFile(files.filled, rel(files.filled));
      collect(filledResult.issues);
      if (filledResult.shape) {
        filled = filledResult.shape;
      } else {
        warnings.push(
          `brand icon "${name}" has an invalid filled asset — falling back to the outline`,
        );
      }
    } else {
      warnings.push(
        `brand icon "${name}" has no filled asset — the filled state reuses the outline`,
      );
    }

    entries.push({
      name,
      origin: "brand",
      outline: outline.shape.d,
      filled: filled.d,
      filledIsOutline: filled.d === outline.shape.d,
      fillRule: outline.shape.fillRule ?? filled.fillRule,
      sourceFile: relOutline,
    });
  }

  // --- Allowlist hygiene ---------------------------------------------------
  if (allowlist && materialPairs.size > 0) {
    for (const requested of allowlist) {
      if (!materialPairs.has(requested)) {
        const brandOnly = brandPairs.has(requested);
        if (!brandOnly) {
          warnings.push(
            `config/kern-icon-set.txt requests "${requested}" but it is not in the synced ${sourceConfig.style} set — remove it or re-sync`,
          );
        }
      }
    }
  }

  const sortedNames = sortIconNames(entries.map((e) => e.name));
  const byNameIndex = new Map(entries.map((e) => [e.name, e]));
  const ordered: Array<CatalogEntry> = [];
  for (const n of sortedNames) {
    const entry = byNameIndex.get(n);
    if (entry !== undefined) ordered.push(entry);
  }

  return {
    entries: ordered,
    byName: new Map(ordered.map((e) => [e.name, e])),
    symbols,
    issues,
    warnings,
  };
}

export function summarizeCatalog(catalog: Catalog): string {
  const material = catalog.entries.filter(
    (e) => e.origin === "material",
  ).length;
  const brand = catalog.entries.filter((e) => e.origin === "brand").length;
  return `${catalog.entries.length} icons (${material} material, ${brand} brand)`;
}
