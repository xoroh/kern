// Generates md.comp.* component-token tables AND the Tailwind adapter.
//
// ONE SOURCE OF TRUTH (D-028 / D-026 Fork 3): tokens.json is the only authored file.
// This script derives:
//   1. src/comp-tokens.css   — `--md-comp-<component>-<slot>` per component
//   2. src/tailwind.css      — a thin map FROM the CSS vars, never a second truth
// Nothing here may be hand-edited; `bun run generate:tokens` regenerates both and
// `check:m3` fails if the committed output is stale.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../../..", import.meta.url).pathname;
const read = (p) =>
  JSON.parse(readFileSync(join(ROOT, "packages/kern-tokens/src", p), "utf8"));

const T = read("tokens.json");
const M3 = read("themes/m3.json");

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
};

/** Icon sizes M3 uses for component containers — a dimension, not a new token family. */
const ICON_SIZE = {
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
