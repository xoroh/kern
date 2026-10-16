import { useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { ComponentsSidebar } from "../../../components/chrome/components-sidebar";
import { DocsSidebar } from "../../../components/chrome/docs-sidebar";
import { Footer } from "../../../components/chrome/footer";
import { PreviewBanner } from "../../../components/chrome/preview-banner";
import { SearchPalette } from "../../../components/chrome/search-palette";
import { SiteHeader } from "../../../components/chrome/site-header";
import { T_BODY_SM, T_LABEL } from "../systems/type-scale";

/**
 * Docs-section paths render with the three-column layout: left sidebar tree,
 * centred content, right "On this page" TOC. Foundations is part of the Docs
 * tree (not a header tab), so /foundations/* joins the sidebar prefixes.
 * /docs/getting-started is a docs section page, so it renders with the
 * sidebar tree. Anything else renders full-width.
 */
const SIDEBAR_PREFIXES = [
  "/docs",
  "/components",
  "/foundations",
  "/primitives",
  "/styles",
  "/reference",
];

/**
 * Read `h2[id]` items from `#main` — the shared TOC data source for both
 * the right rail (desktop) and the disclosure (small screens). Reading the
 * rendered DOM means the TOC can never list a section that is not there,
 * and pages with fewer than two sections render nothing rather than a
 * one-item menu. Component-page headings carry an explicit permalink `#`,
 * which is stripped from the label.
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

/**
 * "On this page" — the right rail (desktop TOC).
 *
 * Sticky beside the content, hidden below `xl` so it never competes with
 * the `SectionToc` disclosure that covers narrow viewports. Items are read
 * from the rendered page DOM, so this works for every docs page without
 * knowing its grammar.
 */
function OnThisPageRail({ pathname }: { pathname: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers re-read on route change
  useEffect(() => {
    setItems(readTocItems());
  }, [pathname]);
  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className="flex flex-col gap-2">
      <p
        className={`m-0 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
      >
        On this page
      </p>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((item) => (
          <li key={item.id} className="m-0 p-0">
            <a
              href={`#${item.id}`}
              className={`block rounded-(--sys-shape-corner-full) px-3 py-1.5 ${T_BODY_SM} text-(--sys-color-on-surface-variant) no-underline hover:bg-(--sys-color-surface-container-high) hover:text-(--sys-color-on-surface) hover:underline active:bg-(--sys-color-on-surface)/12`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * "On this page" disclosure for viewports where the sidebar tree and right
 * rail are both hidden (below lg). Same DOM-scraped data as the right rail;
 * renders nothing with fewer than two sections. Scrolls with the content
 * since it lives inside `main`.
 */
function SectionToc({ pathname }: { pathname: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers re-read on route change
  useEffect(() => {
    setItems(readTocItems());
  }, [pathname]);
  if (items.length < 2) return null;
  return (
    <details className="rounded-(--sys-shape-corner-large-increased) bg-(--sys-color-surface-container-low) px-4 py-3 2xl:hidden">
      <summary
        className={`cursor-pointer ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
      >
        On this page
      </summary>
      <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
        {items.map((item) => (
          <li key={item.id} className="m-0 p-0">
            <a
              href={`#${item.id}`}
              className={`block py-1 ${T_BODY_SM} text-(--sys-color-secondary) no-underline hover:underline`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * SiteLayout — the app shell.
 *
 * Uses the kern `AppShell` scroll model: `h-dvh` on the root so the page
 * never grows past the viewport, `min-h-0` on the body row so content can
 * shrink, and exactly one `overflow-auto` on `main` — the only scrolling
 * element. The header is a structurally pinned flex sibling above the body
 * row; the sidebars are `shrink-0` with independent `overflow-y-auto` inners.
 * The footer lives inside `main` so it scrolls with the content.
 *
 * When `fullHeight` or `fullScreen` is true, `main` does not scroll (`overflow-hidden`, no footer)
 * allowing full-bleed workbench apps (like Playground) to handle their
 * own internal pane-level scrolling without moving the outer page.
 * When `fullScreen` is true, the site header is omitted so the app owns the entire screen.
 */
export function SiteLayout({
  children,
  fullHeight = false,
  fullScreen = false,
}: {
  children: ReactNode;
  fullHeight?: boolean;
  fullScreen?: boolean;
}) {
  const { pathname } = useLocation();
  const isFullHeight = fullHeight || fullScreen;
  const withSidebar =
    !fullScreen &&
    SIDEBAR_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  const isComponents = !fullScreen && pathname.startsWith("/components");
  return (
    <>
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-(--sys-shape-corner-full) focus:bg-(--sys-color-primary) focus:px-4 focus:py-2 ${T_BODY_SM} focus:text-(--sys-color-on-primary) focus:no-underline`}
      >
        Skip to content
      </a>
      {/* data-chrome marks the regions the search palette makes inert while
          it is open. The palette itself renders outside them (below), so
          insetting the page never traps the dialog it is trying to show. */}
      <div
        className="site-shell flex h-dvh bg-(--sys-color-surface-container-low)"
        data-chrome="content"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          {!fullScreen ? <SiteHeader /> : null}
          {!fullScreen ? <PreviewBanner /> : null}

          {/* Body row — min-h-0 lets the content region shrink so overflow
            routes to `main`'s scroll container instead of expanding the shell. */}
          <div className="site-body flex min-h-0 flex-1">
            {/* Left sidebar — shrink-0, fixed width, independent scroll.
              The M3 sidebar surface: `bg-surface`, `border-e` hairline,
              inner list scrolls without moving the shell. */}
            {withSidebar ? (
              <aside className="site-sidebar hidden w-60 shrink-0 overflow-hidden lg:block">
                <div className="h-full overflow-y-auto px-3 py-6">
                  {isComponents ? <ComponentsSidebar /> : <DocsSidebar />}
                </div>
              </aside>
            ) : null}

            {/* Main — THE scroll container. When isFullHeight is set, main fits exact height
                without scrolling, and inner panes manage their own overflow-y-auto. */}
            <main
              id="main"
              className={`site-main flex min-w-0 flex-1 flex-col ${isFullHeight ? "h-full overflow-hidden" : "overflow-auto"} ${withSidebar ? "site-main-docs" : ""}`}
              tabIndex={-1}
            >
              {/* Tablet/phone fallback for the sidebar tree and TOC: these
                live inside `main` so they scroll with the content. */}
              {withSidebar ? <SectionToc pathname={pathname} /> : null}
              {children}
              {!isFullHeight ? <Footer /> : null}
            </main>

            {/* Right TOC — shrink-0, fixed width, independent scroll. */}
            {withSidebar ? (
              <aside className="site-toc hidden w-48 shrink-0 overflow-hidden 2xl:block">
                <div className="h-full overflow-y-auto px-4 py-6">
                  <OnThisPageRail pathname={pathname} />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
      {/* SearchPalette is outside the shell — it is a modal overlay. */}
      <SearchPalette />
    </>
  );
}
