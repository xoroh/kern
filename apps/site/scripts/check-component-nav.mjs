#!/usr/bin/env node
/**
 * check-component-nav — prev/next never hops platforms.
 *
 * WHY
 *
 * Both platforms export `Button` (and dozens of other names), so the
 * component URL carries the platform. A prev/next link built from the wrong
 * list would walk the reader from a web page into the native renderer —
 * same name, different page, silent context switch. This gate imports the
 * REAL `siblingNav` (kept Node-safe for exactly this purpose) and walks
 * every manifest row on both platforms, asserting the full contract:
 * sibling order, platform-qualified hrefs, titles, and boundaries.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(HERE, "..");

const { siblingNav } = await import(join(SITE, "src", "systems", "component-nav.ts"));
const manifest = await import(join(SITE, "src", "generated", "manifest.ts"));
const { COMPONENTS, componentsOn } = manifest;

const failures = [];
const fail = (m) => failures.push(m);

for (const platform of ["web", "mobile"]) {
  const siblings = componentsOn(platform);
  if (siblings.length === 0) {
    fail(`componentsOn("${platform}") returned no rows — nothing would be asserted.`);
    continue;
  }
  // The manifest order is the sibling order: the gate pins the sequence, not
  // just the set, so a reorder is a decision, not drift.
  const manifestOrder = COMPONENTS.filter((c) => c.platform === platform).map(
    (c) => c.slug,
  );
  if (siblings.map((c) => c.slug).join("\n") !== manifestOrder.join("\n")) {
    fail(`componentsOn("${platform}") does not follow manifest order.`);
  }

  siblings.forEach((entry, i) => {
    const title = `Doc ${entry.export}`;
    const { prev, next } = siblingNav(entry, (e) => `Doc ${e.export}`);
    const wantPrev = i > 0 ? siblings[i - 1] : undefined;
    const wantNext = i < siblings.length - 1 ? siblings[i + 1] : undefined;

    for (const [side, got, want] of [
      ["prev", prev, wantPrev],
      ["next", next, wantNext],
    ]) {
      if (!want) {
        if (got) fail(`${entry.slug}: ${side} should be absent at the boundary, got ${got.href}.`);
      } else {
        if (!got) {
          fail(`${entry.slug}: ${side} is missing, want ${want.slug}.`);
        } else {
          // THE platform rule: the href stays on this platform's renderer.
          if (got.href !== `/components/${want.slug}`) {
            fail(`${entry.slug}: ${side} href is ${got.href}, want /components/${want.slug}.`);
          }
          if (!got.href.startsWith(`/components/${platform}/`)) {
            fail(`${entry.slug}: ${side} hops platforms — ${got.href}.`);
          }
          if (got.title !== `Doc ${want.export}`) {
            fail(`${entry.slug}: ${side} title is "${got.title}", want "Doc ${want.export}".`);
          }
        }
      }
    }
  });

  // The default title falls back to the export name (the route passes the doc
  // lookup; the fallback is what renders for undocumented exports).
  const { next: dflt } = siblingNav(siblings[0]);
  if (siblings.length > 1 && dflt?.title !== siblings[1].export) {
    fail(`${siblings[0].slug}: default next title is "${dflt?.title}", want "${siblings[1].export}".`);
  }
}

// Unknown slugs are the 404 path, not the sibling path: no link either way.
const { prev, next } = siblingNav({
  slug: "web/no-such-component",
  name: "no-such-component",
  export: "NoSuchComponent",
  platform: "web",
  status: "real",
});
if (prev ?? next) {
  fail(`unknown slug produced a sibling link — the 404 path must stay linkless.`);
}

if (failures.length) {
  console.error("check-component-nav FAILED:\n");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(
  `check-component-nav passes: prev/next pinned for ${COMPONENTS.length} manifest rows — platform-preserving hrefs, titles, and boundaries.`,
);
