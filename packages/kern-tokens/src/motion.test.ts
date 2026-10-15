import { describe, expect, it } from "vitest";
import {
  motionCssVars,
  prefersReducedMotion,
  resolveMotionScheme,
  springConfig,
} from "./motion";
import { tokens } from "./tokens";

describe("resolveMotionScheme", () => {
  it("resolves the standard scheme to the standard easing", () => {
    const resolved = resolveMotionScheme("standard");
    expect(resolved.scheme).toBe("standard");
    expect(resolved.easing).toBe(tokens.motion.easing.standard);
    expect(resolved.suppressSpatial).toBe(false);
  });

  it("resolves expressive to the emphasized easing with the same springs", () => {
    const resolved = resolveMotionScheme("expressive");
    expect(resolved.scheme).toBe("expressive");
    expect(resolved.easing).toBe(tokens.motion.easing.emphasized);
    expect(resolved.easingAccelerate).toBe(
      tokens.motion.easing["emphasized-accelerate"],
    );
    expect(resolved.springs["spatial-default"]).toEqual(
      tokens.motion.spring["spatial-default"],
    );
  });

  it("marks reduced as spatially suppressed on the standard scheme", () => {
    const resolved = resolveMotionScheme("reduced");
    expect(resolved.scheme).toBe("standard");
    expect(resolved.suppressSpatial).toBe(true);
  });

  it("fails loud on unknown algorithms", () => {
    expect(() => resolveMotionScheme("bouncy" as never)).toThrow(
      "Unknown motion algorithm",
    );
  });
});

describe("springConfig", () => {
  it("returns stiffness/damping pairs from the token source", () => {
    expect(springConfig("spatial-default")).toEqual({
      stiffness: 700,
      damping: 45,
    });
    expect(springConfig("effects-fast")).toEqual({
      stiffness: 3800,
      damping: 1400,
    });
  });

  it("fails loud on unknown springs", () => {
    expect(() => springConfig("wobble" as never)).toThrow("Unknown spring");
  });
});

describe("motionCssVars", () => {
  it("is empty for standard (the stylesheet default already is standard)", () => {
    expect(motionCssVars("standard")).toEqual({});
  });

  it("overrides the easing anchor for expressive", () => {
    const vars = motionCssVars("expressive");
    expect(vars["--sys-motion-easing-standard"]).toBe(
      tokens.motion.easing.emphasized,
    );
    expect(vars["--sys-motion-easing-standard-accelerate"]).toBe(
      tokens.motion.easing["emphasized-accelerate"],
    );
  });

  it("flags spatial suppression for reduced", () => {
    expect(motionCssVars("reduced")["--sys-motion-suppress-spatial"]).toBe(
      "1",
    );
  });
});

describe("prefersReducedMotion", () => {
  it("is false without a DOM media query", () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});
