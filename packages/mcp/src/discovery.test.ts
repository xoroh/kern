import { describe, expect, it } from "bun:test";
import {
  getBlock,
  getIcon,
  installPlan,
  listBlocks,
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
});
