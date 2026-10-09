import type { ComponentPropsWithRef, ReactNode } from "react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { FOCUS_RING_CLASS } from "./focus-ring";
import { Input } from "./input";

function SearchIcon() {
  return (
    <svg
      data-slot="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-5 shrink-0 text-(--md-sys-color-on-surface-variant)"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      data-slot="search-clear-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="size-5"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

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
  /** Leading slot (M3: search icon, avatar, or menu control). Defaults to the search icon. */
  leading?: ReactNode;
  /** Trailing slot (M3: avatar or overflow control). The clear action renders beside it, never inside it. */
  trailing?: ReactNode;
};

/** Search form: labelled input with submit and clear. */
export function Search({
  label = "Search",
  placeholder = "Search",
  defaultValue = "",
  value: valueProp,
  onValueChange,
  onSearch,
  leading,
  trailing,
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
      <span data-slot="search-leading" className="flex shrink-0 items-center">
        {leading ?? <SearchIcon />}
      </span>
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
          className={`kern-search-clear relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) outline-none before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 hover:before:opacity-[var(--md-sys-state-hover)] before:transition-opacity before:bg-(--md-sys-color-on-surface-variant) ${FOCUS_RING_CLASS}`}
        >
          <ClearIcon />
        </button>
      ) : null}
      {trailing ? (
        <span
          data-slot="search-trailing"
          className="flex shrink-0 items-center"
        >
          {trailing}
        </span>
      ) : null}
    </form>
  );
}
