import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "../../components/chrome/site-layout";

export const Route = createFileRoute("/docs/")({ component: DocsIndex });

function DocsIndex() {
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[48rem] flex-col gap-6 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
            Docs
          </p>
          <h1
            className="m-0"
            style={{
              fontFamily: "var(--kern-font-family)",
              fontSize: "var(--md-sys-typescale-headline-large-font-size)",
              lineHeight: "var(--md-sys-typescale-headline-large-line-height)",
              letterSpacing:
                "var(--md-sys-typescale-headline-large-letter-spacing)",
              fontWeight: "var(--md-sys-typescale-headline-large-font-weight)",
            }}
          >
            Documentation
          </h1>
          <p className="m-0 text-(--md-sys-color-on-surface-variant)">
            Guides and concepts. Start with the install, then move to the
            component references.
          </p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li>
              <Link to="/getting-started">Getting started</Link> — install,
              theme, first component
            </li>
            <li>
              <Link to="/theme">Theme</Link> — tokens, roles, presets
            </li>
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
