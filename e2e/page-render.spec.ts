/**
 * SPEC 3 of 3 — one page render, painted-verified (the founder's white-screen
 * standard).
 *
 * Why this is a real spec and not a smoke test: the failure it exists to catch
 * is the one every other assertion in a browser suite is blind to. A TanStack
 * Start site can serve HTTP 200, mount React, attach every element, satisfy
 * `toBeVisible()` on all of them, and still show the user a WHITE SCREEN — a
 * runtime throw after first paint, a CSS import that resolved to an empty
 * bundle, a token set that collapsed every colour to the same value.
 *
 * So this spec rasterises the page and counts actual pixels (see
 * `support/painted.ts` for the method). "Rendered" means there is a picture.
 *
 * It also pins the things a docs site is uniquely able to break silently:
 * a real <title>, exactly one <h1>, no console errors, no failed requests, and
 * the design tokens resolving to real colours rather than transparent.
 */
import { expect, test } from "@playwright/test";
import { expectPainted } from "./support/painted";

const HOME = "/";

test.describe("page render (painted-verify)", () => {
  test("the home page paints a real picture, not a white screen", async ({
    page,
  }) => {
    const errors: string[] = [];
    const failedRequests: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("requestfailed", (r) =>
      failedRequests.push(
        `${r.method()} ${r.url()} — ${r.failure()?.errorText}`,
      ),
    );

    const response = await page.goto(HOME, { waitUntil: "networkidle" });
    expect(response?.status(), "home page did not return 200").toBe(200);

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // THE assertion. Measured off the real rasterised pixels.
    const report = await expectPainted(page, "home page");

    // A white screen can still have a title and an h1, so these are additional
    // to the paint check, not a substitute for it.
    await expect(page).toHaveTitle(/kern/i);

    const h1s = page.locator("h1");
    await expect(h1s, "home page has no <h1>").toHaveCount(1);

    // The kern design tokens must resolve to real colours. If the CSS import
    // broke, `var(--md-sys-color-surface-container)` falls back to transparent
    // and every surface silently renders as the page background — attached,
    // visible, and wrong.
    const token = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.background = "var(--md-sys-color-surface-container)";
      document.body.appendChild(probe);
      const bg = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return bg;
    });
    expect(
      token,
      `--md-sys-color-surface-container resolved to ${token} — the kern token CSS did not load`,
    ).not.toBe("rgba(0, 0, 0, 0)");

    expect(errors, `console/page errors: ${errors.join(" | ")}`).toEqual([]);
    expect(
      failedRequests,
      `failed requests: ${failedRequests.join(" | ")}`,
    ).toEqual([]);

    // Report the measurement in the test log so a reviewer sees the number, not
    // just a boolean.
    console.log(
      `painted-verify OK: ${report.distinctColours} distinct colours, ` +
        `${(report.nonDominantRatio * 100).toFixed(2)}% non-dominant @ ${report.width}x${report.height}`,
    );
  });

  test("a component detail page paints too (the deepest real render)", async ({
    page,
  }) => {
    await page.goto("/components/web/dialog", { waitUntil: "networkidle" });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // The component route is where the registry, the demos and the token CSS all
    // have to work together; it is the page most likely to half-render.
    await expectPainted(page, "component detail page");
    await expect(page.locator("h1")).toHaveCount(1);
  });
});
