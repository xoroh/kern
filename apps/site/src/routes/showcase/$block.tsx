/**
 * /showcase/$block — one block: live preview, real source, install command.
 *
 * The instance of the blocks hub (dynamic segments are reached through it —
 * see `check-nav.mjs`). An unknown slug renders an honest pointer back to
 * the catalog rather than a fabricated page.
 */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BlockViewer } from "../../domains/blocks/block-viewer";
import { BLOCK_VIEWS, blockView } from "../../domains/blocks/registry";
import { PageCard } from "../../domains/shared/chrome/page-card";
import { SiteLayout } from "../../domains/shared/chrome/site-layout";
import { routeHead } from "../../domains/shared/systems/seo";
import { T_BODY, T_PAGE } from "../../domains/shared/systems/type-scale";

export const Route = createFileRoute("/showcase/$block")({
  beforeLoad: ({ params }) => {
    if (!blockView(params.block)) throw notFound();
  },
  head: ({ params }) => {
    const view = blockView(params.block);
    return routeHead(
      view ? `${view.entry.title} — block` : "Block not found",
      view?.entry.description ??
        "No block by that name. Start from the blocks index.",
    );
  },
  component: BlockPage,
});

function BlockPage() {
  const { block } = Route.useParams();
  const view = blockView(block);
  const index = BLOCK_VIEWS.findIndex((v) => v.entry.name === block);
  if (!view) {
    return (
      <SiteLayout>
        <PageCard>
          <h1 className={`m-0 ${T_PAGE} text-(--sys-color-on-surface)`}>
            No block by that name
          </h1>
          <p className={`m-0 ${T_BODY} text-(--sys-color-on-surface-variant)`}>
            <Link
              to="/showcase"
              className="text-(--sys-color-primary) no-underline hover:underline"
            >
              Back to the blocks index
            </Link>
            .
          </p>
        </PageCard>
      </SiteLayout>
    );
  }
  return (
    <SiteLayout>
      <PageCard>
        <BlockViewer
          view={view}
          prev={BLOCK_VIEWS[index - 1]}
          next={BLOCK_VIEWS[index + 1]}
        />
      </PageCard>
    </SiteLayout>
  );
}
