import type { NativeInputProps } from "./input";
import { Input } from "./input";

export type TextareaProps = Omit<NativeInputProps, "multiline">;

export function Textarea(props: TextareaProps) {
  return <Input multiline {...props} />;
}
