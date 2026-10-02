// Generates md.comp.* component-token tables AND the Tailwind adapter.
//
// ONE SOURCE OF TRUTH (D-028 / D-026 Fork 3): tokens.json is the only authored file.
// This script derives:
//   1. src/comp-tokens.css   — `--md-comp-<component>-<slot>` per component
//   2. src/tailwind.css      — a thin map FROM the CSS vars, never a second truth
// Nothing here may be hand-edited; `bun run generate:tokens` regenerates both and
// `check:kern` fails if the committed output is stale.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
const read = (p) =>
  JSON.parse(readFileSync(join(ROOT, "packages/kern-tokens/src", p), "utf8"));

const T = read("tokens.json");
const M3 = read("themes/kern.json");

/**
 * The component token contract. Each entry names an M3 component and the slots M3
 * defines for it. Slots resolve to global roles/typescale — they never introduce a
 * colour, radius or type value of their own. That is what makes `md.comp.*` a
 * *table* rather than a second source of truth.
 */
const COMPONENTS = {
  button: {
    container: { height: "space-300", shape: "shape-corner-full" },
    label: { typography: "label-large" },
    "leading-icon": { size: "icon-24" },
    "trailing-icon": { size: "icon-24" },
  },
  "filled-button": {
    container: {
      color: "primary",
      "on-color": "on-primary",
      height: "space-300",
    },
    label: { typography: "label-large" },
  },
  "tonal-button": {
    container: {
      color: "secondary-container",
      "on-color": "on-secondary-container",
    },
    label: { typography: "label-large" },
  },
  card: {
    container: { color: "surface-container-low", shape: "shape-corner-medium" },
    elevation: { level: "level1" },
  },
  chip: {
    container: { shape: "shape-corner-small" },
    label: { typography: "label-large" },
  },
  dialog: {
    container: {
      color: "surface-container-high",
      shape: "shape-corner-extra-large",
    },
    headline: { typography: "headline-small" },
    elevation: { level: "level3" },
  },
  fab: {
    container: {
      color: "primary-container",
      "on-color": "on-primary-container",
      shape: "shape-corner-large",
    },
    label: { typography: "label-large" },
  },
  "icon-button": {
    container: { shape: "shape-corner-full", size: "icon-40" },
  },
  list: {
    "item-container": { color: "surface", "on-color": "on-surface" },
    headline: { typography: "body-large" },
    supporting: { typography: "body-medium" },
  },
  navigationbar: {
    container: { color: "surface-container", height: "space-400" },
    "active-indicator": {
      color: "secondary-container",
      shape: "shape-corner-full",
    },
  },
  snackbar: {
    container: {
      color: "inverse-surface",
      "on-color": "inverse-on-surface",
      shape: "shape-corner-extra-small",
    },
  },
  tooltip: {
    container: {
      color: "inverse-surface",
      "on-color": "inverse-on-surface",
      shape: "shape-corner-extra-small",
    },
  },

  // ---- P1-7: extended coverage. Every entry below is M3-specified and resolves
  // to a role/scale value that already exists; none introduces a new value, which
  // is what keeps `md.comp.*` a table rather than a second source of truth.
  "outlined-button": {
    container: {
      "outline-color": "outline",
      height: "space-300",
    },
    label: { typography: "label-large" },
  },
  "elevated-button": {
    container: {
      color: "surface-container-low",
      "on-color": "on-surface",
      height: "space-300",
    },
    label: { typography: "label-large" },
  },
  "text-button": {
    container: { height: "space-300" },
    label: { typography: "label-large" },
  },
  banner: {
    container: {
      color: "surface",
      shape: "shape-corner-medium",
    },
    // M3 lists Banner at resting elevation 1 (check:kern row `banner`).
    elevation: { level: "level1" },
  },
  slider: {
    // M3 resting level 0 — absence is the conformant state, so no elevation slot.
    track: { shape: "shape-corner-full", height: "space-50" },
    handle: { size: "icon-20", color: "primary" },
  },
  tabs: {
    container: { height: "space-400" },
    label: { typography: "title-small" },
    "active-indicator": { color: "primary", height: "space-50" },
  },
  "segmented-button": {
    container: { shape: "shape-corner-full", height: "space-300" },
    label: { typography: "label-large" },
    "selected-container": { color: "secondary-container" },
  },
  carousel: {
    container: { shape: "shape-corner-medium" },
    indicator: { color: "secondary" },
  },
  switch: {
    // M3 switch: selected handle uses primary; track uses surface-container-highest.
    track: { color: "surface-container-highest", shape: "shape-corner-full" },
    "selected-track": { color: "primary" },
    handle: { size: "icon-24", color: "outline" },
    "selected-handle": { color: "on-primary" },
  },
  checkbox: {
    box: { shape: "shape-corner-extra-small", size: "icon-24" },
    "selected-box": { color: "primary" },
    "selected-mark": { color: "on-primary" },
  },
  radio: {
    "outer-circle": { shape: "shape-corner-full", size: "icon-24" },
    "inner-circle": { shape: "shape-corner-full", size: "icon-12" },
    "selected-outer": { color: "primary" },
    "selected-inner": { color: "on-primary" },
  },
  progress: {
    track: { color: "surface-container-highest", shape: "shape-corner-full" },
    indicator: { color: "primary" },
  },
  divider: {
    // M3 divider is 1dp; space-125 is the 10px scale entry.
    track: { thickness: "space-125", color: "outline-variant" },
  },
  "top-app-bar": {
    container: { color: "surface-container", height: "space-600" },
    title: { typography: "title-large" },
  },
  // ---- P1-7b: the remaining M3 component families. Target is the 37 families on
  // m3.material.io/components, NOT the mcp manifest's 345 primitive rows (which
  // include kern/Base-UI constructs M3 never specified -- accordion, avatar,
  // empty-state, command -- and would make this table assert tokens for concepts
  // the spec does not define).
  badges: {
    container: { color: "secondary-container", shape: "shape-corner-small" },
    label: { typography: "label-large" },
  },
  "button-group": {
    container: { shape: "shape-corner-full" },
    divider: { color: "outline" },
  },
  "extended-fab": {
    container: {
      color: "primary-container",
      "on-color": "on-primary-container",
      shape: "shape-corner-large",
    },
    label: { typography: "label-large" },
    icon: { size: "icon-24" },
  },
  "fab-menu": {
    container: { shape: "shape-corner-large", color: "surface-container" },
  },
  "loading-indicator": {
    // M3 loading indicator rests at level 0 — no elevation slot on purpose.
    track: { color: "primary", shape: "shape-corner-full" },
  },
  menus: {
    container: {
      color: "surface-container",
      shape: "shape-corner-extra-small",
    },
    // Sibling slot, matching banner/dialog/card: the generator walks
    // component -> slot -> entries -> attr, so nesting elevation INSIDE
    // container puts an object where it expects a string leaf.
    elevation: { level: "level2" },
    item: { typography: "body-large" },
  },
  "navigation-drawer": {
    container: { color: "surface-container-low", width: "space-0" },
    item: { typography: "label-large" },
  },
  "navigation-rail": {
    container: { color: "surface", width: "space-0" },
    "active-indicator": {
      color: "secondary-container",
      shape: "shape-corner-full",
    },
  },
  search: {
    container: {
      color: "surface-container-high",
      shape: "shape-corner-full",
      height: "space-400",
    },
    "leading-icon": { size: "icon-24" },
  },
  "side-sheet": {
    container: { color: "surface-container-low", width: "space-0" },
    // M3 side sheets rest at level 0 — absence is conformant; no slot.
  },
  "split-button": {
    container: { shape: "shape-corner-full", height: "space-300" },
    label: { typography: "label-large" },
  },
  "text-field": {
    container: {
      color: "surface-container-highest",
      shape: "shape-corner-extra-small",
      height: "space-500",
    },
    label: { typography: "body-large" },
    supporting: { typography: "body-small" },
  },
  "date-picker": {
    container: {
      color: "surface-container",
      shape: "shape-corner-extra-large",
    },
    "selected-day": { color: "primary" },
    "selected-day-label": { color: "on-primary" },
  },
  "time-picker": {
    container: {
      color: "surface-container",
      shape: "shape-corner-extra-large",
    },
    label: { typography: "display-large" },
  },
  toolbars: {
    container: { color: "surface-container", height: "space-600" },
    title: { typography: "title-large" },
  },
  "bottom-sheet": {
    container: {
      color: "surface-container-low",
      shape: "shape-corner-extra-large",
    },
    // NO elevation slot on purpose: measure-elevation reports the sheet closure
    // carries no --md-sys-elevation-level token. Asserting a level here would
    // make the table claim something the component does not implement — the
    // "table asserts a value nothing renders" failure. Gating this row belongs
    // with the token landing on the component, not before.
  },
};

/** Icon sizes M3 uses for component containers — a dimension, not a new token family. */
const ICON_SIZE = {
  "icon-12": "12px",
  "icon-18": "18px",
  "icon-20": "20px",
  "icon-24": "24px",
  "icon-40": "40px",
  "icon-48": "48px",
};

/** Every role the tables reference must exist, or this is a broken table. */
const roleExists = (ref) => {
  // Component tables reference roles WITHOUT the `color-` prefix (the CSS var adds
  // it), so strip it before looking the role up: "primary" -> `primary`.
  const role = ref.replace(/^color-/, "");
  const camel = role.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return typeof M3.color.light[camel] === "string" || role in ICON_SIZE;
};
const spacingExists = (key) => typeof T.spacing[key] === "string";
const shapeExists = (key) =>
  typeof T.shape[key.replace("shape-corner-", "")] === "string";
const typeExists = (key) =>
  typeof T.typography.scale[key] === "object" ||
  typeof T.typography.scaleEmphasized?.[key] === "object";

const broken = [];
const compLines = [];

for (const [component, slots] of Object.entries(COMPONENTS)) {
  for (const [slot, entries] of Object.entries(slots)) {
    for (const [attr, target] of Object.entries(entries)) {
      const key = `${component}-${slot}-${attr}`;
      let resolved;
      if (roleExists(target)) {
        resolved = `var(--md-sys-color-${target})`;
      } else if (target.startsWith("elevation-level")) {
        if (!T.elevation[target])
          broken.push(`md.comp.${key} -> unknown elevation "${target}"`);
        resolved = `var(--md-sys-${target})`;
      } else if (/^level[0-5]$/.test(target)) {
        if (!T.elevation[target])
          broken.push(`md.comp.${key} -> unknown elevation "${target}"`);
        resolved = `var(--md-sys-elevation-${target})`;
      } else if (target.startsWith("shape-corner-")) {
        if (!shapeExists(target))
          broken.push(`md.comp.${key} -> unknown shape "${target}"`);
        resolved = `var(--md-sys-shape-corner-${target.replace("shape-corner-", "")})`;
      } else if (target.startsWith("space-")) {
        if (!spacingExists(target))
          broken.push(`md.comp.${key} -> unknown spacing "${target}"`);
        resolved = `var(--md-sys-spacing-${target.replace("space-", "")})`;
      } else if (target in ICON_SIZE) {
        resolved = ICON_SIZE[target];
      } else if (typeExists(target)) {
        resolved = `var(--md-sys-typescale-${target})`;
      } else {
        broken.push(`md.comp.${key} -> unknown target "${target}"`);
        continue;
      }
      compLines.push(`  --md-comp-${key}: ${resolved};`);
    }
  }
}

if (broken.length) {
  console.error(`md.comp.* table has ${broken.length} broken reference(s):`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}

const compOut = join(ROOT, "packages/kern-tokens/src/comp-tokens.css");
writeFileSync(
  compOut,
  `/* GENERATED by scripts/gen-comp-css.mjs from tokens.json — do not edit by hand.
 * Component token tables (md.comp.*): every slot resolves to an existing global
 * role, shape, spacing or typescale var, so this can never drift into a second
 * source of truth. Source: tokens.json. */
:root {
${compLines.sort().join("\n")}
}
`,
);

/* ------------------------------------------------------------------ *
 * Tailwind adapter — a THIN MAP FROM the CSS vars (D-026 Fork 3).
 * Every utility points at a var. No literal values here: if a token
 * changes, the utility follows, because it never held the value.
 * ------------------------------------------------------------------ */
const tailwindLines = [];
const colorRoles = Object.keys(M3.color.light);
for (const role of colorRoles) {
  const slug = role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  tailwindLines.push(`  --color-md-${slug}: var(--md-sys-color-${slug});`);
}
for (const name of Object.keys(T.spacing)) {
  tailwindLines.push(
    `  --spacing-md-${name.replace("space-", "")}: var(--md-sys-spacing-${name.replace("space-", "")});`,
  );
}
for (const name of Object.keys(T.shape)) {
  tailwindLines.push(
    `  --radius-md-${name}: var(--md-sys-shape-corner-${name});`,
  );
}
for (const name of Object.keys(T.typography.scale)) {
  tailwindLines.push(
    `  --text-md-${name}: var(--md-sys-typescale-${name}-font-size);`,
  );
  tailwindLines.push(
    `  --leading-md-${name}: var(--md-sys-typescale-${name}-line-height);`,
  );
  tailwindLines.push(
    `  --tracking-md-${name}: var(--md-sys-typescale-${name}-letter-spacing);`,
  );
}
for (const name of Object.keys(T.typography.scaleEmphasized ?? {})) {
  tailwindLines.push(
    `  --text-md-emphasized-${name}: var(--md-sys-typescale-emphasized-${name}-font-size);`,
  );
  tailwindLines.push(
    `  --leading-md-emphasized-${name}: var(--md-sys-typescale-emphasized-${name}-line-height);`,
  );
  tailwindLines.push(
    `  --tracking-md-emphasized-${name}: var(--md-sys-typescale-emphasized-${name}-letter-spacing);`,
  );
}
// Skip DTCG metadata keys (`$comment`, `$schema`, …). They are annotations, not
// tokens; emitting one produces an invalid custom-property name (`--shadow-md-$comment`)
// and a var that resolves to nothing.
const isTokenKey = (key) => !key.startsWith("$");
for (const level of Object.keys(T.elevation).filter(isTokenKey)) {
  tailwindLines.push(
    `  --shadow-md-${level}: var(--md-sys-elevation-${level});`,
  );
}
for (const name of Object.keys(T.motion.easing ?? {})) {
  if (name === "standard") continue; // already emitted as --md-sys-motion-easing-standard
  tailwindLines.push(
    `  --ease-md-${name}: var(--md-sys-motion-easing-${name});`,
  );
}
for (const name of Object.keys(T.motion.duration ?? {})) {
  tailwindLines.push(
    `  --duration-md-${name.replace(/(\d+)$/, "-$1")}: var(--md-sys-motion-duration-${name});`,
  );
}

// ---- P1-8: mirror the md.comp.* tables into the Tailwind adapter.
// `compLines` already holds `<decl>` strings of the form
// `  --md-comp-<component>-<slot>-<attr>: <resolved>;`, each resolving to a
// var() or a single ICON_SIZE literal. Deriving the Tailwind name from the
// var name and copying the SAME resolved expression keeps this a pure map:
// no value is recomputed, and nothing here can become a second source of truth.
// Slots are addressed as `comp-<component>-<slot>-<attr>`.
for (const line of compLines) {
  const m = line.match(/^\s*--md-comp-([\w-]+):\s*(.+);$/);
  if (!m) continue;
  const [, name, resolved] = m;
  tailwindLines.push(`  --comp-md-${name}: ${resolved};`);
}

const twOut = join(ROOT, "packages/kern-tokens/src/tailwind.css");
writeFileSync(
  twOut,
  `/* GENERATED by scripts/gen-comp-css.mjs — do not edit by hand.
 * Tailwind adapter (D-026 Fork 3 / P1-8). Every entry is a thin map FROM an
 * existing CSS custom property; no value is duplicated here. The single source
 * of truth is tokens.json, emitted to tokens.css. */
@theme {
${[...new Set(tailwindLines)].sort().join("\n")}
}
`,
);

const fmt = spawnSync(
  "bun",
  ["x", "@biomejs/biome", "format", "--write", compOut, twOut],
  {
    cwd: ROOT,
    stdio: "inherit",
  },
);
if (fmt.status !== 0) process.exit(fmt.status ?? 1);
console.log(
  `md.comp.* generated: ${compLines.length} slots across ${Object.keys(COMPONENTS).length} components -> ${compOut}`,
);
console.log(
  `tailwind adapter generated: ${new Set(tailwindLines).size} vars -> ${twOut}`,
);
