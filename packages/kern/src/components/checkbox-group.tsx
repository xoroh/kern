import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type CheckboxGroupRootProps = ComponentProps<
  typeof CheckboxGroupPrimitive
>;
export type CheckboxGroupItemProps = ComponentProps<
  typeof CheckboxPrimitive.Root
> & {
  label: ReactNode;
};

export function CheckboxGroupRoot({
  className,
  ...props
}: CheckboxGroupRootProps) {
  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      className={cnState("kern-checkbox-group grid gap-1", className)}
      {...props}
    />
  );
}

export function CheckboxGroupItem({
  label,
  className,
  ...props
}: CheckboxGroupItemProps) {
  return (
    // Base UI renders the associated hidden input beside the checkbox span.
    // biome-ignore lint/a11y/noLabelWithoutControl: label association is provided by the behavior primitive.
    <label
      data-slot="checkbox-group-field"
      className="kern-checkbox-group-field inline-flex min-h-12 cursor-pointer items-center gap-3 text-sm text-(--md-sys-color-on-surface) has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
    >
      <CheckboxPrimitive.Root
        data-slot="checkbox-group-item"
        className={cnState(
          "kern-checkbox relative size-[18px] shrink-0 rounded-(--md-sys-shape-corner-extra-small) border-2 border-(--md-sys-color-outline) bg-(--md-sys-color-surface) outline-none transition-colors " + FOCUS_RING_CLASS + " data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-(--md-sys-color-primary) data-checked:bg-(--md-sys-color-primary) data-checked:text-(--md-sys-color-on-primary) after:absolute after:-inset-[15px] after:content-['']",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-group-indicator"
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
      <span>{label}</span>
    </label>
  );
}

/** Multi-select checkbox group sharing one value list. */
export const CheckboxGroup = {
  Root: CheckboxGroupRoot,
  Item: CheckboxGroupItem,
};
