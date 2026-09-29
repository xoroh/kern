import { buttonVariants, cn, useKernTheme } from "@xoroh/kern";
import type { ReactNode } from "react";
import { AppRail } from "./app-rail";
import { Footer } from "./footer";

function MobileBar() {
  const { mode, toggle } = useKernTheme();
  return (
    <header className="flex h-14 items-center justify-between px-4 md:hidden">
      <a
        href="/"
        className="flex items-center gap-2 font-semibold text-(--md-sys-color-on-surface) no-underline"
      >
        <span
          aria-hidden="true"
          className="inline-block size-2.5 rounded-full bg-(--md-sys-color-primary)"
        />
        Kern
      </a>
      <nav className="flex items-center gap-1" aria-label="Primary">
        <a
          href="/components"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "no-underline",
          )}
        >
          Components
        </a>
        <button
          type="button"
          onClick={toggle}
          className={cn(
            buttonVariants({ variant: "tonal", size: "sm" }),
            "cursor-pointer border-0",
          )}
          aria-label={
            mode === "light" ? "Switch to dark theme" : "Switch to light theme"
          }
        >
          {mode === "light" ? "Dark" : "Light"}
        </button>
      </nav>
    </header>
  );
}

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
      <div className="flex min-h-screen flex-col md:pl-20">
        <MobileBar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
