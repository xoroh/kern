#!/usr/bin/env bun
/**
 * check-seo.mjs — the Part 8 gate: JSON-LD validity + freshness discipline.
 *
 * TWO checks, both about machine-readable honesty:
 *
 * 1. JSON-LD (src/systems/seo.ts SITE_JSON_LD): must JSON-serialize with
 *    @context https://schema.org + @type WebSite, and every absolute URL in
 *    it must sit on SEO_ALLOWED_HOSTS. The site's own hostname is absent by
 *    design (no custom domain declared — inventing one is the fabrication
 *    this blocks). A future edit adding a domain fails here first.
 * 2. FRESHNESS (meta.freshness in content docs): when present, owner must
 *    be non-empty and reviewed must be a real YYYY-MM-DD date (regex +
 *    calendar sanity — month 01-12, day valid for the month — because
 *    "2026-13-40" passes a regex and lies on the page). When absent, the
 *    page is REPORTED by name: 192 unfilled pages are known debt, and a
 *    gate that fails until someone invents 192 review dates would
 *    manufacture the fabrication it exists to prevent.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SEO_ALLOWED_HOSTS, SITE_JSON_LD } from "../src/systems/seo.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

let failures = 0;
const bad = (msg) => {
  failures++;
  console.error(`x    ${msg}`);
};

// --- 1. JSON-LD ---
{
  let json;
  try {
    json = JSON.parse(JSON.stringify(SITE_JSON_LD));
  } catch {
    bad("SITE_JSON_LD does not JSON-serialize");
  }
  if (json) {
    if (json["@context"] !== "https://schema.org") {
      bad("SITE_JSON_LD @context must be https://schema.org");
    }
    if (json["@type"] !== "WebSite") bad("SITE_JSON_LD @type must be WebSite");
    const urls = JSON.stringify(json).match(/https:\/\/[a-z0-9.-]+/gi) ?? [];
    for (const u of urls) {
      const host = u.replace("https://", "").split("/")[0].toLowerCase();
      if (!SEO_ALLOWED_HOSTS.has(host)) {
        bad(
          `SITE_JSON_LD links ${host} — not in SEO_ALLOWED_HOSTS (no invented domains)`,
        );
      }
    }
  }
}

// --- 2. freshness ---
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
function realDate(s) {
  const m = DATE.exec(s);
  if (!m) return false;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

async function loadDocs(subdir) {
  const dir = join(APP, "src", "content", subdir);
  const docs = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = await import(join(dir, file));
    for (const doc of Object.values(mod)) {
      if (doc && typeof doc === "object" && doc.slug) docs.push(doc);
    }
  }
  return docs;
}

{
  const missing = [];
  let checked = 0;
  for (const subdir of ["web", "mobile"]) {
    for (const doc of await loadDocs(subdir)) {
      const f = doc.meta?.freshness;
      if (!f) {
        missing.push(`${subdir}/${doc.slug}`);
        continue;
      }
      checked++;
      if (!f.owner || !f.owner.trim())
        bad(`${subdir}/${doc.slug}: freshness.owner is empty`);
      if (!realDate(f.reviewed)) {
        bad(
          `${subdir}/${doc.slug}: freshness.reviewed "${f.reviewed}" is not a real YYYY-MM-DD date`,
        );
      }
    }
  }
  console.log(
    `check-seo: freshness recorded on ${checked} page(s), unrecorded (${missing.length}): ${missing.length > 0 ? missing.slice(0, 8).join(", ") + (missing.length > 8 ? ` +${missing.length - 8} more` : "") : "none"}`,
  );
}

// --- 3. per-page metadata (Phase 3 grammar) ---
// Every family URL owns a title and a description, derived by the routes from
// the page's own data — the component route reads doc.name + doc.oneLiner,
// the foundations route reads the registry title + oneLiner. A page with no
// name or no one-liner would render a head with a hole in it, so the fields
// the routes consume are asserted here, at the data layer, rather than by
// rendering 199 pages.
{
  let pages = 0;
  for (const subdir of ["web", "mobile"]) {
    const renderer = subdir === "web" ? "Web" : "Native";
    for (const doc of await loadDocs(subdir)) {
      pages++;
      const title = `${doc.name} (${renderer})`;
      if (!doc.name?.trim()) {
        bad(`${subdir}/${doc.slug}: no name — the per-page title is empty`);
      }
      if (!doc.oneLiner?.trim()) {
        bad(
          `${subdir}/${doc.slug}: no one-liner — the per-page description is empty`,
        );
      }
      if (title.length > 120) {
        bad(
          `${subdir}/${doc.slug}: per-page title is ${title.length} chars — over the 120-char budget`,
        );
      }
      if ((doc.oneLiner ?? "").length > 200) {
        bad(
          `${subdir}/${doc.slug}: one-liner is over 200 chars — it doubles as the meta description`,
        );
      }
    }
  }
  const { FOUNDATIONS } = await import("../src/foundations/shell.tsx");
  for (const page of FOUNDATIONS) {
    pages++;
    if (!page.title?.trim()) {
      bad(`foundations/${page.slug}: no title — the per-page title is empty`);
    }
    if (!page.oneLiner?.trim()) {
      bad(
        `foundations/${page.slug}: no one-liner — the per-page description is empty`,
      );
    }
  }
  console.log(`check-seo: per-page metadata complete on ${pages} page(s)`);
}

if (failures > 0) {
  console.error(`check-seo: ${failures} failure(s)`);
  process.exit(1);
}
console.log("check-seo: ok — JSON-LD valid, freshness formats hold");
