import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { tokens } from "./tokens";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("canonical elevation shadows (KERN-021)", () => {
  test("every level carries light and dark shadows in tokens.json", () => {
    for (const level of [
      "level0",
      "level1",
      "level2",
      "level3",
      "level4",
      "level5",
    ]) {
      const entry = (
        tokens.elevation as unknown as Record<string, Record<string, unknown>>
      )[level];
      expect(entry, level).toBeDefined();
      expect(typeof entry.dp, `${level}.dp`).toBe("number");
      expect(typeof entry.shadow, `${level}.shadow`).toBe("string");
      // The dark table used to live hardcoded in gen-css.mjs — a second value
      // source that could drift from this one. It lives here now.
      expect(typeof entry.shadowDark, `${level}.shadowDark`).toBe("string");
    }
  });

  test("dark shadows step alpha up from light (black blurs on black surfaces)", () => {
    const elevation = tokens.elevation as unknown as Record<
      string,
      { shadow: string; shadowDark: string }
    >;
    for (const level of ["level1", "level2", "level3", "level4", "level5"]) {
      expect(elevation[level].shadowDark).not.toBe(elevation[level].shadow);
      expect(elevation[level].shadowDark).toContain("0.5");
    }
  });

  test("gen-css.mjs authors no shadow table of its own", () => {
    const gen = readFileSync(
      join(HERE, "..", "scripts", "gen-css.mjs"),
      "utf8",
    );
    // A hardcoded rgba shadow in the generator is a second value source. The
    // only rgba literals allowed are inside comments explaining the projection.
    const code = gen
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");
    expect(code).not.toMatch(/rgba\(0,\s*0,\s*0/);
    expect(code).toContain("shadowDark");
  });
});
