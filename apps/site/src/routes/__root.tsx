import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import interLatinUrl from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import appCss from "../styles.css?url";
import { Kicker } from "../components/chrome/kicker";
import { SiteLayout } from "../components/chrome/site-layout";
import { T_BODY, T_LABEL_LG, T_PAGE } from "../systems/type-scale";
import { pageMeta, SITE_DESCRIPTION } from "../systems/seo";

/**
 * First-paint theme init — the P0 flash fix.
 *
 * `useKernTheme` (packages/kern web-theme.ts) resolves the mode client-side
 * in an effect, so a dark/system-dark visitor's first paint is light until
 * React hydrates and the effect applies `.dark`. This inline blocking script
 * runs before first paint and applies the same decision the hook will reach:
 * the persisted `kern-tokens-mode` preference, else the OS setting — the
 * same `dark` class toggle `applyKernTheme` performs, plus `color-scheme`
 * so native controls (selects, checkboxes) paint their dark face too.
 *
 * It renders as a literal tag in the document shell (RootDocument below),
 * NOT through TanStack `head()` scripts: a `scripts` entry on the root
 * route perturbs the router's global match inference (an unrelated
 * $component beforeLoad then fails typecheck demanding a `never` return),
 * and shell placement is the honest semantics anyway — the init runs once
 * per document load, covering every mode-branched render (all pages, the
 * 404) while client-side navigations keep the already-resolved class.
 */
const THEME_INIT = `(function(){try{var s=localStorage.getItem("kern-tokens-mode");var m=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",m==="dark");r.style.colorScheme=m;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...pageMeta("Kern by Xoroh", SITE_DESCRIPTION),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // The Inter variable font arrives through a chained @import
      // (styles.css → kern-tokens theme → fontsource CSS), so the browser
      // discovers it late and text paints in the fallback first. Preloading
      // the latin subset — the one every page needs — starts the fetch with
      // the document instead of after the CSS chain resolves.
      {
        rel: "preload",
        href: interLatinUrl,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
    ],
  }),
  shellComponent: RootDocument,
  // Without this the not-found path renders an empty document shell with a 200.
  notFoundComponent: NotFound,
});

function NotFound() {
  // The 404 keeps full site chrome (header tabs, footer, ⌘K) — a bare
  // chromeless page strands the reader with no way sideways. It renders
  // full-width: it is not a docs section, so no sidebar tree.
  return (
    <SiteLayout>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--md-sys-color-surface-container) p-8 text-center">
        <Kicker>404</Kicker>
        <h1 className={`m-0 ${T_PAGE} text-(--md-sys-color-on-surface)`}>
          No such page
        </h1>
        <p className={`m-0 max-w-[32rem] ${T_BODY} text-(--md-sys-color-on-surface-variant)`}>
          The component index is generated from the packages, so a page here means
          the export exists. This one does not.
        </p>
        <a
          href="/components"
          className={`inline-flex h-10 items-center justify-center rounded-(--md-sys-shape-corner-full) bg-(--md-sys-color-primary) px-4 ${T_LABEL_LG} text-(--md-sys-color-on-primary) no-underline`}
        >
          Browse components
        </a>
      </div>
    </SiteLayout>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Blocking, before paint and before the bundle: see THEME_INIT. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  );
}
