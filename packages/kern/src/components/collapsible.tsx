import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type CollapsibleRootProps = ComponentProps<
  typeof CollapsiblePrimitive.Root
>;
export type CollapsibleTriggerProps = ComponentProps<
  typeof CollapsiblePrimitive.Trigger
>;
export type CollapsiblePanelProps = ComponentProps<
  typeof CollapsiblePrimitive.Panel
>;

export function CollapsibleRoot(props: CollapsibleRootProps) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

export function CollapsibleTrigger({
  className,
  ...props
}: CollapsibleTriggerProps) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cnState(
        "kern-collapsible-trigger flex min-h-12 cursor-pointer items-center gap-2 text-sm font-medium text-(--md-sys-color-on-surface) outline-none " + FOCUS_RING_CLASS + " data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function CollapsiblePanel({
  className,
  ...props
}: CollapsiblePanelProps) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-panel"
      className={cnState(
        "kern-collapsible-panel text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Single show/hide region controlled by its trigger. */
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
