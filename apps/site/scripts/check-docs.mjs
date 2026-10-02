// The per-component documentation gate.
//
// `docs/conventions/component-docs.md` specifies the page grammar and states
// that the validator lands with the first page — "a validator that passes over
// zero pages is the 'gate that passes while changing nothing' failure mode, so
// none is written yet". This is that validator, and it asserts what the
// convention says it asserts:
//
//   1. the six sections, in order, with required/conditional respected;
//   2. the metadata strip's elevation matches `m3-elevation.ts`;
//   3. the status matches the generated inventory;
//   4. no page contains a raw hex colour or a dp literal.
//
// Plus the checks the contract implies and a page cannot self-certify:
//
//   5. a deviation id resolves to a registered id (else it is an undocumented
//      fork, not a deviation);
//   6. a component whose elevation is a kern decision carries that decision's
//      deviation id;
//   7. every part a family claims exists in the generated inventory, and no
//      export is claimed by two families;
//   8. at least one content page exists — the failure mode the convention
//      names, made impossible.
//
// GAPS are reported but do not fail: a component that neither elevation
// inventory covers has an unasserted elevation, and a manifest row with no
// content folder is undocumented. Both are stated in the output so coverage
// shrinks under the gate instead of growing quietly.
//
// Run from apps/site:
//   bun run check:docs
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const ROOT = join(APP, "..", "..");
const CONTENT = join(APP, "src", "content");
const INVENTORY = join(ROOT, "docs", "components.md");

const errors = [];
const gaps = [];
/**
 * Not a gap and not a pass silently: a component M3 places at resting level 0
 * with no elevation token on the component. Level 0 IS `shadow: none`, so
 * shipping no token is the conformant state — `ed3c3e1` established this and
 * changed `auditElevation` to match. Reporting these as gaps would say "we do
 * not know" about something we know exactly; reporting them as nothing would
 * hide the six rows that are gated on an absence rather than a value.
 */
const conformantNoToken = [];
/**
 * The other half of the same distinction. A component that carries no
 * elevation token and that M3 does not tabulate has nothing to assert — that
 * is a fact about the component, not a hole in our knowledge. Calling it a
 * gap would say "we do not know" about something we know exactly, and it
 * would bury the gaps that are real: a page that CLAIMS a numeric level
 * nothing backs.
 */
const noElevationConcept = [];

function fail(msg) {
  errors.push(msg);
}
function gap(msg) {
  gaps.push(msg);
}
function conformant(msg) {
  conformantNoToken.push(msg);
}
function noConcept(msg) {
  noElevationConcept.push(msg);
}

// ---------------------------------------------------------------- inventory
// docs/components.md is the generated inventory and the authority for status.
// Parsed with the same row shape `generate-manifest.mjs` reads.
const PLATFORMS = { Web: "web", Native: "mobile" };
const inventory = new Map(); // "web:Button" (export) -> "real" | "stub"
const inventoryNames = new Set(); // "web:button" (URL slug) -> present
const byPlatform = { web: new Set(), mobile: new Set() };

const source = readFileSync(INVENTORY, "utf8");
for (const block of source.split(/^## /m).slice(1)) {
  const heading = block.slice(0, block.indexOf("\n")).trim();
  const platform = PLATFORMS[heading.replace(/\s*\(.*\)$/, "")];
  if (!platform) continue;
  for (const row of block.matchAll(
    /^\| `([^`]+)` \| `([^`]+)` \| (real|stub) \|$/gm,
  )) {
    // row[1] is the kebab name — the URL segment the route resolves on.
    // row[2] is the exported symbol — what the demo registry keys on. Both
    // matter and they are not interchangeable: the canonical URL is built
    // from the name, the pages document the export.
    inventoryNames.add(`${platform}:${row[1]}`);
    inventory.set(`${platform}:${row[2]}`, row[3]);
    byPlatform[platform].add(row[2]);
  }
}

// ------------------------------------------------------- elevation + roles
const { M3_ELEVATION_COMPONENTS, KERN_UNASSIGNED_ELEVATION, ELEVATION_LEVELS } =
  await import(join(ROOT, "packages/kern-tokens/src/m3-elevation.ts"));
const { KERN_EXTRA_ROLES } = await import(
  join(ROOT, "packages/kern-tokens/src/m3-roles.ts")
);

const REGISTERED_DEVIATION_IDS = new Set([
  ...Object.values(KERN_EXTRA_ROLES),
  ...Object.values(KERN_UNASSIGNED_ELEVATION),
]);

// ------------------------------------------------------------- the content
// Same discovery the site does, walked with readdirSync because this runs in
// Node without Vite. Every folder under web/ and mobile/ is one page.
async function loadContent() {
  const docs = [];
  for (const platform of ["web", "mobile"]) {
    const dir = join(CONTENT, platform);
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    } catch {
      continue;
    }
    for (const file of files.sort()) {
      const mod = await import(join(dir, file));
      for (const value of Object.values(mod)) {
        if (value && typeof value === "object" && "slug" in value) {
          docs.push({ platform, file: `${platform}/${file}`, doc: value });
        }
      }
    }
  }
  return docs;
}

const pages = await loadContent();

if (pages.length === 0) {
  // The failure mode the convention names. A validator that would pass over
  // zero pages is not a validator.
  fail(
    "no content pages found under src/content/ — the gate would pass while " +
      "asserting nothing",
  );
}

// ------------------------------------------------------------ section rules
function checkSections({ file, doc }) {
  const at = (msg) => `${file}: ${msg}`;

  // Required fields — the grammar's required sections must be non-empty.
  if (!doc.name) fail(at("missing `name` (section: header)"));
  if (!doc.oneLiner || doc.oneLiner.length > 200) {
    fail(at("`oneLiner` must be one sentence (<= 200 chars)"));
  }
  if (!doc.features || doc.features.trim().length === 0) {
    fail(at("section 3 `features` is required and must not be empty"));
  }

  // Section 1 — metadata strip. Every field cross-checked by another gate, so
  // a missing one is not prose, it is an unverifiable claim.
  const meta = doc.meta;
  if (!meta) {
    fail(at("section 1 `meta` is required"));
  } else {
    if (!["real", "stub"].includes(meta.status)) {
      fail(at("`meta.status` must be `real` or `stub`"));
    }
    if (!meta.package) fail(at("`meta.package` is required"));
    if (!meta.nativePeer) fail(at("`meta.nativePeer` is required"));
    if (!Array.isArray(meta.variants)) {
      fail(at("`meta.variants` must be an array of axes (empty = none)"));
    }
  }

  // Section 6 — API is required and must not be empty.
  if (!Array.isArray(doc.api) || doc.api.length === 0) {
    fail(at("section 6 `api` is required and must have at least one row"));
  } else {
    for (const row of doc.api) {
      if (!row.name || !row.type) {
        fail(at(`api row ${row.name ?? "?"} needs both \`name\` and \`type\``));
      }
    }
  }

  // Sections 4 and 5 are conditional. A present-but-empty one is noise, and
  // the convention says to cut it rather than ship a heading over nothing.
  if (doc.customization) {
    if (
      !Array.isArray(doc.customization.supported) ||
      doc.customization.supported.length === 0
    ) {
      fail(
        at(
          "section 4 `customization.supported` must not be empty when the section is present",
        ),
      );
    }
    if (!Array.isArray(doc.customization.notSupported)) {
      fail(at("section 4 `customization.notSupported` must be an array"));
    }
  }
  if (doc.deviations !== undefined) {
    if (!Array.isArray(doc.deviations) || doc.deviations.length === 0) {
      fail(at("section 5 `deviations` is present but empty — cut the section"));
    }
  }

  // Section 2 is rendered from the demo registry keyed by parts[0], so the
  // family must name at least one export or there is nothing to show.
  if (!Array.isArray(doc.parts) || doc.parts.length === 0) {
    fail(at("`parts` must name at least the root export"));
  }
}

// ------------------------------------------------------------- elevation
function checkElevation({ file, doc }) {
  const at = (msg) => `${file}: ${msg}`;
  const level = doc.meta?.elevation;
  const slug = doc.slug;

  if (level !== "surface" && !ELEVATION_LEVELS.includes(level)) {
    fail(
      at(
        `elevation ${JSON.stringify(level)} is not an M3 level (0-5) or "surface"`,
      ),
    );
    return;
  }

  const spec = M3_ELEVATION_COMPONENTS[slug];
  const kernDecision = KERN_UNASSIGNED_ELEVATION[slug];

  if (spec) {
    // M3 names this component. The page must claim a level the spec permits.
    if (level === "surface") {
      fail(
        at(
          `M3 assigns ${spec.rows.join(", ")} resting level${spec.variants.join("/")} but the page claims "surface"`,
        ),
      );
      return;
    }
    if (!spec.variants.includes(level)) {
      fail(
        at(
          `page claims elevation level${level}, M3 assigns level${spec.variants.join("/")} (${spec.rows.join(", ")})`,
        ),
      );
      return;
    }
    // A row M3 places at 0 with no token on the component: conformant, and
    // gated on the absence of a shadow so an unearned one fails upstream.
    //
    // `includes(0)`, not `every(v => v === 0)`. This is the same bug
    // `f8de215` fixed in `auditElevation` and `check:m3`, one level up: a row
    // like Card's [0, 1] permits level 0, so a card carrying no token is
    // conformant, and `every` would deny it. The two gates must stay in step.
    if (level === 0 && spec.variants.includes(0)) {
      conformant(
        `${file}: ${spec.rows.join(", ")} permits level 0 — conformant, no token (level 0 is \`shadow: none\`)`,
      );
    }
    return;
  }

  if (kernDecision) {
    // kern's own decision, registered against a deviation id. The page must
    // carry that id — otherwise a deliberate choice reads as conformance.
    if (level === "surface") {
      fail(
        at(
          `elevation is registered as a kern decision (${kernDecision}) but the page claims "surface"`,
        ),
      );
    }
    const ids = (doc.deviations ?? []).map((d) => d.id);
    if (!ids.includes(kernDecision)) {
      fail(
        at(
          `elevation is a kern decision registered as ${kernDecision}, but section 5 does not carry that deviation id`,
        ),
      );
    }
    return;
  }

  // Neither inventory names this component, and the two situations are not
  // the same thing:
  //
  //   - it carries no elevation token. Nothing in M3 asks for one and nothing
  //     in kern ships one. There is nothing to assert — that is a fact about
  //     the component.
  //   - the page CLAIMS a numeric level. No gate backs that claim, so it is a
  //     real gap and is reported as one.
  //
  // Collapsing both into "gap" would say "we do not know" about the first
  // while burying the second.
  if (level === "surface") {
    // Worded to say only what this gate can know. It reads kern's
    // `M3_ELEVATION_COMPONENTS`, not M3's whole table, so it must not assert
    // that M3 is silent about the component — only that nothing here claims a
    // level. `navigation-drawer` is the case that showed the difference: M3
    // names "navigation drawer (modal)" at level 1, kern has no row for it.
    noConcept(
      `${file}: carries no elevation token and m3-elevation.ts has no row for it — nothing asserted either way`,
    );
    return;
  }
  gap(
    `${file}: page claims elevation level${level} but m3-elevation.ts does not cover this component — the claim is unasserted by any gate`,
  );
}

// -------------------------------------------------------------- deviations
function checkDeviations({ file, doc }) {
  const at = (msg) => `${file}: ${msg}`;
  for (const d of doc.deviations ?? []) {
    if (!d.id) {
      fail(
        at("a deviation with no id is an undocumented fork, not a deviation"),
      );
      continue;
    }
    if (!REGISTERED_DEVIATION_IDS.has(d.id)) {
      fail(
        at(
          `deviation id ${d.id} is not registered in m3-roles.ts (KERN_EXTRA_ROLES) or m3-elevation.ts (KERN_UNASSIGNED_ELEVATION)`,
        ),
      );
    }
    if (!d.m3 || !d.kern || !d.why) {
      fail(
        at(
          `deviation ${d.id} must state what M3 specifies, what kern does, and why`,
        ),
      );
    }
  }
}

// ------------------------------------------------------- inventory agreement
function checkInventory({ platform, file, doc }) {
  const at = (msg) => `${file}: ${msg}`;
  const statuses = [];
  for (const part of doc.parts) {
    const key = `${platform}:${part}`;
    if (!inventory.has(key)) {
      fail(
        at(
          `part ${part} is not in the generated inventory (docs/components.md) — a page may only document what exists`,
        ),
      );
      continue;
    }
    statuses.push(inventory.get(key));
  }
  if (statuses.length === 0) return;

  // The strip's status must match every row the family owns. A family that
  // spans `real` and `stub` rows is a claim the inventory cannot back.
  const unique = new Set(statuses);
  if (unique.size > 1) {
    fail(
      at(
        `family spans mixed statuses (${[...unique].join(", ")}) — the metadata strip can only state one`,
      ),
    );
  } else if (doc.meta && doc.meta.status !== statuses[0]) {
    fail(
      at(
        `meta.status is "${doc.meta.status}" but the generated inventory says "${statuses[0]}"`,
      ),
    );
  }
}

// -------------------------------------------- consistency rule 2: no values
// "No page pastes a token value, a dp number, or a colour. Link the token.
// Values in prose are values that go stale silently."
function checkNoRawValues({ file, doc }) {
  const at = (msg) => `${file}: ${msg}`;
  const HEX = /#[0-9a-fA-F]{3,8}\b/;
  const DP = /\b\d+(?:\.\d+)?\s*dp\b/;

  // Everything a reader sees as prose. Code identifiers in backticks are
  // exempt: naming `--md-sys-color-primary` is the rule, not the violation.
  const prose = [
    doc.oneLiner,
    doc.features,
    ...(doc.customization?.supported ?? []),
    ...(doc.customization?.notSupported ?? []),
    ...(doc.deviations ?? []).flatMap((d) => [d.m3, d.kern, d.why]),
    ...(doc.aria ?? []),
  ].filter(Boolean);

  for (const text of prose) {
    const bare = text.replace(/`[^`]*`/g, "");
    if (HEX.test(bare)) {
      fail(
        at(
          `raw hex colour in prose ("${bare.match(HEX)[0]}") — link the token`,
        ),
      );
    }
    if (DP.test(bare)) {
      fail(
        at(`raw dp value in prose ("${bare.match(DP)[0]}") — link the token`),
      );
    }
  }
}

// ------------------------------------------------- export ownership + parts
const claimed = new Map(); // "web:Button" -> file
function checkOwnership({ platform, file, doc }) {
  for (const part of doc.parts) {
    const key = `${platform}:${part}`;
    const owner = claimed.get(key);
    if (owner && owner !== file) {
      fail(
        `${file}: export ${part} is already documented by ${owner} — one component, one page`,
      );
    }
    claimed.set(key, file);
  }
}

// ------------------------------------------------------- canonical slug
// kern-lead's rule: the family slug is canonical and every part URL 301s to
// it. A redirect is only as good as its target, and the target is resolved
// through the generated manifest — so a family whose slug is not itself a
// manifest row would 301 into a 404. Catch that here, not in production.
function checkCanonicalSlug({ platform, file, doc }) {
  if (!inventoryNames.has(`${platform}:${doc.slug}`)) {
    fail(
      `${file}: family slug "${doc.slug}" is not a row in the generated inventory — ` +
        `the canonical URL /components/${platform}/${doc.slug} would 404 and every ` +
        `part URL would 301 into it`,
    );
  }
}

// ------------------------------------------------------- native peer
// `meta.nativePeer` is a claim about the other renderer, and it is exactly the
// kind of claim that gets written from memory and is wrong. It was: the
// NavigationMenu page asserted native ships `NavigationDrawer`, and native
// ships `NavigationMenu`. A claim no gate backs is a claim that will drift, so
// this checks it against the generated inventory on the other platform.
function checkNativePeer({ platform, file, doc }) {
  const peer = doc.meta?.nativePeer;
  if (!peer) return;
  if (peer === "none") return; // deliberate single-renderer, allowed
  const other = platform === "web" ? "mobile" : "web";
  if (!inventory.has(`${other}:${peer}`)) {
    fail(
      `${file}: nativePeer "${peer}" is not an export in the generated inventory for ` +
        `${other} — a peer that does not exist is worse than "none"`,
    );
  }
}

// ------------------------------------------------------------------- run
for (const page of pages) {
  checkSections(page);
  checkElevation(page);
  checkDeviations(page);
  checkInventory(page);
  checkNoRawValues(page);
  checkOwnership(page);
  checkCanonicalSlug(page);
  checkNativePeer(page);
}

// Coverage: how much of the generated inventory has a page behind it. This is
// the number that is supposed to go down, and it is printed every run so a
// shrinking site is visible in the log rather than in an incident.
const documented = new Set();
for (const [key] of claimed) documented.add(key);
const total = inventory.size;
const covered = [...documented].filter((k) => inventory.has(k)).length;

console.log(`check-docs: ${pages.length} content page(s)`);
console.log(
  `check-docs: coverage ${covered}/${total} inventory exports documented (${Math.round((covered / total) * 100)}%)`,
);
if (conformantNoToken.length > 0) {
  console.log(
    `\ncheck-docs: ${conformantNoToken.length} conformant with no elevation token — asserted on absence, not a gap:`,
  );
  for (const c of conformantNoToken) console.log(`  ok   ${c}`);
}
if (noElevationConcept.length > 0) {
  console.log(
    `\ncheck-docs: ${noElevationConcept.length} with no elevation asserted — no token on the component and no row in m3-elevation.ts:`,
  );
  for (const n of noElevationConcept) console.log(`  ok   ${n}`);
}
if (gaps.length > 0) {
  console.log(`\ncheck-docs: ${gaps.length} gap(s) — reported, not failing:`);
  for (const g of gaps) console.log(`  gap  ${g}`);
}

if (errors.length > 0) {
  console.error(`\ncheck-docs: ${errors.length} error(s):`);
  for (const e of errors) console.error(`  x    ${e}`);
  process.exit(1);
}
console.log("\ncheck-docs: ok");
