#!/usr/bin/env node
/**
 * check:primitives — the post-cutover primitives boundary.
 *
 * History: this gate once walked the transitive import graph of
 * the deleted kernel package to prove the behavior kernel reached no
 * platform. That package was deleted in the kern→Axis cutover
 * (migration roadmap Phase 4); the graph it walked is gone with it.
 *
 * What remains is the negative property, and it is enforced here:
 *
 * 1. The legacy `libs/` kernel package is frozen pending the owner Axis
 *    release-ready verdict (migration roadmap Phase 4 — no recorded verdict
 *    yet, so this tree does not delete it). Frozen means: no manifest
 *    outside the legacy directory may declare it, and §2 asserts no
 *    functional reference to it anywhere but the legacy directory itself.
 *    Reintroducing it as a dependency — rather than extending
 *    `@xoroh/axis` or the owning renderer — would silently resurrect the
 *    second kernel. Deletion itself needs no gate change: when the verdict
 *    lands and the directory goes, this section passes vacuously and §2
 *    keeps the name out permanently.
 * 2. No functional reference to the deleted kernel package may remain
 *    in source or configuration: imports, requires, dynamic imports,
 *    `package.json` dependencies, tsconfig paths/aliases, test/build
 *    configuration, code-generation templates, registry records, CLI
 *    scaffolds, or generated code. Docs prose and the archive are
 *    OUT of scope — architecture records must be allowed to name
 *    the migration they describe.
 * 3. Every `@xoroh/axis` import in runtime source must resolve to an
 *    installed package (vendored pre-publish tarball, registry
 *    release after). A specifier without an installation is the same
 *    broken window the old gate closed.
 *
 * String matching is sufficient here (unlike the old graph walk):
 * the question is presence of a package name, not reachability
 * through a transitive closure.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const failures = [];

// 1. The legacy kernel is frozen, not resurrected. Its own directory is
// the only place its name may functionally appear (its manifest names
// itself; its ledger records its own adoption state) — §2 below excludes
// exactly that subtree and asserts absence everywhere else, including
// every other manifest's dependency fields.
const LEGACY_REL = "libs/kern-primitives";
const legacyDir = join(ROOT, "libs", "kern-primitives");
if (existsSync(legacyDir)) {
  console.log(
    `  note: ${LEGACY_REL}/ present — frozen pending the owner Axis release-ready verdict (roadmap Phase 4); no functional reference permitted outside it.`,
  );
}

// 2. Functional references. Docs prose (*.md, docs/, archive) is out
// of scope by design; everything else that can execute, configure,
// generate, or instruct an install is in scope.
const SCAN_ROOTS = ["packages", "libs", "apps", "scripts", "parity", "e2e"];
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".next",
  "coverage",
  // Build outputs: derived artifacts whose inputs (generators + content)
  // are the checked surface, verified by the freshness gates. (The
  // changelog in particular records immutable release history.)
  "generated",
]);
const SKIP_EXT = new Set([".md", ".mdx"]);
const SKIP_FILES = new Set(["CHANGELOG.md"]);

function* walkFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walkFiles(full);
      continue;
    }
    if (SKIP_FILES.has(entry.name)) continue;
    if ([...SKIP_EXT].some((ext) => entry.name.endsWith(ext))) continue;
    if (!/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|json|yaml|yml)$/.test(entry.name)) {
      continue;
    }
    yield full;
  }
}

// Built dynamically (never one contiguous literal) so this gate never trips
// on its own diagnostics — string literals still count as references.
const OLD_PKG = "@xoroh/" + "kern-primitives";
const REF = new RegExp(`${OLD_PKG.replace("/", "\\/")}(?![\\w-])`);
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");
for (const root of SCAN_ROOTS) {
  const base = join(ROOT, root);
  if (!existsSync(base)) continue;
  for (const file of walkFiles(base)) {
    // The legacy kernel names itself (manifest + ledger): self-naming
    // inside its own subtree is not consumption. Everything else —
    // including every other package.json's dependency fields — is
    // scanned, strings included.
    if (relative(ROOT, file).startsWith(`${LEGACY_REL}/`)) continue;
    // Docs prose lives alongside code in apps/site/src/content: it
    // describes the migration rather than instructing installs, so it
    // is out of scope. Everything else — including the primitives
    // docs domain, whose example strings are user-facing install and
    // usage instructions — is scanned, strings included.
    if (file.includes("src/content/")) {
      continue;
    }
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    // Comments document history; only executable references count.
    // (String literals still count: import specifiers, dep values,
    // and scaffold path strings are all strings.)
    if (REF.test(stripComments(text))) {
      failures.push(
        `${relative(ROOT, file)}: functional ${OLD_PKG} reference remains`,
      );
    }
  }
}

// 3. `@xoroh/axis` imports resolve. A specifier with no installation
// behind it breaks cold installs exactly the way undeclared deps did.
const AXIS_IMPORT =
  /from\s+["']@xoroh\/axis["']|require\(\s*["']@xoroh\/axis["']\s*\)/;
let axisUsed = false;
let axisInstalled = false;
for (const root of ["packages", "apps"]) {
  const base = join(ROOT, root);
  if (!existsSync(base)) continue;
  for (const file of walkFiles(base)) {
    if (!/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(file)) continue;
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (AXIS_IMPORT.test(text)) axisUsed = true;
  }
}
try {
  const pkgPath = join(
    ROOT,
    "packages",
    "kern-native",
    "node_modules",
    "@xoroh",
    "axis",
    "package.json",
  );
  const hoisted = join(ROOT, "node_modules", "@xoroh", "axis", "package.json");
  const manifest = existsSync(pkgPath)
    ? JSON.parse(readFileSync(pkgPath, "utf8"))
    : JSON.parse(readFileSync(hoisted, "utf8"));
  axisInstalled =
    manifest.name === "@xoroh/axis" && Array.isArray(manifest.files);
} catch {
  axisInstalled = false;
}
if (axisUsed && !axisInstalled) {
  failures.push(
    "@xoroh/axis is imported but not installed — run bun install (vendored tarball) before asserting consumption.",
  );
}

if (failures.length) {
  console.error(`check:primitives FAILED — ${failures.length} violation(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  "check:primitives holds: legacy kernel package frozen (no functional references outside it); @xoroh/axis resolves.",
);
