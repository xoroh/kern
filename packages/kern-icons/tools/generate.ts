/**
 * Generates icon code from local assets.
 *
 *   bun run generate                 # curated set
 *   FULL=true   bun run generate     # every synced Material icon
 *   STRICT=true bun run generate     # fail on the first violation
 *
 * Output is deterministic, so running this twice in a row produces no diff.
 * `tools/check.ts` relies on that to catch stale committed codegen.
 */

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { buildCatalog, summarizeCatalog } from "./lib/catalog";
import { PACKAGE_ROOT, PATHS, readSourceConfig, rel } from "./lib/config";
import { emitAll } from "./lib/emit";

function envFlag(name: string): boolean {
  const v = process.env[name];
  return v === "true" || v === "1";
}

function log(message: string): void {
  process.stdout.write(`[icons] ${message}\n`);
}

/**
 * Writes the emitted map to disk and removes stale generated files.
 *
 * Stale files matter: a chunk that loses its last icon must disappear, or the
 * registry would re-export a module that no longer exists.
 */
function writeGenerated(files: ReadonlyMap<string, string>): void {
  for (const [rel, contents] of files) {
    const target = path.join(PACKAGE_ROOT, rel);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(
      target,
      contents.endsWith("\n") ? contents : `${contents}\n`,
      "utf8",
    );
  }

  pruneDir(PATHS.tsSets, files);
}

function pruneDir(dir: string, files: ReadonlyMap<string, string>): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pruneDir(full, files);
      continue;
    }
    if (!entry.name.endsWith(".ts")) continue;
    const key = path.relative(PACKAGE_ROOT, full).split(path.sep).join("/");
    if (!files.has(key)) rmSync(full, { force: true });
  }
}

function main(): void {
  const full = envFlag("FULL");
  const strict = envFlag("STRICT");
  const source = readSourceConfig();

  log(`building catalog (full=${full}, strict=${strict})`);
  const catalog = buildCatalog({ full, strict });

  if (catalog.entries.length === 0) {
    process.stderr.write(
      "[icons] catalog is empty. Sync the upstream assets first:\n  bun run sync\n",
    );
    process.exitCode = 1;
    return;
  }

  for (const warning of catalog.warnings) {
    process.stderr.write(`[icons] warn: ${warning}\n`);
  }

  if (catalog.issues.length > 0) {
    for (const issue of catalog.issues) {
      process.stderr.write(`[icons] error: ${issue.file}: ${issue.message}\n`);
    }
    process.stderr.write(
      `\n[icons] ${catalog.issues.length} asset(s) violate the SVG standards.\n` +
        "Single-colour fill geometry on a square viewBox; see tools/lib/validate.ts.\n",
    );
    process.exitCode = 1;
    return;
  }

  const files = emitAll(catalog, { weights: [source.weight] });
  writeGenerated(files);

  log(`${summarizeCatalog(catalog)} → weight ${source.weight}`);
  log(`  ${catalog.symbols.length} upstream glyph names`);
  log(`  ${files.size} generated files under ${rel(PATHS.tsSets)}`);
}

main();
