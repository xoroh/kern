import { useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { ComponentsSidebar } from "../../../components/chrome/components-sidebar";
import { DocsSidebar } from "../../../components/chrome/docs-sidebar";
import { Footer } from "../../../components/chrome/footer";
import { SearchPalette } from "../../../components/chrome/search-palette";
import { SiteHeader } from "../../../components/chrome/site-header";
import { T_BODY_SM, T_LABEL } from "../systems/type-scale";

/**
 * Docs-section paths render with the section sidebar tree. The header covers
 * the five hub destinations (Foundations, Components, Patterns, Playground,
 * Showcase) with its primary tabs, so hub pages — including every
 * /foundations/* page — render full-width with no second tree stacked
 * beside the in-page family nav. /getting-started is a guide, not a docs
 * section, so it renders full-width too. Anything else renders full-width.
 */
const SIDEBAR_PREFIXES = ["/docs", "/components"];

/**
 * "On this page" for viewports where the sidebar tree is hidden (below lg,
 * i.e. phones and the 768–1024 tablet band, where the hamburger + drawer
 * carry navigation).
 *
 * The items are read from the rendered page — every `h2[id]` inside `#main`
 * — so the disclosure can never list a section that is not there, and pages
 * with fewer than two sections render nothing rather than a one-item menu.
 * Component-page headings carry an explicit permalink `#`, which is stripped
 * from the label.
 *
 * The initial state reads the DOM synchronously (client only — SSR has no
 * document, so the server renders nothing) so the first client paint already
 * lists the sections instead of popping them in after hydration. The effect
 * re-reads on client-side navigation, where the DOM has already swapped
 * beneath the mounted shell.
 */
function readTocItems(): { id: string; text: string }[] {
  if (typeof document === "undefined") return [];
  const main = document.getElementById("main");
  if (!main) return [];
  return [...main.querySelectorAll("h2[id]")]
    .map((h) => ({
      id: h.id,
      text: (h.textContent ?? "").replace(/#$/, "").trim(),
    }))
    .filter((item) => item.id !== "" && item.text !== "");
}

function SectionToc({ pathname }: { pathname: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>(() =>
    readTocItems(),
  );
  useEffect(() => {
    setItems(readTocItems());
  }, [pathname]);
  if (items.length < 2) return null;
  return (
    <details className="rounded-(--md-sys-shape-corner-medium) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-low) px-4 py-3 lg:hidden">
      <summary
        className={`cursor-pointer ${T_LABEL} text-(--md-sys-color-on-surface-variant) uppercase`}
      >
        On this page
      </summary>
      <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
        {items.map((item) => (
          <li key={item.id} className="m-0 p-0">
            <a
              href={`#${item.id}`}
              className={`block py-1 ${T_BODY_SM} text-(--md-sys-color-primary) no-underline hover:underline`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const withSidebar = SIDEBAR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return (
    <div className="min-h-screen bg-(--md-sys-color-surface-container)">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-(--md-sys-shape-corner-full) focus:bg-(--md-sys-color-primary) focus:px-4 focus:py-2 ${T_BODY_SM} focus:text-(--md-sys-color-on-primary) focus:no-underline`}
      >
        Skip to content
      </a>
      {/* The header is the primary chrome on every page — primary tabs,
          search, theme, and CTA — with the footer closing it. Docs-context
          pages add the section sidebar tree beside the content; there is no
          side app rail: it duplicated the header's five hub tabs. Below lg
          the hamburger + drawer carry every destination, so exactly one
          navigation surface owns each viewport and the two never overlap. */}
      {/* data-chrome marks the regions the search palette makes inert while
          it is open. The palette itself renders outside them (below), so
          insetting the page never traps the dialog it is trying to show. */}
      <div className="flex flex-col" data-chrome="content">
        <SiteHeader />
        {/* Content fills the viewport so the footer starts below the fold —
            only reachable by scrolling. */}
        {withSidebar ? (
          <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:gap-8">
            {/* Tablet/phone fallback for the sidebar tree: the aside below
                stays hidden until lg, and this disclosure covers the band
                under it. Desktop readers never see it. */}
            <SectionToc pathname={pathname} />
            <aside className="hidden w-56 shrink-0 py-8 lg:block">
              <div className="sticky top-8">
                {pathname === "/components" ||
                pathname.startsWith("/components/") ? (
                  <ComponentsSidebar />
                ) : (
                  <DocsSidebar />
                )}
              </div>
            </aside>
            <main id="main" className="min-h-screen min-w-0 flex-1">
              {children}
            </main>
          </div>
        ) : (
          <main id="main" className="min-h-screen">
            {children}
          </main>
        )}
        <Footer />
      </div>
      <SearchPalette />
    </div>
  );
}
