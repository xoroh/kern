#!/usr/bin/env node
/**
 * check:consumption -- every public export of kern-primitives has a first-party
 * consumer, or is explicitly marked not-yet-adopted in adoption.json.
 *
 * WHY THIS EXISTS
 *
 * Today we have had three instances of the same shape: code that exists, is
 * tested, is exported... and that nothing reaches.
 *
 *   - `overlayModality.ts` committed with no barrel entry (bbd9ac7)
 *   - `SelectionKey` declared in the .d.ts but absent from the export list
 *   - the whole overlayModality kernel landing with ZERO consumers -- extracted,
 *     fully tested, `check:primitives` green, and unreachable in practice
 *
 * `check:primitives` proves the boundary: primitives never import tokens or a
 * renderer. It says NOTHING about whether any renderer imports the primitives.
 * Without this gate, "the kernel exists" is unfalsifiable -- the exact property
 * that let all three land.
 *
 * CHECKED AGAINST BUILT ARTIFACTS
 *
 * The public entry is `dist/index.d.ts`, so that is what is read. A consumer of
 * `src/` proves nothing about what a consumer of the published package reaches,
 * and reading source would have missed `SelectionKey` entirely.
 *
 * THE CLOSURE, and why it is not a loophole
 *
 * An export used INTERNALLY by an adopted export counts as adopted: `isSelected`
 * and `normalizeSelection` are called by `useSelection`, which kern-native
 * imports. Requiring every helper to be imported directly would be impossible to
 * satisfy honestly. Types inherit adoption from the value that produces them --
 * `RovingModel` is the return type of `useRovingModel`, and demanding a direct
 * `import type` for it would be theatre.
 *
 * WHAT CANNOT BE SATISFIED BY MARKER
 *
 * A marker names a UNIT and must list every symbol in it. Adding a new export to
 * an already-marked unit therefore still fails until it is listed -- so widening
 * a unit cannot quietly launder a new, unadopted symbol past the gate.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = join(ROOT, "packages", "kern-primitives");
const DTS = join(PKG, "dist", "index.d.ts");
const SRC = join(PKG, "src");
const ADOPTION = join(PKG, "adoption.json");

/** Packages allowed to consume the kernel. */
const CONSUMER_DIRS = [
  "packages/kern-native/src",
  "packages/kern/src",
  "packages/mcp/src",
];

const violations = [];

/** Every *.ts / *.tsx under dir, recursively. */
function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

// --- 1. the public entry, read from the BUILT declaration ---------------------
if (!existsSync(DTS)) {
  console.error(
    "consumption: UNVERIFIABLE — packages/kern-primitives/dist/index.d.ts is missing.\n" +
      "  Run `bun run build`. Reporting 0 unconsumed from a build that has not run\n" +
      "  is the gate-looks-green-because-it-did-not-look failure.",
  );
  process.exit(1);
}

const exported = new Set();
for (const m of readFileSync(DTS, "utf8").matchAll(/export\s*\{([^}]*)\}/g)) {
  for (const raw of m[1].split(",")) {
    const name = raw
      .trim()
      .split(/\s+as\s+/)
      .pop()
      ?.trim()
      .replace(/^type\s+/, "");
    if (name) exported.add(name);
  }
}

// --- 2. which module defines each export, and which are types ----------------
const modText = new Map();
for (const f of readdirSync(SRC)) {
  if (!f.endsWith(".ts") || f === "index.ts" || f.endsWith(".test.ts"))
    continue;
  modText.set(f.replace(/\.ts$/, ""), readFileSync(join(SRC, f), "utf8"));
}

const symbolModule = new Map();
const typeSymbols = new Set();
for (const [name, txt] of modText) {
  // `export type Foo = ...` -- the type ALIAS form. Matching this needs its own
  // pattern: a single combined regex with `type\s+` as an optional group then
  // requiring function|const|class silently matches NO type alias at all, so
  // every aliased type reads as belonging to no module and therefore as
  // unadopted. That is a gate that reports a false crisis rather than failing.
  for (const m of txt.matchAll(/^export\s+type\s+(\w+)\s*[=<]/gm)) {
    symbolModule.set(m[1], name);
    typeSymbols.add(m[1]);
  }
  for (const m of txt.matchAll(/^export\s+interface\s+(\w+)/gm)) {
    symbolModule.set(m[1], name);
    typeSymbols.add(m[1]);
  }
  for (const m of txt.matchAll(
    /^export\s+(?:declare\s+)?(?:function|const|class)\s+(\w+)/gm,
  )) {
    symbolModule.set(m[1], name);
  }
}

// --- 3. direct first-party consumers -----------------------------------------
const adopted = new Set();
const IMPORT_RE =
  /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["']@xoroh\/kern-primitives["']/gs;
for (const dir of CONSUMER_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const txt = readFileSync(file, "utf8");
    for (const m of txt.matchAll(IMPORT_RE)) {
      for (const raw of m[1].split(",")) {
        const name = raw
          .trim()
          .split(/\s+as\s+/)[0]
          .trim()
          .replace(/^type\s+/, "");
        if (name) adopted.add(name);
      }
    }
  }
}

// --- 4. transitive closure over internal modules -----------------------------
// An export sharing a module with an adopted export is adopted.
for (let changed = true; changed; ) {
  changed = false;
  const adoptedModules = new Set(
    [...adopted].map((s) => symbolModule.get(s)).filter(Boolean),
  );
  for (const name of exported) {
    if (adopted.has(name)) continue;
    const mod = symbolModule.get(name);
    // A type is adopted when the value producing it is; a value is adopted when
    // it shares a module with something already adopted.
    if (mod && adoptedModules.has(mod)) {
      adopted.add(name);
      changed = true;
    }
  }
}

// --- 5. explicit not-yet-adopted markers -------------------------------------
const marked = new Map();
if (!existsSync(ADOPTION)) {
  violations.push(
    "packages/kern-primitives/adoption.json is missing, so unconsumed exports " +
      "cannot be declared. Every export must be either consumed or marked.",
  );
} else {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(ADOPTION, "utf8"));
  } catch (err) {
    violations.push(`adoption.json is not valid JSON: ${err.message}`);
  }
  for (const unit of manifest?.units ?? []) {
    for (const field of ["unit", "status", "reason", "symbols"]) {
      if (!unit?.[field]) {
        violations.push(`an adoption.json unit is missing "${field}"`);
      }
    }
    if (unit?.status !== "not-yet-adopted") {
      violations.push(
        `adoption.json unit "${unit?.unit}" has status "${unit?.status}"; only ` +
          `"not-yet-adopted" is a valid marker. A different status is not an ` +
          `excuse -- adopt it or delete the entry.`,
      );
    }
    for (const s of unit?.symbols ?? []) marked.set(s, unit.unit);
  }
}

// --- 6. judge -----------------------------------------------------------------
const unconsumedValues = [];
const unconsumedTypes = [];
for (const name of exported) {
  if (adopted.has(name) || marked.has(name)) continue;
  (typeSymbols.has(name) ? unconsumedTypes : unconsumedValues).push(name);
}

for (const name of unconsumedValues) {
  violations.push(
    `packages/kern-primitives exports ${name} but NO first-party package imports ` +
      `it, and it is not marked not-yet-adopted in adoption.json. An unconsumed ` +
      `export is unreachable code that passes every other gate.`,
  );
}
for (const name of unconsumedTypes) {
  violations.push(
    `packages/kern-primitives exports type ${name} which no adopted export ` +
      `produces, and which adoption.json does not cover.`,
  );
}

// A marker naming a symbol that no longer exists is stale: it would let a real
// regression hide behind a marker that no longer describes anything.
for (const [sym, unit] of marked) {
  if (!exported.has(sym)) {
    violations.push(
      `adoption.json unit "${unit}" marks ${sym}, which is no longer exported. ` +
        `Stale markers silently excuse nothing; delete the entry.`,
    );
  }
  // A marker on something that is ALREADY consumed is the dangerous kind. Today
  // it is harmless; the day that consumer is deleted, the marker silently
  // excuses it and the regression is invisible. A marker must describe a real
  // gap, so requiring it to be minimal is what stops it outliving its reason.
  //
  // This is the check whose absence made the "widening a unit cannot escape"
  // comment in the header a claim rather than a property.
  if (adopted.has(sym)) {
    violations.push(
      `adoption.json marks ${sym} as not-yet-adopted, but a first-party package ` +
        `DOES import it. The marker is unnecessary and will silently excuse a ` +
        `future regression when that consumer is removed -- delete it.`,
    );
  }
}

const counts = {
  exported: exported.size,
  adopted: [...exported].filter((e) => adopted.has(e)).length,
  marked: [...exported].filter((e) => marked.has(e)).length,
  units: new Set(marked.values()).size,
};

if (violations.length) {
  console.error("consumption contract FAILED:\n");
  for (const v of violations) console.error(`  - ${v}`);
  console.error(
    `\n  ${counts.exported} exported · ${counts.adopted} adopted · ` +
      `${counts.marked} marked across ${counts.units} unit(s)`,
  );
  process.exit(1);
}

console.log(
  `consumption contract passes: ${counts.exported} public exports of ` +
    `kern-primitives, ${counts.adopted} adopted by a first-party package, ` +
    `${counts.marked} explicitly marked not-yet-adopted across ` +
    `${counts.units} unit(s). Nothing is exported and unreachable by accident.`,
);
