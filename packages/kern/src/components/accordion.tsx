import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type AccordionRootProps = ComponentProps<typeof AccordionPrimitive.Root>;
export type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>;
export type AccordionHeaderProps = ComponentProps<
  typeof AccordionPrimitive.Header
>;
export type AccordionTriggerProps = ComponentProps<
  typeof AccordionPrimitive.Trigger
>;
export type AccordionPanelProps = ComponentProps<
  typeof AccordionPrimitive.Panel
>;

export function AccordionRoot({ className, ...props }: AccordionRootProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cnState(
        "kern-accordion grid gap-2 rounded-(--md-sys-shape-corner-small)",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cnState(
        "kern-accordion-item overflow-hidden rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionHeader(props: AccordionHeaderProps) {
  return <AccordionPrimitive.Header data-slot="accordion-header" {...props} />;
}

export function AccordionTrigger({
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Trigger
      data-slot="accordion-trigger"
      className={cnState(
        "kern-accordion-trigger flex min-h-12 w-full cursor-pointer items-center justify-between gap-2 px-4 text-left text-sm font-medium text-(--md-sys-color-on-surface) outline-none hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--md-sys-color-secondary) data-disabled:pointer-events-none [&[data-panel-open]>[data-slot=accordion-chevron]]:rotate-180",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cnState(
        "kern-accordion-panel px-4 pb-4 text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/** Stacked disclosure sections; single or multiple open. */
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
