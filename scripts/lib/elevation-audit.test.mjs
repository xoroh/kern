import { describe, expect, test } from "bun:test";
import { KERN_ELEVATION_COMPONENTS } from "../../packages/kern-tokens/src/kern-elevation.ts";
import { classifyElevation, elevationCode } from "./elevation-audit.mjs";

describe("elevation audit", () => {
  test("variant arrays including hover levels are consumed without parsing comments", () => {
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.button, [1, 2])).toBe(
      "ASSERTED",
    );
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.fab, [1, 2, 3, 4])).toBe(
      "ASSERTED",
    );
    expect(
      classifyElevation(KERN_ELEVATION_COMPONENTS["fab-menu"], [3, 4]),
    ).toBe("ASSERTED");
  });
  test("elevated chips and Expressive floating toolbars have explicit variant coverage", () => {
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.chip, [1])).toBe(
      "ASSERTED",
    );
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.toolbar, [3])).toBe(
      "ASSERTED",
    );
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.toolbar, [])).toBe(
      "ABSENT-0",
    );
  });
  test("a valid level cannot mask an unearned shadow", () => {
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.button, [1, 5])).toBe(
      "MISMATCH",
    );
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.chip, [3])).toBe(
      "MISMATCH",
    );
    expect(classifyElevation(KERN_ELEVATION_COMPONENTS.toolbar, [5])).toBe(
      "MISMATCH",
    );
  });
  test("missing required elevation fails, absent zero is conformant", () => {
    expect(classifyElevation({ variants: [3] }, [])).toBe("GAP");
    expect(classifyElevation({ variants: [0] }, [])).toBe("ABSENT-0");
    expect(classifyElevation(null, [2])).toBe("NO-SPEC");
  });
  test("invalid measurements never turn into a misleading audit row", () => {
    for (const level of [Number.NaN, 1.5, -1, 6]) {
      expect(() => classifyElevation({ variants: [1] }, [level])).toThrow(
        "Invalid elevation",
      );
    }
  });
  test("comments cannot declare shadows; real strings and URLs survive", () => {
    const source =
      '// --md-sys-elevation-level5\nconst url = "https://example.com";\n/* --md-sys-elevation-level4 */\nconst shadow = "shadow-(--md-sys-elevation-level1)";';
    const code = elevationCode(source);
    expect(code).not.toContain("elevation-level5");
    expect(code).not.toContain("elevation-level4");
    expect(code).toContain('"https://example.com"');
    expect(code).toContain("elevation-level1");
    expect(code.split("\n").length).toBe(source.split("\n").length);
  });
});
