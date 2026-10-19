/**
 * Fat footer — the tonal end-band: brand block + four wayfinding columns.
 *
 * v2 redesign: the footer sits on `surface-container-low` (the tonal band
 * that closes every page — sections separate by tone, not shadow), leads
 * with the brand lockup and the one-line promise, then the same four
 * grouped columns. Every href the old footer carried is still here —
 * check-nav counts the footer as a chrome surface that keeps routes
 * reachable, so dropping one would orphan its route.
 *
 * The version pill now lives ONLY in the header (one instance of any datum
 * per page — v2 dedupe).
 *
 * Column labels are plain text, not headings: they are wayfinding, not
 * document structure, and check-headings requires an id on every h2/h3.
 */

import {
  T_BODY,
  T_BODY_MD,
  T_BODY_SM,
  T_LABEL,
  T_SUB,
} from "../../domains/shared/systems/type-scale";
import { REPO_LICENSE } from "../../generated/changelog";

const COLUMNS: { label: string; links: { label: string; href: string }[] }[] = [
  {
    label: "Docs",
    links: [
      { label: "Getting started", href: "/docs/getting-started" },
      { label: "Design systems", href: "/foundations" },
      { label: "Material 3", href: "/foundations/m3" },
      { label: "Color", href: "/foundations/m3/color" },
      { label: "Typography", href: "/foundations/m3/type" },
      { label: "Theme", href: "/foundations/m3/theme" },
      { label: "Guides", href: "/docs/guides" },
    ],
  },
  {
    label: "Components",
    links: [
      { label: "All components", href: "/components" },
      { label: "API reference", href: "/reference" },
      { label: "Blocks", href: "/showcase" },
      { label: "Patterns", href: "/patterns" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Playground", href: "/playground" },
      { label: "Icons", href: "/foundations/icons" },
      { label: "Accessibility", href: "/foundations/accessibility" },
      { label: "API utilities", href: "/docs/api" },
      { label: "Primitives", href: "/primitives" },
      { label: "Tooling", href: "/docs/use-cases" },
    ],
  },
  {
    label: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "Changelog", href: "/changelog" },
      { label: "Community", href: "/community" },
      { label: "License", href: "/legal/license" },
      { label: "Security", href: "/legal/security" },
      { label: "GitHub", href: "https://github.com/xoroh/kern" },
    ],
  },
];

const LINK =
  "text-(--sys-color-on-surface-variant) no-underline hover:text-(--sys-color-on-surface)";

export function Footer() {
  return (
    <footer className="site-footer mt-12 bg-(--sys-color-surface-container-low)">
      <div className="mx-auto w-full max-w-[80rem] px-6 py-12 sm:px-8">
        {/* Brand block — the footer's own header, so the band reads as a
            closing statement rather than a link dump. */}
        <div className="mb-10 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`flex size-8 items-center justify-center rounded-(--sys-shape-corner-small) bg-(--sys-color-primary) text-(--sys-color-on-primary) ${T_BODY_MD}`}
            >
              K
            </span>
            <p className={`m-0 ${T_SUB} text-(--sys-color-on-surface)`}>
              Kern{" "}
              <span className="text-(--sys-color-on-surface-variant)">
                by Xoroh
              </span>
            </p>
          </div>
          <p
            className={`m-0 max-w-[52ch] ${T_BODY} text-(--sys-color-on-surface-variant)`}
          >
            Material 3 components, DTCG tokens, and agent-first docs for React
            and React Native — from one source.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <nav key={column.label} aria-label={`Footer — ${column.label}`}>
              <p
                className={`m-0 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
              >
                {column.label}
              </p>
              <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
                {column.links.map((link) => (
                  <li key={link.href} className="m-0 p-0">
                    <a href={link.href} className={`${T_BODY_MD} ${LINK}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div
          className={`mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 ${T_BODY_SM}`}
        >
          <p className="m-0 text-(--sys-color-on-surface-variant)">
            Kern by Xoroh · {REPO_LICENSE} License
          </p>
          <p className="m-0 text-(--sys-color-on-surface-variant)">
            Components, tokens and docs from one source.
          </p>
        </div>
      </div>
    </footer>
  );
}
