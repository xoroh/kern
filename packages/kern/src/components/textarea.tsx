import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

export type TextareaProps = Omit<
  ComponentProps<typeof Field.Control>,
  "render"
> & {
  /**
   * M3 text-field treatment. `outlined` (default) draws the 1px outline;
   * `filled` fills `surface-container-highest`. Functionally identical.
   */
  variant?: "outlined" | "filled";
  error?: boolean;
  /** Initial visible row count. Defaults to 2 per M3. */
  rows?: number;
};

export function Textarea({
  variant = "outlined",
  error = false,
  "aria-invalid": ariaInvalid,
  rows = 2,
  className,
  ...props
}: TextareaProps) {
  return (
    <Field.Control
      render={<textarea rows={rows} />}
      data-slot="textarea"
      data-variant={variant}
      aria-invalid={error || ariaInvalid || undefined}
      className={cnState(
        "kern-textarea min-h-[112px] w-full text-base leading-6 text-(--sys-color-on-surface) outline-none transition-colors placeholder:text-(--sys-color-on-surface-variant) " +
          FOCUS_RING_CLASS +
          " disabled:cursor-not-allowed disabled:text-(--sys-color-on-surface)/38 disabled:placeholder:text-(--sys-color-on-surface)/38" +
          (variant === "filled"
            ? " rounded-t-(--sys-shape-corner-extra-small) border-b border-(--sys-color-on-surface-variant) bg-(--sys-color-surface-container-highest) px-4 py-3 focus:border-b-2 focus:border-(--sys-color-primary) disabled:border-(--sys-color-on-surface)/38 disabled:bg-(--sys-color-on-surface)/4 data-invalid:border-(--sys-color-error)"
            : " rounded-(--sys-shape-corner-extra-small) border border-(--sys-color-outline) bg-(--sys-color-surface) px-4 py-3 hover:border-(--sys-color-on-surface) focus:border-2 focus:border-(--sys-color-primary) disabled:border-(--sys-color-on-surface)/12 disabled:bg-transparent data-invalid:border-(--sys-color-error)"),
        error && "border-(--sys-color-error)",
        className,
      )}
      {...props}
    />
  );
}
