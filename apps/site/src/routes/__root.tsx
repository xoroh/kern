import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Kicker } from "../components/chrome/kicker";
import { T_BODY, T_LABEL_LG, T_PAGE } from "../systems/type-scale";
import { pageMeta, SITE_DESCRIPTION } from "../systems/seo";

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
  return (
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
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  );
}
