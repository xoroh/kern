/**
 * Pipeline configuration and filesystem layout for the icon system.
 *
 * Everything the sync / generate / check scripts need to agree on lives here so
 * the three entry points cannot drift apart.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** The `@xoroh/kern-icons` package root. */
export const PACKAGE_ROOT = path.resolve(here, "..", "..");
/** Repository root. */
export const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");

export const PATHS = {
  config: path.join(PACKAGE_ROOT, "config"),
  sourceConfig: path.join(PACKAGE_ROOT, "config", "source.json"),
  iconSet: path.join(PACKAGE_ROOT, "config", "kern-icon-set.txt"),
  assets: path.join(PACKAGE_ROOT, "assets"),
  materialAssets: path.join(PACKAGE_ROOT, "assets", "material", "rounded"),
  brandAssets: path.join(PACKAGE_ROOT, "assets", "brand"),
  setsAssets: path.join(PACKAGE_ROOT, "assets", "sets"),
  cache: path.join(PACKAGE_ROOT, "assets", "material", ".cache"),

  src: path.join(PACKAGE_ROOT, "src"),
  tsSets: path.join(PACKAGE_ROOT, "src", "sets"),
  tsGenerated: path.join(PACKAGE_ROOT, "src", "sets", "material"),
  tsShapes: path.join(PACKAGE_ROOT, "src", "sets", "material", "shapes"),
} as const;

/** Package-relative path, for log output that is stable across machines. */
export function rel(target: string): string {
  return path.relative(PACKAGE_ROOT, target);
}

/** The icon contract. The canonical grid every generated shape lives on. */
export const ICON_SPEC = {
  /** Canonical grid. Every generated shape is re-based onto `0 0 24 24`. */
  viewBoxSize: 24,
  /**
   * Decimal places kept when re-basing path coordinates. 3 decimals on a 24
   * grid is 1/24000 of the icon — far below the sub-pixel threshold at any
   * render size — while keeping the committed registry compact.
   */
  precision: 3,
  /**
   * Material Symbols weight axis value that ships by default. Weight 400 on the
   * 960 grid renders as a 2px-equivalent stroke at 24dp, which is the icon
   * baseline. Other weights can be synced with `WEIGHT=<n> bun run sync`.
   */
  defaultWeight: 400,
  /** Optical size the upstream SVGs are drawn for. */
  opticalSize: 48,
} as const;

export interface SourceConfig {
  readonly package: string;
  readonly version: string;
  readonly style: string;
  readonly weight: number;
  readonly license: string;
  readonly licenseUrl: string;
  readonly sourceGrid: number;
  readonly sourceViewBox: string;
  readonly filledSuffix: string;
  readonly homepage: string;
  readonly upstream: string;
}

export function readSourceConfig(): SourceConfig {
  return JSON.parse(readFileSync(PATHS.sourceConfig, "utf8")) as SourceConfig;
}

/**
 * The curated icon set — the Material Symbols names that ship with committed
 * shape data. One kebab-case name per line; `#` starts a comment.
 *
 * Keeping this list deliberate is what keeps the generated registry (and every
 * bundle that renders a dynamic `<Icon name={…} />`) small. Anything in the
 * upstream catalog can be added here; `FULL=true` generates the entire synced
 * catalog locally without committing it.
 */
export function readIconSet(): Array<string> {
  if (!existsSync(PATHS.iconSet)) return [];
  return readFileSync(PATHS.iconSet, "utf8")
    .split("\n")
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter((line) => line.length > 0);
}
