import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";

/** One selectable row in a command palette. */
export type CommandOption = {
  /** Stable value handed to `onValueChange`. */
  value: string;
  /** Visible label, also the default filter target. */
  label: string;
  /** Extra search terms matched against the query. */
  keywords?: string[];
  /** Leading adornment (usually an `Icon`). */
  icon?: ReactNode;
  /** Trailing keyboard hint, rendered in a `Kbd`. */
  shortcut?: string;
  disabled?: boolean;
  /** Invoked after the option is chosen. */
  onSelect?: (value: string) => void;
};

export type CommandRootProps = ComponentProps<typeof ComboboxPrimitive.Root> & {
  /** Rows to filter and render. */
  options: readonly CommandOption[];
  /** Called with the chosen option's value. */
  onValueChange?: (value: string | null, eventDetails?: unknown) => void;
};

export type CommandInputProps = ComponentProps<typeof ComboboxPrimitive.Input>;
export type CommandContentProps = ComponentProps<
  typeof ComboboxPrimitive.Popup
>;
export type CommandListProps = ComponentProps<typeof ComboboxPrimitive.List>;
export type CommandEmptyProps = ComponentProps<typeof ComboboxPrimitive.Empty>;
export type CommandSeparatorProps = ComponentProps<
  typeof ComboboxPrimitive.Separator
>;
export type CommandGroupLabelProps = ComponentProps<
  typeof ComboboxPrimitive.GroupLabel
>;

export type CommandItemProps = Omit<
  ComponentProps<typeof ComboboxPrimitive.Item>,
  "value"
> & {
  value: string;
  icon?: ReactNode;
  shortcut?: string;
};

/** Case-insensitive match on the label plus any extra keywords. */
function commandFilter(option: CommandOption, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [option.label, ...(option.keywords ?? [])].some((term) =>
    term.toLowerCase().includes(needle),
  );
}

export function CommandRoot({
  options,
  onValueChange,
  children,
  ...props
}: CommandRootProps) {
  return (
    <ComboboxPrimitive.Root
      data-slot="command"
      items={options as unknown as CommandOption[]}
      filter={(item, query) => commandFilter(item as CommandOption, query)}
      openOnInputClick
      autoHighlight
      onValueChange={(value, eventDetails) => {
        const next = value as string | null;
        onValueChange?.(next, eventDetails);
        if (next) {
          options.find((option) => option.value === next)?.onSelect?.(next);
        }
      }}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Root>
  );
}

export function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <ComboboxPrimitive.Input
      data-slot="command-input"
      className={cnState(
        "kern-command-input h-14 w-full rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface) px-4 text-base text-(--md-sys-color-on-surface) outline-none transition-colors placeholder:text-(--md-sys-color-on-surface-variant) focus:border-(--md-sys-color-primary)",
        className,
      )}
      {...props}
    />
  );
}

export function CommandContent({ className, ...props }: CommandContentProps) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        sideOffset={4}
        className="kern-command-positioner"
      >
        <ComboboxPrimitive.Popup
          data-slot="command-content"
          className={cnState(
            "kern-command-content min-w-64 max-w-lg rounded-(--md-sys-shape-corner-large) border border-(--md-sys-color-outline) bg-(--md-sys-color-surface-container) p-1 shadow-(--md-sys-elevation-level3) outline-none",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

/**
 * Renders the filtered rows. Pass a render function keyed on the option value
 * — Base UI's collection requires a `key` on each rendered row.
 */
export function CommandList({ className, ...props }: CommandListProps) {
  return (
    <ComboboxPrimitive.List
      data-slot="command-list"
      className={cnState(
        "kern-command-list max-h-80 overflow-y-auto p-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({
  value,
  icon,
  shortcut,
  className,
  children,
  ...props
}: CommandItemProps) {
  return (
    <ComboboxPrimitive.Item
      data-slot="command-item"
      value={value}
      className={cnState(
        "kern-command-item flex min-h-12 cursor-pointer items-center gap-3 rounded-(--md-sys-shape-corner-extra-small) px-3 text-sm text-(--md-sys-color-on-surface) outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-(--md-sys-color-surface-tonal)",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span data-slot="command-item-icon" className="shrink-0">
          {icon}
        </span>
      ) : null}
      <span data-slot="command-item-label" className="min-w-0 flex-1 truncate">
        {children}
      </span>
      {shortcut ? (
        <span
          data-slot="command-item-shortcut"
          className="shrink-0 text-xs text-(--md-sys-color-on-surface-variant)"
        >
          {shortcut}
        </span>
      ) : null}
    </ComboboxPrimitive.Item>
  );
}

export function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="command-empty"
      className={cnState(
        "kern-command-empty px-3 py-6 text-center text-sm text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function CommandSeparator({
  className,
  ...props
}: CommandSeparatorProps) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="command-separator"
      className={cnState(
        "kern-command-separator mx-2 my-1 h-px bg-(--md-sys-color-outline-variant)",
        className,
      )}
      {...props}
    />
  );
}

export function CommandGroupLabel({
  className,
  ...props
}: CommandGroupLabelProps) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="command-group-label"
      className={cnState(
        "kern-command-group-label px-3 py-2 text-xs font-medium text-(--md-sys-color-on-surface-variant)",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Type-to-filter command palette. Rows come from `options` on the root; each
 * row's `onSelect` runs after `onValueChange`.
 */
export const Command = {
  Root: CommandRoot,
  Input: CommandInput,
  Content: CommandContent,
  List: CommandList,
  Item: CommandItem,
  Empty: CommandEmpty,
  Separator: CommandSeparator,
  GroupLabel: CommandGroupLabel,
};
