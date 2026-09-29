import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: ReactNode;
};

function CheckboxControl({
  className,
  indeterminate = false,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      disabled={disabled}
      className={cnState(
        "kern-checkbox relative size-[18px] shrink-0 rounded-(--md-sys-shape-corner-extra-small) border-2 border-(--md-sys-color-outline) bg-(--md-sys-color-surface) outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary) data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-(--md-sys-color-primary) data-checked:bg-(--md-sys-color-primary) data-checked:text-(--md-sys-color-on-primary) data-indeterminate:border-(--md-sys-color-primary) data-indeterminate:bg-(--md-sys-color-primary) data-indeterminate:text-(--md-sys-color-on-primary) after:absolute after:-inset-[15px] after:content-['']",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {indeterminate ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 6h7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
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
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  if (label !== undefined) {
    return (
      // Base UI renders the associated hidden input beside the checkbox span.
      // The analyzer cannot see that primitive-owned input.
      // biome-ignore lint/a11y/noLabelWithoutControl: label association is provided by the behavior primitive.
      <label
        data-slot="checkbox-field"
        className="kern-checkbox-field inline-flex min-h-12 cursor-pointer items-center gap-3 text-sm text-(--md-sys-color-on-surface) has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
      >
        <CheckboxControl {...props} />
        <span>{label}</span>
      </label>
    );
  }
  return <CheckboxControl {...props} />;
}
