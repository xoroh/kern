import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";

export type SnackbarProviderProps = ComponentProps<
  typeof ToastPrimitive.Provider
> & {
  children?: ReactNode;
};
export type SnackbarRootProps = ComponentProps<typeof ToastPrimitive.Root>;
export type SnackbarTitleProps = ComponentProps<typeof ToastPrimitive.Title>;
export type SnackbarDescriptionProps = ComponentProps<
  typeof ToastPrimitive.Description
>;
export type SnackbarActionProps = ComponentProps<typeof ToastPrimitive.Action>;
export type SnackbarCloseProps = ComponentProps<typeof ToastPrimitive.Close>;

export function SnackbarProvider({
  children,
  ...props
}: SnackbarProviderProps) {
  return (
    <ToastPrimitive.Provider {...props}>{children}</ToastPrimitive.Provider>
  );
}

export function SnackbarViewport({
  className,
  ...props
}: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="snackbar-viewport"
      className={cnState(
        "kern-snackbar-viewport fixed bottom-4 left-1/2 z-50 flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function SnackbarRoot({ className, ...props }: SnackbarRootProps) {
  return (
    <ToastPrimitive.Root
      data-slot="snackbar"
      className={cnState(
        "kern-snackbar flex min-h-12 items-center gap-3 rounded-(--md-sys-shape-corner-extra-small) bg-(--md-sys-color-inverse-surface) px-4 py-3 text-sm text-(--md-sys-color-inverse-on-surface) shadow-(--md-sys-elevation-level2)",
        className,
      )}
      {...props}
    />
  );
}

export function SnackbarTitle({ className, ...props }: SnackbarTitleProps) {
  return (
    <ToastPrimitive.Title
      data-slot="snackbar-title"
      className={cnState("kern-snackbar-title font-medium", className)}
      {...props}
    />
  );
}

export function SnackbarDescription({
  className,
  ...props
}: SnackbarDescriptionProps) {
  return (
    <ToastPrimitive.Description
      data-slot="snackbar-description"
      className={cnState("kern-snackbar-description", className)}
      {...props}
    />
  );
}

export function SnackbarAction({ className, ...props }: SnackbarActionProps) {
  return (
    <ToastPrimitive.Action
      data-slot="snackbar-action"
      className={cnState(
        "kern-snackbar-action ml-auto shrink-0 cursor-pointer font-medium text-(--md-sys-color-inverse-primary) outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)",
        className,
      )}
      {...props}
    />
  );
}

export function SnackbarClose({ className, ...props }: SnackbarCloseProps) {
  return (
    <ToastPrimitive.Close
      data-slot="snackbar-close"
      aria-label="Dismiss"
      className={cnState(
        "kern-snackbar-close shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-secondary)",
        className,
      )}
      {...props}
    />
  );
}

/** Renders every queued toast with the Kern recipe. Place inside Viewport. */
export function SnackbarList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <SnackbarRoot key={toast.id} toast={toast}>
          <SnackbarTitle />
          <SnackbarDescription />
          <SnackbarClose />
        </SnackbarRoot>
      ))}
    </>
  );
}

/**
 * Transient bottom message with one action. Render SnackbarViewport once per
 * app inside SnackbarProvider; show messages through the toast manager.
 */
export const Snackbar = {
  Provider: SnackbarProvider,
  Viewport: SnackbarViewport,
  List: SnackbarList,
  Root: SnackbarRoot,
  Title: SnackbarTitle,
  Description: SnackbarDescription,
  Action: SnackbarAction,
  Close: SnackbarClose,
};

export const createSnackbarManager = ToastPrimitive.createToastManager;
export const useSnackbarManager = ToastPrimitive.useToastManager;
