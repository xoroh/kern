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
  RestingElevation,
} from "../../content/types";
import { MOBILE_DEMOS } from "../../demos/mobile/registry";
import { WEB_DEMOS } from "../../demos/web/registry";
import { ExampleList } from "../../showcase/example";
import { examplesFor } from "../../showcase/registry";

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
  return (
    <div
      className={
        warn
          ? `inline-flex items-center gap-1.5 rounded-full border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) px-3 py-1 font-mono text-(--md-sys-color-on-error-container) [font-size:var(--md-sys-typescale-label-large-font-size)] [line-height:var(--md-sys-typescale-label-large-line-height)]`
          : CHIP
      }
    >
      <span
        className={
          warn
            ? "text-(--md-sys-color-on-error-container)"
            : "text-(--md-sys-color-on-surface)"
        }
      >
        {term ? `${term}: ` : ""}
        {value}
      </span>
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
  const inner = (
    <span className="text-(--md-sys-color-on-surface)">
      {term ? `${term}: ` : ""}
      {value}
    </span>
  );
  if (!href) return <div className={CHIP}>{inner}</div>;
  return (
    <a
      className={`${CHIP} no-underline hover:border-(--md-sys-color-outline) hover:bg-(--md-sys-color-surface-container-high)`}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {inner}
      <span aria-hidden="true" className="text-(--md-sys-color-primary)">
        ↗
      </span>
    </a>
  );
}

/* ---------------------------------------------------------- 1. header */

/**
 * Section 1 — Header + metadata strip. Facts before prose: this is what makes
 * a page read as a reference rather than a blog post.
 */
function MetadataStrip({ doc }: { doc: ComponentDoc }) {
  const { meta } = doc;
  const elev = elevationLabel(meta.elevation, meta.elevationBacked !== false);
  return (
    <dl className="m-0 flex flex-wrap items-center gap-2">
      {meta.state ? <Chip term="State" value={meta.state} /> : null}
      {meta.version ? <Chip term="Version" value={meta.version} /> : null}
      <Chip term="Status" value={meta.status} />
      <Chip term="Package" value={meta.package} />
      {meta.platforms?.length ? (
        <Chip term="Platforms" value={meta.platforms.join(" · ")} />
      ) : null}
      <Chip term="Native peer" value={meta.nativePeer} />
      <Chip term="Elevation" value={elev.text} warn={elev.warn} />
      {meta.variants.length === 0 ? (
        <Chip term="Variants" value="none" />
      ) : (
        meta.variants.map((axis) => <Chip key={axis} term="" value={axis} />)
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
 */
function Showcase({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  const demo = platform === "web" ? WEB_DEMOS : MOBILE_DEMOS;
  const live = demo[doc.parts[0]];
  // Examples take precedence over the single demo: they carry the reasoning,
  // not just the thing working.
  const examples = doc.parts.flatMap((part) => examplesFor(part));
  return (
    <section className="flex flex-col gap-3" aria-label="Showcase">
      <h2 className={H2}>Showcase</h2>
      {examples.length > 0 ? (
        <ExampleList examples={examples} />
      ) : live ? (
        live()
      ) : (
        <p className={PROSE}>
          No live demo is registered for <code>{doc.parts[0]}</code>. That is a
          gap in the site, not in the package — it is tracked rather than hidden
          here.
        </p>
      )}
    </section>
  );
}

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
      <h2 className={H2}>Installation</h2>
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
      <h2 className={H2}>Anatomy</h2>
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
      <code className={`shrink-0 font-mono ${SMALL} text-(--md-sys-color-secondary)`}>
        {part.name}
      </code>
      <span className={`${SMALL} ${INK_SOFT}`}>{part.role}</span>
    </li>
  );
}

/* ----------------------------------------------- 5. features & variants */

/**
 * Section 5 — Features & variants. The ONLY section allowed to persuade.
 * Task guidance before reference: when to reach for this, and when not to.
 */
function Features({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className={H2}>Features</h2>
      <p className={PROSE}>{doc.features}</p>
      <WhenToUse doc={doc} />
    </section>
  );
}

/**
 * Do/Don't cards — the M3 Guidelines pattern, and the clearest way to state a
 * usage rule: the two sit side by side so the contrast is the argument.
 * Renders only when both halves are present; a Do without a Don't says
 * nothing.
 */
function WhenToUse({ doc }: { doc: ComponentDoc }) {
  const use = doc.usage;
  if (!use || use.do.length === 0 || use.dont.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div
        className={`${CARD} border-l-4 border-l-(--md-sys-color-primary) p-4`}
      >
        <h3 className={H3}>Do</h3>
        <ul
          className={`m-0 mt-2 flex list-disc flex-col gap-2 pl-5 ${SMALL} ${INK_SOFT}`}
        >
          {use.do.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <div className={`${CARD} border-l-4 border-l-(--md-sys-color-error) p-4`}>
        <h3 className={H3}>Don&rsquo;t</h3>
        <ul
          className={`m-0 mt-2 flex list-disc flex-col gap-2 pl-5 ${SMALL} ${INK_SOFT}`}
        >
          {use.dont.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------ 6. theming & tokens */

/**
 * Section 6 — Theming & tokens. Where "strict M3" becomes visible per
 * component: which tokens it consumes, at what resting elevation, with which
 * shape. Tokens are the product, so they get their own heading rather than a
 * footnote.
 */
function Theming({ doc }: { doc: ComponentDoc }) {
  const tokens = doc.tokens;
  return (
    <section className="flex flex-col gap-3">
      <h2 className={H2}>Theming and tokens</h2>
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
      <h3 className={H3}>Customization</h3>
      <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
        {custom.supported.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {custom.notSupported.length > 0 && (
        <>
          <h3 className={H3}>Not supported</h3>
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

/* -------------------------------------------------- 7. accessibility */

/**
 * Section 7 — Accessibility, promoted out of the API tail. It is a headline
 * kern claim (behaviour comes from the primitives), so it sits in the trust
 * position rather than being the last thing on the page. Three parts:
 * keyboard contract, ARIA contract, and — when there are any — known gaps,
 * stated plainly.
 */
function Accessibility({ doc }: { doc: ComponentDoc }) {
  const keyboard = doc.keyboard;
  const aria = doc.aria ?? [];
  const gaps = doc.accessibilityGaps ?? [];
  if (aria.length === 0 && gaps.length === 0 && !keyboard?.length) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className={H2}>Accessibility</h2>

      {keyboard?.length ? (
        <>
          <h3 className={H3}>Keyboard</h3>
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
                      <kbd className={`rounded border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) px-1.5 py-0.5 ${KEYCAP} text-(--md-sys-color-on-surface)`}>
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
          <h3 className={H3}>Contract</h3>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {aria.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}

      {gaps.length > 0 && (
        <div className="rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-error) bg-(--md-sys-color-error-container) p-4">
          <h3 className={`m-0 ${H3} text-(--md-sys-color-on-error-container)`}>
            Known gaps
          </h3>
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

/* ------------------------------------------------ 8. M3 conformance */

/**
 * Section 8 — Material 3 conformance. The kern signature: strict to the spec
 * by default, and every departure declared with a registered id so it can be
 * audited rather than discovered. Sits after trust and before lookup.
 */
function Conformance({ doc }: { doc: ComponentDoc }) {
  const rows = doc.deviations;
  return (
    <section className="flex flex-col gap-3">
      <h2 className={H2}>Material 3 conformance</h2>
      <p className={PROSE}>
        Strict to Material 3 by default. Anything below is a deliberate kern
        decision, registered with an id so it can be audited rather than
        discovered.
      </p>
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
  return [
    `elevation: ${elev.text}`,
    `deviations: ${ids.length ? ids.join(" | ") : "none"}`,
  ].join("  ·  ");
}

function DeviationRow({ row }: { row: Deviation }) {
  return (
    <li className={`${CARD} flex flex-col gap-2 p-4`}>
      <div className="flex items-center gap-2">
        <span className={`rounded-full bg-(--md-sys-color-secondary-container) px-2.5 py-0.5 font-mono text-(--md-sys-color-on-secondary-container) [font-size:var(--md-sys-typescale-label-small-font-size)] [line-height:var(--md-sys-typescale-label-small-line-height)]`}>
          {row.id}
        </span>
      </div>
      <dl className="m-0 grid grid-cols-1 gap-2 sm:grid-cols-[7rem_1fr]">
        <dt className={`m-0 ${LABEL} ${INK}`}>
          Material 3
        </dt>
        <dd className={`m-0 ${SMALL} ${INK_SOFT}`}>{row.spec}</dd>
        <dt className={`m-0 ${LABEL} ${INK}`}>
          kern
        </dt>
        <dd className={`m-0 ${SMALL} ${INK_SOFT}`}>{row.kern}</dd>
        <dt className={`m-0 ${LABEL} ${INK}`}>
          Why
        </dt>
        <dd className={`m-0 ${SMALL} ${INK_SOFT}`}>{row.why}</dd>
      </dl>
    </li>
  );
}

/* ------------------------------------------------ 9. api reference */

/**
 * Section 9 — API reference. Look-up last: readers arrive here from search and
 * anchors, not in reading flow.
 */
function ApiReference({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className={H2}>API reference</h2>
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse text-left ${SMALL}`}>
          <thead>
            <tr className="border-b border-(--md-sys-color-outline-variant)">
              <th className={TH}>Prop</th>
              <th className={TH}>Type</th>
              <th className={TH}>Default</th>
              <th className={TH}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {doc.api.map((row) => (
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
    </section>
  );
}

/* ------------------------------------------------------- 10. footer */

/**
 * Section 10 — Footer. Navigation plus the affordances that make a docs page
 * a work surface rather than a dead end: edit it, and say whether it helped.
 */
function Footer({
  doc,
  prev,
  next,
}: {
  doc: ComponentDoc;
  prev?: string;
  next?: string;
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
            href={prev}
          >
            ← Previous
          </a>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <a
            className={`${CARD} flex-1 p-4 text-right ${SMALL} ${INK} no-underline`}
            href={next}
          >
            Next →
          </a>
        ) : (
          <span className="flex-1" />
        )}
      </nav>

      <div className={`flex flex-wrap items-center gap-4 ${SMALL}`}>
        {doc.meta.sourceUrl ? (
          <a
            className="text-(--md-sys-color-primary) underline underline-offset-2"
            href={doc.meta.sourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Edit on GitHub
          </a>
        ) : null}
        <span className={BODY}>Is this page helpful?</span>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------- page */

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
  prev?: string;
  next?: string;
}) {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <h1 className={H1}>
          {doc.name}
        </h1>
        <p className={`m-0 max-w-[62ch] ${LEDE} ${INK_SOFT}`}>
          {doc.oneLiner}
        </p>
        <MetadataStrip doc={doc} />
      </header>

      {/* prove */}
      <Showcase doc={doc} platform={platform} />
      {/* start */}
      <Installation doc={doc} />
      {/* model */}
      <Anatomy doc={doc} />
      {/* explore */}
      <Features doc={doc} />
      {/* integrate */}
      <Theming doc={doc} />
      {/* trust */}
      <Accessibility doc={doc} />
      <Conformance doc={doc} />
      {/* look up */}
      <ApiReference doc={doc} />

      <Footer doc={doc} prev={prev} next={next} />
    </article>
  );
}
