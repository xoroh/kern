import {
  type FeedbackShapeKind,
  type FeedbackSize,
  type FeedbackTone,
  type LoadingIndicatorStyle,
  resolveFeedbackVariant,
} from "@xoroh/kern-theme";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";
import { CircularProgress } from "./circular-progress";

export type BootIndicatorProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  /**
   * 'surface' = theme surface (matches the pre-JS critical loader — the
   * web default). 'inverse' = inverse-surface boot (matches native).
   */
  tone?: FeedbackTone;
  /** Wordmark under the trio, boot screens only ("from …"). */
  signature?: string;
  label?: string;
  size?: FeedbackSize;
  loaderStyle?: LoadingIndicatorStyle;
  shapes?: readonly FeedbackShapeKind[];
  /** Tenant variant override; unknown ids fail loud. */
  tenantId?: string;
};

/**
 * BootIndicator — the branded boot moment (web). The themed, post-JS twin
 * of the inlined critical loader: same trio, same stagger, same
 * standard-easing hop. Mount it at the app root while bootstrapping and
 * hide it via `useAppReady`. M3 has no splash-screen spec — this is the
 * branded indeterminate loading surface (heritage / `shapes` style).
 */
export function BootIndicator({
  tone,
  signature,
  label = "Loading",
  size = "lg",
  loaderStyle,
  shapes,
  tenantId,
  className,
  ...props
}: BootIndicatorProps) {
  const variant = resolveFeedbackVariant(tenantId);
  const style =
    loaderStyle ?? (tenantId === undefined ? "shapes" : variant.style);
  const list = shapes ?? variant.shapes;
  const activeTone =
    tone ?? (tenantId === undefined ? "surface" : variant.tone);
  const inverse = activeTone === "inverse";
  return (
    <div
      data-slot="boot-indicator"
      data-testid="boot-indicator"
      role="status"
      aria-label={label}
      className={cn(
        "kern-boot-indicator flex min-h-[50vh] flex-col items-center justify-center gap-4",
        inverse
          ? "bg-(--md-sys-color-inverse-surface) text-(--md-sys-color-inverse-on-surface)"
          : "bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface)",
        className,
      )}
      {...props}
    >
      <CircularProgress
        loaderStyle={style}
        shapes={list}
        size={size}
        label={label}
        aria-hidden="true"
      />
      {signature ? (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[13px] opacity-60">from</span>
          <span className="text-[17px] font-bold tracking-[3px]">
            {signature}
          </span>
        </div>
      ) : null}
    </div>
  );
}
