import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createApp } from "./create";
import { initScaffold } from "./init";
import { WORKSPACE_ROOT } from "./manifest";

function freshParent(): string {
  return mkdtempSync(join(tmpdir(), "kern-create-"));
}

describe("kern create (new app; C1 create/init contract)", () => {
  it("scaffolds a new app dir with receipt and kern.json", () => {
    const parent = freshParent();
    try {
      const r = createApp("my-app", { root: WORKSPACE_ROOT, cwd: parent });
      expect(r.dir).toBe(join(parent, "my-app"));
      for (const f of ["package.json", "src/App.tsx", "kern.json"]) {
        expect(existsSync(join(r.dir, f))).toBe(true);
      }
      expect(existsSync(r.receipt)).toBe(true);
      const kernJson = JSON.parse(
        readFileSync(join(r.dir, "kern.json"), "utf8"),
      );
      expect(kernJson.renderer).toBe("web");
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it("a created app is indistinguishable from an initialized one", () => {
    const parent = freshParent();
    try {
      const created = createApp("a", { root: WORKSPACE_ROOT, cwd: parent });
      const initialized = initScaffold(join(parent, "b"), {
        root: WORKSPACE_ROOT,
      });
      expect(created.files).toEqual(initialized.files);
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it("refuses an existing dir and names kern init instead", () => {
    const parent = freshParent();
    try {
      mkdirSync(join(parent, "taken"));
      expect(() =>
        createApp("taken", { root: WORKSPACE_ROOT, cwd: parent }),
      ).toThrow("kern init");
      // No scaffold leaked into the refused dest.
      expect(existsSync(join(parent, "taken", "package.json"))).toBe(false);
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });

  it("requires a name", () => {
    expect(() => createApp("", { root: WORKSPACE_ROOT })).toThrow(
      "missing <name>",
    );
  });

  it("supports --registry dep names like init", () => {
    const parent = freshParent();
    try {
      const r = createApp("reg-app", {
        root: WORKSPACE_ROOT,
        cwd: parent,
        registry: true,
      });
      expect(r.registry).toBe(true);
      const pkg = JSON.parse(
        readFileSync(join(r.dir, "package.json"), "utf8"),
      );
      expect(pkg.dependencies["@xoroh/kern"]).toBe("0.0.0");
      expect(r.instructions[0]).toContain("404 until the first publish");
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });
});
