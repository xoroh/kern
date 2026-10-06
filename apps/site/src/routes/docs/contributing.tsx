/**
 * /docs/contributing — how to contribute to kern.
 *
 * Renders the real `CONTRIBUTING.md` from the repository root, section for
 * section, in the site's own typography. No summary, no additions: every
 * fact below exists verbatim in that file. Repo-relative links point at the
 * same paths on GitHub. When the file changes, this page changes with it —
 * check both in the same PR (the file itself says: docs in the same change).
 */
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";
import { T_BODY, T_LABEL, T_PAGE, T_SECTION } from "../../systems/type-scale";

export const Route = createFileRoute("/docs/contributing")({
  component: Contributing,
});

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const LINK = "text-(--md-sys-color-primary) no-underline hover:underline";
const REPO = "https://github.com/xoroh/kern";
const blob = (p: string) => `${REPO}/blob/main/${p}`;
const CODE =
  "rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-high) px-1.5 py-0.5 font-mono text-[0.85em]";

function Contributing() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-12 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>
              Docs · Contributing
            </p>
            <h1 className={`m-0 ${T_PAGE} ${INK}`}>Contributing to kern</h1>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Bun monorepo. <code className={CODE}>bun install</code> to start,{" "}
              <code className={CODE}>bun run build</code> before you expect
              anything to resolve. Understand the packages first:{" "}
              <a href={blob("docs/architecture.md")} className={LINK}>
                docs/architecture.md
              </a>
              .
            </p>
          </header>

          <div className="flex flex-col gap-3">
            <h2 id="per-pr-requirements" className={`m-0 ${T_SECTION} ${INK}`}>
              Per-PR requirements
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Before you trust a green CI run as evidence about behaviour, read{" "}
              <a href={blob("docs/verification-limits.md")} className={LINK}>
                docs/verification-limits.md
              </a>
              . It states what the suite does and does not prove. Briefly: 950
              unit tests across two runners,{" "}
              <strong>no e2e/browser layer of any kind</strong>, no visual
              regression, and a spec-URL gate that currently asserts zero
              citations. Green CI is evidence that the design law holds and the
              generated artifacts are current — not that anything was seen
              render.
            </p>
            <ol
              className={`m-0 flex max-w-[62ch] flex-col gap-3 pl-5 ${T_BODY} ${INK_SOFT}`}
            >
              <li>
                <strong className={INK}>Changeset</strong> — every PR touching a
                published package under <code className={CODE}>packages/</code>{" "}
                adds one: <code className={CODE}>bun run changeset</code>. Check
                what would release:{" "}
                <code className={CODE}>bun x changeset status</code>. Docs-only
                and CI-only changes need none. The rules for choosing a bump and
                naming packages are in{" "}
                <a
                  href={blob("docs/conventions/changesets.md")}
                  className={LINK}
                >
                  docs/conventions/changesets.md
                </a>
                .
              </li>
              <li>
                <strong className={INK}>Docs in the same change</strong> — never
                defer. If you changed a component, token, or convention, update
                the matching page: the site (
                <code className={CODE}>apps/site/</code>), the generated
                inventory (
                <code className={CODE}>bun run generate:components</code>), the
                parity tables, or the skill refs. The docs skill (
                <a href={blob(".agents/skills/docs/SKILL.md")} className={LINK}>
                  .agents/skills/docs/SKILL.md
                </a>
                ) says exactly where each change type goes.
              </li>
              <li>
                <strong className={INK}>Lint clean</strong> —{" "}
                <code className={CODE}>bun run lint</code> passes;{" "}
                <code className={CODE}>bun run format</code> fixes. Config:{" "}
                <code className={CODE}>biome.json</code> (lint + format + import
                order).
              </li>
              <li>
                <strong className={INK}>Types and tests pass</strong> —{" "}
                <code className={CODE}>bun run typecheck</code> and{" "}
                <code className={CODE}>bun run test:all</code> (vitest for
                theme/web/icons/start, Jest + React Native Testing Library for
                native).
              </li>
              <li>
                <strong className={INK}>Gates green</strong> —{" "}
                <code className={CODE}>bun run check:kern</code>,{" "}
                <code className={CODE}>bun run check:contrast</code>, and{" "}
                <code className={CODE}>bun run check:publish</code> when you
                touched <code className={CODE}>package.json</code> exports,{" "}
                <code className={CODE}>files</code>, or peers.{" "}
                <code className={CODE}>check:kern</code> is the design law made
                executable, not a formality.
              </li>
              <li>
                <strong className={INK}>Conventional commits</strong> —{" "}
                <code className={CODE}>feat:</code>,{" "}
                <code className={CODE}>fix:</code>,{" "}
                <code className={CODE}>docs:</code>,{" "}
                <code className={CODE}>chore:</code>,{" "}
                <code className={CODE}>refactor:</code>,{" "}
                <code className={CODE}>ci:</code>.
              </li>
              <li>
                <strong className={INK}>Design work</strong> — read{" "}
                <a href={blob(".agents/skills/kern/SKILL.md")} className={LINK}>
                  .agents/skills/kern/SKILL.md
                </a>{" "}
                first. The system law is locked: M3 semantics, unprefixed
                M3-canonical names, hard cuts over deprecation shims, and kern
                stays standalone — no downstream product references anywhere in
                code or docs.
              </li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="adding-a-component" className={`m-0 ${T_SECTION} ${INK}`}>
              Adding a component
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              The full checklist is in{" "}
              <a href={blob("docs/conventions/parity.md")} className={LINK}>
                docs/conventions/parity.md
              </a>{" "}
              and{" "}
              <a href={blob("docs/conventions/stubs.md")} className={LINK}>
                docs/conventions/stubs.md
              </a>
              . Short version: M3-canonical name → implement on the renderer
              family that owns the change → freeze the{" "}
              <code className={CODE}>variant</code> meaning → export from the
              barrel with its props type → tests beside the file → changeset →
              regenerate the inventory → update the parity page.
            </p>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Composition (blocks, scaffolds) belongs in{" "}
              <code className={CODE}>@xoroh/kern/start</code> and stays
              domain-free: auth, routing, and tenancy arrive as props and slots,
              never as dependencies.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="generated-files" className={`m-0 ${T_SECTION} ${INK}`}>
              Generated files
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Never hand-edit these; fix the generator.{" "}
              <code className={CODE}>bun run build</code> runs every generator,
              so a clean build proves they are reproducible.
            </p>
            <pre className="m-0 overflow-x-auto rounded-(--md-sys-shape-corner-large) bg-(--md-sys-color-surface-container-high) p-4 font-mono text-[13px] leading-relaxed text-(--md-sys-color-on-surface)">
              {`packages/kern-tokens/src/tokens.css      bun run generate:tokens
packages/kern-tokens/src/tones.css       bun run generate:tones
packages/kern-tokens/src/motion.css      bun run generate:motion
packages/mcp/src/manifest.ts            bun run generate:components
docs/components.md                      bun run generate:components`}
            </pre>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="flow" className={`m-0 ${T_SECTION} ${INK}`}>
              Flow
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Fork/branch → PR against <code className={CODE}>main</code> →
              review → merge. Versioning and publishing run through the{" "}
              <strong>Version Packages</strong> PR (see{" "}
              <a href={blob("docs/releases.md")} className={LINK}>
                docs/releases.md
              </a>
              ) — never publish by hand. Publishing itself is founder-gated.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="reporting-bugs" className={`m-0 ${T_SECTION} ${INK}`}>
              Reporting bugs
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              Use the repository issue templates (
              <code className={CODE}>.github/ISSUE_TEMPLATE/</code>). For
              security issues, do <strong>not</strong> open a public issue — see{" "}
              <a href={blob("SECURITY.md")} className={LINK}>
                SECURITY.md
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 id="code-of-conduct" className={`m-0 ${T_SECTION} ${INK}`}>
              Code of conduct
            </h2>
            <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
              <a href={blob("CODE_OF_CONDUCT.md")} className={LINK}>
                CODE_OF_CONDUCT.md
              </a>{" "}
              — Contributor Covenant.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
