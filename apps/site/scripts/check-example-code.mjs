#!/usr/bin/env bun
/**
 * check-example-code.mjs — every ExampleSpec fence compiles.
 *
 * check-snippets.mjs compiles the route-file snippets; the showcase fences
 * (`src/showcase/examples/*`, rendered in every component page's Code tab)
 * were outside it, so a fence could drift from the render it claims to show
 * (a renamed prop, a removed export) and no gate would notice. This closes
 * that: each spec's fence is wrapped by `demoExportSource` — the same module
 * builder the Export/Repro copy buttons use, with imports derived from the
 * fence's own tags — and compiled with tsc against the real package
 * declarations. A fence that stops typechecking fails here.
 *
 * Fence discipline (what the tsc boundary requires of authors):
 *   - no hooks (the derived module has no react import),
 *   - no undefined identifiers (inline handlers: `onClick={() => {}}`),
 *   - sibling roots are fine (the export wraps them in a fragment).
 *
 * The PR-A pairing bar is enforced, not just reported: every export in
 * PAIRED_EXPORTS must carry at least one fence. Behaviour demos with no
 * fence stay valid elsewhere — but not on these pages.
 *
 * Runs under bun: it imports the TS registry directly, like check-examples.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const WORK = join(APP, ".example-check");

const { EXAMPLES } = await import(join(APP, "src", "showcase", "registry.ts"));
const { demoExportSource } = await import(
  join(APP, "src", "showcase", "demo-export.ts")
);

/**
 * The PR-A pairing bar, per ADR 013 (top-20 full pages first): these exports
 * must pair every component page with at least one Preview/Code example.
 * Recorded here — the roadmap's "top-20 list" for the pairing cut — so the
 * gate and the registry read the same list.
 */
const PAIRED_EXPORTS = [
  "Button",
  "Input",
  "Checkbox",
  "Switch",
  "RadioGroup",
  "Select",
  "Slider",
  "Tabs",
  "Menu",
  "Menubar",
  "Dialog",
  "Card",
  "Badge",
  "Chip",
  "Snackbar",
  "Tooltip",
  "Separator",
  "Fab",
  "Toggle",
  "Textarea",
];

let failed = 0;
let checked = 0;

for (const name of PAIRED_EXPORTS) {
  const specs = EXAMPLES[name] ?? [];
  const coded = specs.filter((s) => (s.code ?? "").trim() !== "");
  if (coded.length === 0) {
    console.error(
      `x    ${name} is in the pairing bar but carries no coded example — the page shows Preview with no Code`,
    );
    failed += 1;
  }
}

function tsconfig() {
  return {
    compilerOptions: {
      target: "ES2022",
      jsx: "react-jsx",
      module: "ESNext",
      moduleResolution: "bundler",
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      lib: ["ES2022", "DOM"],
      typeRoots: [join(APP, "node_modules/@types")],
      baseUrl: APP,
      paths: {
        react: [join(APP, "node_modules/@types/react/index.d.ts")],
        "react/jsx-runtime": [
          join(APP, "node_modules/@types/react/jsx-runtime.d.ts"),
        ],
        "react-dom": [join(APP, "node_modules/react-dom")],
        "@xoroh/kern": [join(APP, "node_modules/@xoroh/kern/dist/index.d.ts")],
        "@xoroh/kern-native": [
          join(APP, "node_modules/@xoroh/kern-native/dist/index.d.ts"),
        ],
        "@xoroh/kern/start": [
          join(APP, "node_modules/@xoroh/kern/start/dist/index.d.ts"),
        ],
        "@xoroh/kern-icons": [
          join(APP, "node_modules/@xoroh/kern-icons/dist/index.d.ts"),
        ],
        "@xoroh/axis": [
          join(APP, "node_modules/@xoroh/axis/dist/index.d.ts"),
        ],
        "react-native": [join(APP, "src/react-native.d.ts")],
      },
    },
    include: ["*.tsx"],
  };
}

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

// One tsc program for every fence (not one per fence): twenty tsc
// invocations would take minutes — a single program with one file per
// example compiles in one pass, and tsc names the failing file.
const files = [];
for (const [exportName, specs] of Object.entries(EXAMPLES)) {
  for (const spec of specs) {
    if ((spec.code ?? "").trim() === "") continue;
    const source = demoExportSource(spec);
    if (source.trim() === "") continue;
    // Spec ids are globally unique (check-examples enforces it), so one
    // flat directory cannot collide.
    const file = `${spec.id}.tsx`;
    writeFileSync(join(WORK, file), source, "utf8");
    files.push({ exportName, id: spec.id, file });
    checked += 1;
  }
}
writeFileSync(
  join(WORK, "tsconfig.json"),
  JSON.stringify(tsconfig(), null, 2),
  "utf8",
);

try {
  execFileSync(
    join(APP, "node_modules/.bin/tsc"),
    ["--noEmit", "-p", join(WORK, "tsconfig.json")],
    { stdio: "pipe" },
  );
  console.log(`check-example-code: ok — ${checked} fence(s) compile`);
} catch (error) {
  const out = String(error.stdout ?? "");
  const bad = new Set(
    out
      .split("\n")
      .map((line) => line.match(/^([A-Za-z0-9_.-]+\.tsx)\(/)?.[1])
      .filter(Boolean),
  );
  for (const f of files) {
    if (bad.has(f.file)) {
      failed += 1;
      console.log(`  FAIL  ${f.exportName}/${f.id}`);
    } else {
      console.log(`  ok    ${f.exportName}/${f.id}`);
    }
  }
  console.log(
    out
      .split("\n")
      .filter((line) => line.includes("error TS"))
      .slice(0, 8)
      .join("\n"),
  );
}

rmSync(WORK, { recursive: true, force: true });

if (failed > 0) {
  console.error(`check-example-code: ${failed} error(s)`);
  process.exit(1);
}
