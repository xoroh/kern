import { describe, expect, it, vi } from "vitest";
import { focusAccessibilityNode, reduceMotionEnabled } from "./accessibility";

/**
 * U-K1 helper contract: device behaviour delegates, absent API degrades.
 * The absent-API cases are what a bun-1.3.8-shaped mock (getter dropped)
 * hits; the present-API cases pin that the helper changes nothing on device.
 */
describe("accessibility helper (U-K1)", () => {
  it("no-ops focus for a null tag without touching the API", () => {
    expect(() => focusAccessibilityNode(null)).not.toThrow();
  });

  it("delegates focus to setAccessibilityFocus when present", async () => {
    const rn = await import("react-native");
    const spy = vi.spyOn(
      rn.AccessibilityInfo as unknown as {
        setAccessibilityFocus: (tag: number) => void;
      },
      "setAccessibilityFocus",
    );
    focusAccessibilityNode(7);
    expect(spy).toHaveBeenCalledWith(7);
    spy.mockRestore();
  });

  it("resolves the OS reduce-motion value when present", async () => {
    await expect(reduceMotionEnabled()).resolves.toBe(false);
  });
});
