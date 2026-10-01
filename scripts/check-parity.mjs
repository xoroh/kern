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

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const MANIFEST = join(ROOT, "packages/mcp/src/manifest.ts");
const CONTRACT = join(ROOT, "docs/parity-contract.md");

// Suffixes that may denote a sub-part. Deliberately narrow: `-button`, `-tab`,
// `-body`, `-head` are NOT here, because a component whose own name ends in one
// of those (segmented-button) is a concept, not a part. Stripping those blind is
// exactly the bug this gate exists to make impossible to repeat silently.
const PART_SUFFIX =
  /-(root|items|item|trigger|content|list|label|value|group|empty|separator|action|close|title|description|input|provider|viewport|icon|section|panel|header|footer|handle|indicator|legend|option|column|row|group-label|item-indicator|item-text|field|message|error|step|tick)$/;

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

const webConcepts = concepts(web.map((r) => r.name));
const nativeConcepts = concepts(native.map((r) => r.name));

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
const DELIBERATE = [
  "sonner",
  "create-sonner-manager",
  "kbd",
  "native-select",
  "preview-card",
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

if (violations.length > 0) {
  console.error(`\ncheck:parity FAILED — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log(
  "\nparity contract passes: boundary held, counts match the registry, no phantom rows, ruled asymmetries intact",
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
