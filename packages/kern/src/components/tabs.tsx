import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type TabsRootProps = ComponentProps<typeof TabsPrimitive.Root>;
export type TabsListProps = ComponentProps<typeof TabsPrimitive.List>;
export type TabsTabProps = ComponentProps<typeof TabsPrimitive.Tab>;
export type TabsPanelProps = ComponentProps<typeof TabsPrimitive.Panel>;

export function TabsRoot(props: TabsRootProps) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cnState(
        "kern-tabs-list flex h-12 items-stretch gap-1 border-b border-(--sys-color-outline-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cnState(
        "kern-tabs-tab relative flex min-h-12 cursor-pointer items-center px-4 text-sm leading-5 font-medium tracking-[0.00625rem] text-(--sys-color-on-surface-variant) outline-none select-none transition-colors duration-200 ease-(--sys-motion-easing-standard) after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-transparent after:content-[''] before:absolute before:inset-0 before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface) hover:before:opacity-[var(--sys-state-hover)] hover:text-(--sys-color-on-surface) focus-visible:before:opacity-[var(--sys-state-focus)] focus-visible:text-(--sys-color-on-surface) active:before:opacity-[var(--sys-state-press)] active:text-(--sys-color-on-surface) " +
          FOCUS_RING_CLASS +
          " data-disabled:pointer-events-none data-disabled:opacity-38 data-selected:text-(--sys-color-primary) data-selected:before:bg-(--sys-color-primary) data-selected:after:bg-(--sys-color-primary) data-selected:hover:before:opacity-[var(--sys-state-hover)] data-selected:focus-visible:before:opacity-[var(--sys-state-focus)] data-selected:active:before:opacity-[var(--sys-state-press)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cnState("kern-tabs-panel py-4 outline-none", className)}
      {...props}
    />
  );
}

/** Tabbed content with automatic arrow-key navigation. */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
};
