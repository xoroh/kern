/**
 * The per-component page — the kern component-page template.
 *
 * SECTION ORDER IS THE DELIVERABLE. The v2 grammar, no other order:
 *
 *   lede → demo → usage → semantic-dom → accessibility → props → tokens
 *   → limitations → faq → spec
 *
 * so the next heading is always the answer to the question the previous one
 * raised: proof it works, when to reach for it, what it renders as, who it
 * works for, what it takes, what it reads, where it stops, what people ask,
 * what the spec says. Source: `src/systems/grammar.ts`, enforced by
 * `scripts/check-grammar.mjs` — a page is checked by a gate, not by eye.
 *
 * CONDITIONAL SECTIONS render only when the content carries them
 * (`src/systems/grammar.ts` predicates — usage, semantic-dom, limitations,
 * faq). A heading with nothing under it is noise, and the convention is to
 * cut it rather than ship one. Everything else always renders, with an honest
 * fallback where the content is not yet written (no demo, no token table,
 * undocumented accessibility) rather than a silent absence.
 */

import { STATE_LAYER_OPACITIES } from "@xoroh/kern-tokens";
import { useEffect, useState } from "react";
import { docForExport, type Platform } from "../../content/index";
import type {
  ComponentDoc,
  Deviation,
  PartRow,
  PropRow,
  RestingElevation,
} from "../../content/types";
import { MOBILE_DEMOS } from "../../demos/mobile/registry";
import { WEB_DEMOS } from "../../demos/web/registry";
import {
  Breadcrumbs,
  type Crumb,
  PlatformTabs,
} from "../../domains/shared/chrome/docs-shell-parts";
import type { A11yPage } from "../../generated/a11y";
import { A11Y } from "../../generated/a11y";
import { PROPS_TABLE } from "../../generated/props-table";
import { Configurator } from "../../showcase/configurator";
import { CopyButton } from "../../showcase/copy-button";
import { ExampleList } from "../../showcase/example";
import {
  CONFIGURATORS,
  configuratorFor,
  examplesFor,
} from "../../showcase/registry";
import {
  hasFaq,
  hasLimitations,
  hasSemanticDom,
  hasUsage,
} from "../../systems/grammar";
import { maturityForExports } from "../../systems/maturity";
import {
  registrySearchHref,
  THEME_CONFIGURATOR_HREF,
} from "../../systems/playground-links";
import { CopyMarkdownButton } from "../chrome/copy-markdown-button";

/**
 * M1 — the page that TEACHES the type scale must USE the type scale.
 *
 * These were ad-hoc Tailwind sizes (text-xl/base/sm/xs, tracking-tight,
 * leading-relaxed), which meant the component reference contradicted the very
 * scale it documents — and it becomes reader-visible the moment the
 * Foundations type page lands beside it. kern ships all 30 styles as
 * --sys-typescale-* (150 vars: family/size/weight/spacing/line-height per
 * style, baseline + emphasized), so every role below resolves from a token.
 *
 * The role names are checked against the generated token set by
 * scripts/check-typescale.mjs — a role that does not exist is a build-time
 * failure, not a silent fallback.
 */
const ts = (role: string) =>
  [
    `[font-family:var(--sys-typescale-${role}-font-family)]`,
    `[font-size:var(--sys-typescale-${role}-font-size)]`,
    `[font-weight:var(--sys-typescale-${role}-font-weight)]`,
    `[line-height:var(--sys-typescale-${role}-line-height)]`,
    `[letter-spacing:var(--sys-typescale-${role}-letter-spacing)]`,
  ].join(" ");

/** Page title. */
const H1 = `site-page-title m-0 text-(--sys-color-on-surface) ${ts("display-small")}`;
/** Section heading — the reader's next question. */
const H2 = `m-0 text-(--sys-color-on-surface) ${ts("headline-small")}`;
/** Sub-heading inside a section. */
const H3 = `m-0 text-(--sys-color-on-surface) ${ts("title-large")}`;
/** Running text. The token carries size, weight AND line-height. */
const INK = "text-(--sys-color-on-surface)";
const INK_SOFT = "text-(--sys-color-on-surface-variant)";
const BODY = `m-0 ${INK_SOFT} ${ts("body-large")}`;
/** Secondary text — one step down the scale, same voice. */
const SMALL = ts("body-small");
/** Micro-labels, tabular annotations, inline literals. */
const TINY = ts("label-small");
/** Field names and small definitions. */
const LABEL = ts("label-medium");
/** The lede under the page title. */
const LEDE = ts("title-medium");
/** Literal code and token ids. Mono is deliberate; the SIZE is on-scale. */
const CODE = `font-mono ${ts("body-small")}`;
/** Keyboard keys. Mono, label weight — they read as pressable literals. */
const KEYCAP = `font-mono ${ts("label-large")}`;
/**
 * Prose measure. Deliberately NOT `leading-relaxed` — the body-large token
 * owns line-height, and a utility on top would silently override it.
 */
const PROSE = `${BODY} max-w-[62ch]`;
/**
 * Metadata chips. Stays monospaced on purpose: these are literal values
 * (package names, token ids, levels) and a code face reads them faster. The
 * SIZE and WEIGHT come from the label role so the chips still sit on the
 * scale rather than floating off it.
 */
const CHIP = `inline-flex items-center gap-1.5 rounded-full border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container) px-3 py-1 font-mono text-(--sys-color-on-surface-variant) [font-size:var(--sys-typescale-label-large-font-size)] [line-height:var(--sys-typescale-label-large-line-height)]`;
const CARD =
  "site-card rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low)";
const TH = `py-2 pr-4 text-left text-(--sys-color-on-surface) ${ts("title-small")}`;
const TD = `py-3 pr-4 align-top ${ts("body-medium")}`;

/**
 * m1 — a stable id and a permalink on every heading.
 *
 * The ids are EXPLICIT, not slugified from the text: a copy-edit that rewords
 * a heading must not silently change its anchor, and Part 3's TOC links into
 * these. A derived id looks stable until someone fixes a typo.
 *
 * The permalink is a real anchor with an accessible name, so the heading is
 * addressable without hunting for the right character to click.
 */
function Heading({
  id,
  level = 2,
  children,
  className = "",
}: {
  id: string;
  level?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id} className={`${level === 2 ? H2 : H3} ${className}`.trim()}>
      {children}
      <a
        href={`#${id}`}
        aria-label={`Permalink to ${id.replace(/-/g, " ")}`}
        className="ml-2 inline-flex items-center text-(--sys-color-on-surface-variant) no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        #
      </a>
    </Tag>
  );
}

/**
 * The elevation chip. FOUR states, kept apart because `check:docs` keeps them
 * apart — collapsing them is how an unbacked claim ends up reading as a
 * measurement.
 *
 *   Level N      a level the elevation table backs
 *   Surface      the component carries no elevation token at all
 *   n/a          no visual form (a pure function or a hook)
 *   ⚠ unbacked   the page CLAIMS a level nothing asserts — a gap, not a fact
 *
 * A gap must never render as a neutral dash: that is how a known hole becomes
 * an invisible one.
 */
function elevationLabel(
  elevation: RestingElevation,
  backed: boolean,
): { text: string; warn: boolean } {
  if (elevation === "none")
    return { text: "n/a (no visual form)", warn: false };
  if (elevation === "surface")
    return { text: "Surface (no elevation token)", warn: false };
  if (!backed)
    return { text: `⚠ unbacked — claimed Level ${elevation}`, warn: true };
  return { text: `Level ${elevation}`, warn: false };
}

/* ---------------------------------------------------------- 1. header */

/**
 * Section 1 — Header + metadata strip. Facts before prose: this is what makes
 * a page read as a reference rather than a blog post.
 */
/**
 * M3-style header links row. One line: state · package · elevation, then
 * reference links (spec ↗ · source ↗ · bundle ↗ · a11y ↗), then copy actions.
 * Replaces the 10-chip description list — facts stay, chrome shrinks to a
 * single wrapping row like MUI's header links.
 */
function HeaderLinks({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const { meta } = doc;
  const elev = elevationLabel(meta.elevation, meta.elevationBacked !== false);
  const maturity = maturityForExports(
    doc.parts,
    platform === "web" ? "web" : "native",
  );
  const state = meta.state ?? maturity?.state;
  const version = meta.version ?? maturity?.version;
  const facts = [state, version, meta.package, `elevation ${elev.text}`].filter(
    Boolean,
  );
  const links: { label: string; href?: string }[] = [
    {
      label: "M3 spec",
      href:
        typeof meta.specUrl === "string" && meta.specUrl !== "none"
          ? meta.specUrl
          : undefined,
    },
    { label: "Source", href: meta.sourceUrl },
    { label: "Bundle", href: meta.bundleUrl },
    { label: "WAI-ARIA", href: meta.apgUrl },
  ];
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${SMALL}`}>
      <span className={INK_SOFT}>{facts.join(" · ")}</span>
      {links.map((l) =>
        l.href ? (
          <a
            key={l.label}
            href={l.href}
            rel="noreferrer"
            target="_blank"
            className="text-(--sys-color-secondary) no-underline hover:underline"
          >
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        ) : null,
      )}
      <CopyMarkdownButton />
    </div>
  );
}

/* ------------------------------------------------- grammar: demo */

/**
 * Grammar slot — Demo. Live, interactive, from the real package. Never a
 * screenshot, never a reimplementation: a demo that restates the component's
 * markup teaches the reader the wrong code. Prove it works before asking
 * anyone to read about it.
 *
 * The section runs proof-first: the live demo, then the state-layer strip
 * (what hover/focus/press look like — states used to exist only as token
 * rows, which do not teach), then installation VISIBLE (the 60-second bar
 * was a collapsed details), then examples and the configurator. The usage
 * Do/Don't cards moved OUT to their own grammar slot (`usage`) so the TOC
 * can see them.
 */
function DemoContent({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const demo = platform === "web" ? WEB_DEMOS : MOBILE_DEMOS;
  const live = demo[doc.parts[0]];
  return live ? (
    live()
  ) : (
    <p className={PROSE}>
      No live demo is registered for <code>{doc.parts[0]}</code>. That is a gap
      in the site, not in the package — it is tracked rather than hidden here.
    </p>
  );
}

function Demo({ doc, platform }: { doc: ComponentDoc; platform: Platform }) {
  return (
    <section className="flex flex-col gap-4" aria-label="Demo">
      <Heading id="demo">Demo</Heading>
      <DemoContent doc={doc} platform={platform} />
      <StatesStrip doc={doc} />
      <PlaygroundLinks doc={doc} platform={platform} />
      <InstallationBlock doc={doc} />
      <ExamplesBlock doc={doc} />
    </section>
  );
}

/**
 * States, taught — the M3 state-layer strip.
 *
 * Before this existed, "states" on a component page meant rows in the token
 * table: a reader could not SEE what hover or press does. This paints the
 * layer law itself (on-surface over the container at the M3 opacities —
 * hover 8%, focus 12%, press 12%, drag 16%, from `STATE_LAYER_OPACITIES` in
 * `@xoroh/kern-tokens`, never retyped here) as swatches next to the live
 * demo, then lists the states this family's own token table registers.
 * The opacities are painted, not asserted: the overlay divs use the theme's
 * `on-surface` role, so dark mode and contrast themes repaint them live.
 *
 * An h3 inside Demo (not a grammar slot): the strip is a lens on the live
 * demo above it, and the grammar's h2 slots stay the page's skeleton.
 */
function StatesStrip({ doc }: { doc: ComponentDoc }) {
  const registered = [
    ...new Set((doc.tokens ?? []).map((row) => row.state.trim())),
  ].filter((s) => s.length > 0 && s !== "resting");
  const layers: { label: string; opacity: number }[] = [
    { label: "Rest", opacity: 0 },
    { label: "Hover", opacity: STATE_LAYER_OPACITIES.hover },
    { label: "Focus", opacity: STATE_LAYER_OPACITIES.focus },
    { label: "Press", opacity: STATE_LAYER_OPACITIES.press },
    { label: "Drag", opacity: STATE_LAYER_OPACITIES.drag },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Heading id="states" level={3}>
        States
      </Heading>
      <div className="flex flex-wrap gap-2">
        {layers.map((layer) => (
          <div key={layer.label} className="flex flex-col items-center gap-1">
            <span
              aria-hidden="true"
              className="relative block h-10 w-16 overflow-hidden rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface)"
            >
              <span
                className="absolute inset-0"
                style={{
                  backgroundColor: "var(--sys-color-on-surface)",
                  opacity: layer.opacity,
                }}
              />
            </span>
            <span className={`${TINY} ${INK_SOFT}`}>{layer.label}</span>
          </div>
        ))}
      </div>
      <p className={PROSE}>
        State layers are {""}
        <code>on-surface</code> at 8% hover, 12% focus, 12% press and 16% drag
        over the container — never a color swap.{" "}
        <a
          className="text-(--sys-color-secondary) underline underline-offset-2"
          href="/foundations/m3/states"
        >
          How states work
        </a>
        .
      </p>
      {registered.length > 0 ? (
        <p
          className={`m-0 flex flex-wrap items-center gap-1.5 ${SMALL} ${INK_SOFT}`}
        >
          <span>This family registers:</span>
          {registered.map((state) => (
            <span key={state} className={CHIP}>
              {state}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Registry → playground wiring, rendered. Every registry entry opens in the
 * playground: the search route is keyed by export name, so it resolves this
 * family's root export to this page. The theme configurator link renders on
 * web pages only — the configurator repaints the web token layer, and a link
 * from a native page would promise a native repaint it cannot keep.
 */
function PlaygroundLinks({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const exportName = doc.parts[0];
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${SMALL}`}>
      <a
        className="text-(--sys-color-secondary) no-underline hover:underline"
        href={registrySearchHref(exportName)}
      >
        Open in playground <span aria-hidden="true">↗</span>
      </a>
      {platform === "web" ? (
        <a
          className="text-(--sys-color-secondary) no-underline hover:underline"
          href={THEME_CONFIGURATOR_HREF}
        >
          Theme configurator <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </div>
  );
}

/* The position-2 "Kern vs Material 3" compare was folded into the deviations
 * slot (Spec, below): its left cell re-rendered the Demo's own live demo, and
 * its right cell restated the deviation rows. The one element with no home
 * there — the "Read the M3 spec" link — moved into Spec.
 */

/* ------------------------------------------------- installation (in demo) */

/**
 * Installation, as an h3 inside Demo. The "60-second bar": the fastest path
 * from landing here to running the thing. Derived entirely from the metadata
 * strip, so it can never drift from what the page already claims.
 */
/**
 * The name you can actually `npm i`.
 *
 * `meta.package` is an IMPORT PATH — `@xoroh/kern/start` — because that is
 * what the code on the page needs to say. But npm installs PACKAGES, not
 * subpaths: `npm i @xoroh/kern/start` is rejected outright. On the 7
 * kern-start pages the Installation section was rendering a command that
 * cannot run, which breaks the single most important 60 seconds on the page.
 *
 * Scoped names keep two segments (`@scope/name`); everything else keeps one.
 * The import line must keep the subpath — so this is derived separately and
 * only where an install is meant.
 */
function installTarget(pkg: string): string {
  const segments = pkg.split("/");
  return pkg.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

/**
 * Install picker (Part 8, Mantine pattern). The package-manager tabs switch
 * the install command; the choice persists per browser. No `kern add` mode:
 * the CLI is v0.0.0 and unpublished (verified 404 on the registry), so a tab
 * instructing `npx kern add` would teach a failing command. When the CLI
 * publishes, the mode belongs here beside these four.
 */
const MANAGERS = [
  { id: "npm", label: "npm", command: (t: string) => `npm i ${t}` },
  { id: "bun", label: "bun", command: (t: string) => `bun add ${t}` },
  { id: "pnpm", label: "pnpm", command: (t: string) => `pnpm add ${t}` },
  { id: "yarn", label: "yarn", command: (t: string) => `yarn add ${t}` },
] as const;

type ManagerId = (typeof MANAGERS)[number]["id"];

function InstallPicker({ target }: { target: string }) {
  const [manager, setManager] = useState<ManagerId>("npm");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("kern-pkg-manager");
      if (stored && MANAGERS.some((m) => m.id === stored)) {
        setManager(stored as ManagerId);
      }
    } catch {
      // Private mode / SSR: default npm stands.
    }
  }, []);
  function choose(id: ManagerId) {
    setManager(id);
    try {
      window.localStorage.setItem("kern-pkg-manager", id);
    } catch {
      // Choice still applies for the session.
    }
  }
  const command =
    MANAGERS.find((m) => m.id === manager)?.command(target) ??
    `npm i ${target}`;
  return (
    <div className={`${CARD} flex flex-col gap-2 p-4`}>
      {/* biome-ignore lint/a11y/useSemanticElements: a package-manager picker group is not a form fieldset */}
      <div
        role="group"
        aria-label="Package manager"
        className="flex flex-wrap gap-1.5"
      >
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={manager === m.id}
            onClick={() => choose(m.id)}
            className={`min-h-12 rounded-(--sys-shape-corner-full) border px-4 ${SMALL} ${
              manager === m.id
                ? "border-(--sys-color-primary) bg-(--sys-color-primary-container) text-(--sys-color-on-primary-container)"
                : "border-(--sys-color-outline) text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-on-surface)/8"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <pre className={`m-0 flex-1 overflow-x-auto ${CODE} ${INK}`}>
          <code>{command}</code>
        </pre>
        <CopyButton text={command} />
      </div>
      <p className={`m-0 ${SMALL} text-(--sys-color-on-surface-variant)`}>
        Preview: packages are unpublished — this resolves from a checkout until
        0.1.0 publishes.
      </p>
    </div>
  );
}

function InstallationBlock({ doc }: { doc: ComponentDoc }) {
  const pkg = doc.meta.package;
  const target = installTarget(pkg);
  const importStatement = `import { ${doc.parts[0]} } from "${pkg}";`;
  // VISIBLE, not a collapsed details: the 60-second bar (get it running)
  // must not hide behind a click. MUI and shadcn both show install on
  // arrival; a details here made the fastest path on the page the slowest.
  return (
    <div className="flex flex-col gap-2">
      <Heading id="installation" level={3}>
        Installation
      </Heading>
      <p className={PROSE}>
        Every export on this page ships in <code>{target}</code> and is imported
        from <code>{pkg}</code>. There is no per-component install.
      </p>
      <InstallPicker target={target} />
      <div className={`${CARD} flex flex-col gap-2 p-4`}>
        <div className="flex items-center gap-2">
          <pre className={`m-0 flex-1 overflow-x-auto ${CODE} ${INK}`}>
            <code>{importStatement}</code>
          </pre>
          <CopyButton text={importStatement} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------- grammar: semantic DOM */

/**
 * Grammar slot — Semantic DOM. The mental model before the contract: the
 * part names introduced here are what every later section refers to, and the
 * ARIA roles are what assistive tech actually gets. Anatomy and contract are
 * one section because they describe the same tree — what it is called and
 * what it means.
 *
 * Conditional (grammar predicate `hasSemanticDom`): a page that states
 * neither half has no DOM semantics to document.
 */
function SemanticDom({ doc }: { doc: ComponentDoc }) {
  const rows = doc.anatomy ?? [];
  const aria = doc.aria ?? [];
  if (rows.length === 0 && aria.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="semantic-dom">Semantic DOM</Heading>
      <p className={PROSE}>
        What this family renders as — the parts it is built from and the roles
        assistive tech is handed.
      </p>
      {rows.length > 0 ? (
        <>
          <Heading id="anatomy" level={3}>
            Anatomy
          </Heading>
          <ul className="m-0 flex flex-col gap-2">
            {rows.map((part, index) => (
              <AnatomyRow key={part.name} part={part} index={index} />
            ))}
          </ul>
        </>
      ) : null}
      {aria.length > 0 && (
        <>
          <Heading id="contract" level={3}>
            Roles
          </Heading>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {aria.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/**
 * One anatomy part, numbered — the M3 anatomy figure's honest web form.
 * Every family gets the numbered callout rhythm (1. Container, 2. Label…)
 * without an invented SVG of geometry the data does not carry: the number
 * orders the tree, the name is the part id, the role is what it does.
 */
function AnatomyRow({ part, index }: { part: PartRow; index: number }) {
  return (
    <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span
        aria-hidden="true"
        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) ${TINY}`}
      >
        {index + 1}
      </span>
      <code
        className={`shrink-0 font-mono ${SMALL} text-(--sys-color-secondary)`}
      >
        {part.name}
      </code>
      <span className={`${SMALL} ${INK_SOFT}`}>{part.role}</span>
    </li>
  );
}

/* ------------------------------------------------- usage (in lede + demo) */

/**
 * The features prose is the ONLY section allowed to persuade, and persuasion
 * belongs in the lede: it renders in the page header under the one-liner, not
 * as a section of its own. (The old "Usage" h2 was the features paragraph
 * plus these cards; the paragraph moved up, the cards moved into Demo.)
 *
 * Part 3b note, preserved: content authors still write this as `features`,
 * and the anchor stays `#features` nowhere — the lede carries no heading, so
 * there is no anchor to keep. Deep links to `#features` resolve against the
 * page top instead; nothing in the repo links there (verified when the
 * section moved — check-headings would fail a straggler).
 */

/**
 * Grammar slot — Usage, its own top-level section (v2). The Do/Don't cards
 * used to close Demo as nested h3s, where the "On this page" rail could not
 * see them — M3's Guidelines pattern demoted to a subsection. Now Usage is
 * an h2 slot with the cards inside, so every reader lands on the contrast
 * that is the argument for reaching for this component at all.
 *
 * Conditional via `hasUsage(doc)`: a page with no written rule cuts the
 * section (the template applies the shared predicate, never an inline
 * condition of its own).
 */
function Usage({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="flex flex-col gap-4">
      <Heading id="usage">Usage</Heading>
      <p className={PROSE}>
        When to reach for this family — the M3 Guidelines pattern: every rule as
        a Do and a Don&rsquo;t, side by side, so the contrast is the argument.
      </p>
      <WhenToUse doc={doc} />
    </section>
  );
}

/**
 * Do/Don't cards — the M3 Guidelines pattern, and the clearest way to state a
 * usage rule: the two sit side by side so the contrast is the argument.
 *
 * m2 — a half-pair used to return `null`, which made a written rule vanish
 * silently. Now the written half renders with a visible note about the
 * missing one, and `check:docs` reports the half-pair. A rule that exists is
 * never hidden; a rule that is incomplete says so.
 */
function WhenToUse({ doc }: { doc: ComponentDoc }) {
  const use = doc.usage;
  if (!use) return null;
  const hasDo = use.do.length > 0;
  const hasDont = use.dont.length > 0;
  if (!hasDo && !hasDont) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {hasDo ? (
        <div className={`${CARD} p-4`}>
          <Heading id="do" level={3}>
            <span className="text-(--sys-color-secondary)" aria-hidden="true">
              ✓
            </span>{" "}
            Do
          </Heading>
          <ul
            className={`m-0 mt-2 flex list-disc flex-col gap-2 pl-5 ${SMALL} ${INK_SOFT}`}
          >
            {use.do.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {hasDont ? (
        <div className={`${CARD} p-4`}>
          <Heading id="dont" level={3}>
            <span className="text-(--sys-color-error)" aria-hidden="true">
              ✕
            </span>{" "}
            Don&rsquo;t
          </Heading>
          <ul
            className={`m-0 mt-2 flex list-disc flex-col gap-2 pl-5 ${SMALL} ${INK_SOFT}`}
          >
            {use.dont.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {!hasDo || !hasDont ? (
        <div className={`${CARD} p-4`}>
          <p className={`m-0 ${SMALL} ${INK_SOFT}`}>
            This rule is one-sided: the {hasDo ? "Don’t" : "Do"} half is not
            written yet.{" "}
            {hasDo
              ? "A Do without a Don’t leaves the reader to guess the boundary."
              : "A Don’t without a Do states what to avoid but not what to do instead."}{" "}
            The gap is reported by the docs gate rather than hidden here.
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------- examples (in demo) */

/**
 * Examples, as an h3 inside Demo: the reasoning-carrying companions to the
 * live demo — each example shows the component doing one job, with the why
 * attached. Conditional like Anatomy: pages without registered examples
 * render no subsection, rather than an empty promise.
 */
function ExamplesBlock({ doc }: { doc: ComponentDoc }) {
  const examples = doc.parts.flatMap((part) => examplesFor(part));
  // First registered configurator across the family's parts, if any —
  // flagships only, so most pages see nothing here.
  const configurator = doc.parts
    .map((part) => configuratorFor(part))
    .find((c) => c !== undefined);
  if (examples.length === 0 && !configurator) return null;
  return (
    <>
      <Heading id="examples" level={3}>
        Examples
      </Heading>
      {configurator ? <Configurator spec={configurator} /> : null}
      {!configurator && examples.length > 0 ? (
        <p className={SMALL}>
          Interactive knob panels ship for a flagship subset only (
          {Object.keys(CONFIGURATORS).length} components) — knobs are a teaching
          extra, not the contract. Every component carries live demos and
          examples regardless.
        </p>
      ) : null}
      <ExampleList examples={examples} />
    </>
  );
}

/* ------------------------------------------------- grammar: tokens */

/**
 * Grammar slot — Tokens, the auto-token contract. Where "strict M3" becomes visible
 * per component: which tokens it consumes, at what resting elevation, with
 * which shape. Generated where the token module can supply the table,
 * transcribed where it cannot — and where neither exists yet, the section
 * falls back to stating the resting elevation, which is always true. A
 * heading over nothing is noise; a fallback sentence is not.
 */
/**
 * Token kind detection for the visual showcase. M3 token names encode their
 * kind: color roles reference `--sys-color-*`, shapes reference corner
 * tokens or carry px radii, elevations reference levels, type references
 * typescale roles, and opacities carry percentages. Unknown rows fall back
 * to the table.
 */
type TokenKind = "color" | "shape" | "elevation" | "type" | "opacity" | "other";

function tokenKindOf(row: { token: string; value: string }): TokenKind {
  const hay = `${row.token} ${row.value}`.toLowerCase();
  if (
    hay.includes("--sys-color-") ||
    hay.includes("primary") ||
    hay.includes("secondary") ||
    hay.includes("tertiary") ||
    hay.includes("surface") ||
    hay.includes("error") ||
    hay.includes("outline") ||
    hay.includes("inverse")
  )
    return "color";
  if (
    hay.includes("corner") ||
    hay.includes("shape") ||
    hay.includes("radius") ||
    hay.includes("9999px") ||
    /\b\d+px\b/.test(hay)
  )
    return "shape";
  if (
    hay.includes("elevation") ||
    hay.includes("level") ||
    hay.includes("shadow")
  )
    return "elevation";
  if (
    hay.includes("typescale") ||
    hay.includes("label-large") ||
    hay.includes("body-") ||
    hay.includes("font") ||
    hay.includes("tracking") ||
    hay.includes("line-height")
  )
    return "type";
  if (hay.includes("%") || hay.includes("opacity")) return "opacity";
  return "other";
}

/** Resolve a color-role value to a CSS color for swatch painting. */
function swatchStyle(value: string): React.CSSProperties | undefined {
  const m = value.match(/--sys-color-[a-z-]+/);
  if (m) return { backgroundColor: `var(${m[0]})` };
  const hex = value.match(/#[0-9a-fA-F]{3,8}\b/);
  if (hex) return { backgroundColor: hex[0] };
  return undefined;
}

/** Resolve a radius value for shape previews. */
function radiusStyle(value: string): React.CSSProperties | undefined {
  if (value.includes("9999px")) return { borderRadius: "9999px" };
  const m = value.match(/(\d+)px/);
  if (m) return { borderRadius: `${m[1]}px` };
  const token = value.match(/--sys-shape-corner-[a-z-]+/);
  if (token) return { borderRadius: `var(${token[0]})` };
  return undefined;
}

/** Resolve an elevation level for shadow previews. */
function elevationStyle(value: string): React.CSSProperties | undefined {
  const m = value.match(/level([0-5])/);
  if (m) return { boxShadow: `var(--sys-elevation-level${m[1]})` };
  if (value.toLowerCase().includes("level")) return {};
  return undefined;
}

/**
 * Visual token showcase — M3 shows tokens as swatches, shapes, shadows, and
 * specimens, not as a wall of text. Rows group by detected kind; each card
 * paints the value it names. The full table follows inside a disclosure for
 * the exact token strings.
 */
function TokenShowcase({
  tokens,
}: {
  tokens: NonNullable<ComponentDoc["tokens"]>;
}) {
  const groups = new Map<TokenKind, typeof tokens>();
  for (const row of tokens) {
    const kind = tokenKindOf(row);
    const list = groups.get(kind) ?? [];
    list.push(row);
    groups.set(kind, list);
  }
  const order: TokenKind[] = ["color", "shape", "elevation", "type", "opacity"];
  const shown = order.filter((k) => (groups.get(k)?.length ?? 0) > 0);
  if (shown.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      {shown.map((kind) => (
        <div key={kind} className="flex flex-col gap-2">
          <p
            className={`m-0 ${LABEL} text-(--sys-color-on-surface-variant) uppercase`}
          >
            {kind === "color"
              ? "Colors"
              : kind === "shape"
                ? "Shapes"
                : kind === "elevation"
                  ? "Elevation"
                  : kind === "type"
                    ? "Typography"
                    : "State layers"}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {(groups.get(kind) ?? []).map((row) => (
              <div
                key={`${row.element}-${row.state}-${row.token}`}
                className={`flex flex-col gap-1.5 rounded-(--sys-shape-corner-medium) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-low) p-3`}
              >
                {kind === "color" ? (
                  <span
                    aria-hidden="true"
                    className="h-10 w-full rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant)"
                    style={swatchStyle(row.value)}
                  />
                ) : null}
                {kind === "shape" ? (
                  <span
                    aria-hidden="true"
                    className="h-10 w-full bg-(--sys-color-secondary-container)"
                    style={radiusStyle(row.value)}
                  />
                ) : null}
                {kind === "elevation" ? (
                  <span
                    aria-hidden="true"
                    className="h-10 w-full rounded-(--sys-shape-corner-small) bg-(--sys-color-surface)"
                    style={elevationStyle(row.value)}
                  />
                ) : null}
                {kind === "type" ? (
                  <span
                    aria-hidden="true"
                    className={`text-(--sys-color-on-surface) ${ts("label-large")}`}
                  >
                    Ag
                  </span>
                ) : null}
                {kind === "opacity" ? (
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-full items-center justify-center rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)"
                  >
                    <span
                      className="h-6 w-6 rounded-full bg-(--sys-color-primary)"
                      style={{
                        opacity: row.value.match(/(\d+)%/)?.[1]
                          ? Number(row.value.match(/(\d+)%/)?.[1]) / 100
                          : undefined,
                      }}
                    />
                  </span>
                ) : null}
                <span className={`${TINY} text-(--sys-color-on-surface)`}>
                  {row.element}
                </span>
                <span
                  className={`${TINY} text-(--sys-color-on-surface-variant)`}
                >
                  {row.state} · <code>{row.token}</code>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Theming({ doc }: { doc: ComponentDoc }) {
  const tokens = doc.tokens;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="tokens">Tokens</Heading>
      <p className={PROSE}>
        What this component reads from the theme. Change the token and every
        instance changes — that is the point of the token layer.
      </p>
      {tokens && tokens.length > 0 ? (
        <>
          <TokenShowcase tokens={tokens} />
          <details className="group">
            <summary
              className={`cursor-pointer ${LABEL} text-(--sys-color-on-surface-variant) uppercase`}
            >
              Full token table
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className={`w-full border-collapse ${SMALL}`}>
                <thead>
                  <tr className="border-b border-(--sys-color-outline-variant)">
                    <th className={TH}>Element</th>
                    <th className={TH}>State</th>
                    <th className={TH}>Token</th>
                    <th className={TH}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((row) => (
                    <tr
                      key={`${row.element}-${row.state}-${row.token}`}
                      className="border-b border-(--sys-color-outline-variant)"
                    >
                      <td className={TD}>{row.element}</td>
                      <td
                        className={`${TD} text-(--sys-color-on-surface-variant)`}
                      >
                        {row.state}
                      </td>
                      <td
                        className={`${TD} font-mono text-(--sys-color-primary) [font-size:var(--sys-typescale-label-small-font-size)] [line-height:var(--sys-typescale-label-small-line-height)]`}
                      >
                        {row.token}
                      </td>
                      <td
                        className={`${TD} font-mono text-(--sys-color-on-surface-variant) [font-size:var(--sys-typescale-label-small-font-size)] [line-height:var(--sys-typescale-label-small-line-height)]`}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <p className={PROSE}>
          No per-component token table is generated for this one yet. Its
          resting elevation is{" "}
          <strong className="text-(--sys-color-on-surface)">
            {
              elevationLabel(
                doc.meta.elevation,
                doc.meta.elevationBacked !== false,
              ).text
            }
          </strong>
          .
        </p>
      )}
      <Customization doc={doc} />
    </section>
  );
}

/**
 * Customization's supported half, folded into Tokens. The "not supported"
 * half is the point of the Limitations section and lives there — one home
 * per half, so the boundary reads in exactly one place.
 */
function Customization({ doc }: { doc: ComponentDoc }) {
  const custom = doc.customization;
  if (!custom) return null;
  return (
    <div className="flex flex-col gap-3">
      <Heading id="customization" level={3}>
        Customization
      </Heading>
      <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
        {custom.supported.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
/**
 * Per-demo axe expectations (Part 7). One entry per demo (export): the rule,
 * whether axe should pass/gap/fail it, and the provenance mark that keeps
 * generated-vs-authored from blurring. The measured:false line is the whole
 * honesty model — no axe runner exists in this repo, so these are stated
 * expectations to run axe against, not results. Renders in BOTH Accessibility
 * branches: a page with no written contract is exactly where
 * machine-readable gaps matter most.
 */
function DemoExpectations({ page }: { page: A11yPage | undefined }) {
  if (!page) return null;
  const names = Object.keys(page.demos);
  if (names.length === 0) return null;
  // Design verdict on Part 7: identical content must not render identically
  // N times (dialog repeated the same two sentences 7×). Group key is
  // rule+expect+provenance ON PURPOSE — the basis names its own export, so
  // keying on full objects would never merge. The shared block renders each
  // row once with the basis widened to the whole group (replace the single
  // noun with the member list when present, else the row as-is): the
  // conjunction is true because every member's own file asserts its own
  // clause. A demo with unique expectations (e.g. an authored exception)
  // renders alone. Single-demo pages skip the grouping header — noise.
  const groups: { names: string[]; sig: string }[] = [];
  for (const name of names) {
    const sig = JSON.stringify(
      page.demos[name].expectations.map((e) => [
        e.rule,
        e.expect,
        e.provenance,
      ]),
    );
    const g = groups.find((x) => x.sig === sig);
    if (g) g.names.push(name);
    else groups.push({ names: [name], sig });
  }
  const grouped = names.length > 1;
  return (
    <>
      <Heading id="demo-expectations" level={3}>
        Per-demo expectations
      </Heading>
      <p className={PROSE}>
        What axe should report against each live demo — expectations, not
        measurements. Nothing here was observed in a browser; run axe against
        the demo to measure. Entries marked derived restate a claim this page
        already makes (the basis names it); entries marked authored record new
        human judgment.
      </p>
      <ul className={`m-0 flex flex-col gap-3 pl-5 ${BODY}`}>
        {groups.map((g) => {
          const demo = page.demos[g.names[0]];
          const liveCount = g.names.filter(
            (n) => page.demos[n].hasLiveDemo,
          ).length;
          return (
            <li key={g.names.join(",")}>
              <strong>{g.names.join(", ")}</strong>{" "}
              <span className={SMALL}>
                {liveCount === 0
                  ? "(no live demo — nothing to run axe against)"
                  : grouped && g.names.length > 1
                    ? "(shared expectations — applies to all listed)"
                    : "(live demo)"}
              </span>
              {demo.expectations.length > 0 && (
                <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5">
                  {demo.expectations.map((e) => {
                    const basis =
                      grouped &&
                      g.names.length > 1 &&
                      e.basis.includes(g.names[0])
                        ? e.basis.replace(g.names[0], g.names.join(", "))
                        : e.basis;
                    return (
                      <li key={`${e.rule}-${e.expect}`} className={SMALL}>
                        {e.rule} — {e.expect} ({e.provenance}): {basis}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* -------------------------------------------- grammar: accessibility */

/**
 * Grammar slot — Accessibility. The keyboard contract plus the Part 7
 * per-demo expectations. The ARIA contract lives in Semantic DOM (it
 * describes the rendered tree) and known gaps live in Limitations (they are
 * boundaries) — this section states behaviour, not vocabulary or caveats.
 */
function Accessibility({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const a11y = A11Y[`${platform}/${doc.slug}`];
  const keyboard = doc.keyboard;
  const hasContent = !!keyboard?.length;

  // M2 — the section never silently vanishes. A reader cannot tell "this is
  // covered" from "nobody wrote it", and before this the trust section was
  // absent on every page that had no content yet. Three states, two of which
  // are the empty case, and they are different claims:
  //
  //   content      documented, render it
  //   nonInteractive  a FACT — no keyboard, no ARIA state; say so briefly
  //   (otherwise)     a GAP — interactive and undocumented; say THAT
  if (!hasContent) {
    return (
      <section className="flex flex-col gap-4">
        <Heading id="accessibility">Accessibility</Heading>
        <p className={PROSE}>
          {doc.nonInteractive
            ? "Not applicable. This is a non-interactive part — it takes no focus, has no keyboard interaction and exposes no ARIA state of its own, so there is no behaviour to contract for. Anything it does for assistive technology comes from the primitives it renders."
            : "Not yet documented. This component is interactive, so it does have keyboard and ARIA behaviour — the contract just has not been written up here yet. Treat this section as a gap, not as an absence of requirements."}
        </p>
        <DemoExpectations page={a11y} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Heading id="accessibility">Accessibility</Heading>

      {keyboard?.length ? (
        <>
          <Heading id="keyboard" level={3}>
            Keyboard
          </Heading>
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${SMALL}`}>
              <thead>
                <tr className="border-b border-(--sys-color-outline-variant)">
                  <th className={`${TH} w-40`}>Key</th>
                  <th className={TH}>Action</th>
                </tr>
              </thead>
              <tbody>
                {keyboard.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-(--sys-color-outline-variant)"
                  >
                    <td className={TD}>
                      <kbd
                        className={`rounded border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-high) px-1.5 py-0.5 ${KEYCAP} text-(--sys-color-on-surface)`}
                      >
                        {row.key}
                      </kbd>
                    </td>
                    <td
                      className={`${TD} text-(--sys-color-on-surface-variant)`}
                    >
                      {row.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <DemoExpectations page={a11y} />
    </section>
  );
}

/* -------------------------------------------- grammar: limitations */

/**
 * Grammar slot — Limitations. The honest boundary: what this family does
 * NOT do, stated so nobody discovers it by accident. Three sources, one home:
 * unsupported customization (moved out of Tokens), known accessibility gaps
 * (moved out of Accessibility), and the grammar-exemption notice for pages
 * that cannot meet the strict order.
 *
 * Conditional (grammar predicate `hasLimitations`).
 */
function Limitations({ doc }: { doc: ComponentDoc }) {
  const notSupported = doc.customization?.notSupported ?? [];
  const gaps = doc.accessibilityGaps ?? [];
  const exempt = doc.grammarExempt?.trim();
  if (notSupported.length === 0 && gaps.length === 0 && !exempt) return null;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="limitations">Limitations</Heading>
      <p className={PROSE}>
        What this family does not do — stated here so nobody falls into the trap
        of hunting for it.
      </p>
      {exempt ? (
        <p className={PROSE}>
          <strong className="text-(--sys-color-on-surface)">
            Grammar exemption:
          </strong>{" "}
          {exempt}
        </p>
      ) : null}
      {notSupported.length > 0 && (
        <>
          <Heading id="not-supported" level={3}>
            Not supported
          </Heading>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {notSupported.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}
      {gaps.length > 0 && (
        <div className="rounded-(--sys-shape-corner-medium) border border-(--sys-color-error) bg-(--sys-color-error-container) p-4">
          <Heading
            id="known-gaps"
            level={3}
            className="text-(--sys-color-on-error-container)"
          >
            Known gaps
          </Heading>
          <ul
            className={`m-0 mt-2 flex list-disc flex-col gap-2 pl-5 ${SMALL} text-(--sys-color-on-error-container)`}
          >
            {gaps.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* --------------------------------------------------- grammar: faq */

/**
 * Grammar slot — FAQ. Questions readers actually ask, answered in the
 * page's own facts. Conditional (grammar predicate `hasFaq`): an invented
 * FAQ is fabrication, so pages with nothing real to answer render no
 * section rather than a reassuring one.
 */
function Faq({ doc }: { doc: ComponentDoc }) {
  const rows = doc.faq ?? [];
  if (rows.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="faq">FAQ</Heading>
      <div className="flex flex-col gap-1">
        {rows.map((row) => (
          <details
            key={row.q}
            className="group rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-low) px-3 py-2"
          >
            <summary className={`cursor-pointer list-none ${SMALL} ${INK}`}>
              {row.q}
            </summary>
            <p className={`m-0 mt-1 ${SMALL} ${INK_SOFT}`}>{row.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/**
 * Grammar slot — Spec. The kern signature, last: strict to the Material 3
 * spec by default, and every departure declared with a registered id so it
 * can be audited rather than discovered.
 */
function Conformance({ doc }: { doc: ComponentDoc }) {
  const rows = doc.deviations;
  const specUrl = doc.meta.specUrl;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="spec">Spec</Heading>
      <p className={PROSE}>
        Strict to Material 3 by default. Anything below is a deliberate kern
        decision, registered with an id so it can be audited rather than
        discovered.
      </p>
      {specUrl && specUrl !== "none" ? (
        <p className={PROSE}>
          <a
            className="text-(--sys-color-secondary) underline underline-offset-2"
            href={specUrl}
            rel="noreferrer"
            target="_blank"
          >
            Read the M3 spec
          </a>
        </p>
      ) : null}
      <p className={CHIP}>{conformanceLine(doc)}</p>
      {!rows || rows.length === 0 ? (
        <p className={PROSE}>
          {doc.meta.specUrl === "none"
            ? "No Material 3 source — this is a kern extension."
            : doc.meta.specUrl
              ? "No registered deviations from the Material 3 spec."
              : "Material 3 source not recorded for this page yet."}
        </p>
      ) : (
        <ul className="m-0 flex flex-col gap-4">
          {rows.map((row) => (
            <DeviationRow key={row.id} row={row} />
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * The conformance status line. States only what is CHECKABLE — a count of
 * variant axes is an inventory fact, not a conformance signal, and it already
 * renders honestly in the metadata strip above. Deviation IDS are rendered,
 * not counts: an id is auditable, a number is not.
 */
function conformanceLine(doc: ComponentDoc): string {
  const elev = elevationLabel(
    doc.meta.elevation,
    doc.meta.elevationBacked !== false,
  );
  const ids = (doc.deviations ?? []).map((row) => row.id);
  // m5 — this line is READ, not parsed. "deviations: none" and "elevation:
  // Level 2" are the vocabulary of the gate that produced them; a reader
  // landing on the Material 3 conformance section does not know what a
  // deviation is yet. Say what the fact means, and only then name the ids
  // that make it auditable.
  return [
    `Resting elevation: ${elev.text}`,
    ids.length
      ? `Deliberate kern departures from Material 3: ${ids.join(", ")}`
      : "No registered departures from Material 3",
  ].join(" · ");
}

function DeviationRow({ row }: { row: Deviation }) {
  return (
    <li className={`${CARD} flex flex-col gap-2 p-4`}>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full bg-(--sys-color-secondary-container) px-2.5 py-0.5 font-mono text-(--sys-color-on-secondary-container) [font-size:var(--sys-typescale-label-small-font-size)] [line-height:var(--sys-typescale-label-small-line-height)]`}
        >
          {row.id}
        </span>
      </div>
      <dl className="m-0 grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr]">
        <dt className={`m-0 ${LABEL} ${INK}`}>Material 3</dt>
        <dd className={`m-0 ${SMALL} ${INK_SOFT}`}>{row.spec}</dd>
        <dt className={`m-0 ${LABEL} ${INK}`}>kern</dt>
        <dd className={`m-0 ${SMALL} ${INK_SOFT}`}>{row.kern}</dd>
        <dt className={`m-0 ${LABEL} ${INK}`}>Why</dt>
        <dd className={`m-0 ${SMALL} ${INK_SOFT}`}>{row.why}</dd>
      </dl>
    </li>
  );
}

/* ------------------------------------------------- grammar: props */

/**
 * Grammar slot — Props (reference, after the teaching sections). Reference up front, not last: readers arrive here
 * from search and anchors, and what a component takes is the first question
 * after seeing it work.
 *
 * Part 3d — the Props slot reads Part 0. Names, types, required flags and
 * defaults come from PROPS_TABLE (compiler-extracted, per-row src provenance
 * in props.ts); the `note` — what a prop *implies* — stays hand-authored in
 * content and merges by name. check-props enforces the name agreement, so the
 * merge can neither drop a documented row silently nor invent one.
 *
 * Two fallbacks, both stated in the render: an export the extractor does not
 * cover (mobile, unresolvable type) renders its hand rows; content rows the
 * gate deems curated (`type`, `ref`, `className` — known, not extracted)
 * render with their hand values inside a covered part. Only names NOTHING
 * carries are absent from the page, and check-props fails those at the
 * baseline ratchet instead of the page hiding them.
 */
type ApiRow = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  note?: string;
};

function toRow(r: PropRow): ApiRow {
  return {
    name: r.name,
    type: r.type,
    required: r.required ?? false,
    default: r.default,
    note: r.note,
  };
}

/**
 * One part's rows: generated rows with content notes merged in, then the
 * curated hand rows the extractor never emits. Returns null when the part
 * contributes nothing at all — the caller falls back to hand rows.
 */
function partRows(part: string, content: PropRow[]): ApiRow[] | null {
  const slot = PROPS_TABLE[part];
  if (!slot || (slot.rows.length === 0 && slot.curated.length === 0)) {
    return null;
  }
  const contentByName = new Map(content.map((r) => [r.name, r]));
  const rows: ApiRow[] = slot.rows.map((g) => ({
    name: g.name,
    type: g.type,
    required: g.required,
    default: g.default,
    note: contentByName.get(g.name)?.note,
  }));
  for (const name of slot.curated) {
    const c = contentByName.get(name);
    if (c && !rows.some((r) => r.name === name)) rows.push(toRow(c));
  }
  return rows;
}

/**
 * Collapsible prop rows (Base UI pattern): the summary shows name + type +
 * default at a glance; expanding reveals the notes. A 20-prop table becomes
 * a scannable list instead of a wall. The full table follows in a disclosure
 * for copy-paste and screen-reader table navigation.
 */
function PropRows({ rows }: { rows: ApiRow[] }) {
  return (
    <div className="flex flex-col gap-1">
      {rows.map((row) => (
        <details
          key={row.name}
          className="group rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-low) px-3 py-2"
        >
          <summary
            className={`flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1 ${SMALL}`}
          >
            <code className="font-mono text-(--sys-color-on-surface)">
              {row.name}
            </code>
            {row.required ? (
              <span className={`${TINY} text-(--sys-color-error)`}>
                required
              </span>
            ) : null}
            <code
              className={`font-mono text-(--sys-color-on-surface-variant) ${TINY}`}
            >
              {row.type}
            </code>
            <span
              className={`ml-auto font-mono text-(--sys-color-on-surface-variant) ${TINY}`}
            >
              {row.default ?? "—"}
            </span>
          </summary>
          {row.note ? (
            <p className={`m-0 mt-1 ${SMALL} ${INK_SOFT}`}>{row.note}</p>
          ) : null}
        </details>
      ))}
    </div>
  );
}

function PropTable({ rows, caption }: { rows: ApiRow[]; caption?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {caption ? (
        <p className={`m-0 ${LABEL} ${INK}`}>
          <code className="font-mono">{caption}</code>
        </p>
      ) : null}
      <PropRows rows={rows} />
      <details className="group">
        <summary
          className={`cursor-pointer ${LABEL} text-(--sys-color-on-surface-variant) uppercase`}
        >
          Full table
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className={`w-full border-collapse text-left ${SMALL}`}>
            <thead>
              <tr className="border-b border-(--sys-color-outline-variant)">
                <th className={TH}>Prop</th>
                <th className={TH}>Type</th>
                <th className={TH}>Default</th>
                <th className={TH}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-(--sys-color-outline-variant)"
                >
                  <td className={TD}>
                    <code className="font-mono text-(--sys-color-on-surface)">
                      {row.name}
                    </code>
                    {row.required && (
                      <span className={`ml-2 ${TINY} text-(--sys-color-error)`}>
                        required
                      </span>
                    )}
                  </td>
                  <td
                    className={`${TD} font-mono text-(--sys-color-on-surface-variant) [font-size:var(--sys-typescale-label-small-font-size)] [line-height:var(--sys-typescale-label-small-line-height)]`}
                  >
                    {row.type}
                  </td>
                  <td
                    className={`${TD} font-mono text-(--sys-color-on-surface-variant) [font-size:var(--sys-typescale-label-small-font-size)] [line-height:var(--sys-typescale-label-small-line-height)]`}
                  >
                    {row.default ?? "—"}
                  </td>
                  <td className={`${TD} ${SMALL} ${INK_SOFT}`}>
                    {row.note ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function ApiReference({ doc }: { doc: ComponentDoc }) {
  const covered = doc.parts.some(
    (part) => (PROPS_TABLE[part]?.rows.length ?? 0) > 0,
  );
  if (!covered) {
    // No generated coverage for any part on this page: the hand table,
    // exactly the old render. Nothing documented is lost for lack of
    // machinery (mobile pages live here until native extraction exists).
    return (
      <section className="flex flex-col gap-4">
        <Heading id="props">Props</Heading>
        <PropTable rows={doc.api.map(toRow)} />
      </section>
    );
  }
  const multi = doc.parts.length > 1;
  return (
    <section className="flex flex-col gap-4">
      <Heading id="props">Props</Heading>
      {doc.parts.map((part) => {
        const rows = partRows(part, doc.api);
        if (!rows || rows.length === 0) {
          // Covered family, uncovered part (unresolvable type): hand rows
          // filtered to names this part is known to carry, or the whole
          // family table when nothing is known — duplication in a rare
          // corner beats silent loss, and check-props still gates the names.
          const known = new Set([
            ...(PROPS_TABLE[part]?.rows.map((r) => r.name) ?? []),
            ...(PROPS_TABLE[part]?.curated ?? []),
          ]);
          const hand =
            known.size > 0 ? doc.api.filter((r) => known.has(r.name)) : doc.api;
          if (hand.length === 0) return null;
          return (
            <PropTable
              key={part}
              rows={hand.map(toRow)}
              caption={multi ? part : undefined}
            />
          );
        }
        return (
          <PropTable
            key={part}
            rows={rows}
            caption={multi ? part : undefined}
          />
        );
      })}
    </section>
  );
}

/* ------------------------------------------------------- 11. footer */

/**
 * Section 11 — Footer. Navigation plus the affordances that make a docs page
 * a work surface rather than a dead end: edit it, and say whether it helped.
 */
/**
 * M4 — "Edit on GitHub" must point at the DOCS CONTENT FILE, not the
 * component source. They are different files, and conflating them sent
 * readers to `packages/kern/src/components/button.tsx` when they clicked
 * "Edit on GitHub" on a documentation page.
 *
 * The path is DERIVED from the platform and slug, so it cannot drift the way
 * 190 hand-written URLs would. `check:docs` asserts the derived file exists
 * on disk — a derived link to a file that is not there is exactly the class
 * of defect this replaces.
 *
 * `meta.editUrl` overrides it for the handful of pages whose content does not
 * live at the conventional path (the family/aggregate pages).
 */
const GITHUB = "https://github.com/xoroh/kern";
const REPO_BRANCH = "main";

function editUrlFor(doc: ComponentDoc, platform: Platform): string {
  if (doc.meta.editUrl) return doc.meta.editUrl;
  return `${GITHUB}/edit/${REPO_BRANCH}/apps/site/src/content/${platform}/${doc.slug}.ts`;
}

/**
 * The feedback mechanism. "Is this page helpful?" with no way to answer is
 * worse than no question — it asks for effort the reader cannot spend. The
 * answer is a prefilled issue: one click, and the page identity is already in
 * the body so nobody has to copy a URL to report a problem.
 */
function feedbackUrlFor(doc: ComponentDoc, platform: Platform): string {
  const title = `[docs] ${doc.name} (${platform})`;
  const body = [
    `**Page:** ${doc.slug} (${platform})`,
    ``,
    `**What is wrong or missing:**`,
    ``,
    ``,
    `---`,
    `Filed from the docs page footer.`,
  ].join("\n");
  return `${GITHUB}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
function Footer({
  doc,
  platform,
  prev,
  next,
}: {
  doc: ComponentDoc;
  platform: Platform;
  /** m4 — href AND title travel together so the link names the page it goes to. */
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  return (
    <footer className="flex flex-col gap-4 border-t border-(--sys-color-outline-variant) pt-6">
      <nav
        className="flex items-stretch justify-between gap-4"
        aria-label="Pages"
      >
        {prev ? (
          <a
            className={`${CARD} flex-1 p-4 ${SMALL} ${INK} no-underline`}
            href={prev.href}
          >
            ← {prev.title}
          </a>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <a
            className={`${CARD} flex-1 p-4 text-right ${SMALL} ${INK} no-underline`}
            href={next.href}
          >
            {next.title} →
          </a>
        ) : (
          <span className="flex-1" />
        )}
      </nav>

      <div className={`flex flex-wrap items-center gap-4 ${SMALL}`}>
        {/*
          M4 — both targets are usable and they are DIFFERENT files:
          "Edit this page" goes to the docs content file, "Component source"
          goes to the code the page documents. Conflating them sent readers
          editing a .tsx when they meant to fix a sentence.
        */}
        <a
          className="text-(--sys-color-secondary) underline underline-offset-2"
          href={editUrlFor(doc, platform)}
          rel="noreferrer"
          target="_blank"
        >
          Edit this page
        </a>
        {doc.meta.sourceUrl ? (
          <a
            className="text-(--sys-color-secondary) underline underline-offset-2"
            href={doc.meta.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Component source
          </a>
        ) : null}
        {/*
          The feedback question now has an ANSWER MECHANISM. Asking "Is this
          page helpful?" with nowhere to reply asks for effort the reader
          cannot spend — the prefilled issue is the answer.
        */}
        <a
          className="text-(--sys-color-secondary) underline underline-offset-2"
          href={feedbackUrlFor(doc, platform)}
          rel="noreferrer"
          target="_blank"
        >
          Report a problem with this page
        </a>
        {/*
          Part 8 freshness: owner + last real review, rendered ONLY when the
          content records it. No line is the honest state for 192 unfilled
          pages — a footer-wide "unreviewed" stamp would punish pages whose
          content is fine but whose review was never recorded as an event.
        */}
        {doc.meta.freshness ? (
          <span className={INK_SOFT}>
            Reviewed {doc.meta.freshness.reviewed} · {doc.meta.freshness.owner}
          </span>
        ) : null}
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------- page */

/**
 * The page. Article only — the right TOC ("On this page") lives in the
 * site layout's three-column docs shell, not here. Sections render in the
 * grammar's order and no other order (lede → demo → props → tokens →
 * semantic-dom → accessibility → limitations → faq → spec).
 */
export function ComponentPage({
  doc,
  platform,
  prev,
  next,
}: {
  doc: ComponentDoc;
  platform: Platform;
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  // Docs-shell chrome (P8): the trail and the platform switcher. The switcher
  // navigates the peer page and remembers the reader's platform; a family
  // with no peer renders no switcher (a tab that goes nowhere is a lie).
  const peerPlatform: Platform = platform === "web" ? "mobile" : "web";
  const peerDoc = doc.meta.nativePeer
    ? docForExport(peerPlatform, doc.meta.nativePeer)
    : undefined;
  const crumbs: Crumb[] = [
    { label: "Components", href: "/components" },
    {
      label: platform === "web" ? "Web" : "React Native",
      href: platform === "web" ? "/components/web" : "/components/mobile",
    },
    { label: doc.name },
  ];
  const platformTabs = [
    {
      id: "web",
      label: "Web",
      href: `/components/web/${platform === "web" ? doc.slug : (peerDoc?.slug ?? "")}`,
    },
    {
      id: "mobile",
      label: "React Native",
      href: `/components/mobile/${platform === "mobile" ? doc.slug : (peerDoc?.slug ?? "")}`,
    },
  ];
  return (
    <article className="flex min-w-0 flex-col gap-14" data-copy-md-root>
      <header className="flex flex-col gap-3">
        <Breadcrumbs items={crumbs} />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className={H1}>{doc.name}</h1>
          {peerDoc ? (
            <PlatformTabs tabs={platformTabs} active={platform} />
          ) : null}
        </div>
        <p className={`m-0 max-w-[62ch] ${LEDE} ${INK_SOFT}`}>{doc.oneLiner}</p>
        <details className="group">
          <summary
            className={`cursor-pointer ${LABEL} text-(--sys-color-on-surface-variant) uppercase`}
          >
            About
          </summary>
          <p className={`mt-2 ${PROSE}`}>{doc.features}</p>
        </details>
        <HeaderLinks doc={doc} platform={platform} />
      </header>

      {/* lede above; then the v2 grammar, in order */}
      <Demo doc={doc} platform={platform} />
      {hasUsage(doc) ? <Usage doc={doc} /> : null}
      {hasSemanticDom(doc) ? <SemanticDom doc={doc} /> : null}
      <Accessibility doc={doc} platform={platform} />
      <ApiReference doc={doc} />
      <Theming doc={doc} />
      {hasLimitations(doc) ? <Limitations doc={doc} /> : null}
      {hasFaq(doc) ? <Faq doc={doc} /> : null}
      <Conformance doc={doc} />

      <Footer doc={doc} platform={platform} prev={prev} next={next} />
    </article>
  );
}
