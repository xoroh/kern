/**
 * The per-component page — the kern component-page template.
 *
 * SECTION ORDER IS THE DELIVERABLE. The one standard, no other order:
 *
 *   lede → demo → example → props → accessibility → limitations → spec
 *   → customization
 *
 * so the next heading is always the answer to the question the previous one
 * raised: proof it works, the code that uses it, what it takes, how it reads
 * to assistive tech, where it stops, what the spec says, what you may change.
 * Source: `src/systems/grammar.ts`, enforced by `scripts/check-grammar.mjs` —
 * a page is checked by a gate, not by eye.
 *
 * THE TEACHING HALF MOVED OUT (ADR-115). `features`, the usage Do/Don't,
 * the token table, the FAQ, the deviations and the anatomy were GUIDANCE, not
 * reference: they live in `docs/m3-guidance/<family>.md` now, one file per
 * family, and the header links there exactly once. What stays on the page is
 * the reference a reader cannot get anywhere else — the live demo, the coded
 * example, the props, the accessibility contract, the boundaries, the spec
 * link and the escape hatch.
 *
 * CONDITIONAL SECTIONS render only when the content carries them
 * (limitations: a known accessibility gap or the grammar-exemption notice;
 * customization: a real extension surface). A heading with nothing under it
 * is noise, and the convention is to cut it rather than ship one. Everything
 * else always renders, with an honest fallback where the content is not yet
 * written (no demo, no coded example, undocumented accessibility) rather than
 * a silent absence.
 */

import { STATE_LAYER_OPACITIES } from "@xoroh/kern-tokens";
import type { Platform } from "../../content/index";
import type {
  ComponentDoc,
  PropRow,
  RestingElevation,
} from "../../content/types";
import { useDemoRegistries, useShowcaseRegistry } from "../../demos/lazy";
import {
  Breadcrumbs,
  type Crumb,
  PlatformTabs,
  savePlatformChoice,
} from "../../domains/shared/chrome/docs-shell-parts";
import { TRANSITION } from "../../domains/shared/systems/ui";
import type { A11yPage } from "../../generated/a11y";
import { A11Y } from "../../generated/a11y";
import { PROPS_TABLE } from "../../generated/props-table";
import { Configurator } from "../../showcase/configurator";
import { CopyButton } from "../../showcase/copy-button";
import { ExampleList } from "../../showcase/example";
import { hasCustomization, hasLimitations } from "../../systems/grammar";
import { maturityForExports } from "../../systems/maturity";
import {
  registrySearchHref,
  THEME_CONFIGURATOR_HREF,
} from "../../systems/playground-links";
import { CopyMarkdownButton } from "../chrome/copy-markdown-button";
import { HighlightedCode } from "./highlight";
import { InstallTabs } from "./install-tabs";

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
const CHIP = `inline-flex items-center gap-1.5 rounded-full bg-(--sys-color-surface-container-high) px-3 py-1 font-mono text-(--sys-color-on-surface-variant) [font-size:var(--sys-typescale-label-large-font-size)] [line-height:var(--sys-typescale-label-large-line-height)]`;
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
        className={`ml-2 inline-flex items-center text-(--sys-color-on-surface-variant) no-underline opacity-0 ${TRANSITION} group-hover:opacity-100 focus-visible:opacity-100`}
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
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${SMALL}`}>
      <span className={`${INK_SOFT}`}>{facts.join(" · ")}</span>
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
      <CopyMarkdownButton platform={platform} />
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
 * was a collapsed details). The coded examples and the configurator have
 * their own slot (`example`) — a reader looking for "how do I write this"
 * must find them in the page's skeleton, not nested under a demo.
 */
function DemoContent({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  // Demo registries arrive async (see `demos/lazy`): the web registry pulls
  // every web demo and the mobile registry pulls `@xoroh/kern-native`, so
  // neither belongs in this route chunk. Only the ACTIVE tab's side loads —
  // a web-tab page never downloads the native renderer. SSR and prerender
  // emit the fixed-height skeleton below; the client swaps in the live demo
  // (or the honest gap text) when the chunk lands.
  const mods = useDemoRegistries(platform);
  const demoMap =
    platform === "web" ? mods.web?.WEB_DEMOS : mods.mobile?.MOBILE_DEMOS;
  if (!demoMap) {
    return (
      <div
        className="flex min-h-64 flex-col items-center justify-center gap-2"
        aria-hidden="true"
      >
        <div className="h-8 w-2/3 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)" />
        <div className="h-8 w-1/2 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)" />
      </div>
    );
  }
  const live = demoMap[doc.parts[0]];
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
    <section className="flex flex-col gap-5" aria-label="Demo">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Heading id="demo">Demo</Heading>
        <PlaygroundLinks doc={doc} platform={platform} />
      </div>
      <DemoContent doc={doc} platform={platform} />
      <StatesStrip doc={doc} />
      <InstallationBlock doc={doc} platform={platform} />
    </section>
  );
}

/**
 * States, taught — the M3 state-layer strip.
 *
 * Before this existed, "states" on a component page meant rows in the token
 * table: a reader could not SEE what hover or press does. This paints the
 * layer law itself (on-surface over the container at the M3 opacities —
 * hover 8%, focus 10%, press 10%, drag 16%, from `STATE_LAYER_OPACITIES` in
 * `@xoroh/kern-tokens`, never retyped here) as swatches next to the live
 * demo, then lists the states this family registers.
 * The opacities are painted, not asserted: the overlay divs use the theme's
 * `on-surface` role, so dark mode and contrast themes repaint them live.
 *
 * The state LIST is content, not reference: it came off the token table when
 * that table moved to the guidance file, and it is carried on the doc as
 * `states` so the strip keeps naming the states the family actually has.
 *
 * An h3 inside Demo (not a grammar slot): the strip is a lens on the live
 * demo above it, and the grammar's h2 slots stay the page's skeleton.
 */
function StatesStrip({ doc }: { doc: ComponentDoc }) {
  const registered = [
    ...new Set((doc.states ?? []).map((s) => s.trim())),
  ].filter((s) => s.length > 0 && s !== "resting");
  const layers: { label: string; opacity: number }[] = [
    { label: "Rest", opacity: 0 },
    { label: "Hover", opacity: STATE_LAYER_OPACITIES.hover },
    { label: "Focus", opacity: STATE_LAYER_OPACITIES.focus },
    { label: "Press", opacity: STATE_LAYER_OPACITIES.press },
    { label: "Drag", opacity: STATE_LAYER_OPACITIES.drag },
  ];
  return (
    <div className={`${CARD} flex flex-col gap-3 p-5`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Heading id="states" level={3}>
          States
        </Heading>
        <a
          className={`${SMALL} text-(--sys-color-secondary) no-underline hover:underline`}
          href="/foundations/m3/states"
        >
          M3 state layer specification →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {layers.map((layer) => (
          <div
            key={layer.label}
            className="flex flex-col items-center gap-1.5 rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface-container) p-2.5"
          >
            <span
              aria-hidden="true"
              className="relative flex h-10 w-full items-center justify-center overflow-hidden rounded-(--sys-shape-corner-small) bg-(--sys-color-surface)"
            >
              <span
                className="absolute inset-0"
                style={{
                  backgroundColor: "var(--sys-color-on-surface)",
                  opacity: layer.opacity,
                }}
              />
              <span className={`relative z-10 font-mono ${TINY} ${INK}`}>
                {Math.round(layer.opacity * 100)}%
              </span>
            </span>
            <span className={`${TINY} ${INK}`}>{layer.label}</span>
          </div>
        ))}
      </div>
      <p className={PROSE}>
        State layers apply <code>on-surface</code> at 8% hover, 10% focus, 10%
        press, and 16% drag over the container — never a manual color swap.{" "}
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
    <div className={`flex flex-wrap items-center gap-2 ${SMALL}`}>
      <a
        className={`inline-flex items-center gap-1 rounded-full bg-(--sys-color-secondary-container) px-3.5 py-1.5 text-(--sys-color-on-secondary-container) no-underline ${TRANSITION}`}
        href={registrySearchHref(exportName)}
      >
        Open in playground <span aria-hidden="true">↗</span>
      </a>
      {platform === "web" ? (
        <a
          className={`inline-flex items-center gap-1 rounded-full bg-(--sys-color-surface-container) px-3.5 py-1.5 text-(--sys-color-secondary) no-underline hover:bg-(--sys-color-surface-container-high) ${TRANSITION}`}
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
 * Install picker (Part 8, Mantine pattern). Source FIRST, registry second
 * (011): the `kern` binary is unpublished, so the available-now route is
 * vendoring from a checkout — the checkout-runner command leads, and the
 * package-manager tabs below are marked available-at-release. No bare-`kern`
 * tab: a tab instructing `npx kern add` would teach a failing command, so
 * the source command carries its checkout prefix. When the CLI publishes,
 * the prefix drops and the tab stays where it is. The registry tabs live in
 * the shared `InstallTabs` (same component the getting-started page uses,
 * so the commands and the persisted choice cannot drift).
 */
function InstallPicker({
  target,
  sourceCommand,
}: {
  target: string;
  sourceCommand: string;
}) {
  return (
    <div className={`${CARD} flex flex-col gap-2 p-4`}>
      <p className={`m-0 ${SMALL} text-(--sys-color-on-surface-variant)`}>
        Source — available now. Vendor from a checkout:
      </p>
      <div className="flex items-center gap-2">
        <pre className={`m-0 flex-1 overflow-x-auto ${CODE} ${INK}`}>
          <code>{sourceCommand}</code>
        </pre>
        <CopyButton text={sourceCommand} />
      </div>
      <p className={`m-0 ${SMALL} text-(--sys-color-on-surface-variant)`}>
        Registry — available at release (0.1.0 publishes):
      </p>
      <InstallTabs target={target} />
      <p className={`m-0 ${SMALL} text-(--sys-color-on-surface-variant)`}>
        Preview: packages are unpublished — this resolves from a checkout until
        0.1.0 publishes.
      </p>
    </div>
  );
}

function InstallationBlock({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const pkg = doc.meta.package;
  const target = installTarget(pkg);
  // Source-first (011): the checkout-runner vendor command is the route that
  // works today; the registry tabs below it are marked available-at-release.
  const sourceCommand =
    `bun <checkout>/packages/kern-cli/src/kern.ts add ${doc.slug}` +
    (platform === "mobile" ? " --platform native" : "") +
    " --dest components/kern";
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
      <InstallPicker target={target} sourceCommand={sourceCommand} />
      <div className={`${CARD} flex flex-col gap-2 p-4`}>
        <div className="flex items-center gap-2">
          <pre
            className={`codeblock m-0 flex-1 overflow-x-auto ${CODE} ${INK}`}
          >
            <HighlightedCode code={importStatement} language="tsx" />
          </pre>
          <CopyButton text={importStatement} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------- grammar: example */

/**
 * Grammar slot — Example. The family's CODED USAGE EXAMPLE: the thing a
 * reader copies. It was an h3 buried under the live demo, which made the
 * page's most-used answer — "how do I write this?" — the hardest to find;
 * now it is a slot of its own, right after the demo that proves the
 * component works.
 *
 * The fences come from the showcase registry, keyed by the family's parts
 * (`useShowcaseRegistry` — the registry is async, see `demos/lazy`). SSR and
 * prerender emit the heading plus a fixed-height skeleton; the client swaps
 * in the fences and the configurator when the chunk lands.
 *
 * A family with no registered example renders the GAP, never an empty
 * section: "no coded example yet" is a fact about the site, and saying so
 * is the honest state. A heading over nothing is noise; a heading over an
 * admission is a report.
 */
function Example({ doc, platform }: { doc: ComponentDoc; platform: Platform }) {
  // The platform's own registry: a web page must never download the native
  // bundle (and through it the icon registry) just because the mobile tab
  // exists — see `demos/lazy.ts`.
  const showcase = useShowcaseRegistry(platform);
  if (!showcase) {
    return (
      <section className="flex flex-col gap-4">
        <Heading id="example">Example</Heading>
        <div
          className="flex min-h-40 flex-col items-center justify-center gap-2"
          aria-hidden="true"
        >
          <div className="h-8 w-2/3 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)" />
          <div className="h-8 w-1/2 rounded-(--sys-shape-corner-small) bg-(--sys-color-surface-container-high)" />
        </div>
      </section>
    );
  }
  // Every part of the family gets a look: a compound family's example may be
  // registered against the part, not the root.
  const examples = doc.parts.flatMap((part) => showcase.examplesFor(part));
  // First registered configurator across the family's parts, if any —
  // flagships only, so most pages see nothing here.
  const configurator =
    "configuratorFor" in showcase
      ? doc.parts
          .map((part) => showcase.configuratorFor(part))
          .find((c) => c !== undefined)
      : undefined;
  return (
    <section className="flex flex-col gap-4">
      <Heading id="example">Example</Heading>
      {configurator ? <Configurator spec={configurator} /> : null}
      {!configurator && examples.length > 0 ? (
        <p className={SMALL}>
          Interactive knob panels ship for a flagship subset only (
          {"CONFIGURATORS" in showcase
            ? Object.keys(showcase.CONFIGURATORS).length
            : 0}{" "}
          components) — knobs are a teaching extra, not the contract. Every
          component carries live demos and examples regardless.
        </p>
      ) : null}
      {examples.length === 0 && !configurator ? (
        <p className={PROSE}>
          No coded example is registered for {doc.name} yet. That is a gap in
          the site, not in the package — it is tracked rather than hidden here.
        </p>
      ) : (
        <ExampleList examples={examples} />
      )}
    </section>
  );
}

/* ------------------------------------------ grammar: customization */

/**
 * Grammar slot — Customization. The escape hatch: what this family lets you
 * change, and what it does not. Both halves live HERE, so the boundary reads
 * in exactly one place — the "not supported" half used to sit in the
 * Limitations section, where the reader had to hold the same list in two
 * places at once.
 *
 * Conditional: the section renders when the page names at least one real
 * extension surface (a prop, a part, a token, a variant axis). A family that
 * is fully closed has no customization to document, and a heading over
 * nothing is noise.
 */
function Customization({ doc }: { doc: ComponentDoc }) {
  const custom = doc.customization;
  const supported = custom?.supported ?? [];
  const notSupported = custom?.notSupported ?? [];
  if (supported.length === 0 && notSupported.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="customization">Customization</Heading>
      <p className={PROSE}>
        What this family lets you change — and the traps it does not cover.
      </p>
      {supported.length > 0 ? (
        <>
          <Heading id="customization-supported" level={3}>
            Supported
          </Heading>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {supported.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      ) : null}
      {notSupported.length > 0 ? (
        <>
          <Heading id="customization-not-supported" level={3}>
            Not supported
          </Heading>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {notSupported.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
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
 * Grammar slot — Accessibility. Two contracts and the Part 7 per-demo
 * expectations: the KEYBOARD contract (what each key does) and the
 * SCREEN-READER contract (the `aria` notes — roles, states and names
 * handed to assistive tech). The ARIA half used to live in the Semantic DOM
 * slot, which is dissolved: the anatomy half moved to the guidance file and
 * the roles half belongs to the contract, not to a separate section.
 * Known gaps stay in Limitations — they are boundaries, not behaviour.
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
  const aria = doc.aria ?? [];
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
            ? "Not applicable. This is a non-interactive part — it takes no focus and has no keyboard interaction, so there is no keyboard contract to write. What it hands to assistive tech is stated below; everything else comes from the primitives it renders."
            : "Not yet documented. This component is interactive, so it does have keyboard behaviour — the contract just has not been written up here yet. Treat this as a gap, not as an absence of requirements."}
        </p>
        <ScreenReaderContract notes={aria} />
        <DemoExpectations page={a11y} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Heading id="accessibility">Accessibility</Heading>

      {keyboard?.length ? (
        <div className={`${CARD} flex flex-col gap-3 p-5`}>
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
                    className="border-b border-(--sys-color-outline-variant)/60 last:border-b-0"
                  >
                    <td className={TD}>
                      <kbd
                        className={`rounded-(--sys-shape-corner-small) border border-(--sys-color-outline-variant) bg-(--sys-color-surface-container-high) px-2 py-0.5 ${KEYCAP} text-(--sys-color-on-surface)`}
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
        </div>
      ) : null}

      <ScreenReaderContract notes={aria} />
      <DemoExpectations page={a11y} />
    </section>
  );
}

/**
 * The screen-reader contract — the `aria` notes as a list.
 *
 * These are the assertions assistive technology actually receives: the role
 * the component exposes, the states it reports, the name it must carry. They
 * are the page's contract with a non-visual reader, so they sit next to the
 * keyboard table rather than in a section of their own — one accessibility
 * section, two halves, one reader.
 *
 * The notes are written per family and are universal (every family states
 * them), so this block renders whenever the family has any — a missing note
 * is a gap in the content, and a gap in the content is not a reason to hide
 * the contract.
 */
function ScreenReaderContract({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className={`${CARD} flex flex-col gap-3 p-5`}>
      <Heading id="contract" level={3}>
        Screen reader contract
      </Heading>
      <ul className={`m-0 flex list-disc flex-col gap-2 pl-5 ${BODY}`}>
        {notes.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------- grammar: limitations */

/**
 * Grammar slot — Limitations. The honest boundary: what this family does
 * NOT do, stated so nobody discovers it by accident. Two sources, one home:
 * known accessibility gaps (moved out of Accessibility) and the
 * grammar-exemption notice for pages that cannot meet the strict order.
 *
 * The "not supported" half of the customization is NOT here any more: it
 * lives in Customization, so the boundary reads in exactly one place
 * instead of twice, in two sections that a reader could land in either.
 *
 * Conditional: a page with no recorded boundary has no Limitations section —
 * a heading over nothing is noise.
 */
function Limitations({ doc }: { doc: ComponentDoc }) {
  const gaps = doc.accessibilityGaps ?? [];
  const exempt = doc.grammarExempt?.trim();
  if (gaps.length === 0 && !exempt) return null;
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

/**
 * Grammar slot — Spec. The kern signature: strict to the Material 3 spec by
 * default. The departures themselves moved to the guidance file with the
 * rest of the teaching half — they are decision records, not page reference —
 * so what stays here is the SOURCE: the spec link, the resting elevation the
 * component rests at, and whether a Material 3 source is recorded at all.
 */
function Conformance({ doc }: { doc: ComponentDoc }) {
  const specUrl = doc.meta.specUrl;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="spec">Spec</Heading>
      <p className={PROSE}>
        Strict to Material 3 by default. Every deliberate kern departure is
        registered with an id and recorded in the family&rsquo;s M3 guidance
        file, so it can be audited rather than discovered.
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
    </section>
  );
}

/**
 * The conformance status line. States only what is CHECKABLE — a count of
 * variant axes is an inventory fact, not a conformance signal, and it already
 * renders honestly in the metadata strip above. The DEPARTURES are not
 * listed here any more (they moved to the guidance file), so the line states
 * the two facts the page still owns: the resting elevation, and whether a
 * Material 3 source is recorded. It never claims "no deviations" — the page
 * no longer holds the evidence for that claim.
 */
function conformanceLine(doc: ComponentDoc): string {
  const elev = elevationLabel(
    doc.meta.elevation,
    doc.meta.elevationBacked !== false,
  );
  const source =
    doc.meta.specUrl === "none"
      ? "No Material 3 source — a kern extension"
      : doc.meta.specUrl
        ? "Material 3 source recorded"
        : "Material 3 source not recorded for this page yet";
  return [`Resting elevation: ${elev.text}`, source].join(" · ");
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
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <details
          key={row.name}
          className="group rounded-(--sys-shape-corner-medium) bg-(--sys-color-surface-container) px-4 py-2.5"
        >
          <summary
            className={`flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1 ${SMALL}`}
          >
            <code className="font-mono text-(--sys-color-on-surface)">
              {row.name}
            </code>
            {row.required ? (
              <span
                className={`rounded-full bg-(--sys-color-error-container) px-2 py-0.5 ${TINY} text-(--sys-color-on-error-container)`}
              >
                required
              </span>
            ) : null}
            <code
              className={`rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-surface-container-high) px-1.5 py-0.5 font-mono text-(--sys-color-on-surface-variant) ${TINY}`}
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
            <p className={`m-0 mt-2 pt-1 ${SMALL} ${INK_SOFT}`}>{row.note}</p>
          ) : null}
        </details>
      ))}
    </div>
  );
}

function PropTable({ rows, caption }: { rows: ApiRow[]; caption?: string }) {
  return (
    <div className={`${CARD} flex flex-col gap-3 p-5`}>
      {caption ? (
        <p className={`m-0 ${LABEL} ${INK}`}>
          <code className="rounded-full bg-(--sys-color-secondary-container) px-3 py-1 font-mono text-(--sys-color-on-secondary-container)">
            {caption}
          </code>
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
    <footer className="flex flex-col gap-4 pt-6">
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
 * one standard's order and no other order (lede → demo → example → props →
 * accessibility → limitations → spec → customization).
 *
 * One page per component family (`/components/m3/<name>`, 018): the header
 * carries the family name with its system chip and the Web/Native tabs,
 * and the article below renders the ACTIVE platform's doc. Tabs are real
 * `?tab=` links — the switch works without JavaScript and crawlers see
 * both renderers — and picking one remembers the choice for the next visit.
 * A family documented on one renderer only renders no tabs (a tab that
 * goes nowhere is a lie); a `peerNote` then points at the same component
 * under its other-renderer name where one exists.
 */
export function ComponentPage({
  doc,
  platform,
  familySlug,
  systemLabel,
  tabs,
  peerNote,
  prev,
  next,
}: {
  doc: ComponentDoc;
  platform: Platform;
  /** The family slug — the page address, shared by both tabs. */
  familySlug: string;
  /** System label for the header chip (e.g. "M3") — the page's owner. */
  systemLabel: string;
  /** The renderers this family is documented on (one or both). */
  tabs: Platform[];
  /** Same component under another name on the other renderer, if any. */
  peerNote?: { label: string; href: string };
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  const crumbs: Crumb[] = [
    { label: "Components", href: "/components" },
    { label: doc.name },
  ];
  const platformTabs = tabs.map((id) => ({
    id,
    label: id === "web" ? "Web" : "React Native",
    href: `/components/m3/${familySlug}?tab=${id}`,
  }));
  return (
    <article className="flex min-w-0 flex-col gap-16" data-copy-md-root>
      <header className="flex flex-col gap-4">
        <Breadcrumbs items={crumbs} />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className={H1}>{doc.name}</h1>
            <p className={`m-0 ${SMALL} ${INK_SOFT}`}>{systemLabel}</p>
          </div>
          {platformTabs.length > 1 ? (
            <PlatformTabs
              tabs={platformTabs}
              active={platform}
              onPick={savePlatformChoice}
            />
          ) : null}
        </div>
        {peerNote ? (
          <p className={`m-0 ${SMALL} ${INK_SOFT}`}>
            Also documented for the other renderer:{" "}
            <a
              href={peerNote.href}
              className="text-(--sys-color-secondary) no-underline hover:underline"
            >
              {peerNote.label}
            </a>
          </p>
        ) : null}
        <p className={`m-0 max-w-[65ch] ${LEDE} ${INK}`}>{doc.oneLiner}</p>
        {/*
          The one guidance line. The teaching half of this page — features,
          the Do/Don't, the token table, the FAQ, the departures, the anatomy
          — lives in `docs/m3-guidance/<family>.md`, one file per family, and
          this is the ONLY pointer to it on the page: a page that repeated
          the teaching would let the two copies drift, and the guidance file
          is the copy that is checked.
        */}
        <p className={`m-0 ${SMALL} ${INK_SOFT}`}>
          M3 guidance →{" "}
          <a
            href={`${GITHUB}/blob/${REPO_BRANCH}/docs/m3-guidance/${doc.slug}.md`}
            rel="noreferrer"
            target="_blank"
            className="text-(--sys-color-secondary) no-underline hover:underline"
          >
            read the M3 guidance for {doc.name}
          </a>
        </p>
        <HeaderLinks doc={doc} platform={platform} />
      </header>

      {/* lede above; then the one standard, in order */}
      <Demo doc={doc} platform={platform} />
      <Example doc={doc} platform={platform} />
      <ApiReference doc={doc} />
      <Accessibility doc={doc} platform={platform} />
      {hasLimitations(doc) ? <Limitations doc={doc} /> : null}
      <Conformance doc={doc} />
      {hasCustomization(doc) ? <Customization doc={doc} /> : null}

      <Footer doc={doc} platform={platform} prev={prev} next={next} />
    </article>
  );
}
