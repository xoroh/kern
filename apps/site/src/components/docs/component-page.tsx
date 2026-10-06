/**
 * The per-component page — the kern component-page template.
 *
 * SECTION ORDER IS THE DELIVERABLE. It is not a style preference: it is the
 * reader's question order, made into headings —
 *
 *   prove (2) → start (3) → model (4) → explore (5) → integrate (6)
 *   → trust (7–8) → look up (9)
 *
 * so the next heading is always the answer to the question the previous one
 * raised. Source: `.team/reports/SITE-REDESIGN-docs-architecture.md` §2, which
 * folds Carbon's guidance blocks, Base UI's anatomy and MUI's metadata strip
 * into one hybrid.
 *
 * The order is asserted here; the DATA behind each heading is asserted by
 * `scripts/check-docs.mjs`. That split is deliberate — a page is checked by a
 * gate, not reviewed by eye.
 *
 * CONDITIONAL SECTIONS render only when the content carries them. A heading
 * with nothing under it is noise, and the convention is to cut it rather than
 * ship one. Installation is the exception: it derives from the metadata strip,
 * so it is always accurate and always present. Do/Don't, Theming and Keyboard
 * are optional today — the template is complete, and content grows into it
 * section by section.
 */

import type { Platform } from "../../content/index";
import type {
  ComponentDoc,
  Deviation,
  PartRow,
  PropRow,
  RestingElevation,
} from "../../content/types";
import { MOBILE_DEMOS } from "../../demos/mobile/registry";
import { WEB_DEMOS } from "../../demos/web/registry";
import { PROPS_TABLE } from "../../generated/props-table";
import { Configurator } from "../../showcase/configurator";
import { ExampleList } from "../../showcase/example";
import { configuratorFor, examplesFor } from "../../showcase/registry";
import { maturityForExports } from "../../systems/maturity";
import { CopyMarkdownButton } from "../chrome/copy-markdown-button";

/**
 * M1 — the page that TEACHES the type scale must USE the type scale.
 *
 * These were ad-hoc Tailwind sizes (text-xl/base/sm/xs, tracking-tight,
 * leading-relaxed), which meant the component reference contradicted the very
 * scale it documents — and it becomes reader-visible the moment the
 * Foundations type page lands beside it. kern ships all 30 styles as
 * --md-sys-typescale-* (150 vars: family/size/weight/spacing/line-height per
 * style, baseline + emphasized), so every role below resolves from a token.
 *
 * The role names are checked against the generated token set by
 * scripts/check-typescale.mjs — a role that does not exist is a build-time
 * failure, not a silent fallback.
 */
const ts = (role: string) =>
  [
    `[font-family:var(--md-sys-typescale-${role}-font-family)]`,
    `[font-size:var(--md-sys-typescale-${role}-font-size)]`,
    `[font-weight:var(--md-sys-typescale-${role}-font-weight)]`,
    `[line-height:var(--md-sys-typescale-${role}-line-height)]`,
    `[letter-spacing:var(--md-sys-typescale-${role}-letter-spacing)]`,
  ].join(" ");

/** Page title. */
const H1 = `m-0 text-(--md-sys-color-on-surface) ${ts("headline-medium")}`;
/** Section heading — the reader's next question. */
const H2 = `m-0 text-(--md-sys-color-on-surface) ${ts("headline-small")}`;
/** Sub-heading inside a section. */
const H3 = `m-0 text-(--md-sys-color-on-surface) ${ts("title-large")}`;
/** Running text. The token carries size, weight AND line-height. */
const INK = "text-(--md-sys-color-on-surface)";
const INK_SOFT = "text-(--md-sys-color-on-surface-variant)";
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
const CHIP = `inline-flex items-center gap-1.5 rounded-full border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) px-3 py-1 font-mono text-(--md-sys-color-on-surface-variant) [font-size:var(--md-sys-typescale-label-large-font-size)] [line-height:var(--md-sys-typescale-label-large-line-height)]`;
const CARD =
  "rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low)";
const TH = `py-2 pr-4 text-left text-(--md-sys-color-on-surface) ${ts("title-small")}`;
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
        className="ml-2 inline-flex items-center text-(--md-sys-color-on-surface-variant) no-underline opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
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

/* ------------------------------------------------------------------ chips */

function Chip({
  term,
  value,
  warn = false,
}: {
  term: string;
  value: string;
  warn?: boolean;
}) {
  const box = warn
    ? "inline-flex items-center gap-1.5 rounded-full border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) px-3 py-1 font-mono text-(--md-sys-color-on-error-container) [font-size:var(--md-sys-typescale-label-large-font-size)] [line-height:var(--md-sys-typescale-label-large-line-height)]"
    : CHIP;
  // m3 — the strip is a <dl>, so it must contain dt/dd pairs. A <dl> full of
  // <div>/<span> is a fake description list: assistive tech announces it as a
  // list of groups and the term/value relationship is lost. `dl > div > dt+dd`
  // is valid HTML5 and keeps the visual chip intact.
  return (
    <div className={box}>
      {term ? (
        <dt className="m-0 inline text-(--md-sys-color-on-surface)">
          {term}:{" "}
        </dt>
      ) : null}
      <dd className="m-0 inline text-(--md-sys-color-on-surface)">{value}</dd>
    </div>
  );
}

/**
 * A chip that points at an external reference. The four ↗ links (M3 spec,
 * WAI-ARIA, Source, Bundle) are the "reference" signal — MUI's meta row does
 * this, and it is the strongest "this page is authoritative" cue in docs.
 * Renders as plain text when no URL is supplied, so a page is never a dead
 * link and the strip is never half-empty.
 */
function LinkChip({
  term,
  value,
  href,
}: {
  term: string;
  value: string;
  href?: string;
}) {
  // m3 — same rule as Chip: a <dl> must contain dt/dd pairs. The wrapper div
  // is valid inside <dl> (HTML5 allows `dl > div > dt+dd`) and keeps the
  // visual chip, including the linked variant.
  const inner = (
    <>
      {term ? (
        <dt className="m-0 inline text-(--md-sys-color-on-surface)">
          {term}:{" "}
        </dt>
      ) : null}
      <dd className="m-0 inline text-(--md-sys-color-on-surface)">{value}</dd>
    </>
  );
  if (!href) return <div className={CHIP}>{inner}</div>;
  return (
    <div className={CHIP}>
      <a
        className="inline-flex items-center gap-1 text-(--md-sys-color-on-surface) no-underline hover:border-(--md-sys-color-outline) hover:bg-(--md-sys-color-surface-container-high)"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {inner}
        <span aria-hidden="true" className="text-(--md-sys-color-primary)">
          ↗
        </span>
      </a>
    </div>
  );
}

/* ---------------------------------------------------------- 1. header */

/**
 * Section 1 — Header + metadata strip. Facts before prose: this is what makes
 * a page read as a reference rather than a blog post.
 */
function MetadataStrip({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const { meta } = doc;
  const elev = elevationLabel(meta.elevation, meta.elevationBacked !== false);
  // D-038 — maturity comes from ONE generated source (packages/mcp's
  // maturity.ts, copied regen-green by scripts/generate-maturity.mjs). It is
  // resolved, never authored: a page asserts a state only when every export it
  // owns agrees, and renders no chip at all when the source knows none of them.
  const maturity = maturityForExports(
    doc.parts,
    platform === "web" ? "web" : "native",
  );
  const state = meta.state ?? maturity?.state;
  const version = meta.version ?? maturity?.version;
  return (
    <dl className="m-0 flex flex-wrap items-center gap-2">
      {/*
        m6 — `meta.status` is the REGISTRY value (real/stub) and describes our
        content file, not the component. Publishing it as "Status: real" leaks
        an internal and tells the reader nothing. The release state
        (Preview / Stable / Maintained / …) is the fact about the component,
        and that is what gets shown.
      */}
      {state ? <Chip term="State" value={state} /> : null}
      {version ? <Chip term="Version" value={version} /> : null}
      <Chip term="Package" value={meta.package} />
      {meta.platforms?.length ? (
        <Chip term="Platforms" value={meta.platforms.join(" · ")} />
      ) : null}
      <Chip term="Native peer" value={meta.nativePeer} />
      <Chip term="Elevation" value={elev.text} warn={elev.warn} />
      {meta.variants.length === 0 ? (
        <Chip term="Variants" value="none" />
      ) : (
        // m3: a `dl > div` must contain a dt. Rendering the axis with no term
        // produced dd-only groups, which is invalid and loses the pair.
        // Each entry is authored as `axis: values`, so the axis NAME becomes
        // the term and the values become the value — otherwise the strip reads
        // "Variant: variant: elevated · …", a label printed twice.
        meta.variants.map((axis) => {
          const sep = axis.indexOf(": ");
          const term = sep === -1 ? "Variant" : axis.slice(0, sep);
          const value = sep === -1 ? axis : axis.slice(sep + 2);
          return (
            <Chip
              key={axis}
              term={term.charAt(0).toUpperCase() + term.slice(1)}
              value={value}
            />
          );
        })
      )}
      {/*
        TRI-STATE, because the middle and the empty state are different
        claims: "none" is RECORDED as having no Material 3 source, while
        undefined is simply NOT RECORDED yet. Rendering the empty state as
        "kern extension" would tell a reader that Button has no M3 origin —
        an inverse fabrication, and just as damaging as a dead link.
      */}
      <LinkChip
        term="M3 spec"
        value={
          meta.specUrl === "none"
            ? "none — kern extension"
            : meta.specUrl
              ? "spec"
              : "not recorded"
        }
        href={
          typeof meta.specUrl === "string" && meta.specUrl !== "none"
            ? meta.specUrl
            : undefined
        }
      />
      {/*
        A chip that renders a label with no link promises a fact and delivers
        none — "WAI-ARIA: APG" with nowhere to go is worse than no chip,
        because it looks like due diligence. Same treatment as the spec chip
        above: say what is true, or say there is nothing here.
      */}
      <LinkChip
        term="WAI-ARIA"
        value={meta.apgUrl ? "APG" : "not linked"}
        href={meta.apgUrl}
      />
      <LinkChip
        term="Source"
        value={meta.sourceUrl ? "GitHub" : "not linked"}
        href={meta.sourceUrl}
      />
      <LinkChip
        term="Bundle"
        value={meta.bundleUrl ? "size" : "not linked"}
        href={meta.bundleUrl}
      />
    </dl>
  );
}

/* -------------------------------------------------------- 2. showcase */

/**
 * Section 2 — Showcase. Live, interactive, from the real package. Never a
 * screenshot, never a reimplementation: a demo that restates the component's
 * markup teaches the reader the wrong code. Prove it works before asking
 * anyone to read about it.
 *
 * Part 3c — the reasoning-carrying examples used to render HERE instead of
 * the demo whenever they existed, which meant the live proof vanished on
 * exactly the pages with the most to show. Showcase keeps the single live
 * demo (or the gap note); examples are their own section below.
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

function Showcase({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  return (
    <section className="flex flex-col gap-3" aria-label="Showcase">
      <Heading id="showcase">Showcase</Heading>
      <DemoContent doc={doc} platform={platform} />
    </section>
  );
}

/* Part 3 — the position-2 "Kern vs Material 3" compare was folded into the
 * deviations slot (Conformance, below): its left cell re-rendered Showcase's
 * own demo, and its right cell restated the deviation rows. The one element
 * with no home there — the "Read the M3 spec" link — moved into Conformance.
 */

/* ---------------------------------------------------- 3. installation */

/**
 * Section 3 — Installation & usage. The "60-second bar": the fastest path
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

function Installation({ doc }: { doc: ComponentDoc }) {
  const pkg = doc.meta.package;
  const target = installTarget(pkg);
  return (
    <section className="flex flex-col gap-3">
      <Heading id="installation">Installation</Heading>
      <p className={PROSE}>
        Every export on this page ships in <code>{target}</code> and is imported
        from <code>{pkg}</code>. There is no per-component install.
      </p>
      <div className={`${CARD} flex flex-col gap-2 p-4`}>
        <pre className={`m-0 overflow-x-auto ${CODE} ${INK}`}>
          <code>{`npm i ${target}`}</code>
        </pre>
        <pre className={`m-0 overflow-x-auto ${CODE} ${INK}`}>
          <code>{`import { ${doc.parts[0]} } from "${pkg}";`}</code>
        </pre>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 4. anatomy */

/**
 * Section 4 — Anatomy. The mental model before variant shopping: the part
 * names introduced here are what every later section refers to.
 */
function Anatomy({ doc }: { doc: ComponentDoc }) {
  const rows = doc.anatomy;
  if (!rows || rows.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="anatomy">Anatomy</Heading>
      <p className={PROSE}>
        {doc.parts.length === 1
          ? "The parts this component is built from."
          : "The parts of this family, and what each is for."}
      </p>
      <ul className="m-0 flex flex-col gap-2">
        {rows.map((part) => (
          <AnatomyRow key={part.name} part={part} />
        ))}
      </ul>
    </section>
  );
}

function AnatomyRow({ part }: { part: PartRow }) {
  return (
    <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <code
        className={`shrink-0 font-mono ${SMALL} text-(--md-sys-color-secondary)`}
      >
        {part.name}
      </code>
      <span className={`${SMALL} ${INK_SOFT}`}>{part.role}</span>
    </li>
  );
}

/* --------------------------------------------------- 5. usage (was Features) */

/**
 * Section 5 — Usage. The ONLY section allowed to persuade. Task guidance
 * before reference: when to reach for this, and when not to.
 *
 * Part 3b — the heading reads "Usage" per the approved page order, but the
 * anchor stays `#features`: deep links and the headings gate resolve against
 * the id, so a raw rename would break the anchor contract. Alias, don't move.
 */
function Usage({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="flex flex-col gap-3">
      <Heading id="features">Usage</Heading>
      <p className={PROSE}>{doc.features}</p>
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
        <div
          className={`${CARD} border-l-4 border-l-(--md-sys-color-primary) p-4`}
        >
          <Heading id="do" level={3}>
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
        <div
          className={`${CARD} border-l-4 border-l-(--md-sys-color-error) p-4`}
        >
          <Heading id="dont" level={3}>
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
        <div
          className={`${CARD} border-l-4 border-l-(--md-sys-color-outline) p-4`}
        >
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

/* -------------------------------------------------------- 6. examples */

/**
 * Section 6 — Examples. The reasoning-carrying companions to the live demo:
 * each example shows the component doing one job, with the why attached.
 * Conditional like Anatomy: pages without registered examples render no
 * section and no TOC entry, rather than an empty promise.
 */
function Examples({ doc }: { doc: ComponentDoc }) {
  const examples = doc.parts.flatMap((part) => examplesFor(part));
  // First registered configurator across the family's parts, if any —
  // flagships only, so most pages see nothing here.
  const configurator = doc.parts
    .map((part) => configuratorFor(part))
    .find((c) => c !== undefined);
  if (examples.length === 0 && !configurator) return null;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="examples">Examples</Heading>
      {configurator ? <Configurator spec={configurator} /> : null}
      <ExampleList examples={examples} />
    </section>
  );
}

/* ------------------------------------------------ 7. theming & tokens */

/**
 * Section 7 — Theming & tokens. Where "strict M3" becomes visible per
 * component: which tokens it consumes, at what resting elevation, with which
 * shape. Tokens are the product, so they get their own heading rather than a
 * footnote.
 */
function Theming({ doc }: { doc: ComponentDoc }) {
  const tokens = doc.tokens;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="theming-and-tokens">Theming and tokens</Heading>
      <p className={PROSE}>
        What this component reads from the theme. Change the token and every
        instance changes — that is the point of the token layer.
      </p>
      {tokens && tokens.length > 0 ? (
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse ${SMALL}`}>
            <thead>
              <tr className="border-b border-(--md-sys-color-outline-variant)">
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
                  className="border-b border-(--md-sys-color-outline-variant)"
                >
                  <td className={TD}>{row.element}</td>
                  <td
                    className={`${TD} text-(--md-sys-color-on-surface-variant)`}
                  >
                    {row.state}
                  </td>
                  <td
                    className={`${TD} font-mono text-(--md-sys-color-primary) [font-size:var(--md-sys-typescale-label-small-font-size)] [line-height:var(--md-sys-typescale-label-small-line-height)]`}
                  >
                    {row.token}
                  </td>
                  <td
                    className={`${TD} font-mono text-(--md-sys-color-on-surface-variant) [font-size:var(--md-sys-typescale-label-small-font-size)] [line-height:var(--md-sys-typescale-label-small-line-height)]`}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={PROSE}>
          No per-component token table is generated for this one yet. Its
          resting elevation is{" "}
          <strong className="text-(--md-sys-color-on-surface)">
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
 * Customization, folded into theming. The "not supported" half is the point:
 * it stops people hunting for a prop that does not exist.
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
      {custom.notSupported.length > 0 && (
        <>
          <Heading id="not-supported" level={3}>
            Not supported
          </Heading>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {custom.notSupported.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------- 8. accessibility */

/**
 * Section 8 — Accessibility, promoted out of the API tail. It is a headline
 * kern claim (behaviour comes from the primitives), so it sits in the trust
 * position rather than being the last thing on the page. Three parts:
 * keyboard contract, ARIA contract, and — when there are any — known gaps,
 * stated plainly.
 */
function Accessibility({ doc }: { doc: ComponentDoc }) {
  const keyboard = doc.keyboard;
  const aria = doc.aria ?? [];
  const gaps = doc.accessibilityGaps ?? [];
  const hasContent = aria.length > 0 || gaps.length > 0 || !!keyboard?.length;

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
                <tr className="border-b border-(--md-sys-color-outline-variant)">
                  <th className={`${TH} w-40`}>Key</th>
                  <th className={TH}>Action</th>
                </tr>
              </thead>
              <tbody>
                {keyboard.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-(--md-sys-color-outline-variant)"
                  >
                    <td className={TD}>
                      <kbd
                        className={`rounded border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) px-1.5 py-0.5 ${KEYCAP} text-(--md-sys-color-on-surface)`}
                      >
                        {row.key}
                      </kbd>
                    </td>
                    <td
                      className={`${TD} text-(--md-sys-color-on-surface-variant)`}
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

      {aria.length > 0 && (
        <>
          <Heading id="contract" level={3}>
            Contract
          </Heading>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {aria.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      {gaps.length > 0 && (
        <div className="rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) p-4">
          <Heading
            id="known-gaps"
            level={3}
            className="text-(--md-sys-color-on-error-container)"
          >
            Known gaps
          </Heading>
          <ul
            className={`m-0 mt-2 flex list-disc flex-col gap-2 pl-5 ${SMALL} text-(--md-sys-color-on-error-container)`}
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

/* ------------------------------------------------ 9. M3 conformance */

/**
 * Section 9 — Material 3 conformance. The kern signature: strict to the spec
 * by default, and every departure declared with a registered id so it can be
 * audited rather than discovered. Sits after trust and before lookup.
 */
function Conformance({ doc }: { doc: ComponentDoc }) {
  const rows = doc.deviations;
  const specUrl = doc.meta.specUrl;
  return (
    <section className="flex flex-col gap-3">
      <Heading id="material-3-conformance">Material 3 conformance</Heading>
      <p className={PROSE}>
        Strict to Material 3 by default. Anything below is a deliberate kern
        decision, registered with an id so it can be audited rather than
        discovered.
      </p>
      {specUrl && specUrl !== "none" ? (
        <p className={PROSE}>
          <a
            className="text-(--md-sys-color-primary) underline underline-offset-2"
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
          className={`rounded-full bg-(--md-sys-color-secondary-container) px-2.5 py-0.5 font-mono text-(--md-sys-color-on-secondary-container) [font-size:var(--md-sys-typescale-label-small-font-size)] [line-height:var(--md-sys-typescale-label-small-line-height)]`}
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

/* ------------------------------------------------ 10. api reference */

/**
 * Section 10 — API reference. Look-up last: readers arrive here from search and
 * anchors, not in reading flow.
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

function PropTable({ rows, caption }: { rows: ApiRow[]; caption?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse text-left ${SMALL}`}>
        {caption ? (
          <caption className={`pb-2 text-left ${LABEL} ${INK}`}>
            <code className="font-mono">{caption}</code>
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-(--md-sys-color-outline-variant)">
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
              className="border-b border-(--md-sys-color-outline-variant)"
            >
              <td className={TD}>
                <code className="font-mono text-(--md-sys-color-on-surface)">
                  {row.name}
                </code>
                {row.required && (
                  <span className={`ml-2 ${TINY} text-(--md-sys-color-error)`}>
                    required
                  </span>
                )}
              </td>
              <td
                className={`${TD} font-mono text-(--md-sys-color-on-surface-variant) [font-size:var(--md-sys-typescale-label-small-font-size)] [line-height:var(--md-sys-typescale-label-small-line-height)]`}
              >
                {row.type}
              </td>
              <td
                className={`${TD} font-mono text-(--md-sys-color-on-surface-variant) [font-size:var(--md-sys-typescale-label-small-font-size)] [line-height:var(--md-sys-typescale-label-small-line-height)]`}
              >
                {row.default ?? "—"}
              </td>
              <td className={`${TD} ${SMALL} ${INK_SOFT}`}>{row.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
        <Heading id="api-reference">API reference</Heading>
        <PropTable rows={doc.api.map(toRow)} />
      </section>
    );
  }
  const multi = doc.parts.length > 1;
  return (
    <section className="flex flex-col gap-4">
      <Heading id="api-reference">API reference</Heading>
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
    <footer className="flex flex-col gap-4 border-t border-(--md-sys-color-outline-variant) pt-6">
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
          className="text-(--md-sys-color-primary) underline underline-offset-2"
          href={editUrlFor(doc, platform)}
          rel="noreferrer"
          target="_blank"
        >
          Edit this page
        </a>
        {doc.meta.sourceUrl ? (
          <a
            className="text-(--md-sys-color-primary) underline underline-offset-2"
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
          className="text-(--md-sys-color-primary) underline underline-offset-2"
          href={feedbackUrlFor(doc, platform)}
          rel="noreferrer"
          target="_blank"
        >
          Report a problem with this page
        </a>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------- page */

/**
 * "On this page" — the orientation aid the docs architecture requires
 * (SITE-REDESIGN-docs-architecture.md §4.4: breadcrumb, TOC, prev/next —
 * breadcrumb and prev/next already exist; this was the missing third).
 *
 * Hrefs are STATIC literals, not built from variables: `check-headings`
 * resolves each one against the explicit Heading ids below, so a TOC link
 * to a missing id is a gate failure, not a silent dead anchor. Anatomy and
 * Examples are the conditional entries — each renders only when its content
 * exists, under the same condition as its section.
 */
function OnThisPage({ doc }: { doc: ComponentDoc }) {
  return (
    <nav
      aria-label="On this page"
      className={`${CARD} flex flex-col gap-2 p-4`}
    >
      <p className={`m-0 ${LABEL} ${INK}`}>On this page</p>
      <ol className={`m-0 flex list-none flex-col gap-1 p-0 ${SMALL}`}>
        <TocLink href="#showcase" label="Showcase" />
        <TocLink href="#installation" label="Installation" />
        {doc.anatomy?.length ? (
          <TocLink href="#anatomy" label="Anatomy" />
        ) : null}
        <TocLink href="#features" label="Usage" />
        {doc.parts.flatMap((part) => examplesFor(part)).length > 0 ||
        doc.parts.some((part) => configuratorFor(part) !== undefined) ? (
          <TocLink href="#examples" label="Examples" />
        ) : null}
        <TocLink href="#theming-and-tokens" label="Theming and tokens" />
        <TocLink href="#accessibility" label="Accessibility" />
        <TocLink
          href="#material-3-conformance"
          label="Material 3 conformance"
        />
        <TocLink href="#api-reference" label="API reference" />
      </ol>
    </nav>
  );
}

function TocLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        className={`${INK_SOFT} no-underline hover:text-(--md-sys-color-on-surface) hover:underline`}
      >
        {label}
      </a>
    </li>
  );
}

/**
 * The page. Sections render in the grammar's order and no other order.
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
  return (
    <article className="flex flex-col gap-10" data-copy-md-root>
      <header className="flex flex-col gap-4">
        <h1 className={H1}>{doc.name}</h1>
        <p className={`m-0 max-w-[62ch] ${LEDE} ${INK_SOFT}`}>{doc.oneLiner}</p>
        <MetadataStrip doc={doc} platform={platform} />
        <div>
          <CopyMarkdownButton />
        </div>
      </header>

      <OnThisPage doc={doc} />

      {/* prove */}
      <Showcase doc={doc} platform={platform} />
      {/* start */}
      <Installation doc={doc} />
      {/* model */}
      <Anatomy doc={doc} />
      {/* explore */}
      <Usage doc={doc} />
      {/* examples */}
      <Examples doc={doc} />
      {/* integrate */}
      <Theming doc={doc} />
      {/* trust */}
      <Accessibility doc={doc} />
      <Conformance doc={doc} />
      {/* look up */}
      <ApiReference doc={doc} />

      <Footer doc={doc} platform={platform} prev={prev} next={next} />
    </article>
  );
}
