/**
 * /docs/mcp — the MCP server reference.
 *
 * The connect section uses each host's actual config shape, and the tool
 * table mirrors the server registrations in `packages/mcp/src/index.ts`.
 * The distribution note states the honest boundary (bundled inventory vs
 * checkout-bound sources) instead of implying the sources follow the server
 * everywhere.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { Code } from "../../components/docs/code";
import { Admonition } from "../../domains/shared/chrome/docs-shell-parts";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_PAGE,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/docs/mcp")({
  head: () =>
    routeHead(
      "MCP server",
      "Connect Claude Code, Cursor, VS Code or Zed to the kern MCP server — tools for listing components, fetching source and tokens, planning installs and auditing screens.",
    ),
  component: Mcp,
});

const INK = "text-(--sys-color-on-surface)";
const INK_SOFT = "text-(--sys-color-on-surface-variant)";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className={`m-0 ${T_SECTION} ${INK}`}>
      {children}
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className={`m-0 ${T_BODY} ${INK}`}>
      {children}
    </h3>
  );
}

const CLAUDE_CURSOR = `{
  "mcpServers": {
    "kern": {
      "command": "bunx",
      "args": ["@xoroh/kern-mcp"]
    }
  }
}`;

const VS_CODE = `{
  "servers": {
    "kern": {
      "type": "stdio",
      "command": "bunx",
      "args": ["@xoroh/kern-mcp"]
    }
  }
}`;

const ZED = `{
  "context_servers": {
    "kern": {
      "command": {
        "path": "bunx",
        "args": ["@xoroh/kern-mcp"]
      }
    }
  }
}`;

const WORKSPACE = `{
  "mcpServers": {
    "kern": {
      "command": "bun",
      "args": ["run", "/path/to/kern/packages/mcp/src/index.ts"],
      "env": { "KERN_REPO_ROOT": "/path/to/kern" }
    }
  }
}`;

const TOOLS: { name: string; what: string }[] = [
  {
    name: "list_components",
    what: "Component inventory with platform, entrypoint, subpath import and real/stub status",
  },
  {
    name: "get_component",
    what: "Source for one component; stubs return their status instead of guessed code",
  },
  {
    name: "get_tokens",
    what: "base tokens or a theme preset id (material-3 / sharp / brand / compact)",
  },
  {
    name: "get_dtcg",
    what: "DTCG 2025.10 interchange document — all foundations + sys roles",
  },
  { name: "list_themes", what: "The theme catalog the visual builder reads" },
  { name: "list_icons", what: "Semantic icon map and catalog count" },
  {
    name: "get_icon",
    what: "Resolve one semantic or glyph name; unknown names error",
  },
  { name: "list_blocks", what: "Composed blocks installable as a unit" },
  {
    name: "get_block",
    what: "One block's files, component dependencies and install command",
  },
  {
    name: "install_plan",
    what: "Deterministic no-write install plan, evidence-labelled (resolved-closure vs metadata-only)",
  },
  {
    name: "validate_install",
    what: "Receipt-vs-destination diff; customized files reported, never fixed",
  },
  {
    name: "design_audit",
    what: "Advisory 12-category compliance checklist for a screen",
  },
];

function Mcp() {
  return (
    <SiteLayout>
      <PageCard gap={10}>
        <header className="flex flex-col gap-3">
          <Kicker className={INK_SOFT}>Docs</Kicker>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>MCP server</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Skills teach an agent what right looks like;{" "}
            <code>@xoroh/kern-mcp</code> lets it <em>do</em> things — list
            components, fetch source and tokens, plan an install, audit a screen
            — through the Model Context Protocol, from any MCP host.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <H2 id="connect">Connect</H2>
          <Admonition
            intent="warning"
            title="Preview distribution (0.0.0, unpublished)"
          >
            The public package is not published yet, so the <code>bunx</code>{" "}
            examples below work after the first release. To connect from this
            checkout today, use the workspace config and set its absolute repo
            path.
          </Admonition>
          <H3 id="connect-claude">Claude Code and Cursor</H3>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Claude Code accepts this in project <code>.mcp.json</code> (or via{" "}
            <code>claude mcp add</code>); Cursor uses{" "}
            <code>.cursor/mcp.json</code>. Both use the <code>mcpServers</code>{" "}
            shape.
          </p>
          <Code language="json" filename=".mcp.json">
            {CLAUDE_CURSOR}
          </Code>
          <H3 id="connect-vscode">VS Code</H3>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            In <code>.vscode/mcp.json</code>, VS Code uses <code>servers</code>{" "}
            and requires <code>type: &quot;stdio&quot;</code> for a local
            process.
          </p>
          <Code language="json" filename=".vscode/mcp.json">
            {VS_CODE}
          </Code>
          <H3 id="connect-zed">Zed</H3>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Zed stores local servers under <code>context_servers</code>; its{" "}
            <code>command</code> is an object with a path and arguments.
          </p>
          <Code language="json" filename="settings.json">
            {ZED}
          </Code>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            In this monorepo, point the command at the checkout and set{" "}
            <code>KERN_REPO_ROOT</code> so source-reading tools can find files.
            This shows the Claude Code/Cursor wrapper; for VS Code or Zed, keep
            the same command, arguments, and environment value inside the host
            wrapper above.
          </p>
          <Code language="json" filename=".mcp.json">
            {WORKSPACE}
          </Code>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="tools">Tools</H2>
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse text-left ${T_BODY_SM}`}>
              <caption className="sr-only">MCP tool names and behavior</caption>
              <thead>
                <tr className="border-b border-(--sys-color-outline-variant)">
                  <th
                    scope="col"
                    className={`${T_BODY_SM} py-2 pr-4 font-medium ${INK}`}
                  >
                    Tool
                  </th>
                  <th
                    scope="col"
                    className={`${T_BODY_SM} py-2 font-medium ${INK}`}
                  >
                    What it does
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOOLS.map((tool) => (
                  <tr
                    key={tool.name}
                    className="border-b border-(--sys-color-outline-variant)/60"
                  >
                    <td className="py-2 pr-4">
                      <code className={INK}>{tool.name}</code>
                    </td>
                    <td className={`py-2 ${INK_SOFT}`}>{tool.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="distribution">
            What ships with the server, what reads your checkout
          </H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            The registry is bundled at build time, so inventory, install plans
            and validation work anywhere. Component, token, block and icon
            <strong> sources</strong> still read from a checkout —{" "}
            <code>KERN_REPO_ROOT</code> overrides the path — and every tool
            names what it could not reach instead of inventing it.{" "}
            <code>install_plan</code> labels its own evidence:{" "}
            <code>resolved-closure</code> when the CLI plans it,
            <code>metadata-only</code> otherwise.
          </p>
        </section>

        <Admonition intent="note" title="Agents start at the machine surface">
          The agent-facing index lives at <code>/mcp/index.json</code> (page map
          + per-page markdown links); <code>llms.txt</code> and per-page{" "}
          <code>.md</code> stay fetchable without the server. This page is for
          the human wiring the config up.
        </Admonition>
      </PageCard>
    </SiteLayout>
  );
}
