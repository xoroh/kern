// Tier gate for the Kern Core / Components / Blocks IA (D1003/D1004).
//
// Fails on:
//   1. TIER_OVERRIDES pointing at an unknown file, or STALE (pin == derived).
//   2. A FOUNDATION_MODULES file with a composition edge (builtFrom non-empty).
//   3. An UPWARD import: an effective-core file (after file overrides) with a
//      composition edge (builtFrom non-empty).
//   4. A web/native TIER DIVERGENCE on one export that is not accepted in
//      PARITY_DIVERGED, or a PARITY_DIVERGED entry whose tiers are now equal.
//   5. A STALE PARITY_TIERS pin (file tiers already equal — the pin is dead).
//   6. A manifest row (MCP or site) whose declared tier/builtFrom disagrees
//      with the effective derivation ("re-run generate-manifest"), a row
//      with no tier field at all, or a row pointing at an unscanned file.
//   7. A BLOCK-TO-BLOCK edge: src/blocks/*.tsx importing a sibling block file
//      (blocks compose only from core + components, never each other).
//
// Blocks are declared (src/blocks + manifest), never derived — this gate
// never assigns a tier to a block file.
//
// Run from apps/site: `node scripts/check-tiers.mjs`.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const ROOT = join(SITE, "..", "..");

const { loadTierData, applyOverrides, effectiveExportTier } = await import(
  join(ROOT, "scripts", "lib", "tiers.mjs")
);
const { FOUNDATION_MODULES, TIER_OVERRIDES, PARITY_TIERS, PARITY_DIVERGED } =
  await import(join(ROOT, "scripts", "lib", "tier-overrides.mjs"));

const failures = [];
const fail = (msg) => failures.push(msg);

const data = loadTierData(ROOT);
const { tiers: fileTiers, derived } = applyOverrides(data, TIER_OVERRIDES);

// --- 1. File overrides: known files, no stale pins -------------------------
for (const [key, entry] of Object.entries(TIER_OVERRIDES)) {
  if (!data.has(key)) {
    fail(
      `TIER_OVERRIDES: unknown file "${key}" — the scanner no longer sees it`,
    );
    continue;
  }
  if (!["core", "component"].includes(entry.tier)) {
    fail(`TIER_OVERRIDES: "${key}" names invalid tier "${entry.tier}"`);
  }
  if (!entry.why || entry.why.length === 0) {
    fail(`TIER_OVERRIDES: "${key}" cites no evidence (why is empty)`);
  }
  if (entry.tier === derived.get(key)) {
    fail(
      `TIER_OVERRIDES: "${key}" is STALE (pin == derived "${entry.tier}") — delete it`,
    );
  }
}

// --- 2. Foundation modules must be edge-free --------------------------------
for (const key of FOUNDATION_MODULES) {
  const entry = data.get(key);
  if (!entry) {
    fail(`FOUNDATION_MODULES: unknown file "${key}"`);
    continue;
  }
  if (entry.builtFrom.length > 0) {
    fail(
      `FOUNDATION_MODULES: "${key}" composes ${entry.builtFrom.join(", ")} — a foundation that composes composites is a composite wearing a costume`,
    );
  }
}

// --- 3. No upward imports ----------------------------------------------------
for (const [key, entry] of data) {
  const effective = fileTiers.get(key);
  if (effective === "core" && entry.builtFrom.length > 0) {
    fail(
      `UPWARD IMPORT: effective-core "${key}" has composition edges to ${entry.builtFrom.join(", ")}`,
    );
  }
}

// --- Export index: export -> [{ platform, path, fileTier, effective }] -----
const byExport = new Map();
for (const entry of data.values()) {
  for (const exportName of entry.componentExports) {
    if (!byExport.has(exportName)) byExport.set(exportName, []);
    byExport.get(exportName).push({
      platform: entry.platform,
      path: entry.path,
      fileTier: fileTiers.get(`${entry.platform}:${entry.path}`),
      effective: effectiveExportTier(
        fileTiers,
        PARITY_TIERS,
        entry.platform,
        exportName,
        entry.path,
      ),
    });
  }
}

// --- 4. Web/native parity ----------------------------------------------------
for (const [exportName, rows] of [...byExport.entries()].sort()) {
  const platforms = new Set(rows.map((r) => r.platform));
  if (!platforms.has("web") || !platforms.has("native")) continue;
  const tiers = new Set(rows.map((r) => r.effective));
  const accepted = Object.hasOwn(PARITY_DIVERGED, exportName);
  if (tiers.size > 1 && !accepted) {
    const detail = rows
      .map((r) => `${r.platform}:${r.effective} (${r.path})`)
      .join(" vs ");
    fail(
      `PARITY: "${exportName}" diverges (${detail}) and is not in PARITY_DIVERGED — document the structural difference or converge the renderers`,
    );
  }
  if (tiers.size === 1 && accepted) {
    fail(
      `PARITY_DIVERGED: "${exportName}" is STALE (both renderers now "${rows[0].effective}") — remove it`,
    );
  }
}

// --- 5. Parity pins must be live --------------------------------------------
for (const [key, entry] of Object.entries(PARITY_TIERS)) {
  const sep = key.indexOf(":");
  const platform = key.slice(0, sep);
  const exportName = key.slice(sep + 1);
  const rows = byExport.get(exportName) ?? [];
  const mine = rows.filter((r) => r.platform === platform);
  if (mine.length === 0) {
    fail(`PARITY_TIERS: "${key}" matches no scanned file`);
    continue;
  }
  if (!["core", "component"].includes(entry.tier)) {
    fail(`PARITY_TIERS: "${key}" names invalid tier "${entry.tier}"`);
  }
  if (!entry.why || entry.why.length === 0) {
    fail(`PARITY_TIERS: "${key}" cites no evidence (why is empty)`);
  }
  const other = rows.filter((r) => r.platform !== platform);
  const fileTierHere = mine[0].fileTier;
  if (other.length > 0 && other.every((r) => r.fileTier === fileTierHere)) {
    fail(
      `PARITY_TIERS: "${key}" is STALE (file tiers already equal at "${fileTierHere}") — delete it`,
    );
  }
  if (entry.tier === fileTierHere && other.length === 0) {
    fail(
      `PARITY_TIERS: "${key}" is STALE (pin == file tier "${entry.tier}") — delete it`,
    );
  }
}

// --- 6. Manifests declare what the derivation computes -----------------------
function parseManifestRows(src, file) {
  const rows = [];
  for (const block of src.matchAll(/\{([^{}]*)\}/gs)) {
    const body = block[1];
    // Rows only: the ComponentEntry TYPE block also carries quoted platform
    // literals, so `name: "..."` (a quoted row name) is the discriminator.
    if (!/name:\s*"/.test(body)) continue;
    if (!/export:\s*"/.test(body) || !/platform:\s*"/.test(body)) continue;
    const get = (field) =>
      body.match(new RegExp(`${field}:\\s*"([^"]*)"`))?.[1];
    const builtFromMatch = body.match(/builtFrom:\s*(\[[^\]]*\])/);
    rows.push({
      name: get("name"),
      export: get("export"),
      platform: get("platform"),
      path: get("path"),
      tier: get("tier") ?? null,
      builtFrom: builtFromMatch
        ? JSON.parse(
            builtFromMatch[1].replace(/,\s*\]/, "]").replace(/'/g, '"'),
          )
        : null,
      file,
    });
  }
  return rows;
}

const manifestFiles = [
  join(ROOT, "packages", "mcp", "src", "manifest.ts"),
  join(SITE, "src", "generated", "manifest.ts"),
];
for (const manifestFile of manifestFiles) {
  let src;
  try {
    src = readFileSync(manifestFile, "utf8");
  } catch {
    fail(`cannot read ${manifestFile}`);
    continue;
  }
  for (const row of parseManifestRows(src, manifestFile)) {
    // The MCP registry calls the second platform "native"; the site calls
    // it "mobile". Normalize to the tier-data vocabulary for every lookup,
    // but report in the manifest's own vocabulary.
    const plat = row.platform === "mobile" ? "native" : row.platform;
    if (!row.tier) {
      fail(
        `${manifestFile}: row ${row.platform}/${row.export} has no tier field — re-run the manifest generator`,
      );
      continue;
    }
    // Resolve the export to its file (dedup-collapsed rows keep the first
    // path; the export may live in a sibling file on the same platform).
    let fileKey = `${plat}:${row.path}`;
    let fileEntry = data.get(fileKey);
    if (!fileEntry || !fileEntry.componentExports.includes(row.export)) {
      const alt = [...data.values()].find(
        (e) => e.platform === plat && e.componentExports.includes(row.export),
      );
      if (!alt) {
        fail(
          `${manifestFile}: row ${row.platform}/${row.export} matches no scanned file`,
        );
        continue;
      }
      fileKey = `${alt.platform}:${alt.path}`;
      fileEntry = alt;
    }
    const expected = effectiveExportTier(
      fileTiers,
      PARITY_TIERS,
      plat,
      row.export,
      fileEntry.path,
    );
    if (row.tier !== expected) {
      fail(
        `${manifestFile}: row ${row.platform}/${row.export} declares tier "${row.tier}" but derivation says "${expected}" — re-run the manifest generator`,
      );
    }
    const expectedBuilt = [...fileEntry.builtFrom].sort((a, b) =>
      a.localeCompare(b),
    );
    const declaredBuilt =
      row.builtFrom === null
        ? null
        : [...row.builtFrom].sort((a, b) => a.localeCompare(b));
    if (declaredBuilt === null) {
      fail(
        `${manifestFile}: row ${row.platform}/${row.export} has no builtFrom field — re-run the manifest generator`,
      );
    } else if (
      JSON.stringify(declaredBuilt) !== JSON.stringify(expectedBuilt)
    ) {
      fail(
        `${manifestFile}: row ${row.platform}/${row.export} declares builtFrom [${declaredBuilt.join(", ")}] but derivation says [${expectedBuilt.join(", ")}] — re-run the manifest generator`,
      );
    }
  }
}

// --- 7. No block-to-block edges ----------------------------------------------
const BLOCKS_DIR = join(SITE, "src", "blocks");
let blockFiles = [];
try {
  blockFiles = readdirSync(BLOCKS_DIR).filter((f) => f.endsWith(".tsx"));
} catch {
  fail(`cannot read ${BLOCKS_DIR}`);
}
const blockNames = new Set(blockFiles.map((f) => f.slice(0, -4)));
for (const file of blockFiles) {
  if (file === "manifest.ts") continue;
  const src = readFileSync(join(BLOCKS_DIR, file), "utf8");
  for (const match of src.matchAll(/from\s*["']\.([^"']*)["']/g)) {
    let spec = match[1].replace(/^\//, "");
    if (!spec.endsWith(".tsx") && !spec.endsWith(".ts")) spec += ".tsx";
    const base = spec.split("/").pop().slice(0, -4);
    if (blockNames.has(base)) {
      fail(
        `BLOCK-TO-BLOCK: src/blocks/${file} imports sibling block "${base}" — blocks compose only from core + components`,
      );
    }
  }
}

// --- Report -------------------------------------------------------------------
let core = 0;
let component = 0;
for (const tier of fileTiers.values()) {
  if (tier === "core") core++;
  else component++;
}
console.log(
  `check-tiers: ${data.size} files (core ${core}, component ${component}), ${byExport.size} exports`,
);
const divergent = [...byExport.entries()]
  .filter(([, rows]) => {
    const p = new Set(rows.map((r) => r.platform));
    return (
      p.has("web") &&
      p.has("native") &&
      new Set(rows.map((r) => r.effective)).size > 1
    );
  })
  .map(([name]) => name);
console.log(
  `check-tiers: ${divergent.length} accepted divergences (${divergent.sort((a, b) => a.localeCompare(b)).join(", ")})`,
);
if (failures.length > 0) {
  console.error(`\ncheck-tiers FAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("check-tiers: OK");
