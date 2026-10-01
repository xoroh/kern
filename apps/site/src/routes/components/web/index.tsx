import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@xoroh/kern";
import { SiteLayout } from "../../../components/chrome/site-layout";
import { WEB_DEMO_COUNT, WEB_EXPORT_COUNT } from "../../../demos/web/registry";
import { componentsOn } from "../../../generated/manifest";

export const Route = createFileRoute("/components/web/")({
  component: WebComponents,
});

function WebComponents() {
  const components = componentsOn("web");

  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <p className="m-0 text-sm font-medium tracking-[0.18em] text-(--md-sys-color-on-surface-variant) uppercase">
              Components / Web
            </p>
            <h1 className="m-0 text-3xl font-semibold text-(--md-sys-color-on-surface)">
              Web components
            </h1>
            <p className="m-0 font-mono text-sm text-(--md-sys-color-secondary)">
              @xoroh/kern
            </p>
            <p className="m-0 text-(--md-sys-color-on-surface-variant)">
              React on Base UI. Compound parts, typed variants, and Tailwind
              class overrides. Every one of the{" "}
              <strong>{WEB_EXPORT_COUNT}</strong> exports below has a live page
              with its real variants and states —{" "}
              <strong>{WEB_DEMO_COUNT}</strong> are live,{" "}
              {WEB_EXPORT_COUNT - WEB_DEMO_COUNT === 0
                ? "none are stubs"
                : "the rest are listed with a reason"}
              .
            </p>
          </header>

          <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <li key={component.slug}>
                <Link
                  to="/components/$platform/$component"
                  params={{
                    platform: component.platform,
                    component: component.name,
                  }}
                  className="flex items-center justify-between gap-2 rounded-(--md-sys-shape-corner-small) px-3 py-2 text-sm text-(--md-sys-color-on-surface) no-underline hover:bg-(--md-sys-color-surface-container)"
                >
                  <span className="truncate">{component.name}</span>
                  {component.status === "stub" ? <Badge>stub</Badge> : null}
                </Link>
              </li>
            ))}
          </ul>

          <p className="m-0 text-sm text-(--md-sys-color-on-surface-variant)">
            <Link to="/components">← All platforms</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
