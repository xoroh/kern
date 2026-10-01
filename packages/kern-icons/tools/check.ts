/**
 * Validates the icon system without writing anything.
 *
 *   bun run check
 *
 * Four legs, all non-mutating:
 *
 *   1. SVG standards gate over every asset (single-colour fill geometry,
 *      square viewBox).
 *   2. 24-grid bounds — every normalized path re-parses and stays on the grid.
 *   3. Platform boundary — the web entry never imports `react-native*`, the
 *      native entry never imports `react-dom`.
 *   4. Regen freshness — a fresh in-memory emit must byte-match what is
 *      committed under `src/sets/**`. (Commit coverage is CI's job; this leg
 *      only proves the tree is not stale.)
 *   5. Name reachability — every curated name must be reachable from a real
 *      consumer, and every name a consumer references must be curated. Without
 *      this leg the other four certify assets nothing renders: the P2 audit
 *      (2026-10-01) measured 1340 curated icons against 43 consumed.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildCatalog } from "./lib/catalog";
import {
  ICON_SPEC,
  PACKAGE_ROOT,
  PATHS,
  readIconSet,
  readSourceConfig,
  rel,
} from "./lib/config";
import { emitAll } from "./lib/emit";
import { isValidIconName } from "./lib/naming";
import { inspectPathData, pathBounds } from "./lib/path";

function log(message: string): void {
  process.stdout.write(`[icons] ${message}\n`);
}

function fail(message: string): never {
  process.stderr.write(`[icons] FAIL: ${message}\n`);
  process.exit(1);
}

/**
 * Collects bare and scoped module specifiers from every `import`/`export …
 * from` line. Deliberately regex-level: this is a boundary guard, not a parser.
 */
function importedModules(file: string): Array<string> {
  const source = readFileSync(file, "utf8");
  const specifiers: Array<string> = [];
  const re = /\bfrom\s+["']([^"']+)["']/g;
  let match = re.exec(source);
  while (match !== null) {
    const spec = match[1];
    match = re.exec(source);
    if (spec !== undefined) specifiers.push(spec);
  }
  const side = /\bimport\s+["']([^"']+)["']/g;
  let sideMatch = side.exec(source);
  while (sideMatch !== null) {
    const spec = sideMatch[1];
    sideMatch = side.exec(source);
    if (spec !== undefined) specifiers.push(spec);
  }
  return specifiers;
}

function listSources(dir: string): Array<string> {
  const out: Array<string> = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listSources(full));
      continue;
    }
    if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function isNative(file: string): boolean {
  return path.basename(file).includes(".native.");
}

function matchesPkg(spec: string, name: string): boolean {
  return spec === name || spec.startsWith(`${name}/`);
}

/**
 * Platform packages must stay disjoint: the web renderer may never reach a
 * native module, and the native renderer may never reach a DOM package. Both
 * render from the shared core alone. Checked from the sources rather than by
 * convention so a stray import fails the build.
 */
function checkPlatformBoundary(): void {
  const sources = listSources(PATHS.src);
  for (const file of sources) {
    const specifiers = importedModules(file);
    const label = rel(file);
    for (const spec of specifiers) {
      if (!isNative(file)) {
        if (matchesPkg(spec, "react-native") || matchesPkg(spec, "expo")) {
          fail(`${label} is a web module but imports "${spec}"`);
        }
      } else if (matchesPkg(spec, "react-dom") || matchesPkg(spec, "next")) {
        fail(`${label} is a native module but imports "${spec}"`);
      }
    }
  }
  log(`platform boundary ok — ${sources.length} source modules`);
}

/**
 * Compares a fresh in-memory emit against the tree. Nothing is written: the
 * point is to catch stale codegen without a regenerate-then-revert dance.
 */
function checkFreshness(): void {
  const source = readSourceConfig();
  const catalog = buildCatalog({ strict: false });
  const files = emitAll(catalog, { weights: [source.weight] });

  const stale: Array<string> = [];
  for (const [rel, contents] of files) {
    const target = path.join(PACKAGE_ROOT, rel);
    let onDisk: string | null = null;
    try {
      onDisk = readFileSync(target, "utf8");
    } catch {
      onDisk = null;
    }
    const expected = contents.endsWith("\n") ? contents : `${contents}\n`;
    if (onDisk !== expected) stale.push(rel);
  }

  // Generated files on disk that a fresh emit no longer produces.
  const extras: Array<string> = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".ts")) continue;
      const key = path.relative(PACKAGE_ROOT, full).split(path.sep).join("/");
      if (!files.has(key)) extras.push(key);
    }
  };
  if (statSync(PATHS.tsSets, { throwIfNoEntry: false })) walk(PATHS.tsSets);

  if (stale.length > 0 || extras.length > 0) {
    for (const s of stale) process.stderr.write(`[icons] stale: ${s}\n`);
    for (const x of extras) process.stderr.write(`[icons] extra: ${x}\n`);
    fail(
      `${stale.length} stale and ${extras.length} extra generated file(s) — run \`bun run generate\``,
    );
  }
  log(`regen freshness ok — ${files.size} generated files byte-match`);
}

/**
 * Collects the icon names the repo actually references, from the two places a
 * consumer can name a glyph: the semantic alias table (a decision surface) and
 * `<Icon name="…">` call sites (a usage surface).
 *
 * Returns `referenced` (glyph names) plus `unknown` (names a consumer asks for
 * that the curated set does not contain). `unknown` is the load-bearing half —
 * it is what catches a hand-inlined glyph drifting off the catalogue, which is
 * how `pencil` (not a Material name; the real ones are `edit*`) got into a test.
 */
function collectReferencedNames(allowlist: ReadonlySet<string>): {
  referenced: Set<string>;
  unknown: Array<{ name: string; where: string }>;
} {
  const repoRoot = path.resolve(PACKAGE_ROOT, "..", "..");
  const referenced = new Set<string>();
  const unknown: Array<{ name: string; where: string }> = [];

  // A `<Icon name>` may be EITHER a curated glyph name OR a semantic alias —
  // `resolveIconName` (core/naming.ts) tries `set:name`, then the alias table,
  // then the bare name. So `name="attach"` is valid even though the glyph is
  // `attach-file`. Checking aliases against the glyph allow-list would fail
  // correct code, which is how this leg was wrong on its first run.
  const aliasToGlyph = new Map<string, string>();
  const semantic = path.join(PACKAGE_ROOT, "src/core/semantic.ts");
  const semanticSource = readFileSync(semantic, "utf8");
  for (const [, alias, glyph] of semanticSource.matchAll(
    /(\w+):\s*"material:([a-z0-9_-]+)"/g,
  )) {
    aliasToGlyph.set(alias, glyph);
  }

  const record = (raw: string | undefined, where: string): void => {
    if (raw === undefined) return;
    const name = raw.trim();
    if (name === "" || !/^[a-z0-9][a-z0-9_-]*$/.test(name)) return;
    const glyph = aliasToGlyph.get(name) ?? name;
    if (allowlist.has(glyph)) {
      referenced.add(glyph);
    } else {
      unknown.push({ name, where });
    }
  };

  // (a) the semantic alias table — every alias target must be a curated glyph.
  for (const glyph of aliasToGlyph.values()) record(glyph, rel(semantic));

  // (b) `<Icon name="glyph">` / `name={cond ? "a" : "b"}` across the workspace.
  const walk = (dir: string): void => {
    let entries: Array<{ name: string; isDirectory(): boolean }>;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.tsx?$/.test(entry.name)) continue;
      // This file documents the very syntax it scans for, so its own doc
      // comments would otherwise register phantom references.
      if (full === fileURLToPath(import.meta.url)) continue;
      const source = readFileSync(full, "utf8");
      const where = path.relative(repoRoot, full);
      // Only `<Icon …>` call sites — a bare `name="…"` is far too ambiguous
      // (HTML form fields use it), which is exactly how `email` and `viewport`
      // were false positives in the P2 audit.
      for (const call of source.matchAll(/<Icon\b[^>]*?>/g)) {
        for (const [, literal] of call[0].matchAll(
          /name=\{?"([a-z0-9_-]+)"?/g,
        )) {
          record(literal, where);
        }
        for (const ternary of call[0].matchAll(
          /name=\{[^}]*?\?\s*"([a-z0-9_-]+)"\s*:\s*"([a-z0-9_-]+)"/g,
        )) {
          record(ternary[1], where);
          record(ternary[2], where);
        }
      }
    }
  };
  walk(path.join(repoRoot, "apps"));
  walk(path.join(repoRoot, "packages"));

  return { referenced, unknown };
}

function main(): void {
  const catalog = buildCatalog({ strict: false });

  // --- 1. SVG standards gate ----------------------------------------------
  if (catalog.issues.length > 0) {
    for (const issue of catalog.issues) {
      process.stderr.write(`[icons] ${issue.file}: ${issue.message}\n`);
    }
    fail(`${catalog.issues.length} asset(s) violate the SVG standards`);
  }
  log("svg standards ok");

  if (catalog.entries.length === 0) {
    fail("catalog is empty — run `bun run sync` first");
  }

  // Names must be canonical kebab-case and unique.
  const seen = new Set<string>();
  for (const entry of catalog.entries) {
    if (!isValidIconName(entry.name)) {
      fail(`"${entry.name}" is not a valid icon name (kebab-case, ASCII)`);
    }
    if (seen.has(entry.name)) fail(`duplicate icon name "${entry.name}"`);
    seen.add(entry.name);
  }

  // --- 2. 24-grid bounds ---------------------------------------------------
  // `pathBounds` resolves relative commands against the running pen position,
  // so this measures where the artwork actually goes rather than how large an
  // individual delta happens to be.
  const grid = ICON_SPEC.viewBoxSize;
  // Upstream Material Symbols lets a handful of glyphs bleed a hair past the
  // nominal box (two of 1330 land at ~24.03). Tolerate a rounding-sized margin;
  // anything larger means the viewBox transform is wrong.
  const tolerance = 0.25;
  for (const entry of catalog.entries) {
    for (const [label, d] of [
      ["outline", entry.outline],
      ["filled", entry.filled],
    ] as const) {
      const problem = inspectPathData(d);
      if (problem) fail(`"${entry.name}" ${label} path data — ${problem}`);

      const box = pathBounds(d);
      if (
        box.minX < -tolerance ||
        box.minY < -tolerance ||
        box.maxX > grid + tolerance ||
        box.maxY > grid + tolerance
      ) {
        fail(
          `"${entry.name}" ${label} geometry leaves the ${grid}x${grid} grid: ` +
            `[${box.minX}, ${box.minY}] → [${box.maxX}, ${box.maxY}]`,
        );
      }
    }
  }
  log(`24-grid bounds ok — ${catalog.entries.length} icons`);

  // Every curated name must have resolved to an asset.
  const allowlist = readIconSet();
  const brandNames = new Set(
    catalog.entries.filter((e) => e.origin === "brand").map((e) => e.name),
  );
  const missing = allowlist.filter((n) => !seen.has(n) && !brandNames.has(n));
  if (missing.length > 0) {
    fail(
      `${missing.length} name(s) in config/kern-icon-set.txt have no asset: ` +
        `${missing.slice(0, 12).join(", ")}${missing.length > 12 ? ", …" : ""}`,
    );
  }

  // --- 3. Platform boundary ------------------------------------------------
  checkPlatformBoundary();

  // --- 4. Regen freshness --------------------------------------------------
  checkFreshness();

  // --- 5. Name reachability ------------------------------------------------
  // The other four legs validate the set against the catalogue. This one is the
  // only leg that looks at CONSUMERS, and it is what stops "1340 icons ok" from
  // reading as coverage when nothing references them. A reference the set does
  // not contain is a hard failure (the catalogue drifted under a consumer); an
  // unreferenced curated name is reported, not failed — the set is deliberately
  // a catalogue, and pruning it is a design decision, not a lint rule.
  {
    const { referenced, unknown } = collectReferencedNames(new Set(allowlist));
    if (unknown.length > 0) {
      for (const { name, where } of unknown) {
        process.stderr.write(
          `[icons] ${where}: references "${name}", which is not in the curated set\n`,
        );
      }
      fail(
        `${unknown.length} referenced icon name(s) are not in ` +
          `config/kern-icon-set.txt — add the name or fix the reference`,
      );
    }
    const unconsumed = allowlist.length - referenced.size;
    log(
      `name reachability ok — ${referenced.size}/${allowlist.length} curated names ` +
        `reachable from a consumer`,
    );
    if (unconsumed > 0) {
      log(
        `     ${unconsumed} curated name(s) have no consumer; the set is a ` +
          `catalogue, so this is reported, not failed`,
      );
    }
  }

  const material = catalog.entries.filter(
    (e) => e.origin === "material",
  ).length;
  const brand = catalog.entries.filter((e) => e.origin === "brand").length;
  const deduped = catalog.entries.filter((e) => e.filledIsOutline).length;

  log(
    `ok — ${catalog.entries.length} icons (${material} material, ${brand} brand)`,
  );
  log(
    `     ${catalog.entries.length - deduped} with distinct FILL 0/1 geometry, ` +
      `${deduped} where the filled state reuses the outline`,
  );
  if (catalog.warnings.length > 0) {
    log(`     ${catalog.warnings.length} warning(s)`);
    for (const w of catalog.warnings) process.stdout.write(`       · ${w}\n`);
  }
}

main();
