/**
 * SPEC 1 of 3 — dialog focus trap.
 *
 * kern-lead's Improvement #2 named this first, and it is the right first:
 * a modal dialog that leaks focus is an accessibility defect a user hits
 * immediately (a screen-reader user tabs into the page behind the modal and
 * loses their place) and that no unit test in this repo can see.
 *
 * WHAT IS ASSERTED, and why each one is load-bearing:
 *   - `role="dialog"` + `aria-modal="true"` — without `aria-modal` assistive
 *     tech treats the rest of the page as live and keeps reading it. (The board
 *     records that Base UI's `Dialog.Popup` does NOT emit `aria-modal` and that
 *     kern sets it explicitly — so this assertion pins work kern actually did,
 *     and would catch its removal.)
 *   - accessible name via `aria-labelledby` — a nameless dialog is announced as
 *     just "dialog".
 *   - focus moves INTO the dialog on open — the trap that does not engage is
 *     the defect.
 *   - Tab cycles WITHIN the dialog — never escaping to the page behind. This is
 *     the assertion that fails if the trap is removed.
 *   - Shift+Tab cycles backwards within it.
 *   - Escape dismisses and returns focus to the trigger — focus restoration is
 *     part of the contract; a dialog that eats focus on close strands the user
 *     at the top of the document.
 *
 * Selectors are the ones the live DOM actually emits (verified against the
 * running site before writing this file), not assumed ones.
 */
import { expect, test } from '@playwright/test';
import { clickUntil, gotoSettled } from './support/interactions';

const DIALOG_PAGE = '/components/web/dialog';

test.describe('dialog focus trap', () => {
  test.beforeEach(async ({ page }) => {
    await gotoSettled(page, DIALOG_PAGE);
  });

  test('opens as a named, modal dialog and pulls focus inside', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    await clickUntil(
      page,
      page.getByRole('button', { name: 'Open dialog' }).first(),
      dialog,
      'the dialog',
    );

    // aria-modal must be the string "true"; getAttribute avoids the boolean
    // coercion trap where aria-modal="false" reads as truthy.
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    const labelledBy = await dialog.getAttribute('aria-labelledby');
    expect(labelledBy, 'dialog has no aria-labelledby').toBeTruthy();
    const nameId = await page.evaluate(
      (id) => document.getElementById(id ?? '')?.textContent?.trim() ?? '',
      labelledBy,
    );
    expect(nameId.length, 'aria-labelledby points at nothing').toBeGreaterThan(0);

    // Focus must already be inside the dialog when it opens.
    const focusedInside = await page.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"]');
      return !!dlg && !!document.activeElement && dlg.contains(document.activeElement);
    });
    expect(focusedInside, 'focus did not move into the dialog on open').toBe(true);
  });

  test('Tab and Shift+Tab never reach page content behind the dialog', async ({
    page,
  }) => {
    const dialog = page.getByRole('dialog');
    await clickUntil(
      page,
      page.getByRole('button', { name: 'Open dialog' }).first(),
      dialog,
      'the dialog (tab-trap)',
    );

    // THE CONTRACT, stated correctly after measuring the implementation.
    //
    // The naive assertion — "document.activeElement is always inside the
    // dialog element" — is WRONG, and my first version of this spec asserted
    // it and went red against a dialog whose focus trap is working perfectly.
    // Base UI's trap is guard-based: it renders two
    // `<span data-base-ui-focus-guard tabindex="0" aria-hidden="true">`
    // sentinels on either side of the trapped content. Tabbing off the last
    // control legitimately lands on a guard, which then moves focus back into
    // the trap. A guard is the MECHANISM, not an escape.
    //
    // What must never happen is focus reaching interactive page content behind
    // the dialog. Measured over 3 runs x 12 presses: 0 leaks, and the only
    // non-dialog stops were the two guards.
    const focusables = dialog.locator(
      'button:not([disabled]), input:not([disabled]), textarea, a[href], [tabindex]:not([tabindex="-1"])',
    );
    const count = await focusables.count();
    expect(count, 'dialog has nothing to trap focus between').toBeGreaterThanOrEqual(2);

    const leaked: string[] = [];
    const probe = async (key: 'Tab' | 'Shift+Tab', n: number) => {
      await page.keyboard.press(key);
      // A real user's keypress cadence. Reading activeElement in the same tick
      // races the trap's own programmatic redirect and reports a transient
      // BODY focus that is not what the user experiences.
      await page.waitForTimeout(60);
      const where = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a) return { label: 'none', leak: false };
        const dlg = document.querySelector('[role="dialog"]');
        const isGuard = a.hasAttribute('data-base-ui-focus-guard');
        const inDialog = !!(dlg && dlg.contains(a));
        const label = `${a.tagName}"${(a.textContent || '').trim().slice(0, 18)}"`;
        const interactive =
          ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(a.tagName) ||
          a.getAttribute('tabindex') === '0';
        return { label, guard: isGuard, leak: interactive && !isGuard && !inDialog };
      });
      if (where.leak) leaked.push(`${key}#${n} -> ${where.label}`);
    };

    // Well past the number of controls, so the cycle wraps several times.
    for (let i = 1; i <= count + 4; i++) await probe('Tab', i);
    for (let i = 1; i <= count + 4; i++) await probe('Shift+Tab', i);

    expect(
      leaked,
      `focus reached interactive page content behind the dialog: ${leaked.join(', ')}`,
    ).toEqual([]);
  });

  test('Escape dismisses the dialog and returns focus to the trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Open dialog' }).first();
    const dialog = page.getByRole('dialog');
    await clickUntil(page, trigger, dialog, 'the dialog');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    // Focus restoration, not just dismissal.
    const restored = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return { tag: el?.tagName ?? null, text: (el?.textContent ?? '').trim() };
    });
    expect(restored.tag).toBe('BUTTON');
    expect(restored.text).toContain('Open dialog');
  });
});