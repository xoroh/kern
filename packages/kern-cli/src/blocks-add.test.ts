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
import { addBlock, addComponent } from "./add";
import { blockFileList, loadBlocks } from "./blocks";
import { WORKSPACE_ROOT } from "./manifest";

/** A fixture workspace with a two-file block (root + sibling). */
function fixtureWorkspace(): string {
  const root = mkdtempSync(join(tmpdir(), "kern-blocks-"));
  const dir = join(root, "apps", "site", "src", "blocks");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "manifest.ts"),
    `export const BLOCKS = [
  {
    name: "two-file",
    title: "Two file block",
    category: "Settings",
    description: "Root imports its sibling.",
    file: "root.tsx",
    files: ["sibling.tsx"],
    registryDependencies: ["Button"],
    dependencies: ["@xoroh/kern", "react"],
  },
];
`,
  );
  writeFileSync(
    join(dir, "root.tsx"),
    `import { Button } from "@xoroh/kern";
import { helper } from "./sibling";
export function Root() {
  return <Button onClick={helper}>Go</Button>;
}
`,
  );
  writeFileSync(
    join(dir, "sibling.tsx"),
    `export function helper() {
  return undefined;
}
`,
  );
  // `kernVersion` reads the kern package.json — the fixture must carry one.
  const pkgDir = join(root, "packages", "kern");
  mkdirSync(pkgDir, { recursive: true });
  writeFileSync(
    join(pkgDir, "package.json"),
    `${JSON.stringify({ name: "@xoroh/kern", version: "0.0.0" }, null, 2)}\n`,
  );
  // Block dependency closures resolve against the manifest — the fixture
  // carries a one-row registry plus the component it names, so the test
  // proves closure vendoring without touching the real workspace.
  const compDir = join(pkgDir, "src", "components");
  mkdirSync(compDir, { recursive: true });
  writeFileSync(
    join(compDir, "button.tsx"),
    `export function Button() {\n  return null;\n}\n`,
  );
  const mcpDir = join(root, "packages", "mcp", "src");
  mkdirSync(mcpDir, { recursive: true });
  writeFileSync(
    join(mcpDir, "manifest.ts"),
    `export const COMPONENTS = [
  {
    name: "button",
    export: "Button",
    platform: "web",
    system: "kern-m3",
    entrypoint: ".",
    path: "src/components/button.tsx",
    status: "real",
  },
];
`,
  );
  return root;
}

function freshDest(): string {
  return mkdtempSync(join(tmpdir(), "kern-add-"));
}

describe("kern add <block> (multi-file)", () => {
  it("vendors a real block with a blocks receipt entry", {
    timeout: 60_000,
  }, () => {
    const dest = freshDest();
    try {
      const rows = loadBlocks(WORKSPACE_ROOT);
      expect(rows.length).toBeGreaterThan(0);
      const row = rows.find((r) => r.name === "settings-screen");
      expect(row).toBeDefined();
      const r = addBlock("settings-screen", { root: WORKSPACE_ROOT, dest });
      // Declared block file plus the closure of its registry dependencies.
      expect(r.files).toContain("blocks/settings-screen.tsx");
      expect(r.files.length).toBeGreaterThan(1);
      expect(existsSync(join(dest, "blocks/settings-screen.tsx"))).toBe(true);
      const receipt = JSON.parse(readFileSync(r.receipt, "utf8"));
      const owners = [
        ...new Set(receipt.files.map((f: { owner: string }) => f.owner)),
      ];
      expect(owners).toContain("block:settings-screen");
      expect(
        receipt.files.find(
          (f: { path: string }) => f.path === "blocks/settings-screen.tsx",
        ),
      ).toBeDefined();
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("vendors root + declared sibling from a fixture block", () => {
    const root = fixtureWorkspace();
    const dest = freshDest();
    try {
      const rows = loadBlocks(root);
      expect(rows[0].files).toEqual(["sibling.tsx"]);
      const r = addBlock("two-file", { root, dest });
      expect(r.files).toEqual(
        expect.arrayContaining([
          "blocks/root.tsx",
          "blocks/sibling.tsx",
          // The Button closure vendors alongside — the block is not installed
          // half-built.
          "components/button.tsx",
        ]),
      );
      expect(existsSync(join(dest, "blocks/sibling.tsx"))).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("refuses unknown block names", () => {
    expect(() =>
      addBlock("does-not-exist", { root: WORKSPACE_ROOT, dest: freshDest() }),
    ).toThrow(/unknown block/);
  });

  it("identical re-add is a no-op; edited re-add refuses (upgrade instead)", {
    timeout: 120_000,
  }, () => {
    const dest = freshDest();
    try {
      addBlock("auth-form", { root: WORKSPACE_ROOT, dest });
      // Byte-identical: no-op, receipt untouched.
      const again = addBlock("auth-form", { root: WORKSPACE_ROOT, dest });
      expect(again.files).toEqual([]);
      // Owned edit: preflight refusal naming the upgrade path, never an
      // overwrite — and the refusal happens before any write.
      writeFileSync(join(dest, "blocks/auth-form.tsx"), "// owned\n");
      expect(() =>
        addBlock("auth-form", { root: WORKSPACE_ROOT, dest }),
      ).toThrow(/already exists with different content/);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("keeps block entries when a component add merges the receipt", {
    timeout: 180_000,
  }, () => {
    const dest = freshDest();
    try {
      addBlock("empty-search", { root: WORKSPACE_ROOT, dest });
      // A component add afterwards must not erase the block's receipt entry.
      const rows = loadBlocks(WORKSPACE_ROOT);
      expect(rows.find((b) => b.name === "badge")).toBeUndefined();
      const result = addComponent("badge", { root: WORKSPACE_ROOT, dest });
      const receipt = JSON.parse(readFileSync(result.receipt, "utf8"));
      const owners = new Set(
        receipt.files.map((f: { owner: string }) => f.owner),
      );
      expect(owners.has("block:empty-search")).toBe(true);
      expect(owners.has("component:badge")).toBe(true);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("fails loudly when a declared file is missing on disk", () => {
    const root = fixtureWorkspace();
    try {
      rmSync(join(root, "apps", "site", "src", "blocks", "sibling.tsx"));
      const row = loadBlocks(root)[0];
      expect(blockFileList(row, root)).toBeNull();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
