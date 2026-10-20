import { Skeleton } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * Skeleton examples — the shape of what is coming.
 *
 * A skeleton has no intrinsic size: the shape is `className`'s job, because
 * only the caller knows what is arriving. Several of them compose into the
 * outline of the content they stand in for.
 */
export const SKELETON_EXAMPLES: ExampleSpec[] = [
  {
    id: "skeleton-placeholder",
    title: "A placeholder in the shape of the content",
    description:
      "One block per line of the incoming content. The skeleton is hidden from assistive tech, so the region that is loading is what gets announced — not these blocks.",
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    ),
    code: `<div className="flex w-full max-w-sm flex-col gap-3">
  <Skeleton className="h-8 w-2/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-4/5" />
</div>`,
  },
];
