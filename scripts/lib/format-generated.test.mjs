/**
 * F-02: generators must format reliably or fail loudly — never write
 * unformatted output.
 *
 * Fail-before: every generator with a `catch { /* write unformatted *\/ }`
 * fallback exited 0 while leaving lint-red bytes on disk (reproduced on the
 * site-manifest generator: `npx` absent → warning → unformatted
 * `apps/site/src/generated/manifest.ts` → `biome check` red). These tests pin
 * the replacement contract in `format-generated.mjs`:
 *
 *   1. the workspace bin wins when present;
 *   2. otherwise the pinned `bun x` fallback still formats;
 *   3. when neither is reachable the call throws instead of returning
 *      unformatted text.
 */
import { describe, expect, test } from "bun:test";
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { biomeSpecFor, formatText } from "./format-generated.mjs";

const SCRATCH = "/tmp/opencode/format-generated-tests";

function fixtureRoot(name) {
  const dir = mkdtempSync(join(`${SCRATCH}-`, ""));
  void name;
  return dir;
}

function fakeWorkspaceBin(root) {
  const binDir = join(root, "node_modules", ".bin");
  mkdirSync(binDir, { recursive: true });
  const bin = join(binDir, "biome");
  writeFileSync(bin, "#!/bin/sh\nprintf 'FORMATTED:'; cat", "utf8");
  chmodSync(bin, 0o755);
  return bin;
}

describe("format-generated", () => {
  test("workspace bin wins when present", () => {
    const root = fixtureRoot("bin-wins");
    fakeWorkspaceBin(root);
    const out = formatText({
      root,
      text: "anything",
      stdinFilePath: "probe.ts",
    });
    expect(out).toBe("FORMATTED:anything");
  });

  test("pinned bunx fallback formats when the workspace bin is absent", () => {
    const root = fixtureRoot("bunx-fallback");
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ devDependencies: { "@biomejs/biome": "^2.5.14" } }),
      "utf8",
    );
    const out = formatText({
      root,
      text: "export const x:number=1;\n",
      stdinFilePath: "probe.ts",
    });
    expect(out).toBe("export const x: number = 1;\n");
  }, 120_000);

  test("large outputs do not hit the spawn buffer (props.ts is ~1.7MB)", () => {
    const root = fixtureRoot("large-output");
    fakeWorkspaceBin(root);
    const big = `export const BIG = ${JSON.stringify({ row: "x".repeat(2 * 1024 * 1024) })};\n`;
    const out = formatText({
      root,
      text: big,
      stdinFilePath: "big.ts",
    });
    expect(out).toBe(`FORMATTED:${big}`);
  });

  test("throws rather than returning unformatted text when biome is unreachable", () => {
    const root = fixtureRoot("unreachable");
    expect(() =>
      formatText({
        root,
        text: "export const x:number=1;\n",
        stdinFilePath: "probe.ts",
        which: { biome: "/nonexistent/biome", bun: "/nonexistent/bun" },
      }),
    ).toThrow(/refusing to write unformatted/);
  });

  test("biomeSpecFor prefers the installed version, then the manifest range", () => {
    const pinned = fixtureRoot("spec-pinned");
    mkdirSync(join(pinned, "node_modules", "@biomejs", "biome"), {
      recursive: true,
    });
    writeFileSync(
      join(pinned, "node_modules", "@biomejs", "biome", "package.json"),
      JSON.stringify({ version: "2.5.14" }),
      "utf8",
    );
    writeFileSync(
      join(pinned, "package.json"),
      JSON.stringify({ devDependencies: { "@biomejs/biome": "^2.0.0" } }),
      "utf8",
    );
    expect(biomeSpecFor(pinned)).toBe("@biomejs/biome@2.5.14");

    const ranged = fixtureRoot("spec-ranged");
    writeFileSync(
      join(ranged, "package.json"),
      JSON.stringify({ devDependencies: { "@biomejs/biome": "^2.5.14" } }),
      "utf8",
    );
    expect(biomeSpecFor(ranged)).toBe("@biomejs/biome@^2.5.14");

    expect(biomeSpecFor(fixtureRoot("spec-bare"))).toBe("@biomejs/biome");
  });
});
