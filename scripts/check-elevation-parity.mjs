#!/usr/bin/env node
/**
 * check:elevation-parity — the SAME resting elevation on both renderers, and every
 * deviation id that claims otherwise actually resolving to a deviation.
 *
 * ## What it exists for
 *
 * DockSheet's web page/registry claimed one level while `kern-native`'s code did
 * another, and nothing noticed. review-m3 caught it by reading the source. This
 * gate reads the sources, so a human does not have to notice first.
 *
 * ## Why a per-FILE scan would be blind here
 *
 * Measured on this repo: 25 web component files carry elevation, 3 kern-native
 * ones do, and exactly ONE filename is shared — because kern-native BUNDLES
 * surfaces into shared modules. `sheets.tsx` exports BottomSheet, SnapSheet,
 * DockSheet, BottomSheetPicker and EntitySheet from one file, so a filename scan
 * cannot attribute that file's `elevation: 3` to DockSheet at all.
 *
 * Measurement is therefore PER EXPORT: each module is split on `export function
 * <Name>` and values are attributed inside that block.
 *
 * ## dp is NOT a level
 *
 * M3's levels are unevenly spaced (0/1/3/6/8/12 dp):
 *
 *     level 0 = 0dp   level 3 = 6dp
 *     level 1 = 1dp   level 4 = 8dp
 *     level 2 = 3dp   level 5 = 12dp
 *
 * So web's `elevation-level3` and native's `elevation: 3` are level 3 and level
 * 2 respectively — comparing the raw numbers would call that a match. Both sides
 * are mapped into LEVEL space before they are compared.
 *
 * ## The K6 rule — this gate CONSUMES THE VALUES
 *
 * `KERN_UNASSIGNED_ELEVATION` filed nine components under `K6`, which is the
 * TONES/COLOUR deviation. No gate caught it because nothing read the values,
 * only the keys. So every id referenced here is resolved against the real
 * deviations registry and must exist AND carry a reason. An unknown id fails.
 *
 * Usage: `bun run check:elevation-parity`
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = join(ROOT, "packages", "kern", "src", "components");
const NATIVE = join(ROOT, "packages", "kern-native", "src", "components");
const DEVIATIONS = join(
  ROOT,
  "..",
  ".team",
  "programs",
  "K-01-deviations.md",
);

const DP_BY_LEVEL = { 0: 0, 1: 1, 2: 3, 3: 6, 4: 8, 5: 12 };
const levelFromDp = (dp) => {
  const hit = Object.entries(DP_BY_LEVEL).find(([, v]) => v === dp);
  return hit ? Number(hit[0]) : null;
};

/** Split a module into per-export blocks and attribute elevation to each name. */
function scanDir(dir, native) {
  if (!existsSync(dir)) return new Map();
  const out = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.tsx?$/.test(file) || file.includes(".test.")) continue;
    const full = join(dir, file);
    const src = readFileSync(full, "utf8");
    const line = (idx) => src.slice(0, idx).split("\n").length;
    // Split on ANY top-level function declaration, exported or not: a file
    // may hold a non-exported internal component between exports, and splitting
    // only on `export` silently attributes its elevation to the PREVIOUS export.
    const blocks = src.split(/(?=^(?:export )?(?:function|const) )/m);
    for (const block of blocks) {
      const m = block.match(/^(?:export )?(?:function|const) (\w+)/);
      if (!m) continue;
      const name = m[1];
      // The web token IS the level; native's raw `elevation:` is dp.
      const tokenLevels = new Set(
        [...block.matchAll(/elevation-level(\d)/g)].map((x) => Number(x[1])),
      );
      const dps = new Set(
        [...block.matchAll(/(?<![\w-])elevation:\s*(\d+(?:\.\d+)?)/g)].map(
          (x) => Number(x[1]),
        ),
      );
      const levels = new Set(tokenLevels);
      const unresolved = [];
      for (const dp of dps) {
        const lvl = levelFromDp(dp);
        if (lvl === null) unresolved.push(`${dp}dp`);
        else levels.add(lvl);
      }
      if (levels.size === 0 && unresolved.length === 0) continue;
      const idx = src.indexOf(block);
      out.set(name, {
        levels: [...levels].sort((a, b) => a - b),
        unresolvedDp: unresolved,
        file: file,
        line: line(Math.max(idx, 0)),
        native,
      });
    }
  }
  return out;
}

/**
 * Names do NOT match across renderers: web exports `DrawerContent` / `SnackbarRoot`
 * where native exports `Drawer` / `Snackbar`. Exact-name intersection is EMPTY —
 * a per-name gate would compare nothing while reporting success. So names are
 * normalised by stripping the part-suffixes both renderers use, and pure style
 * helpers (`fabStyles`) are skipped: they are not components.
 */
const SUFFIX = /(?:Content|Root|Popup|Surface|Styles)$/;
const canon = (n) => n.replace(SUFFIX, "") || n;
const isStyleHelper = (n) => /Styles$/.test(n);

const web = scanDir(WEB, false);
const native = scanDir(NATIVE, true);
const nativeByCanon = new Map(
  [...native.entries()].filter(([k]) => !isStyleHelper(k)).map(([k, v]) => [canon(k), v]),
);

// --- deviation ids must resolve to a REAL deviation with a reason -------------
const violations = [];
const devText = existsSync(DEVIATIONS)
  ? readFileSync(DEVIATIONS, "utf8")
  : "";
function checkDeviationId(id, where) {
  // A deliberate non-deviation label is CORRECT — M3 does not tabulate these
  // components, so there is no claim to deviate from. Only something shaped like
  // a deviation id has to resolve; anything else must SAY it is not one, so a
  // stray citation cannot sit in the field.
  if (!/^K\d/.test(id)) {
    if (!/^kern-decision/i.test(id)) {
      violations.push(
        `${where}: "${id}" is neither a K-id nor the documented non-deviation ` +
          `label. M3 does not tabulate this component, so it must either name a ` +
          `real deviation or say plainly that it is a kern decision.`,
      );
    }
    return;
  }
  const row = devText
    .split("\n")
    .find((l) => new RegExp(`^\\|\\s*${id}\\s*\\|`).test(l));
  if (!row) {
    violations.push(
      `${where}: id "${id}" is not in .team/programs/K-01-deviations.md — an ` +
        `unregistered id is not a citation.`,
    );
    return;
  }
  const reason = row.split("|")[3]?.trim() ?? "";
  if (reason.length < 12) {
    violations.push(`${where}: id "${id}" has no reason in the registry.`);
  }
}

const elevSrc = readFileSync(
  join(ROOT, "packages", "kern-tokens", "src", "kern-elevation.ts"),
  "utf8",
);
for (const m of elevSrc.matchAll(/^\s{2}\"?([a-z0-9-]+)\"?:\s*"([^"]+)",$/gm)) {
  checkDeviationId(m[2], `KERN_UNASSIGNED_ELEVATION.${m[1]}`);
}

// --- 1. cross-renderer agreement ---------------------------------------------
const shared = [...web.keys()].filter((k) => nativeByCanon.has(canon(k)) && !isStyleHelper(k));
let compared = 0;
for (const name of shared) {
  const w = web.get(name);
  const n = nativeByCanon.get(canon(name));
  for (const wl of w.levels) {
    if (!n.levels.includes(wl)) {
      violations.push(
        `${name}: web ships level ${wl} but kern-native resolves to ` +
          `[${n.levels.join(",") || "nothing"}] — the same component cannot sit ` +
          `at two heights on two renderers.\n` +
          `      web:    ${w.file}:${w.line} (level ${wl})\n` +
          `      native: ${n.file}:${n.line} (${n.levels.join(",") || "no elevation"})`,
      );
    } else {
      compared++;
    }
  }
  for (const bad of n.unresolvedDp) {
    violations.push(
      `${name}: kern-native uses ${bad}, which matches no M3 level height, so it ` +
        `cannot be compared to the web side at all (${n.file}:${n.line}).`,
    );
  }
}

// --- 2. the registry must match what web actually ships ----------------------
const declared = {};
for (const block of elevSrc.matchAll(/\"([a-z0-9-]+)\"?:\s*Object\.freeze\(\{([\s\S]*?)\}\)/g)) {
  const vm = block[2].match(/variants:\s*\[([0-9, ]+)\]/);
  if (vm) declared[block[1]] = vm[1].split(",").map((v) => Number(v.trim()));
}
for (const [name, variants] of Object.entries(declared)) {
  const w = web.get(name);
  if (!w) continue;
  for (const lvl of w.levels) {
    if (!variants.includes(lvl)) {
      violations.push(
        `${name}: web ships level ${lvl}, which is NOT one of its declared ` +
          `variants [${variants.join(",")}] (${w.file}:${w.line}). The registry ` +
          `must describe the code, not permit it.`,
      );
    }
  }
}

// --- report ------------------------------------------------------------------
console.log("check:elevation-parity — one resting elevation across both renderers");
console.log(`  web components measured     ${web.size}`);
console.log(`  kern-native measured       ${native.size}`);
console.log(`  shared names compared      ${shared.length} (${compared} level agreements)`);
console.log(`  registry entries checked   ${Object.keys(declared).length}`);
console.log(`  deviation ids resolved     from .team/programs/K-01-deviations.md`);

if (violations.length) {
  console.error(
    `\ncheck:elevation-parity FAILED — ${violations.length} violation(s):`,
  );
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log(
  "\nparity holds: both renderers agree per component, the registry matches the\n" +
    "code, and every deviation id resolves to a registered reason.",
);