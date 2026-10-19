import { describe, expect, it } from "bun:test";
import {
  DEFAULT_SYSTEM,
  getBlock,
  getComponent,
  getIcon,
  installPlan,
  knownSystems,
  listBlocks,
  listComponents,
  listIcons,
} from "./tools.js";

/**
 * Discovery and planning truthfulness (P5) — icons, blocks and the install
 * plan expose what they can prove, labelled by evidence level. A plan that
 * claims a resolved closure from metadata alone is the failure under test.
 */
describe("discovery", () => {
  it("lists the semantic icon map with a real count", async () => {
    const list = await listIcons();
    expect("error" in list).toBe(false);
    if ("error" in list) return;
    expect(list.count).toBeGreaterThanOrEqual(list.semantic.length);
    expect(list.semantic.length).toBeGreaterThan(0);
    expect(
      list.semantic.every((i) => i.semantic.trim() && i.glyph.trim()),
    ).toBe(true);
  });

  it("resolves a semantic icon and refuses an unknown one", async () => {
    const hit = await getIcon("menu");
    expect("error" in hit).toBe(false);
    const miss = await getIcon("not-an-icon-xyz");
    expect("error" in miss).toBe(true);
  });

  it("lists blocks with files and component dependencies", async () => {
    const list = await listBlocks();
    expect("error" in list).toBe(false);
    if ("error" in list) return;
    expect(list.count).toBeGreaterThan(0);
    for (const block of list.blocks) {
      expect(block.files.length).toBeGreaterThan(0);
    }
  });

  it("gets one block by name, refuses unknown names", async () => {
    const hit = await getBlock("auth-form");
    expect("error" in hit).toBe(false);
    expect(await getBlock("does-not-exist")).toMatchObject({
      error: expect.stringContaining("unknown block"),
    });
  });
});

describe("install planning", () => {
  it("plans a real component with labelled evidence", async () => {
    const plan = await installPlan("button", "web");
    expect("error" in plan).toBe(false);
    if ("error" in plan) return;
    // Workspace install: the CLI planner runs, so the evidence MUST be the
    // resolved closure — metadata-only here would mean the import failed
    // silently in the one place it should always succeed.
    expect(plan.evidence).toBe("resolved-closure");
    if (plan.evidence !== "resolved-closure") return;
    expect(plan.files).toContain("components/button.tsx");
    expect(plan.instructions[0]).toContain("kern add button");
  });

  it("plans a native row against the native platform, never web bytes", async () => {
    const plan = await installPlan("button", "native");
    expect("error" in plan).toBe(false);
    if ("error" in plan || plan.evidence !== "resolved-closure") return;
    expect(plan.platform).toBe("native");
  });

  it("refuses stubs and unknown names instead of planning them", async () => {
    expect(await installPlan("does-not-exist", "web")).toMatchObject({
      error: expect.stringContaining("unknown component"),
    });
  });

  it("validates a real destination against its receipt", async () => {
    const { mkdtempSync, rmSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const { addComponent } = await import("../../kern-cli/src/add.js");
    const { WORKSPACE_ROOT } = await import("../../kern-cli/src/manifest.js");
    const { validateInstall } = await import("./tools.js");
    const dest = mkdtempSync(join(tmpdir(), "kern-mcp-validate-"));
    try {
      addComponent("badge", { root: WORKSPACE_ROOT, dest });
      const clean = await validateInstall(dest);
      expect("error" in clean).toBe(false);
      if ("error" in clean) return;
      expect(clean.rows.every((r) => r.state === "current")).toBe(true);
      const { writeFileSync } = await import("node:fs");
      writeFileSync(join(dest, "components/badge.tsx"), "// owned\n");
      const dirty = await validateInstall(dest);
      if ("error" in dirty) throw new Error(dirty.error);
      expect(
        dirty.rows.find((r) => r.path === "components/badge.tsx")?.state,
      ).toBe("customized");
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("the MCP plan agrees with the CLI plan file-for-file (KERN-056)", async () => {
    // Discover → plan → install → validate must be ONE graph, not four
    // opinions. This test runs the MCP planner and the CLI planner on the
    // same component and asserts identical files and peers: any divergence
    // means the agent was told one thing while the installer does another.
    const { planComponent } = await import("../../kern-cli/src/add.js");
    const { WORKSPACE_ROOT } = await import("../../kern-cli/src/manifest.js");
    const mcp = await installPlan("badge", "web");
    expect("error" in mcp).toBe(false);
    if ("error" in mcp || mcp.evidence !== "resolved-closure") {
      throw new Error("expected a resolved-closure plan in the workspace");
    }
    const cli = planComponent("badge", { root: WORKSPACE_ROOT });
    expect([...mcp.files].sort()).toEqual(cli.files.map((f) => f.out).sort());
    expect([...mcp.npm].sort()).toEqual([...cli.npm].sort());
  });
});

describe("system flag (decision 009)", () => {
  it("the registry carries one known system, defaulted", () => {
    expect(DEFAULT_SYSTEM).toBe("kern-m3");
    expect(knownSystems()).toContain("kern-m3");
  });

  it("lists default to kern-m3 and refuses unknown systems", async () => {
    const def = await listComponents();
    expect("error" in def).toBe(false);
    if ("error" in def) return;
    expect(def.system).toBe("kern-m3");
    expect(def.count).toBeGreaterThan(100);
    expect(def.components.every((c) => c.system === "kern-m3")).toBe(true);
    const explicit = await listComponents("web", "kern-m3");
    expect("error" in explicit).toBe(false);
    const miss = await listComponents("web", "nope");
    expect(miss).toMatchObject({
      error: expect.stringContaining('unknown system "nope"'),
    });
  });

  it("gets default to kern-m3 and refuses unknown systems", async () => {
    const hit = await getComponent("button");
    expect("error" in hit).toBe(false);
    if ("error" in hit) return;
    expect(hit.system).toBe("kern-m3");
    expect(await getComponent("button", "web", "nope")).toMatchObject({
      error: expect.stringContaining('unknown system "nope"'),
    });
  });

  it("plans default to kern-m3 with system-labelled commands", async () => {
    const plan = await installPlan("button");
    expect("error" in plan).toBe(false);
    if ("error" in plan) return;
    expect(plan.system).toBe("kern-m3");
    const commands =
      plan.evidence === "resolved-closure" ? plan.instructions : [plan.command];
    expect(commands[0]).toContain("--system kern-m3");
    expect(await installPlan("button", "web", "nope")).toMatchObject({
      error: expect.stringContaining('unknown system "nope"'),
    });
  });
});
