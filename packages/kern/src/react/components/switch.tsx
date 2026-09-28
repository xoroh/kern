import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "kern-switch flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full border-2 border-black/20 bg-white px-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-black/40 disabled:cursor-not-allowed disabled:opacity-50 data-checked:justify-end data-checked:border-black data-checked:bg-black",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="kern-switch-thumb block size-4 rounded-full bg-black/40 transition-all data-checked:size-6 data-checked:bg-white"
      />
    </SwitchPrimitive.Root>
  );
}
