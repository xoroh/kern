import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const m3 = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-theme/src/themes/m3.json"), "utf8"),
);
const tokens = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-theme/src/tokens.json"), "utf8"),
);

const shapeKeys = new Set(Object.keys(tokens.shape));

function camel(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

const schemes = [m3.color.light, m3.color.dark];
for (const extra of ["sharp", "brand"]) {
  const theme = JSON.parse(
    readFileSync(
      join(ROOT, `packages/kern-theme/src/themes/${extra}.json`),
      "utf8",
    ),
  );
  schemes.push({
    ...m3.color.light,
    ...(theme.overrides?.color?.light ?? {}),
  });
  schemes.push({
    ...m3.color.dark,
    ...(theme.overrides?.color?.dark ?? {}),
  });
}

function inEveryScheme(slug) {
  const role = camel(slug);
  return schemes.every((scheme) => typeof scheme[role] === "string");
}

function* sourceFiles(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") continue;
      yield* sourceFiles(full);
      continue;
    }
    if (!/\.(tsx?|astro)$/.test(entry.name)) continue;
    if (/\.(test|rntest)\.tsx?$/.test(entry.name)) continue;
    yield full;
  }
}

const SCANNED = [
  join(ROOT, "packages/kern/src/components"),
  join(ROOT, "packages/kern-native/src/components"),
  join(ROOT, "packages/kern-start/src"),
];

const violations = [];

for (const dir of SCANNED) {
  for (const file of sourceFiles(dir)) {
    const where = relative(ROOT, file);
    const src = readFileSync(file, "utf8");

    // 1. CSS custom-property roles must exist in every scheme.
    for (const [, kind, slug] of src.matchAll(
      /--md-sys-(color|shape-corner)-([a-z0-9-]+)/g,
    )) {
      const ok =
        kind === "color" ? inEveryScheme(camel(slug)) : shapeKeys.has(slug);
      if (!ok) {
        violations.push(
          `${where}: --md-sys-${kind}-${slug} is not a valid ${kind === "color" ? "role" : "shape"}`,
        );
      }
    }

    // 2. Tokens law: no raw hex colors in components.
    for (const [raw] of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      violations.push(`${where}: raw hex color ${raw} — use semantic roles`);
    }

    // 3. Shape law: radii only from the shape scale.
    for (const [cls] of src.matchAll(
      /rounded-[a-z0-9-]*(?:\([^)]*\)|\[[^\]]*\])?/g,
    )) {
      const ok =
        /^rounded(?:-[a-z]{1,2})?-(?:none|full)$/.test(cls) ||
        /^rounded(?:-[a-z]{1,2})?-\[inherit\]$/.test(cls) ||
        /^rounded(?:-[a-z]{1,2})?-\(--md-sys-shape-corner-[a-z-]+\)$/.test(cls);
      if (!ok) {
        violations.push(`${where}: ${cls} — radii come from the shape scale`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error(`M3 contract violations (${violations.length}):`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log(
  "M3 contract passes: roles complete in every scheme, tokens only, shape scale only",
);
