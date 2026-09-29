import type { ComponentPropsWithRef } from "react";
import { cn } from "../utils/cn";

export type NativeSelectProps = ComponentPropsWithRef<"select">;

/** Platform select element in the Kern field recipe. */
export function NativeSelect({ className, ...props }: NativeSelectProps) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "kern-native-select h-14 w-full cursor-pointer appearance-none rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors focus:border-(--md-sys-color-primary) disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
