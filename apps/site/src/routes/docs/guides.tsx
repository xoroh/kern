import { createFileRoute } from "@tanstack/react-router";
import { Kicker } from "../../components/chrome/kicker";
import { SiteLayout } from "../../components/chrome/site-layout";
import { Code, Step } from "../../components/docs/code";
import { IconGallery } from "../../components/icons/icon-gallery";
import { componentsOn } from "../../generated/manifest";
import { routeHead } from "../../systems/seo";
import { T_BODY, T_BODY_MD, T_PAGE } from "../../systems/type-scale";

export const Route = createFileRoute("/docs/guides")({
  head: () =>
    routeHead("Guides", "How-to guides for common tasks."),
  component: Guides,
});

const WEB_PARITY = `// One contract, two platforms. Same name, same variant axis.
import { Button } from "@xoroh/kern";        // web
import { Button } from "@xoroh/kern-native"; // native

// Web takes onClick and DOM props.
<Button variant="primary" onClick={save}>Save</Button>

// Native takes onPress.
<Button variant="primary" onPress={save}>Save</Button>`;

const SNACKBAR = `// Native: M3 transient messaging.
import { Snackbar } from "@xoroh/kern-native";

<Snackbar
  visible={saved}
  message="Build queued"
  actionLabel="View"
  onAction={open}
/>;`;

const ICON_ALIAS = `import { Icon } from "@xoroh/kern-icons";

// A semantic alias is the unification decision: "close" means the same glyph
// in every product. Prefer it over a raw glyph name.
<Icon name="close" size={24} title="Close" />`;

const REGISTRY = `import { getIconSet, listIconSets } from "@xoroh/kern-icons";

listIconSets();            // every registered set
getIconSet("material");    // one set's manifest`;

// Plain HTML via CDN — no bundler. Pin VERSION in BOTH URLs to the same
// published release: the stylesheet path is the kern-tokens `theme` export's
// file, and the module path is the kern package root, so any published
// version resolves both. esm.sh rewrites kern's bare `react` import only
// when `?external` names it, which is what keeps the import-map copy the
// single one.
const CDN_PLAIN_HTML = `<!-- Plain HTML via CDN — no bundler. Replace VERSION in BOTH URLs with the same published release. -->
<link rel="stylesheet" href="https://unpkg.com/@xoroh/kern-tokens@VERSION/src/tokens.css" />
<div id="root"></div>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.3.0",
    "react-dom/client": "https://esm.sh/react-dom@19.3.0/client",
    "@xoroh/kern": "https://esm.sh/@xoroh/kern@VERSION?external=react,react-dom"
  }
}
</script>
<script type="module">
import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@xoroh/kern";

createRoot(document.getElementById("root")).render(
  React.createElement(Button, { variant: "primary" }, "Continue")
);
</script>`;

function Guides() {
  const web = componentsOn("web").length;
  const mobile = componentsOn("mobile").length;
  return (
    <SiteLayout>
      <section className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[64rem] flex-col gap-8 rounded-(--md-sys-shape-corner-extra-large) bg-(--md-sys-color-surface) p-8 sm:p-14">
          <header className="flex flex-col gap-3">
            <Kicker>Docs / Guides</Kicker>
            <h1 className={`m-0 ${T_PAGE} text-(--md-sys-color-on-surface)`}>
              Guides
            </h1>
            <p className={`m-0 ${T_BODY} text-(--md-sys-color-on-surface-variant)`}>
              {web} web exports and {mobile} native exports, under one naming
              law. These pages cover the rules that do not fit on a single
              component page.
            </p>
          </header>

          <Step n={1} title="One component, two platforms">
            <p className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
              A component that exists on both platforms keeps its name and its
              variant axis, and differs only where the platform genuinely does.
              The event name is the visible case: <code>onClick</code> on the
              web, <code>onPress</code> natively.
            </p>
            <Code>{WEB_PARITY}</Code>
          </Step>

          <Step n={2} title="Deliberate asymmetries">
            <p className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
              Not every surface exists twice. M3 expresses transient messaging
              as <code>Snackbar</code>, so the native package ships that and
              stops. The web-only <code>Sonner</code> is a second name for one
              idea, and is recorded as a deliberate asymmetry rather than a gap
              to be closed.
            </p>
            <Code>{SNACKBAR}</Code>
          </Step>

          <Step n={3} title="Icons: aliases over raw names">
            <p className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
              The semantic map is the unification table. Reach for an alias
              first; a raw glyph name is for the icon that has no agreed meaning
              yet.
            </p>
            <Code>{ICON_ALIAS}</Code>
            <Code>{REGISTRY}</Code>
          </Step>

          <Step n={4} title="The icon gallery">
            <p className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
              Every count and name below is read from the icon package at build
              time. The grid paints the first 120 for server-render cost; the
              filter reaches the rest.
            </p>
            <IconGallery />
          </Step>

          <Step n={5} title="Plain HTML via CDN — no bundler">
            <p className={`m-0 ${T_BODY_MD} text-(--md-sys-color-on-surface-variant)`}>
              No JSX, no build step: the stylesheet is the published theme file,
              the import map pins one copy of React, and{" "}
              <code>?external=react,react-dom</code> keeps kern reading that
              same copy instead of bundling a second. The packages are{" "}
              <code>0.0.0</code> and unpublished, so these URLs 404 until the
              first publish — replace <code>VERSION</code> in both URLs with
              the same version then. The paths are
              verified against the packages&apos; published file lists
              (kern-tokens ships <code>src/tokens.css</code>, kern&apos;s root
              export is <code>dist/index.js</code>), not against the registry.
            </p>
            <Code>{CDN_PLAIN_HTML}</Code>
          </Step>
        </div>
      </section>
    </SiteLayout>
  );
}
