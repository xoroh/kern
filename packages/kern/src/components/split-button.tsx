import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { type ReactNode, useState } from "react";
import { cn } from "../utils/cn";
import {
  menuItemClass,
  menuPopupClass,
  menuSeparatorClass,
} from "./menu-classes";

/**
 * M3 split button — one action, plus an overflow menu for its siblings. The
 * primary action is the *most likely* one and stays a plain button; the overflow
 * is a second, separate control. M3 is explicit that the two must not be one
 * button with two hit regions: a single element that opens a menu on part of
 * itself cannot be announced as either control.
 *
 * Composed on the Base UI menu root, so item traversal, Escape, typeahead and
 * focus-return are the primitive's. What kern owns:
 *
 * - **Two tab stops, two names.** The primary button is named by `label`; the
 *   overflow trigger is named by `menuLabel` and carries `aria-haspopup="menu"`
 *   and `aria-expanded`. A split button implemented as one element is announced
 *   as one button, so the overflow action is unreachable by name.
 * - **Geometry that reads as one control** — the primary carries the full
 *   `corner-full` on its leading side, the overflow the trailing side, and the
 *   divider between them is the M3 1dp `outline`. Two visibly separate buttons
 *   with a seam would be a button group, which is a different component.
 *
 *   CORRECTION: this comment claimed the outline divider while NO border was
 *   rendered anywhere in the file — the two halves were one solid primary pill
 *   with no seam, which is not M3's split button. The 1dp `outline` divider is
 *   now actually applied (`border-s border-(--sys-color-outline)` on the
 *   trigger), and `split-button.test.tsx` pins it so the claim and the
 *   implementation cannot drift apart again.
 * - **The primary action does not open the menu.** Pressing it fires
 *   `onClick` and leaves the overflow closed; that separation is the entire
 *   reason the component exists.
 * - **Selecting an overflow action dismisses the menu**, so the host never has
 *   to close it and cannot forget to.
 * - **Disabled** disables both halves, because a split button whose overflow is
 *   live while its primary is dead is a trap.
 */

export type SplitButtonAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  separated?: boolean;
  onSelect?: () => void;
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
  disabled = false,
  className,
  testID,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const overflowName = menuLabel ?? `${label} more`;

  return (
    <MenuPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      modal={false}
      disabled={disabled}
    >
      <div
        data-slot="split-button"
        data-testid={testID ?? "kern-split-button"}
        className={cn(
          "kern-split-button inline-flex h-10 shrink-0 items-stretch overflow-hidden rounded-(--sys-shape-corner-full)",
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
          className="kern-split-button-primary relative inline-flex h-10 items-center gap-2 rounded-s-(--sys-shape-corner-full) bg-(--sys-color-primary) pr-4 pl-4 text-sm leading-5 font-medium tracking-[0.1px] text-(--sys-color-on-primary) transition-[color,background-color] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none focus-visible:ring-[3px] focus-visible:ring-(--sys-color-secondary) focus-visible:ring-inset disabled:pointer-events-none disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38 before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-primary) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 [[&_svg]:size-[18px]_svg]:size-5 [&_svg]:shrink-0"
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
            className="kern-split-button-trigger relative inline-flex h-10 items-center justify-center rounded-e-(--sys-shape-corner-full) bg-(--sys-color-primary) ps-2 pe-3 text-(--sys-color-on-primary) border-s border-(--sys-color-outline) transition-[color,background-color] duration-200 ease-(--sys-motion-easing-standard) outline-none select-none focus-visible:ring-[3px] focus-visible:ring-(--sys-color-secondary) focus-visible:ring-inset disabled:pointer-events-none disabled:bg-(--sys-color-on-surface)/12 disabled:text-(--sys-color-on-surface)/38 before:absolute before:inset-0 before:rounded-[inherit] before:content-[''] before:opacity-0 before:transition-opacity before:duration-150 before:bg-(--sys-color-on-primary) hover:before:opacity-[var(--sys-state-hover)] focus-visible:before:opacity-[var(--sys-state-focus)] active:before:opacity-[var(--sys-state-press)] disabled:before:opacity-0 data-[open]:before:opacity-[var(--sys-state-press)] [[&_svg]:size-[18px]_svg]:size-5"
          >
            <span aria-hidden="true" className="flex items-center">
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
            {/* No `aria-label` here: the root already points `aria-labelledby`
                at the trigger, so a second name would compete with it. The menu
                announces as the control that opened it. */}
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
