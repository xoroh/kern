/**
 * /docs/use-cases — what each surface is for, and what is real today.
 *
 * The onboarding tail of the flow (choose system → install → first screen):
 * one page per surface's use cases (CLI, MCP, skills), the system-choice
 * step up front, and the show/hide policy that keeps "coming" from being
 * read as "available". Same shell as the rest of the docs domain.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { Code, Step } from "../../components/docs/code";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { Admonition } from "../../domains/shared/chrome/docs-shell-parts";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_LABEL_LG,
  T_PAGE,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/docs/use-cases")({
  head: () =>
    routeHead(
      "Use cases",
      "CLI, MCP and skills — what each surface does, and what is real today versus coming.",
    ),
  component: UseCases,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CARD =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)";

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className={`m-0 ${T_SECTION} ${INK}`}>
      {children}
    </h2>
  );
}

function UseCases() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-10 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker className={INK_SOFT}>Docs</Kicker>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Use cases</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Each surface has a job: the CLI installs code you own, the MCP
              server feeds agents, the skills teach the rules. This page names
              the job of each — and draws the line between what works today and
              what is still coming.
            </p>
          </header>

          {/* ---------------------------------------------- system choice */}
          <section className="flex flex-col gap-4">
            <H2 id="choose-a-system">Choose a system</H2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Two delivery modes ship today — the same components either way.
              Pick by who owns the code:
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <article className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>Mode 1 — vendored</p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  <code>kern add &lt;name&gt;</code> copies the component and
                  its import closure into your tree. You own the code: edit it,
                  keep it, no upgrades flow in. Tokens stay depended by default
                  (hybrid); <code>--self-contained</code> vendors the token CSS
                  too.
                </p>
                <Code>{`kern init my-app        # scaffold: install → run → themed screen
kern add button        # vendor one component + closure
kern add chip card     # vendor several (receipt merges)`}</Code>
              </article>
              <article className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>Mode 2 — depended</p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  A versioned dependency. Upgrades flow from the package, the
                  code stays ours. This is the default recommendation once
                  0.1.0 publishes; until then the packages resolve from the
                  workspace.
                </p>
                <Code>{`bun add @xoroh/kern @xoroh/kern-tokens
# then import — the README's first component`}</Code>
              </article>
            </div>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              The design system is Material Design 3 (the Foundations section
              carries every rule with spec links). A second system would plug
              through the same <code>ManifestRow</code> seam the CLI and MCP
              server already read — no rework — but none ships today.
            </p>
          </section>

          {/* -------------------------------------------------------- CLI */}
          <section className="flex flex-col gap-4">
            <H2 id="cli-use-cases">CLI use cases</H2>
            <ol className="m-0 flex list-none flex-col gap-4 p-0">
              <li className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                  Scaffold an app shell, then add components
                </p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  <code>kern init</code> writes the starter (install → run →
                  themed screen with a preset picker); each{" "}
                  <code>kern add</code> vendors one component into it. One
                  receipt tracks every addition.
                </p>
              </li>
              <li className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                  Single component, hybrid tokens
                </p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  <code>kern add button</code> vendors the code and leaves
                  token VALUES as a dependency — one source of truth for
                  values, structure is yours.
                </p>
              </li>
              <li className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                  Full eject — <code>--self-contained</code>
                </p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  Vendors the token CSS snapshot too: values frozen at the
                  current kern version, recorded in the receipt so drift is
                  detectable later.
                </p>
              </li>
              <li className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                  A composed block as a unit
                </p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  <code>kern add settings-screen</code> vendors a whole block
                  (all its files) under <code>blocks/</code> — the same source
                  the{" "}
                  <a
                    href="/showcase"
                    className="text-(--md-sys-color-primary) no-underline hover:underline"
                  >
                    Blocks catalog
                  </a>{" "}
                  previews live.
                </p>
              </li>
              <li className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                  Receipt audit — <em>coming</em>
                </p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                  Receipts (<code>kern.receipt.json</code>, kern version + per-
                  file sha256) are written from day one so{" "}
                  <code>kern diff</code> and <code>kern upgrade</code> can
                  compare against them. Those two commands do{" "}
                  <strong>not</strong> exist yet — the receipt is the input
                  they will read, not a working audit today.
                </p>
              </li>
            </ol>
          </section>

          {/* ------------------------------------------------------- MCP */}
          <section className="flex flex-col gap-4">
            <H2 id="mcp-use-cases">MCP use cases</H2>
            <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
              Five tools, no memory: an agent reads the registry, pulls source,
              compares presets, discovers themes, or runs a screen audit.
            </p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {[
                {
                  use: "Inventory",
                  tool: "list_components",
                  body: "What exists on which platform — the same registry the CLI installs from.",
                },
                {
                  use: "Pull source",
                  tool: "get_component",
                  body: "One component's real source (or a pointer when it is a stub) — never a paraphrase.",
                },
                {
                  use: "Compare presets",
                  tool: "get_tokens",
                  body: "Base tokens or a full preset (`kern`/`sharp`/`brand`/`compact`/`demo`) to diff two themes.",
                },
                {
                  use: "Discover themes",
                  tool: "list_themes",
                  body: "The theme catalog with copy-paste pointers — the same file the Playground studio reads.",
                },
                {
                  use: "Audit a screen",
                  tool: "design_audit",
                  body: "The compliance checklist, mirroring the kern skill's audit table.",
                },
              ].map((row) => (
                <li key={row.tool} className={`${CARD} flex flex-col gap-1 p-4`}>
                  <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                    {row.use} — <code>{row.tool}</code>
                  </p>
                  <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{row.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------------------------------------------- skills */}
          <section className="flex flex-col gap-4">
            <H2 id="skills-use-cases">Skills use cases</H2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {[
                {
                  use: "Zero-to-screen loop",
                  skill: "kern-agents",
                  body: "llms.txt → per-page .md → mcp/index.json → MCP → skill. An agent reaches a working screen without reading the repo.",
                },
                {
                  use: "Compliance audit",
                  skill: "kern",
                  body: "The 12-category audit over a screen — same table design_audit serves to MCP clients.",
                },
                {
                  use: "Correct authoring",
                  skill: "kern",
                  body: "The decision tree and anti-patterns: variant law, state law, what is a component versus a composition.",
                },
                {
                  use: "Docs upkeep",
                  skill: "docs",
                  body: "Change routing and done-ness: where a change belongs and what must move with it.",
                },
              ].map((row) => (
                <li key={row.use} className={`${CARD} flex flex-col gap-1 p-4`}>
                  <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                    {row.use} — <code>{row.skill}</code>
                  </p>
                  <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{row.body}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* --------------------------------------------- show/hide policy */}
          <section className="flex flex-col gap-4">
            <H2 id="availability">What is available, what is coming</H2>
            <Admonition intent="warning" title="Coming is not available">
              A command or status named here as <em>coming</em> must never be
              run or relied on. Where a surface cannot show something honestly,
              it shows nothing — the same rule that keeps the{" "}
              <code>kern add</code> tab out of the install picker until the CLI
              publishes.
            </Admonition>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <article className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>Available now</p>
                <ul
                  className={`m-0 flex list-disc flex-col gap-1 pl-5 ${T_BODY_SM} ${INK_SOFT}`}
                >
                  <li>
                    Install: <code>kern init</code>, <code>kern add</code>{" "}
                    (components + blocks)
                  </li>
                  <li>Live demos, examples and configurators on every page</li>
                  <li>Theme presets + the Playground studio export</li>
                  <li>
                    Receipts written per install (<code>kern.receipt.json</code>
                    )
                  </li>
                  <li>MCP tools (workspace: set KERN_REPO_ROOT)</li>
                  <li>Skills: kern, kern-agents, docs</li>
                </ul>
              </article>
              <article className={`${CARD} flex flex-col gap-2 p-5`}>
                <p className={`m-0 ${T_LABEL_LG} ${INK}`}>
                  Coming — not available
                </p>
                <ul
                  className={`m-0 flex list-disc flex-col gap-1 pl-5 ${T_BODY_SM} ${INK_SOFT}`}
                >
                  <li>
                    <code>kern list</code>, <code>kern diff</code>,{" "}
                    <code>kern upgrade</code>
                  </li>
                  <li>
                    MCP KERN_REPO_ROOT-free bundling (inline sources + tokens at
                    build)
                  </li>
                  <li>
                    npm publish of <code>@xoroh/kern*</code> 0.1.0 — today the
                    maturity label honestly reads Preview / 0.0.0
                  </li>
                  <li>
                    <code>kern diff</code>-based receipt audits (receipts are
                    written; the comparator is not)
                  </li>
                </ul>
              </article>
            </div>
            <Step n={1} title="Install">
              Pick Mode 1 or Mode 2 above and install the packages.
            </Step>
            <Step n={2} title="First screen">
              Follow{" "}
              <a
                href="/getting-started"
                className="text-(--md-sys-color-primary) no-underline hover:underline"
              >
                Getting started
              </a>{" "}
              to a themed screen, then browse the component catalog for the
              pieces it is made of.
            </Step>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
}
