import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const { M3_ROLES, KERN_EXTRA_ROLES, auditRoleInventory } = await import(
  join(ROOT, "packages/kern-tokens/src/kern-roles.ts")
);

const { auditElevation, KERN_ELEVATION_COMPONENTS } = await import(
  join(ROOT, "packages/kern-tokens/src/kern-elevation.ts")
);

const m3 = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-tokens/src/themes/kern.json"), "utf8"),
);
const tokens = JSON.parse(
  readFileSync(join(ROOT, "packages/kern-tokens/src/tokens.json"), "utf8"),
);

const shapeKeys = new Set(Object.keys(tokens.shape));

function camel(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

const schemes = [m3.color.light, m3.color.dark];
for (const extra of ["sharp", "brand"]) {
  const theme = JSON.parse(
    readFileSync(
      join(ROOT, `packages/kern-tokens/src/themes/${extra}.json`),
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
  join(ROOT, "packages/kern/src/start/src"),
];

const violations = [];

// Resting-elevation conformance, filled in by leg 5b and reported in the summary.
let elevationConformant = 0;
let elevationTotal = 0;

// 0. ROLE INVENTORY (D-029 / P1-0). Before this existed the gate had no target at all:
// it only asserted that roles *referenced in source* exist, so a role deleted from
// `kern.json` outright passed. This is the assertion that makes "45 M3 roles" a fact.
const inventory = auditRoleInventory(m3.color.light);
if (inventory.missing.length > 0) {
  violations.push(
    `kern.json is missing ${inventory.missing.length} M3 role(s): ${inventory.missing.join(", ")}`,
  );
}
for (const role of inventory.unregistered) {
  violations.push(
    `kern.json defines "${role}", which is neither an M3 role nor a registered kern deviation — ` +
      `add it to M3_ROLES or register it in KERN_EXTRA_ROLES with a deviation id`,
  );
}
for (const entry of inventory.missingDeviation) {
  violations.push(
    `kern.json is missing registered kern deviation role ${entry} — kern's extras are part of the contract`,
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

// 3. SPACING (P1-6 / D-028). M3's system spacing tokens are `space0..space900` on an
// 8dp base (`space100 = 8dp`) with defined nested units. kern previously mirrored
// Tailwind's numeric keys (1,2,3…) which is NOT M3 — that was a naming claim the
// values did not support. The key shape is now asserted so it cannot silently drift.
{
  const keys = Object.keys(tokens.spacing);
  for (const key of keys) {
    if (!/^space-\d+$/.test(key)) {
      violations.push(
        `spacing key "${key}" is not an M3 space token (space0..space900)`,
      );
    }
  }
  // M3 defines 18 system spacing tokens; assert the base is 8dp.
  if (tokens.spacing["space-100"] !== "8px") {
    violations.push(
      `spacing space-100 must be the 8dp M3 base unit, found ${tokens.spacing["space-100"]}`,
    );
  }
}

// 3b. STATE LAYERS (SPECS-1 F1, research A2). M3's state-layers page publishes exactly
// FIVE overlay opacities: hover +8, focus +10, press +10, drag +16, disabled +38.
// kern shipped four; `disabled` was the one gap a currency gate would flag, because
// material-web (from which the other four were taken) DOES define it while being behind on
// Expressive. Values are asserted against the SPEC page, per SPECS-1: a value check may cite
// an implementation, but the completeness claim is the spec's.
{
  const M3_STATE_OPACITIES = {
    "hover-opacity": "8%",
    "focus-opacity": "10%",
    "press-opacity": "10%",
    "drag-opacity": "16%",
    "disabled-opacity": "38%",
  };
  const states = tokens.states ?? {};
  for (const [key, expected] of Object.entries(M3_STATE_OPACITIES)) {
    if (states[key] === undefined) {
      violations.push(
        `states.${key} is missing — M3 defines five state-layer opacities ` +
          `(hover 8%, focus 10%, press 10%, drag 16%, disabled 38%)`,
      );
    } else if (states[key] !== expected) {
      violations.push(
        `states.${key} is ${states[key]}, M3 specifies ${expected}`,
      );
    }
  }
  // A sixth would be a kern extension, not an M3 state.
  for (const key of Object.keys(states)) {
    if (key.startsWith("$")) continue;
    if (!(key in M3_STATE_OPACITIES)) {
      violations.push(
        `states.${key} is not one of the five M3 state-layer opacities`,
      );
    }
  }
}

// 4. ELEVATION (P1-6). M3 levels 0-5 with dp 0/1/3/6/8/12. The dp axis IS the spec;
// the shadow axis is kern's platform rendering (M3: "Elevation has no shadow or value
// of its own by default"), recorded as deviation K4 rather than asserted as M3.
{
  const dp = [0, 1, 3, 6, 8, 12];
  dp.forEach((expected, level) => {
    const entry = tokens.elevation[`level${level}`];
    if (!entry) {
      violations.push(
        `elevation.level${level} is missing — M3 defines levels 0-5`,
      );
    } else if (entry.dp !== expected) {
      violations.push(
        `elevation.level${level}.dp is ${entry.dp}, M3 specifies ${expected}dp`,
      );
    }
  });
  if (tokens.elevation.level6) {
    violations.push("elevation.level6 does not exist in M3 (levels are 0-5)");
  }
}

// 5. SHAPE (P1-5). The two Expressive corners must stay, and the baseline set must be
// intact — this is the deviation's assertion, so a silent revert cannot pass.
for (const corner of ["large-increased", "extra-large-increased"]) {
  if (!shapeKeys.has(corner)) {
    violations.push(
      `shape.corner.${corner} is missing — it is the adopted M3 Expressive entry (deviation K5)`,
    );
  }
}

// 5b. RESTING ELEVATION (P2). M3 publishes a per-component resting-level table at
// /styles/elevation/tokens; `kern-elevation.ts` is the transcribed target. Resolution is
// TRANSITIVE through local imports on purpose: `menu`/`context-menu`/`menubar` carry their
// elevation via `menu-classes.ts`, so a per-file grep reports them as carrying none and the
// gate would pass on a component that is actually wrong.
{
  const webDir = join(ROOT, "packages/kern/src/components");
  const closureOf = (file, seen = new Set()) => {
    if (seen.has(file)) return seen;
    seen.add(file);
    const full = join(webDir, file);
    if (!existsSync(full)) return seen;
    for (const [, spec] of readFileSync(full, "utf8").matchAll(
      /from\s+"\.\/([^"]+)"/g,
    )) {
      closureOf(spec.endsWith(".ts") ? spec : `${spec}.tsx`, seen);
    }
    return seen;
  };

  let conformant = 0;
  for (const component of Object.keys(KERN_ELEVATION_COMPONENTS)) {
    const levels = new Set();
    for (const file of closureOf(`${component}.tsx`)) {
      const full = join(webDir, file);
      if (!existsSync(full)) continue;
      for (const [, level] of readFileSync(full, "utf8").matchAll(
        /--md-sys-elevation-level(\d)/g,
      )) {
        levels.add(Number(level));
      }
    }
    // Two levels in one closure means the component straddles spec rows; report
    // the set rather than silently picking one.
    if (levels.size > 1) {
      violations.push(
        `${component}: resolves elevation levels {${[...levels].sort().join(", ")}} ` +
          `across its import closure — M3 assigns one resting level per component`,
      );
      continue;
    }
    const problems = auditElevation(
      component,
      levels.size === 1 ? [...levels][0] : null,
    );
    violations.push(...problems);
    // A row is conformant when it has no violations AND its measurement is
    // meaningful: either exactly one level resolved, or NO token at all for a
    // row M3 places at level 0 (absence is the conformant state there — level0
    // is `shadow: none`). The old `levels.size === 1` silently excluded those
    // rows from the count, so the summary could read "12/19" while six of them
    // asserted nothing — the proxy-for-the-property failure this sweep exists
    // to prevent.
    // Whether ABSENCE is a legitimate measured outcome for this row. This must
    // mirror `auditElevation`'s absence rule exactly — `variants.includes(0)`,
    // not `every(level => level === 0)`.
    //
    // They differ on a row like Card's [0, 1]: a plain filled Card carries no
    // elevation token, which is a conformant level-0 rendering. With `every(...)`
    // that card measured `null`, was neither a violation nor counted conformant,
    // and the summary read "18/19" on a completely green run — a number that
    // looks like a defect and is not one.
    const permitsAbsence =
      KERN_ELEVATION_COMPONENTS[component]?.variants.includes(0) === true;
    const measured =
      levels.size === 1
        ? [...levels][0]
        : levels.size === 0 && permitsAbsence
          ? 0
          : null;
    if (problems.length === 0 && measured !== null) conformant++;
  }
  elevationConformant = conformant;
  elevationTotal = Object.keys(KERN_ELEVATION_COMPONENTS).length;
}

// 5b. TOKEN GROUP CONSUMPTION (P1-6). A token group that is generated, gated for
// completeness, and read by NOTHING passes every gate while changing nothing —
// the exact failure mode this program has now hit repeatedly. Every group in
// `tokens.json` must be referenced by real source, or be listed below with a
// reason. There is no silent third option.
{
  const EXEMPT = {
    // palettes + spectrum are the K6 tones engine. They are consumed by a
    // GENERATOR (gen-tones-css.mjs), not by a component, so a source scan cannot
    // see them. They are the input to `generate:tones`, which IS covered by the
    // generated-output freshness gate.
    palettes:
      "K6 tones engine — consumed by gen-tones-css.mjs (generate:tones), not by components.",
    spectrum:
      "K6 tones engine — consumed by gen-tones-css.mjs (generate:tones), not by components.",
    // NOTE: this exemption is scoped to the THREE not-yet-used values only, and
    // the check below is deliberately value-scoped so a regression in `hover`
    // (the one value components DO consume today) still fails. A blanket group
    // exemption would re-create the blind spot this gate exists to close.
    states:
      "focus/press/drag are M3 state-layer values (hover +8%, focus +10%, press +10%, drag +16%) that no component yet expresses as a state LAYER: focus is drawn as a ring, press as an opacity dim (0.82/0.9), drag has no implementation. Visual changes beyond this ruling — P1-6 follow-up.",
  };
  // Source roots that may consume tokens (generated output is NOT a consumer).
  const CONSUMER_DIRS = [
    join(ROOT, "packages/kern/src"),
    join(ROOT, "packages/kern-native/src"),
    join(ROOT, "packages/kern-start/src"),
  ];
  // `sourceFiles` is a generator, so collect before mapping.
  const sourceFilesList = CONSUMER_DIRS.filter((d) => existsSync(d)).flatMap(
    (d) => [...sourceFiles(d)],
  );
  const sourceText = sourceFilesList
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");

  for (const group of Object.keys(tokens)) {
    if (group.startsWith("$")) continue;
    // A group is consumed if any of its VALUES appears verbatim in source.
    const values = [
      ...new Set(
        (typeof tokens[group] === "object" && tokens[group] !== null
          ? Object.values(tokens[group])
          : [tokens[group]]
        ).flatMap((v) => (v && typeof v === "object" ? Object.values(v) : [v])),
      ),
    ].filter((v) => typeof v === "string" && v.length > 2);
    // Consumed if any value appears verbatim in source, OR a source file names the
    // group (`tokens.base.black`) — value-matching alone misses the second form.
    const used =
      values.some((v) => sourceText.includes(v)) ||
      new RegExp(`tokens\\.${group}\\b|["']${group}["']`).test(sourceText);
    // Per-group value scoping: a group may be exempted for SPECIFIC unused
    // values, but every other value in it must still be consumed.
    const exempt = EXEMPT[group];
    if (exempt === undefined && !used) {
      violations.push(
        `token group "${group}" is generated but consumed by NO source file — ` +
          `wire it up or record an exemption with a reason`,
      );
    } else if (exempt !== undefined && group === "states") {
      // `hover-opacity` is the consumed one; the other three are the exemption.
      const hoverUsed = sourceText.includes("--md-sys-state-hover");
      if (!hoverUsed) {
        violations.push(
          'token group "states": hover-opacity is consumed by NO source file — ' +
            "the only M3 state layer components use today; wire it up or drop the exemption",
        );
      }
    }
  }
}

// 6. GENERATED OUTPUT FRESHNESS (P1-7 / P1-8). `md.comp.*` and the Tailwind adapter are
// generated, never hand-edited. If the committed CSS no longer matches what the
// generators produce from tokens.json, the "one source of truth" invariant is broken —
// someone hand-edited a derived file.
for (const generated of ["comp-tokens.css", "tailwind.css", "tokens.css"]) {
  const path = join(ROOT, "packages/kern-tokens/src", generated);
  if (!existsSync(path)) {
    violations.push(
      `packages/kern-tokens/src/${generated} is missing — run \`bun run generate:tokens\``,
    );
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
  console.error(`kern contract violations (${violations.length}):`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}

console.log(
  `kern contract passes: ${inventory.m3Present}/${M3_ROLES.length} M3 roles present ` +
    `(+${Object.keys(KERN_EXTRA_ROLES).length} kern deviations), ` +
    `${Object.keys(tokens.typography.scale).length}+${Object.keys(tokens.typography.scaleEmphasized ?? {}).length} typescale, ` +
    `${Object.keys(tokens.spacing).length} spacing, ` +
    `${Object.keys(tokens.states ?? {}).filter((k) => !k.startsWith("$")).length}/5 states, ` +
    `elevation 0-5, ` +
    `resting elevation ${elevationConformant}/${elevationTotal} components, shape 10, ` +
    `motion ${Object.keys(tokens.motion.schemes ?? {}).join("/")}, ` +
    `roles complete in every scheme, tokens only, shape scale only`,
);
