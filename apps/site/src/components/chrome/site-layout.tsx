import type { ReactNode } from "react";
import { AppRail, MobileBar } from "./app-rail";
import { Footer } from "./footer";
import { SearchPalette } from "./search-palette";

export function SiteLayout({ children }: { children: ReactNode }) {
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
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <SearchPalette />
      </div>
    </div>
  );
}
