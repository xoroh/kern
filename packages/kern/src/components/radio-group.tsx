import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../utils/cn";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type RadioGroupProps<Value = string> = Omit<
  ComponentProps<typeof RadioGroupPrimitive>,
  "value" | "defaultValue" | "onValueChange" | "className"
> & {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value, eventDetails: unknown) => void;
  className?: ComponentProps<typeof RadioGroupPrimitive>["className"];
};

export function RadioGroup<Value = string>({
  className,
  ...props
}: RadioGroupProps<Value>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cnState("kern-radio-group flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export type RadioGroupItemProps = Omit<
  ComponentProps<typeof RadioPrimitive.Root>,
  "className" | "children"
> & {
  children?: ReactNode;
  className?: string;
  controlClassName?: ComponentProps<typeof RadioPrimitive.Root>["className"];
};

export function RadioGroupItem({
  className,
  controlClassName,
  children,
  ...props
}: RadioGroupItemProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: control is nested inside (implicit association).
    <label
      data-slot="radio-group-item"
      className={cn(
        "kern-radio-group-item relative flex min-h-12 cursor-pointer items-center gap-3 text-sm text-(--sys-color-on-surface) has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:text-(--sys-color-on-surface)/38",
        className,
      )}
    >
      <RadioPrimitive.Root
        data-slot="radio-group-control"
        className={cnState(
          "group relative size-5 shrink-0 rounded-full border-2 border-(--sys-color-on-surface-variant) bg-(--sys-color-surface) outline-none transition-colors duration-200 ease-(--sys-motion-easing-standard) " +
            FOCUS_RING_CLASS +
            " data-disabled:cursor-not-allowed data-disabled:border-(--sys-color-on-surface)/38 data-disabled:bg-transparent data-checked:border-(--sys-color-primary) data-disabled:data-checked:border-(--sys-color-on-surface)/38 after:absolute after:-inset-[14px] after:content-[''] before:absolute before:-inset-[14px] before:rounded-full before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-surface) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] data-checked:before:bg-(--sys-color-primary) data-checked:active:before:bg-(--sys-color-on-surface) data-disabled:before:opacity-0",
          controlClassName,
        )}
        {...props}
      >
        <RadioPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="flex size-5 items-center justify-center"
        >
          <span className="size-2 rounded-full bg-(--sys-color-primary) group-data-disabled:bg-(--sys-color-on-surface)/38" />
        </RadioPrimitive.Indicator>
      </RadioPrimitive.Root>
      {children}
    </label>
  );
}
