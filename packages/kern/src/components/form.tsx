import { Form as FormPrimitive } from "@base-ui/react/form";
import type { ComponentProps } from "react";
import { cnState } from "../utils/cnState";

export type FormProps = ComponentProps<typeof FormPrimitive>;

/**
 * Native form with Base UI validation wiring. Use with Field parts; invalid
 * controls block submit and surface Field.Error messages.
 */
export function Form({ className, ...props }: FormProps) {
  return (
    <FormPrimitive
      data-slot="form"
      className={cnState("kern-form grid gap-4", className)}
      {...props}
    />
  );
}
