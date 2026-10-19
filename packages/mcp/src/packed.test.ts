import { describe, expect, it } from "bun:test";
import { execFileSync, spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const PKG = join(HERE, "..");
const SCRATCH = "/tmp/opencode/kern-mcp-packed-tests";

/**
 * Roadmap item 7 acceptance: the PACKED MCP tarball runs its tools from a
 * temp dir outside the repo.
 *
 * Fail-before: `get_tokens`, `get_dtcg`, `list_themes`, `list_blocks` and
 * `get_block` answered `{"error": "... run inside the kern monorepo ..."}` —
 * the server ran, but its data did not travel with it. After the bundle,
 * every data tool answers from dist; only the documented exceptions degrade
 * (component sources are never embedded; icons/CLI are optional packages).
 *
 * Data returned in a directory with no checkout proves the inline bundle:
 * a tool secretly reading checkout files would error there instead.
 *
 * Method mirrors scripts/verify-consumer.mjs (pack the artifact, install
 * into an isolated fixture) and the stdio smoke in zero-to-screen.test.ts.
 * First-party workspace deps (@xoroh/kern-cli, @xoroh/kern-icons) are
 * unpublished pre-publish, so the fixture extracts the tarball and installs
 * only its npm deps — exactly the post-publish shape minus the registry
 * lookups, and exactly the shape that exercises the optional-import
 * fallbacks. Needs network for the npm deps; skipped without it.
 */
async function online(): Promise<boolean> {
  try {
    const res = await fetch("https://registry.npmjs.org/zod", {
      signal: AbortSignal.timeout(10000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const ONLINE = await online();

function sh(cmd: string, cwd: string, extraEnv: Record<string, string> = {}) {
  return execFileSync(cmd, {
    cwd,
    env: { ...process.env, ...extraEnv },
    encoding: "utf8",
    shell: "/bin/bash",
  });
}

/** Minimal JSON-RPC client over the packed server's stdio (initialize + calls). */
function speakJsonRpc(
  serverPath: string,
  cwd: string,
  calls: { name: string; arguments: Record<string, unknown> }[],
): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.KERN_REPO_ROOT;
    const server = spawn("node", [serverPath], {
      cwd,
      env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const pending = new Map<number, (value: unknown) => void>();
    let buf = "";
    const timer = setTimeout(
      () => reject(new Error("packed MCP stdio timed out")),
      120000,
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
          const text =
            msg.result?.content?.[0]?.text ??
            (msg.result ? JSON.stringify(msg.result) : "{}");
          try {
            pending.get(msg.id)?.(JSON.parse(text));
          } catch {
            pending.get(msg.id)?.({ unparseable: text.slice(0, 120) });
          }
          pending.delete(msg.id);
        }
      }
    });
    server.on("error", reject);
    const waits = calls.map(
      (_, i) => new Promise<unknown>((r) => pending.set(i + 1, r)),
    );
    server.stdin.write(
      `${JSON.stringify({ jsonrpc: "2.0", id: 0, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "packed-test", version: "0" } } })}\n`,
    );
    Promise.all(waits).then((v) => {
      clearTimeout(timer);
      server.kill();
      resolve(v);
    });
  });
}

describe.skipIf(!ONLINE)(
  "packed tarball runs its tools outside the repo",
  () => {
    it("serves data tools from dist, degrades the rest explicitly", async () => {
      const distEntry = join(PKG, "dist", "index.js");
      if (!existsSync(distEntry)) {
        throw new Error(
          "packed test needs a build first — run `bun run build` (dist/ is gitignored).",
        );
      }
      mkdirSync(SCRATCH, { recursive: true });
      const dest = mkdtempSync(join(SCRATCH, "packed-"));
      try {
        const packOut = sh(`bun pm pack --destination "${dest}"`, PKG);
        const tgz = packOut
          .split("\n")
          .map((l) => l.trim())
          .find((l) => l.endsWith(".tgz"));
        if (!tgz || !existsSync(tgz)) {
          throw new Error(`pack produced no tarball in ${dest}`);
        }
        const pkgDir = join(dest, "node_modules", "@xoroh", "kern-mcp");
        mkdirSync(pkgDir, { recursive: true });
        sh(`tar -xzf "${tgz}" -C "${pkgDir}" --strip-components=1`, dest);
        const manifest = JSON.parse(
          readFileSync(join(PKG, "package.json"), "utf8"),
        ) as { dependencies: Record<string, string> };
        const npmDeps = Object.entries(manifest.dependencies)
          .filter(([name]) => !name.startsWith("@xoroh/"))
          .map(([name, range]) => `${name}@${range}`)
          .join(" ");
        sh(`bun init -y >/dev/null 2>&1; bun add ${npmDeps}`, dest);

        const serverPath = join(pkgDir, "dist", "index.js");
        expect(existsSync(serverPath)).toBe(true);
        const dataCalls = [
          { name: "list_components", arguments: {} },
          { name: "list_components", arguments: { system: "kern-m3" } },
          { name: "list_components", arguments: { system: "nope" } },
          { name: "get_component", arguments: { name: "button" } },
          { name: "install_plan", arguments: { name: "button" } },
          { name: "get_tokens", arguments: { preset: "base" } },
          { name: "get_tokens", arguments: { preset: "brand" } },
          { name: "get_dtcg", arguments: {} },
          { name: "list_themes", arguments: {} },
          { name: "list_blocks", arguments: {} },
          { name: "get_block", arguments: { name: "auth-form" } },
          { name: "design_audit", arguments: {} },
        ];
        const results = await speakJsonRpc(serverPath, dest, dataCalls);
        const byCall = new Map(dataCalls.map((_, i) => [i, results[i]]));
        const payload = (i: number) => byCall.get(i) as Record<string, unknown>;

        // Registry, tokens, DTCG, themes, blocks, audit: DATA, no checkout.
        for (const i of [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
          expect("error" in payload(i), `call ${i} errored`).toBe(false);
        }
        expect((payload(0) as { count: number }).count).toBeGreaterThan(100);
        expect((payload(5) as { tokens: unknown }).tokens).toBeDefined();
        expect((payload(9) as { count: number }).count).toBeGreaterThan(0);
        // Unknown system resolves against the bundled registry, packed.
        expect(payload(2)).toMatchObject({
          error: expect.stringContaining('unknown system "nope"'),
        });
        // Component sources are never embedded: explicit pointer, not a crash.
        expect(payload(3)).toMatchObject({
          sourceCode: expect.stringContaining("(not bundled"),
        });
        // Optional packages absent in the fixture: explicit errors by design.
        const optionals = await speakJsonRpc(serverPath, dest, [
          { name: "list_icons", arguments: {} },
          { name: "validate_install", arguments: { dest } },
        ]);
        for (const [i, r] of optionals.entries()) {
          expect("error" in (r as object), `optional call ${i} crashed`).toBe(
            true,
          );
        }
      } finally {
        rmSync(dest, { recursive: true, force: true });
      }
    }, 300000);
  },
);
