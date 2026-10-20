#!/usr/bin/env bun
/**
 * shoot — the visual evidence for the N10 batch (pressed state layers) and
 * the gallery.
 *
 * WHAT IT SHOOTS
 *
 *   1. Three NATIVE pressable components (the mobile tab of the component
 *      page, which renders the native component through react-native-web),
 *      PRESSED and UNPRESSED. The pressed shot holds the pointer down, so
 *      the StateLayer overlay — the thing N10 introduced — is on screen.
 *   2. The component gallery at desktop 1440 and mobile 390, in light and
 *      dark.
 *
 * The shots go to .team/reports/2026-10-19-kern-batch2/ and every file's md5
 * is printed, so a reviewer can tell a fresh shot from a stale one.
 *
 * Usage: bun scripts/shoot-batch2.mjs [baseUrl]
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const OUT = join(
  import.meta.dir,
  "..",
  "..",
  "..",
  "..",
  ".team",
  "reports",
  "2026-10-19-kern-batch2",
);
const BASE = process.argv[2] ?? "http://localhost:4173";

mkdirSync(OUT, { recursive: true });

const shots = [];

async function shoot(page, name, box) {
  const file = join(OUT, `${name}.png`);
  // The pressable shots crop to the control: a 10% state layer across a
  // whole phone viewport is a smudge, and the evidence has to be legible.
  // A clip (not an element screenshot) keeps the control's own box — the
  // element screenshot of a stretched native control lies about its size.
  if (box) {
    const pad = 12;
    await page.screenshot({
      path: file,
      clip: {
        x: Math.max(0, box.x - pad),
        y: Math.max(0, box.y - pad),
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      },
    });
  } else {
    await page.screenshot({ path: file });
  }
  const bytes = await Buffer.from(await Bun.file(file).arrayBuffer());
  const md5 = createHash("md5").update(bytes).digest("hex");
  shots.push({ name, file, md5 });
  console.log(`  ${name}.png  md5 ${md5}`);
}

const browser = await chromium.launch();

// ---------------------------------------------------------------- pressables
console.log("native pressables (component pages, mobile tab):");
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  });
  const page = await context.newPage();

  for (const [slug, label, selector] of [
    ["switch", "switch", '[role="switch"]'],
    ["button", "button", 'button:has-text("Filled")'],
    ["chip", "chip", 'button:has-text("Assist")'],
  ]) {
    await page.goto(`${BASE}/components/m3/${slug}?tab=mobile`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(1500);
    const el = page.locator(selector).first();
    if ((await el.count()) === 0) {
      console.log(`  ${label}: not found — skipped`);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const box = await el.boundingBox();
    if (box) {
      await shoot(page, `native-${label}-unpressed`, box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(400);
      await shoot(page, `native-${label}-pressed`, box);
      await page.mouse.up();
      await page.waitForTimeout(250);
    }
  }
  await context.close();
}

// ---------------------------------------------------------------- gallery
for (const [scheme, width, height, tag] of [
  ["light", 1440, 1000, "desktop-light"],
  ["dark", 1440, 1000, "desktop-dark"],
  ["light", 390, 844, "mobile-light"],
  ["dark", 390, 844, "mobile-dark"],
]) {
  console.log(`gallery ${tag}:`);
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: scheme,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/components`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await shoot(page, `gallery-${tag}`);
  await context.close();
}

await browser.close();

writeFileSync(
  join(OUT, "screenshots.md"),
  `# Batch 2 visual evidence\n\nTaken from the built site (vite preview) at commit 7a266ca1.\n\n| shot | md5 |\n|---|---|\n${shots
    .map((s) => `| ${s.name}.png | \`${s.md5}\` |`)
    .join("\n")}\n`,
);
console.log(`\n${shots.length} shot(s) written to ${OUT}`);
