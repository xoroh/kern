import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { Input } from "./input";

export type SearchProps = Omit<
  ComponentPropsWithRef<"form">,
  "children" | "onSubmit" | "onChange"
> & {
  /** Accessible label for the search field. */
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** Called with the query when the user submits. */
  onSearch?: (value: string) => void;
};

/** Search form: labelled input with submit and clear. */
export function Search({
  label = "Search",
  placeholder = "Search",
  defaultValue = "",
  value: valueProp,
  onValueChange,
  onSearch,
  className,
  ...props
}: SearchProps) {
  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp ?? internal;
  function set(next: string) {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  }
  return (
    // biome-ignore lint/a11y/useSemanticElements: search landmark on a form is the recommended accessible pattern.
    <form
      data-slot="search"
      role="search"
      aria-label={label}
      className={cn("kern-search flex w-full items-center gap-2", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(value);
      }}
      {...props}
    >
      <Input
        data-slot="search-input"
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => set(event.target.value)}
      />
      {value ? (
        <button
          data-slot="search-clear"
          type="button"
          aria-label="Clear search"
          onClick={() => set("")}
          className="kern-search-clear flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) outline-none hover:bg-(--md-sys-color-surface-tonal) focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)"
        >
          ×
        </button>
      ) : null}
    </form>
  );
}
