/**
 * /foundations/icons — the icon law, and the gallery it produces.
 *
 * The page used to be gallery-only, which taught nothing about HOW a glyph
 * gets chosen: slots first, the optional kit second, then the decisions that
 * keep web and mobile from diverging (sizes, currentColor, filled =
 * selected, 48dp targets). The rules here come from
 * `.agents/skills/kern/references/icons.md`; the grid itself is
 * `IconGallery` — counts, names, and glyphs all come from
 * `@xoroh/kern-icons`' own registry at build time, so this route is chrome
 * plus context only.
 */
import { createFileRoute } from "@tanstack/react-router";
import { ICON_SIZE, Icon } from "@xoroh/kern-icons";
import { Kicker } from "../../components/chrome/kicker";
import { IconGallery } from "../../components/icons/icon-gallery";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import {
  T_BODY,
  T_BODY_SM,
  T_CODE,
  T_PAGE,
  T_SECTION,
} from "../../domains/shared/systems/type-scale";
import {
  CARD,
  ICON_BUTTON,
  INK,
  INK_SOFT,
} from "../../domains/shared/systems/ui";

export const Route = createFileRoute("/foundations/icons")({
  head: () =>
    routeHead(
      "Icons",
      "How an icon is chosen, sized and coloured — plus the gallery of every glyph that ships.",
    ),
  component: Icons,
});

const PROSE = `m-0 max-w-[62ch] ${T_BODY} ${INK_SOFT}`;
const TILE = `${CARD} flex flex-col items-center gap-2 p-3`;
const CODE = `font-mono ${T_CODE} ${INK_SOFT}`;

function Icons() {
  return (
    <SiteLayout>
      <PageCard gap={10}>
        <header className="site-docs-welcome flex flex-col gap-3">
          <Kicker className={INK_SOFT}>Icons</Kicker>
          <h1 className={`m-0 ${T_PAGE} ${INK}`}>Icons</h1>
          <p className={PROSE}>
            How kern decides which glyph a surface gets — and below that, the
            searchable gallery of every glyph that ships. The gallery reads
            names and counts from the icon package at build time: the grid
            paints the first 120 for server-render cost, and the filter reaches
            the rest.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 id="slots-first" className={`m-0 ${T_SECTION} ${INK}`}>
            Slots first, the kit second
          </h2>
          <p className={PROSE}>
            Kern components never contain icons. They take a slot —{" "}
            <code className={CODE}>icon?: ReactNode</code> on web and native —
            so any icon library keeps working without installing Kern&apos;s.
            That is the default half of the system.
          </p>
          <p className={PROSE}>
            <code className={CODE}>@xoroh/kern-icons</code> is the optional
            second half: one shared kit so web and mobile cannot diverge. It
            ships normalized filled-path geometry on a 24dp grid, an{" "}
            <code className={CODE}>Icon</code> component with identical props on
            both renderers, and a semantic alias table so one meaning resolves
            to one glyph on every surface:
          </p>
          <ul className="m-0 flex flex-col gap-1 pl-5">
            <li className={T_BODY_SM}>
              <code className={CODE}>&lt;Icon name="search" /&gt;</code> — a
              bare name from the default set.
            </li>
            <li className={T_BODY_SM}>
              <code className={CODE}>&lt;Icon name="back" /&gt;</code> — a
              semantic alias, which resolves to{" "}
              <code className={CODE}>material:arrow-back</code>. The alias is
              the unification table: same meaning, same symbol, every surface.
            </li>
            <li className={T_BODY_SM}>
              <code className={CODE}>
                &lt;Icon name="material:search" /&gt;
              </code>{" "}
              — a qualified name, when a specific set is the point.
            </li>
          </ul>
          <p className={PROSE}>
            A name that does not exist renders nothing and logs one dev warning;
            it never throws during render.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-sizes" className={`m-0 ${T_SECTION} ${INK}`}>
            The size set
          </h2>
          <p className={PROSE}>
            Seven sizes — {Object.values(ICON_SIZE).join(", ")}dp — each with a
            token name. 24 is the default and matches the viewBox 1:1, so it
            renders crisp; 16 and 18 are for dense rows and inline text; 40 and
            48 are display actions. Match the icon to the density of the text
            beside it rather than picking a size in isolation.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {Object.entries(ICON_SIZE).map(([token, dp]) => (
              <div key={token} className={TILE}>
                <Icon name="search" size={dp} />
                <span className={`font-mono ${T_CODE} ${INK_SOFT}`}>
                  {dp} · {token}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-colour" className={`m-0 ${T_SECTION} ${INK}`}>
            Colour follows the role
          </h2>
          <p className={PROSE}>
            An icon paints <code className={CODE}>currentColor</code> by
            default, which means it inherits the colour of whatever it sits in —
            an icon next to body text takes body ink, an icon inside a primary
            action takes primary. When it must be a different role, pass that
            role&apos;s variable, never a hardcoded hex: colour is a theme
            decision, and a literal hex is a theme leak.
          </p>
          <div
            className={`flex flex-wrap items-center gap-6 ${T_BODY_SM} ${INK}`}
          >
            <span className="flex items-center gap-2">
              <Icon name="check" size={24} />
              inherits the text ink
            </span>
            <span className="flex items-center gap-2 text-(--sys-color-primary)">
              <Icon name="check" size={24} />
              var(--sys-color-primary)
            </span>
            <span className="flex items-center gap-2 text-(--sys-color-error)">
              <Icon name="check" size={24} />
              var(--sys-color-error)
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-selected-state" className={`m-0 ${T_SECTION} ${INK}`}>
            Filled means selected
          </h2>
          <p className={PROSE}>
            <code className={CODE}>filled</code> is not decoration — it is
            Material 3&apos;s selection semantics. An outline glyph is the
            resting state; the same glyph filled is the selected or active one.
            Using filled for emphasis is how a list ends up unable to say which
            of its rows is chosen.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className={TILE}>
              <Icon name="favorite" size={32} />
              <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
                outline — resting
              </span>
            </div>
            <div className={TILE}>
              <Icon name="favorite" filled size={32} />
              <span className={`m-0 ${T_BODY_SM} ${INK}`}>
                filled — selected
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-target-size" className={`m-0 ${T_SECTION} ${INK}`}>
            The glyph is 24dp; the target is 48dp
          </h2>
          <p className={PROSE}>
            An icon-only action is a button, and the accessibility floor for a
            button is a 48dp target — the glyph can be smaller, the target
            cannot. It also needs an accessible name:{" "}
            <code className={CODE}>title</code> on the icon when the icon stands
            alone, or <code className={CODE}>aria-label</code> on the control
            when it wraps one. The button below is that law rendered: a 24dp
            glyph on a 48dp target, named for assistive technology, invisible
            until it is hovered or focused.
          </p>
          <div className={`${CARD} flex items-center gap-4 p-4`}>
            <button type="button" aria-label="Search" className={ICON_BUTTON}>
              <Icon name="search" size={24} />
            </button>
            <span className={`m-0 ${T_BODY_SM} ${INK_SOFT}`}>
              24dp glyph · 48dp target · named &ldquo;Search&rdquo;
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-design-rules" className={`m-0 ${T_SECTION} ${INK}`}>
            Design rules
          </h2>
          <ul className="m-0 flex flex-col gap-2 pl-5">
            <li className={T_BODY_SM}>
              <strong className={INK}>One family for UI chrome.</strong>{" "}
              Material Rounded is the chrome set; extra sets are for content,
              branding and expression, not for a second opinion about what
              &ldquo;close&rdquo; looks like.
            </li>
            <li className={T_BODY_SM}>
              <strong className={INK}>Match size and weight to density.</strong>{" "}
              24dp standard, 20dp in dense rows, 40&ndash;48dp for display
              actions — the icon should read as part of the text it sits with.
            </li>
            <li className={T_BODY_SM}>
              <strong className={INK}>Roles, not hexes.</strong> Status and
              action icons take semantic colour roles; category hues come from
              the tone layer. A one-off hex cannot be re-themed.
            </li>
            <li className={T_BODY_SM}>
              <strong className={INK}>Aliases are earned.</strong> Add a
              semantic alias only when a second surface shares the meaning — the
              table is a unification list, not a convenience index.
            </li>
          </ul>
          <p className={PROSE}>
            The whole reading lives in{" "}
            <code className={CODE}>
              .agents/skills/kern/references/icons.md
            </code>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-pipeline" className={`m-0 ${T_SECTION} ${INK}`}>
            How the set ships
          </h2>
          <p className={PROSE}>
            <code className={CODE}>bun run icons:sync</code> fetches a pinned
            upstream, <code className={CODE}>bun run icons:generate</code>{" "}
            regenerates byte-identical code from it, and{" "}
            <code className={CODE}>bun run icons:check</code> is the CI gate:
            standards, set boundary, and regeneration freshness. Generated code
            is committed; a stale tree fails the build. The contract is filled
            outlines on a <code className={CODE}>0 0 24 24</code> viewBox —
            stroke-only sets convert at set-build time or stay in a slot,
            because stroke rendering differs between the DOM and native
            rasterizers.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 id="icon-gallery" className={`m-0 ${T_SECTION} ${INK}`}>
            The gallery
          </h2>
          <p className={PROSE}>
            Every icon that ships, searchable. Filter by a fragment of a name;
            the grid shows the first 120 and the filter reaches the rest.
          </p>
          <IconGallery />
        </section>
      </PageCard>
    </SiteLayout>
  );
}
