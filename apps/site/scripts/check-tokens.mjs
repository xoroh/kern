#!/usr/bin/env bun
import kernTheme from "@xoroh/kern-tokens/themes/kern.json";
/**
 * check-tokens.mjs — the two Foundations filters, enforced.
 *
 * review-showcase's Part-2 recommendation, never landed until now: "generated
 * AND cross-checked against the source's own shape." B1 (six junk specimens
 * from the wrong key) and M-A (`$comment` painted as content) were both
 * "generated faithfully from the wrong slice of source" — faithfulness was
 * never the problem, slice-correctness was. This gate checks the slice:
 *
 *  (a) $-KEY EXCLUSION. No `$`-prefixed key or name in any foundations data
 *      export. DTCG metadata (`$comment` today; `$meta`/`$extensions`
 *      tomorrow) is prose riding with the tokens, never a value row.
 *  (b) SHAPE CROSS-CHECK. Every exported row count equals the source group's
 *      own shape: type styles == scale + scaleEmphasized lengths, band sizes
 *      sum to the role count, M3 + kern == total, spacing/shape/elevation/
 *      states/motion/palettes/spectrum/base all equal their source key sets.
 *      A wrong query fails here instead of painting junk.
 *
 * Runs under bun (like check-search/check-examples): it imports the real TS
 * modules AND the real JSON sources, so both sides of every comparison are
 * read, never typed.
 */
import tokensJson from "@xoroh/kern-tokens/tokens.json";
import {
  BASE_ANCHORS,
  COLOR_GROUPS,
  COLOR_ROLES,
  KERN_EXTRA_COUNT,
  KERN_EXTRA_ROLE_NAMES,
  M3_ROLE_COUNT,
  PALETTES,
  ROLE_COUNT,
  ROLE_GROUP_ENTRIES,
  SPECTRUM,
} from "../src/content/foundations/color.ts";
import { ELEVATION_LEVELS } from "../src/content/foundations/elevation.ts";
import {
  MOTION_DURATION,
  MOTION_EASING,
  MOTION_SPRING,
} from "../src/content/foundations/motion.ts";
import { SHAPE } from "../src/content/foundations/shape.ts";
import { SPACING } from "../src/content/foundations/spacing.ts";
import { STATES } from "../src/content/foundations/states.ts";
import {
  TYPE_STYLE_COUNT,
  TYPE_STYLES,
} from "../src/content/foundations/typography.ts";

let errors = 0;
function fail(msg) {
  console.error(`x    ${msg}`);
  errors++;
}
function check(cond, msg) {
  if (!cond) fail(msg);
}

const nonMeta = (obj) =>
  Object.keys(obj ?? {}).filter((k) => !k.startsWith("$"));

// ---- (a) no $-keys anywhere in the rendered data ----
const named = [
  ...COLOR_ROLES.map((r) => [`role ${r.name}`, r.name]),
  ...TYPE_STYLES.map((s) => [`type style ${s.role}`, s.role]),
  ...SPACING.map((l) => [`spacing ${l.key}`, l.key]),
  ...SHAPE.map((l) => [`shape ${l.key}`, l.key]),
  ...STATES.map((l) => [`state ${l.key}`, l.key]),
  ...MOTION_SPRING.map((s) => [`spring ${s.name}`, s.name]),
  ...MOTION_EASING.map((l) => [`easing ${l.key}`, l.key]),
  ...MOTION_DURATION.map((l) => [`duration ${l.key}`, l.key]),
  ...PALETTES.flatMap((r) =>
    r.steps.map((s) => [`palette ${r.name}.${s.step}`, `${r.name}.${s.step}`]),
  ),
  ...SPECTRUM.flatMap((r) =>
    r.steps.map((s) => [`spectrum ${r.name}.${s.step}`, `${r.name}.${s.step}`]),
  ),
  ...BASE_ANCHORS.map((a) => [`base ${a.name}`, a.name]),
];
for (const [where, name] of named) {
  // `$` at the start OR after a dot: top-level `$comment` and nested
  // `amber.$comment` are the same leak. A bare `includes("$")` would do, but
  // the anchored form says what DTCG means — metadata marker, not substring.
  if (typeof name === "string" && /(^|\.)\$/.test(name)) {
    fail(`$-key renders as content: ${where}`);
  }
}

// ---- (b) shape cross-checks ----
const t = tokensJson;
const light = kernTheme.color.light;

// type: two real scales, 15 + 15
const scale = nonMeta(t.typography.scale);
const emph = nonMeta(t.typography.scaleEmphasized);
check(
  TYPE_STYLE_COUNT === scale.length + emph.length,
  `type styles ${TYPE_STYLE_COUNT} != scale(${scale.length}) + emphasized(${emph.length}) — wrong generation key (the B1 class)`,
);
check(
  TYPE_STYLES.length === TYPE_STYLE_COUNT,
  `TYPE_STYLES length ${TYPE_STYLES.length} != TYPE_STYLE_COUNT ${TYPE_STYLE_COUNT}`,
);

// color: bands sum to total; M3 + kern == total == theme
const bandSum = COLOR_GROUPS.reduce((n, b) => n + b.roles.length, 0);
check(
  bandSum === ROLE_COUNT,
  `band sizes sum ${bandSum} != ROLE_COUNT ${ROLE_COUNT}`,
);
check(
  M3_ROLE_COUNT + KERN_EXTRA_COUNT === ROLE_COUNT,
  `M3(${M3_ROLE_COUNT}) + kern(${KERN_EXTRA_COUNT}) != ROLE_COUNT(${ROLE_COUNT})`,
);
check(
  ROLE_COUNT === Object.keys(light).length,
  `ROLE_COUNT ${ROLE_COUNT} != theme roles ${Object.keys(light).length}`,
);
// every non-kern role explicitly grouped (no silent surface-default)
for (const name of Object.keys(light)) {
  if (KERN_EXTRA_ROLE_NAMES.has(name)) continue;
  check(
    name in ROLE_GROUP_ENTRIES,
    `role "${name}" has no ROLE_GROUP entry — renders in the wrong band by fallback`,
  );
}

// construction layers equal their source key sets
check(
  PALETTES.length === nonMeta(t.palettes).length,
  `palettes ${PALETTES.length} != source ${nonMeta(t.palettes).length}`,
);
check(
  SPECTRUM.length === nonMeta(t.spectrum).length,
  `spectrum hues ${SPECTRUM.length} != source ${nonMeta(t.spectrum).length}`,
);
check(
  BASE_ANCHORS.length === nonMeta(t.base).length,
  `base anchors ${BASE_ANCHORS.length} != source ${nonMeta(t.base).length}`,
);
for (const [groupName, ramps] of [
  ["palettes", PALETTES],
  ["spectrum", SPECTRUM],
]) {
  const srcGroup = t[groupName] ?? {};
  for (const r of ramps) {
    const srcSteps = nonMeta(srcGroup[r.name] ?? {});
    check(
      r.steps.length === srcSteps.length,
      `ramp ${r.name}: ${r.steps.length} steps != source ${srcSteps.length}`,
    );
  }
}

// remaining families equal their source shapes
check(
  SPACING.length === nonMeta(t.spacing).length,
  `spacing ${SPACING.length} != source ${nonMeta(t.spacing).length}`,
);
check(
  SHAPE.length === nonMeta(t.shape).length,
  `shape ${SHAPE.length} != source ${nonMeta(t.shape).length}`,
);
check(
  ELEVATION_LEVELS.length === nonMeta(t.elevation).length,
  `elevation ${ELEVATION_LEVELS.length} != source ${nonMeta(t.elevation).length}`,
);
check(
  STATES.length === nonMeta(t.states).length,
  `states ${STATES.length} != source ${nonMeta(t.states).length}`,
);
const srcMotion = t.motion;
check(
  MOTION_SPRING.length === nonMeta(srcMotion.spring).length,
  `springs ${MOTION_SPRING.length} != source`,
);
check(
  MOTION_EASING.length === nonMeta(srcMotion.easing).length,
  `easings ${MOTION_EASING.length} != source`,
);
check(
  MOTION_DURATION.length === nonMeta(srcMotion.duration).length,
  `durations ${MOTION_DURATION.length} != source`,
);

// ---- (c) spot values: one rendered value per family vs its source value ----
// Shapes (b) catch wrong-KEY slices; only values catch wrong-VALUE slices
// (dark rendered as light, shifted ramps, swapped encodings). One spot per
// family, both sides read — the expected value is never typed here.
// All three sections run before the single summary below, so one run reports
// every failure class instead of exiting at the first.
const byName = (rows, field, name) => rows.find((r) => r[field] === name);
const role = byName(COLOR_ROLES, "name", "primary");
check(role?.light === light.primary, `spot color: primary light ${role?.light} != theme ${light.primary}`);
check(role?.dark === kernTheme.color.dark.primary, `spot color: primary dark ${role?.dark} != theme`);
const style = byName(TYPE_STYLES, "role", "display-large");
const srcStyle = t.typography.scale["display-large"];
check(style?.fontSize === String(srcStyle.size), `spot type: display-large size ${style?.fontSize} != source`);
check(style?.fontWeight === String(srcStyle.weight), `spot type: display-large weight mismatch`);
check(style?.lineHeight === String(srcStyle.lineHeight), `spot type: display-large line-height mismatch`);
check(style?.letterSpacing === String(srcStyle.tracking), `spot type: display-large tracking mismatch`);
check(
  byName(SPACING, "key", "space-100")?.value === t.spacing["space-100"],
  `spot spacing: space-100 mismatch`,
);
check(
  byName(SHAPE, "key", "medium")?.value === t.shape.medium,
  `spot shape: medium mismatch`,
);
const level1 = byName(ELEVATION_LEVELS, "level", "level1");
check(level1?.dp === t.elevation.level1.dp && level1?.shadow === t.elevation.level1.shadow, `spot elevation: level1 dp/shadow mismatch`);
check(
  byName(STATES, "key", "hover-opacity")?.value === t.states["hover-opacity"],
  `spot states: hover-opacity mismatch`,
);
check(
  byName(MOTION_EASING, "key", "easing.standard")?.value === t.motion.easing.standard,
  `spot motion: easing.standard mismatch`,
);
check(
  byName(MOTION_DURATION, "key", "duration.short1")?.value === t.motion.duration.short1,
  `spot motion: duration.short1 mismatch`,
);
const spring = MOTION_SPRING.find((s) => s.name === "spatial-default");
check(
  spring?.stiffness === t.motion.spring["spatial-default"].stiffness &&
    spring?.damping === t.motion.spring["spatial-default"].damping,
  `spot motion: spatial-default stiffness/damping mismatch`,
);
const neutral500 = PALETTES.find((r) => r.name === "neutral")?.steps.find((s) => s.step === "500");
check(
  neutral500?.srgb === t.palettes.neutral["500"].srgb && neutral500?.oklch === t.palettes.neutral["500"].oklch,
  `spot palette: neutral.500 srgb/oklch mismatch`,
);
const gray500 = SPECTRUM.find((r) => r.name === "gray")?.steps.find((s) => s.step === "500");
check(
  gray500?.srgb === t.spectrum.gray["500"].srgb,
  `spot spectrum: gray.500 srgb mismatch`,
);
const bg = byName(BASE_ANCHORS, "name", "background");
check(
  bg?.srgb === t.base.background.srgb && bg?.oklch === t.base.background.oklch,
  `spot base: background srgb/oklch mismatch`,
);

if (errors > 0) {
  console.error(`check-tokens: ${errors} error(s)`);
  process.exit(1);
}
console.log(
  `check-tokens: ok — ${named.length} names $-clean; ${ROLE_COUNT} roles, ${TYPE_STYLE_COUNT} styles, all bands reconcile`,
);
