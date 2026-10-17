import "@testing-library/jest-dom/vitest";
import { registerM3 } from "@xoroh/kern-m3";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Explicit M3 registration (decision 010), test harness included: this
// setup is the suite's ENTRY, exactly as an app calls `registerM3()` once at
// startup. Importing "@xoroh/kern" or "@xoroh/kern-m3" registers nothing —
// entry-purity.test.ts proves that on a fresh module registry this setup
// cannot reach.
registerM3();

afterEach(() => {
  cleanup();
});

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom implements neither the Pointer Events capture API nor scrollIntoView,
// and Base UI's Menu.Trigger calls setPointerCapture/hasPointerCapture on
// pointerdown. Without them the handler throws, the open transition never
// runs, and the menu silently never opens — the trigger stays
// aria-expanded="false" with no error anywhere. That is what made a bare
// `Menu.Root` untestable here: the failure looked like a kern bug and was an
// environment gap.
//
// These are no-op stand-ins, correct for tests: real capture matters for
// drag-and-drop, and a menu trigger does not drag. PointerEvent itself EXISTS
// in this jsdom, which is why pointerdown fires at all and the failure was so
// confusing to diagnose.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function hasPointerCapture() {
    return false;
  };
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function setPointerCapture() {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function releasePointerCapture() {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}
