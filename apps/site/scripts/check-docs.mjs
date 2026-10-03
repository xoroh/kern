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
//   4. no page contains a raw hex colour, a dp/px literal, or a bare
//      dimension ("48x48") — the class that used to slip past.
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
import { existsSync, readdirSync, readFileSync } from "node:fs";
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

/** Non-rendering exports: pure functions and hooks, where elevation is not applicable. */
const noVisualForm = [];

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
// The elevation and role inventories live in `packages/kern-tokens/src`. Those
// module and symbol names are being renamed (m3-* -> kern-*) under us, and
// this gate must not break when they are. Resolve by candidate: try the new
// name first, fall back to the old, and pick whichever exported symbol exists.
// Content prose may keep saying "M3" where it genuinely cites the Google spec
// — that rename does not touch doc prose — but TOOLING must not hardcode a
// name that is in flight.
async function loadFirstModule(candidates) {
  const problems = [];
  for (const rel of candidates) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) continue;
    try {
      // A candidate can exist and still fail to evaluate — mid-rename, a file
      // is briefly present with duplicate declarations. Try it and move on
      // rather than dying on the first broken name.
      return await import(p);
    } catch (err) {
      problems.push(`${rel}: ${err.message}`);
    }
  }
  throw new Error(
    `check-docs: no usable module among [${candidates.join(", ")}]\n` +
      problems.map((p) => `  - ${p}`).join("\n"),
  );
}

function pickExport(mod, names, what) {
  for (const n of names) {
    if (mod[n] !== undefined) return mod[n];
  }
  throw new Error(
    `check-docs: none of ${names.join(" / ")} are exported from the ${what} module`,
  );
}

const elevationModule = await loadFirstModule([
  "packages/kern-tokens/src/kern-elevation.ts",
  "packages/kern-tokens/src/m3-elevation.ts",
]);

const ELEVATION_COMPONENTS = pickExport(
  elevationModule,
  ["KERN_ELEVATION_COMPONENTS", "ELEVATION_COMPONENTS"],
  "elevation",
);
const KERN_UNASSIGNED_ELEVATION = pickExport(
  elevationModule,
  ["KERN_UNASSIGNED_ELEVATION"],
  "elevation",
);
const ELEVATION_LEVELS = pickExport(
  elevationModule,
  ["ELEVATION_LEVELS"],
  "elevation",
);
/**
 * The deviation-id registry.
 *
 * These ids are NOT kern-tokens artefacts — they are the K-01 deviation
 * programme's allow-list, and the single source of truth is
 * `.team/programs/K-01-deviations.md`. Generating from that file rather than
 * from the two token-module constants is deliberate: the token modules carry
 * only K2 (status roles) and K6 (elevation decisions), so reading them alone
 * rejects valid declarations — K1 (Inter), K5 (shape), K7 (motion), K8
 * (naming), K9 (fixed accents) and K10 (kern extensions) all FAIL against the
 * narrow set, and the conformance section could not render half the registry.
 *
 * Falls back to the declared K1..K10 if the registry is unreadable, so the
 * gate degrades to permissive rather than to wrong.
 */
function registeredDeviationIds() {
  // `.team` lives at the monorepo root, NOT under kern/ — but the gate must
  // not assume the checkout layout (a kern-only clone has neither). Try the
  // monorepo sibling first, then a kern-internal copy, then the hardcoded
  // K1..K10 fallback. Resolving wrong (or silently falling back) is exactly
  // how K11 — registered in the md file — was rejected as unknown.
  const candidates = [
    join(ROOT, "..", ".team", "programs", "K-01-deviations.md"),
    join(ROOT, ".team", "programs", "K-01-deviations.md"),
  ];
  const fallback = [
    "K1",
    "K2",
    "K3",
    "K4",
    "K5",
    "K6",
    "K7",
    "K8",
    "K9",
    "K10",
  ];
  const registry = candidates.find((c) => existsSync(c));
  if (!registry) return new Set(fallback);
  const text = readFileSync(registry, "utf8");
  const ids = new Set();
  for (const row of text.matchAll(/^\|\s*(K\d+)\s*\|/gm)) ids.add(row[1]);
  // A registry we can read but that yields nothing is a parsing failure, not
  // an empty allow-list — that would reject every deviation silently.
  return ids.size > 0 ? ids : new Set(fallback);
}

const REGISTERED_DEVIATION_IDS = registeredDeviationIds();

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

  if (level === "none") {
    // Non-rendering export — a pure function or a hook. Elevation is not
    // applicable, and this must not be conflated with "conformant without a
    // token" (a component with no elevation token) or with a gap (a page
    // claiming a level nothing backs). Reported on its own line so the
    // distinction survives into the summary.
    //
    // GUARD: `none` must not become a way for a real component to dodge its
    // elevation row. React components are PascalCase by convention; pure
    // functions and hooks are not. So a page claiming `none` while owning a
    // PascalCase export is rejected. Mutation-tested: setting `drawer`'s
    // elevation to "none" used to pass silently and now fails.
    const rendered = (doc.parts ?? []).filter((part) => /^[A-Z]/.test(part));
    if (rendered.length > 0) {
      fail(
        at(
          `elevation "none" is for non-rendering exports, but ${rendered.join(", ")} is PascalCase — a component must declare a real level`,
        ),
      );
      return;
    }
    noVisualForm.push(file);
    return;
  }

  if (level !== "surface" && !ELEVATION_LEVELS.includes(level)) {
    fail(
      at(
        `elevation ${JSON.stringify(level)} is not an M3 level (0-5), "surface" or "none"`,
      ),
    );
    return;
  }

  const spec = ELEVATION_COMPONENTS[slug];
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
    // kern's own decision — M3 has no row for this component.
    //
    // The registry records EITHER a deviation id (K1–K10) OR, where the
    // decision is not registered to one, a `kern-decision: …` message. Both
    // are values `KERN_UNASSIGNED_ELEVATION` has carried, so the gate handles
    // both rather than assuming one shape and silently passing the other.
    if (level === "surface") {
      fail(
        at(
          `elevation is registered as a kern decision (${kernDecision}) but the page claims "surface"`,
        ),
      );
    }
    const deviations = doc.deviations ?? [];
    const ids = deviations.map((d) => d.id);

    if (kernDecision.startsWith("kern-decision:")) {
      // Not registered to a K-id. The page must still OWN the decision in
      // words. review-showcase's claims ruling (2026-10-02) permits this in
      // place of a synthetic id — "where M3 defines no row there is nothing to
      // deviate from" — under four conditions, all enforced here:
      //
      //  (a) the wording states the ABSENCE explicitly and never claims
      //      conformance. "per spec" is a lie in this position: there is no
      //      spec row to be per. Checked negatively as well as positively.
      //  (b) the decision stays machine-readable in
      //      KERN_UNASSIGNED_ELEVATION — that map IS the registry, and this
      //      gate reads it rather than a copy.
      //  (c) SPECS-1: absence must be verifiable, so the deviation must also
      //      name what M3 DOES tabulate. An uncheckable "M3 says nothing" is
      //      a claim about a document nobody consulted.
      //  (d) a K1–K10 id is required exactly where an M3 rule IS departed
      //      from — handled by the branch below. Nothing enters by words
      //      alone where a rule exists to break.
      //
      // The negation and the naming verb appear in either order across the
      // pages — "does not name a drawer" and "names no popover" are the same
      // claim — so both shapes are matched. Requiring a MATERIAL 3 negation,
      // not just any "no": a stray "no" elsewhere in the spec must not pass.
      const assertsNoM3Row = (spec) =>
        /\b(M3|Material 3|elevation table)\b/i.test(spec) &&
        (/\b(no|not|never|does not|doesn't|isn't|is not)\b[^.]*\b(tabulat|nam|row|spec)/i.test(
          spec,
        ) ||
          /\b(tabulat|nam|row|spec)[^.]*\b(no|not|never)\b/i.test(spec));

      // (a) — conformance language is a lie when there is no row to conform
      // to. "per spec", "conformant", "as the spec defines" all assert a
      // source that does not exist for this component.
      const claimsConformance = (spec) =>
        /\b(per spec|per the spec|as (the )?spec (defines|requires|says|states)|conformant|conforms|spec-compliant|by the spec)\b/i.test(
          spec,
        );

      // (c) — name what M3 DOES tabulate, so the absence can be checked.
      //
      // Requires `tabulat`-language AND a level reference, not merely any
      // naming verb anywhere. The looser version had a real hole, caught by
      // mutation: the ABSENCE sentence itself — "M3's elevation table NAMES no
      // popover" — contains "name" and "elevat", so an unverifiable absence
      // passed. What distinguishes the two is that a checkable absence names
      // the ROWS M3 has: "It tabulates \"menu\" and \"rich tooltip\" at level
      // 2". Requiring the tabulate verb plus a level reference asks for
      // exactly that and nothing looser.
      const namesWhatM3Says = (spec) =>
        /\btabulat/i.test(spec) && /\blevel\s*\d/i.test(spec);

      for (const d of deviations) {
        const spec = d.spec ?? "";
        if (claimsConformance(spec)) {
          fail(
            at(
              `deviation "${d.id}" claims conformance ("per spec" / "conformant") while the elevation is a kern decision — M3 defines no resting elevation for this component, so there is nothing to conform to. State the absence.`,
            ),
          );
          continue;
        }
        if (assertsNoM3Row(spec) && !namesWhatM3Says(spec)) {
          fail(
            at(
              `deviation "${d.id}" asserts M3 has no row but never says what M3 DOES tabulate — the absence is unverifiable. Name the rows M3 does have (SPECS-1).`,
            ),
          );
        }
      }

      const owns = deviations.some((d) => assertsNoM3Row(d.spec ?? ""));
      if (!owns) {
        fail(
          at(
            `elevation is a kern decision (M3 does not tabulate this component) but section 5 carries no deviation saying so — a deliberate choice is reading as conformance`,
          ),
        );
      }
      return;
    }

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
    // `ELEVATION_COMPONENTS`, not M3's whole table, so it must not assert
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
    if (!d.spec || !d.kern || !d.why) {
      fail(
        at(
          `deviation ${d.id} must state what the spec specifies, what kern does, and why`,
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
  // The value classes a page must not paste. TIGHTENED 2026-10-02: the bare
  // dimension class ("48x48", "32x4", "48 × 48") used to pass every pattern
  // here, because a dp value written WITHOUT its dp suffix is still a dp
  // value — the suffix is not what makes the number stale. A bare `48px` is
  // the same value wearing a web unit, so it is caught too.
  const RAW = [
    ["raw hex colour", /#[0-9a-fA-F]{3,8}\b/],
    ["raw dp value", /\b\d+(?:\.\d+)?\s*dp\b/],
    ["raw px value", /\b\d+(?:\.\d+)?\s*px\b/],
    ["raw dimension value", /\b\d+(?:\.\d+)?\s*[xX×]\s*\d+(?:\.\d+)?\b/],
  ];

  // Everything a reader sees as prose — including the API table's Notes
  // column, which is where "a 48x48 icon button" was hiding in plain sight.
  // Code identifiers in backticks are exempt: naming
  // `--md-sys-color-primary` is the rule, not the violation.
  const prose = [
    doc.oneLiner,
    doc.features,
    ...(doc.customization?.supported ?? []),
    ...(doc.customization?.notSupported ?? []),
    ...(doc.deviations ?? []).flatMap((d) => [d.spec, d.kern, d.why]),
    ...(doc.aria ?? []),
    ...(doc.usage?.do ?? []),
    ...(doc.usage?.dont ?? []),
    ...(doc.accessibilityGaps ?? []),
    ...(doc.keyboard ?? []).map((row) => row.action),
    ...(doc.anatomy ?? []).map((part) => part.role),
    ...(doc.api ?? []).map((row) => row.note),
  ].filter(Boolean);

  for (const text of prose) {
    const bare = text.replace(/`[^`]*`/g, "");
    for (const [label, re] of RAW) {
      const hit = bare.match(re);
      if (hit) {
        fail(at(`${label} in prose ("${hit[0]}") — link the token`));
      }
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

// Two rows with the same prop name are a defect twice over: the table reads as
// a contradiction, and the renderer keys rows by name so a duplicate is a key
// collision. A prop that genuinely has two roles (ToggleGroup's `value`) is
// ONE row saying so, not two rows fighting.
function checkApiUnique({ file, doc }) {
  const seen = new Map();
  for (const row of doc.api ?? []) {
    if (seen.has(row.name)) {
      fail(
        `${file}: api table lists \`${row.name}\` twice — merge the roles into one row, ` +
          `a duplicate prop name contradicts itself and breaks the table`,
      );
    }
    seen.set(row.name, true);
  }
}

// ------------------------------------------------------- edit target exists
/**
 * M4's gate. "Edit this page" DERIVES its target from the platform and slug,
 * so it cannot drift — but deriving is not the same as being right. A link to
 * a file that is not there is exactly the class of defect this replaces, so
 * the derived path is checked against disk on every run.
 *
 * `meta.editUrl` is an explicit override for pages whose content does not live
 * at the conventional path; when present it must point into this repo's
 * `apps/site/src/content/`, otherwise it is a link to somewhere else entirely.
 */
function checkEditTarget({ platform, file, doc }) {
  const at = (msg) => `${file}: ${msg}`;
  const explicit = doc.meta.editUrl;

  if (explicit) {
    const m = explicit.match(
      /github\.com\/[^/]+\/[^/]+\/(?:edit|blob)\/[^/]+\/(.+)$/,
    );
    if (!m) {
      errors.push(
        at(
          `meta.editUrl is not a GitHub edit/blob link in this repo: "${explicit}" — ` +
            `the reader clicks "Edit this page" and lands nowhere useful`,
        ),
      );
      return;
    }
    const onDisk = join(ROOT, m[1]);
    if (!existsSync(onDisk)) {
      errors.push(
        at(
          `meta.editUrl points at "${m[1]}" which does not exist on disk — ` +
            `a derived or explicit edit link to a missing file is a dead end`,
        ),
      );
    }
    return;
  }

  const rel = `apps/site/src/content/${platform}/${doc.slug}.ts`;
  const onDisk = join(ROOT, rel);
  if (!existsSync(onDisk)) {
    errors.push(
      at(
        `"Edit this page" derives "${rel}" from the slug, but that file does ` +
          `not exist — set meta.editUrl to the real content file`,
      ),
    );
  }
}

// ------------------------------------------------------- usage half-pairs
/**
 * m2 — a half-authored Do/Don't pair renders with a one-sided note (a Do
 * without a Don't still states the Do half; the note names what's missing).
 * What is NOT correct is leaving it half-written: the template renders
 * gracefully, and the gate fails loudly to drive completion. Render
 * gracefully + fail loudly, not one or the other.
 */
function checkUsage({ file, doc }) {
  const at = (msg) => `${file}: ${msg}`;
  const use = doc.usage;
  if (!use) return;
  const hasDo = (use.do ?? []).length > 0;
  const hasDont = (use.dont ?? []).length > 0;

  if (hasDo && !hasDont) {
    errors.push(
      at(
        `usage has ${(use.do ?? []).length} Do item(s) and no Don't — a half ` +
          `pair. It renders with a one-sided note; complete the pair or remove it.`,
      ),
    );
  }
  if (hasDont && !hasDo) {
    errors.push(
      at(
        `usage has ${(use.dont ?? []).length} Don't item(s) and no Do — a half ` +
          `pair. It renders with a one-sided note; complete the pair or remove it.`,
      ),
    );
  }
  if (!hasDo && !hasDont) {
    errors.push(
      at(
        `usage is present but both halves are empty — drop the field rather ` +
          `than shipping an empty pair.`,
      ),
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
  checkApiUnique(page);
  checkEditTarget(page);
  checkUsage(page);
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

// The undocumented remainder, listed per platform and by name. "Web is
// finished" is only a meaningful sentence if the gate can show the empty list,
// so print what is missing rather than only how many. A count hides whether
// the leftovers are one compound family or fifty orphan rows.
function orphansOn(platform) {
  const rows = [];
  for (const key of inventory.keys()) {
    if (!key.startsWith(`${platform}:`)) continue;
    const exportName = key.slice(platform.length + 1);
    if (!documented.has(`${platform}:${exportName}`)) rows.push(exportName);
  }
  return rows.sort();
}
for (const platform of ["web", "mobile"]) {
  const rows = orphansOn(platform);
  console.log(
    `\ncheck-docs: ${platform} — ${rows.length} undocumented export(s) remaining`,
  );
  if (rows.length === 0) {
    console.log(
      `  ok   ${platform} is closed: every inventory export has a page`,
    );
    continue;
  }
  for (const name of rows) console.log(`  -    ${name}`);
}
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
if (noVisualForm.length > 0) {
  console.log(
    `\ncheck-docs: ${noVisualForm.length} non-rendering export(s) — pure functions and hooks, elevation not applicable:`,
  );
  for (const n of noVisualForm) console.log(`  ok   ${n}`);
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
