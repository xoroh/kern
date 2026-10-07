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
        </div>
      </section>
    </SiteLayout>
  );
}
