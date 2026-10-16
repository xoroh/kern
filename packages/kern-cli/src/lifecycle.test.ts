import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { addBlock, addComponent, commitPlan, planComponent } from "./add";
import { diffDest, formatDiff, listBlocks, listComponents } from "./list-diff";
import { loadRegistry, WORKSPACE_ROOT } from "./manifest";
import { convertV1, readReceipt } from "./receipt";
import { formatUpgrade, upgradeBlock, upgradeComponent } from "./upgrade";

function freshDest(): string {
  return mkdtempSync(join(tmpdir(), "kern-life-"));
}

describe("receipts v2", () => {
  it("converts a v1 receipt, preserving owners and hashes", () => {
    const v2 = convertV1({
      kern: "0.0.0",
      mode: "hybrid",
      components: { button: { files: { "components/button.tsx": "abc123" } } },
      blocks: { "auth-form": { files: { "blocks/auth-form.tsx": "def456" } } },
    });
    expect(v2.schemaVersion).toBe("2");
    expect(v2.config.kern).toBe("0.0.0");
    const owners = new Set(v2.files.map((f) => f.owner));
    expect(owners).toEqual(new Set(["component:button", "block:auth-form"]));
  });

  it("rejects garbage instead of installing from it", () => {
    expect(() => readReceipt(null)).toThrow("not an object");
    expect(() => readReceipt({ schemaVersion: "2" })).toThrow();
    expect(() =>
      readReceipt({
        schemaVersion: "9",
        releaseSet: "x",
        mode: "source-hybrid",
        files: [],
        assets: [],
        licenses: [],
        config: {},
      }),
    ).toThrow("schemaVersion");
  });
});

describe("bundled registry", () => {
  it("loads without a checkout-shaped root", () => {
    // No manifest.ts under this root: the bundled payload answers instead of
    // throwing "run generate:components" about a checkout that does not exist.
    const registry = loadRegistry("/tmp/definitely-not-a-checkout-xyz");
    expect(registry.rows.length).toBeGreaterThan(0);
    expect(registry.releaseSet).toMatch(/^kern@/);
    expect(
      registry.rows.find((r) => r.name === "button" && r.platform === "web"),
    ).toBeDefined();
  });
});

describe("transactions", () => {
  it("a late conflict writes nothing — fault injection", {
    timeout: 120_000,
  }, () => {
    const dest = freshDest();
    try {
      const plan = planComponent("button", { root: WORKSPACE_ROOT, dest });
      expect(plan.files.length).toBeGreaterThan(1);
      // Poison a LATE file in the plan order: preflight must see it before
      // the first write, so the dest stays byte-identical.
      const late = plan.files[plan.files.length - 1];
      mkdirSync(join(dest, late.out.split("/").slice(0, -1).join("/")), {
        recursive: true,
      });
      writeFileSync(join(dest, late.out), "owned bytes");
      // Pre-create the parent receipt? No — the conflict alone must abort.
      expect(() => commitPlan("button", "component", plan, { dest })).toThrow(
        "already exists with different content",
      );
      // Only the poisoned file exists; nothing from the plan landed.
      const { readdirSync } = require("node:fs") as typeof import("node:fs");
      const walked: string[] = [];
      const walk = (dir: string, base: string) => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
          const rel = base ? `${base}/${e.name}` : e.name;
          if (e.isDirectory()) walk(join(dir, e.name), rel);
          else walked.push(rel);
        }
      };
      walk(dest, "");
      expect(walked).toEqual([late.out]);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("an identical re-add writes nothing and keeps the receipt", {
    timeout: 120_000,
  }, () => {
    const dest = freshDest();
    try {
      const first = addComponent("badge", { root: WORKSPACE_ROOT, dest });
      const before = readFileSync(first.receipt, "utf8");
      const second = addComponent("badge", { root: WORKSPACE_ROOT, dest });
      // Identical content: skipped silently, receipt byte-identical.
      expect(second.files).toEqual([]);
      expect(readFileSync(second.receipt, "utf8")).toBe(before);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });
});

describe("list and diff", () => {
  it("lists components and blocks from the registry", () => {
    const components = listComponents({ root: WORKSPACE_ROOT });
    expect(components.length).toBeGreaterThan(100);
    expect(components.some((l) => l.startsWith("button —"))).toBe(true);
    expect(listBlocks({ root: WORKSPACE_ROOT }).length).toBeGreaterThan(0);
  });

  it("diff reports current, then customized after an owned edit", () => {
    const dest = freshDest();
    try {
      addComponent("badge", { root: WORKSPACE_ROOT, dest });
      expect(formatDiff(diffDest(dest, { root: WORKSPACE_ROOT }))).toContain(
        "current",
      );
      writeFileSync(join(dest, "components/badge.tsx"), "// owned edit\n");
      const rows = diffDest(dest, { root: WORKSPACE_ROOT });
      expect(rows.find((r) => r.path === "components/badge.tsx")?.state).toBe(
        "customized",
      );
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("diff refuses a directory with no receipt", () => {
    expect(() => diffDest(freshDest(), { root: WORKSPACE_ROOT })).toThrow(
      "not a kern dest",
    );
  });
});

describe("upgrade", () => {
  it("dry-run writes nothing", { timeout: 120_000 }, () => {
    const dest = freshDest();
    try {
      addComponent("badge", { root: WORKSPACE_ROOT, dest });
      const before = readFileSync(join(dest, "kern.receipt.json"), "utf8");
      const result = upgradeComponent("badge", { root: WORKSPACE_ROOT, dest });
      expect(result.applied).toBe(false);
      expect(readFileSync(join(dest, "kern.receipt.json"), "utf8")).toBe(
        before,
      );
      expect(formatUpgrade(result)).toContain("dry run");
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("preserves customized files on --apply and reports them", {
    timeout: 120_000,
  }, () => {
    const dest = freshDest();
    try {
      addComponent("badge", { root: WORKSPACE_ROOT, dest });
      writeFileSync(join(dest, "components/badge.tsx"), "// owned edit\n");
      const result = upgradeComponent("badge", {
        root: WORKSPACE_ROOT,
        dest,
        apply: true,
      });
      expect(result.applied).toBe(true);
      // Owned bytes survive the upgrade.
      expect(readFileSync(join(dest, "components/badge.tsx"), "utf8")).toBe(
        "// owned edit\n",
      );
      expect(result.plan.customized).toContain("components/badge.tsx");
      expect(formatUpgrade(result)).toContain("preserved, NOT overwritten");
      // The receipt records the customization for the next run.
      const receipt = readReceipt(
        JSON.parse(readFileSync(join(dest, "kern.receipt.json"), "utf8")),
      );
      const row = receipt.files.find((f) => f.path === "components/badge.tsx");
      expect(row?.customized).toBe(true);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("refuses to upgrade what was never added", () => {
    expect(() =>
      upgradeComponent("badge", { root: WORKSPACE_ROOT, dest: freshDest() }),
    ).toThrow("not a kern dest");
  });

  it("upgrades a block through the block planner (C3)", {
    timeout: 120_000,
  }, () => {
    const dest = freshDest();
    try {
      addBlock("settings-screen", { root: WORKSPACE_ROOT, dest });
      const result = upgradeBlock("settings-screen", {
        root: WORKSPACE_ROOT,
        dest,
      });
      expect(result.applied).toBe(false);
      expect(formatUpgrade(result)).toContain("dry run");
      // A component-only dest refuses a block upgrade by owner.
      const other = freshDest();
      try {
        addComponent("badge", { root: WORKSPACE_ROOT, dest: other });
        expect(() =>
          upgradeBlock("settings-screen", {
            root: WORKSPACE_ROOT,
            dest: other,
          }),
        ).toThrow("not vendored here");
      } finally {
        rmSync(other, { recursive: true, force: true });
      }
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("preserves customized block files on --apply", {
    timeout: 120_000,
  }, () => {
    const dest = freshDest();
    try {
      addBlock("settings-screen", { root: WORKSPACE_ROOT, dest });
      writeFileSync(
        join(dest, "blocks/settings-screen.tsx"),
        "// owned edit\n",
      );
      const result = upgradeBlock("settings-screen", {
        root: WORKSPACE_ROOT,
        dest,
        apply: true,
      });
      expect(result.applied).toBe(true);
      expect(
        readFileSync(join(dest, "blocks/settings-screen.tsx"), "utf8"),
      ).toBe("// owned edit\n");
      expect(result.plan.customized).toContain("blocks/settings-screen.tsx");
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });
});
