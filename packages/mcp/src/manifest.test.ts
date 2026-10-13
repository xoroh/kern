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

/**
 * The barrel a row is published from, per its `entrypoint`.
 *
 * The old test hardcoded the COMPONENT barrel for web and asserted every row's
 * export appears there. That made `SearchBar` and every other `/start`
 * composition a permanent failure — the composition tier is a real public
 * subpath (`@xoroh/kern/start`), so the component barrel is the wrong source
 * for it. Asserting against the wrong barrel is not a stricter gate: it is a
 * broken one that also licenses a false claim ("this export is not public")
 * to anyone who reads the red.
 */
const BARRELS = {
  native: readFileSync(join(ROOTS.native, "src", "index.ts"), "utf8"),
  comp: readFileSync(join(ROOTS.web, "src", "components", "index.ts"), "utf8"),
  start: readFileSync(join(ROOTS.web, "src", "start", "index.ts"), "utf8"),
} as const;

function barrelFor(entry: (typeof COMPONENTS)[number]): string {
  if (entry.platform === "native") return BARRELS.native;
  return entry.entrypoint === "./start" ? BARRELS.start : BARRELS.comp;
}

/**
 * Does `barrel` actually expose `exportName`?
 *
 * `/start/index.ts` is `export * from "./blocks"`, so the literal name never
 * appears in it — checking only for the string would mark all 31 composition
 * rows unexported. Resolve the star: a `export * from "./<file>"` line means
 * every value export of `<file>` is public through this barrel, so the row's
 * own file is the source of truth for what it re-exports.
 *
 * Named exports are checked directly, which is the strict case and covers the
 * entire component barrel.
 */
function barrelExports(exportName: string, file: string, barrel: string) {
  if (barrel.includes(exportName)) return true;
  const moduleName = file.replace(/^.*\//, "").replace(/\.tsx?$/, "");
  return new RegExp(
    `export\\s*\\*\\s*from\\s*["']\\./(?:components/)?${moduleName}["']`,
  ).test(barrel);
}

const barrelsFor = new Map(
  COMPONENTS.map(
    (entry) =>
      [
        entry,
        {
          barrel: barrelFor(entry),
          src: readFileSync(join(ROOTS[entry.platform], entry.path), "utf8"),
        },
      ] as const,
  ),
);

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
      const found = barrelsFor.get(entry);
      expect(found, entry.export).toBeDefined();
      expect(found?.src.includes("not implemented yet"), entry.path).toBe(
        false,
      );
      // The export must be reachable from the subpath this row declares.
      expect(
        barrelExports(entry.export, entry.path, found?.barrel ?? ""),
        `${entry.export} is not published from ${entry.entrypoint}`,
      ).toBe(true);
    }
  });

  it("names a real package subpath for every row", () => {
    const allowed = new Set([".", "./start"]);
    for (const entry of COMPONENTS) {
      expect(
        allowed.has(entry.entrypoint),
        `${entry.export} declares entrypoint ${entry.entrypoint}`,
      ).toBe(true);
      // A `/start` row must actually live in the composition tier.
      if (entry.entrypoint === "./start") {
        expect(entry.path.startsWith("src/start/"), entry.path).toBe(true);
      } else {
        expect(entry.path.startsWith("src/components/"), entry.path).toBe(true);
      }
    }
  });

  it("only uses known statuses", () => {
    for (const entry of COMPONENTS) {
      expect(["real", "stub"].includes(entry.status)).toBe(true);
    }
  });
});
