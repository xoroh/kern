// Compiles every code snippet on the site against the real packages.
//
// The S2.4 bar is "every snippet typechecks against the real package APIs".
// This extracts the snippets from the route sources, writes each one into a
// scratch project *inside apps/site* (so node_modules resolution is the same
// as the site's own), and runs tsc. A snippet naming a prop or export the
// packages do not have fails here rather than misleading a reader.
//
//   bun run check:snippets
//
// Reads (inside apps/site):  src/routes/{getting-started,theme/index}.tsx
// Writes (inside apps/site): .snippet-check/<name>/  (removed on exit)
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const SRC = join(APP, "src");
const WORK = join(APP, ".snippet-check");

/** Snippets that are shell commands or CSS, not TypeScript. */
/**
 * Snippets whose text is illustrative rather than a compiling module: install
 * commands, CSS, and a JSX fragment that deliberately shows sibling roots.
 * They are still checked by hand against the real APIs.
 */
const NON_TS = new Set([
  "INSTALL",
  "STYLESHEET",
  "MOBILE_INSTALL",
  "WEB_PARITY",
  "SNACKBAR",
  "ICON_ALIAS",
  "REGISTRY",
  "ICONS",
]);

/**
 * Pulls `const NAME = \`...\`;` string constants out of a route file. The
 * snippets live in named constants so this extraction stays exact rather than
 * scraping arbitrary backticks out of JSX.
 */
function snippetsFrom(file) {
  const source = readFileSync(join(SRC, file), "utf8");
  const out = new Map();
  for (const match of source.matchAll(
    /^const ([A-Z0-9_]+) = `([\s\S]*?)`;$/gm,
  )) {
    out.set(match[1], match[2]);
  }
  return out;
}

const files = [
  "routes/getting-started.tsx",
  "routes/foundations/theme/index.tsx",
  "routes/docs/guides.tsx",
];

const snippets = new Map();
for (const file of files) {
  const path = join(SRC, file);
  if (!existsSync(path)) continue;
  for (const [name, body] of snippetsFrom(file)) snippets.set(name, body);
}

if (snippets.size === 0) {
  console.error("check-snippets: no snippets found — the extractor is stale");
  process.exit(1);
}

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

let failed = 0;
let checked = 0;
let skipped = 0;

for (const [name, body] of snippets) {
  if (NON_TS.has(name)) {
    console.log(`  skip  ${name} (not standalone TypeScript)`);
    skipped += 1;
    continue;
  }

  const dir = join(WORK, name.toLowerCase());
  mkdirSync(dir, { recursive: true });

  // Names a snippet uses without defining (handlers) are declared here, so the
  // check is about the *package* API, not the snippet's surroundings.
  const prelude = "declare function save(): void;\n";
  // Split a snippet into its leading import statements and the rest. The rest
  // may be JSX with several sibling roots, so it is wrapped in a fragment: the
  // text a reader copies is unchanged, but tsc sees one parent element.
  const importRe = /^import\s[\s\S]*?from\s+["'][^"']+["'];?$/gm;
  const imports = body.match(importRe) ?? [];
  const head = imports.join("\n");
  let rest = body;
  for (const statement of imports) rest = rest.replace(statement, "");
  rest = rest.replace(/^\n+/, "");

  // Bare JSX is when the snippet *starts* with an element. A snippet that
  // declares a function or const and uses JSX inside it is already a module.
  const firstLine = rest.split("\n").find((line) => line.trim() !== "");
  const isJsx = firstLine?.trimStart().startsWith("<") ?? false;
  const source = isJsx
    ? `${head}\nconst el = (\n  <>\n${rest
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n")}\n  </>\n);\n`
    : `${prelude}${head}\n${rest}`;

  writeFileSync(join(dir, "snippet.tsx"), source, "utf8");
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify(
      {
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
            "@xoroh/kern": [
              join(APP, "node_modules/@xoroh/kern/dist/index.d.ts"),
            ],
            "@xoroh/kern-native": [
              join(APP, "node_modules/@xoroh/kern-native/dist/index.d.ts"),
            ],
            "@xoroh/kern/start": [
              join(APP, "node_modules/@xoroh/kern/start/dist/index.d.ts"),
            ],
            "@xoroh/kern-icons": [
              join(APP, "node_modules/@xoroh/kern-icons/dist/index.d.ts"),
            ],
            "react-native": [join(APP, "src/react-native.d.ts")],
          },
        },
        include: ["snippet.tsx"],
      },
      null,
      2,
    ),
    "utf8",
  );

  checked += 1;
  try {
    execFileSync(
      join(APP, "node_modules/.bin/tsc"),
      ["--noEmit", "-p", join(dir, "tsconfig.json")],
      { stdio: "pipe" },
    );
    console.log(`  ok    ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  FAIL  ${name}`);
    const out = String(error.stdout ?? "");
    console.log(
      out
        .split("\n")
        .filter((line) => line.includes("error TS"))
        .slice(0, 4)
        .join("\n"),
    );
  }
}

rmSync(WORK, { recursive: true, force: true });

console.log(
  failed === 0
    ? `check-snippets: ${checked} TypeScript snippets compile, ${skipped} non-standalone skipped`
    : `check-snippets: FAILED — ${failed} of ${checked} do not compile`,
);
process.exit(failed === 0 ? 0 : 1);
