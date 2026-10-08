#!/usr/bin/env bun
/**
 * check-mcp-index — public/mcp/index.json indexes the whole docs corpus.
 *
 * WHAT IT ASSERTS
 *
 * 1. EMISSION: public/mcp/index.json exists, parses, and carries exactly one
 *    entry per docs page (web + mobile families, foundations pages, the
 *    theme reference page) through the SAME module the emitter uses (`scripts/lib/mcp-index.mjs` — one
 *    function, two callers). A page the emitter drops fails here.
 * 2. FRESHNESS TRIPWIRE: each entry embeds its page's own one-liner. A stale
 *    index (content edited, index not regenerated) still carries the old
 *    sentence — so the tripwire catches drift without byte-comparing files.
 * 3. URL CONTRACT: each entry's page/md URLs are exactly the route the site
 *    serves and the file generate-page-md emits. An index that points at
 *    nothing is worse than no index.
 *
 * WHAT IT DOES NOT ASSERT: byte-freshness of public/mcp/index.json against
 * a regen. That file is gitignored build output (see generate-mcp-index.mjs);
 * the census gate owns committed artefacts, and this gate owns the index
 * contract instead.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FOUNDATIONS } from "../src/foundations/shell.tsx";
import { NAV_SECTIONS } from "../src/systems/nav.ts";
import { buildMcpIndex } from "./lib/mcp-index.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");

let failures = 0;
const bad = (msg) => {
  failures++;
  console.error(`x    ${msg}`);
};

async function loadDocs(subdir) {
  const dir = join(APP, "src", "content", subdir);
  const docs = [];
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = await import(join(dir, file));
    for (const doc of Object.values(mod)) {
      if (doc && typeof doc === "object" && doc.slug && doc.name)
        docs.push(doc);
    }
  }
  return docs;
}

const families = {
  web: await loadDocs("web"),
  mobile: await loadDocs("mobile"),
};
// Same theme-leaf derivation the emitter uses — one function, two callers,
// so the gate can never disagree with the emitter about the theme entry.
const themeLeaf = NAV_SECTIONS.flatMap((s) => s.leaves).find(
  (l) => l.href === "/foundations/theme",
);
const want = buildMcpIndex(families, FOUNDATIONS, {
  title: themeLeaf.label,
  oneLiner: themeLeaf.hint,
});

let got;
try {
  got = JSON.parse(
    readFileSync(join(APP, "public", "mcp", "index.json"), "utf8"),
  );
} catch {
  bad(
    "public/mcp/index.json is missing or unparsable — regen (bun run generate)",
  );
  console.error(`check-mcp-index: 1 failure(s)`);
  process.exit(1);
}

if (got.count !== want.count) {
  bad(
    `index counts ${got.count} page(s), corpus has ${want.count} — regen (bun run generate)`,
  );
}

const byKey = new Map(
  got.pages?.map((p) => [`${p.kind}/${p.platform ?? ""}/${p.slug}`, p]) ?? [],
);
for (const entry of want.pages) {
  const key = `${entry.kind}/${entry.platform ?? ""}/${entry.slug}`;
  const actual = byKey.get(key);
  if (!actual) {
    bad(`${key}: indexed nowhere — regen (bun run generate)`);
    continue;
  }
  byKey.delete(key);
  if (actual.page !== entry.page || actual.md !== entry.md) {
    bad(
      `${key}: URLs [${actual.page} / ${actual.md}] are not [${entry.page} / ${entry.md}]`,
    );
  }
  if (actual.oneLiner !== entry.oneLiner) {
    bad(
      `${key}: one-liner drift — the index is stale, regen (bun run generate)`,
    );
  }
}
for (const key of byKey.keys()) {
  bad(
    `${key}: indexed but no such docs page exists — regen (bun run generate)`,
  );
}

console.log(
  `check-mcp-index: ${want.count} page(s) indexed with exact page/md URLs`,
);
if (failures > 0) {
  console.error(`check-mcp-index: ${failures} failure(s)`);
  process.exit(1);
}
console.log("check-mcp-index: ok — the MCP index covers the whole docs corpus");
