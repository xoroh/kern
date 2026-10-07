import { useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AppRail } from "./app-rail";
import { DocsSidebar } from "./docs-sidebar";
import { Footer } from "./footer";
import { SearchPalette } from "./search-palette";
import { SiteHeader } from "./site-header";
import { T_BODY_SM, T_LABEL } from "../../systems/type-scale";

/**
 * Docs-section paths render with the section sidebar tree. The header covers
 * the top-level destinations; it does not map the docs section, so these
 * paths get the tree. Anything else renders full-width.
 */
const SIDEBAR_PREFIXES = [
  "/docs",
  "/components",
  "/foundations",
  "/getting-started",
];

/**
 * "On this page" for viewports where the sidebar tree is hidden (below lg,
 * i.e. phones and the 768–1024 tablet band).
 *
 * The items are read from the rendered page — every `h2[id]` inside `#main`
 * — so the disclosure can never list a section that is not there, and pages
 * with fewer than two sections render nothing rather than a one-item menu.
 * Component-page headings carry an explicit permalink `#`, which is stripped
 * from the label.
 */
function SectionToc({ pathname }: { pathname: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) {
      setItems([]);
      return;
    }
    setItems(
      [...main.querySelectorAll("h2[id]")]
        .map((h) => ({
          id: h.id,
          text: (h.textContent ?? "").replace(/#$/, "").trim(),
        }))
        .filter((item) => item.id !== "" && item.text !== ""),
    );
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
      {/* The header is the primary chrome on every page. The rail renders
          alongside it on docs-context pages only — it is offset into the
          content column so the two never overlap. */}
      {withSidebar ? <AppRail /> : null}
      {/* data-chrome marks the regions the search palette makes inert while
          it is open. The palette itself renders outside them (below), so
          insetting the page never traps the dialog it is trying to show. */}
      <div
        className={withSidebar ? "flex flex-col md:pl-20" : "flex flex-col"}
        data-chrome="content"
      >
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
                <DocsSidebar />
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
