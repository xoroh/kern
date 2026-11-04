/**
 * Block viewer — one block: title, install toolbar, Preview/Code, prev/next.
 *
 * The Code tab is the block's real source (`?raw`), the same bytes `kern add`
 * vendors — so the fence cannot describe a block that does not install. The
 * install command and the npm peers come from the manifest entry, which
 * `check-blocks` proves matches the imports in that source.
 *
 * Preview chrome (D1003/D1004 step 6): the width is a real dimension, not
 * three presets — preset buttons (Desktop / Tablet / Phone) and a slider
 * share one `width` state, and the frame follows the width (phone frame
 * under 500px, tablet frame under 900px, full-bleed above). Same web render
 * in every frame: blocks are web-only until native variants land
 * (steps 9-10), so there is no renderer toggle to fake. Density rides the
 * theme presets in Studio (compact shape scale); a per-preview density
 * toggle would fake a control consumers cannot reproduce, so there isn't
 * one — revisit when blocks take density props.
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

const INK = "text-(--sys-color-on-surface)";
const INK_SOFT = "text-(--sys-color-on-surface-variant)";
const LINK = "text-(--sys-color-secondary)";
/**
 * Dependency chip: CARD's container expression (surface fill + outline-variant
 * hairline) at pill radius — same hairline as the cards around it, so a chip
 * never introduces a second, stronger stroke.
 */
const CHIP = `inline-flex items-center rounded-(--sys-shape-corner-full) border border-(--sys-color-outline-variant) bg-(--sys-color-surface) px-3 py-1 ${T_CODE} ${INK}`;

const TABLET_PX = 768;
const PHONE_PX = 375;
const MIN_PX = 320;
const MAX_PX = 1100;

export function BlockViewer({
  view,
  prev,
  next,
}: {
  view: BlockView;
  prev?: BlockView;
  next?: BlockView;
}) {
  const [width, setWidth] = useState<number | "full">("full");
  const spec: ExampleSpec = {
    id: view.entry.name,
    title: view.entry.title,
    description: view.entry.description,
    render: view.render,
    code: view.code,
  };
  const px = width === "full" ? null : width;
  const frame =
    px !== null && px < 500
      ? "rounded-[3rem] border border-(--sys-color-outline-variant) bg-(--sys-color-surface) p-3 pt-8"
      : px !== null && px < 900
        ? "rounded-[2rem] border border-(--sys-color-outline-variant) bg-(--sys-color-surface) p-3"
        : "";
  const readout = width === "full" ? "Full width" : `${width}px`;
  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p
          className={`m-0 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
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
          className={`inline-flex items-center gap-2 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high) px-3 py-1.5 ${T_CODE} ${INK}`}
        >
          {installCommand(view.entry.name)}
        </code>
        <CopyButton text={installCommand(view.entry.name)} label="Copy" />
        {/*
          Viewport switch — preset buttons (Desktop / Tablet / Phone) and a
          width slider sharing one state: buttons jump, the slider drags.
          48dp pill targets (MIN_TARGET floor) on the one outlined
          container; the selected segment wears the selected pair.
        */}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <span
            className={`font-mono ${T_BODY_SM} ${INK_SOFT}`}
            aria-live="polite"
          >
            {readout}
          </span>
          <input
            type="range"
            min={MIN_PX}
            max={MAX_PX}
            step={8}
            value={px ?? MAX_PX}
            onChange={(e) => setWidth(Number(e.target.value))}
            aria-label="Preview width in pixels"
            className="w-36 cursor-pointer accent-(--sys-color-primary)"
          />
          <div className="flex items-center gap-1 rounded-(--sys-shape-corner-full) border border-(--sys-color-outline-variant) p-0.5">
            {(
              [
                { id: "full", label: "Desktop" },
                { id: TABLET_PX, label: "Tablet" },
                { id: PHONE_PX, label: "Phone" },
              ] as const
            ).map((v) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setWidth(v.id)}
                aria-pressed={width === v.id}
                className={`inline-flex min-h-12 cursor-pointer items-center rounded-(--sys-shape-corner-full) px-4 ${T_LABEL_LG} ${TRANSITION} ${
                  width === v.id ? PILL_ACTIVE : PILL_REST
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
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

      <div className="mx-auto w-full">
        <div
          className={`mx-auto w-full transition-[max-width] ease-(--sys-motion-easing-standard) [transition-duration:var(--sys-motion-duration-short3)] ${frame}`}
          style={px !== null ? { maxWidth: px } : undefined}
        >
          <Example spec={spec} />
        </div>
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
            to="/blocks/$block"
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
            to="/blocks/$block"
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
