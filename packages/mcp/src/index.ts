#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  designAudit,
  getBlock,
  getComponent,
  getDtcg,
  getIcon,
  getTokens,
  installPlan,
  listBlocks,
  listComponents,
  listIcons,
  listThemes,
  type Platform,
  TOKEN_PRESETS,
  type TokenPreset,
  validateInstall,
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
  "Get Kern design tokens. 'base' for the shared source, or a theme preset id from list_themes ('material-3', 'sharp', 'brand', 'compact').",
  { preset: z.enum(TOKEN_PRESETS).default("base") },
  async ({ preset }) => {
    return text(await getTokens((preset ?? "base") as TokenPreset));
  },
);

server.tool(
  "get_dtcg",
  "Get the DTCG 2025.10 interchange document: every foundation group plus sys.color roles, machine-readable for third-party tools.",
  {},
  async () => {
    return text(await getDtcg());
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
  "Kern compliance checklist for auditing a screen. Advisory only: static categories, not measured evidence.",
  {},
  async () => {
    return text(designAudit());
  },
);

server.tool(
  "list_icons",
  "List Kern icons: catalog size plus the semantic name-to-glyph map. Prefer semantic names so a re-decision stays a one-line change.",
  {},
  async () => {
    return text(await listIcons());
  },
);

server.tool(
  "get_icon",
  "Resolve one icon by semantic or glyph name. Unknown names error — a missing icon renders null, never a neighbouring glyph.",
  { name: z.string().describe("semantic name, e.g. menu-book") },
  async ({ name }) => {
    return text(await getIcon(name));
  },
);

server.tool(
  "list_blocks",
  "List Kern blocks: composed sections installable as a unit with kern add.",
  {},
  async () => {
    return text(await listBlocks());
  },
);

server.tool(
  "get_block",
  "Get one block: files, component dependencies, install command.",
  { name: z.string().describe("block name, e.g. auth-form") },
  async ({ name }) => {
    return text(await getBlock(name));
  },
);

server.tool(
  "install_plan",
  "Deterministic no-write install plan for a component: files, npm peers, commands. Evidence is labelled — resolved-closure when the CLI planner ran, metadata-only when it did not.",
  {
    name: z.string().describe("kebab-case component name, e.g. button"),
    platform: z.enum(["web", "native"]).default("web"),
  },
  async ({ name, platform }) => {
    return text(await installPlan(name, (platform ?? "web") as Platform));
  },
);

server.tool(
  "validate_install",
  "Validate a vendored destination against its receipt: current, customized, removed per file. Customized files are reported, never fixed — that is kern upgrade's job.",
  {
    dest: z
      .string()
      .describe("destination directory holding kern.receipt.json"),
  },
  async ({ dest }) => {
    return text(await validateInstall(dest));
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
