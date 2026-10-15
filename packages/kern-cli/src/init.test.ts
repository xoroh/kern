import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { initScaffold } from "./init";
import { WORKSPACE_ROOT } from "./manifest";

function freshDir(): string {
  return mkdtempSync(join(tmpdir(), "kern-init-"));
}

describe("kern init (Mode 2 scaffold)", () => {
  it("scaffolds a working first run: install → run → themed screen", () => {
    const parent = freshDir();
    const dir = join(parent, "starter");
    try {
      const r = initScaffold(dir, { root: WORKSPACE_ROOT });
      // The file set a first run needs: manifest, entry, screen, styles, config.
      for (const f of [
        "package.json",
        "index.html",
        "vite.config.ts",
        "tsconfig.json",
        "src/main.tsx",
        "src/App.tsx",
        "src/app.css",
        "README.md",
      ]) {
        expect(r.files).toContain(f);
        expect(existsSync(join(dir, f))).toBe(true);
      }
      // Themed screen: AppShell frame + preset picker over the real presets.
      const app = readFileSync(join(dir, "src/App.tsx"), "utf8");
      expect(app).toContain("AppShell");
      for (const preset of ["material-3", "sharp", "brand", "demo"]) {
        expect(app).toContain(`"${preset}"`);
      }
      expect(app).toContain("applyKernTheme");
      // Stylesheet pair: utilities compile, values resolve.
      const css = readFileSync(join(dir, "src/app.css"), "utf8");
      expect(css).toContain("tailwindcss");
      expect(css).toContain('"@xoroh/kern-tokens/theme"');
      // Pre-publish honesty: file: deps against the checkout, version stamped.
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
      expect(pkg.dependencies["@xoroh/kern"].startsWith("file:")).toBe(true);
      expect(pkg.dependencies["@xoroh/kern-tokens"].startsWith("file:")).toBe(
        true,
      );
      expect(
        existsSync(join(pkg.dependencies["@xoroh/kern"].slice("file:".length))),
      ).toBe(true);
      expect(
        existsSync(
          join(pkg.dependencies["@xoroh/kern-tokens"].slice("file:".length)),
        ),
      ).toBe(true);
      // Transitive workspace pins: install must never reach the registry
      // for an unpublished name.
      expect(pkg.overrides["@xoroh/kern"]).toBe(
        pkg.dependencies["@xoroh/kern"],
      );
      expect(pkg.overrides["@xoroh/kern-tokens"]).toBe(
        pkg.dependencies["@xoroh/kern-tokens"],
      );
      expect(pkg.overrides["@xoroh/kern-primitives"].startsWith("file:")).toBe(
        true,
      );
      // The transitive preset dep escapes to the registry without this pin
      // (C1-S smoke: `bun install` failed outside the monorepo) — every
      // workspace package @xoroh/kern depends on must be pinned.
      expect(
        pkg.overrides["@xoroh/kern-material-3"].startsWith("file:"),
      ).toBe(true);
      expect(
        existsSync(
          pkg.overrides["@xoroh/kern-material-3"].slice("file:".length),
        ),
      ).toBe(true);
      const readme = readFileSync(join(dir, "README.md"), "utf8");
      expect(readme).toContain("0.0.0");
      expect(readme).toContain("unpublished");
      // Receipt stamped from day one, same v2 shape `kern add` merges into.
      const receipt = JSON.parse(readFileSync(r.receipt, "utf8"));
      expect(receipt.schemaVersion).toBe("2");
      expect(receipt.config.kern).toBe("0.0.0");
      expect(receipt.files).toEqual([]);
      // The project records its install choices once.
      const kernJson = JSON.parse(readFileSync(join(dir, "kern.json"), "utf8"));
      expect(kernJson.renderer).toBe("web");
      expect(kernJson.mode).toBe("source-hybrid");
      expect(r.instructions).toContain("bun install");
      expect(r.instructions).toContain("bun run dev");
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it("emits registry names behind --registry with the 404 warning", () => {
    const parent = freshDir();
    const dir = join(parent, "starter");
    try {
      const r = initScaffold(dir, { root: WORKSPACE_ROOT, registry: true });
      expect(r.registry).toBe(true);
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
      expect(pkg.dependencies["@xoroh/kern"]).toBe("0.0.0");
      expect(r.instructions[0]).toContain("404 until the first publish");
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it("refuses a non-empty dest without --force", () => {
    const dir = freshDir();
    try {
      writeFileSync(join(dir, "mine.tsx"), "// owned code\n");
      expect(() => initScaffold(dir, { root: WORKSPACE_ROOT })).toThrow(
        "--force",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("refuses a version-mismatched receipt even with --force", () => {
    const dir = freshDir();
    try {
      mkdirSync(dir, { recursive: true });
      writeFileSync(
        join(dir, "kern.receipt.json"),
        JSON.stringify({ kern: "9.9.9", mode: "scaffold", components: {} }),
      );
      expect(() =>
        initScaffold(dir, { root: WORKSPACE_ROOT, force: true }),
      ).toThrow("receipt pins kern 9.9.9");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it.each([
    ["bun", "bun install", "bun run dev"],
    ["npm", "npm install", "npm run dev"],
    ["pnpm", "pnpm install", "pnpm dev"],
    ["yarn", "yarn install", "yarn dev"],
  ] as const)("records pm %s in kern.json with matching instructions", (pm, install, dev) => {
    const parent = freshDir();
    try {
      const r = initScaffold(join(parent, "starter"), {
        root: WORKSPACE_ROOT,
        pm,
      });
      const kernJson = JSON.parse(
        readFileSync(join(r.dir, "kern.json"), "utf8"),
      );
      expect(kernJson.pm).toBe(pm);
      expect(r.instructions).toContain(install);
      expect(r.instructions).toContain(dev);
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it("pins the default preset and accepts an explicit one", () => {
    const parent = freshDir();
    try {
      const r = initScaffold(join(parent, "starter"), { root: WORKSPACE_ROOT });
      expect(
        JSON.parse(readFileSync(join(r.dir, "kern.json"), "utf8")).preset,
      ).toBe("material-3");
      const sharp = initScaffold(join(parent, "sharp"), {
        root: WORKSPACE_ROOT,
        preset: "sharp",
      });
      expect(
        JSON.parse(readFileSync(join(sharp.dir, "kern.json"), "utf8")).preset,
      ).toBe("sharp");
      expect(() =>
        initScaffold(join(parent, "bad"), {
          root: WORKSPACE_ROOT,
          preset: "Not A Preset!",
        }),
      ).toThrow("preset");
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });
});
