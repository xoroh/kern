// check-parity.mjs — parity gate (ladder P2b-4 tranche 0).
//
// Verifies that `docs/parity-contract.md` still describes the tree, using the
// CONCEPT RULE ratified in `docs/conventions/parity.md`:
//
//   A name is a sub-part when stripping a part suffix yields a name that is
//   ALREADY A REGISTERED ROW ON THE SAME PLATFORM.
//
// Counts are computed from the generated registry
// (`packages/mcp/src/manifest.ts`), never from a curated table, so this gate
// cannot drift from the packages the way a hand-written list would.
//
// What it enforces:
//   1. ADR 002 boundary — kern-native / kern-tokens / kern-icons import no
//      behavior primitive; packages/kern imports no kern-native.
//   2. The counts printed in parity-contract.md match reality.
//   3. Every concept named in parity-contract.md exists in the registry.
//   4. Asymmetries ruled deliberate stay declared (a gate that fires forever on
//      correct code is a gate people stop reading).
//
// Run: `bun run check:parity`. Exit 0 clean, 1 on violation.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const MANIFEST = join(ROOT, "packages/mcp/src/manifest.ts");
const CONTRACT = join(ROOT, "docs/parity-contract.md");
// The row manifest itself. `CONTRACT` above is the human-facing DOC; this is the
// data the doc describes, and it is what carries per-row provenance.
const CONTRACT_TS = join(ROOT, "parity/contract.ts");

// Suffixes that may denote a sub-part. Deliberately narrow: `-button`, `-tab`,
// `-body`, `-head` are NOT here, because a component whose own name ends in one
// of those (segmented-button) is a concept, not a part. Stripping those blind is
// exactly the bug this gate exists to make impossible to repeat silently.
const PART_SUFFIX =
  /-(root|items|item|trigger|content|list|label|value|group|empty|separator|action|close|title|description|input|provider|viewport|icon|section|panel|header|footer|handle|indicator|legend|option|column|row|group-label|item-indicator|item-text|field|message|error|step|tick|clear)$/;

/**
 * Collapse a registry to concepts.
 *
 * A name is a SUB-PART when stripping a part suffix yields a name already
 * registered on the SAME platform (`table-body` of a registered `table`,
 * `number-field-root` of a registered `number-field`). Otherwise the name is
 * itself a concept and KEEPS ITS OWN NAME.
 *
 * Two failure modes, both hit while writing this gate:
 *
 *   (a) Strip only when the result is a real row on the same platform. A first
 *       attempt kept every multipart parent as its own concept, which turned 34
 *       web-only into 187 — because `number-field-root` became a concept when
 *       `number-field` was kept. The parent is the concept; its parts are not.
 *
 *   (c-or-not) A second attempt added a clause "if nothing is registered under
 *       the stripped form, rename to the stripped form" to rescue
 *       `filter-chip-row`. That is WRONG and was reverted: it renames the
 *       component. `filter-chip-row` is the only registered name for that idea,
 *       so its concept is spelled `filter-chip-row`, not `filter-chip` — and
 *       inventing a `filter-chip` concept that exists nowhere makes a real
 *       component look phantom. The rule is simpler and does not need the
 *       clause: if the stripped form is not registered, the name is its own
 *       concept, spelled as registered.
 *
 * The doc-vs-registry comparison must therefore check doc rows against the
 * ORIGINAL registered names (union of web + native raw rows), not against
 * collapsed concepts — a doc row legitimately spells a component as registered.
 */
function concepts(names) {
  const registered = new Set(names);
  const out = new Set();
  for (const name of names) {
    const stripped = name.replace(PART_SUFFIX, "");
    if (stripped !== name && registered.has(stripped)) continue; // (a) a part
    out.add(name); // keep the registered spelling
  }
  return out;
}

const src = readFileSync(MANIFEST, "utf8");
const rows = [
  ...src.matchAll(
    /\{\s*name:\s*"([^"]+)",\s*export:\s*"([^"]+)",\s*platform:\s*"(web|native)",\s*path:\s*"([^"]+)",\s*status:\s*"(real|stub)",\s*\}/gs,
  ),
].map(([, name, exportName, platform, path, status]) => ({
  name,
  exportName,
  platform,
  path,
  status,
}));

if (rows.length === 0) {
  console.error(
    "check:parity FAILED — parsed 0 rows from the generated registry.\n" +
      "Run `bun run generate:components` first; the registry is generated, do not hand-edit.",
  );
  process.exit(1);
}

const web = rows.filter((r) => r.platform === "web");
const native = rows.filter((r) => r.platform === "native");

/**
 * NAME MAPPING — two export names for one concept (D10, restated).
 *
 * `check:parity` classifies by registry NAME, so a concept implemented on both
 * sides under different export names reads as "one built, one missing" and
 * inflates the platform-only counts. These three are the known pairs; each is
 * one concept, not two.
 *
 *   error-boundary  <-> kern-error-boundary   KernErrorBoundary takes a `Kern`
 *                                               prefix because it is a rendered
 *                                               component; the native class is not
 *   boot-splash     <-> boot-indicator        the browser has no pre-first-paint
 *                                               phase, so the same launch concept
 *                                               is named differently
 *   supporting-pane <-> pane                  `currentWidth < breakpoint` is a
 *                                               media query; web `Pane` is the
 *                                               concept
 *
 * Deliberately an EXPLICIT table, not a fuzzy rule. Normalising prefixes would
 * silently merge genuinely distinct concepts whose names happen to collide, and
 * a mapping nobody reviewed is exactly the kind of gate that passes because it
 * did not look. Adding a pair here is a ruling, and the doc records it.
 */
const NAME_MAPPING = new Map([
  ["kern-error-boundary", "error-boundary"],
  ["boot-indicator", "boot-splash"],
  ["supporting-pane", "pane"],
]);
/** Canonical concept for a registry name, following the mapping to its twin. */
const conceptOf = (name) => NAME_MAPPING.get(name) ?? name;
/** The other export name for a concept, in EITHER direction. Reachability has to
 *  start from the native name (`boot-splash`) and find the web twin
 *  (`boot-indicator`), which the forward map does not give. */
const twinOf = (name) => {
  if (NAME_MAPPING.has(name)) return name; // already the alias side
  for (const [alias, canonical] of NAME_MAPPING) {
    if (canonical === name) return alias;
  }
  return name;
};

const webConcepts = concepts(web.map((r) => conceptOf(r.name)));
const nativeConcepts = concepts(native.map((r) => conceptOf(r.name)));

const shared = [...webConcepts].filter((c) => nativeConcepts.has(c)).sort();
const webOnly = [...webConcepts].filter((c) => !nativeConcepts.has(c)).sort();
const nativeOnly = [...nativeConcepts]
  .filter((c) => !webConcepts.has(c))
  .sort();
const stubs = rows.filter((r) => r.status === "stub");

const violations = [];

// ---------------------------------------------------------------- 1. boundary
// ADR 002: the behavior primitive belongs to @xoroh/kern only, and the two
// renderer packages must not import each other.
const BEHAVIOR_PRIMITIVES = [
  "@base-ui/react",
  "@radix-ui",
  "react-aria",
  "react-aria-components",
];
const MUST_NOT_IMPORT_PRIMITIVE = [
  "packages/kern-native",
  "packages/kern-tokens",
  "packages/kern-icons",
];
for (const dir of MUST_NOT_IMPORT_PRIMITIVE) {
  const files = collectSourceFiles(join(ROOT, dir, "src"));
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const prim of BEHAVIOR_PRIMITIVES) {
      if (text.includes(`"${prim}`) || text.includes(`'${prim}`)) {
        violations.push(
          `ADR 002 boundary: ${relative(ROOT, file)} imports ${prim} — the behavior primitive belongs to @xoroh/kern only`,
        );
      }
    }
  }
}
for (const file of collectSourceFiles(join(ROOT, "packages/kern/src"))) {
  const text = readFileSync(file, "utf8");
  if (text.includes("@xoroh/kern-native")) {
    violations.push(
      `ADR 002 boundary: ${relative(ROOT, file)} imports @xoroh/kern-native — web must not import native`,
    );
  }
}

// ------------------------------------------- 2/3. contract doc stays truthful
const contract = readFileSync(CONTRACT, "utf8");

// The doc asserts counts on one machine-readable line. Re-derive them from the
// registry and compare. Written as prose-plus-numbers on purpose: a table a
// script fully regenerates cannot be human-reviewed, which is the point of a
// gate. This one line is the contract; the prose around it is the reasoning.
const claimRe = /<!--\s*gate:counts\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*-->/;
const claim = contract.match(claimRe);
if (!claim) {
  violations.push(
    "parity-contract.md does not carry a `gate:counts` line.\n" +
      "  Expected exactly:\n" +
      "  <!-- gate:counts <shared> <native-only> <web-only> <stubs> -->",
  );
} else {
  const [, cShared, cNative, cWeb, cStubs] = claim.map(Number);
  const actual = {
    shared: shared.length,
    "native-only": nativeOnly.length,
    "web-only": webOnly.length,
    stubs: stubs.length,
  };
  const expected = {
    shared: cShared,
    "native-only": cNative,
    "web-only": cWeb,
    stubs: cStubs,
  };
  for (const key of Object.keys(actual)) {
    if (actual[key] !== expected[key]) {
      violations.push(
        `parity-contract.md claims ${expected[key]} ${key}, registry has ${actual[key]}.\n` +
          `  Update the count, or run \`bun run generate:components\` if a component changed.`,
      );
    }
  }
}

// Every concept the doc names in its two gap tables must exist in the registry.
// A row for a component that does not exist is a phantom task; a component with
// no row is an untracked gap.
//
// Row shape is `| <n> | `concept` | ...`. The anchor is the leading `|` of the
// row itself — NOT `^\|` after optional leading whitespace, which silently
// matched ZERO rows when this gate was first written (so the check passed
// vacuously). Match on the numbered-row shape and assert we found some, so a
// regex that stops matching fails loudly instead of checking nothing.
const docRowRx = /^\s*\|\s*(\d+)\s*\|\s*`([a-z0-9-]+)`/gm;
const docConcepts = new Set([...contract.matchAll(docRowRx)].map((m) => m[2]));
if (docConcepts.size === 0) {
  violations.push(
    "parity-contract.md row regex matched 0 rows — the doc-row check would pass vacuously.\n" +
      "  Either the tables changed shape or the regex is wrong. Fix the regex; do not remove the check.",
  );
}
// --- every primitives module must be re-exported from its barrel --------------
// `overlayModality.ts` shipped with three exports and no barrel entry, so it was
// importable by nobody -- and passed every gate, because every gate inspected
// the code the module CONTAINED rather than whether anything could REACH it.
// The reachability check above covers registry rows; this covers the primitives
// package's public entry, which was the uncovered gap.
//
// The barrel is parsed with the TypeScript parser, not a regex: a regex would
// miss a re-export written across a line break, and "missing something" is the
// exact failure mode of this gate.
{
  const primitivesSrc = join(ROOT, "packages", "kern-primitives", "src");
  if (existsSync(primitivesSrc)) {
    const barrelPath = join(primitivesSrc, "index.ts");
    const barrelText = readFileSync(barrelPath, "utf8");
    const barrelExports = new Set();
    for (const m of barrelText.matchAll(
      /\bfrom\s*["']\.\/([A-Za-z0-9_.-]+)["']/g,
    )) {
      barrelExports.add(m[1]);
    }
    // Every sibling module must be named by the barrel. A test file is not a
    // module of the package; neither is the barrel itself.
    for (const entry of readdirSync(primitivesSrc)) {
      if (!entry.endsWith(".ts")) continue;
      if (entry === "index.ts" || /\.test\.ts$/.test(entry)) continue;
      const mod = entry.replace(/\.ts$/, "");
      if (!barrelExports.has(mod)) {
        violations.push(
          `packages/kern-primitives/src/${entry} is not re-exported from index.ts -- ` +
            `its exports are importable by nobody. A committed module that no ` +
            `consumer can reach is a library that silently does not exist ` +
            `(this is how overlayModality shipped in bbd9ac7).`,
        );
      }
    }
  }
}

// --- every primitives module must also be in the BUILT d.ts barrel -----------
// 802030c checked the SOURCE barrel. That is not the publish surface: consumers
// import `dist/index.d.ts`, and a module can be exported in source and absent
// from the built declaration — a tsup entry list that omits it, an export the
// bundler drops, or a stale dist.
//
// A missing dist is UNVERIFIABLE, never a pass: reporting "0 violations" from a
// build that has not run is the gate-looks-green-because-it-did-not-look failure.
{
  const distDts = join(
    ROOT,
    "packages",
    "kern-primitives",
    "dist",
    "index.d.ts",
  );
  const primitivesSrc = join(ROOT, "packages", "kern-primitives", "src");
  if (!existsSync(distDts)) {
    violations.push(
      "packages/kern-primitives/dist/index.d.ts is missing, so the PUBLISH SURFACE " +
        "cannot be checked. Run `bun run build`. Reporting 0 violations here would " +
        "be a gate that passed because it did not look.",
    );
  } else {
    const dts = readFileSync(distDts, "utf8");
    // The trailing `export { ... }` list is the public entry. A `declare
    // function` earlier in the file proves the symbol is compiled, NOT that it is
    // exported -- which is exactly how the first reachability gate produced nine
    // false positives.
    const exportBlocks = [...dts.matchAll(/export\s*\{([^}]*)\}/g)];
    const exported = new Set();
    for (const b of exportBlocks) {
      for (const raw of b[1].split(",")) {
        const name = raw
          .trim()
          .split(/\s+as\s+/)
          .pop()
          ?.trim();
        if (name) exported.add(name.replace(/^type\s+/, ""));
      }
    }
    for (const entry of readdirSync(primitivesSrc)) {
      if (!entry.endsWith(".ts")) continue;
      if (entry === "index.ts" || /\.test\.ts$/.test(entry)) continue;
      const text = readFileSync(join(primitivesSrc, entry), "utf8");
      for (const m of text.matchAll(
        /^export\s+(?:declare\s+)?(?:function|const|class|type)\s+(\w+)/gm,
      )) {
        const sym = m[1];
        if (!exported.has(sym)) {
          violations.push(
            `packages/kern-primitives: ${sym} (from src/${entry}) is not exported ` +
              `from the BUILT dist/index.d.ts -- consumers cannot import it.`,
          );
        }
      }
    }
  }
}

// --- web-only TABLE membership, not just row existence ------------------------
// The check above proves a doc row names something real. It does NOT prove the
// row is in the RIGHT table: a component that is registered on BOTH platforms
// is "known", so listing it under web-only passed silently. Nine components
// built natively this session (carousel, meter, drawer, popover, pagination,
// icon-button, time-picker, loading-indicator, fieldset) were misclassified that
// way, and the count marker was correct the whole time -- the count was right
// and the work list was wrong, which is worse.
//
// Scoped to the web-only section so shared/native tables keep their own
// treatment, and symmetric: a row in the wrong table AND a web-only concept
// with no row both fail. One without the other would let the list silently rot
// in whichever direction it happened to drift.
const webOnlySection = contract.match(
  /^## Web-only concepts[\s\S]*?(?=^## |Z)/m,
);
if (!webOnlySection) {
  violations.push(
    "parity-contract.md has no `## Web-only concepts` section.\n" +
      "  The P2b-3 work list is derived from this table; without it the list is\n" +
      "  unreproducible and this check would pass vacuously.",
  );
} else {
  const docWebOnly = new Set(
    [...webOnlySection[0].matchAll(docRowRx)].map((m) => m[2]),
  );
  if (docWebOnly.size === 0) {
    violations.push(
      "the web-only table matched 0 rows -- membership would pass vacuously.",
    );
  }
  const realWebOnly = new Set(webOnly);

  for (const name of [...docWebOnly].sort()) {
    if (!realWebOnly.has(name)) {
      violations.push(
        `parity-contract.md lists "${name}" under Web-only, but the registry says it is not web-only.\n` +
          "  Either it now exists on both platforms (move the row to Shared), or it\n" +
          "  is native-only. A correct COUNT with a wrong TABLE still dispatches the\n" +
          "  wrong work.",
      );
    }
  }
  for (const name of [...realWebOnly].sort()) {
    if (!docWebOnly.has(name)) {
      violations.push(
        `web-only concept "${name}" has no row in the Web-only table.\n` +
          "  The count marker matched but the work list is incomplete.",
      );
    }
  }
}

// Check doc rows against the REGISTERED names (web ∪ native raw rows), not
// against collapsed concepts: a doc row spells a component as registered
// (`filter-chip-row`), and comparing it to a renamed concept would report a
// real component as phantom.
const known = new Set([
  ...web.map((r) => r.name),
  ...native.map((r) => r.name),
]);
for (const name of [...docConcepts].sort()) {
  if (!known.has(name)) {
    violations.push(
      `parity-contract.md has a row for "${name}", which is not in the generated registry.\n` +
        "  A row for a component that does not exist dispatches phantom work.",
    );
  }
}

// --------------------------------------------------- 4. deliberate asymmetries
// Ruled, not gaps. Recorded here so the gate does not flag them as missing, and
// so deleting one is a visible change rather than a silent one.
/**
 * Names that the Google Material 3 specification does NOT define as components,
 * so they can never be cited as a Material 3 source in a parity row's `spec`.
 *
 * This exists because the provenance gate can require a `spec` to MENTION the
 * spec but cannot tell whether the name is TRUE — semantic accuracy is
 * review-m3's job. All three of their P2b-1 deviations were false names that
 * passed the mention check ("M3 Scrollbar", and two vacuous "M3 - ..." strings).
 * A deny-list makes re-introducing those impossible rather than merely unlikely.
 * It is not a complete defence: a false claim using a name not on this list
 * would still pass.
 *
 * Named "non-spec" rather than "non-M3" so no Material 3 identifier sits in
 * kern's own code (founder directive, board.md 2026-10-02) while the reference
 * itself — which is what makes the list meaningful — stays here in prose.
 * Source: research T4-V2 non-spec component band, verified against the Material
 * 3 component taxonomy 2026-10-01.
 */
const NON_SPEC_SOURCES = [
  "Scrollbar",
  "Combobox",
  "InputOTP",
  "ScrollArea",
  "Snackbar",
  "Command",
];

const DELIBERATE = [
  "sonner",
  "create-sonner-manager",
  "kbd",
  "native-select",
  "link",
  "preview-card",
  "combobox",
];
for (const name of DELIBERATE) {
  const inDoc = docConcepts.has(name) || contract.includes(`\`${name}\``);
  if (!inDoc) {
    violations.push(
      `parity-contract.md no longer mentions "${name}". It is a RULED deliberate asymmetry (D-026 / S1.3) — if that ruling changed, record the new ruling here; do not let it disappear.`,
    );
  }
}

// ------------------------------------------------------------- 4b. canaries
// If the concept rule regresses, these break first. Asserted explicitly so the
// failure names the cause instead of showing a wrong number.
for (const [name, why] of [
  ["segmented-button", "ships on BOTH sides (native in web-parity.tsx)"],
  ["command", "ships on BOTH sides (native in web-parity.tsx)"],
  ["snackbar", "ships on BOTH sides"],
]) {
  if (!shared.includes(name)) {
    violations.push(
      `CONCEPT RULE REGRESSION: "${name}" is not counted as shared, but ${why}.\n` +
        "  A name is a sub-part only when stripping yields a name already registered on the SAME platform.",
    );
  }
}

// ------------------------------------------------------------------ reporting
const line = (label, n) => console.log(`  ${label.padEnd(16)}${n}`);

console.log("check:parity — parity gate (concept rule, registry-backed)");
console.log(
  `  registry rows    ${rows.length} (web ${web.length}, native ${native.length})`,
  // The P2b-3 work list, from the gate that resolves families -- not from
  // a hand-rolled parse of the markdown table, which is what produced three
  // different answers (202 / 25 / 43) before this was printed here.
  `  web-only (${webOnly.length}):\n${webOnly.map((c) => `    - ${c}`).join(`\n`)}`,
);
console.log("  concepts:");
line("shared", shared.length);
line("native-only", nativeOnly.length);
line("web-only", webOnly.length);
line("stubs", stubs.length);
console.log(
  `  deliberate       ${DELIBERATE.length} (${DELIBERATE.join(", ")})`,
);
console.log(
  `  canaries passed  ${["segmented-button", "command", "snackbar"].join(", ")}`,
);

/**
 * Every PRESENT-TENSE count in the prose must match the registry.
 *
 * The `gate:counts` comment above is the machine check; the sentences around it
 * are how a human actually reads this file, and they drift silently. That is
 * not hypothetical: the section heading said "Web-only concepts → need a native
 * version (34)" while the gate line correctly said 42. A gate that checks one
 * line checks exactly the line nobody argues with.
 *
 * A sentence quoting a HISTORICAL figure is exempt, so a nearby past-tense
 * marker ("was", "went", "from") excuses the number. Without that exemption
 * this check would forbid the document from ever recording that a count moved,
 * which is most of what this file is for.
 */
function proseCountViolations(registry) {
  const out = [];
  // Label → the registry figure that must back it. Labels are matched
  // case-insensitively with hyphens/spaces folded, because the prose writes
  // "web-only", "web only" and "Registry rows" for the same three numbers.
  const wanted = [
    { label: /web[- ]only/i, key: "web-only" },
    { label: /native[- ]only/i, key: "native-only" },
    { label: /\bshared\b/i, key: "shared" },
    { label: /registry rows/i, key: "registry-rows" },
  ];
  // A HEADING states ONE count, and the label in the same line says which.
  // Bind them: pick the label the line actually contains, then compare only
  // that figure. Iterating every key and reporting the first mismatch is wrong
  // in a way that looks right — "## Native-only … (22)" is correct, and a loop
  // that tries `web-only` first calls it a violation.
  for (const line of contract.split("\n")) {
    if (!line.startsWith("#")) continue;
    const found = wanted.find(({ label }) => label.test(line));
    if (!found) continue;
    for (const m of line.matchAll(/\((\d+)\)/g)) {
      if (Number(m[1]) === registry[found.key]) continue; // right figure
      out.push(
        `parity-contract.md heading says ${m[1]} ${found.key}, registry has ${registry[found.key]}.\n` +
          `    In: "${line.trim()}"\n` +
          `    Fix the heading — this is the figure a reader acts on.`,
      );
    }
  }

  // A table row states one measurement per row: the label cell names it, the
  // last numeric cell is the figure. Matched structurally rather than by
  // distance, because `| **Shared** (already both sides) | **48** |` has a
  // pipe, asterisks and three words between label and figure — none of which a
  // prose-distance rule can see through.
  for (const line of contract.split("\n")) {
    if (!/^\s*\|/.test(line)) continue;
    const cells = line.split("|").map((cell) => cell.trim());
    const found = wanted.find(({ label }) => label.test(cells.join(" ")));
    if (!found) continue;
    for (const cell of cells) {
      const m = cell.match(/\*\*(\d+)\*\*|\((\d+)\)/);
      if (!m) continue;
      if (Number(m[1] ?? m[2]) === registry[found.key]) continue;
      out.push(
        `parity-contract.md table says ${m[1] ?? m[2]} ${found.key}, registry has ${registry[found.key]}.\n` +
          `    In: "${line.trim()}"`,
      );
    }
  }

  for (const { label, key } of wanted) {
    const value = registry[key];
    // Prose: the number must sit next to the label, either immediately or across a
    // short run of counting words. Two widths, because the two places this
    // actually bites are differently shaped:
    //
    //   "**Web-only** | **39**"      (table cell — a few chars between)
    //   "need a native version (39)" (HEADING — the label is a whole clause
    //                                  earlier, with the number in parentheses)
    //
    // A first version used a tight window and passed a document whose heading
    // said "(34)". A second used 60 characters and fired 13 times on table row
    // indices and the words "Correction 1". Both were wrong; the window is
    // sized for a clause, and table rows plus arrows are excluded below.
    const gap =
      "(?:\\s*(?:→|-|—|of|=|:|\\(|\\)|was|were|went|goes|go|rows?|concepts?|in|needs?|native|version)\\s*){0,8}";
    const near = new RegExp(
      `(\\d+)${gap}${label.source}|${label.source}${gap}(\\d+)`,
      "gi",
    );
    for (const match of contract.matchAll(near)) {
      const quoted = Number(match[1] ?? match[2]);
      if (quoted === value) continue;
      const at = match.index ?? 0;
      // A markdown table row's FIRST cell is a row index, not a measurement —
      // but the measurement table's cells are exactly what must be checked, so
      // only the leading cell is exempt, not the whole line. Excluding whole
      // rows (the first attempt) passed a doc whose table said "Shared 48".
      const lineStart = contract.lastIndexOf("\n", at) + 1;
      const line = contract.slice(lineStart, contract.indexOf("\n", at));
      if (/^\s*[|>]/.test(line)) {
        const firstCellEnd = line.indexOf("|", 1);
        if (firstCellEnd === -1 || at - lineStart < firstCellEnd) continue;
      }
      const context = contract
        .slice(Math.max(0, at - 100), at + match[0].length + 60)
        .replace(/\s+/g, " ")
        .trim();
      if (/\b(was|were|went|from)\b/i.test(context)) continue; // history
      // An arrow is a TRANSITION, not a count: "web-only goes 34 → 42" states
      // where the number came from and went, and neither figure is a claim
      // about the present. The registry only knows the destination.
      if (context.includes("→")) continue;
      if (context.includes("gate:counts")) continue;
      out.push(
        `parity-contract.md prose says ${quoted} ${key}, registry has ${value}.\n` +
          `    In: "${context}"\n` +
          `    Fix the sentence, or mark it as history ("was"/"went"/"from").`,
      );
    }
  }
  return out;
}

violations.push(
  ...proseCountViolations({
    shared: shared.length,
    "native-only": nativeOnly.length,
    "web-only": webOnly.length,
    "registry-rows": rows.length,
  }),
);

// ------------------------------------------- P2b-1: row provenance
//
// The ladder asks for one row per BEHAVIOUR carrying component, behaviour, each
// side's contract, the M3 source, and a test pointer. Five of the six were
// absent from the type entirely, so a row could assert something while
// recording nothing about why, by what authority, or who checks it.
//
// Parsed from the contract TEXT rather than by importing it, for the same
// reason the checks above read it as text: the contract is data-only, and a gate
// that imported it would need a TypeScript loader just to check documentation
// fields.
//
// `testedBy` is checked against suites that EXIST. A pointer to a renamed or
// deleted suite is a claim, not a proof, and a manifest that trusts it looks
// complete long after it stopped being true.
{
  const PROVENANCE_FIELDS = [
    "id",
    "behaviour",
    "webContract",
    "nativeContract",
    "spec",
    "testedBy",
  ];
  // Every test file in the repo, not just the parity folders. A `testedBy`
  // pointer may legitimately name a component-level suite (an overlay surface
  // is covered by `overlays.test.tsx`, not by a cross-renderer parity suite),
  // and what matters is that the named file EXISTS — otherwise the manifest
  // claims proof that is not there.
  const suiteNames = new Set();
  const collect = (dir, depth = 0) => {
    if (depth > 6) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        collect(full, depth + 1);
      } else if (/\.(test|rntest)\.tsx?$/.test(e.name)) {
        suiteNames.add(e.name);
      }
    }
  };
  collect(join(ROOT, "packages"));

  // Every test file that lives under a `src/parity/` directory. Derived from
  // the DIRECTORY, not the filename — see the pending-tier check below.
  const paritySuites = new Set();
  const collectParity = (dir, depth = 0) => {
    if (depth > 6) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.name === "node_modules" || e.name === "dist") continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) collectParity(full, depth + 1);
      else if (
        /\.(test|rntest)\.tsx?$/.test(e.name) &&
        dir.includes("parity")
      ) {
        paritySuites.add(e.name);
      }
    }
  };
  collectParity(join(ROOT, "packages"));

  const contractRows = readFileSync(CONTRACT_TS, "utf8");
  const rowBlocks = contractRows
    .split(/\n\s{2}\{\n/)
    .slice(1)
    .map((chunk) => chunk.split(/\n\s{2}\},?\n/)[0]);

  const provenanceProblems = [];
  const uncoveredRows = [];
  const componentOnly = new Map();
  const fieldValue = (row, field) => {
    const m = row.match(new RegExp(`\\b${field}:\\s*"([^"]*)"`));
    return m ? m[1] : undefined;
  };

  for (const [index, row] of rowBlocks.entries()) {
    const comp = fieldValue(row, "component") ?? "?";
    // 1-based, so "row 17" is the 17th row rather than an offset from zero that
    // disagrees with every human reading of the file. (review-m3, D-4)
    const where = `row ${index + 1} (${comp})`;
    for (const field of PROVENANCE_FIELDS) {
      const value = fieldValue(row, field);
      if (value === undefined || value.trim() === "") {
        provenanceProblems.push(`${where}: missing or empty \`${field}\``);
      }
    }
    // Interactive fields: REQUIRED on a control, FORBIDDEN on a static row.
    //
    // Keyed on `interactive`, NOT on `family`. Family names which fields a suite
    // ASSERTS, and `stepper` / `otp-field` / `hint-surface` are all real
    // controls -- keying on family flagged 8 correct rows in an earlier attempt.
    //
    // `expects` is exempt from the prohibition: a static surface can still have
    // an obligation, and `expects` is the only field that can state it. Making
    // the rule symmetric (forbid all four) would have deleted the caption's
    // entire contract.
    //
    // Comments are stripped before matching. A regex over the raw block reads
    // PROSE: a row whose comment says "rather than a state axis: there" was
    // scored as declaring `axis`. Same class as the import scanner matching the
    // word "from" inside a comment.
    const code = row
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    // `interactive` is an unquoted BOOLEAN and `fieldValue` matches only quoted
    // strings, so reading it that way made every row look interactive --
    // including the static ones this rule exists to catch.
    const interactiveLiteral = code.match(/\binteractive:\s*(true|false)\b/);
    const isInteractive = interactiveLiteral
      ? interactiveLiteral[1] !== "false"
      : true;
    const carries = (f) => new RegExp(`\\b${f}:`).test(code);
    const CONTROL_FIELDS = ["axis", "interaction", "maxSelected"];
    if (isInteractive) {
      for (const f of [...CONTROL_FIELDS, "expects"]) {
        if (!carries(f)) {
          provenanceProblems.push(
            `${where}: an interactive row must carry \`${f}\``,
          );
        }
      }
    } else {
      for (const f of CONTROL_FIELDS) {
        if (carries(f)) {
          provenanceProblems.push(
            `${where}: \`interactive: false\` so it must NOT carry \`${f}\` -- ` +
              "that field describes a control's state, and a row that declares it " +
              "is static cannot honestly assert one",
          );
        }
      }
    }

    const spec = fieldValue(row, "spec");
    if (spec && !/M3|Material/i.test(spec)) {
      provenanceProblems.push(
        `${where}: \`spec\` does not name a Material 3 source`,
      );
    }
    // The gate can require a spec string to MENTION M3; it cannot tell whether
    // the name is TRUE. Semantic accuracy is review-m3's job, and the three
    // deviations they found (D-1/D-2/D-3) were all false names that passed the
    // mention check. So the names research already ruled NON-M3 are denied here:
    // this cannot catch every false claim, but it makes re-introducing these
    // three impossible rather than merely unlikely.
    // Only a CLAIM is a violation: "M3 Scrollbar" asserts it as a source, while
    // "NO M3 COMPONENT … the M3-adjacent Scrollbar does not exist" denies it and
    // must pass. Matching the adjacency rather than the bare name is what tells
    // the two apart.
    for (const notM3 of NON_SPEC_SOURCES) {
      if (spec && new RegExp(`M3[\\s-]+${notM3}\\b`, "i").test(spec)) {
        provenanceProblems.push(
          `${where}: \`spec\` claims "${notM3}" as an M3 source, which research ` +
            `ruled NON-M3 (T4-V2 / the m3 taxonomy) — the claim is false`,
        );
      }
    }
    const testedBy = fieldValue(row, "testedBy");
    if (testedBy) {
      const named = testedBy
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean);
      if (named.length === 0) {
        provenanceProblems.push(`${where}: \`testedBy\` names no suite`);
      }
      for (const suite of named) {
        // An explicit "none …" marker is a DELIBERATE, recorded absence: this
        // row is unproven on that side and the manifest says so. It is reported
        // separately rather than treated as a pass, because a row nothing tests
        // is a claim, not a contract.
        if (/^none\b/i.test(suite)) {
          uncoveredRows.push(`${where}: ${suite}`);
          continue;
        }
        // Cross-renderer means the suite lives in a `src/parity/` DIRECTORY, not
        // that its FILENAME happens to contain "parity". The filename heuristic
        // was wrong: `carousel.rntest.tsx` is a parity suite despite the name,
        // and mislabelling it printed rows as pending after they were genuinely
        // covered. A naming convention is not a property.
        if (!paritySuites.has(suite)) {
          const suites = componentOnly.get(where) ?? [];
          suites.push(suite);
          componentOnly.set(where, suites);
        }
        // EXACT basename equality, not `startsWith`. `startsWith` accepts a
        // truncated claim — "overlays.test.ts" matches "overlays.test.tsx" on
        // disk — so a typo'd `testedBy` would pass the "file exists" check.
        // (review-m3, hardening #1)
        const known = suiteNames.has(suite);
        if (!known) {
          provenanceProblems.push(
            `${where}: \`testedBy\` names "${suite}" — no such test file on disk`,
          );
        }
      }
    }
    for (const field of ["behaviour", "webContract", "nativeContract"]) {
      const value = fieldValue(row, field);
      // "base ui" with a space is the form prose actually uses; the hyphenated
      // package name is not. A mutation caught this by writing "Base UI Switch
      // root" and sailing straight through.
      if (value && /base[\s-]?ui|data-slot|aria-|querySelector/i.test(value)) {
        provenanceProblems.push(
          `${where}: \`${field}\` names a web mechanism — the contract must stay primitive-agnostic`,
        );
      }
    }
  }
  if (rowBlocks.length === 0) {
    provenanceProblems.push(
      "no parity rows parsed from the contract — the row-splitting regex no longer matches",
    );
  }
  if (provenanceProblems.length > 0) {
    violations.push(
      "parity rows are missing provenance:\n    - " +
        provenanceProblems.join("\n    - "),
    );
  }
  if (uncoveredRows.length > 0) {
    console.log(
      `  declared-uncovered  ${uncoveredRows.length} (recorded, not passing):`,
    );
    for (const u of uncoveredRows) console.log(`      ${u}`);
  }
  // A row covered only by component-level suites has NO cross-renderer test, so
  // P2b-4's ">=1 cross-renderer test per row" is not met for it. Those rows used
  // to pass silently, which is the same "passes because it did not look" family
  // the elevation gate had. Printed, not enforced: these are real, correct
  // components tested on both sides independently -- what is missing is a suite
  // that consumes the row, which is P2b-4's job. (review-m3, hardening #2)
  if (componentOnly.size > 0) {
    console.log(
      `  cross-renderer pending  ${componentOnly.size} (component-covered only):`,
    );
    for (const [where, suites] of componentOnly) {
      console.log(`      ${where}: ${suites.join(" / ")}`);
    }
  }
}

// ------------------------------------------- P2b-5: reachability of registry rows
//
// Third instance of the same class, and the reason this is a gate rather than
// another careful read:
//
//   1. `themes.m3` staleness -- a name the source still used but the theme layer
//      had already renamed.
//   2. an elevation row keyed to a component that measured no file at all.
//   3. Drawer / Popover / ScrollArea -- implemented, internally tested, counted
//      as SHARED concepts and recorded as component-covered, while NONE of them
//      was re-exported from the package index. A consumer could not import one.
//
// The common cause: the registry is derived by scanning source FILES. So an
// unexported component is indistinguishable from a shipped one, and every
// claim built on top of it is false while every gate stays green.
//
// This asserts the property the registry actually needs: a component counted as
// present on a platform must be reachable from that package's PUBLIC entry.
//
// READS THE BUILT `dist/index.d.ts`, not the source. The source is the thing
// that has been lying: `overlay-surfaces.tsx` exported all three correctly, and
// only the package index omitted them. Reading dist is also the honest artefact
// — it is what a consumer's TypeScript resolves against.
//
// If dist is absent (a cold checkout, or before the first build) this reports
// CANNOT VERIFY rather than passing. A gate that skips because it could not look
// is the failure mode this whole programme keeps paying for.
{
  const PKG_FOR = {
    web: "packages/kern",
    native: "packages/kern-native",
  };

  // Reuses the SAME concept sets the counts above are printed from, so the
  // gate cannot claim reachability for a component the counts do not have.
  const webConceptsClaimed = webConcepts;
  const nativeConceptsClaimed = nativeConcepts;
  const platformNames = {
    web: webConceptsClaimed,
    native: nativeConceptsClaimed,
  };
  const reachabilityProblems = [];
  const unverifiable = [];

  /**
   * Only the trailing `export { ... }` list counts.
   *
   * This was wrong at first and mutation-proving caught it: the bundled `.d.ts`
   * contains a `declare function ScrollArea` for the component EVEN WHEN the
   * package index does not re-export it, because the bundler traverses the whole
   * module it pulled in. Reading declarations therefore reported an unexported
   * component as reachable -- the exact defect this gate exists to catch.
   *
   * The final `export { ... }` list IS the public entry, and nothing else is.
   */
  const exportedNames = (dts) => {
    const names = new Set();
    for (const block of dts.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of block[1].split(",")) {
        const name = part
          .split(" as ")
          .pop()
          .trim()
          .replace(/^type\s+/, "");
        if (name && /^[A-Za-z_$][\w$]*$/.test(name)) names.add(name);
      }
    }
    return names;
  };

  // A package can publish MORE THAN ONE public entry. `@xoroh/kern` ships
  // `./start` as a subpath (see its package.json `exports`), which is where Pane,
  // ListDetail, TopAppBar, Sidebar, SearchBar and the scaffolds live. Reading
  // only `dist/index.d.ts` reported all of them unreachable — a FALSE positive
  // against components that are demonstrably importable, which would have driven
  // someone to "fix" a public entry that is already correct.
  //
  // So: read every `.d.ts` the package's own `exports` map points at. The map is
  // the contract, so it is the thing to follow — a hardcoded list would drift
  // from it exactly the way this did.
  const publicEntryTypes = (dir) => {
    const pkg = JSON.parse(
      readFileSync(join(ROOT, dir, "package.json"), "utf8"),
    );
    const out = new Set();
    for (const value of Object.values(pkg.exports ?? {})) {
      const entry =
        typeof value === "string"
          ? value
          : (value?.import?.types ?? value?.require?.types ?? null);
      if (!entry?.endsWith(".d.ts")) continue;
      out.add(join(ROOT, dir, entry.replace(/^\.\//, "")));
    }
    // A package with no `exports` map still has a main entry.
    if (out.size === 0) out.add(join(ROOT, dir, "dist", "index.d.ts"));
    return [...out];
  };

  const distFor = {};
  for (const [platform, dir] of Object.entries(PKG_FOR)) {
    const files = publicEntryTypes(dir);
    const names = new Set();
    let anyRead = false;
    for (const file of files) {
      try {
        for (const n of exportedNames(readFileSync(file, "utf8"))) names.add(n);
        anyRead = true;
      } catch {
        // A declared entry that is not built yet is reported, not ignored.
      }
    }
    distFor[platform] = anyRead ? names : null;
  }

  for (const [platform, names] of Object.entries(distFor)) {
    if (names === null) {
      unverifiable.push(
        `${platform}: no dist/index.d.ts — run \`bun run build\` before relying on this`,
      );
      continue;
    }
    // Every registry component claimed on this platform must be reachable.
    const claimed = platformNames[platform] ?? new Set();
    for (const component of claimed) {
      // Kebab -> Pascal over EVERY segment. Capitalising only the first made
      // `time-picker` look for `Time` and `split-button` for `Split`, which
      // reported nine perfectly reachable components as missing — a gate that
      // cries wolf is worse than no gate.
      const pascal = component
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      // A compound PART (e.g. `input-otp-root`) is reachable when its ROOT is.
      const root = component.split("-")[0];
      const rootPascal = root.charAt(0).toUpperCase() + root.slice(1);
      // camelCase too: the registry counts hooks and helpers
      // (`useFieldset`, `pageWindow`, `pressIsCancelled`) alongside components,
      // and those are exported in camelCase. This gate asserts REACHABILITY,
      // not "is a component" -- so both spellings count as reachable.
      const camel = component.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      // A NAME-MAPPED concept is reachable under EITHER export name. The
      // classification resolves `boot-splash` to `boot-indicator`, so checking
      // reachability against `BootSplash` alone would report a false violation
      // against a component that is exported and importable under its twin.
      const twin = twinOf(component);
      const twinPascal = twin
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
      const twinCamel = twin.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (
        !names.has(pascal) &&
        !names.has(rootPascal) &&
        !names.has(camel) &&
        !names.has(twinPascal) &&
        !names.has(twinCamel)
      ) {
        reachabilityProblems.push(
          `\`${component}\` is counted present on ${platform} but ` +
            `\`${pascal}\` is not exported from ${PKG_FOR[platform]}'s public entry`,
        );
      }
    }
  }

  if (reachabilityProblems.length > 0) {
    violations.push(
      "registry rows are not reachable from the public entry:\n    - " +
        reachabilityProblems.join("\n    - "),
    );
  }
  if (unverifiable.length > 0) {
    console.log(`  reachability  UNVERIFIABLE (${unverifiable.length}):`);
    for (const u of unverifiable) console.log(`      ${u}`);
  }
}
if (violations.length > 0) {
  console.error(`\ncheck:parity FAILED — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log(
  "\nparity contract passes: boundary held, counts match the registry, no phantom rows, ruled asymmetries intact,\n and every kern-primitives module is reachable from its source AND built barrel",
);

// ------------------------------------------------------------------- helpers
function collectSourceFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...collectSourceFiles(full));
    else if (/\.(ts|tsx|mts|cts|js|mjs)$/.test(e.name)) out.push(full);
  }
  return out;
}
