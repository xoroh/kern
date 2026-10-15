/**
 * N8 boundary gate (AUD-008): native components consume the resolved theme
 * through `theme.tsx` — no file under `packages/kern-native/src/components/`
 * may reference `resolveThemeDetails` (import, alias, or call).
 *
 * Scope is deliberately `src/components/`, not `src/`: provider/theme
 * infrastructure (`src/theme.tsx`) legitimately owns resolution, and oracle
 * tests (`src/theme-comp.test.tsx`) intentionally import the resolver to
 * validate behavior. A `src/`-wide grep would false-red on both.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const COMPONENTS = join(ROOT, "packages", "kern-native", "src", "components");
const THEME = join(ROOT, "packages", "kern-native", "src", "theme.tsx");

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const hits = [];
for (const file of walk(COMPONENTS)) {
  const src = readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    if (line.includes("resolveThemeDetails")) {
      hits.push(`${relative(ROOT, file)}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (hits.length > 0) {
  console.error(
    `native theme boundary violations (${hits.length}) — components must read the scheme from ../theme, never resolve it:`,
  );
  for (const h of hits) console.error(`  ${h}`);
  process.exit(1);
}

// The boundary must remain owned: theme.tsx still resolves.
const themeSrc = readFileSync(THEME, "utf8");
if (!themeSrc.includes("resolveThemeDetails")) {
  console.error(
    "native theme boundary owner missing — theme.tsx no longer references resolveThemeDetails; resolution must live at the provider boundary.",
  );
  process.exit(1);
}

console.log(
  "native theme boundary holds: 0 resolveThemeDetails references in components/, resolution owned by theme.tsx",
);
