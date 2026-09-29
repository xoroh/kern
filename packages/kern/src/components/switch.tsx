import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cnState(
        "kern-switch relative flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-(--md-sys-shape-corner-full) border-2 border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:justify-end data-checked:border-(--md-sys-color-primary) data-checked:bg-(--md-sys-color-primary) after:absolute after:-inset-2 after:content-['']",
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
