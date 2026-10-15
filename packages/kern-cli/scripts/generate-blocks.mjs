// Generates packages/kern-cli/src/blocks.json from the site block manifest.
// Run from the repo root: bun packages/kern-cli/scripts/generate-blocks.mjs
// The CLI's bundled block payload (KERN-034): same rows the site gate checks,
// so a packed `kern add <block>` resolves the graph the docs describe with no
// checkout to read. Emitted HERE from the workspace manifest — not hand-kept.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
const DIR = join(ROOT, "apps/site/src/blocks");

const src = readFileSync(join(DIR, "manifest.ts"), "utf8");
const chunks = src.split(/^\s*\{/m).slice(1);
const rows = [];
for (const chunk of chunks) {
  const name = chunk.match(/name:\s*"([^"]+)"/)?.[1];
  const file = chunk.match(/file:\s*"([^"]+)"/)?.[1];
  if (!name || !file) continue;
  const strList = (key) => {
    const body =
      chunk.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`, "s"))?.[1] ?? "";
    return [...body.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  };
  const files = [file, ...strList("files")];
  // File contents ride in the payload (KERN-034): a packed install has no
  // checkout, and a block payload without its bytes is an install plan that
  // cannot install. ~10KB total — the honest offline graph, not a reference.
  const contents = {};
  for (const rel of files) {
    const full = join(DIR, rel);
    if (!existsSync(full)) {
      console.error(`generate-blocks FAILED — declared file missing: ${rel}`);
      process.exit(1);
    }
    contents[rel] = readFileSync(full, "utf8");
  }
  rows.push({
    name,
    title: chunk.match(/title:\s*"([^"]+)"/)?.[1] ?? name,
    category: chunk.match(/category:\s*"([^"]+)"/)?.[1] ?? "Settings",
    description: chunk.match(/description:\s*"([^"]+)"/)?.[1] ?? "",
    file,
    files: strList("files"),
    registryDependencies: strList("registryDependencies"),
    dependencies: strList("dependencies"),
    contents,
  });
}
if (rows.length === 0) {
  console.error("generate-blocks FAILED — parsed 0 block rows.");
  process.exit(1);
}
writeFileSync(
  join(ROOT, "packages/kern-cli/src/blocks.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
);
console.log(`wrote CLI blocks payload (${rows.length} blocks)`);
