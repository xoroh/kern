import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type PreviewCardRootProps = ComponentProps<
  typeof PreviewCardPrimitive.Root
>;
export type PreviewCardTriggerProps = ComponentProps<
  typeof PreviewCardPrimitive.Trigger
>;
export type PreviewCardContentProps = ComponentProps<
  typeof PreviewCardPrimitive.Popup
>;

export function PreviewCardRoot(props: PreviewCardRootProps) {
  return <PreviewCardPrimitive.Root data-slot="preview-card" {...props} />;
}

export function PreviewCardTrigger({
  className,
  ...props
}: PreviewCardTriggerProps) {
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="preview-card-trigger"
      className={cnState("kern-preview-card-trigger", className)}
      {...props}
    />
  );
}

export function PreviewCardContent({
  className,
  ...props
}: PreviewCardContentProps) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner sideOffset={8}>
        <PreviewCardPrimitive.Popup
          data-slot="preview-card-content"
          className={cnState(
            "kern-preview-card-popup w-72 rounded-(--md-sys-shape-corner-small) bg-(--md-sys-color-surface) p-4 text-sm text-(--md-sys-color-on-surface) shadow-(--md-sys-elevation-level2) outline-none",
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

/** Hover preview card for links and references. */
export const PreviewCard = {
  Root: PreviewCardRoot,
  Trigger: PreviewCardTrigger,
  Content: PreviewCardContent,
};
