#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  designAudit,
  getComponent,
  getTokens,
  listComponents,
  listThemes,
  type Platform,
  TOKEN_PRESETS,
  type TokenPreset,
} from "./tools.js";

const server = new McpServer({ name: "@xoroh/kern-mcp", version: "0.0.0" });

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
    return text(await listComponents(platform as Platform | undefined));
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
    return text(await getComponent(name, (platform ?? "web") as Platform));
  },
);

server.tool(
  "get_tokens",
  "Get Kern design tokens. 'base' for the shared source, or a theme preset id from list_themes ('kern', 'sharp', 'brand', 'compact', 'demo'; 'm3' still resolves as the legacy alias for 'kern').",
  { preset: z.enum(TOKEN_PRESETS).default("base") },
  async ({ preset }) => {
    return text(await getTokens((preset ?? "base") as TokenPreset));
  },
);

server.tool(
  "list_themes",
  "List available theme presets with copy-paste pointers. Use get_tokens with an id for the full preset.",
  {},
  async () => {
    return text(await listThemes());
  },
);

server.tool(
  "design_audit",
  "Kern compliance checklist for auditing a screen. Score 0-10 per category.",
  {},
  async () => {
    return text(designAudit());
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
