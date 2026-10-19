import { useLocation } from "@tanstack/react-router";
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { ComponentsSidebar } from "../../../components/chrome/components-sidebar";
import { DocsSidebar } from "../../../components/chrome/docs-sidebar";
import { Footer } from "../../../components/chrome/footer";
import { PreviewBanner } from "../../../components/chrome/preview-banner";
import { OPEN_SEARCH_EVENT } from "../../../components/chrome/search-opener";
import { SiteHeader } from "../../../components/chrome/site-header";
import {
  isSlashSearchKey,
  isToggleSearchKey,
} from "../../../systems/search/shortcut";
import { T_BODY_SM, T_LABEL } from "../systems/type-scale";
import { FOCUS_RING, TRANSITION } from "../systems/ui";

const LazySearchPalette = lazy(() =>
  import("../../../components/chrome/search-palette").then((m) => ({
    default: m.SearchPalette,
  })),
);

/**
 * Palette mount — keeps the search index out of the entry chunk.
 *
 * The palette (and through it, the whole content corpus) loads on first
 * open intent (⌘K/Ctrl+K, `/`, header/drawer button) or on idle, whichever
 * comes first. `open` renders it already open (the arming event predates
 * the mount); `ready` preloads it closed. The real palette owns all keys
 * once mounted — this wrapper only arms.
 */
function SearchPaletteMount() {
  const [mode, setMode] = useState<"open" | "ready" | null>(null);
  useEffect(() => {
    const arm = (next: "open" | "ready") =>
      setMode((prev) => (prev === "open" ? prev : next));
    const onEvent = () => arm("open");
    const onKey = (e: KeyboardEvent) => {
      if (
        isToggleSearchKey(e) ||
        isSlashSearchKey(e, e.target as HTMLElement | null)
      ) {
        e.preventDefault();
        arm("open");
      }
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onEvent);
    window.addEventListener("keydown", onKey);
    // Idle preload: the entry stays lean for LCP, and the chunk usually
    // arrives before anyone presses ⌘K. Intent (above) always wins.
    let timer: number | undefined;
    let idleId: number | undefined;
    if ("requestIdleCallback" in window) {
      idleId = (
        window as unknown as {
          requestIdleCallback: (cb: () => void) => number;
        }
      ).requestIdleCallback(() => arm("ready"));
    } else {
      timer = window.setTimeout(() => arm("ready"), 3000);
    }
    return () => {
      window.removeEventListener(OPEN_SEARCH_EVENT, onEvent);
      window.removeEventListener("keydown", onKey);
      if (idleId !== undefined) {
        (
          window as unknown as { cancelIdleCallback: (id: number) => void }
        ).cancelIdleCallback?.(idleId);
      }
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);
  if (mode === null) return null;
  return (
    <Suspense fallback={null}>
      <LazySearchPalette initialOpen={mode === "open"} />
    </Suspense>
  );
}

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
 * The spy line: headings at or above this viewport Y count as "read past".
 * One header height + a small margin, in sync with the scroll-mt the
 * headings use for anchor jumps.
 */
function spyLine(): number {
  const header =
    typeof document !== "undefined"
      ? document.querySelector("header.site-header")
      : null;
  const h = header?.getBoundingClientRect().bottom ?? 0;
  return h + 8;
}

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
 * Sticky beside the content from 1280px up (shadcn/radix keep the rail on
 * desktop; below that the `SectionToc` disclosure covers the page). Items are
 * read from the rendered page DOM, so this works for every docs page without
 * knowing its grammar; the scroll-spy marks the section the reader is in.
 */
function OnThisPageRail({ pathname }: { pathname: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers re-read on route change
  useEffect(() => {
    setItems(readTocItems());
    setActiveId(null);
  }, [pathname]);
  // Scroll-spy: the first heading below the sticky header marks the section
  // the reader is in. A scroll listener with a rAF coalesce is deliberately
  // boring and cheap — one read of getBoundingClientRect per frame batch
  // beats an IntersectionObserver graph that changes with every layout.
  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((item) => item.id);
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= spyLine()) current = id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);
  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className="flex flex-col gap-2">
      <p
        className={`m-0 ${T_LABEL} text-(--sys-color-on-surface-variant) uppercase`}
      >
        On this page
      </p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="m-0 p-0">
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={`block rounded-(--sys-shape-corner-full) px-3 py-1.5 ${T_BODY_SM} no-underline ${TRANSITION} ${FOCUS_RING} ${
                  active
                    ? "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) font-medium"
                    : "text-(--sys-color-on-surface-variant) hover:bg-(--sys-color-surface-container-high) hover:text-(--sys-color-on-surface) hover:underline active:bg-(--sys-color-on-surface)/10"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * "On this page" disclosure for viewports where sidebar tree and right rail
 * are both hidden (below lg). Same DOM-scraped data as the right rail;
 * renders NOTHING from 1280px up, where the rail owns the job, and renders
 * nothing with fewer than two sections. Scrolls with the content since it
 * lives inside `main`.
 */
function SectionToc({ pathname }: { pathname: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers re-read on route change
  useEffect(() => {
    setItems(readTocItems());
  }, [pathname]);
  if (items.length < 2) return null;
  return (
    <details className="rounded-(--sys-shape-corner-extra-large) bg-(--sys-color-surface-container-low) px-4 py-3 xl:hidden">
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
 * Uses the DOCUMENT scroll model: the page grows naturally under the
 * viewport, `main` does not own a scroll container, and the browser's own
 * scrollbar, find, scroll-restoration and full-page capture all behave like
 * an ordinary document (the review's finding: an inner scroll container
 * breaks all four). The chrome is pinned with CSS sticky: header at top,
 * sidebar and TOC rails as sticky self-scrolling columns; `main` grows.
 *
 * Workbench routes opt OUT via `fullHeight`/`fullScreen`: the shell returns
 * to a pinned `h-dvh` layout, `main` gets `h-full overflow-hidden` and the
 * panes own their internal scrolling. `fullScreen` also omits the header so
 * the app owns the whole screen.
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
        className={`site-shell flex bg-(--sys-color-surface-container-low) flex-col ${isFullHeight ? "h-dvh" : "min-h-dvh"}`}
        data-chrome="content"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          {!fullScreen ? (
            <div
              className={`site-chrome shrink-0 ${isFullHeight ? "" : "sticky top-0 z-30"}`}
            >
              <SiteHeader />
              <PreviewBanner />
            </div>
          ) : null}

          {/* Body row — items-start so the sticky rails can pin instead of
            stretching; min-h-0 only matters in the pinned full-height mode. */}
          <div
            className={`site-body flex ${isFullHeight ? "min-h-0 flex-1" : "items-start"}`}
          >
            {/* Left sidebar — sticky, viewport-height, its own scroll.
              The M3 sidebar surface: `bg-surface`, hairline `border-e`. */}
            {withSidebar ? (
              <aside
                className={`site-sidebar hidden w-60 shrink-0 overflow-hidden lg:block ${
                  isFullHeight
                    ? "overflow-hidden"
                    : "sticky top-[var(--site-header-h)] max-h-[calc(100dvh-var(--site-header-h))] overflow-y-auto"
                }`}
              >
                <div
                  className={
                    isFullHeight
                      ? "h-full overflow-y-auto px-3 py-6"
                      : "px-3 py-6"
                  }
                >
                  {isComponents ? <ComponentsSidebar /> : <DocsSidebar />}
                </div>
              </aside>
            ) : null}

            {/* Main — grows naturally (document scroll); pinned + hidden
                overflow in the full-height workbench mode. */}
            <main
              id="main"
              className={`site-main flex min-w-0 flex-1 flex-col ${isFullHeight ? "h-full overflow-hidden" : ""} ${withSidebar ? "site-main-docs" : ""}`}
              tabIndex={-1}
            >
              {/* Tablet/phone fallback for the sidebar tree and TOC: these
                live inside `main` so they scroll with the content; below xl
                the rail is hidden and this disclosure takes over. */}
              {withSidebar ? <SectionToc pathname={pathname} /> : null}
              {children}
              {!isFullHeight ? <Footer /> : null}
            </main>

            {/* Right TOC — sticky, from 1280px it shadows shadcn/radix. */}
            {withSidebar ? (
              <aside
                className={`site-toc hidden w-48 shrink-0 xl:block ${
                  isFullHeight
                    ? "hidden"
                    : "sticky top-[var(--site-header-h)] max-h-[calc(100dvh-var(--site-header-h))] overflow-y-auto"
                }`}
              >
                <div className="px-4 py-6">
                  <OnThisPageRail pathname={pathname} />
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
      {/* SearchPalette is outside the shell — it is a modal overlay. */}
      <SearchPaletteMount />
    </>
  );
}
