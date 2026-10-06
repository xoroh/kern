import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { addComponent } from "./add";
import { loadManifest, WORKSPACE_ROOT } from "./manifest";

function freshDest(): string {
  return mkdtempSync(join(tmpdir(), "kern-add-"));
}

describe("kern add (Mode 1 smoke)", () => {
  it("vendors button + closure with receipt", () => {
    const dest = freshDest();
    try {
      const r = addComponent("button", { root: WORKSPACE_ROOT, dest });
      expect(r.files).toContain("components/button.tsx");
      expect(r.files).toContain("utils/cn.ts");
      expect(r.npm).toContain("class-variance-authority");
      expect(existsSync(join(dest, "components/button.tsx"))).toBe(true);
      const receipt = JSON.parse(readFileSync(r.receipt, "utf8"));
      expect(receipt.kern).toBe("0.0.0");
      expect(Object.keys(receipt.components)).toEqual(["button"]);
      // Relative imports preserved byte-identical: vendored tree self-closes.
      const src = readFileSync(
        join(WORKSPACE_ROOT, "packages/kern/src/components/button.tsx"),
        "utf8",
      );
      expect(readFileSync(join(dest, "components/button.tsx"), "utf8")).toBe(
        src,
      );
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  });

  it("refuses unknown names", () => {
    expect(() =>
      addComponent("does-not-exist", {
        root: WORKSPACE_ROOT,
        dest: freshDest(),
      }),
    ).toThrow("unknown component");
  });

  it("refuses native in web-only v1", () => {
    // Derived, not hardcoded: a manifest name with no web row today.
    const rows = loadManifest(WORKSPACE_ROOT);
    const web = new Set(
      rows.filter((r) => r.platform === "web").map((r) => r.name),
    );
    const nativeOnly = rows.find(
      (r) => r.platform === "native" && !web.has(r.name),
    );
    if (!nativeOnly)
      throw new Error("test setup: no native-only manifest row today");
    expect(() =>
      addComponent(nativeOnly.name, {
        root: WORKSPACE_ROOT,
        dest: freshDest(),
      }),
    ).toThrow("web-only");
  });
});
