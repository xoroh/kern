#!/usr/bin/env node
/**
 * check:primitives — the `@xoroh/kern-primitives` boundary.
 *
 * ## The rule
 *
 * The primitives layer is the un-styled behaviour kernel. It may import `react`.
 * It may not import:
 *
 *   - `@xoroh/kern-tokens`   a token read is a visual decision
 *   - `@xoroh/kern-native`   a second renderer
 *   - `@xoroh/kern`          the web renderer, which pulls react-dom + Base UI
 *   - `react-native`         the native platform
 *
 * The first two are the ratified gate (a visual decision must be a prop). The
 * last two were added because a gate that names only the packages we happened to
 * think of is a gate with a hole in it, and because `@xoroh/kern` is the edge
 * that would make the extraction circular.
 *
 * ## Why this walks the import graph
 *
 * A per-file grep is not sufficient, and that is a demonstrated fact, not a
 * preference. During the `SheetSurface` split a theme-coupled helper was placed
 * in `utils/overlay-styles.ts`, a module `SheetSurface` already imported. The
 * candidate file was clean; its dependency was not:
 *
 *     sheet-surface  ->  overlay-styles  ->  kern-tokens
 *
 * A grep of the extracted file finds nothing. The dependency graph crosses the
 * boundary, and shipping that would put a package that imports the token engine
 * inside the layer whose defining property is that it does not.
 *
 * So this resolves the **transitive closure** of relative and workspace imports
 * and checks every file in it. The first hit is reported with the full import
 * chain, because "primitives imports kern-tokens" is a fact someone can act on
 * and "primitives imports utils/overlay-styles" is not.
 *
 * ## What it deliberately does not do
 *
 * It does not check *which* symbols were imported. `@xoroh/kern-tokens` is banned
 * wholesale because a token package is entirely visual; there is no safe symbol
 * in it. For packages that mix concerns later, narrowing would need a real
 * export-graph analysis, and pretending to do that with a string match would
 * recreate the proxy-for-the-property problem this repo keeps hitting.
 *
 * ## Related gate
 *
 * `check:layers` is a different question at a different granularity: it reads
 * `package.json` and asserts which *package* may depend on which. It does not
 * walk the graph, and should not — a declared dependency is the honest answer
 * to "may this package know about that one". This gate answers "does a file
 * cross a boundary inside a package", where only a graph walk is honest.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PKG = join(ROOT, "packages", "kern-primitives");
const SRC = join(PKG, "src");

/** Bare specifiers the layer may not reach, each with the reason it is banned. */
const FORBIDDEN = new Map([
  [
    "@xoroh/kern-tokens",
    "a token read is a visual decision; a primitive must take it as a prop",
  ],
  [
    "@xoroh/kern-native",
    "a second renderer; primitives are shared BY renderers, not inside one",
  ],
  [
    "@xoroh/kern",
    "the web renderer; depending on it makes the extraction circular",
  ],
  [
    "@xoroh/kern/start",
    "the web composition tier, which renders styled output",
  ],
  ["react-native", "the native platform"],
  ["react-dom", "the web platform"],
]);

/** Aliases used in tsconfig, so `from "x"` resolves the way the build resolves it. */
const ALIASES = {
  "@kern-primitives/contract": join(SRC, "..", "contract"),
};

const EXTENSIONS = ["", ".ts", ".tsx", ".d.ts", "/index.ts", "/index.tsx"];

function existsAsModule(base) {
  for (const ext of EXTENSIONS) {
    const p = base + ext;
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

/** Every import specifier in a source file, from `from "x"`, `import "x"`, `require("x")`. */
function importSpecifiers(code) {
  const out = [];
  const patterns = [
    /\bfrom\s+["']([^"']+)["']/g,
    /\bimport\s+["']([^"']+)["']/g,
    /\brequire\(\s*["']([^"']+)["']\s*\)/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const re of patterns) {
    // `matchAll` rather than `while ((m = re.exec(...)) !== null)`: same result,
    // without an assignment inside a condition (biome's noAssignInExpressions).
    for (const m of code.matchAll(re)) out.push(m[1]);
  }
  return out;
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(entry.name) && !/\.d\.ts$/.test(entry.name))
      acc.push(p);
  }
  return acc;
}

/**
 * Resolve the transitive closure of imports starting from the entry files, and
 * record how each reachable file was reached.
 *
 * NOTE: files inside `src/` are all scanned regardless, because a primitive
 * never *reaches* a sibling without importing it — but the closure matters for
 * files OUTSIDE `src/` (a shared util, a `../contract` module). That is exactly
 * the `overlay-styles` shape: the offending module was not a primitive, it was a
 * dependency the primitive pulled in. Testing a violation with two files both
 * inside `src/` therefore proves nothing about the walk — it would be caught by
 * a per-file grep too.
 *
 * @returns Map<absolutePath, specifierUsedToReachIt|null>
 */
function closure(seeds) {
  /** file -> true once processed, so each file is read once. */
  const seen = new Set(seeds);
  /** file -> the file that imported it; absent for a seed. */
  const parent = new Map();
  const queue = [...seeds];

  while (queue.length) {
    const file = queue.shift();
    if (file === undefined) continue;
    for (const spec of importSpecifiers(readFileSync(file, "utf8"))) {
      if (FORBIDDEN.has(spec)) {
        violations.push({ entry: file, spec, reason: FORBIDDEN.get(spec) });
        continue;
      }
      // subpath form, e.g. "@xoroh/kern-tokens/tokens"
      const root = Object.keys(FORBIDDEN).find(
        (name) => spec === name || spec.startsWith(`${name}/`),
      );
      if (root) {
        violations.push({ entry: file, spec, reason: FORBIDDEN.get(root) });
        continue;
      }
      // alias, then relative — only these can reach another file
      const base = ALIASES[spec]
        ? ALIASES[spec]
        : spec.startsWith(".")
          ? resolve(dirname(file), spec)
          : null;
      if (!base) continue;
      const target = existsAsModule(base);
      if (target && !seen.has(target)) {
        seen.add(target);
        parent.set(target, file);
        queue.push(target);
      }
    }
  }
  return { reached: seen, parent };
}

if (!existsSync(SRC)) {
  console.error(
    "check:primitives — no packages/kern-primitives/src; nothing to check.",
  );
  process.exit(1);
}

const entries = walk(SRC);
const violations = [];
const { reached, parent } = closure(entries);

// ---------------------------------------------------------------------------
// REACHABILITY — the inverse of the boundary check
// ---------------------------------------------------------------------------
//
// The boundary check above answers "can this layer reach the platform?". This
// answers "can anything reach this layer?" — specifically, every module in
// `src/` must be re-exported from `src/index.ts`, because that file is the
// package's ONLY public entry:
//
//     "exports": { ".": ... "./dist/index.js" }
//
// There is no subpath to import a module by. So a module missing from the barrel
// is committed, typechecks, builds, and is importable by nobody.
//
// That is not hypothetical. `overlayModality.ts` landed in `bbd9ac7` fully
// written — `createOverlayModality`, `useOverlayRegistration`,
// `useOverlayModality` — with no barrel line. It sat unreachable through a
// green build, a green typecheck, and a green boundary check, and was only
// noticed at audit. The boundary gate cannot catch this by construction: it
// proves the layer does not reach out, so an unreachable module reaches out of
// nothing and is trivially clean.
//
// This is deliberately a reachability check, not a lint of the barrel: it does
// not assert that a barrel block is well-formed or that every name resolves. It
// asserts the one property that was actually missing — the module is reachable
// from the public entry at all.

/** Modules that legitimately have no barrel entry. */
const NOT_EXPORTABLE = new Set(["index"]);

function isTestModule(name) {
  return name.endsWith(".test.ts") || name.endsWith(".test.tsx");
}

const barrel = readFileSync(join(SRC, "index.ts"), "utf8");
// Parse the `from "./x"` specifiers out of the barrel with the same resolution
// the graph walk already uses, so a check of the barrel is measured the same way
// as a check of anything else. Substring matching on a filename would be the
// proxy-for-the-property mistake this gate's own header warns against.
const barrelSources = new Set();
for (const spec of barrel.matchAll(/from\s+"(\.[^"]+)"/g)) {
  const target = resolve(SRC, spec[1]);
  const rel = relative(SRC, target);
  if (rel.startsWith("..")) continue;
  barrelSources.add(rel.replace(/\.tsx?$/, ""));
}

const unreachable = [];
for (const entry of entries) {
  const rel = relative(SRC, entry);
  if (rel.startsWith("..")) continue;
  const mod = rel.replace(/\.tsx?$/, "");
  if (NOT_EXPORTABLE.has(mod)) continue;
  if (isTestModule(rel)) continue;
  // A module re-exported only through another barrel line still counts, but a
  // module imported by a sibling and not by the barrel does not — that is
  // internal wiring, not a public surface, and it is how dead code hides.
  if (!barrelSources.has(mod)) unreachable.push(rel);
}

console.log("check:primitives — the un-styled behaviour kernel boundary");
console.log(`  source files   ${entries.length}`);
console.log(
  `  reachable      ${reached.size} (transitive closure of relative + alias imports)`,
);
console.log(`  forbidden      ${[...FORBIDDEN.keys()].join(", ")}`);

if (violations.length) {
  console.error(
    `\ncheck:primitives FAILED — ${violations.length} violation(s):`,
  );
  for (const v of violations) {
    // Walk back up the parent links so the report names the CHAIN that crossed
    // the boundary, not just the file it eventually reached. "primitives
    // imports utils/overlay-styles" is not actionable; "sheet-surface ->
    // overlay-styles -> kern-tokens" is.
    const chain = [relative(ROOT, v.entry)];
    let cursor = v.entry;
    while (parent.has(cursor) && chain.length < 12) {
      cursor = parent.get(cursor);
      chain.unshift(relative(ROOT, cursor));
    }
    console.error(`  - ${v.spec}`);
    console.error(`      reason: ${v.reason}`);
    console.error(`      chain:  ${chain.join("  ->  ")}`);
  }
  process.exit(1);
}

if (unreachable.length) {
  console.error(
    `\ncheck:primitives FAILED — ${unreachable.length} module(s) not re-exported from src/index.ts:`,
  );
  for (const m of unreachable) {
    console.error(`  - packages/kern-primitives/${m}`);
  }
  console.error(
    "\n  The package exposes only '.', so a module absent from the barrel is\n" +
      "  committed, green, and importable by nobody. Add a barrel entry, or if\n" +
      "  it is genuinely internal, list it in NOT_EXPORTABLE with a reason.",
  );
  process.exit(1);
}

console.log(
  `\nprimitives boundary holds: no token, renderer or platform import;` +
    `\nall ${entries.length - unreachable.length} modules reachable from src/index.ts`,
);
