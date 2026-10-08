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
 * 3. Zero orphans: every top-level route must be reachable from at least one
 *    chrome surface — the docs sidebar (NAV_LEAVES), the header tabs and
 *    drawer (PRIMARY_TABS in site-header.tsx, SECONDARY in
 *    mobile-drawer.tsx), the docs-context rail (RAIL_ITEMS in app-rail.tsx),
 *    the footer, or the ⌘K palette (/search, opened from every page).
 *    Anything still unlisted fails. Some routes are destinations, not
 *    wayfinding — the rail and footer are what keep them listed, so the
 *    omission from the sidebar stays a decision, not drift. Redirect stubs
 *    (`throw redirect(...)` — the old paths kept as aliases after a move)
 *    are exempt: they are reached through their target, not the nav.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const nav = await import(join(SITE, "src", "systems", "nav.ts"));
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

// Routes with no nav leaf: walk the whole route tree recursively. A route is
// covered when any chrome surface reaches it: the sidebar leaves above, the
// header tabs and drawer (one PRIMARY_TABS list feeds both, plus the
// drawer's secondary list), the docs-context rail (RAIL_ITEMS), the footer,
// or the ⌘K palette (/search opens from every page via header, drawer, and
// keyboard). Anything left over is an orphan and fails. The walk used to
// stop one level deep, so nested hubs (foundations/theme, components/web,
// components/mobile, legal/*) were never scanned — a hub added without a
// nav entry passed silently. Dynamic segments ($page, $platform, $component)
// are skipped: they are instances of their hub, reached through it.
const covered = new Set([...seen.keys()]);
for (const file of [
  join(SITE, "src", "components", "chrome", "site-header.tsx"),
  join(SITE, "src", "components", "chrome", "mobile-drawer.tsx"),
  join(SITE, "src", "components", "chrome", "app-rail.tsx"),
  join(SITE, "src", "components", "chrome", "footer.tsx"),
]) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/href\s*[:=]\s*["'](\/[^"'#?]*)["']/g)) {
    covered.add(m[1]);
  }
}
// /search has no <a href> pointing at it — the palette navigates by router
// and links out to /search?q= — but it opens from every page, so it counts.
covered.add("/search");
const unlisted = [];
/**
 * Redirect stubs (`throw redirect(...)`) are aliases of their target, not
 * orphan destinations — reached through the page they point at.
 */
function isRedirectAlias(file) {
  try {
    return /throw\s+redirect\s*\(/.test(readFileSync(file, "utf8"));
  } catch {
    return false;
  }
}
function topRoutes(dir, prefix) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_") || e.name.startsWith("-")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      // Dynamic group segments have no URL of their own.
      if (e.name.startsWith("$") || e.name.startsWith("(")) continue;
      topRoutes(full, `${prefix}/${e.name}`);
      continue;
    }
    if (!e.name.endsWith(".tsx")) continue;
    const base = e.name.replace(/\.tsx$/, "");
    if (base.startsWith("$") || base === "__root") continue;
    const href = base === "index" ? prefix || "/" : `${prefix}/${base}`;
    if (!covered.has(href) && !isRedirectAlias(full)) unlisted.push(href);
  }
}
topRoutes(join(SITE, "src", "routes"), "");

if (failures.length || unlisted.length) {
  console.error("check-nav FAILED:\n");
  for (const f of failures) console.error(`  - ${f}`);
  for (const href of unlisted)
    console.error(`  - orphan route "${href}" — reachable from no chrome surface.`);
  process.exit(1);
}
console.log(
  `check-nav passes: ${leaves.length} nav hrefs all resolve to route files, no duplicates, no orphan routes.`,
);
