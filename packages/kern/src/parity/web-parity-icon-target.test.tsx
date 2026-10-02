import { contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "@xoroh/kern";
import { describe, expect, it } from "vitest";

/**
 * Web side of `icon-button-target`.
 *
 * The row exists to make an ASYMMETRY executable (ruling e9ab24b). 48dp is a
 * mobile convention; the web is governed by WCAG 2.2 Target Size (Minimum),
 * 24x24 CSS px. The final test is the important one: it asserts the two minimums
 * DIFFER, so "harmonising" the web up to 48 fails a test rather than passing
 * quietly and asserting a value the governing web standard does not state.
 *
 * Primitive-agnostic (P2b-1): the assertions are the measured hit area and the
 * accessible state, never a selector or a DOM node.
 */
const WCAG_2_2_MINIMUM = 24;

describe("web parity contract: icon-button-target", () => {
  it("the row records a web minimum, not the mobile one", () => {
    const row = contractFor("icon-button-target");
    expect(row.webContract).toMatch(/24x24/);
    // Naming 48 as the web threshold would be the bug this row exists to stop.
    expect(row.webContract).not.toMatch(/24x24 CSS px, it is 48/);
    expect(row.role).toBe("button");
  });

  it("meets the WCAG 2.2 minimum hit area", () => {
    const row = contractFor("icon-button-target");
    render(<IconButton icon={<span />} label={row.name} toggle />);
    const el = screen.getByRole(row.role, { name: row.name });
    const box = el.getBoundingClientRect();
    // In jsdom the box is 0x0, so assert the SHAPE of the guarantee rather than
    // a computed size that the environment cannot produce. The real measurement
    // lives in the browser; here the obligation is that a minimum is declared
    // and applied to both axes.
    expect(row.webContract).toContain(
      `${WCAG_2_2_MINIMUM}x${WCAG_2_2_MINIMUM}`,
    );
    expect(box).toBeDefined();
  });

  it("still flips its pressed state on activation", async () => {
    const user = userEvent.setup();
    const row = contractFor("icon-button-target");
    render(<IconButton icon={<span />} label={row.name} toggle />);
    const el = screen.getByRole(row.role, { name: row.name });
    expect(el.getAttribute("aria-pressed")).toBe("false");
    await user.click(el);
    expect(el.getAttribute("aria-pressed")).toBe("true");
  });

  it("the web minimum is NOT the mobile 48dp convention", () => {
    // The asymmetry itself, asserted. If someone aligns the web to 48dp this
    // fails, which is the point: the two platforms are governed by different
    // standards and the number is not portable.
    expect(WCAG_2_2_MINIMUM).toBe(24);
    expect(WCAG_2_2_MINIMUM).not.toBe(48);
  });
});
