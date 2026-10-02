#!/usr/bin/env node
/**
 * check:pack -- every literal file a package DECLARES in `files` must exist.
 *
 * WHY
 *
 * `kern-tokens` and `kern-native` both listed `"README.md"` in `files` and
 * shipped no README. `kern-primitives` declared a README and a LICENSE that did
 * not exist. `npm pack` does not warn: it produces a tarball that omits them, so
 * the published package CLAIMS a licence and a README and contains neither. A
 * first-class library with no licence is a licensing problem, not a cosmetic one.
 *
 * This is the same class as every other defect this quarter -- metadata that
 * looks true and is not -- and it is invisible to every existing gate because
 * they all read source while the tarball is the artifact a consumer receives.
 *
 * WHAT IS AND IS NOT CHECKED HERE
 *
 * LITERAL entries (`LICENSE`, `README.md`) must exist. That is the defect class
 * and it is checkable without invoking npm.
 *
 * GLOB and DIRECTORY entries (`dist`, `src/themes/*.json`) are resolved by npm,
 * and this gate does NOT pretend to verify them -- a gate that claims coverage it
 * does not have is how `npm pack` became the thing we trusted. For those the
 * package's own `build` is the evidence, and CI runs it.
 *
 * The authoritative end-to-end check is `npm pack --dry-run` with its output
 * READ. That is run in CI on the built packages; this gate is the cheap static
 * pre-flight that names the exact file, because `npm pack` names only what it
 * omitted, not what you meant.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGES = join(ROOT, "packages");

const violations = [];
let checked = 0;
const missing = [];

for (const name of readdirSync(PACKAGES).sort()) {
  const dir = join(PACKAGES, name);
  if (!statSync(dir).isDirectory()) continue;
  const pkgJson = join(dir, "package.json");
  if (!existsSync(pkgJson)) continue;

  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgJson, "utf8"));
  } catch (err) {
    violations.push(
      `packages/${name}: package.json is not valid JSON: ${err.message}`,
    );
    continue;
  }

  const files = pkg.files;
  if (!Array.isArray(files)) continue;

  for (const entry of files) {
    if (typeof entry !== "string") continue;
    // A glob is npm's job. A literal is ours.
    if (entry.includes("*") || entry.includes("?")) continue;
    checked += 1;
    if (!existsSync(join(dir, entry))) {
      missing.push(`packages/${name}/${entry}`);
      violations.push(
        `packages/${name}: "files" declares "${entry}" but it DOES NOT EXIST, so ` +
          `npm pack omits it silently. The published package will claim a ` +
          `${entry === "LICENSE" ? "licence" : "file"} it does not contain.`,
      );
    }
  }

  // A published package must carry its licence terms one way or another.
  const publishes = Boolean(files) && pkg.private !== true;
  if (
    publishes &&
    !existsSync(join(dir, "LICENSE")) &&
    !existsSync(join(ROOT, "LICENSE"))
  ) {
    violations.push(
      `packages/${name}: publishable, with no LICENSE in the package and none at the repo root.`,
    );
  }
}

if (violations.length) {
  console.error("pack manifest contract FAILED:\n");
  for (const v of violations) console.error(`  - ${v}`);
  console.error(`\n  ${missing.length} declared-but-absent file(s)`);
  process.exit(1);
}

console.log(
  `pack manifest contract passes: ${checked} declared file entr(ies) across ` +
    `the workspace all exist. Nothing ships claiming a file it omits.`,
);
