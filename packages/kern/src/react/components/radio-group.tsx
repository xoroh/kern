import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive>;

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("kern-radio-group flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export type RadioGroupItemProps = ComponentProps<typeof RadioPrimitive.Root> & {
  children?: ReactNode;
};

export function RadioGroupItem({
  className,
  children,
  ...props
}: RadioGroupItemProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: control is nested inside (implicit association).
    <label
      data-slot="radio-group-item"
      className={cn(
        "kern-radio-group-item flex cursor-pointer items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <RadioPrimitive.Root
        className={cn(
          "size-5 shrink-0 rounded-full border-2 border-(--md-sys-color-on-surface-variant) bg-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) data-checked:border-(--md-sys-color-primary)",
        )}
        {...props}
      >
        <RadioPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="flex size-5 items-center justify-center"
        >
          <span className="size-2 rounded-full bg-(--md-sys-color-primary)" />
        </RadioPrimitive.Indicator>
      </RadioPrimitive.Root>
      {children}
    </label>
  );
}
