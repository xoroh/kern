/**
 * The per-component page, rendered from the content contract.
 *
 * Section order is fixed and comes from `docs/conventions/component-docs.md`:
 * metadata strip → showcase → features → customization → deviations → API.
 * The order is not a style preference — it is the order a reader needs the
 * information, and it is what lets a page be checked by a gate rather than
 * reviewed by eye. Do not reorder these headings; `scripts/check-docs.mjs`
 * asserts the data that backs them, and this file asserts the order.
 *
 * Conditional sections (Customization, Deviations) render only when the data
 * carries them. A page with an empty section is noise, and the convention says
 * to cut it rather than ship a heading with nothing under it.
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

const H2 = "m-0 text-xl font-semibold text-(--md-sys-color-on-surface)";
const BODY = "m-0 text-(--md-sys-color-on-surface-variant)";
const CHIP =
  "inline-flex items-center gap-1.5 rounded-full border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) px-3 py-1 font-mono text-xs text-(--md-sys-color-on-surface-variant)";

function elevationLabel(elevation: RestingElevation): string {
  return elevation === "surface" ? "Surface" : `Level ${elevation}`;
}

/** Section 1 — the metadata strip. One row of facts, above the fold. */
function MetadataStrip({ doc }: { doc: ComponentDoc }) {
  const { meta } = doc;
  return (
    <dl className="m-0 flex flex-wrap items-center gap-2">
      <Chip term="Status" value={meta.status} />
      <Chip term="Package" value={meta.package} />
      <Chip term="Native peer" value={meta.nativePeer} />
      <Chip term="Elevation" value={elevationLabel(meta.elevation)} />
      {meta.variants.length === 0 ? (
        <Chip term="Variants" value="none" />
      ) : (
        meta.variants.map((axis) => <Chip key={axis} term="" value={axis} />)
      )}
    </dl>
  );
}

function Chip({ term, value }: { term: string; value: string }) {
  return (
    <div className={CHIP}>
      {term ? (
        <span className="text-(--md-sys-color-on-surface)">
          {term}: {value}
        </span>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

/**
 * Section 2 — the showcase. Live, interactive, from the package. Not a
 * screenshot, not a code fence, not a reimplementation.
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
  return (
    <section className="flex flex-col gap-3" aria-label="Showcase">
      <h2 className={H2}>Showcase</h2>
      {live ? (
        live()
      ) : (
        <p className={BODY}>
          No live demo is registered for <code>{doc.parts[0]}</code>. That is a
          gap in the site, not in the package — it is tracked rather than hidden
          here.
        </p>
      )}
    </section>
  );
}

/** Section 3 — Features. The only section allowed to persuade. */
function Features({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className={H2}>Features</h2>
      <p className={`${BODY} max-w-[62ch] leading-relaxed`}>{doc.features}</p>
    </section>
  );
}

/** Section 4 — Customization. Conditional: the "not supported" half is the point. */
function Customization({ doc }: { doc: ComponentDoc }) {
  const custom = doc.customization;
  if (!custom) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className={H2}>Customization</h2>
      <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
        {custom.supported.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {custom.notSupported.length > 0 && (
        <>
          <h3 className="m-0 text-base font-semibold text-(--md-sys-color-on-surface)">
            Not supported
          </h3>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {custom.notSupported.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/**
 * Section 5 — Deviations. Conditional. Every entry names its registered id:
 * a deviation with no id is an undocumented fork, and the validator rejects it.
 */
function Deviations({ doc }: { doc: ComponentDoc }) {
  const rows = doc.deviations;
  if (!rows || rows.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className={H2}>Differences from M3</h2>
      <p className={BODY}>
        Strict to M3 by default. Anything below is a deliberate kern decision,
        registered with an id so it can be audited rather than discovered.
      </p>
      <ul className="m-0 flex flex-col gap-4">
        {rows.map((row) => (
          <DeviationRow key={row.id} row={row} />
        ))}
      </ul>
    </section>
  );
}

function DeviationRow({ row }: { row: Deviation }) {
  return (
    <li className="flex flex-col gap-2 rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container) p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-(--md-sys-color-secondary-container) px-2.5 py-0.5 font-mono text-xs text-(--md-sys-color-on-secondary-container)">
          {row.id}
        </span>
      </div>
      <dl className="m-0 grid grid-cols-1 gap-2 sm:grid-cols-[6rem_1fr]">
        <dt className="m-0 text-sm font-medium text-(--md-sys-color-on-surface)">
          M3
        </dt>
        <dd className={`m-0 text-sm ${BODY}`}>{row.m3}</dd>
        <dt className="m-0 text-sm font-medium text-(--md-sys-color-on-surface)">
          kern
        </dt>
        <dd className={`m-0 text-sm ${BODY}`}>{row.kern}</dd>
        <dt className="m-0 text-sm font-medium text-(--md-sys-color-on-surface)">
          Why
        </dt>
        <dd className={`m-0 text-sm ${BODY}`}>{row.why}</dd>
      </dl>
    </li>
  );
}

/** Section 6 — the API tail: anatomy, props, ARIA contract. */
function Api({ doc }: { doc: ComponentDoc }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className={H2}>API</h2>
      {doc.anatomy && doc.anatomy.length > 0 && (
        <>
          <h3 className="m-0 text-base font-semibold text-(--md-sys-color-on-surface)">
            Anatomy
          </h3>
          <ul className="m-0 flex flex-col gap-2">
            {doc.anatomy.map((part) => (
              <AnatomyRow key={part.name} part={part} />
            ))}
          </ul>
        </>
      )}
      <h3 className="m-0 text-base font-semibold text-(--md-sys-color-on-surface)">
        Props
      </h3>
      <PropsTable rows={doc.api} />
      {doc.aria && doc.aria.length > 0 && (
        <>
          <h3 className="m-0 text-base font-semibold text-(--md-sys-color-on-surface)">
            Accessibility
          </h3>
          <ul className={`m-0 flex flex-col gap-2 pl-5 ${BODY}`}>
            {doc.aria.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function AnatomyRow({ part }: { part: PartRow }) {
  return (
    <li className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <code className="shrink-0 font-mono text-sm text-(--md-sys-color-secondary)">
        {part.name}
      </code>
      <span className={`text-sm ${BODY}`}>{part.role}</span>
    </li>
  );
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-(--md-sys-color-outline-variant)">
            <th className="py-2 pr-4 font-medium text-(--md-sys-color-on-surface)">
              Prop
            </th>
            <th className="py-2 pr-4 font-medium text-(--md-sys-color-on-surface)">
              Type
            </th>
            <th className="py-2 pr-4 font-medium text-(--md-sys-color-on-surface)">
              Default
            </th>
            <th className="py-2 font-medium text-(--md-sys-color-on-surface)">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-b border-(--md-sys-color-outline-variant) align-top"
            >
              <td className="py-3 pr-4">
                <code className="font-mono text-(--md-sys-color-on-surface)">
                  {row.name}
                </code>
                {row.required && (
                  <span className="ml-2 text-xs text-(--md-sys-color-error)">
                    required
                  </span>
                )}
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-(--md-sys-color-on-surface-variant)">
                {row.type}
              </td>
              <td className="py-3 pr-4 font-mono text-xs text-(--md-sys-color-on-surface-variant)">
                {row.default ?? "—"}
              </td>
              <td className={`py-3 text-sm ${BODY}`}>{row.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * The page. Sections render in the grammar's order and no other order.
 */
export function ComponentPage({
  doc,
  platform,
}: {
  doc: ComponentDoc;
  platform: Platform;
}) {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <h1 className="m-0 text-3xl font-semibold text-(--md-sys-color-on-surface)">
          {doc.name}
        </h1>
        <p className="m-0 max-w-[62ch] text-lg text-(--md-sys-color-on-surface-variant)">
          {doc.oneLiner}
        </p>
        <MetadataStrip doc={doc} />
      </header>

      <Showcase doc={doc} platform={platform} />
      <Features doc={doc} />
      <Customization doc={doc} />
      <Deviations doc={doc} />
      <Api doc={doc} />
    </article>
  );
}
