// Generates reproducible export inventory freeze for Kern 0.1.0 Preview.
// Usage: bun scripts/generate-inventory-freeze.mjs [--out docs/architecture/inventory-freeze.json]
// Reads package manifests, barrel exports (AST-light regex), registry, blocks, tokens.
// No writes except the single JSON artifact.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const out = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : "docs/architecture/inventory-freeze.json";

function sha16(path) {
  try {
    const b = readFileSync(path);
    return createHash("sha256").update(b).digest("hex").slice(0, 16);
  } catch {
    return null;
  }
}
function shaFull(path) {
  try {
    const b = readFileSync(path);
    return createHash("sha256").update(b).digest("hex");
  } catch {
    return null;
  }
}
function exportNames(path) {
  let t = "";
  try {
    t = readFileSync(path, "utf8");
  } catch {
    return [];
  }
  const names = new Set();
  for (const m of t.matchAll(
    /^export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/gm,
  ))
    names.add(m[1]);
  for (const m of t.matchAll(/^export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)/gm))
    names.add(m[1]);
  for (const m of t.matchAll(
    /^export\s+(?:type|interface)\s+([A-Za-z0-9_]+)/gm,
  ))
    names.add(m[1]);
  for (const m of t.matchAll(/^export\s*\{([^}]+)\}/gm))
    for (const p of m[1].split(",")) {
      const n = p
        .trim()
        .split(/\s+as\s+/)
        .pop()
        .trim();
      if (/^[A-Za-z0-9_]+$/.test(n)) names.add(n);
    }
  for (const m of t.matchAll(/^export\s*\*\s*from\s*["'][^"']+["']/gm))
    names.add(`*reexport:${m[0].slice(0, 80)}`);
  return [...names].sort();
}

const pkgs = [
  "kern",
  "kern-native",
  "kern-tokens",
  "kern-primitives",
  "kern-icons",
  "kern-contracts",
  "kern-cli",
  "mcp",
];
/** Workspace area per package dir. N9 moved the internal-only primitives to libs/. */
const AREAS = { "kern-primitives": "libs" };
const packages = {};
for (const p of pkgs) {
  const mf = `${AREAS[p] ?? "packages"}/${p}/package.json`;
  let j = {};
  try {
    j = JSON.parse(readFileSync(mf, "utf8"));
  } catch {}
  packages[p] = {
    name: j.name ?? null,
    version: j.version ?? null,
    exports: j.exports ?? null,
    bin: j.bin ?? null,
    files: j.files ?? null,
    manifestHash: shaFull(mf),
  };
}

const barrels = {};
const barrelPaths = {
  web: "packages/kern/src/components/index.ts",
  native: "packages/kern-native/src/index.ts",
  primitives: "libs/kern-primitives/src/index.ts",
  icons: "packages/kern-icons/src/index.ts",
  tokens: "packages/kern-tokens/src/index.ts",
  contracts: "packages/kern-contracts/src/index.ts",
  cli: "packages/kern-cli/src/index.ts",
  mcp: "packages/mcp/src/index.ts",
};
for (const [k, p] of Object.entries(barrelPaths)) {
  const names = exportNames(p);
  barrels[k] = {
    path: p,
    sha16: sha16(p),
    exportCount: names.length,
    exports: names.slice(0, 400),
  };
}

let registry = null;
try {
  const r = JSON.parse(
    readFileSync("packages/kern-cli/src/registry.json", "utf8"),
  );
  const rows = r.rows ?? r;
  registry = {
    path: "packages/kern-cli/src/registry.json",
    sha16: sha16("packages/kern-cli/src/registry.json"),
    full: shaFull("packages/kern-cli/src/registry.json"),
    rows: rows.length,
    version: r.version ?? null,
    releaseSet: r.releaseSet ?? null,
  };
} catch {}
let blocks = null;
try {
  const b = JSON.parse(
    readFileSync("packages/kern-cli/src/blocks.json", "utf8"),
  );
  const rows = Array.isArray(b) ? b : (b.rows ?? b.blocks ?? []);
  blocks = {
    path: "packages/kern-cli/src/blocks.json",
    sha16: sha16("packages/kern-cli/src/blocks.json"),
    rows: rows.length,
  };
} catch {}

const generated = {};
for (const g of [
  "packages/kern-tokens/src/tokens.css",
  "packages/kern-tokens/src/comp-tokens.css",
  "packages/kern-tokens/src/tailwind.css",
  "packages/kern-tokens/src/tones.css",
  "packages/kern-tokens/src/motion.css",
  "packages/kern-tokens/src/dtcg.json",
  "packages/kern-tokens/src/themes/matrix.json",
  "packages/mcp/src/manifest.ts",
  "packages/mcp/src/maturity.ts",
]) {
  generated[g] = { sha16: sha16(g) };
}

const out2 = {
  tool: "scripts/generate-inventory-freeze.mjs",
  packages,
  barrels,
  registry,
  blocks,
  generated,
};
writeFileSync(out, `${JSON.stringify(out2, null, 2)}\n`);
console.log(`wrote ${out}`);
