import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "kern-switch flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) disabled:cursor-not-allowed disabled:opacity-50 data-checked:justify-end data-checked:border-(--md-sys-color-primary) data-checked:bg-(--md-sys-color-primary)",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="kern-switch-thumb block size-4 rounded-full bg-(--md-sys-color-outline) transition-all data-checked:size-6 data-checked:bg-(--md-sys-color-on-primary)"
      />
    </SwitchPrimitive.Root>
  );
}
