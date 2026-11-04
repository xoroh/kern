/**
 * /blocks — the Blocks domain index: real blocks, installable as a unit
 * (D1003/D1004; moved from /showcase, which 301s here).
 *
 * A block is a composed section living in `apps/site/src/blocks/`, rendered
 * here live and vendored whole by `kern add <block>`. The catalog shows the
 * live block, its category, and its install command; each card links to the
 * per-block page with the Preview/Code tabs and the full dependency list.
 * Templates and example apps are still planned — stated as planned, never
 * previewed as if they existed.
 *
 * Category navigation is a sidebar rail on desktop and the M3 filter-chip
 * row below it on smaller viewports — one `category` state behind both, so
 * the two controls cannot disagree.
 */
import { Link } from "@tanstack/react-router";
import { cn } from "@xoroh/kern";
import { Icon } from "@xoroh/kern-icons";
import { useState } from "react";
import { BLOCK_CATEGORIES, type BlockCategory } from "../../blocks/manifest";
import { Kicker } from "../../components/chrome/kicker";
import { TierTabs } from "../../components/docs/component-gallery";
import { CopyButton } from "../../showcase/copy-button";
import { PageCard } from "../shared/chrome/page-card";
import { SiteLayout } from "../shared/chrome/site-layout";
import {
  T_BODY,
  T_BODY_SM,
  T_CODE,
  T_LABEL,
  T_LABEL_LG,
  T_PAGE,
  T_SECTION,
} from "../shared/systems/type-scale";
import {
  CARD,
  FOCUS_RING,
  INK,
  INK_SOFT,
  STAGE,
  STATE_LAYERS,
  TRANSITION,
} from "../shared/systems/ui";
import { BLOCK_VIEWS, installCommand } from "./registry";

const STILL_PLANNED = [
  {
    title: "Templates",
    body: "Full starter apps (web + native) showing the system wired end to end: theming, navigation, and forms. The `kern init` scaffold is the start of this; the templates are not shipped yet.",
  },
  {
    title: "Example apps",
    body: "Small complete apps demonstrating one concern well — e.g. a settings app for theming, a checkout flow for forms. Not built yet.",
  },
];

type Category = BlockCategory | "All";

export function BlocksIndex() {
  const [category, setCategory] = useState<Category>("All");
  const categories = ["All", ...BLOCK_CATEGORIES] as const;
  const filtered =
    category === "All"
      ? BLOCK_VIEWS
      : BLOCK_VIEWS.filter((v) => v.entry.category === category);
  return (
    <SiteLayout>
      <PageCard width="wide" gap={12}>
        <header className="site-docs-welcome flex flex-col gap-3">
          <Kicker className={INK_SOFT}>Blocks</Kicker>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Blocks</h1>
          <p className={`m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`}>
            Live composed sections. Install with{" "}
            <code className={T_CODE}>kern add</code>.
          </p>
          <TierTabs active="blocks" />
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          <CategoryRail
            categories={categories}
            active={category}
            onPick={setCategory}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <CategoryChips
              categories={categories}
              active={category}
              onPick={setCategory}
            />
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
              {filtered.map((view) => (
                <article
                  key={view.entry.name}
                  className={`flex min-w-0 flex-col gap-4 ${CARD} p-6`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className={`m-0 ${T_LABEL} ${INK_SOFT} uppercase`}>
                        {view.entry.category}
                      </p>
                      <h2
                        id={`block-${view.entry.name}`}
                        className={`m-0 ${T_SECTION} ${INK}`}
                      >
                        <Link
                          to="/blocks/$block"
                          params={{ block: view.entry.name }}
                          className="no-underline hover:underline"
                        >
                          {view.entry.title}
                        </Link>
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <code
                        className={`inline-flex items-center rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high) px-3 py-1.5 ${T_CODE} ${INK}`}
                      >
                        {installCommand(view.entry.name)}
                      </code>
                      <CopyButton
                        text={installCommand(view.entry.name)}
                        label="Copy"
                      />
                    </div>
                  </div>
                  <p className={`m-0 max-w-[62ch] ${T_BODY_SM} ${INK_SOFT}`}>
                    {view.entry.description}
                  </p>
                  <div
                    className={`flex flex-wrap items-center justify-center gap-4 p-8 ${STAGE}`}
                  >
                    {view.render()}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 id="still-planned" className={`m-0 ${T_SECTION} ${INK}`}>
            Still planned
          </h2>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {STILL_PLANNED.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-1 rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) p-5"
              >
                <p className={`m-0 ${T_BODY} ${INK}`}>
                  <strong>{item.title}</strong> — planned, not yet built.
                </p>
                <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>{item.body}</p>
              </li>
            ))}
          </ul>
          <p className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
            Patterns (recurring product shapes that point at component pages)
            live under{" "}
            <Link
              to="/blocks/patterns"
              className="text-(--sys-color-secondary) no-underline hover:underline"
            >
              /blocks/patterns
            </Link>
            .
          </p>
        </div>
      </PageCard>
    </SiteLayout>
  );
}

/**
 * Category rail: the Blocks domain's category sidebar (desktop). A vertical
 * list with counts; the active category carries the selected container.
 * Hidden below lg, where the chip row takes over (same state, no second
 * source of truth).
 */
function CategoryRail({
  categories,
  active,
  onPick,
}: {
  categories: readonly Category[];
  active: Category;
  onPick: (c: Category) => void;
}) {
  const countFor = (c: Category) =>
    c === "All"
      ? BLOCK_VIEWS.length
      : BLOCK_VIEWS.filter((v) => v.entry.category === c).length;
  return (
    <nav
      aria-label="Block categories"
      className="hidden w-56 shrink-0 lg:block"
    >
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {categories.map((c) => {
          const isActive = active === c;
          return (
            <li key={c}>
              <button
                type="button"
                onClick={() => onPick(c)}
                aria-pressed={isActive}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-(--sys-shape-corner-medium) px-4 py-2.5 text-left",
                  T_LABEL_LG,
                  STATE_LAYERS,
                  TRANSITION,
                  FOCUS_RING,
                  isActive
                    ? "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container)"
                    : "text-(--sys-color-on-surface-variant)",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {isActive ? <Icon name="check" size={18} /> : null}
                  {c}
                </span>
                <span className={T_BODY_SM}>{countFor(c)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * M3 filter chips (m3-usable/components/chips.md): 32dp container, 8dp
 * corner, 18dp leading check when selected, outline-variant stroke at rest,
 * secondary-container/on-secondary-container when selected. The 48dp touch
 * floor is met by the ::after hit-area expansion (-inset-y-2) rather than by
 * inflating the 32dp container — the same trick the package's own Chip uses.
 * Rendered below lg only; the rail owns desktop.
 */
function CategoryChips({
  categories,
  active,
  onPick,
}: {
  categories: readonly Category[];
  active: Category;
  onPick: (c: Category) => void;
}) {
  return (
    <nav
      aria-label="Block categories"
      className="flex flex-wrap gap-x-3 gap-y-4 lg:hidden"
    >
      {categories.map((c) => {
        const isActive = active === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onPick(c)}
            aria-pressed={isActive}
            className={cn(
              "relative inline-flex h-8 cursor-pointer items-center gap-2 rounded-(--sys-shape-corner-small) border select-none after:absolute after:-inset-y-2 after:inset-x-0 after:content-['']",
              T_LABEL_LG,
              STATE_LAYERS,
              TRANSITION,
              FOCUS_RING,
              isActive
                ? "border-transparent bg-(--sys-color-secondary-container) px-2 text-(--sys-color-on-secondary-container)"
                : "border-(--sys-color-outline-variant) px-4 text-(--sys-color-on-surface-variant)",
            )}
          >
            {isActive ? <Icon name="check" size={18} /> : null}
            {c}
          </button>
        );
      })}
    </nav>
  );
}
