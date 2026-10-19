import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { addComponent, planComponent } from "./add";
import { listComponents } from "./list-diff";
import {
  DEFAULT_SYSTEM,
  knownSystems,
  loadRegistry,
  resolveSystem,
  WORKSPACE_ROOT,
} from "./manifest";

/**
 * Decision 009: CLI `add`/`list` take `--system`, defaulting to the only
 * current system, driven by the one generated registry.
 *
 * Fail-before: `listComponents`/`planComponent` took no system dimension —
 * `listComponents({ system: "nope" })` returned the full M3 list and
 * `planComponent("button", { system: "nope" })` planned M3 bytes. An unknown
 * system silently succeeding is the failure under test.
 */
describe("system flag (decision 009)", () => {
  it("the generated registry carries a system on every row", () => {
    const { rows } = loadRegistry(WORKSPACE_ROOT);
    expect(rows.length).toBeGreaterThan(100);
    expect(rows.every((r) => typeof r.system === "string" && r.system)).toBe(
      true,
    );
    expect(knownSystems(rows)).toContain(DEFAULT_SYSTEM);
    expect(DEFAULT_SYSTEM).toBe("kern-m3");
  });

  it("resolveSystem defaults and refuses unknown systems naming the known", () => {
    const { rows } = loadRegistry(WORKSPACE_ROOT);
    expect(resolveSystem(rows)).toBe("kern-m3");
    expect(resolveSystem(rows, "kern-m3")).toBe("kern-m3");
    expect(() => resolveSystem(rows, "nope")).toThrow(
      `unknown system "nope" — registry knows: ${knownSystems(rows).join(", ")}.`,
    );
  });

  it("the CLI-computed release set agrees with the generated payload", () => {
    // The generator and loadRegistry() hash rows with the same function —
    // including the system column. A drift here means receipts pin a set the
    // generator cannot reproduce.
    const live = loadRegistry(WORKSPACE_ROOT);
    const bundled = JSON.parse(
      readFileSync(
        join(WORKSPACE_ROOT, "packages/kern-cli/src/registry.json"),
        "utf8",
      ),
    ) as { releaseSet: string };
    expect(live.releaseSet).toBe(bundled.releaseSet);
  });

  it("list defaults to kern-m3 and filters by it", () => {
    const { rows } = loadRegistry(WORKSPACE_ROOT);
    const def = listComponents({ root: WORKSPACE_ROOT });
    const explicit = listComponents({
      root: WORKSPACE_ROOT,
      system: "kern-m3",
    });
    expect(def).toEqual(explicit);
    expect(def.length).toBe(rows.length);
    expect(def.every((l) => l.endsWith(", kern-m3)"))).toBe(true);
  });

  it("list refuses an unknown system", () => {
    expect(() =>
      listComponents({ root: WORKSPACE_ROOT, system: "nope" }),
    ).toThrow('unknown system "nope"');
  });

  it("add plans under the default and explicit system, refuses unknown", {
    timeout: 120_000,
  }, () => {
    const plan = planComponent("button", { root: WORKSPACE_ROOT });
    expect(plan.files).toContainEqual(
      expect.objectContaining({ out: "components/button.tsx" }),
    );
    const explicit = planComponent("button", {
      root: WORKSPACE_ROOT,
      system: "kern-m3",
    });
    expect(explicit.files.map((f) => f.out).sort()).toEqual(
      plan.files.map((f) => f.out).sort(),
    );
    expect(() =>
      planComponent("button", { root: WORKSPACE_ROOT, system: "nope" }),
    ).toThrow('unknown system "nope"');
    expect(() =>
      addComponent("button", { root: WORKSPACE_ROOT, system: "nope" }),
    ).toThrow('unknown system "nope"');
  });
});
