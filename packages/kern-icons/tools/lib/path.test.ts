import { describe, expect, test } from "vitest";

import {
  concatPathData,
  inspectPathData,
  invertTransform,
  parseViewBox,
  pathBounds,
  transformPathData,
  viewBoxToTransform,
} from "./path";

/** Re-reads serialized path data back into number tokens. */
function numbersOf(d: string): Array<number> {
  const out: Array<number> = [];
  const re = /-?\d*\.?\d+/g;
  let m = re.exec(d);
  while (m !== null) {
    const token = m[0];
    m = re.exec(d);
    out.push(Number(token));
  }
  return out;
}

describe("parseViewBox", () => {
  test("reads the four components", () => {
    expect(parseViewBox("0 -960 960 960")).toEqual({
      minX: 0,
      minY: -960,
      width: 960,
      height: 960,
    });
    expect(parseViewBox("0 0 24 24")).toEqual({
      minX: 0,
      minY: 0,
      width: 24,
      height: 24,
    });
  });

  test("accepts comma separators and rejects malformed input", () => {
    expect(parseViewBox("0,0,24,24")).toEqual({
      minX: 0,
      minY: 0,
      width: 24,
      height: 24,
    });
    expect(parseViewBox("0 0 24")).toBeNull();
    expect(parseViewBox("0 0 0 24")).toBeNull();
    expect(parseViewBox(null)).toBeNull();
    expect(parseViewBox(undefined)).toBeNull();
  });
});

describe("viewBoxToTransform", () => {
  test("maps the Material Symbols 960 grid onto 24x24", () => {
    const t = viewBoxToTransform(
      { minX: 0, minY: -960, width: 960, height: 960 },
      24,
    );
    expect(t.scale).toBeCloseTo(0.025, 10);
    expect(t.translateX).toBeCloseTo(0, 10);
    // y' = y * 0.025 + 24, so the -960..0 source range lands on 0..24.
    expect(t.translateY).toBeCloseTo(24, 10);
  });

  test("is the identity for an already-canonical 24x24 source", () => {
    const t = viewBoxToTransform(
      { minX: 0, minY: 0, width: 24, height: 24 },
      24,
    );
    expect(t).toMatchObject({ scale: 1, translateX: 0, translateY: 0 });
  });

  test("centres a non-square source without distorting it", () => {
    // A 48x24 source scales by 0.5 to fit 24 wide, leaving 12 units of
    // vertical padding split evenly.
    const t = viewBoxToTransform(
      { minX: 0, minY: 0, width: 48, height: 24 },
      24,
    );
    expect(t.scale).toBeCloseTo(0.5, 10);
    expect(t.translateX).toBeCloseTo(0, 10);
    expect(t.translateY).toBeCloseTo(6, 10);
  });
});

describe("transformPathData", () => {
  const to24 = { scale: 0.025, translateX: 0, translateY: 24, precision: 3 };

  test("scales and translates absolute coordinates", () => {
    expect(transformPathData("M0 -960L960 0Z", to24)).toBe("M0 0L24 24Z");
  });

  test("treats a leading relative moveto as absolute (SVG 1.1)", () => {
    // The pen starts at the origin, so the delta reads the same either way —
    // but the viewBox translation must still apply or the glyph lands off-grid.
    // ~9% of Material Symbols open with a lowercase `m`.
    expect(transformPathData("m0 -960l400 400", to24)).toBe("m0 0l10 10");
    expect(transformPathData("m551-621 311 217", to24)).toBe(
      "m13.775 8.475 7.775 5.425",
    );
  });

  test("applies the absolute treatment to the first pair only", () => {
    // `m1 2 3 4` is an absolute moveto followed by a *relative* lineto, so the
    // second pair must not be translated.
    expect(transformPathData("m0 -960 400 400", to24)).toBe("m0 0 10 10");
  });

  test("keeps a relative moveto after a close relative to the new pen position", () => {
    // Only the FIRST command gets the absolute treatment.
    expect(transformPathData("M0 -960Zm400 400", to24)).toBe("M0 0Zm10 10");
  });

  test("scales but never translates relative coordinates", () => {
    // A relative delta is a length, not a position: translation would double-apply.
    expect(transformPathData("M0 -960l400 400z", to24)).toBe("M0 0l10 10z");
  });

  test("handles single-coordinate H and V commands", () => {
    expect(transformPathData("M0 -960H960V0Z", to24)).toBe("M0 0H24V24Z");
    expect(transformPathData("M0 -960h400v400z", to24)).toBe("M0 0h10v10z");
  });

  test("scales arc radii and endpoint, keeps rotation, and copies both flags verbatim", () => {
    // Absolute arc: the endpoint is a position, so translateY applies
    // (800 * 0.025 + 24 = 44). Radii and rotation are never translated.
    const out = transformPathData("M0 -960A400 800 45 1 0 400 800", to24);
    expect(out).toBe("M0 0A10 20 45 1 0 10 44");
  });

  test("does not translate a relative arc endpoint", () => {
    // Relative arc: the endpoint is a delta, so only the scale applies.
    const rel = transformPathData("M0 -960a400 800 45 1 0 400 800", to24);
    expect(rel).toBe("M0 0a10 20 45 1 0 10 20");
  });

  test("splits run-together numbers per the SVG grammar", () => {
    // "1.5.5" is two numbers, and "10-20" is two numbers.
    expect(
      numbersOf(
        transformPathData("M0 0l1.5.5", {
          scale: 1,
          translateX: 0,
          translateY: 0,
        }),
      ),
    ).toEqual([0, 0, 1.5, 0.5]);
    expect(
      numbersOf(
        transformPathData("M0 0L10-20", {
          scale: 1,
          translateX: 0,
          translateY: 0,
        }),
      ),
    ).toEqual([0, 0, 10, -20]);
  });

  test("reads single-digit arc flags even when run together", () => {
    // "011 1" must parse as largeArc=0 sweep=1 x=1 y=1, not as x=11.
    const out = transformPathData("M0 0a1 1 0 011 1", {
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    expect(out).toBe("M0 0a1 1 0 0 1 1 1");
  });

  test("repeats implicit argument groups without re-emitting the command", () => {
    const out = transformPathData("M0 0L10 10 20 20 30 30", {
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    expect(out).toBe("M0 0L10 10 20 20 30 30");
    expect((out.match(/L/g) ?? []).length).toBe(1);
  });

  test("applies the requested precision and never emits -0", () => {
    expect(
      transformPathData("M0 0L1 1", {
        scale: 1 / 3,
        translateX: 0,
        translateY: 0,
        precision: 2,
      }),
    ).toBe("M0 0L0.33 0.33");
    expect(
      transformPathData("M0 0L-1 0", {
        scale: 0,
        translateX: 0,
        translateY: 0,
      }),
    ).toBe("M0 0L0 0");
  });

  test("omits separators only where the grammar allows it", () => {
    // A leading "." may only be glued when the previous number had no fraction,
    // otherwise "12" + ".5" would re-read as the single number 12.5.
    const glued = transformPathData("M12 0l0.5 0.5", {
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
    expect(numbersOf(glued)).toEqual([12, 0, 0.5, 0.5]);
  });

  test("round-trips real Material Symbols geometry losslessly at 24dp", () => {
    const source =
      "M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85";
    const out = transformPathData(source, to24);
    expect(out).not.toContain("NaN");
    expect(out.startsWith("M9.45")).toBe(true);
    // Every coordinate must land inside the 24x24 box.
    for (const n of numbersOf(out)) {
      expect(Math.abs(n)).toBeLessThanOrEqual(24.001);
    }
  });

  test("throws on malformed input instead of emitting broken geometry", () => {
    expect(() =>
      transformPathData("M0 0L", { scale: 1, translateX: 0, translateY: 0 }),
    ).toThrow();
    expect(() =>
      transformPathData("M0 0a1 1 0 2 0 1 1", {
        scale: 1,
        translateX: 0,
        translateY: 0,
      }),
    ).toThrow();
  });
});

describe("pathBounds", () => {
  test("measures absolute on-curve points", () => {
    expect(pathBounds("M2 3L22 21Z")).toEqual({
      minX: 2,
      minY: 3,
      maxX: 22,
      maxY: 21,
    });
  });

  test("resolves relative commands against the running pen position", () => {
    // A relative delta larger than the icon is legal; the ink is not.
    expect(pathBounds("M4 4l16 0l0 16l-16 0z")).toEqual({
      minX: 4,
      minY: 4,
      maxX: 20,
      maxY: 20,
    });
  });

  test("tracks H and V against the current point", () => {
    expect(pathBounds("M4 4H20V20H4Z")).toEqual({
      minX: 4,
      minY: 4,
      maxX: 20,
      maxY: 20,
    });
  });

  test("closes a subpath back to its moveto", () => {
    const box = pathBounds("M6 6L18 8z");
    expect(box).toEqual({ minX: 6, minY: 6, maxX: 18, maxY: 8 });
  });

  test("handles curve and arc endpoints", () => {
    expect(pathBounds("M0 0C1 1 2 2 10 12S14 14 16 16")).toEqual({
      minX: 0,
      minY: 0,
      maxX: 16,
      maxY: 16,
    });
    expect(pathBounds("M2 12a10 10 0 1 0 20 0")).toEqual({
      minX: 2,
      minY: 12,
      maxX: 22,
      maxY: 12,
    });
  });

  test("repeats implicit argument groups", () => {
    expect(pathBounds("M0 0L4 4 8 2 12 12")).toEqual({
      minX: 0,
      minY: 0,
      maxX: 12,
      maxY: 12,
    });
    expect(pathBounds("m0 0l4 4 4-2 4 10")).toEqual({
      minX: 0,
      minY: 0,
      maxX: 12,
      maxY: 12,
    });
  });

  test("implicit groups after a moveto are linetos, not movetos", () => {
    // `m1 1 2 2` opens a subpath at (1,1) then draws a line to (3,3). The
    // subpath start stays (1,1), so `z` closes there — if it moved to (3,3),
    // every relative command after the close would drift by (2,2).
    expect(pathBounds("m1 1 2 2z")).toEqual({
      minX: 1,
      minY: 1,
      maxX: 3,
      maxY: 3,
    });
    expect(pathBounds("m1 1 2 2zm0 10")).toEqual({
      minX: 1,
      minY: 1,
      maxX: 3,
      maxY: 11,
    });
    // With the bug, the post-close moveto would land at (3,13) instead of (1,11).
    expect(pathBounds("m1 1 2 2zm0 10").maxY).toBe(11);
  });
});

describe("invertTransform", () => {
  const to24 = { scale: 0.025, translateX: 0, translateY: 24, precision: 6 };

  test("round-trips Material Symbols geometry back to the 960 grid", () => {
    const source =
      "M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75";
    const forward = transformPathData(source, to24);
    const back = transformPathData(forward, invertTransform(to24));

    const original = numbersOf(source);
    const restored = numbersOf(back);
    expect(restored).toHaveLength(original.length);
    for (let i = 0; i < original.length; i++) {
      expect(Math.abs((restored[i] ?? 0) - (original[i] ?? 0))).toBeLessThan(
        0.05,
      );
    }
  });

  test("is the identity for an already-canonical source", () => {
    const t = viewBoxToTransform(
      { minX: 0, minY: 0, width: 24, height: 24 },
      24,
    );
    const inverse = invertTransform({ ...t, precision: 3 });
    expect(inverse.scale).toBeCloseTo(1, 10);
    expect(inverse.translateX).toBeCloseTo(0, 10);
    expect(inverse.translateY).toBeCloseTo(0, 10);
  });
});

describe("concatPathData", () => {
  test("joins subpaths and drops empties", () => {
    expect(concatPathData(["M0 0Z", "", "M1 1Z"])).toBe("M0 0ZM1 1Z");
    expect(concatPathData([])).toBe("");
  });
});

describe("inspectPathData", () => {
  test("accepts valid path data starting with either moveto case", () => {
    expect(inspectPathData("M0 0L24 24Z")).toBeNull();
    // Upstream Material Symbols frequently opens with a relative moveto.
    expect(inspectPathData("m0 0l24 24z")).toBeNull();
    expect(inspectPathData("M9.45 15.775q-2.704 0-4.577-1.875Z")).toBeNull();
    expect(inspectPathData("M0 0a10 20 45 1 0 10 44")).toBeNull();
  });

  test("rejects empty, non-finite, and non-moveto output", () => {
    expect(inspectPathData("")).toMatch(/empty/);
    expect(inspectPathData("M0 NaN")).toMatch(/NaN/);
    expect(inspectPathData("M0 Infinity")).toMatch(/Infinity/);
    expect(inspectPathData("M0 undefined")).toMatch(/undefined/);
    expect(inspectPathData("L0 0")).toMatch(/moveto/);
  });

  test("rejects data that no longer re-parses", () => {
    expect(inspectPathData("M0 0L")).toMatch(/re-parse/);
    expect(inspectPathData("M0 0a1 1 0 2 0 1 1")).toMatch(/re-parse/);
  });

  test("validates every transform the pipeline can produce", () => {
    const to24 = { scale: 0.025, translateX: 0, translateY: 24, precision: 3 };
    for (const source of [
      "M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181",
      "M0 -960A400 800 45 1 0 400 800Z",
      "M12 0l1.5.5 2-3Z",
      "m480-480 120 120-120 120Z",
    ]) {
      expect(inspectPathData(transformPathData(source, to24))).toBeNull();
    }
  });
});
