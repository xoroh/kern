import { describe, expect, it } from "vitest";
import {
  EXPRESSIVE_SHAPES,
  expressiveShapePath,
  getExpressiveShape,
  hasExpressiveShape,
  listExpressiveShapes,
  registerExpressiveShape,
  sampleExpressiveShape,
} from "./expressive-shapes";

describe("expressive shapes", () => {
  it("ships ten built-ins across five families", () => {
    expect(EXPRESSIVE_SHAPES).toHaveLength(10);
    expect(listExpressiveShapes()).toHaveLength(10);
    expect(new Set(EXPRESSIVE_SHAPES.map((shape) => shape.family))).toEqual(
      new Set(["rounded", "cookie", "burst", "floral", "angular"]),
    );
    for (const shape of EXPRESSIVE_SHAPES) {
      expect(hasExpressiveShape(shape.name)).toBe(true);
    }
    expect(hasExpressiveShape("nope")).toBe(false);
  });

  it("extends core corners without adding radii", () => {
    const corners = new Set(
      EXPRESSIVE_SHAPES.map((shape) => shape.extendsCorner),
    );
    for (const corner of corners) {
      expect(["small", "medium", "large", "full"]).toContain(corner);
    }
  });

  it("pins the flower-8 golden path (byte-identical across renderers)", () => {
    expect(expressiveShapePath("flower-8", 100)).toBe(
      "M 42.155 6.06 Q 50 0 57.845 6.06 Q 65.69 12.121 75.523 13.383" +
        " Q 85.355 14.645 86.617 24.477 Q 87.879 34.31 93.94 42.155" +
        " Q 100 50 93.94 57.845 Q 87.879 65.69 86.617 75.523" +
        " Q 85.355 85.355 75.523 86.617 Q 65.69 87.879 57.845 93.94" +
        " Q 50 100 42.155 93.94 Q 34.31 87.879 24.477 86.617" +
        " Q 14.645 85.355 13.383 75.523 Q 12.121 65.69 6.06 57.845" +
        " Q 0 50 6.06 42.155 Q 12.121 34.31 13.383 24.477" +
        " Q 14.645 14.645 24.477 13.383 Q 34.31 12.121 42.155 6.06 Z",
    );
  });

  it("pins the gem golden path", () => {
    expect(expressiveShapePath("gem", 100)).toBe(
      "M 41.161 16.161 Q 50 0 58.839 16.161 Q 67.678 32.322 83.839 41.161" +
        " Q 100 50 83.839 58.839 Q 67.678 67.678 58.839 83.839" +
        " Q 50 100 41.161 83.839 Q 32.322 67.678 16.161 58.839" +
        " Q 0 50 16.161 41.161 Q 32.322 32.322 41.161 16.161 Z",
    );
  });

  it("pins soft-square and cookie-4 structurally (segment counts + bounds)", () => {
    const soft = expressiveShapePath("soft-square", 100);
    expect(soft.match(/ Q /g)).toHaveLength(64);
    expect(soft.startsWith("M 99.94 42.173 Q 100 50 99.94 57.827")).toBe(true);
    expect(soft.endsWith(" Z")).toBe(true);

    const cookie = expressiveShapePath("cookie-4", 100);
    expect(cookie.match(/ Q /g)).toHaveLength(96);
    expect(cookie.startsWith("M 99.878 48.369 Q 100 50 99.878 51.631")).toBe(
      true,
    );

    for (const name of listExpressiveShapes()) {
      const numbers = expressiveShapePath(name, 100)
        .match(/-?[\d.]+/g)
        ?.map(Number);
      expect(numbers?.length).toBeGreaterThan(0);
      for (const value of numbers ?? []) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it("scales paths and samples linearly with size", () => {
    const at100 = sampleExpressiveShape("oval", 100);
    const at50 = sampleExpressiveShape("oval", 50);
    expect(at100).toHaveLength(at50.length);
    for (let i = 0; i < at100.length; i++) {
      expect(at100[i].x).toBeCloseTo(at50[i].x * 2, 9);
      expect(at100[i].y).toBeCloseTo(at50[i].y * 2, 9);
    }
    expect(expressiveShapePath("oval", 50).length).toBeLessThan(
      expressiveShapePath("oval", 100).length,
    );
  });

  it("fails loud on unknown shapes", () => {
    expect(() => getExpressiveShape("nope")).toThrow(
      "Unknown expressive shape: nope",
    );
    expect(() => sampleExpressiveShape("nope")).toThrow(
      "Unknown expressive shape: nope",
    );
    expect(() => expressiveShapePath("nope")).toThrow(
      "Unknown expressive shape: nope",
    );
  });

  it("registers custom shapes and rejects invalid ones", () => {
    registerExpressiveShape({
      name: "tenant-petal",
      family: "floral",
      description: "Tenant petal.",
      extendsCorner: "medium",
      geometry: { kind: "star", points: 5, innerRatio: 0.7 },
    });
    expect(getExpressiveShape("tenant-petal").family).toBe("floral");
    expect(listExpressiveShapes()).toContain("tenant-petal");

    expect(() =>
      registerExpressiveShape({
        name: "Bad Name",
        family: "floral",
        description: "Bad.",
        extendsCorner: "medium",
        geometry: { kind: "star", points: 5, innerRatio: 0.7 },
      }),
    ).toThrow("Invalid expressive shape name");
    expect(() =>
      registerExpressiveShape({
        name: "bad-family",
        family: "wavy" as unknown as "floral",
        description: "Bad.",
        extendsCorner: "medium",
        geometry: { kind: "star", points: 5, innerRatio: 0.7 },
      }),
    ).toThrow("Unknown expressive shape family");
    expect(() =>
      registerExpressiveShape({
        name: "bad-corner",
        family: "floral",
        description: "Bad.",
        extendsCorner: "jumbo" as unknown as "medium",
        geometry: { kind: "star", points: 5, innerRatio: 0.7 },
      }),
    ).toThrow("Unknown core corner");
    expect(() =>
      registerExpressiveShape({
        name: "bad-geometry",
        family: "burst",
        description: "Bad.",
        extendsCorner: "full",
        geometry: { kind: "star", points: 99, innerRatio: 0.7 },
      }),
    ).toThrow("invalid geometry");
  });
});
