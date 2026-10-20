import { LoadingRegion, Skeleton } from "@xoroh/kern";
import { T_BODY_SM } from "../../domains/shared/systems/type-scale";
import type { ExampleSpec } from "../example";

/**
 * Loading region examples — the swap between content and a wait.
 *
 * `aria-busy` has to land on the REGION being loaded, not on the spinner, so
 * the region and its indicator are one component: the pairing cannot be
 * forgotten at the call site.
 */
export const LOADING_REGION_EXAMPLES: ExampleSpec[] = [
  {
    id: "loading-region-swap",
    title: "One flag swaps the content for the wait",
    description:
      "The same region in both states. `loading` is the whole interface, and the fallback is yours — a skeleton here, anything else elsewhere. The busy state lands on the region, not on the spinner.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <LoadingRegion
          loading
          label="Loading messages"
          fallback={<Skeleton className="h-4 w-full" />}
        >
          <p className={T_BODY_SM}>Four messages</p>
        </LoadingRegion>
        <LoadingRegion loading={false}>
          <p className={T_BODY_SM}>Four messages</p>
        </LoadingRegion>
      </div>
    ),
    // type-scale-exempt: the class names below are EXAMPLE CODE shown to
    // the reader, not rendered typography. A consumer's own class names are
    // theirs to choose; the rule governs what OUR pages paint.
    code: `<LoadingRegion
  loading
  label="Loading messages"
  fallback={<Skeleton className="h-4 w-full" />}
>
  <p className="text-sm">Four messages</p>
</LoadingRegion>
<LoadingRegion loading={false}>
  <p className="text-sm">Four messages</p>
</LoadingRegion>`,
  },
];
