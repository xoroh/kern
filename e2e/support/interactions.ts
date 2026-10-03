/**
 * qa kern e2e — shared interaction helpers.
 *
 * WHY THESE EXIST
 * The site is server-rendered, so Playwright can find and click a trigger
 * button that exists in the SSR HTML before React has hydrated and attached its
 * handler. The click is then swallowed and the overlay never opens. Measured:
 * with a straight `goto` + `click`, the first two sheet tests failed with
 * `getByRole('dialog') — element(s) not found` while the same click on a
 * settled page opened the sheet 3/3 times.
 *
 * The fix is deliberately NOT `waitForTimeout`. A fixed settle is a guess that
 * is simultaneously too slow on a fast machine and too short on a loaded CI
 * runner — the flake class this repo has already been bitten by twice. Instead
 * we assert the OUTCOME and retry the interaction until it happens: a real user
 * whose click lands before hydration simply clicks again.
 */
import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Click `trigger` until `expected` becomes visible, or fail with a message that
 * says what was actually on the page.
 */
export async function clickUntil(
  page: Page,
  trigger: Locator,
  expected: Locator,
  what: string,
  attempts = 10,
): Promise<void> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    await trigger.click();
    try {
      await expected.waitFor({ state: 'visible', timeout: 1_500 });
      return;
    } catch (err) {
      lastError = err;
      // Let hydration finish before the next attempt rather than hammering.
      await page.waitForTimeout(250);
    }
  }
  const count = await page.locator('[role="dialog"]').count();
  throw new Error(
    `${what} did not open after ${attempts} clicks. ` +
      `[role="dialog"] count on the page: ${count}. Last error: ${String(lastError)}`,
  );
}

/** Navigate and wait until the app is interactive, without guessing a duration. */
export async function gotoSettled(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle' });
  // `load` fires after hydration's own scripts have run; combined with
  // networkidle it means both the document and its lazy chunks are in.
  await page.waitForLoadState('load');
  expect(page.url()).toContain(path);
}