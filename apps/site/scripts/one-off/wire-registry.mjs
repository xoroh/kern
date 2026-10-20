#!/usr/bin/env bun
/**
 * wire-registry — one-off: wire the new example files into the showcase
 * registries, split by PLATFORM, keyed by the family's real EXPORT name.
 *
 * WHY THE SPLIT
 *
 * The showcase registry is loaded by every component page, web and native
 * alike. A native example imports `@xoroh/kern-native`, so a single registry
 * would pull the native bundle — and through it the icon registry — into a
 * web page's chunk. `demos/lazy.ts` already keeps the two platforms apart
 * for the DEMO registries; this applies the same rule to the showcase.
 *
 * THE KEY
 *
 * The registry is keyed by the package EXPORT NAME (the family's `parts[0]`
 * in the content docs), not by the constant name — `CheckboxGroup`, not
 * `CHECKBOX_GROUP`. A key nobody can export is a key no page can look up.
 *
 * Usage: bun scripts/one-off/wire-registry.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const APP = join(import.meta.dir, "..", "..");
const EXAMPLES_DIR = join(APP, "src", "showcase", "examples");
const CONTENT = join(APP, "src", "content");

/**
 * Every export name the content docs claim, keyed by its normalized form.
 *
 * The registry key must be the real package export (`InputOTP`, not
 * `InputOtp`), and only the docs know the real casing — the constant name
 * is the hint, the content file is the authority.
 */
const exports = new Map();
const normalize = (name) => name.replace(/[^a-z0-9]/gi, "").toLowerCase();
for (const platform of ["web", "mobile"]) {
  for (const file of readdirSync(join(CONTENT, platform)).filter((f) =>
    f.endsWith(".ts"),
  )) {
    const source = readFileSync(join(CONTENT, platform, file), "utf8");
    const parts = source.match(/parts:\s*\[([^\]]*)\]/)?.[1];
    if (!parts) continue;
    for (const part of parts
      .split(",")
      .map((p) => p.trim().replace(/^"|"$/g, ""))) {
      if (!part) continue;
      const key = normalize(part);
      if (!exports.has(key)) exports.set(key, part);
    }
  }
}

/** `INPUT_OTP_EXAMPLES` → `InputOtp`, the hint the constant name carries. */
function pascal(constant) {
  return constant
    .replace(/_EXAMPLES$/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

const files = readdirSync(EXAMPLES_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .sort();

const web = [];
const native = [];
const skipped = [];
for (const file of files) {
  const source = readFileSync(join(EXAMPLES_DIR, file), "utf8");
  const exportMatches = [
    ...source.matchAll(/export const (\w+_EXAMPLES): ExampleSpec\[\]/g),
  ];
  if (exportMatches.length === 0) {
    skipped.push(file);
    continue;
  }
  const isNative = source.includes('package: "@xoroh/kern-native"');
  for (const match of exportMatches) {
    const constant = match[1];
    const key = exports.get(normalize(pascal(constant)));
    if (!key) {
      skipped.push(
        `${file}: ${constant} (no matching export in the content docs)`,
      );
      continue;
    }
    (isNative ? native : web).push({ file, exportName: constant, key });
  }
}

function importLine(entry) {
  return `import { ${entry.exportName} } from "./examples/${entry.file.replace(/\.tsx$/, "")}";`;
}

function registryBody(entries) {
  const seen = new Set();
  const lines = [];
  for (const entry of entries) {
    if (seen.has(entry.key)) {
      throw new Error(`two examples claim the export ${entry.key}`);
    }
    seen.add(entry.key);
    lines.push(`  ${entry.key}: ${entry.exportName},`);
  }
  return lines.join("\n");
}

const header = `/**
 * The Example registry — export name → the examples for it.
 *
 * Keyed by the package EXPORT NAME, matching the demo registries, so a page
 * looks up its examples the same way it looks up its live demo.
 *
 * PLATFORM-SPLIT (one-standard migration): this module holds the WEB
 * examples and the configurators. The NATIVE examples live in
 * \`registry.native.ts\`, because a native example imports
 * \`@xoroh/kern-native\` — and a single registry would pull the native
 * bundle, and through it the icon registry, into every web page's chunk.
 * The page asks for the registry its platform owns (see \`demos/lazy.ts\`).
 */
`;

const webRegistry = `${header}
import type { ExampleSpec } from "./example";
${web.map(importLine).join("\n")}

export const EXAMPLES: Record<string, ExampleSpec[]> = {
${registryBody(web)}
};

/** Every export that has at least one registered example. */
export function examplesFor(exportName: string): ExampleSpec[] {
  return EXAMPLES[exportName] ?? [];
}
`;

const nativeRegistry = `/**
 * The NATIVE Example registry — export name → the examples for it.
 *
 * The web half of the showcase lives in \`registry.ts\`. This module holds
 * the native examples, which import \`@xoroh/kern-native\`; keeping them
 * apart is what stops a web page's chunk from pulling the native bundle.
 */
import type { ExampleSpec } from "./example";
${native.map(importLine).join("\n")}

export const EXAMPLES: Record<string, ExampleSpec[]> = {
${registryBody(native)}
};

/** Every export that has at least one registered example. */
export function examplesFor(exportName: string): ExampleSpec[] {
  return EXAMPLES[exportName] ?? [];
}
`;

writeFileSync(join(APP, "src", "showcase", "registry.ts"), webRegistry);
writeFileSync(
  join(APP, "src", "showcase", "registry.native.ts"),
  nativeRegistry,
);

console.log(
  `wire-registry: ${web.length} web examples, ${native.length} native examples${skipped.length ? `, skipped ${skipped.join(", ")}` : ""}`,
);
