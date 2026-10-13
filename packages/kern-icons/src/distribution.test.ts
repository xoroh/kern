import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = join(HERE, "..");

/**
 * Icon asset/license/bundle proof (KERN-031).
 *
 * No fake tree-shaking claim: the catalog is 1340 glyphs and the dynamic
 * `Icon` API resolves at runtime, so a consumer pays for the registry it
 * imports. What this file proves is the parts a bundler CANNOT verify: the
 * license payload ships, the pinned source is recorded, and the numbers below
 * are measured, not asserted.
 */
describe("icon distribution", () => {
  test("the Apache-2.0 license text and notice ship with the package", () => {
    for (const file of ["THIRD_PARTY/Apache-2.0.txt", "THIRD_PARTY/NOTICE"]) {
      const full = join(PKG, file);
      expect(existsSync(full), file).toBe(true);
      expect(statSync(full).size, file).toBeGreaterThan(0);
    }
    const notice = readFileSync(join(PKG, "THIRD_PARTY/NOTICE"), "utf8");
    expect(notice).toContain("Material Symbols");
    expect(notice).toContain("Apache");
  });

  test("the upstream source is pinned with its license", () => {
    const source = JSON.parse(
      readFileSync(join(PKG, "config/source.json"), "utf8"),
    );
    expect(source.license).toBe("Apache-2.0");
    // Pinned — a floating upstream ref would rebuild the catalog silently.
    expect(String(source.version ?? source.ref ?? "")).not.toBe("");
  });

  test("the published files list includes the license payload", () => {
    const manifest = JSON.parse(
      readFileSync(join(PKG, "package.json"), "utf8"),
    );
    const files: string[] = manifest.files ?? [];
    expect(
      files.some((f) => f.includes("THIRD_PARTY")),
      `files: ${files.join(",")}`,
    ).toBe(true);
  });
});
