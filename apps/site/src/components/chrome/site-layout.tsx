import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppRail, MobileBar } from "./app-rail";
import { DocsSidebar } from "./docs-sidebar";
import { Footer } from "./footer";
import { SearchPalette } from "./search-palette";

/**
 * Docs-section paths render with the section sidebar tree. The rail covers the
 * five top-level destinations; it does not map the docs section, so these
 * paths get the tree. Anything else renders full-width.
 */
const SIDEBAR_PREFIXES = [
  "/docs",
  "/components",
  "/styles",
  "/theme",
  "/icons",
  "/accessibility",
  "/getting-started",
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const withSidebar = SIDEBAR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return (
    <div className="min-h-screen bg-(--md-sys-color-surface-container)">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-(--md-sys-shape-corner-full) focus:bg-(--md-sys-color-primary) focus:px-4 focus:py-2 focus:text-sm focus:text-(--md-sys-color-on-primary) focus:no-underline"
      >
        Skip to content
      </a>
      <AppRail />
      <div className="flex flex-col md:pl-20">
        <MobileBar />
        {/* Content fills the viewport so the footer starts below the fold —
            only reachable by scrolling. */}
        {withSidebar ? (
          <div className="mx-auto flex w-full max-w-[80rem] gap-8 px-4 sm:px-6">
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
        <SearchPalette />
      </div>
    </div>
  );
}
