/**
 * Block viewer — one block: title, install toolbar, Preview/Code, prev/next.
 *
 * The Code tab is the block's real source (`?raw`), the same bytes `kern add`
 * vendors — so the fence cannot describe a block that does not install. The
 * install command and the npm peers come from the manifest entry, which
 * `check-blocks` proves matches the imports in that source.
 */
import { Link } from "@tanstack/react-router";
import { CopyButton } from "../../showcase/copy-button";
import { Example, type ExampleSpec } from "../../showcase/example";
import { Admonition } from "../shared/chrome/docs-shell-parts";
import { T_BODY_SM, T_LABEL_LG, T_PAGE } from "../shared/systems/type-scale";
import { type BlockView, installCommand } from "./registry";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const CHIP = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border px-3 py-1 ${T_LABEL_LG}`;

export function BlockViewer({
  view,
  prev,
  next,
}: {
  view: BlockView;
  prev?: BlockView;
  next?: BlockView;
}) {
  const spec: ExampleSpec = {
    id: view.entry.name,
    title: view.entry.title,
    description: view.entry.description,
    render: view.render,
    code: view.code,
  };
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p
          className={`m-0 ${T_LABEL_LG} text-(--md-sys-color-on-surface-variant) uppercase`}
        >
          {view.entry.category}
        </p>
        <h1 className={`m-0 ${T_PAGE} ${INK}`}>{view.entry.title}</h1>
        <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
          {view.entry.description}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <code
          className={`inline-flex items-center gap-2 rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-high) px-3 py-1.5 ${T_BODY_SM} ${INK}`}
        >
          {installCommand(view.entry.name)}
        </code>
        <CopyButton text={installCommand(view.entry.name)} label="Copy" />
      </div>

      <div className="flex flex-col gap-2">
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          npm peers the block imports:{" "}
          {view.entry.dependencies.map((dep) => (
            <code key={dep} className={CHIP}>
              {dep}
            </code>
          ))}
        </p>
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          kern exports it renders:{" "}
          {view.entry.registryDependencies.map((dep) => (
            <code key={dep} className={CHIP}>
              {dep}
            </code>
          ))}
        </p>
      </div>

      <Example spec={spec} />

      <Admonition intent="note" title="You own the code">
        <code>kern add</code> vendors these files into your tree — they are
        yours to edit and keep (Mode 1). Prefer <code>bun add @xoroh/kern</code>{" "}
        (Mode 2) when you want upgrades to flow from the package instead.
      </Admonition>

      <nav
        className="flex items-center justify-between gap-4"
        aria-label="Blocks"
      >
        {prev ? (
          <Link
            to="/showcase/$block"
            params={{ block: prev.entry.name }}
            className={`no-underline ${T_BODY_SM} ${INK}`}
          >
            ← {prev.entry.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/showcase/$block"
            params={{ block: next.entry.name }}
            className={`no-underline ${T_BODY_SM} ${INK}`}
          >
            {next.entry.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
