import * as RN from "react-native";

/**
 * U-K1: getter-tolerant access to react-native's AccessibilityInfo.
 *
 * `AccessibilityInfo` is exposed via a getter that some bundler/mocks drop
 * (bun 1.3.8 CJS interop cannot see it, so a spread-built mock lacks the key
 * entirely). Vendor components must not touch the binding directly: read it
 * through this module's optional shape, and the absent-API case degrades to
 * no-op / undefined instead of a TypeError. On device every method exists,
 * so behaviour there is byte-identical to the direct call.
 *
 * Side-effect free and intentionally NOT re-exported from the package
 * barrel (entry-purity): components import this module directly.
 */
type AccessibilityShape = {
  setAccessibilityFocus?: (tag: number) => void;
  isReduceMotionEnabled?: () => Promise<boolean>;
};

function info(): AccessibilityShape | undefined {
  // Namespace read, never a named import: a named import lets the bundler
  // or mock validator fail the module when the getter-based export is
  // absent; a property read degrades to undefined and the guards below hold.
  return (RN as unknown as { AccessibilityInfo?: AccessibilityShape })
    .AccessibilityInfo;
}

/** Move screen-reader focus; no-op when the tag is nullish or the API is absent. */
export function focusAccessibilityNode(tag: number | null | undefined): void {
  if (tag !== null && tag !== undefined) {
    info()?.setAccessibilityFocus?.(tag);
  }
}

/**
 * Whether the OS requests reduced motion. `undefined` when the API is
 * absent — callers treat unavailable as "keep animating", same as a
 * rejected query.
 */
export function reduceMotionEnabled(): Promise<boolean> | undefined {
  return info()?.isReduceMotionEnabled?.();
}
