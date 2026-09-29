import { cn } from "@xoroh/kern";
import type { ComponentPropsWithRef, ReactNode } from "react";

export type PaneWidth = "narrow" | "default" | "wide" | "full";

const PANE_WIDTHS: Record<PaneWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
  full: "max-w-none",
};

/** Surface pane: one content region with a width scale. */
export function Pane({
  width = "default",
  className,
  children,
  ...props
}: ComponentPropsWithRef<"section"> & { width?: PaneWidth }) {
  return (
    <section
      data-slot="pane"
      className={cn(
        "kern-pane flex min-w-0 flex-col rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface)",
        PANE_WIDTHS[width],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

/** Page content region: fills or caps the reading width. */
export function Page({
  fill = false,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div"> & { fill?: boolean }) {
  return (
    <div
      data-slot="page"
      className={cn(
        "kern-page mx-auto flex min-w-0 flex-1 flex-col px-4 py-6",
        fill ? "w-full max-w-none" : "w-full max-w-4xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** 2–3 resizable columns with start/end slots. */
export function Split({
  columns = 2,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div"> & { columns?: 2 | 3 }) {
  return (
    <div
      data-slot="split"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      className={cn(
        "kern-split grid min-h-0 flex-1 gap-px bg-(--md-sys-color-outline-variant)",
        columns === 2 ? "grid-cols-2" : "grid-cols-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** One `Split` column. */
export function SplitPanel({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="split-panel"
      className={cn(
        "kern-split-panel flex min-w-0 flex-col overflow-auto bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Recipe: navigation | list | detail. */
export function ListDetail({
  navigation,
  list,
  detail,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"div">, "children"> & {
  navigation?: ReactNode;
  list: ReactNode;
  detail: ReactNode;
}) {
  return (
    <div
      data-slot="list-detail"
      className={cn("kern-list-detail flex min-h-0 flex-1", className)}
      {...props}
    >
      {navigation ? (
        <SplitPanel className="w-64 shrink-0 border-e border-(--md-sys-color-outline-variant)">
          {navigation}
        </SplitPanel>
      ) : null}
      <SplitPanel className="w-80 shrink-0 border-e border-(--md-sys-color-outline-variant)">
        {list}
      </SplitPanel>
      <SplitPanel className="min-w-0 flex-1">{detail}</SplitPanel>
    </div>
  );
}

/** Recipe: detail content + tabbed info panel. */
export function Inspector({
  content,
  info,
  tabs,
  activeTab,
  onTabChange,
  className,
  ...props
}: Omit<ComponentPropsWithRef<"div">, "children" | "content"> & {
  content: ReactNode;
  info: ReactNode;
  tabs?: { id: string; label: ReactNode }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
}) {
  return (
    <div
      data-slot="inspector"
      className={cn("kern-inspector flex min-h-0 flex-1", className)}
      {...props}
    >
      <SplitPanel className="min-w-0 flex-1">{content}</SplitPanel>
      <SplitPanel className="w-96 shrink-0 border-s border-(--md-sys-color-outline-variant)">
        {tabs && tabs.length > 0 ? (
          <div
            role="tablist"
            className="flex h-12 items-center gap-1 border-b border-(--md-sys-color-outline-variant) px-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === activeTab}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "h-10 rounded-(--md-sys-shape-corner-small) px-3 text-sm",
                  tab.id === activeTab
                    ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
                    : "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-tonal)",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto p-3">{info}</div>
      </SplitPanel>
    </div>
  );
}
