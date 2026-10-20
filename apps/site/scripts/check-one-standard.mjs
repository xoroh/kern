#!/usr/bin/env bun
/**
 * check-one-standard — the FLIPS of the one-standard page migration.
 *
 * See `lib/one-standard.mjs` for the rules and why they exist. The gate
 * holds no content: the keyboard contracts and the coded fences landed
 * first, and this is the requirement that keeps them from rotting.
 *
 * Runs under bun: it imports the TS content docs and the showcase registries
 * directly, like the other docs gates.
 */
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  isCovered,
  OUTSIDE_ONE_STANDARD,
  oneStandardViolations,
} from "./lib/one-standard.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const CONTENT = join(APP, "src", "content");

const errors = [];

// The two showcase registries: the web half and the native half (a native
// example imports `@xoroh/kern-native`, which must not reach a web chunk).
const { EXAMPLES } = await import(join(APP, "src", "showcase", "registry.ts"));
const { EXAMPLES: NATIVE_EXAMPLES } = await import(
  join(APP, "src", "showcase", "registry.native.ts")
);
const registered = new Set([
  ...Object.keys(EXAMPLES ?? {}),
  ...Object.keys(NATIVE_EXAMPLES ?? {}),
]);

async function loadContent() {
  const docs = [];
  for (const platform of ["web", "mobile"]) {
    const dir = join(CONTENT, platform);
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    } catch {
      continue;
    }
    for (const file of files.sort()) {
      const mod = await import(join(dir, file));
      for (const value of Object.values(mod)) {
        if (value && typeof value === "object" && "slug" in value) {
          docs.push({ platform, file: `${platform}/${file}`, doc: value });
        }
      }
    }
  }
  return docs;
}

const pages = await loadContent();
if (pages.length === 0) {
  errors.push(
    "no content pages found under src/content/ — the gate would pass while asserting nothing",
  );
} else {
  errors.push(...oneStandardViolations(pages, registered));
}

const covered = new Set(
  pages.filter(({ doc }) => isCovered(doc.slug)).map(({ doc }) => doc.slug),
);

console.log(
  `check-one-standard: ${covered.size} covered families, ` +
    `${Object.keys(OUTSIDE_ONE_STANDARD).length} outside the standard`,
);
if (errors.length > 0) {
  console.error(`\ncheck-one-standard: ${errors.length} error(s):`);
  for (const e of errors) console.error(`  x    ${e}`);
  process.exit(1);
}
console.log(
  "check-one-standard: ok — every covered page states a keyboard contract, " +
    "every covered family carries a coded example",
);
