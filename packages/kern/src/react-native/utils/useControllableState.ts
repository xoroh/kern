import { useState } from "react";

export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | undefined,
  onChange?: (next: T) => void,
): [T | undefined, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  return [
    current,
    (next: T) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
  ];
}
