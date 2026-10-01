import {
  type FeedbackShapeKind,
  type FeedbackSize,
  type FeedbackTone,
  type LoadingIndicatorStyle,
  resolveFeedbackVariant,
} from "@xoroh/kern-tokens";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";
import { CircularProgress } from "./circular-progress";

export type PageLoaderProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  label?: string;
  size?: FeedbackSize;
  tone?: FeedbackTone;
  loaderStyle?: LoadingIndicatorStyle;
  shapes?: readonly FeedbackShapeKind[];
  /** Tenant variant override; unknown ids fail loud. */
  tenantId?: string;
};

/**
 * PageLoader — centered in-content loading surface (heritage / `shapes`
 * style by default). For the full-screen boot moment use `BootIndicator`.
 */
export function PageLoader({
  label,
  size = "lg",
  tone,
  loaderStyle,
  shapes,
  tenantId,
  className,
  ...props
}: PageLoaderProps) {
  const variant = resolveFeedbackVariant(tenantId);
  const style =
    loaderStyle ?? (tenantId === undefined ? "shapes" : variant.style);
  const list = shapes ?? variant.shapes;
  const activeTone =
    tone ?? (tenantId === undefined ? "surface" : variant.tone);
  const inverse = activeTone === "inverse";
  return (
    <div
      data-slot="page-loader"
      data-testid="page-loader"
      role="status"
      aria-label={label ?? "Loading"}
      className={cn(
        "kern-page-loader flex min-h-[50vh] flex-col items-center justify-center gap-4",
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
        label={label ?? "Loading"}
        aria-hidden="true"
      />
      {label ? (
        <p className="text-sm text-current opacity-70">{label}</p>
      ) : null}
    </div>
  );
}
