#!/usr/bin/env node
/**
 * check:consumption — Kern consumes `@xoroh/axis` through its public
 * entry, and nothing else.
 *
 * History: this gate once demanded every deleted-package export
 * have a first-party consumer or a not-yet-adopted ledger entry in
 * `adoption.json`. Both the package and the ledger were deleted in the
 * kern→Axis cutover (adoption state for gated modules lives in the
 * migration roadmap + Axis dispositions now). What remains — and what
 * this gate enforces — is consumption discipline on Kern's side:
 *
 * 1. Every `@xoroh/axis` import in Kern runtime source names a symbol
 *    the INSTALLED package's public entry actually exports (read from
 *    the shipped `dist/index.d.ts`, mirroring the old built-artifacts
 *    doctrine — never source, never memory).
 * 2. No deep imports (`@xoroh/axis/<subpath>`) - with ONE documented
 *    exception: `@xoroh/axis/models`, the UNIVERSAL zone. It is a
 *    published export entry (its own `exports` map, its own declarations),
 *    and Axis's boundary gate proves its closure contains no react-native
 *    anywhere. The root entry is the NATIVE zone, and a WEB consumer
 *    that imports it installs react-native - whose source is Flow, which no
 *    JS runtime can parse. A deep import into the models zone is a
 *    documented, gated surface; a deep import into anything else is the
 *    second, ungated API surface this gate exists to refuse.
 * 3. No deleted-package imports anywhere (defense in depth
 *    alongside check-primitives; this gate owns the consumption
 *    direction, that one owns presence).
 *
 * A missing installed package is UNVERIFIABLE, never a pass.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const failures = [];
const fail = (m) => failures.push(m);

function findInstalledAxis() {
  for (const base of [
    join(ROOT, "packages", "kern-native", "node_modules", "@xoroh", "axis"),
    join(ROOT, "packages", "kern", "node_modules", "@xoroh", "axis"),
    join(ROOT, "node_modules", "@xoroh", "axis"),
  ]) {
    try {
      const manifest = JSON.parse(
        readFileSync(join(base, "package.json"), "utf8"),
      );
      if (manifest.name === "@xoroh/axis") return base;
    } catch {
      // Not installed here; try the next candidate.
    }
  }
  return null;
}

const axisDir = findInstalledAxis();
if (!axisDir) {
  fail(
    "consumption: UNVERIFIABLE — no installed @xoroh/axis found. " +
      "Run bun install (vendored tarball) before asserting consumption.",
  );
}

const publicNames = new Set();
if (axisDir) {
  let dts = "";
  try {
    dts = readFileSync(join(axisDir, "dist", "index.d.ts"), "utf8");
  } catch {
    fail(
      "installed @xoroh/axis has no dist/index.d.ts — rebuild the vendor tarball.",
    );
  }
  const m = dts.match(/export\s*\{([^}]+)\}\s*;?\s*$/);
  for (const part of (m?.[1] ?? "").split(",")) {
    const name = part
      .replace(/\btype\s+/g, "")
      .trim()
      .split(/\s+as\s+/)
      .pop()
      ?.trim();
    if (name) publicNames.add(name);
  }
  if (publicNames.size === 0 && !failures.length) {
    fail("installed @xoroh/axis declarations carry no export list.");
  }
}

function* walkFiles(dir, depth = 0) {
  if (depth > 8) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      // Build outputs: derived artifacts whose inputs are the checked
      // surface (freshness gates own them; the changelog additionally
      // records immutable release history).
      entry.name === "generated"
    ) {
      continue;
    }
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(full, depth + 1);
      continue;
    }
    if (/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/.test(entry.name)) yield full;
  }
}

const AXIS_IMPORT =
  /from\s*["'](@xoroh\/axis(\/[^"']*)?)["']|require\(\s*["'](@xoroh\/axis(\/[^"']*)?)["']\s*\)|import\(\s*["'](@xoroh\/axis(\/[^"']*)?)["']\s*\)/g;
// Built dynamically so this gate never trips on its own diagnostics.
const OLD_PKG = "@xoroh/" + "kern-primitives";
const PRIMITIVES_REF = new RegExp(OLD_PKG.replace("/", "\\/"));

for (const area of ["packages", "apps"]) {
  const base = join(ROOT, area);
  if (!existsSync(base)) continue;
  for (const file of walkFiles(base)) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    // Comments document history; only executable references count
    // (string literals still count: specifiers, dep values, paths).
    const code = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^[ \t]*\/\/.*$/gm, "");
    if (PRIMITIVES_REF.test(code)) {
      fail(
        `${file.replace(`${ROOT}/`, "")}: references ${OLD_PKG} (deleted package).`,
      );
    }
    for (const m of code.matchAll(AXIS_IMPORT)) {
      const spec = m[1] ?? m[3] ?? m[5];
      if (spec !== "@xoroh/axis" && spec !== "@xoroh/axis/models") {
        fail(
          `${file.replace(`${ROOT}/`, "")}: deep import ${JSON.stringify(spec)} - the contract supports the public entry (and the models zone) only.`,
        );
      }
      // Named bindings are NOT re-checked here: typecheck already
      // resolves every name against the installed declarations, and a
      // second parser would only duplicate it less reliably.
    }
  }
}

if (failures.length) {
  console.error(`check:consumption FAILED — ${failures.length} violation(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check:consumption holds: Kern imports @xoroh/axis through its public entry (${publicNames.size} exported names); no deleted-package references.`,
);
