import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

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
        "kern-snackbar flex min-h-12 items-center gap-3 rounded-(--sys-shape-corner-extra-small) bg-(--sys-color-inverse-surface) px-4 py-3 text-sm text-(--sys-color-inverse-on-surface) shadow-(--sys-elevation-level3)",
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
        "kern-snackbar-action ml-auto shrink-0 cursor-pointer font-medium text-(--sys-color-inverse-primary) outline-none " +
          FOCUS_RING_CLASS,
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
        "kern-snackbar-close shrink-0 cursor-pointer outline-none " +
          FOCUS_RING_CLASS,
        className,
      )}
      {...props}
    />
  );
}

/** A message the snackbar shows. M3 has no tone or intent colours: every
 * message is neutral confirmation, so there is no `intent` field. */
export type SnackbarMessage = {
  /** Headline text. */
  title?: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  /** Optional single action label. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. */
  timeout?: number;
};

function toSnackbarMessage(
  input: SnackbarMessage | ReactNode,
): SnackbarMessage {
  return typeof input === "object" && input !== null && "title" in input
    ? (input as SnackbarMessage)
    : { title: input as ReactNode };
}

export type SnackbarApi = {
  /** Underlying Base UI toast manager; hand it to `SnackbarProvider`. */
  toastManager: ReturnType<typeof ToastPrimitive.createToastManager>;
  /** Show a message; returns its id. */
  show: (message: SnackbarMessage | ReactNode) => string;
  /** Shows a loading message that swaps to the result on settle (M3
   * loading-then-result): resolve swaps text, reject swaps text and
   * rethrows. No tone on either branch — M3 has none. */
  promise: <Value>(
    promiseValue: Promise<Value>,
    messages: {
      loading: SnackbarMessage;
      success: SnackbarMessage | ReactNode;
      error: SnackbarMessage | ReactNode;
    },
  ) => Promise<Value>;
  /** Dismiss one message, or all when no id is given. */
  dismiss: (id?: string) => void;
};

/** Renders every queued toast with the Kern recipe. Place inside Viewport. */
export function SnackbarList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <SnackbarRoot key={toast.id} toast={toast}>
          <SnackbarTitle />
          <SnackbarDescription />
          <SnackbarAction />
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

export const useSnackbarManager = ToastPrimitive.useToastManager;

/**
 * The imperative surface a `Snackbar` app calls:
 * `const snackbar = createSnackbarManager(); snackbar.show({ title: "Saved" })`.
 * Pair it with `SnackbarProvider toastManager={snackbar.toastManager}`.
 * No intent helpers (`info/success/warning/error`): M3 has no tone, so a
 * toned call has nowhere to go.
 */
export function createSnackbarManager(): SnackbarApi {
  const manager = ToastPrimitive.createToastManager();

  function show(input: SnackbarMessage | ReactNode): string {
    const message = toSnackbarMessage(input);
    return manager.add({
      title: message.title,
      description: message.description,
      timeout: message.timeout,
      actionProps: message.action
        ? { children: message.action.label, onClick: message.action.onClick }
        : undefined,
    });
  }

  return {
    toastManager: manager,
    show,
    promise: (promiseValue, messages) => {
      const id = show({ ...toSnackbarMessage(messages.loading), timeout: 0 });
      return promiseValue
        .then((value) => {
          manager.update(id, toSnackbarMessage(messages.success));
          return value;
        })
        .catch((error: unknown) => {
          manager.update(id, toSnackbarMessage(messages.error));
          throw error;
        });
    },
    dismiss: (id) => manager.close(id),
  };
}
