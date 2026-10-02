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

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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
function checkSpecUrl(url, page) {
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
    if (slugBits.includes(trap) && page.specUrl) {
      fail(
        `${name}: "${trap}" is a kern extension with NO Material 3 component — ` +
          `a specUrl here is a fabricated citation. Drop the specUrl and state ` +
          `"no M3 component — this is a kern extension".`,
      );
    }
  }

  if (page.specUrl) {
    checked += 1;
    const reason = checkSpecUrl(page.specUrl, page);
    if (reason) fail(`${name}: ${reason}`);
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

if (errors.length > 0) {
  console.error("");
  for (const e of errors) console.error(`  x ${e}`);
  console.error("");
  console.error(`check-spec-urls: ${errors.length} broken citation(s)`);
  process.exit(1);
}

console.log("check-spec-urls: ok");
