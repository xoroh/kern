#!/usr/bin/env bun
/**
 * render-guidance — write the guidance corpus from the manifest.
 *
 * The guidance files are RENDERED from `docs/m3-guidance/manifest.json`, which
 * holds the moved values verbatim. This script is the generator the
 * generated-artifact registry points at, and it is deliberately free of git:
 * it reads the manifest and writes the files, so it runs the same way in a
 * shallow CI checkout as it does in a working tree.
 *
 * The manifest itself is the SOURCE, produced once by the one-off migration
 * (`scripts/one-off/migrate-guidance.mjs`), which is what read the values
 * off the pages before they moved.
 *
 * The gate `scripts/check-guidance.mjs` re-renders with the same renderer
 * and compares byte-for-byte, so a hand-edit to a guidance file is caught.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  GUIDANCE_DIR,
  loadManifest,
  renderGuidanceFile,
} from "./lib/guidance.mjs";

mkdirSync(GUIDANCE_DIR, { recursive: true });

const manifest = loadManifest();
let written = 0;
for (const [slug, entry] of Object.entries(manifest)) {
  const file = join(GUIDANCE_DIR, `${slug}.md`);
  writeFileSync(file, renderGuidanceFile(entry.name, entry.platforms));
  written += 1;
}

console.log(`render-guidance: ${written} guidance file(s) written`);
