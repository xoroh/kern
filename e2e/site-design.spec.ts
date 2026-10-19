import { expect, type Page, test } from "@playwright/test";
import { gotoSettled } from "./support/interactions";

async function visit(page: Page, path: string) {
  await gotoSettled(page, path);
  // SSR controls are visible before React attaches their event handlers.
  // /playground is system-agnostic (M3/Astryx/shadcn switcher) and never sets
  // the Kern theme attribute — its overflow check stands on its own.
  if (path === "/playground") return;
  await expect(page.locator("html")).toHaveAttribute(
    "data-kern-theme",
    "material-3",
    { timeout: 30_000 },
  );
}

test("desktop header and homepage controls are usable", async ({ page }) => {
  await visit(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Make it\s*feel right\./,
  );
  const navigation = page.getByRole("navigation", {
    name: "Primary",
    exact: true,
  });
  const labelSize = await navigation
    .getByRole("link", { name: "Components", exact: true })
    .evaluate((el) => getComputedStyle(el).fontSize);
  expect(labelSize).toBe("14px");
  await expect(
    navigation.getByRole("link", { name: "Docs", exact: true }),
  ).toBeVisible();
  expect((await navigation.boundingBox())?.y).toBeLessThan(80);
  await page
    .getByRole("button", { name: "Make something", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Made it yours", exact: true }),
  ).toBeVisible();
  const design = page.getByRole("button", { name: "Design", exact: true });
  await design.click();
  await expect(design).toHaveAttribute("aria-pressed", "false");
});

test("theme toggle persists dark mode across a reload", async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("kern-tokens-mode"))
      localStorage.setItem("kern-tokens-mode", "light");
  });
  await visit(page, "/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("kern-tokens-mode")))
    .toBe("dark");
  await page.reload({ waitUntil: "networkidle" });
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible({ timeout: 30_000 });
});

test("phone drawer replaces desktop header tabs", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, "/");
  await expect(page.locator('header nav[aria-label="Primary"]')).toBeHidden();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toBeFocused();
});

test("search still opens, filters, and restores focus", async ({ page }) => {
  await visit(page, "/");
  const trigger = page.getByRole("button", {
    name: "Search (Command K)",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Search", exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("combobox").fill("button");
  await expect(dialog.getByRole("option").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const path of [
  "/",
  "/docs",
  "/components/m3/button",
  "/playground",
  "/showcase",
]) {
  test(`phone layout stays within the viewport: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    // Keep the component stack in CI output; production hydration failures
    // otherwise collapse to an opaque minified React error code.
    page.on("pageerror", (error) => errors.push(error.stack ?? error.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, path);
    // /playground is a workbench with no h1 by design; its app rail is the
    // settled marker there.
    if (path === "/playground") {
      await expect(page.getByLabel("Playground App Rail")).toBeVisible();
    } else {
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    // /playground is a full-bleed workbench with no #main by design;
    // overflow is measured on the document there.
    const dimensions =
      path === "/playground"
        ? await page.evaluate(() => ({
            width: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
          }))
        : await page.locator("#main").evaluate((main) => ({
            width: main.clientWidth,
            scroll: main.scrollWidth,
          }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    expect(errors).toEqual([]);
  });
}
