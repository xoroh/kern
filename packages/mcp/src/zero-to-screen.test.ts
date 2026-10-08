/**
 * Zero-to-screen: the agent loop, tested end to end.
 *
 * An agent building a themed screen from zero walks MCP + CLI + preset in
 * order — list_themes, get_tokens(preset), get_component, `kern add`, then
 * the preset resolving to real values. Every step below runs the same code
 * the agent calls (tool handlers, `addComponent`, the token resolver), plus
 * one spawned-server smoke proving the stdio wire serves the fixed tools.
 * A step that regresses fails here, not in an agent session.
 */
import { describe, expect, it } from "bun:test";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { addComponent } from "../../kern-cli/src/add.js";
import {
  defineThemePreset,
  resolveThemeDetails,
  themeIds,
  varName,
} from "../../kern-tokens/src/resolve.js";
import {
  canonicalPreset,
  designAudit,
  getComponent,
  getTokens,
  listComponents,
  listThemes,
} from "./tools.js";

const HERE = dirname(fileURLToPath(import.meta.url));
// packages/mcp/src -> repo root (three levels up): the same root an agent
// points KERN_REPO_ROOT at.
const ROOT = resolve(HERE, "..", "..", "..");
process.env.KERN_REPO_ROOT = ROOT;

function hasError(payload: unknown): payload is { error: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error: unknown }).error === "string"
  );
}

describe("zero-to-screen loop", () => {
  it("list_themes serves the catalog the configurator reads", async () => {
    const catalog = await listThemes();
    expect(hasError(catalog), JSON.stringify(catalog)).toBe(false);
    const ids = (catalog as { themes: { id: string }[] }).themes.map(
      (t) => t.id,
    );
    for (const id of themeIds()) expect(ids).toContain(id);
    for (const entry of (
      catalog as { themes: { id: string; file: string; description: string }[] }
    ).themes) {
      expect(entry.description.trim().length > 0).toBe(true);
      expect(
        existsSync(join(ROOT, "packages/kern-tokens/src/themes", entry.file)),
        entry.file,
      ).toBe(true);
    }
  });

  it("every catalog preset resolves to a full scheme in both modes", async () => {
    const kern = resolveThemeDetails("light");
    const roleCount = Object.keys(kern.color).length;
    const shapeCount = Object.keys(kern.shape).length;
    expect(roleCount > 0).toBe(true);
    for (const id of themeIds()) {
      const payload = await getTokens(id);
      expect(hasError(payload), id).toBe(false);
      for (const mode of ["light", "dark"] as const) {
        const resolved = resolveThemeDetails(mode, "standard", id);
        expect(Object.keys(resolved.color).length, `${id}/${mode}`).toBe(
          roleCount,
        );
        expect(Object.keys(resolved.shape).length, `${id}/${mode}`).toBe(
          shapeCount,
        );
        for (const [role, value] of Object.entries(resolved.color)) {
          expect(
            typeof value === "string" && value.length > 0,
            `${id}/${mode}.${role}`,
          ).toBe(true);
        }
      }
    }
  });

  it("keeps the base source and the m3 alias working", async () => {
    const base = await getTokens("base");
    expect(hasError(base)).toBe(false);
    expect(typeof (base as { tokens: unknown }).tokens).toBe("object");
    const aliased = await getTokens("m3");
    expect(hasError(aliased)).toBe(false);
    expect((aliased as { preset: string }).preset).toBe("kern");
    expect(canonicalPreset("m3")).toBe("kern");
  });

  it("lists components and fetches real source, never stubs as code", async () => {
    const list = await listComponents("web");
    expect(list.count > 0).toBe(true);
    const button = await getComponent("button", "web");
    expect(hasError(button)).toBe(false);
    const src = (button as { sourceCode: string }).sourceCode;
    expect(src.includes("Button")).toBe(true);
    expect(src.includes("not implemented yet")).toBe(false);
    const unknown = await getComponent("does-not-exist", "web");
    expect(hasError(unknown)).toBe(true);
  });

  it("vendors the component with the CLI and a receipt", () => {
    const dest = mkdtempSync(join(tmpdir(), "kern-zero-"));
    try {
      const result = addComponent("button", { root: ROOT, dest });
      expect(result.files).toContain("components/button.tsx");
      const receipt = JSON.parse(readFileSync(result.receipt, "utf8"));
      expect(Object.keys(receipt.components)).toEqual(["button"]);
      const shipped = readFileSync(
        join(ROOT, "packages/kern/src/components/button.tsx"),
        "utf8",
      );
      expect(readFileSync(join(dest, "components/button.tsx"), "utf8")).toBe(
        shipped,
      );
      expect(existsSync(join(dest, "kern.receipt.json"))).toBe(true);
    } finally {
      rmSync(dest, { recursive: true, force: true });
    }
  }, 30000);

  it("an agent-authored preset validates through defineThemePreset", () => {
    // The worked sample from theme-variants.md: if the doc sample stops
    // passing, the authoring doc is lying and this is where it shows.
    const preset = defineThemePreset({
      id: "agent-zero",
      extends: "kern",
      overrides: {
        color: {
          light: { primary: "#1d4ed8" },
          dark: { primary: "#93c5fd" },
        },
      },
    });
    expect(preset.id).toBe("agent-zero");
    expect(() =>
      defineThemePreset({
        id: "sharp",
        overrides: { color: { light: { primary: "#1d4ed8" } } },
      }),
    ).toThrow("reserved");
    expect(() =>
      defineThemePreset({
        id: "agent-zero-bad",
        overrides: { color: { light: { notARole: "#1d4ed8" } } },
      }),
    ).toThrow("Unknown color role");
  });

  it("the loop composes: preset value + CSS var behind a real component", async () => {
    // The themed screen in one assertion chain: Button source from the MCP
    // server, the brand preset's primary resolved through the token pipeline,
    // and the CSS variable a project reads without importing anything.
    const button = await getComponent("button", "web");
    expect(hasError(button)).toBe(false);
    const { color } = resolveThemeDetails("light", "standard", "brand");
    expect(/^#[\da-f]{6}$/i.test(color.primary)).toBe(true);
    expect(varName("primary")).toBe("--md-sys-color-primary");
  });

  it("design_audit mirrors the kern skill's twelve categories", () => {
    expect(designAudit().categories.length).toBe(12);
  });

  it("serves list_themes + get_tokens over stdio", async () => {
    const calls = await speakJsonRpc([
      { name: "list_themes", arguments: {} },
      { name: "get_tokens", arguments: { preset: "brand" } },
    ]);
    for (const [i, payload] of calls.entries()) {
      expect(
        hasError(payload),
        `call ${i}: ${JSON.stringify(payload).slice(0, 200)}`,
      ).toBe(false);
    }
    const themes = calls[0] as { themes: { id: string }[] };
    expect(themes.themes.map((t) => t.id)).toContain("brand");
    const brand = calls[1] as { preset: string; tokens: unknown };
    expect(brand.preset).toBe("brand");
    expect(typeof brand.tokens).toBe("object");
  }, 30000);
});

/** Minimal JSON-RPC client: initialize, then one tools/call per entry. */
async function speakJsonRpc(
  calls: { name: string; arguments: Record<string, unknown> }[],
): Promise<unknown[]> {
  const server = spawn("bun", [join(HERE, "index.ts")], {
    env: { ...process.env, KERN_REPO_ROOT: ROOT },
    stdio: ["pipe", "pipe", "pipe"],
  });
  const results: unknown[] = [];
  let buf = "";
  const pending = new Map<number, (value: unknown) => void>();
  try {
    const done = new Promise<void>((resolveDone, rejectDone) => {
      const timer = setTimeout(
        () => rejectDone(new Error("MCP stdio smoke timed out")),
        25000,
      );
      server.stdout.on("data", (chunk: Buffer) => {
        buf += chunk.toString();
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let msg: { id?: number; result?: { content?: { text?: string }[] } };
          try {
            msg = JSON.parse(line);
          } catch {
            continue;
          }
          if (msg.id === 0) {
            for (const [i, call] of calls.entries()) {
              server.stdin.write(
                `${JSON.stringify({ jsonrpc: "2.0", id: i + 1, method: "tools/call", params: { name: call.name, arguments: call.arguments } })}\n`,
              );
            }
          } else if (typeof msg.id === "number" && msg.id >= 1) {
            const text = msg.result?.content?.[0]?.text ?? "{}";
            pending.get(msg.id)?.(JSON.parse(text));
            pending.delete(msg.id);
            if (pending.size === 0) {
              clearTimeout(timer);
              resolveDone();
            }
          }
        }
      });
      server.stderr.on("data", () => {
        // SDK chatter stays off the assertion path.
      });
      server.on("error", rejectDone);
    });
    const send = (id: number) =>
      new Promise<unknown>((resolveCall) => {
        pending.set(id, resolveCall);
      });
    const waits = calls.map((_, i) => send(i + 1));
    server.stdin.write(
      `${JSON.stringify({ jsonrpc: "2.0", id: 0, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "zero-to-screen", version: "0" } } })}\n`,
    );
    await done;
    for (const w of waits) results.push(await w);
    return results;
  } finally {
    server.kill();
  }
}
