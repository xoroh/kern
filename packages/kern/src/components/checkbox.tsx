import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: ReactNode;
};

function CheckboxControl({
  className,
  style,
  indeterminate = false,
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      indeterminate={indeterminate}
      disabled={disabled}
      // M3 checkbox container-shape is a hardcoded 2px component token
      // (--md-checkbox-container-shape), not a sys-shape scale step — so it
      // lives in `style`, not in a radius utility the shape gate rightly
      // rejects.
      style={
        typeof style === "function"
          ? (state) => ({ borderRadius: 2, ...style(state) })
          : { borderRadius: 2, ...style }
      }
      className={cnState(
        `kern-checkbox relative size-[18px] shrink-0 border-2 border-(--sys-color-on-surface-variant) bg-(--sys-color-surface) outline-none transition-colors ${FOCUS_RING_CLASS} data-disabled:cursor-not-allowed data-checked:border-(--sys-color-primary) data-checked:bg-(--sys-color-primary) data-checked:text-(--sys-color-on-primary) data-indeterminate:border-(--sys-color-primary) data-indeterminate:bg-(--sys-color-primary) data-indeterminate:text-(--sys-color-on-primary) data-disabled:data-checked:bg-(--sys-color-on-surface)/38 data-disabled:data-checked:border-transparent data-disabled:data-indeterminate:bg-(--sys-color-on-surface)/38 data-disabled:data-indeterminate:border-transparent data-disabled:border-(--sys-color-on-surface)/38 data-disabled:bg-transparent after:absolute after:-inset-[15px] after:content-[''] before:absolute before:-inset-[11px] before:rounded-full before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] before:bg-(--sys-color-on-surface) data-checked:before:bg-(--sys-color-primary) data-indeterminate:before:bg-(--sys-color-primary) data-checked:active:before:bg-(--sys-color-on-surface) data-indeterminate:active:before:bg-(--sys-color-on-surface)`,
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
        className="kern-checkbox-field inline-flex min-h-12 cursor-pointer items-center gap-3 text-sm text-(--sys-color-on-surface) has-[:disabled]:cursor-not-allowed has-[:disabled]:text-(--sys-color-on-surface)/38"
      >
        <CheckboxControl {...props} />
        <span>{label}</span>
      </label>
    );
  }
  return <CheckboxControl {...props} />;
}
