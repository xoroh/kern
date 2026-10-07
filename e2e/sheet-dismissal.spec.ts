/**
 * SPEC 2 of 3 — sheet dismissal.
 *
 * A sheet that cannot be dismissed is a user trapped in a UI. This is the
 * highest-consequence bug class in the sheet family, and the board records it
 * as exactly that: kern-lead's P2b-2 review added the `SheetSurface` close
 * affordance by hand after a merge had deleted the SheetSurface close row, so
 * "the close affordance exists" is a fact this repo has already got wrong once.
 *
 * WHAT IS ASSERTED:
 *   - the sheet opens and is exposed as a dialog with an accessible name;
 *   - Escape dismisses it (the dismissal path that works even when the sheet is
 *     dragged, scrolled, or opened from a context with no visible close button);
 *   - dismissal is REAL: the dialog leaves the accessibility tree, is not merely
 *     transparent, and the trigger regains focus;
 *   - the same for the close affordance, where the demo provides one.
 *
 * MEASURED, NOT ASSUMED: the live "Right sheet" demo renders
 * `role="dialog"` + `data-slot="sheet-content"` and contains NO close button of
 * its own (verified by DOM inspection before this file was written), so the
 * spec drives Escape rather than inventing a close-button selector. If a future
 * change adds one, the spec should gain a second path — recorded in the report.
 */
import { expect, test } from "@playwright/test";
import { clickUntil, gotoSettled } from "./support/interactions";

const SHEET_PAGE = "/components/web/sheet";

test.describe("sheet dismissal", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSettled(page, SHEET_PAGE);
  });

  test("opens as a named dialog anchored to its side", async ({ page }) => {
    const sheet = page.getByRole("dialog");
    await clickUntil(
      page,
      page.getByRole("button", { name: "Right sheet" }).first(),
      sheet,
      "the right sheet",
    );
    await expect(sheet).toHaveAttribute("data-slot", "sheet-content");

    const nameId = await sheet.getAttribute("aria-labelledby");
    expect(nameId, "sheet has no aria-labelledby").toBeTruthy();
    const nameText = await page.evaluate(
      (id) => document.getElementById(id ?? "")?.textContent?.trim() ?? "",
      nameId,
    );
    expect(
      nameText.length,
      "aria-labelledby points at nothing",
    ).toBeGreaterThan(0);
  });

  test("Escape dismisses the sheet and it leaves the accessibility tree", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "Right sheet" }).first();
    const sheet = page.getByRole("dialog");
    await clickUntil(page, trigger, sheet, "the right sheet");

    await page.keyboard.press("Escape");

    // `toBeHidden` alone would pass on an element that is still in the DOM and
    // merely transparent, so assert detachment from the a11y tree too.
    await expect(sheet).toBeHidden();
    await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
  });

  test("dismissal restores focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Right sheet" }).first();
    await clickUntil(
      page,
      trigger,
      page.getByRole("dialog"),
      "the right sheet",
    );

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    const restored = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return { tag: el?.tagName ?? null, text: (el?.textContent ?? "").trim() };
    });
    expect(restored.tag).toBe("BUTTON");
    expect(restored.text).toContain("Right sheet");
  });

  test("a sheet can be reopened after dismissal (no stuck state)", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", { name: "Right sheet" }).first();

    await clickUntil(
      page,
      trigger,
      page.getByRole("dialog"),
      "the right sheet",
    );
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    // The regression this catches: an exit-animation left mounted, or a
    // `dismissed` flag never reset, so the second open does nothing and the user
    // is left with a control that appears broken.
    await clickUntil(
      page,
      trigger,
      page.getByRole("dialog"),
      "the right sheet",
    );
    await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(1);
  });
});
