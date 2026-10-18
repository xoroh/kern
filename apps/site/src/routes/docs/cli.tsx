/**
 * /docs/cli — the kern CLI reference.
 *
 * One command per section, each with a copy-paste bash block (token-painted
 * through the highlighting tokenizer). The page states the honest
 * distribution status once, up top — packages are 0.0.0 and unpublished —
 * and otherwise documents the CLI as it behaves. Cross-check command names
 * against the package entrypoint (`packages/kern-cli/src/kern.ts`); this page
 * is a rendering, not a fork.
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

export const Route = createFileRoute("/docs/cli")({
  head: () =>
    routeHead(
      "CLI",
      "The kern installer: create, init, add, diff, upgrade and feedback — one command per section, copy-paste ready.",
    ),
  component: Cli,
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

const RUN = `bun packages/kern-cli/src/kern.ts --help
# from the Kern checkout; pass create, init, add, diff, upgrade, or feedback`;

const CREATE = `kern create my-app            # scaffold a Vite + React app shell
kern create my-app --pm pnpm --preset sharp   # package manager + preset`;

const INIT = `kern init .                   # configure an existing project with the starter
# writes the starter, resolves the kern deps, stamps kern.receipt.json
# + kern.json (renderer, pinned preset, package manager, mode)`;

const LIST = `kern list                     # components + blocks, all platforms
kern list --platform native    # filter the component inventory`;

const ADD = `kern add button               # vendor one component + its import closure
kern add chip card            # vendor several (the receipt merges)
kern add settings-screen      # vendor a whole block under blocks/
kern add button --self-contained   # also vendor the token CSS snapshot`;

const DIFF_UPGRADE = `kern diff                     # current, customized, removed files
kern upgrade button           # plan only, no writes
kern upgrade button --apply   # update everything except your customized files`;

const NATIVE = `kern add button --platform native   # select the native manifest row first`;

const FEEDBACK = `kern feedback --category bug \\
  --title "Contrast toggle skips RTL" \\
  --description "The tooltip arrow points the wrong way in RTL locales." \\
  --component tooltip
kern feedback digest          # local, evidence-linked triage grouping
kern feedback prune --days 90 # delete old local reports explicitly`;

function Cli() {
  return (
    <SiteLayout>
      <PageCard gap={10}>
        <header className="flex flex-col gap-3">
          <Kicker>Docs / CLI</Kicker>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>CLI</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            <code>kern</code> installs code you own: scaffold an app, vendor a
            component or a whole block, then upgrade under receipt control —
            your edits are preserved, never overwritten. The use-cases page
            covers when to reach for it; this page is the command reference.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <H2 id="run">Run the preview CLI</H2>
          <Code language="bash">{RUN}</Code>
          <Admonition intent="warning" title="Preview distribution (0.0.0, unpublished)">
            The public package is not published, so <code>bunx</code> cannot
            install it yet. From this checkout, run the source entrypoint shown
            above. <code>create</code> and <code>init</code> use checkout
            dependencies by default; <code>--registry</code> emits versioned
            package names for use after the first publish (they 404 before
            then).
          </Admonition>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="create">create — scaffold an app</H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            One supported starter: Vite + React. The scaffold resolves the kern
            deps, stamps <code>kern.receipt.json</code> + <code>kern.json</code>{" "}
            (renderer, pinned preset, package manager, mode) and prints the
            install/run commands. Later <code>kern add</code> calls read both
            files back; a receipt exists from day one. Next.js, TanStack Start,
            React Router, Expo and monorepo orchestrators are not advertised —
            unsupported targets say so rather than emitting a half-working
            scaffold.
          </p>
          <Code language="bash">{CREATE}</Code>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="init">init — configure an existing project</H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Same starter, aimed at an existing directory — install → run →
            themed screen with a preset picker.
          </p>
          <Code language="bash">{INIT}</Code>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="list">list — browse the registry</H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Lists components with platform and status, then the available
            blocks. Use the platform filter when you are choosing a native or
            web row.
          </p>
          <Code language="bash">{LIST}</Code>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="add">add — vendor code</H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Copies the component and its full transitive import closure
            (resolved through the same manifest the MCP server reads), merging
            into one receipt. Two token modes: the default keeps token values
            as a dependency (one source of truth), while{" "}
            <code>--self-contained</code> vendors a snapshot recorded in the
            receipt so later drift is detectable. Web is the default;{" "}
            <code>--platform native</code> selects the native manifest row
            before lookup and prints the peer-dependency and Metro notes. A
            name with no row for the requested platform is refused rather than
            resolved to the wrong renderer.
          </p>
          <Code language="bash">{ADD}</Code>
          <Code language="bash">{NATIVE}</Code>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="diff-upgrade">diff + upgrade — audit and update under receipt control</H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            <code>kern.receipt.json</code> (schema v2) records the release set,
            per-file hashes and owners from day one. <code>diff</code> is the
            audit; <code>upgrade</code> dry-runs by default and{" "}
            <code>--apply</code> updates everything except your customized
            files — owned edits are preserved and reported, never overwritten.
          </p>
          <Code language="bash">{DIFF_UPGRADE}</Code>
        </section>

        <section className="flex flex-col gap-3">
          <H2 id="feedback">feedback — file a report</H2>
          <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
            Validates against the shared schema, discloses exactly what would
            be stored, and writes to <code>.kern/feedback/</code> — then prints
            a pre-filled GitHub issue URL <em>the human files by hand</em>.
            Nothing is sent automatically; evidence is opt-in via{" "}
            <code>--consent</code>; retention is 90 days with explicit deletion
            (<code>kern feedback prune</code>). <code>digest</code> prints an
            evidence-linked triage grouping, advisory only.
          </p>
          <Code language="bash">{FEEDBACK}</Code>
        </section>
      </PageCard>
    </SiteLayout>
  );
}
