import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENTS } from "./manifest.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKGS = join(HERE, "..", "..");
const ROOTS = {
  web: join(PKGS, "kern"),
  native: join(PKGS, "kern-native"),
} as const;

function barrelFor(platform: "web" | "native"): string {
  const file =
    platform === "web"
      ? ["src", "components", "index.ts"]
      : ["src", "index.ts"];
  return readFileSync(join(ROOTS[platform], ...file), "utf8");
}

const barrels = {
  web: barrelFor("web"),
  native: barrelFor("native"),
} as const;

describe("component manifest", () => {
  it("has no duplicate name/platform pairs", () => {
    const seen = new Set(
      COMPONENTS.map((entry) => `${entry.platform}/${entry.name}`),
    );
    expect(seen.size).toBe(COMPONENTS.length);
  });

  it("points at files that exist", () => {
    for (const entry of COMPONENTS) {
      expect(
        existsSync(join(ROOTS[entry.platform], entry.path)),
        entry.path,
      ).toBe(true);
    }
  });

  it("marks real entries that are implemented and exported", () => {
    for (const entry of COMPONENTS.filter((c) => c.status === "real")) {
      const src = readFileSync(join(ROOTS[entry.platform], entry.path), "utf8");
      expect(src.includes("not implemented yet"), entry.path).toBe(false);
      expect(barrels[entry.platform].includes(entry.export), entry.export).toBe(
        true,
      );
    }
  });

  it("only uses known statuses", () => {
    for (const entry of COMPONENTS) {
      expect(["real", "stub"].includes(entry.status)).toBe(true);
    }
  });
});
