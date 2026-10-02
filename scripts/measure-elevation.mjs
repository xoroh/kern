#!/usr/bin/env node
/**
 * Which of the ungated-but-shipped components actually carry an elevation?
 *
 * ## It scans THREE elevation carriers, not one
 *
 * The original scanned only `--md-sys-elevation-level<N>`. That missed every
 * native surface, because React Native does not use that token: it takes a raw
 * `elevation: <dp>` plus iOS `shadow*` props. The concrete miss:
 * `packages/kern-native/src/components/sheets.tsx` DockSheet ships
 * `elevation: 3` with a designed shadow, and a token-only scan reports it as
 * carrying NOTHING. An audit that says "no elevation" about a component that
 * visibly floats is worse than no audit, because it is trusted.
 *
 * ## dp is NOT a level — the conflation that produced the page bug
 *
 * M3's levels are not evenly spaced, and the numbers collide:
 *
 *     level 0 = 0dp     level 3 =  6dp
 *     level 1 = 1dp     level 4 =  8dp
 *     level 2 = 3dp     level 5 = 12dp
 *
 * So RN `elevation: 3` is **3dp = level 2**, NOT level 3. Reading it as
 * "level 3" is off by a whole level while looking perfectly plausible, because
 * the number 3 appears in both columns.
 *
 * Usage: node scripts/measure-elevation.mjs [--native] <component> [...]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const WEB = join(ROOT, "packages/kern/src/components");
const NATIVE = join(ROOT, "packages/kern-native/src/components");

/**
 * M3's per-level dp heights. Hardcoded rather than imported so this stays a
 * standalone measurement tool that cannot be perturbed by the token file it
 * audits; check:kern separately asserts tokens.json matches this table.
 */
const DP_BY_LEVEL = { 0: 0, 1: 1, 2: 3, 3: 6, 4: 8, 5: 12 };

/** dp -> level. Only exact M3 heights map; anything else is reported unmapped. */
function levelFromDp(dp) {
  const hit = Object.entries(DP_BY_LEVEL).find(([, v]) => v === dp);
  return hit ? Number(hit[0]) : null;
}

const closureOf = (base, file, seen = new Set()) => {
  if (seen.has(file)) return seen;
  seen.add(file);
  const full = join(base, file);
  if (!existsSync(full)) return seen;
  for (const [, spec] of readFileSync(full, "utf8").matchAll(
    /from\s+"\.\/([^"]+)"/g,
  )) {
    const next = /\.(ts|tsx)$/.test(spec) ? spec : `${spec}.tsx`;
    closureOf(base, next, seen);
  }
  return seen;
};

/** Scan a component's import closure for all three carriers. */
function measure(base, name) {
  const tokens = new Set();
  const rawDp = new Set();
  const iosShadow = new Set();
  for (const file of closureOf(base, `${name}.tsx`)) {
    const full = join(base, file);
    if (!existsSync(full)) continue;
    const src = readFileSync(full, "utf8");
    for (const [, lvl] of src.matchAll(/--md-sys-elevation-level(\d)/g)) {
      tokens.add(Number(lvl));
    }
    for (const [, dp] of src.matchAll(/(?<![\w-])elevation:\s*(\d+(?:\.\d+)?)/g)) {
      rawDp.add(Number(dp));
    }
    for (const [, prop] of src.matchAll(
      /\b(shadowOpacity|shadowRadius|shadowOffset|shadowColor)\b/g,
    )) {
      iosShadow.add(prop);
    }
  }
  return { tokens, rawDp, iosShadow };
}

const args = process.argv.slice(2);
const native = args[0] === "--native";
const targets = native ? args.slice(1) : args;
const base = native ? NATIVE : WEB;

if (targets.length === 0) {
  console.error(
    "usage: node scripts/measure-elevation.mjs [--native] <component> [...]",
  );
  process.exit(2);
}

console.log("component            token-levels  raw-dp(=level)  ios-shadow   verdict");
console.log("-".repeat(78));
for (const name of targets) {
  const { tokens, rawDp, iosShadow } = measure(base, name);
  const tokenList = tokens.size ? [...tokens].sort().join(",") : "—";
  const dpList = rawDp.size
    ? [...rawDp].sort((a, b) => a - b)
        .map((dp) => `${dp}dp=${levelFromDp(dp) ?? "?"}`).join(",")
    : "—";
  const iosList = iosShadow.size ? "yes" : "—";

  let verdict;
  if (tokens.size === 0 && rawDp.size === 0 && iosShadow.size === 0) {
    verdict = "NO ELEVATION — gating this row would assert nothing";
  } else if (tokens.size > 1) {
    verdict = "straddles rows";
  } else if (tokens.size === 1) {
    verdict = `assertable at level ${[...tokens][0]}`;
  } else if (rawDp.size) {
    const mapped = [...rawDp].map(levelFromDp).filter((n) => n !== null);
    verdict = mapped.length
      ? `RAW ONLY (no token) — maps to level ${[...new Set(mapped)].sort().join(",")}; a row asserts nothing until it emits a token`
      : "RAW ONLY (no token) — dp matches no M3 level; kern rendering, not a spec claim";
  } else {
    verdict = "iOS SHADOW ONLY (no token, no dp) — a shadow is drawn but no level names it";
  }
  console.log(
    `${name.padEnd(20)} ${tokenList.padEnd(13)} ${dpList.padEnd(15)} ${iosList.padEnd(11)} ${verdict}`,
  );
}
