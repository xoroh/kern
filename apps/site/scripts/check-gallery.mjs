#!/usr/bin/env bun
/**
 * check-gallery.mjs — the gallery shows what exists, nothing else (T4).
 *
 * The gallery renders family cards from the content docs, thumbnails from
 * the demo registries, and no-preview reasons from the PREVIEW_REASONS maps.
 * Three silent-failure classes, each measured in the wild before this gate:
 *
 * 1. ORPHAN DEMOS — a registry key no family documents and no API page
 *    covers. The gallery iterates DOCS, not demos, so an orphan demo is
 *    built, shipped, and never shown. A key is covered when it is a doc
 *    part on its platform or is named in the content docs (the documented
 *    non-component case, e.g. the createSonnerManager factory: registry is
 *    component-only by design, sonner.ts + /docs/api document it). What
 *    this does NOT catch, stated plainly: miscategorization (a key that is
 *    mentioned but wrongly) — it catches deletion/rename, the silent kind.
 * 2. STALE REASONS — a PREVIEW_REASONS key matching no same-platform part,
 *    named in no content doc, and exported by no package entry. A renamed
 *    export leaves its reason behind, and the reason then never renders
 *    (reasons render only on part lookup). The registries themselves are
 *    excluded from the mention corpus, so a key mentioned only by its
 *    sibling keys ("same reason as X") does not pass on self-reference.
 *    The package-entry exemption is narrow: it keeps a reason for a LIVE
 *    export that simply has no content doc yet (arcRotations), while a key
 *    whose export is gone (AppsSheet, CreateSheet, WebParity — removed
 *    with this gate) still fails.
 * 3. CROSS-LANE REASONS — web families rendering mobile-frame text. Fixed
 *    by platform-gating previewReason (required platform param, tsc-pinned)
 *    with web lookups stopping at WEB_PREVIEW_REASONS. This gate pins the
 *    data side: every WEB_PREVIEW_REASONS key must be a web part, so a web
 *    reason can never name an export the web docs do not own.
 *
 * COVERAGE is reported, never thresholded: demo-less family slugs print by
 * name per platform. A threshold would turn 29 web + 63 mobile honest gaps
 * into a red gate nobody can close in one unit — known debt reported, not
 * hidden, not weaponized.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

const { WEB_DEMOS, WEB_PREVIEW_REASONS } = await import(
  join(APP, "src", "demos", "web", "registry.tsx")
);
const { MOBILE_DEMOS, PREVIEW_REASONS } = await import(
  join(APP, "src", "demos", "mobile", "registry.tsx")
);

async function loadDocs(subdir) {
  const dir = join(APP, "src", "content", subdir);
  const docs = [];
  const corpus = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const full = join(dir, file);
    corpus.push(readFileSync(full, "utf8"));
    const mod = await import(full);
    for (const doc of Object.values(mod)) {
      if (
        doc &&
        typeof doc === "object" &&
        doc.slug &&
        Array.isArray(doc.parts)
      ) {
        docs.push(doc);
      }
    }
  }
  return { docs, corpus };
}

const web = await loadDocs("web");
const mobile = await loadDocs("mobile");

let failures = 0;
const bad = (msg) => {
  failures++;
  console.error(`x    ${msg}`);
};

const word = (k) => new RegExp(`\\b${k}\\b`);
const mentioned = (key, corpus) => corpus.some((text) => word(key).test(text));

for (const [platform, { docs, corpus }, demos] of [
  ["web", web, WEB_DEMOS],
  ["mobile", mobile, MOBILE_DEMOS],
]) {
  const parts = new Set();
  for (const doc of docs) for (const part of doc.parts) parts.add(part);
  // (1) orphan demos
  for (const key of Object.keys(demos)) {
    if (!parts.has(key) && !mentioned(key, corpus)) {
      bad(
        `${platform} demo key "${key}" is no doc part and is named in no content doc — orphan demo, built but never shown`,
      );
    }
  }
  // coverage, reported by name
  const bare = docs
    .filter((d) => !d.parts.some((p) => demos[p]))
    .map((d) => d.slug);
  console.log(
    `check-gallery: ${platform} demo-less families (${bare.length}): ${bare.join(", ") || "none"}`,
  );
}

// (2) stale mobile reasons
{
  const parts = new Set();
  for (const doc of mobile.docs) for (const part of doc.parts) parts.add(part);
  // Live package exports, by name: a reason for an export that exists but
  // has no content doc yet is dormant, not stale. Read as text — the claim
  // is membership in the entry file, not a type-level fact.
  let pkgIndex = "";
  try {
    // packages/ sits two levels above the site (kern/packages), not one.
    pkgIndex = readFileSync(
      join(APP, "..", "..", "packages", "kern-native", "src", "index.ts"),
      "utf8",
    );
  } catch {
    pkgIndex = "";
  }
  for (const key of Object.keys(PREVIEW_REASONS)) {
    if (parts.has(key)) continue;
    if (mentioned(key, mobile.corpus)) continue;
    if (pkgIndex && word(key).test(pkgIndex)) continue;
    bad(
      `mobile PREVIEW_REASONS key "${key}" matches no mobile part, is named in no mobile content doc, and is exported by no package entry — stale reason`,
    );
  }
}

// (3) web reasons stay in-lane
for (const key of Object.keys(WEB_PREVIEW_REASONS)) {
  const parts = new Set();
  for (const doc of web.docs) for (const part of doc.parts) parts.add(part);
  if (!parts.has(key)) {
    bad(
      `WEB_PREVIEW_REASONS key "${key}" is no web part — web reasons must name web-owned exports`,
    );
  }
}

if (failures > 0) {
  console.error(`check-gallery: ${failures} failure(s)`);
  process.exit(1);
}
console.log(
  "check-gallery: ok — no orphan demos, no stale reasons, reasons in-lane",
);
