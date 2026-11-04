import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { type ReactNode, useState } from "react";
import { cn } from "../utils/cn";
import {
  menuItemClass,
  menuPopupClass,
  menuSeparatorClass,
} from "./menu-classes";

export type SplitButtonAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  separated?: boolean;
  onSelect?: () => void;
};

export type SplitButtonVariant = "filled" | "tonal" | "outlined";
export type SplitButtonSize = "xs" | "sm" | "default" | "md" | "lg" | "xl";

const SPLIT_VARIANT_CLASSES: Record<
  SplitButtonVariant,
  { primary: string; trigger: string }
> = {
  filled: {
    primary:
      "bg-(--sys-color-primary) text-(--sys-color-on-primary) before:bg-(--sys-color-on-primary)",
    trigger:
      "bg-(--sys-color-primary) text-(--sys-color-on-primary) border-s border-(--sys-color-outline) before:bg-(--sys-color-on-primary)",
  },
  tonal: {
    primary:
      "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) before:bg-(--sys-color-on-secondary-container)",
    trigger:
      "bg-(--sys-color-secondary-container) text-(--sys-color-on-secondary-container) border-s border-(--sys-color-outline) before:bg-(--sys-color-on-secondary-container)",
  },
  outlined: {
    primary:
      "border border-e-0 border-(--sys-color-outline) bg-transparent text-(--sys-color-primary) before:bg-(--sys-color-primary)",
    trigger:
      "border border-(--sys-color-outline) border-s bg-transparent text-(--sys-color-primary) before:bg-(--sys-color-primary)",
  },
};

const SPLIT_SIZE_CLASSES: Record<
  SplitButtonSize,
  { root: string; primary: string; trigger: string }
> = {
  xs: {
    root: "h-8",
    primary: "h-8 px-3 text-xs [&_svg]:size-4",
    trigger: "h-8 ps-1.5 pe-2.5 [&_svg]:size-4",
  },
  sm: {
    root: "h-9",
    primary: "h-9 px-3.5 text-xs [&_svg]:size-[18px]",
    trigger: "h-9 ps-2 pe-2.5 [&_svg]:size-[18px]",
  },
  default: {
    root: "h-10",
    primary: "h-10 pr-4 pl-4 text-sm [&_svg]:size-[18px]",
    trigger: "h-10 ps-2 pe-3 [&_svg]:size-[18px]",
  },
  md: {
    root: "h-12",
    primary: "h-12 px-5 text-base [&_svg]:size-5",
    trigger: "h-12 ps-2.5 pe-3.5 [&_svg]:size-5",
  },
  lg: {
    root: "h-14",
    primary: "h-14 px-6 text-base [&_svg]:size-6",
    trigger: "h-14 ps-3 pe-4 [&_svg]:size-6",
  },
  xl: {
    root: "h-24",
    primary: "h-24 px-10 text-xl [&_svg]:size-8",
    trigger: "h-24 ps-5 pe-6 [&_svg]:size-8",
  },
};

export type SplitButtonProps = {
  /** Primary action. Also the primary button's accessible name. */
  label: string;
  onClick?: () => void;
  /** Icon inside the primary button. Hidden from assistive tech. */
  icon?: ReactNode;
  /** Overflow actions. An empty list renders no overflow half. */
  actions: SplitButtonAction[];
  /** Accessible name of the overflow trigger. */
  menuLabel?: string;
  /** M3 split button emphasis (`filled` default, `tonal`, `outlined`). */
  variant?: SplitButtonVariant;
  /** M3 Expressive split button size (`default` 40dp). */
  size?: SplitButtonSize;
  disabled?: boolean;
  className?: string;
  testID?: string;
};

export function SplitButton({
  label,
  onClick,
  icon,
  actions,
  menuLabel,
  variant = "filled",
  size = "default",
  disabled = false,
  className,
  testID,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const overflowName = menuLabel ?? `${label} more`;
  const variantCls = SPLIT_VARIANT_CLASSES[variant];
  const sizeCls = SPLIT_SIZE_CLASSES[size];

  return (
    <MenuPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      modal={false}
      disabled={disabled}
    >
      <div
        data-slot="split-button"
        data-variant={variant}
        data-size={size}
        data-testid={testID ?? "kern-split-button"}
        className={cn(
          "kern-split-button inline-flex shrink-0 items-stretch overflow-hidden rounded-(--sys-shape-corner-full)",
          sizeCls.root,
          disabled && "pointer-events-none",
          className,
        )}
      >
        <button
          type="button"
          data-slot="split-button-primary"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            "kern-split-button-primary relative inline-flex items-center gap-2 rounded-s-(--sys-shape-corner-full) leading-5 font-medium tracking-[0.1px] transition-[color,background-color] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none focus-visible:ring-[3px] focus-visible:ring-(--sys-color-secondary) focus-visible:ring-inset disabled:pointer-events-none disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38 before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 [&_svg]:shrink-0",
            variantCls.primary,
            sizeCls.primary,
          )}
        >
          {icon ? (
            <span aria-hidden="true" className="flex items-center">
              {icon}
            </span>
          ) : null}
          {label}
        </button>

        {actions.length > 0 ? (
          <MenuPrimitive.Trigger
            type="button"
            data-slot="split-button-trigger"
            data-open={open || undefined}
            aria-label={overflowName}
            disabled={disabled}
            className={cn(
              "kern-split-button-trigger group relative inline-flex items-center justify-center rounded-e-(--sys-shape-corner-full) transition-[color,background-color] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none focus-visible:ring-[3px] focus-visible:ring-(--sys-color-secondary) focus-visible:ring-inset disabled:pointer-events-none disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38 before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 data-[open]:before:opacity-[var(--sys-state-press)] [&_svg]:shrink-0",
              variantCls.trigger,
              sizeCls.trigger,
            )}
          >
            <span
              aria-hidden="true"
              className="flex items-center transition-transform duration-200 ease-(--sys-motion-easing-standard) group-data-[open]:rotate-180"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </MenuPrimitive.Trigger>
        ) : null}
      </div>

      {actions.length > 0 ? (
        <MenuPrimitive.Portal>
          <MenuPrimitive.Positioner
            sideOffset={4}
            align="end"
            className="kern-split-button-positioner"
          >
            <MenuPrimitive.Popup
              data-slot="split-button-menu"
              className={menuPopupClass}
            >
              {actions.map((action, index) => (
                <div key={action.key}>
                  {action.separated && index > 0 ? (
                    <MenuPrimitive.Separator className={menuSeparatorClass} />
                  ) : null}
                  <MenuPrimitive.Item
                    data-slot="split-button-item"
                    disabled={action.disabled}
                    onClick={() => action.onSelect?.()}
                    className={menuItemClass}
                  >
                    {action.icon ? (
                      <span aria-hidden="true" className="flex items-center">
                        {action.icon}
                      </span>
                    ) : null}
                    {action.label}
                  </MenuPrimitive.Item>
                </div>
              ))}
            </MenuPrimitive.Popup>
          </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
      ) : null}
    </MenuPrimitive.Root>
  );
}
