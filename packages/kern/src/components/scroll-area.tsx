import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type ScrollAreaRootProps = ComponentProps<
  typeof ScrollAreaPrimitive.Root
>;
export type ScrollAreaViewportProps = ComponentProps<
  typeof ScrollAreaPrimitive.Viewport
>;

export function ScrollAreaRoot({ className, ...props }: ScrollAreaRootProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cnState(
        "kern-scroll-area relative overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function ScrollAreaViewport({
  className,
  ...props
}: ScrollAreaViewportProps) {
  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={cnState(
        "kern-scroll-area-viewport h-full w-full overscroll-contain rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)",
        className,
      )}
      {...props}
    />
  );
}

export function ScrollAreaScrollbar({
  className,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      className={cnState(
        "kern-scroll-area-scrollbar flex touch-none p-1 select-none data-horizontal:h-2 data-horizontal:flex-col data-vertical:w-2",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="kern-scroll-area-thumb relative flex-1 rounded-full bg-(--md-sys-color-outline)"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

/** Scrollable region with a themed scrollbar. */
export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
};
