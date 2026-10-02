#!/usr/bin/env node
/**
 * check:spec-urls — a spec link that does not exist must FAIL.
 *
 * THE FAILURE THIS CATCHES: a page asserting Material 3 provenance with a
 * spec URL that points at nothing, or at Material 2, or at an invented path.
 * That is the single most embarrassing way to lose the "M3 reference" claim —
 * a reader clicks `M3 spec ↗` and lands nowhere.
 *
 * The trap list is not a comment here, it is enforced:
 *
 *   M3 has no Combobox        (Menus folds the exposed-dropdown)
 *   M3 has no Scrollbar       (no scroll-area either)
 *   M3 has no NumberField
 *   M3 has no OTP component
 *
 * Those are kern extensions. Their pages must say "no M3 component — kern
 * extension", and must NOT carry a specUrl at all. A specUrl on one of those
 * is a fabricated citation by construction, so it is rejected outright.
 *
 * WHAT IS VALIDATED:
 *   1. shape   — https://m3.material.io/... only. m1/m2/other hosts are the
 *                "never m2" rule, and they fail.
 *   2. path    — /components/<slug>[/<tab>] or a known section path.
 *   3. slug    — must be in m3-spec-paths.json, which is MEASURED from the
 *                live spec index and regenerated, never hand-edited. A slug
 *                absent there has no spec page.
 *   4. tab     — overview | specs | guidelines | accessibility.
 *   5. traps   — kern extensions must not carry a specUrl at all.
 *
 * The inventory being measured rather than typed is the whole point: if the
 * spec site does not have the page, our gate cannot be talked into accepting
 * it by whoever writes the content file.
 *
 * Exit 0 = every spec link resolves to a page that exists.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const CONTENT = join(APP, "src", "content");

const INVENTORY_PATH = join(HERE, "m3-spec-paths.json");

const errors = [];
const fail = (msg) => errors.push(msg);

// ------------------------------------------------------------- the inventory
if (!existsSync(INVENTORY_PATH)) {
  console.error(
    "check-spec-urls: m3-spec-paths.json is missing. That file is the " +
      "MEASURED inventory of real spec pages; without it the gate cannot " +
      "tell a real spec link from an invented one.",
  );
  process.exit(1);
}

const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf8"));
const HOST = inventory.host;
const SLUGS = new Set(inventory.componentSlugs ?? []);
const TABS = new Set(inventory.componentTabs ?? []);
const SECTIONS = new Set(inventory.sectionPaths ?? []);

if (SLUGS.size === 0) {
  // An empty inventory would make every specUrl fail — a gate that cannot
  // pass is as useless as one that cannot fail.
  console.error(
    "check-spec-urls: m3-spec-paths.json has no componentSlugs — refusing " +
      "to run against an empty inventory.",
  );
  process.exit(1);
}

// --------------------------------------------------------------- the trap set
/**
 * Export/slug names that are kern extensions with NO M3 component. A specUrl
 * on any of these is fabricated by construction. Kept here as data so the
 * rule is auditable rather than buried in a code path.
 */
const NO_M3_SPEC = new Set([
  "combobox",
  "combo-box",
  "scrollbar",
  "scroll-area",
  "number-field",
  "otp",
  "input-otp",
]);

/**
 * Normalize a component name for comparison: lowercase, collapse separators,
 * drop a trailing plural `s`. `Segmented buttons` and `segmented-button` both
 * become `segmented button`.
 */
const normName = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/s$/, "");

/**
 * kern component name -> the slug Material 3 actually uses. Sourced from the
 * verified-good sample set in
 * .team/reports/reviews/m3/2026-10-02-spec-url-audit.md.
 *
 * Used by BOTH the static identity check and the live one, so they can never
 * disagree about what a page is allowed to cite.
 */
const ALIASES = {
  "top-app-bar": "app-bars",
  "text-field": "text-fields",
  "text-area": "text-fields",
  autocomplete: "text-fields",
  card: "cards",
  dialog: "dialogs",
  "bottom-sheet": "bottom-sheets",
  "side-sheet": "side-sheets",
  tooltip: "tooltips",
  toolbar: "toolbars",
  slider: "sliders",
  badge: "badges",
  chip: "chips",
  divider: "divider",
  list: "lists",
  menu: "menus",
  progress: "progress-indicators",
  "date-picker": "date-pickers",
  "time-picker": "time-pickers",
  "segmented-button": "segmented-buttons",
  "button-group": "button-groups",
  "icon-button": "icon-buttons",
  "radio-button": "radio-button",
  checkbox: "checkbox",
  switch: "switch",
  tabs: "tabs",
  search: "search",
  carousel: "carousel",
  snackbar: "snackbar",
  "slider-row": "sliders",
  "navigation-bar": "navigation-bar",
  "navigation-rail": "navigation-rail",
  "navigation-drawer": "navigation-drawer",
  "loading-indicator": "loading-indicator",
  "extended-fab": "extended-fab",
  "fab-menu": "fab-menu",
  "floating-action-button": "floating-action-button",
  "split-button": "split-button",
  "app-bar": "app-bars",
  buttons: "buttons",
  button: "buttons",
};

/** What Material 3 slug this page is ALLOWED to cite. */
function allowedM3Slug(pageSlug) {
  if (!pageSlug) return null;
  return ALIASES[pageSlug] ?? ALIASES[normName(pageSlug)] ?? pageSlug;
}

// ------------------------------------------------------------- load content
function loadFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...loadFiles(full));
    else if (entry.endsWith(".ts")) out.push(full);
  }
  return out;
}

/** Pull the `specUrl` literal and the page slug out of a content file. */
function readPage(file) {
  const text = readFileSync(file, "utf8");
  const specUrl = text.match(/specUrl:\s*["'`]([^"'`]*)["'`]/);
  const apgUrl = text.match(/apgUrl:\s*["'`]([^"'`]*)["'`]/);
  const slug = text.match(/slug:\s*["'`]([^"'`]*)["'`]/);
  return {
    file: relative(APP, file),
    specUrl: specUrl?.[1] ?? null,
    apgUrl: apgUrl?.[1] ?? null,
    slug: slug?.[1] ?? null,
  };
}

/**
 * Validate one specUrl. Returns null when valid, or the reason it is not.
 * Exported shape kept flat so every rejection reads as a sentence.
 */
function checkSpecUrl(url) {
  if (!url.startsWith("https://")) {
    return `specUrl must be https:// — got "${url}"`;
  }
  if (!url.startsWith(`${HOST}/`) && url !== HOST) {
    if (/m[0-9]\.material\.io/.test(url)) {
      return `specUrl points at an archived Material release, not Material 3 — got "${url}"`;
    }
    return `specUrl is not on ${HOST} — got "${url}"`;
  }

  const path = url.slice(HOST.length).split(/[?#]/)[0].replace(/\/$/, "");
  if (path === "") return null;

  const parts = path.split("/").filter(Boolean);

  // Section pages: /foundations, /styles, /components, /get-started, /develop
  if (parts.length === 1) {
    return SECTIONS.has(`/${parts[0]}`)
      ? null
      : `specUrl path "${path}" is not a real ${HOST} section`;
  }

  if (parts[0] !== "components") {
    return `specUrl path "${path}" is not under /components and not a known section`;
  }

  const [slug, tab, extra] = parts.slice(1);
  if (extra !== undefined) {
    return `specUrl path "${path}" is deeper than /components/<slug>/<tab>`;
  }
  if (!SLUGS.has(slug)) {
    return (
      `specUrl slug "${slug}" has no page on ${HOST} — it is not in the ` +
      `measured inventory (${SLUGS.size} real component pages). ` +
      `If this is a kern extension it must carry NO specUrl and say so.`
    );
  }
  if (tab !== undefined && !TABS.has(tab)) {
    return `specUrl tab "${tab}" is not a real tab (want one of ${[...TABS].join(" | ")})`;
  }
  return null;
}

/** The APG link is a citation too — same class of defect. */
function checkApgUrl(url) {
  if (!url.startsWith("https://")) {
    return `apgUrl must be https:// — got "${url}"`;
  }
  const ok =
    url.startsWith("https://www.w3.org/WAI/ARIA/apg/") ||
    url.startsWith("https://www.w3.org/TR/wai-aria-");
  return ok
    ? null
    : `apgUrl is not a WAI-ARIA APG or WAI-ARIA spec URL — got "${url}"`;
}

// ------------------------------------------------------------------- run it
const files = loadFiles(CONTENT);
if (files.length === 0) {
  // The gate that would pass while asserting nothing — the named failure mode.
  console.error(
    "check-spec-urls: no content pages found under src/content/ — nothing " +
      "would be asserted.",
  );
  process.exit(1);
}

let checked = 0;
for (const file of files) {
  const page = readPage(file);
  const name = page.file;
  const slugBits = [page.slug, name].filter(Boolean).join(" ").toLowerCase();

  for (const trap of NO_M3_SPEC) {
    if (slugBits.includes(trap) && page.specUrl && page.specUrl !== "none") {
      fail(
        `${name}: "${trap}" is a kern extension with NO Material 3 component — ` +
          `a specUrl here is a fabricated citation. Drop the specUrl and state ` +
          `"no M3 component — this is a kern extension".`,
      );
    }
  }

  // THE INVERSE FABRICATION (D-1). Recording `specUrl: "none"` for something
  // that IS in the measured M3 inventory tells a reader Button has no Material
  // 3 origin. False in the opposite direction from a dead link and just as
  // damaging to the "M3 reference" claim — so it fails too.
  if (page.specUrl === "none" && page.slug) {
    const mapped = [...SLUGS].some((s) => normName(s) === normName(page.slug));
    if (mapped) {
      fail(
        `${name}: specUrl is "none" but "${page.slug}" maps to a real ` +
          `${HOST} component page — this is the inverse fabrication. Record ` +
          `the URL, or correct the name.`,
      );
    }
  }

  if (page.specUrl && page.specUrl !== "none") {
    checked += 1;
    const reason = checkSpecUrl(page.specUrl);
    if (reason) {
      fail(`${name}: ${reason}`);
    } else if (page.slug) {
      // IDENTITY MATCH — the check the gate's charter actually claims.
      //
      // Validity is not identity: `/components/checkbox` is a real spec page
      // and returns 200, but a BUTTON page citing it is a wrong-component
      // citation. review-m3 mutation-proved that case passing as "ok" while
      // the gate called itself an identity gate — a provenance claim backed
      // by nothing.
      //
      // This runs in the DEFAULT gate, not behind --live: the reader's trust
      // does not depend on someone remembering to pass a flag.
      // Strip the host BEFORE splitting. Splitting the full URL leaves
      // "https:" as segments[0], so `cited` was always null and the check
      // silently matched nothing — caught by the mutation harness.
      const raw = page.specUrl.split(/[?#]/)[0].replace(/\/$/, "");
      const path = raw.startsWith(HOST) ? raw.slice(HOST.length) : raw;
      const segs = path.split("/").filter(Boolean);
      const cited = segs[0] === "components" ? segs[1] : null;
      const allowed = allowedM3Slug(page.slug);
      if (cited && allowed && normName(cited) !== normName(allowed)) {
        fail(
          `${name}: this page documents "${page.slug}" but specUrl cites ` +
            `"/components/${cited}" — a valid spec page for a DIFFERENT ` +
            `component. Identity mismatch; a 200 from the wrong page is not ` +
            `provenance. Allowed here: "/components/${allowed}".`,
        );
      }
    }
  }

  if (page.apgUrl) {
    checked += 1;
    const reason = checkApgUrl(page.apgUrl);
    if (reason) fail(`${name}: ${reason}`);
  }
}

console.log(`check-spec-urls: ${files.length} content page(s)`);
console.log(`check-spec-urls: ${checked} external citation(s) checked`);
console.log(
  `check-spec-urls: inventory ${SLUGS.size} real component page(s), ${TABS.size} tab(s)`,
);

/**
 * THE ZERO-INPUT QUESTION, answered explicitly rather than by omission.
 *
 * Measured 2026-10-04: 0 of 195 content pages carry a `specUrl` and 0 carry an
 * `apgUrl`. So every check above — the trap list, the inverse-fabrication rule,
 * the identity match — currently has no input, and `--live` is a measured no-op
 * (it prints "no recorded spec URLs to identity-check" and exits 0).
 *
 * That means this gate's verdict below is currently VACUOUS: `ok` here means
 * "nothing to check", not "citations verified". Printing a bare `ok` for that
 * is the "passes because it never looked" class — a gate occupying the slot
 * where a real check belongs, which is exactly why the 0020 batch flagged it.
 *
 * DECISION (kern-lead, 2026-10-04), on measured evidence rather than the
 * either/or in the brief:
 *
 *   WIRE `--live`?  NO. With zero recorded URLs it asserts nothing, and it is
 *                   network-bound, so it would add a CI step that can fail on a
 *                   transient outage while verifying nothing.
 *
 *   DELETE the gate? NO. Its logic is correct and mutation-proved by review-m3:
 *                   it catches fabricated citations (the trap list), the inverse
 *                   fabrication (`specUrl: "none"` on a component M3 really has),
 *                   and the mis-citation (a real URL naming the wrong
 *                   component). Deleting removes capability to defend a class
 *                   that has already been defended once.
 *
 *   So the defect is the INPUT, not the gate: nothing claims M3 provenance, so
 *   there is nothing for the gate to validate. The fix is to record citations,
 *   which is content work in site-se's lane.
 *
 * Until then this gate says what it actually did. `--require-citations` turns
 * the vacuous pass into a failure, so the moment CI is ready to enforce the
 * content, enforcement is one flag away and needs no further gate change.
 */
if (checked === 0 && !process.argv.includes("--require-citations")) {
  console.log(
    "check-spec-urls: NO CITATIONS RECORDED — this run asserted nothing.\n" +
      "  0 of " +
      files.length +
      " content pages set `specUrl`. Every rule above had no input, and\n" +
      "  `--live` is a no-op until at least one URL is recorded. `ok` below\n" +
      '  means "nothing to check", NOT "citations verified".\n' +
      "  See docs/verification-limits.md §2. To enforce rather than warn:\n" +
      "    bun run check:spec-urls --require-citations",
  );
}

if (errors.length > 0) {
  console.error("");
  for (const e of errors) console.error(`  x ${e}`);
  console.error("");
  console.error(`check-spec-urls: ${errors.length} broken citation(s)`);
  process.exit(1);
}

/**
 * Opt-in enforcement. Fails when the gate asserted nothing, which is the state
 * measured on 2026-10-04.
 *
 * Opt-in because turning this on today would redden CI for a CONTENT gap in
 * another lane's tree, not because the state is acceptable — it is recorded in
 * docs/verification-limits.md §2 and in the zero-input banner above. The flag
 * exists so adopting it is a one-word change when the citations land, rather
 * than a new gate that has to be built and proven again.
 */
if (checked === 0 && process.argv.includes("--require-citations")) {
  console.error("");
  console.error(
    "check-spec-urls FAILED — 0 citations recorded, so nothing was asserted.\n" +
      "  Every rule in this gate had no input. Exit 0 here would be a gate\n" +
      "  passing because it never looked.\n" +
      "  Fix: record `specUrl` on the pages whose components have a real M3\n" +
      "  counterpart (12 web slugs are M3-backed today), or `--live` will have\n" +
      "  nothing to identity-check either.",
  );
  process.exit(1);
}

console.log(
  checked === 0
    ? "check-spec-urls: ok — VACUOUS, nothing was asserted (see above)"
    : "check-spec-urls: ok",
);

// --------------------------------------------------- landed-page identity
/**
 * D-2 METHOD RULE — verify by LANDED-PAGE IDENTITY, never by status code.
 *
 * Measured 2026-10-02: `m3.material.io/components/menus/combobox` returns
 * **HTTP 200** and serves the *Menus* page. A status check calls that
 * healthy. It is a fabricated spec link landing on the wrong page — the
 * silent flavour of the failure, and far more damaging than a loud 404,
 * because it survives review.
 *
 * So the assertion is: the page that actually lands must NAME the component
 * that was claimed. `/components/menus/combobox` lands on "Menus – Material
 * Design 3" while claiming `combobox` — that fails identity even though it
 * passes status.
 *
 * Run with --live. Network-bound, so it is opt-in and the static inventory
 * check above always runs first.
 */
async function liveIdentityCheck() {
  const targets = [];
  for (const file of files) {
    const page = readPage(file);
    const url = page.specUrl;
    if (!url || url === "none") continue;
    // Strip the host BEFORE splitting — splitting the full URL leaves
    // "https:" as segments[0] and the components check silently matches
    // nothing. (Caught by probing: the gate reported "no URLs to check" while
    // a recorded URL existed.)
    const path = url.startsWith(HOST) ? url.slice(HOST.length) : url;
    const segs = path.split(/[?#]/)[0].split("/").filter(Boolean);
    if (segs[0] !== "components" || segs.length < 2) continue;
    // The CLAIMED component is the slug segment, not the last segment — with
    // a tab present (/components/buttons/specs) the last segment is "specs",
    // and comparing that against the landed title would fail a good URL and
    // pass a bad one.
    targets.push({
      file: page.file,
      url,
      claimed: segs[1],
      pageSlug: page.slug,
    });
  }

  if (targets.length === 0) {
    console.log(
      "check-spec-urls --live: no recorded spec URLs to identity-check",
    );
    return 0;
  }

  // normName / allowedM3Slug are module-scope and shared with the static
  // identity check above, so the two can never disagree about what a page is
  // allowed to cite.

  const bad = [];
  for (const t of targets) {
    let landed = "";
    try {
      const res = await fetch(t.url, { redirect: "follow" });
      const html = await res.text();
      const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      landed = (m?.[1] ?? "").trim();
    } catch (err) {
      bad.push(`${t.file}: fetch failed for ${t.url} — ${String(err)}`);
      continue;
    }

    // "Buttons – Material Design 3" -> "Buttons"; "Menus – …" -> "Menus"
    const landedName = landed.split(/\s+[–—-]\s+/)[0].trim();

    // (a) D-2's rule: the landed page must name what the URL claims. This is
    //     the parent-family silent failure — /components/menus/combobox
    //     returns 200 and serves Menus.
    if (normName(landedName) !== normName(t.claimed)) {
      bad.push(
        `${t.file}: specUrl claims "${t.claimed}" but ${t.url} lands on ` +
          `"${landedName}" — the landed page does not name the claimed ` +
          `component. A parent-family page returning 200 is the silent ` +
          `failure this check exists for.`,
      );
      continue;
    }

    // (b) The MIS-CITATION: the landed page names the URL's component, but
    //     not the component THIS PAGE documents — a Checkbox page citing the
    //     Buttons spec. The URL is real, so only the page-vs-landed
    //     comparison catches it.
    const expected = allowedM3Slug(t.pageSlug);
    if (t.pageSlug && normName(landedName) !== normName(expected)) {
      bad.push(
        `${t.file}: lands on "${landedName}" (a real page) but this page ` +
          `documents "${t.pageSlug}" — a citation to a different component. ` +
          `Real URL, wrong target.`,
      );
      continue;
    }
    console.log(
      `  ok   ${t.file}: "${landedName}" matches claimed "${t.claimed}"`,
    );
  }

  console.log(
    `check-spec-urls --live: ${targets.length} URL(s) identity-checked`,
  );
  if (bad.length > 0) {
    for (const b of bad) console.error(`  x ${b}`);
    console.error(`check-spec-urls --live: ${bad.length} identity failure(s)`);
    return 1;
  }
  console.log(
    "check-spec-urls --live: ok — every landed page names its component",
  );
  return 0;
}

if (process.argv.includes("--live")) {
  process.exit(await liveIdentityCheck());
}
