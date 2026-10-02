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
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = join(ROOT, "packages", "kern", "src", "components");
const NATIVE = join(ROOT, "packages", "kern-native", "src", "components");
const DEVIATIONS = join(ROOT, "..", ".team", "programs", "K-01-deviations.md");

const DP_BY_LEVEL = { 0: 0, 1: 1, 2: 3, 3: 6, 4: 8, 5: 12 };
const levelFromDp = (dp) => {
  const hit = Object.entries(DP_BY_LEVEL).find(([, v]) => v === dp);
  return hit ? Number(hit[0]) : null;
};

/**
 * Remove line and block comments, leaving CODE alone.
 *
 * STRING-AWARE, because a naive `//` strip truncates real code: these are class
 * strings such as `"kern-popover-popup w-64 …"`, and a URL or a `"//"` in any
 * literal would swallow everything after it on that line. A regex strip here
 * would silently change which elevation each component reports — reintroducing
 * the very mis-attribution this gate exists to prevent, one level up.
 *
 * Preserves newlines so reported LINE NUMBERS still point at the source.
 */
function stripComments(src) {
  let out = "";
  let i = 0;
  const n = src.length;
  while (i < n) {
    const ch = src[i];
    const next = src[i + 1];
    if (ch === "/" && next === "/") {
      while (i < n && src[i] !== "\n") i += 1;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) {
        // Keep the newline so line numbers survive.
        if (src[i] === "\n") out += "\n";
        i += 1;
      }
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      out += ch;
      i += 1;
      while (i < n) {
        if (src[i] === "\\") {
          out += src[i] + (src[i + 1] ?? "");
          i += 2;
          continue;
        }
        out += src[i];
        if (src[i] === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

/** Split a module into per-export blocks and attribute elevation to each name. */
function scanDir(dir, native) {
  if (!existsSync(dir)) return new Map();
  const out = new Map();
  for (const file of readdirSync(dir)) {
    if (!/\.tsx?$/.test(file) || file.includes(".test.")) continue;
    const full = join(dir, file);
    const src = readFileSync(full, "utf8");
    // Module-scope, read once per file: `inheritedLevels` needs the FILE's
    // imports, because they sit above the first component block.
    const fileImports = importSpecifiers(stripComments(src));
    const line = (idx) => src.slice(0, idx).split("\n").length;
    // Split on ANY top-level function declaration, exported or not: a file
    // may hold a non-exported internal component between exports, and splitting
    // only on `export` silently attributes its elevation to the PREVIOUS export.
    const blocks = src.split(/(?=^(?:export )?(?:function|const) )/m);
    for (const block of blocks) {
      const m = block.match(/^(?:export )?(?:function|const) (\w+)/);
      if (!m) continue;
      const name = m[1];
      // Measure the CODE, not the prose about the code.
      //
      // This is not a hardening nit — it was a live false green. `PopoverContent`
      // in kern-native carries `elevation: 3` in code and the string
      // `elevation-level2` ONLY inside the explanatory comment above it ("Web's
      // `PopoverContent` uses `--md-sys-elevation-level2`"). Matching the raw
      // text therefore gave the native block a level it never declared, so it
      // agreed with web no matter what the code said: setting native to 6dp
      // (level 3) against web's level 2 — a real divergence — still exited 0.
      // The same comment also means a NATIVE file can look like it ships a web
      // token, which is the exact shape of the Drawer mis-attribution.
      const code = stripComments(block);
      // The web token IS the level; native's raw `elevation:` is dp.
      const tokenLevels = new Set(
        [...code.matchAll(/elevation-level(\d)/g)].map((x) => Number(x[1])),
      );
      const dps = new Set(
        [...code.matchAll(/(?<![\w-])elevation:\s*(\d+(?:\.\d+)?)/g)].map((x) =>
          Number(x[1]),
        ),
      );
      const levels = new Set(tokenLevels);
      const unresolved = [];
      for (const dp of dps) {
        const lvl = levelFromDp(dp);
        if (lvl === null) unresolved.push(`${dp}dp`);
        else levels.add(lvl);
      }
      const idx = src.indexOf(block);
      // Elevation this component INHERITS from a local style helper it composes.
      // Recorded separately from `levels` (what the body declares) so the output
      // can say which is which — "inherited from fabStyles" and "declares none"
      // are different facts, and printing the second when the first is true is
      // what sent two conformant components to a design ruling.
      const inherited = inheritedLevels(code, dir, fileImports);
      const where = {
        levels: [],
        unresolvedDp: [],
        inheritedLevels: inherited.levels,
        inheritedFrom: inherited.from,
        file: file,
        line: line(Math.max(idx, 0)),
        native,
      };
      if (levels.size === 0 && unresolved.length === 0) {
        // Record PRESENCE even with no elevation. Skipping these is what made
        // the sheet family invisible: native's `sheets.tsx` declares no
        // elevation on BottomSheet/SnapSheet/EntitySheet/BottomSheetPicker, so
        // they were absent from the map entirely and could not be reported as
        // one-sided — the comparison set was derived from the very thing it
        // was supposed to check.
        out.set(name, where);
        continue;
      }
      out.set(name, {
        levels: [...levels].sort((a, b) => a - b),
        unresolvedDp: unresolved,
        inheritedLevels: inherited.levels,
        inheritedFrom: inherited.from,
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
 * normalised by stripping the part-suffixes both renderers use.
 *
 * Style helpers (`fabStyles`) are not components, so they are not COMPARED as
 * components — but they are RESOLVED, because a component that renders
 * `style={fabStyles(...)}` HAS an elevation even though its own body declares
 * none. Skipping them outright is what made `ExtendedFab` and `FabMenu` read as
 * `native none`. Same rule the rest of the repo follows: `check:primitives` and
 * `check:contrast` both resolve a transitive closure for exactly this reason.
 *
 * WHAT RESOLUTION FOUND. Both components were measured correctly once the
 * helper was followed — and they are NOT conformant, which is the opposite of
 * what the re-opened rows claimed. `fabStyles` sets `elevation: 3`, and on M3's
 * uneven scale (0/1/3/6/8/12 dp) 3dp is LEVEL 2, while web's FAB, ExtendedFab
 * and FabMenu all ship `--md-sys-elevation-level3` = 6dp. So the whole FAB
 * family is one level low natively — a genuine cross-renderer divergence that
 * the `native none` reading had been hiding in plain sight.
 */
const SUFFIX = /(?:Content|Root|Popup|Surface|Styles)$/;
const canon = (n) => n.replace(SUFFIX, "") || n;
const isStyleHelper = (n) => /Styles$/.test(n);

/** Every import specifier in a file. Mirrors `check-primitives`. */
function importSpecifiers(code) {
  const out = [];
  const patterns = [
    /\bfrom\s+["']([^"']+)["']/g,
    /\bimport\s+["']([^"']+)["']/g,
    /\brequire\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const re of patterns) {
    for (const m of code.matchAll(re)) out.push(m[1]);
  }
  return out;
}

/**
 * Elevation a component INHERITS, by following its local imports to the helpers
 * it composes.
 *
 * `fileImports` is passed from the WHOLE FILE, not the block: ES module imports
 * live in the file header, above the first component, so a block-scoped read
 * finds no relative specifiers at all and silently resolves nothing. That is
 * what made ExtendedFab read `native none` on the first attempt — the block
 * genuinely had `fabStyles(` and genuinely had no `from "./fab"`, because the
 * import is forty lines above it.
 *
 * Scoped to RELATIVE imports only, and to the renderer's own component
 * directory. That is deliberate: a token import (`kern-tokens`) would make every
 * component "inherit" the whole elevation scale and the comparison would become
 * meaningless. Only same-renderer helper code can plausibly hand a component its
 * resting elevation.
 *
 * @returns {{levels:number[], from:string|null}} the levels inherited, and the
 * `helper@file:line` citation they came from.
 */
function inheritedLevels(block, dir, fileImports) {
  const helpers = new Set();
  for (const m of block.matchAll(/\b([a-z][A-Za-z0-9]*Styles)\s*\(/g)) {
    helpers.add(m[1]);
  }
  if (!helpers.size) return { levels: [], from: null };

  const specs = fileImports.filter((s) => s.startsWith("."));
  const levels = new Set();
  let citation = null;
  for (const spec of specs) {
    let file = resolve(dir, spec);
    for (const ext of ["", ".ts", ".tsx"]) {
      const candidate = `${file}${ext}`;
      if (existsSync(candidate)) {
        file = candidate;
        break;
      }
      const index = join(file, `index${ext}`);
      if (existsSync(index)) {
        file = index;
        break;
      }
    }
    if (!existsSync(file)) continue;
    const helperSrc = stripComments(readFileSync(file, "utf8"));
    for (const helper of helpers) {
      // Only credit a helper the file actually exports, and only the levels
      // inside that helper's own body — otherwise every helper in the file
      // would donate every level it mentions.
      const re = new RegExp(
        `(?:export\\s+)?function\\s+${helper}\\s*\\([^)]*\\)[^{]*\\{([\\s\\S]*?)\\n\\}`,
      );
      const hm = helperSrc.match(re);
      if (!hm) continue;
      for (const m of hm[1].matchAll(
        /(?<![\w-])elevation:\s*(\d+(?:\.\d+)?)/g,
      )) {
        const lvl = levelFromDp(Number(m[1]));
        if (lvl !== null) {
          levels.add(lvl);
          if (!citation) {
            citation = `${helper}@${file.split("/").pop()}:${
              helperSrc.slice(0, hm.index).split("\n").length
            }`;
          }
        }
      }
    }
  }
  return { levels: [...levels].sort((a, b) => a - b), from: citation };
}

const web = scanDir(WEB, false);
const native = scanDir(NATIVE, true);

// `levels` is what a component's OWN body declares; `inheritedLevels` is what it
// gets from a helper it composes. Every consumer needs the union — the union is
// the component's actual resting elevation. Reading `.levels` alone is what kept
// ExtendedFab/FabMenu reported as `native none` after inheritance was being
// computed correctly: the number was right and nothing was reading it.
//
// Kept as ONE accessor so the next reader cannot repeat the mistake, and so
// "declared" vs "inherited" stays visible in the output rather than being
// flattened into a single number that hides where the value came from.
const effective = (x) => [
  ...new Set([...x.levels, ...(x.inheritedLevels ?? [])]),
];
/** True when the component has a resting elevation from EITHER source. */
const hasElevation = (x) => effective(x).length > 0;

// Canonicalisation COLLAPSES a component's parts onto one name — `PopoverRoot`,
// `PopoverContent` and the `Popover` namespace object all reduce to `Popover`.
// Building the map with `new Map(entries.map(...))` let the LAST one win, and
// the last one is the namespace object, which carries no elevation. That erased
// the elevation-bearing `PopoverContent` and dropped the component out of the
// comparison entirely — the gate silently lost the very case it was built for,
// which is the equal-value/collision shape review-lead flagged.
//
// So: MERGE the collapsed entries instead of overwriting. Elevation is the
// union; the citation is the first entry that actually declares one, so the
// reported file:line points at real code rather than at the namespace.
function byCanon(map) {
  const out = new Map();
  for (const [name, v] of map) {
    if (isStyleHelper(name)) continue;
    const key = canon(name);
    const prev = out.get(key);
    if (!prev) {
      out.set(key, { ...v });
      continue;
    }
    const levels = [
      ...new Set([
        ...prev.levels,
        ...v.levels,
        ...prev.inheritedLevels,
        ...v.inheritedLevels,
      ]),
    ].sort((a, b) => a - b);
    const primary = prev.levels.length ? prev : v.levels.length ? v : prev;
    const inheritedFrom =
      prev.inheritedFrom ??
      v.inheritedFrom ??
      (prev.levels.length ? prev.inheritedFrom : v.inheritedFrom) ??
      null;
    out.set(key, {
      levels,
      unresolvedDp: [...new Set([...prev.unresolvedDp, ...v.unresolvedDp])],
      inheritedLevels: [
        ...new Set([...prev.inheritedLevels, ...v.inheritedLevels]),
      ].sort((a, b) => a - b),
      inheritedFrom,
      file: primary.file,
      line: primary.line,
      native: primary.native,
    });
  }
  return out;
}

const nativeByCanon = byCanon(native);

// Every name that exists on BOTH sides, whether or not either one carries an
// elevation. The sheet family is the reason this exists: web ships
// BottomSheet/SnapSheet/EntitySheet/BottomSheetPicker/ActionSheet at
// `--md-sys-elevation-level1`, while kern-native's `sheets.tsx` declares NO
// elevation on those components at all. Deriving the compare set from "has
// elevation" therefore DROPPED the whole sheet family silently — the one
// family where a two-renderer disagreement was most likely, and the one a
// reader would assume was covered because the components are prominent.
const webByCanon = byCanon(web);
const bothPresent = [
  ...new Set([...webByCanon.keys(), ...nativeByCanon.keys()]),
]
  .filter((c) => webByCanon.has(c) && nativeByCanon.has(c))
  .sort();

// --- deviation ids must resolve to a REAL deviation with a reason -------------
const violations = [];
const devText = existsSync(DEVIATIONS) ? readFileSync(DEVIATIONS, "utf8") : "";
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
for (const m of elevSrc.matchAll(/^\s{2}"?([a-z0-9-]+)"?:\s*"([^"]+)",$/gm)) {
  checkDeviationId(m[2], `KERN_UNASSIGNED_ELEVATION.${m[1]}`);
}

// --- 1. cross-renderer agreement ---------------------------------------------
// Compare over names present on BOTH sides, so the sheet family is IN the set.
// `shared` (elevation-bearing on both) is what gets a strict pass/fail; a pair
// where only one side declares elevation is reported separately as ONE-SIDED.
const shared = bothPresent.filter((c) => {
  const w = webByCanon.get(c);
  const n = nativeByCanon.get(c);
  return hasElevation(w) && hasElevation(n);
});
let compared = 0;
for (const name of shared) {
  const w = webByCanon.get(name);
  const n = nativeByCanon.get(name);
  for (const wl of effective(w)) {
    if (!effective(n).includes(wl)) {
      violations.push(
        `${name}: web ships level ${wl} but kern-native resolves to ` +
          `[${effective(n).join(",") || "nothing"}] — the same component cannot sit ` +
          `at two heights on two renderers.\n` +
          `      web:    ${w.file}:${w.line} (level ${wl})\n` +
          `      native: ${n.file}:${n.line} (${effective(n).join(",") || "no elevation"})`,
      );
    } else {
      compared++;
    }
  }
  // Off-scale native dp is checked for EVERY native entry in 1c below, not
  // here — scoping it to the two-sided set let it escape when the web side had
  // no level to pair with.
}

// --- 1b. ONE-SIDED: reported, NOT failed ------------------------------------
// A component on both renderers where only ONE declares elevation. This is
// REPORTED rather than failed on purpose. It is a real asymmetry — web's
// BottomSheet sits at level 1 while kern-native's declares nothing — but
// whether native should adopt the level or rule that RN surfaces carry their own
// separation is a DESIGN RULING, not a gate's to make, and the two answers are
// both defensible. Failing here would make the gate's exit code an unearned
// verdict on an open question, and a gate that red-lines a question nobody has
// adjudicated gets deleted rather than obeyed.
//
// So it is counted, named, and made impossible to miss. Promoting any of these
// to a failure is a one-line change once a ruling lands.
const oneSided = bothPresent.filter((c) => {
  const w = webByCanon.get(c);
  const n = nativeByCanon.get(c);
  return hasElevation(w) !== hasElevation(n);
});

// --- 1c. off-scale native dp is a HARD failure, one-sided or not -------------
// This must be checked across every NATIVE entry, not only inside the two-sided
// loop. Scoping it to `shared` meant an off-scale value was only reported when
// the web side also declared a level: set native PopoverContent to 2dp and the
// component dropped out of `shared`, the unresolved-dp check never ran, and the
// gate exited 0. "Cannot be compared" is a defect precisely when there is
// nothing to compare it TO, so the check cannot depend on the other side.
for (const [name, n] of nativeByCanon) {
  for (const bad of n.unresolvedDp) {
    violations.push(
      `native ${name}: kern-native uses ${bad}, which matches no M3 level ` +
        `height, so it cannot be compared to the web side at all ` +
        `(${n.file}:${n.line}).`,
    );
  }
}

// --- 2. the registry must match what web actually ships ----------------------
const declared = {};
for (const block of elevSrc.matchAll(
  /"([a-z0-9-]+)"?:\s*Object\.freeze\(\{([\s\S]*?)\}\)/g,
)) {
  const vm = block[2].match(/variants:\s*\[([0-9, ]+)\]/);
  if (vm) declared[block[1]] = vm[1].split(",").map((v) => Number(v.trim()));
}
for (const [name, variants] of Object.entries(declared)) {
  const w = web.get(name);
  if (!w) continue;
  for (const lvl of effective(w)) {
    if (!variants.includes(lvl)) {
      violations.push(
        `${name}: web ships level ${lvl}, which is NOT one of its declared ` +
          `variants [${variants.join(",")}] (${w.file}:${w.line}). The registry ` +
          `must describe the code, not permit it.`,
      );
    }
  }
}

// --- 3. the RULING TABLE -----------------------------------------------------
// `check:elevation-parity` picks up review-m3's dispositions as its ruling
// table, the way `check-docs` reads K-01: the ruling is the source of truth and
// the gate renders it, rather than the gate and the ruling both restating a
// decision that can then drift apart.
//
// PARSED, NOT SCRAPED. The row shape is validated (positional columns, numeric
// level, a disposition from a closed vocabulary) and an UNPARSEABLE row is a
// hard failure, never a silent skip. A gate that quietly drops a ruling row it
// cannot read is the "prints nothing" failure this gate has already been caught
// in twice tonight.
//
// The table carries the 17 rows that SURVIVED reconciliation
// (`.team/reports/dsl-0036-reconcile.md`). ExtendedFab and FabMenu are
// deliberately absent: both already declare level 3 natively through `fabStyles`,
// so the gate's `native none` row is a measurement artefact, not a gap to adopt.
// They re-open on the measurement when the scanner follows style helpers.
const RULING = join(
  ROOT,
  "..",
  ".team",
  "reports",
  "reviews",
  "m3",
  "2026-10-03-19-one-sided-ruling.md",
);
const DISPOSITIONS = new Set(["both-renderers", "web-only", "native-only"]);

// Rows held OUT of the ruling table. review-m3's file covers 19; a name listed
// here is not rendered as RULED even though the ruling has a row for it.
//
// WAS ["ExtendedFab", "FabMenu"], on the belief that both were conformant at
// level 3 through `fabStyles`. THAT WAS WRONG, and the belief came from reading
// `elevation: 3` as "level 3" — conflating a dp VALUE with a LEVEL index. On
// M3's scale (0/1/3/6/8/12 dp) 3dp is level 2; web ships level 3 = 6dp. So the
// FAB family is one level LOW natively: a real divergence the `native none`
// reading had been hiding. Resolving the helper turned a claimed false positive
// into a true finding, which is the opposite outcome and the reason the blind
// spot was worth fixing rather than suppressing.
const REOPENED = new Set();

function parseRuling() {
  if (!existsSync(RULING)) {
    violations.push(
      `ruling table missing: ${RULING}. Without it every one-sided row falls ` +
        `back to "unruled", which is the state the 00:33 ruling retired.`,
    );
    return new Map();
  }
  const table = new Map();
  const lines = readFileSync(RULING, "utf8").split("\n");
  for (const line of lines) {
    // `| 1 | ActionSheet | 1 (`file:line`) | anchor | **both-renderers** | reason |`
    if (!line.startsWith("|")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 6) continue;
    const [num, name, level, , disposition] = cells;
    if (!/^\d+$/.test(num)) continue;
    const dispositionClean = disposition.replace(/\*/g, "").trim();
    if (!DISPOSITIONS.has(dispositionClean)) continue;
    // The level cell is `1 (`sheet-family.tsx:480`)` — level, then a
    // parenthesised file:line citation. Split them properly rather than
    // stripping parentheses, which left a dangling backtick in every row's
    // citation and made the rendered disposition look malformed.
    const levelMatch = level.match(/^(\d+)\s*(?:\(`([^`]+)`\))?/);
    if (!levelMatch) {
      violations.push(
        `ruling row ${num} (${name}): level cell "${level}" is not ` +
          `"<level> (\`file:line\`)" — the ruling table changed shape.`,
      );
      continue;
    }
    const levelNum = Number.parseInt(levelMatch[1], 10);
    if (!Number.isFinite(levelNum)) {
      violations.push(
        `ruling row ${num} (${name}): level "${level}" is not a number — the ` +
          `table is malformed and the row cannot be trusted.`,
      );
      continue;
    }
    table.set(name, {
      row: Number(num),
      level: levelNum,
      disposition: dispositionClean,
      citation: levelMatch[2] ?? "no citation",
    });
  }
  if (!table.size) {
    violations.push(
      `${RULING} parsed to ZERO ruling rows. A table that silently yields ` +
        `nothing would report every row "unruled" and pass — the exact shape ` +
        `of a gate that changes nothing.`,
    );
  }
  return table;
}
const rulings = parseRuling();

// A ruling that names a level must MATCH what web actually ships. If they
// diverge, the ruling was written against a different tree and its disposition
// is being applied to the wrong value — so this fails rather than renders.
for (const [name, r] of rulings) {
  const w = webByCanon.get(name);
  if (!w) continue;
  if (!effective(w).includes(r.level)) {
    violations.push(
      `ruled row ${name}: review-m3 ruled level ${r.level} but web ships ` +
        `[${effective(w).join(",") || "nothing"}] (${w.file}:${w.line}). The ruling ` +
        `was written against a different tree — re-open it rather than ` +
        `enforcing a stale value.`,
    );
  }
}

// Every one-sided row is either ruled, or explicitly still open. Silently
// printing "unruled" for a row the ruling simply forgot is how a ruling table
// rots, so an unruled row is named explicitly rather than left to inference.
//
// `REOPENED` rows are reported as RE-OPENED with the reason, never as ruled:
// they are in the ruling file, and the honest state is that the measurement
// behind the row is disputed, not that the design question is open.
const ruledRows = [];
const openRows = [];
const reopenedRows = [];
for (const c of oneSided) {
  if (REOPENED.has(c)) reopenedRows.push(c);
  else if (rulings.has(c)) ruledRows.push(c);
  else openRows.push(c);
}

// --- report ------------------------------------------------------------------
console.log(
  "check:elevation-parity — one resting elevation across both renderers",
);
console.log(`  web components measured     ${web.size}`);
console.log(`  kern-native measured       ${native.size}`);
console.log(
  `  names on BOTH renderers     ${bothPresent.length} (compared ${shared.length}, ${compared} level agreements)`,
);
console.log(
  `  one-sided                   ${oneSided.length} (${ruledRows.length} ruled, ${openRows.length} open, ${reopenedRows.length} re-opened)`,
);
console.log(
  `  ruling table                ${rulings.size} rows from review-m3`,
);
console.log(`  registry entries checked   ${Object.keys(declared).length}`);
console.log(
  `  deviation ids resolved     from .team/programs/K-01-deviations.md`,
);

if (oneSided.length) {
  console.log(
    "\nONE-SIDED — one renderer declares a resting elevation, the other declares\n" +
      "none in its own body. Each row carries review-m3's disposition; a row\n" +
      "with no disposition is OPEN, not passing.",
  );
  for (const c of oneSided) {
    const w = webByCanon.get(c);
    const n = nativeByCanon.get(c);
    // Never print a bare "none". A skipped construct must SAY that it was
    // skipped, or the reader concludes a component is flat when the truth is
    // "flat in its own body, and helpers were followed". Declared and inherited
    // are different facts and are labelled separately.
    const side = (x) => {
      const own = x.levels.length ? `level ${x.levels.join(",")}` : "none";
      const inh = x.inheritedLevels?.length
        ? ` + inherited level ${x.inheritedLevels.join(",")} via ${x.inheritedFrom}`
        : "";
      return `${own} in its own body${inh}`;
    };
    const r = rulings.get(c);
    let disposition;
    if (REOPENED.has(c)) {
      disposition =
        "RE-OPENED on the measurement — this component inherits its level from a " +
        "shared *Styles helper the scanner does not follow, so `native none` is " +
        "wrong. Not an adoption to-do; see dsl-0036-reconcile.md.";
    } else if (r) {
      disposition = `RULED ${r.disposition} (ruling row ${r.row}, ${r.citation})`;
    } else {
      disposition = "OPEN — no disposition in the ruling table";
    }
    console.log(
      `  - ${c}: web ${side(w)} (${w.file}:${w.line}) · ` +
        `native ${side(n)} (${n.file}:${n.line})\n      ${disposition}`,
    );
  }
}

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
