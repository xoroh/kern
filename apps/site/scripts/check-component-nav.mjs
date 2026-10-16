#!/usr/bin/env node
/**
 * check-component-nav — prev/next never leaves the system family order.
 *
 * WHY
 *
 * One component, one page (`/components/m3/<name>`, 018): there is no
 * platform URL segment, so a prev/next link built from a platform list
 * would walk the reader to a URL that does not exist. This gate imports the
 * REAL `siblingNavSystem` (kept Node-safe for exactly this purpose) and
 * walks every family in the generated `FAMILIES` union order, asserting the
 * full contract: sibling order, system-scoped hrefs, titles, and boundaries.
 */
import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const { siblingNavSystem } = await import(
  join(SITE, "src", "systems", "component-nav.ts")
);
const manifest = await import(join(SITE, "src", "generated", "manifest.ts"));
const { FAMILIES, COMPONENTS } = manifest;

const SYSTEM = "m3";

const failures = [];
const fail = (m) => failures.push(m);

// The family set is the CONTENT set: one content file, one family page.
// Loaded the same way check-docs loads it (Node type-strips the content
// modules — no Vite needed). Manifest rows include compound parts
// (dialog-content), which 301 to the family page and must never become
// siblings, so the manifest is the wrong source for the family order.
const contentSlugs = new Set();
for (const platform of ["web", "mobile"]) {
  const dir = join(SITE, "src", "content", platform);
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort()) {
    const mod = await import(join(dir, file));
    for (const value of Object.values(mod)) {
      if (value && typeof value === "object" && "slug" in value) {
        contentSlugs.add(value.slug);
      }
    }
  }
}
if (contentSlugs.size === 0) {
  fail(
    "no content slugs found under src/content/ — the gate would pin nothing.",
  );
} else {
  const want = [...contentSlugs].sort((a, b) => a.localeCompare(b));
  if (FAMILIES.join("\n") !== want.join("\n")) {
    fail(
      "FAMILIES is not the sorted union of content family slugs — the family order is generator-owned from src/content/, not hand-ordered.",
    );
  }
  const names = COMPONENTS.map((c) => c.name);
  for (const slug of FAMILIES) {
    if (!names.includes(slug)) {
      fail(
        `FAMILIES lists "${slug}" with no manifest row — the page would 404.`,
      );
    }
  }
}

// Every family walks its siblings — order, hrefs, titles, boundaries.
FAMILIES.forEach((slug, i) => {
  const { prev, next } = siblingNavSystem(SYSTEM, slug, (s) => `Doc ${s}`);
  const wantPrev = i > 0 ? FAMILIES[i - 1] : undefined;
  const wantNext = i < FAMILIES.length - 1 ? FAMILIES[i + 1] : undefined;

  for (const [side, got, want] of [
    ["prev", prev, wantPrev],
    ["next", next, wantNext],
  ]) {
    if (!want) {
      if (got)
        fail(
          `${slug}: ${side} should be absent at the boundary, got ${got.href}.`,
        );
    } else {
      if (!got) {
        fail(`${slug}: ${side} is missing, want ${want}.`);
      } else {
        // THE system rule: the href stays on the family page — no
        // platform segment, nothing to hop.
        if (got.href !== `/components/${SYSTEM}/${want}`) {
          fail(
            `${slug}: ${side} href is ${got.href}, want /components/${SYSTEM}/${want}.`,
          );
        }
        if (!got.href.startsWith(`/components/${SYSTEM}/`)) {
          fail(`${slug}: ${side} leaves the system page — ${got.href}.`);
        }
        if (got.title !== `Doc ${want}`) {
          fail(`${slug}: ${side} title is "${got.title}", want "Doc ${want}".`);
        }
      }
    }
  }
});

// The default title falls back to the slug (the route passes the doc
// lookup; the fallback is what renders for undocumented exports).
const { next: dflt } = siblingNavSystem(SYSTEM, FAMILIES[0]);
if (FAMILIES.length > 1 && dflt?.title !== FAMILIES[1]) {
  fail(
    `${FAMILIES[0]}: default next title is "${dflt?.title}", want "${FAMILIES[1]}".`,
  );
}

// Unknown slugs are the 404 path, not the sibling path: no link either way.
const { prev, next } = siblingNavSystem(SYSTEM, "no-such-component");
if (prev ?? next) {
  fail(
    `unknown slug produced a sibling link — the 404 path must stay linkless.`,
  );
}

if (failures.length) {
  console.error("check-component-nav FAILED:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check-component-nav passes: prev/next pinned for ${FAMILIES.length} families — system-scoped hrefs, titles, and boundaries.`,
);
