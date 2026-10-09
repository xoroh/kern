// Block registry gate: every entry in src/blocks/manifest.ts must be real.
//
// - names unique, categories from the fixed set
// - root + sibling files exist on disk
// - every registryDependency is exported from the @xoroh/kern or
//   @xoroh/kern/start barrel (a block cannot render what does not ship)
// - every import in the block source resolves to a declared dependency
//   (react, @xoroh/kern, @xoroh/kern/start) — no site-chrome imports
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const BLOCKS_DIR = join(SITE, "src", "blocks");

const failures = [];
const fail = (msg) => failures.push(msg);

function barrelExports(indexPath) {
  const src = readFileSync(indexPath, "utf8");
  const names = new Set();
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) names.add(name);
    }
  }
  for (const m of src.matchAll(
    /export\s+(?:const|function|class)\s+([A-Za-z0-9_]+)/g,
  )) {
    names.add(m[1]);
  }
  return names;
}

const kernExports = barrelExports(
  join(SITE, "..", "..", "packages", "kern", "src", "components", "index.ts"),
);
const startDir = join(SITE, "..", "..", "packages", "kern", "src", "start");
const startExports = new Set();
for (const m of [
  "blocks.tsx",
  "navigation.tsx",
  "panes.tsx",
  "scaffolds.tsx",
  "top-app-bar.tsx",
  "link.tsx",
]) {
  try {
    const src = readFileSync(join(startDir, m), "utf8");
    for (const mm of src.matchAll(/export\s+function\s+([A-Za-z0-9_]+)/g))
      startExports.add(mm[1]);
  } catch {
    /* missing file is a failure below, not here */
  }
}
const shippable = new Set([...kernExports, ...startExports]);

const manifestSrc = readFileSync(join(BLOCKS_DIR, "manifest.ts"), "utf8");
const names = [...manifestSrc.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
for (const d of new Set(dupes)) fail(`duplicate block name "${d}"`);

const categories = [...manifestSrc.matchAll(/category:\s*"([^"]+)"/g)].map(
  (m) => m[1],
);
const allowed = ["Auth", "Settings", "Dashboard", "Sidebar"];
for (const c of new Set(categories)) {
  if (!allowed.includes(c))
    fail(`unknown category "${c}" — must be one of ${allowed.join(", ")}`);
}

// Parse entries structurally: split on "  {" at entry boundaries is brittle,
// so validate per-block via targeted regexes over each entry chunk.
const chunks = manifestSrc.split(/^\s*\{/m).slice(1);
for (const chunk of chunks) {
  const name = chunk.match(/name:\s*"([^"]+)"/)?.[1];
  if (!name) continue;
  const file = chunk.match(/file:\s*"([^"]+)"/)?.[1];
  if (!file || !existsSync(join(BLOCKS_DIR, file))) {
    fail(`block "${name}": root file "${file}" missing on disk`);
    continue;
  }
  const siblings = [...chunk.matchAll(/"([^"]+\.tsx)"/g)]
    .map((m) => m[1])
    .filter((f) => f !== file);
  for (const sib of siblings) {
    if (!existsSync(join(BLOCKS_DIR, sib)))
      fail(`block "${name}": sibling file "${sib}" missing on disk`);
  }
  const regDeps =
    chunk.match(/registryDependencies:\s*\[([^\]]*)\]/s)?.[1] ?? "";
  for (const m of regDeps.matchAll(/"([A-Za-z0-9_]+)"/g)) {
    if (!shippable.has(m[1]))
      fail(
        `block "${name}": registryDependency "${m[1]}" is not a shipped export`,
      );
  }
  // Every file of the block: imports are bare (declared dependencies) or
  // relative WITHIN the declared file list (multi-file blocks import their
  // own siblings). Anything else — a site-chrome import, a `../` escape —
  // makes the file uninstallable standalone, which is the one thing a block
  // must be.
  const declaredFiles = new Set([file, ...siblings]);
  const declaredStems = new Set(
    [...declaredFiles].map((f) => f.replace(/\.tsx?$/, "")),
  );
  const declared = new Set(
    [...chunk.matchAll(/dependencies:\s*\[([^\]]*)\]/gs)].flatMap((m) =>
      [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
    ),
  );
  for (const rel of declaredFiles) {
    const src = readFileSync(join(BLOCKS_DIR, rel), "utf8");
    const imports = new Set(
      [...src.matchAll(/from\s*"([^"]+)"/g)].map((m) => m[1]),
    );
    for (const imp of imports) {
      if (imp.startsWith(".") || imp.startsWith("/")) {
        // `./sibling` or `./sibling.tsx` must resolve to a declared file of
        // this block. No `../` escapes, no site-chrome imports.
        const target = imp
          .replace(/^\.\//, "")
          .replace(/\.tsx?$/, "")
          .split("/")
          .pop();
        if (
          imp.startsWith("../") ||
          imp.startsWith("/") ||
          !declaredStems.has(target)
        ) {
          fail(
            `block "${name}": "${rel}" imports "${imp}" — outside the block's declared files`,
          );
        }
        continue;
      }
      if (imp === "react" || imp.startsWith("react/")) continue;
      if (!declared.has(imp))
        fail(
          `block "${name}": imports "${imp}" which is not a declared dependency`,
        );
    }
  }
}

if (failures.length > 0) {
  console.error(`check-blocks: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}
console.log(
  `check-blocks: ok — ${names.length} block(s), categories ${[...new Set(categories)].join("/")}`,
);
