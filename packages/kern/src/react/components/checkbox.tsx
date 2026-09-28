import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "kern-checkbox size-[18px] shrink-0 rounded-[2px] border-2 border-black/20 bg-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-black/40 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-black data-checked:bg-black data-checked:text-white",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6.5 4.8 9 10 3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
