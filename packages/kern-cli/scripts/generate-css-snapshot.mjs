// Snapshots the token CSS set into the CLI payload for packed installs.
// Run from the repo root: bun packages/kern-cli/scripts/generate-css-snapshot.mjs
// Packed `kern add --self-contained` has no checkout to read the CSS from, so
// the payload carries the exact bytes. Emitted HERE from the token sources —
// not hand-kept — and freshness-gated, so the snapshot can never drift from
// what the workspace ships while claiming to be it.
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
const SRC = join(ROOT, "packages/kern-tokens/src");
const OUT = join(ROOT, "packages/kern-cli/src/tokens-snapshot");

mkdirSync(OUT, { recursive: true });
for (const file of [
  "tokens.css",
  "comp-tokens.css",
  "tones.css",
  "tailwind.css",
  "motion.css",
]) {
  copyFileSync(join(SRC, file), join(OUT, file));
}
console.log("wrote CLI token CSS snapshot (5 files)");
