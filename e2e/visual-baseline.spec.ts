/**
 * SPEC 4 — visual-regression baseline SEED.
 *
 * This spec does not assert pixels. It captures them: full-page screenshots of
 * the two routes that must always paint (home, one component detail page) into
 * `test-results/baseline/`, which the `e2e` CI job uploads as an artifact.
 * Those captures are the seed a future `toHaveScreenshot` baseline grows
 * from — promoted by a human who has looked at the picture, never auto-cut.
 *
 * Why a seed and not the assertion: a pixel baseline committed sight-unseen
 * pins whatever the renderer happened to emit, including a white screen with
 * a title. The order is capture first (this spec), review, then pin. Until
 * the pin lands, the load-bearing assertions here are the same painted-verify
 * standard as the page-render spec: HTTP 200, a real `<title>`, exactly one
 * `<h1>`, and rasterised pixels that are a picture rather than a blank.
 *
 * Determinism notes (so the captures are comparable run to run):
 *   - viewport is fixed by playwright.config.ts (1400x1000), not by the spec;
 *   - animations are disabled for the capture only;
 *   - the page settles on networkidle plus a short timeout before capture,
 *     the same settle the page-render spec uses.
 */
import { expect, test } from "@playwright/test";
import { expectPainted } from "./support/painted";

const ROUTES = ["/", "/components/web/dialog"] as const;

test.describe("visual baseline (seed captures)", () => {
  for (const route of ROUTES) {
    test(`captures ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), `${route} did not return 200`).toBe(200);

      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);

      const report = await expectPainted(page, route);
      console.log(
        `baseline-seed OK ${route}: ${report.distinctColours} distinct colours, ` +
          `${(report.nonDominantRatio * 100).toFixed(2)}% non-dominant @ ${report.width}x${report.height}`,
      );

      const slug = route === "/" ? "home" : "component-dialog";
      await page.screenshot({
        path: `test-results/baseline/${slug}.png`,
        fullPage: true,
        animations: "disabled",
      });
    });
  }

  test("captured pages carry title and one h1", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page).toHaveTitle(/kern/i);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
});
