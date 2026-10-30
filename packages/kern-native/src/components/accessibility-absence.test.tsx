import { describe, expect, it, vi } from "vitest";

/**
 * U-K1: bun 1.3.8 CJS interop drops getter-based react-native exports, so a
 * mock built by spreading the real module sees NO AccessibilityInfo — the
 * binding reads as undefined (use-time crash, not import-time). Vitest's
 * mock validator throws on wholly-absent keys instead, so the mock defines
 * the key with value undefined: the faithful 1.3.8 shape.
 */
vi.mock("react-native", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-native")>();
  const { AccessibilityInfo: _absent, ...rest } = actual;
  return { ...rest, AccessibilityInfo: undefined };
});

import { createElement } from "react";
// react-test-renderer ships without type declarations in this workspace.
// @ts-expect-error — untyped package.
import { act, create as createTree } from "react-test-renderer";
import {
  focusAccessibilityNode,
  reduceMotionEnabled,
} from "../utils/accessibility";
import { LoadingIndicator } from "./loading-indicator";
import { SheetSurface } from "./sheet-surface";

/**
 * U-K1 regression: vendor components must tolerate an absent
 * AccessibilityInfo (bun 1.3.8 mock shape). Fails pre-fix with
 * "Cannot read properties of undefined"; passes post-fix with
 * device-identical behaviour (unavailable = keep animating / no-op focus).
 */
describe("U-K1 absent AccessibilityInfo tolerance", () => {
  it("renders LoadingIndicator without the reduce-motion API", async () => {
    let tree: { unmount: () => void } | undefined;
    await act(async () => {
      tree = createTree(createElement(LoadingIndicator, { label: "Busy" }));
    });
    expect(tree).toBeDefined();
    tree?.unmount();
  });

  it("imports and renders SheetSurface without the focus API", async () => {
    let tree: { unmount: () => void } | undefined;
    await act(async () => {
      tree = createTree(
        createElement(SheetSurface, {
          open: true,
          title: "Sheet",
          surface: {},
          testID: "kern-sheet",
        }),
      );
    });
    expect(tree).toBeDefined();
    tree?.unmount();
  });

  it("no-ops the focus move and reduce-motion query without the API", async () => {
    expect(() => focusAccessibilityNode(123)).not.toThrow();
    expect(reduceMotionEnabled()).toBeUndefined();
  });
});
