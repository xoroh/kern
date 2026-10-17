/** Visual pass for the M3 fidelity work: 6 pages x {1440, 390} x {light, dark}
 * + search palette + mobile drawer + hover/focus interaction states.
 * Run: bun run-shots.mjs  (preview server must be up on :4173)
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:4191";
const OUT = "/tmp/opencode/kern-m3-fidelity/.reports/m3-fidelity/";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["button", "/components/web/button"],
  ["states", "/foundations/m3/states"],
  ["color", "/foundations/m3/color"],
  ["theme", "/foundations/m3/theme"],
  ["playground", "/playground"],
];

const browser = await chromium.launch();
for (const mode of ["light", "dark"]) {
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: mode === "dark" ? "dark" : "light",
    });
    await ctx.addInitScript(
      (m) => window.localStorage.setItem("kern-tokens-mode", m),
      mode,
    );
    const page = await ctx.newPage();
    for (const [name, path] of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}${name}-${width}-${mode}.png` });
    }
    // search palette open (home, desktop width only)
    if (width === 1440) {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      await page.keyboard.press("ControlOrMeta+k");
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}search-${mode}.png` });
      await page.keyboard.press("Escape");
    }
    // mobile drawer open (phone width)
    if (width === 390) {
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const burger = page.getByRole("button", {
        name: "Open navigation menu",
      });
      if ((await burger.count()) > 0) {
        await burger.first().click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: `${OUT}drawer-${mode}.png` });
      }
    }
    await ctx.close();
  }
}
// interaction states: hover + keyboard focus on the button page (1440 light)
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await ctx.addInitScript(() =>
    window.localStorage.setItem("kern-tokens-mode", "light"),
  );
  const page = await ctx.newPage();
  await page.goto(BASE + "/components/web/button", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(600);
  const filled = page
    .getByRole("button", { name: /filled|primary/i })
    .first();
  if ((await filled.count()) > 0) {
    await filled.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}button-hover-light.png` });
    await filled.focus();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}button-focus-light.png` });
  } else {
    await page.screenshot({ path: `${OUT}button-states-missing.png` });
  }
  await ctx.close();
}
await browser.close();
console.log("shots done ->", OUT);
