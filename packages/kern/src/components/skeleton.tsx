import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type SkeletonProps = ComponentPropsWithRef<"div">;

/** Content placeholder. Hidden from assistive tech; pair with a Loader label. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "kern-skeleton animate-pulse rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-surface-tonal) motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
