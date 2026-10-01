import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const { M3_ROLES, KERN_EXTRA_ROLES, auditRoleInventory } = await import(
  join(ROOT, "packages/kern-theme/src/m3-roles.ts")
);

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

// 0. ROLE INVENTORY (D-029 / P1-0). Before this existed the gate had no target at all:
// it only asserted that roles *referenced in source* exist, so a role deleted from
// `m3.json` outright passed. This is the assertion that makes "45 M3 roles" a fact.
const inventory = auditRoleInventory(m3.color.light);
if (inventory.missing.length > 0) {
  violations.push(
    `m3.json is missing ${inventory.missing.length} M3 role(s): ${inventory.missing.join(", ")}`,
  );
}
for (const role of inventory.unregistered) {
  violations.push(
    `m3.json defines "${role}", which is neither an M3 role nor a registered kern deviation — ` +
      `add it to M3_ROLES or register it in KERN_EXTRA_ROLES with a deviation id`,
  );
}
for (const entry of inventory.missingDeviation) {
  violations.push(
    `m3.json is missing registered kern deviation role ${entry} — kern's extras are part of the contract`,
  );
}

// 1. TYPE SCALE (P1-3 / D-028): the complete M3 typescale is 15 baseline + 15 emphasized.
// Every style in either set must be reachable from a declared role — no unmapped style,
// and no role pointing at a style that does not exist.
{
  const scale = new Set(Object.keys(tokens.typography.scale));
  const emph = new Set(Object.keys(tokens.typography.scaleEmphasized ?? {}));
  if (scale.size !== 15) {
    violations.push(
      `typography.scale has ${scale.size} styles, M3 baseline requires 15`,
    );
  }
  if (emph.size !== 15) {
    violations.push(
      `typography.scaleEmphasized has ${emph.size} styles, M3 emphasized requires 15`,
    );
  }
  for (const name of scale) {
    if (!emph.has(name)) {
      violations.push(
        `typography.scale "${name}" has no emphasized counterpart`,
      );
    }
  }
  for (const [role, target] of Object.entries(tokens.typography.roles)) {
    const [maybeSet, style] = target.includes(".")
      ? target.split(".")
      : [null, target];
    const known = maybeSet === "emphasized" ? emph : scale;
    if (!known.has(style)) {
      violations.push(
        `typography.roles.${role} -> "${target}" is not a declared style`,
      );
    }
  }
}

// 2. MOTION (P1-4 / D-028): both schemes complete, and the legacy keys still resolve.
// The legacy triple is additive-compatibility: dropping it would break every existing
// consumer, so its absence is a violation rather than a style preference.
{
  const motion = tokens.motion;
  for (const legacy of [
    "easing-standard",
    "duration-short",
    "duration-medium",
  ]) {
    if (typeof motion[legacy] !== "string") {
      violations.push(
        `motion.${legacy} is missing — legacy consumers would break`,
      );
    }
  }
  for (const scheme of ["standard", "expressive"]) {
    const refs = motion.schemes?.[scheme];
    if (!refs) {
      violations.push(
        `motion.schemes.${scheme} is missing — both M3 schemes must ship`,
      );
      continue;
    }
    for (const key of [
      "easing",
      "easing-accelerate",
      "easing-decelerate",
      "spatial-fast",
      "spatial-default",
      "spatial-slow",
      "effects-fast",
      "effects-default",
      "effects-slow",
    ]) {
      if (!refs[key]) {
        violations.push(`motion.schemes.${scheme}.${key} is missing`);
      }
    }
    // Every reference must resolve to a token that actually exists.
    for (const [key, target] of Object.entries(refs)) {
      const pool = key.startsWith("easing") ? motion.easing : motion.spring;
      if (pool && !pool[target]) {
        violations.push(
          `motion.schemes.${scheme}.${key} -> "${target}" is not a declared ${key.startsWith("easing") ? "easing" : "spring"} token`,
        );
      }
    }
  }
}

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
  `M3 contract passes: ${inventory.m3Present}/${M3_ROLES.length} M3 roles present ` +
    `(+${Object.keys(KERN_EXTRA_ROLES).length} kern deviations), roles complete in every ` +
    `scheme, tokens only, shape scale only`,
);
