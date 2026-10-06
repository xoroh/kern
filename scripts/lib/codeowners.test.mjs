/**
 * Unit tests for scripts/lib/codeowners.mjs (GitHub CODEOWNERS semantics).
 * Run: bun test scripts/lib/codeowners.test.mjs
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  globToRegExp,
  matchesPath,
  ownerOf,
  parseCodeowners,
} from "./codeowners.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("globToRegExp / matchesPath", () => {
  test("leading / anchors at repo root", () => {
    expect(matchesPath("/package.json", "package.json")).toBe(true);
    expect(matchesPath("/package.json", "packages/kern/package.json")).toBe(
      false,
    );
    expect(matchesPath("/biome.json", "biome.json")).toBe(true);
    expect(matchesPath("/biome.json", "apps/site/biome.json")).toBe(false);
  });

  test("bare name matches any depth", () => {
    expect(matchesPath("package.json", "package.json")).toBe(true);
    expect(matchesPath("package.json", "packages/kern/package.json")).toBe(
      true,
    );
    expect(matchesPath("README.md", "packages/kern/README.md")).toBe(true);
  });

  test("rooted directory does not match nested same-name dir", () => {
    expect(matchesPath("/e2e/", "e2e/foo.spec.ts")).toBe(true);
    expect(matchesPath("/e2e/", "apps/site/e2e/foo.ts")).toBe(false);
    expect(matchesPath("/.changeset/", ".changeset/config.json")).toBe(true);
    expect(matchesPath("/.githooks/", ".githooks/pre-commit")).toBe(true);
  });

  test("pattern with inner slash is root-relative", () => {
    expect(matchesPath("apps/site/", "apps/site/src/x.tsx")).toBe(true);
    expect(matchesPath("apps/site/", "other/apps/site/x.tsx")).toBe(false);
    expect(
      matchesPath("packages/*/tsconfig.json", "packages/kern/tsconfig.json"),
    ).toBe(true);
    expect(
      matchesPath("packages/*/tsconfig.json", "packages/kern/src/tsconfig.json"),
    ).toBe(false);
  });

  test("SECURITY.md root-only when anchored", () => {
    expect(matchesPath("/SECURITY.md", "SECURITY.md")).toBe(true);
    expect(matchesPath("/SECURITY.md", "docs/SECURITY.md")).toBe(false);
  });

  test("catch-all * matches everything via matchesPath", () => {
    expect(matchesPath("*", "anything/here.ts")).toBe(true);
  });
});

describe("ownerOf last-match-wins", () => {
  const fixture = `
*                                       @xoroh/kern
packages/kern/                          @xoroh/kern-lead
/package.json                           @xoroh/librarian
apps/site/                              @xoroh/site-se
/e2e/                                   @xoroh/qa
docs/releases.md                        @xoroh/release
`;

  const rules = parseCodeowners(fixture);

  test("nested package.json keeps package lane, not librarian", () => {
    expect(ownerOf("packages/kern/package.json", rules)).toEqual([
      "@xoroh/kern-lead",
    ]);
    expect(ownerOf("package.json", rules)).toEqual(["@xoroh/librarian"]);
  });

  test("later specific docs rule wins over nothing (falls to *)", () => {
    expect(ownerOf("docs/releases.md", rules)).toEqual(["@xoroh/release"]);
    expect(ownerOf("docs/architecture.md", rules)).toEqual(["@xoroh/kern"]);
  });

  test("directory lane owns nested files", () => {
    expect(ownerOf("apps/site/src/routes/docs/index.tsx", rules)).toEqual([
      "@xoroh/site-se",
    ]);
    expect(ownerOf("e2e/page-render.spec.ts", rules)).toEqual(["@xoroh/qa"]);
  });
});

describe("real CODEOWNERS nested package.json owners", () => {
  const rules = parseCodeowners(
    readFileSync(join(ROOT, ".github/CODEOWNERS"), "utf8"),
  );

  const expected = {
    "package.json": ["@xoroh/librarian"],
    "packages/kern/package.json": ["@xoroh/kern-lead"],
    "packages/kern-native/package.json": [
      "@xoroh/kern-lead",
      "@xoroh/design-system-lead",
    ],
    "packages/kern-primitives/package.json": [
      "@xoroh/kern-lead",
      "@xoroh/design-system-lead",
    ],
    "packages/kern-tokens/package.json": ["@xoroh/design-system-lead"],
    "packages/kern-icons/package.json": ["@xoroh/kern-icons-se"],
    "packages/kern-cli/package.json": ["@xoroh/kern-cli-se"],
    "packages/mcp/package.json": ["@xoroh/kern"],
    "apps/site/package.json": ["@xoroh/site-se"],
    "apps/mobile/package.json": ["@xoroh/kern-mobile-se"],
  };

  for (const [path, owners] of Object.entries(expected)) {
    test(path, () => {
      expect(ownerOf(path, rules)).toEqual(owners);
    });
  }

  test("specific docs rules still win", () => {
    expect(ownerOf("docs/releases.md", rules)).toEqual(["@xoroh/release"]);
    expect(ownerOf("docs/verification-limits.md", rules)).toEqual([
      "@xoroh/qa",
    ]);
    expect(ownerOf("docs/components.md", rules)).toEqual([
      "@xoroh/design-system-lead",
    ]);
    expect(ownerOf("docs/elevation-audit.md", rules)).toEqual([
      "@xoroh/design-system-lead",
    ]);
  });
});
