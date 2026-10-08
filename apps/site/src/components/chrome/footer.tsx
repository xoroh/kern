/**
 * Fat footer — four wayfinding columns over a license bar.
 *
 * The old single-row footer linked nine destinations in one wrapping line; a
 * reader scanning for "where is X" had to read the whole row. The columns
 * group the same destinations the way the nav source groups them, and every
 * href the old footer carried is still here — check-nav counts the footer as
 * a chrome surface that keeps routes reachable, so dropping one would orphan
 * its route.
 *
 * Column labels are plain text, not headings: they are wayfinding, not
 * document structure, and check-headings requires an id on every h2/h3.
 */
import { REPO_LICENSE } from "../../generated/changelog";
import { T_BODY_MD, T_BODY_SM, T_LABEL } from "../../domains/shared/systems/type-scale";
import { VersionSelector } from "./version-selector";

const COLUMNS: { label: string; links: { label: string; href: string }[] }[] =
  [
    {
      label: "Foundations",
      links: [
        { label: "Foundations", href: "/foundations" },
        { label: "Theme", href: "/foundations/theme" },
        { label: "Accessibility", href: "/foundations/accessibility" },
        { label: "Icons", href: "/foundations/icons" },
      ],
    },
    {
      label: "Components",
      links: [
        { label: "All components", href: "/components" },
        { label: "Web", href: "/components/web" },
        { label: "Native", href: "/components/mobile" },
        { label: "Showcase", href: "/showcase" },
      ],
    },
    {
      label: "Resources",
      links: [
        { label: "Docs", href: "/docs" },
        { label: "Guides", href: "/docs/guides" },
        { label: "API reference", href: "/docs/api" },
        { label: "Getting started", href: "/getting-started" },
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
        { label: "xoroh.org", href: "https://xoroh.org" },
      ],
    },
  ];

const LINK =
  "text-(--md-sys-color-on-surface-variant) no-underline hover:text-(--md-sys-color-on-surface)";

export function Footer() {
  return (
    <footer className="mt-3 border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface)">
      <div className="mx-auto w-full max-w-[80rem] px-6 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <nav key={column.label} aria-label={`Footer — ${column.label}`}>
              <p
                className={`m-0 ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
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
          className={`mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-(--md-sys-color-outline-variant) pt-6 ${T_BODY_SM}`}
        >
          <p className="m-0 flex items-center gap-3 text-(--md-sys-color-on-surface-variant)">
            Kern by Xoroh · {REPO_LICENSE} License
            <VersionSelector />
          </p>
          <p className="m-0 text-(--md-sys-color-on-surface-variant)">
            Components, tokens and docs from one source.
          </p>
        </div>
      </div>
    </footer>
  );
}
