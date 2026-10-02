#!/usr/bin/env node
// Post-build gate — a build that emits JavaScript but NO type declarations is
// not a successful build, and must never be allowed to look like one.
//
// Why this exists: tsup runs `--clean` first, so it wipes dist/, emits JS, and
// only then runs the DTS step. When DTS fails (e.g. TS2688 from an undeclared
// @types package), the JS it already wrote STAYS on disk. The build correctly
// exits non-zero, but dist/ is left in a half-built state that looks valid to a
// directory listing — and the next command fails with the confusing
// "Could not find a declaration file for module '@xoroh/kern'".
//
// publint does not catch this: it lints the manifest, and when the DTS step
// aborts, publint never runs.
//
// This asserts the property itself: every path a published manifest PROMISES in
// its `exports` map must exist on disk after the build.
//
// Exit 0 = every declared export exists.

import { access, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Discover manifests from the workspace globs rather than hardcoding them. */
async function discoverManifests() {
  const patterns = ["packages/*", "apps/*"];
  const found = [];
  for (const pattern of patterns) {
    const base = pattern.split("/")[0];
    let entries;
    try {
      entries = await readdir(resolve(ROOT, base), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const manifest = resolve(ROOT, base, entry.name, "package.json");
      try {
        await access(manifest);
        found.push(manifest);
      } catch {
        // not a package
      }
    }
  }
  return found.sort();
}

/** Collect every file path referenced by an exports condition tree. */
function collectPaths(node, out = []) {
  if (typeof node === "string") {
    // Wildcard subpaths ("./themes/*") resolve at runtime, not at build time.
    if (!node.includes("*")) out.push(node);
    return out;
  }
  if (node && typeof node === "object") {
    for (const value of Object.values(node)) collectPaths(value, out);
  }
  return out;
}

const manifests = await discoverManifests();
const failures = [];
let checked = 0;
let skipped = 0;

for (const manifestPath of manifests) {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.private === true) continue;

  const entries = Object.entries(manifest.exports ?? {});
  // No exports map means a bare main/types package; nothing to assert.
  if (entries.length === 0) {
    skipped += 1;
    continue;
  }

  const pkgDir = dirname(manifestPath);
  for (const [subpath, conditions] of entries) {
    for (const target of new Set(collectPaths(conditions))) {
      checked += 1;
      try {
        await access(resolve(pkgDir, target));
      } catch {
        failures.push(`${manifest.name}${subpath.slice(1)} -> ${target}`);
      }
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(
    `\ncheck-dist-exports: FAILED — ${failures.length} of ${checked} declared export target(s) do not exist.\n` +
      `A build that emits JavaScript but no type declarations is not a successful build.\n` +
      `This usually means a DTS step failed AFTER tsup --clean already emitted JS.\n` +
      `Re-run the build and read its FULL output — the real error is on stderr.\n\n`,
  );
  for (const failure of failures)
    process.stderr.write(`  ${failure}  (missing)\n`);
  process.stderr.write("\n");
  process.exit(1);
}

process.stdout.write(
  `check-dist-exports: ok — ${checked} declared export target(s) exist across ${manifests.length - skipped} publishable package(s)\n`,
);
