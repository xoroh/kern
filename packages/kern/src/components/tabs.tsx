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
        "kern-tabs-list flex h-12 items-stretch gap-1 border-b border-(--md-sys-color-outline-variant)",
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
        "kern-tabs-tab relative flex min-h-12 cursor-pointer items-center px-4 text-sm font-medium text-(--md-sys-color-on-surface-variant) outline-none select-none " + FOCUS_RING_CLASS + " data-disabled:pointer-events-none data-disabled:opacity-50 data-selected:text-(--md-sys-color-primary) after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-transparent after:content-[''] data-selected:after:bg-(--md-sys-color-primary)",
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
