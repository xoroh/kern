import { KernLoading } from "@xoroh/kern";
import type { ExampleSpec } from "../example";

/**
 * KernLoading examples — the ONE loading composition: skeleton-list,
 * spinner, progress, and shimmer-card on one `kind` + `label` contract.
 * The label names the wait and is announced; skeleton rows stay decorative
 * inside one status region.
 */
export const KERN_LOADING_EXAMPLES: ExampleSpec[] = [
  {
    id: "kern-loading-kinds",
    title: "Four kinds, one contract",
    description:
      "Skeleton rows for list placeholders, spinner for indeterminate waits, indeterminate progress loop for unknown durations, shimmer card for dashboard grids.",
    render: () => (
      <div className="flex w-full max-w-xl flex-col gap-6">
        <KernLoading kind="skeleton-list" count={2} label="Loading rides" />
        <KernLoading kind="spinner" label="Loading" />
        <KernLoading kind="progress" label="Syncing" />
        <KernLoading kind="shimmer-card" label="Loading overview" />
      </div>
    ),
    code: `<KernLoading kind="skeleton-list" count={2} label="Loading rides" />
<KernLoading kind="spinner" label="Loading" />
<KernLoading kind="progress" label="Syncing" />
<KernLoading kind="shimmer-card" label="Loading overview" />`,
  },
  {
    id: "kern-loading-progress-value",
    title: "Known progress is determinate",
    description:
      "Pass `value` 0–1 when the duration is known; `null` (default) is the indeterminate loop. A static scalar is a Meter, not this component.",
    render: () => (
      <div className="w-full max-w-xl">
        <KernLoading kind="progress" value={0.6} label="Uploading export" />
      </div>
    ),
    code: `<KernLoading kind="progress" value={0.6} label="Uploading export" />`,
  },
];
