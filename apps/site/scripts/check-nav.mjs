#!/usr/bin/env node
/**
 * check-nav — every nav href is a route that exists, and no route worth
 * listing is missing from the nav.
 *
 * WHY
 *
 * The sidebar's original guarantee was a comment: "every href is a route that
 * exists (verified against src/routes)". Comments rot; this gate is the same
 * guarantee executed. Single-sourcing (Part 1) concentrates the risk — one
 * file feeds sidebar, search, and llms.txt — so one gate guards the file.
 *
 * WHAT IT ASSERTS
 *
 * 1. Every NAV_LEAVES href resolves to a route file under src/routes
 *    (TanStack file-based routing: /docs/guides -> docs/guides.tsx, with
 *    /x -> x.tsx or x/index.tsx, and /components/web -> the $platform route).
 * 2. No duplicate hrefs in the nav (two leaves, one destination — the map
 *    lying about the territory).
 * 3. REPORTED, not failing: top-level route files with no nav leaf pointing
 *    at them (currently: /showcase, /legal/*). Some routes are destinations,
 *    not wayfinding — the gate lists them so the omission stays a decision.
 */
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const nav = await import(join(SITE, "src", "nav.ts"));
const leaves = nav.NAV_LEAVES;

/** Map an href to the route file(s) that could serve it. */
function candidates(href) {
  const rel = href.replace(/^\//, "");
  return [
    join(SITE, "src", "routes", `${rel}.tsx`),
    join(SITE, "src", "routes", rel, "index.tsx"),
    // Dynamic segments: /components/web/* is served by $platform.tsx.
    join(SITE, "src", "routes", rel, "$platform.tsx"),
    join(SITE, "src", "routes", rel, "$slug.tsx"),
  ];
}

const failures = [];
const seen = new Map();
for (const leaf of leaves) {
  if (seen.has(leaf.href)) {
    failures.push(
      `duplicate href "${leaf.href}" ("${seen.get(leaf.href)}" and "${leaf.label}").`,
    );
  } else {
    seen.set(leaf.href, leaf.label);
  }
  if (!candidates(leaf.href).some((f) => existsSync(f))) {
    failures.push(
      `"${leaf.label}" points at "${leaf.href}", which matches no route file.`,
    );
  }
}

// Routes with no nav leaf: walk top-level route files (one deep for groups).
const covered = new Set([...seen.keys()]);
const unlisted = [];
function topRoutes(dir, prefix) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_") || e.name.startsWith("-")) continue;
    if (e.isDirectory()) {
      const idx = join(dir, e.name, "index.tsx");
      if (existsSync(idx) && !covered.has(`${prefix}/${e.name}`)) {
        unlisted.push(`${prefix}/${e.name}`);
      }
      continue;
    }
    if (!e.name.endsWith(".tsx")) continue;
    const base = e.name.replace(/\.tsx$/, "");
    if (base.startsWith("$") || base === "__root") continue;
    const href = base === "index" ? "/" : `${prefix}/${base}`;
    if (!covered.has(href)) unlisted.push(href);
  }
}
topRoutes(join(SITE, "src", "routes"), "");

if (failures.length) {
  console.error("check-nav FAILED:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check-nav passes: ${leaves.length} nav hrefs all resolve to route files, no duplicates.`,
);
if (unlisted.length) {
  console.log(
    `unlisted routes (reported, not failing — destinations, not wayfinding): ${unlisted.join(", ")}`,
  );
}
