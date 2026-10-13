/**
 * Block viewer — one block: title, install toolbar, Preview/Code, prev/next.
 *
 * The Code tab is the block's real source (`?raw`), the same bytes `kern add`
 * vendors — so the fence cannot describe a block that does not install. The
 * install command and the npm peers come from the manifest entry, which
 * `check-blocks` proves matches the imports in that source.
 */
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CopyButton } from "../../showcase/copy-button";
import { Example, type ExampleSpec } from "../../showcase/example";
import { Admonition } from "../shared/chrome/docs-shell-parts";
import {
  T_BODY_SM,
  T_CODE,
  T_LABEL,
  T_LABEL_LG,
  T_PAGE,
} from "../shared/systems/type-scale";
import { PILL_ACTIVE, PILL_REST, TRANSITION } from "../shared/systems/ui";
import { type BlockView, installCommand } from "./registry";

const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
const LINK = "text-(--md-sys-color-secondary)";
/**
 * Dependency chip: CARD's container expression (surface fill + outline-variant
 * hairline) at pill radius — same hairline as the cards around it, so a chip
 * never introduces a second, stronger stroke.
 */
const CHIP = `inline-flex items-center rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) px-3 py-1 ${T_CODE} ${INK}`;

export function BlockViewer({
  view,
  prev,
  next,
}: {
  view: BlockView;
  prev?: BlockView;
  next?: BlockView;
}) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "phone">(
    "desktop",
  );
  const spec: ExampleSpec = {
    id: view.entry.name,
    title: view.entry.title,
    description: view.entry.description,
    render: view.render,
    code: view.code,
  };
  const viewportMax =
    viewport === "phone"
      ? "max-w-[375px]"
      : viewport === "tablet"
        ? "max-w-[768px]"
        : "";
  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p
          className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
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
          className={`inline-flex items-center gap-2 rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface-container-high) px-3 py-1.5 ${T_CODE} ${INK}`}
        >
          {installCommand(view.entry.name)}
        </code>
        <CopyButton text={installCommand(view.entry.name)} label="Copy" />
        {/*
          Viewport switch — a pill row of 48dp targets (MIN_TARGET floor) on
          the one outlined container; selected segment wears the selected
          pair, the rest carry the state layers.
        */}
        <div className="ml-auto flex items-center gap-1 rounded-(--md-sys-shape-corner-full) border border-(--md-sys-color-outline-variant) p-0.5">
          {(["desktop", "tablet", "phone"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setViewport(v)}
              aria-pressed={viewport === v}
              className={`inline-flex min-h-12 cursor-pointer items-center rounded-(--md-sys-shape-corner-full) px-4 ${T_LABEL_LG} ${TRANSITION} ${
                viewport === v ? PILL_ACTIVE : PILL_REST
              }`}
            >
              {v === "desktop"
                ? "Desktop"
                : v === "tablet"
                  ? "Tablet"
                  : "Phone"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          npm peers the block imports:{" "}
          <span className="inline-flex flex-wrap gap-1.5 align-middle">
            {view.entry.dependencies.map((dep) => (
              <code key={dep} className={CHIP}>
                {dep}
              </code>
            ))}
          </span>
        </p>
        <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
          kern exports it renders:{" "}
          <span className="inline-flex flex-wrap gap-1.5 align-middle">
            {view.entry.registryDependencies.map((dep) => (
              <code key={dep} className={CHIP}>
                {dep}
              </code>
            ))}
          </span>
        </p>
      </div>

      <div
        className={`mx-auto w-full transition-[max-width] ease-(--md-sys-motion-easing-standard) [transition-duration:var(--md-sys-motion-duration-short3)] ${viewportMax}`}
      >
        <Example spec={spec} />
      </div>

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
            className={`no-underline hover:underline ${T_BODY_SM} ${LINK}`}
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
            className={`no-underline hover:underline ${T_BODY_SM} ${LINK}`}
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
