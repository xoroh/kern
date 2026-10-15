import { describe, expect, it } from "bun:test";
import { isShapeLegal } from "./shape-law.mjs";

// Shape-table keys, mirroring tokens.shape for the fallback-membership leg.
const SHAPE_KEYS = new Set([
  "none",
  "extra-small",
  "small",
  "medium",
  "large",
  "large-increased",
  "extra-large",
  "extra-large-increased",
  "extra-extra-large",
  "full",
]);

describe("shape law (AUD-001)", () => {
  it("accepts the pre-existing legal forms", () => {
    for (const cls of [
      "rounded-none",
      "rounded-full",
      "rounded-t-full",
      "rounded-[inherit]",
      "rounded-(--sys-shape-corner-medium)",
      "rounded-t-(--sys-shape-corner-full)",
    ]) {
      expect(isShapeLegal(cls, SHAPE_KEYS)).toBe(true);
    }
  });

  it("accepts the A4 component-token form with an on-scale fallback", () => {
    for (const cls of [
      "rounded-[var(--comp-button-container-shape,var(--sys-shape-corner-full))]",
      "rounded-[var(--comp-card-container-shape,var(--sys-shape-corner-medium))]",
      "rounded-[var(--comp-chip-container-shape,var(--sys-shape-corner-small))]",
      "rounded-[var(--comp-switch-track-shape,var(--sys-shape-corner-full))]",
      "rounded-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
      "rounded-t-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
    ]) {
      expect(isShapeLegal(cls, SHAPE_KEYS)).toBe(true);
    }
  });

  it("negative control: off-scale and arbitrary radii still fail", () => {
    for (const cls of [
      "rounded-[12px]",
      "rounded-3xl",
      "rounded-[var(--comp-x,var(--sys-shape-corner-jumbo))]",
      "rounded-[var(--comp-x,12px)]",
      "rounded-[var(--sys-shape-corner-medium)]",
    ]) {
      expect(isShapeLegal(cls, SHAPE_KEYS)).toBe(false);
    }
  });
});
