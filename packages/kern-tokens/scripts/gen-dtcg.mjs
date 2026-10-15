// Generates src/dtcg.json from tokens.json + the kern theme role tables.
// Run from the repo root: bun packages/kern-tokens/scripts/gen-dtcg.mjs
// The artifact is the DTCG 2025.10 interchange projection of the canonical
// authoring source: reference palettes/type/shape/elevation/motion/state/
// spacing plus sys.color light/dark. Deterministic (sorted keys), so freshness
// is byte equality. See src/dtcg/export.ts for the mapping and loss policy.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { toDtcg } from "../src/dtcg/export.ts";
import { stableStringify } from "../src/dtcg/shared.ts";
import { validateDtcg } from "../src/dtcg/validate.ts";

const ROOT = new URL("../../..", import.meta.url).pathname;
const SRC = join(ROOT, "packages/kern-tokens/src");
const read = (file) => JSON.parse(readFileSync(join(SRC, file), "utf8"));

const tokens = read("tokens.json");
const kern = read("themes/material-3.json");

const doc = toDtcg({
  tokens,
  light: kern.color.light,
  dark: kern.color.dark,
});

const diagnostics = validateDtcg(doc);
if (diagnostics.length > 0) {
  console.error("gen-dtcg FAILED — the export does not validate:");
  for (const d of diagnostics.slice(0, 10)) {
    console.error(`  ${d.path}: ${d.code} ${d.detail}`);
  }
  process.exit(1);
}

writeFileSync(join(SRC, "dtcg.json"), stableStringify(doc));
console.log("dtcg.json regenerated");
