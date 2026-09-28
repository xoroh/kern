#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { COMPONENTS } from "./manifest.js";

const server = new McpServer({ name: "@xoroh/kern-mcp", version: "0.0.0" });

// Resolve the kern monorepo root: explicit env first, then dist/src layouts.
// NOTE: published bundles will inline the registry instead (see README).
function kernRootCandidates(): string[] {
  const here = dirname(fileURLToPath(import.meta.url));
  const roots = [
    process.env.KERN_REPO_ROOT,
    resolve(here, "../../.."), // dist/index.js -> repo root
    resolve(here, "../.."), // src/index.ts -> packages/mcp/.. = packages (wrong, filtered below)
  ].filter((p): p is string => Boolean(p));
  return roots;
}

async function readKernFile(rel: string): Promise<string | null> {
  for (const root of kernRootCandidates()) {
    for (const base of [
      resolve(root, "packages/kern", rel),
      resolve(root, "kern", rel),
    ]) {
      try {
        return await readFile(base, "utf8");
      } catch {
        // try next candidate
      }
    }
  }
  return null;
}

function text(payload: unknown) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify(payload, null, 2) },
    ],
  };
}

server.tool(
  "list_components",
  "List Kern UI components with build status. Filter by platform.",
  {
    platform: z
      .enum(["web", "native"])
      .optional()
      .describe("web (React) or native (React Native)"),
  },
  async ({ platform }) => {
    const list = COMPONENTS.filter(
      (c) => !platform || c.platform === platform,
    ).map((c) => ({
      name: c.name,
      export: c.export,
      platform: c.platform,
      status: c.status,
      import: c.platform === "web" ? "@xoroh/kern" : "@xoroh/kern/native",
    }));
    return text({ count: list.length, components: list });
  },
);

server.tool(
  "get_component",
  "Get a component's source. 'real' components return code; stubs return their status.",
  {
    name: z.string().describe("kebab-case component name, e.g. button"),
    platform: z.enum(["web", "native"]).default("web"),
  },
  async ({ name, platform }) => {
    const entry = COMPONENTS.find(
      (c) => c.name === name && c.platform === platform,
    );
    if (!entry)
      return text({ error: `unknown component: ${platform}/${name}` });
    const source = await readKernFile(entry.path);
    return text({
      ...entry,
      sourceCode:
        source ??
        "(not bundled — run inside the kern monorepo or set KERN_REPO_ROOT)",
    });
  },
);

server.tool(
  "get_tokens",
  "Get Kern design tokens. 'base' for the shared source, or a theme preset.",
  { preset: z.enum(["base", "m3", "sharp", "brand"]).default("base") },
  async ({ preset }) => {
    const rel =
      preset === "base"
        ? "src/theme/tokens.json"
        : `src/theme/themes/${preset}.json`;
    const raw = await readKernFile(rel);
    if (!raw)
      return text({
        error: `tokens unavailable outside the monorepo (wanted ${rel})`,
      });
    return text({ preset, tokens: JSON.parse(raw) });
  },
);

server.tool(
  "list_themes",
  "List available theme presets with copy-paste pointers. Use get_tokens with an id for the full preset.",
  {},
  async () => {
    const raw = await readKernFile("src/theme/themes/index.json");
    if (!raw)
      return text({
        error: "theme catalog unavailable outside the monorepo",
      });
    return text(JSON.parse(raw));
  },
);

server.tool(
  "design_audit",
  "Kern compliance checklist for auditing a screen. Score 0-10 per category.",
  {},
  async () => {
    return text({
      categories: [
        "Color roles (no hardcoded hex; correct on-* pairing)",
        "Typography (Inter, correct MD3 scale role)",
        "Shape (full on pills, small cards, medium dropdowns)",
        "Elevation (flat resting UI; shadows on floating layers only)",
        "Components (match Kern specs; dialog 2-action law)",
        "Layout (topbar/sidebar/content shell; adaptive breakpoints)",
        "Motion (utility easing only, <=200ms)",
        "Accessibility (4.5:1 text; 48dp targets; visible focus)",
        "Theming (light + dark + contrast resolve; no hex)",
        "States (hover 8 / focus 10 / press 10 state layers)",
      ],
      reference: ".agents/skills/kern/SKILL.md in the kern repo",
    });
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
