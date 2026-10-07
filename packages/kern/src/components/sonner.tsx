import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import type { ComponentProps, ReactNode } from "react";
import { cnState } from "../utils/cnState";
import { FOCUS_RING_CLASS } from "./focus-ring";

/** Intent a message carries. Maps to the M3 container color set. */
export type SonnerIntent = "info" | "success" | "warning" | "error";

export type SonnerMessage = {
  /** Headline text. */
  title?: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  /** Semantic tone; drives the leading icon slot and border role. */
  intent?: SonnerIntent;
  /** Optional single action label. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds before auto-dismiss. `0` keeps it until dismissed. */
  timeout?: number;
};

export type SonnerProviderProps = ComponentProps<
  typeof ToastPrimitive.Provider
>;
export type SonnerViewportProps = ComponentProps<
  typeof ToastPrimitive.Viewport
>;
export type SonnerRootProps = ComponentProps<typeof ToastPrimitive.Root> & {
  intent?: SonnerIntent;
};
export type SonnerTitleProps = ComponentProps<typeof ToastPrimitive.Title>;
export type SonnerDescriptionProps = ComponentProps<
  typeof ToastPrimitive.Description
>;
export type SonnerActionProps = ComponentProps<typeof ToastPrimitive.Action>;
export type SonnerCloseProps = ComponentProps<typeof ToastPrimitive.Close>;

/** The imperative surface a `Sonner` app calls. */
export type SonnerApi = {
  /** Underlying Base UI toast manager; hand it to `SonnerProvider`. */
  toastManager: SonnerManager;
  show: (message: SonnerMessage) => string;
  info: (message: SonnerMessage | ReactNode) => string;
  success: (message: SonnerMessage | ReactNode) => string;
  warning: (message: SonnerMessage | ReactNode) => string;
  error: (message: SonnerMessage | ReactNode) => string;
  /** Shows a promise-backed message that swaps text on resolve or reject. */
  promise: <Value>(
    promiseValue: Promise<Value>,
    messages: {
      loading: SonnerMessage;
      success: SonnerMessage | ReactNode;
      error: SonnerMessage | ReactNode;
    },
  ) => Promise<Value>;
  dismiss: (id?: string) => void;
};

export type SonnerManager = ReturnType<
  typeof ToastPrimitive.createToastManager
>;

function toMessage(input: SonnerMessage | ReactNode): SonnerMessage {
  return typeof input === "object" && input !== null && "title" in input
    ? (input as SonnerMessage)
    : { title: input as ReactNode };
}

export function SonnerProvider({ children, ...props }: SonnerProviderProps) {
  return (
    <ToastPrimitive.Provider {...props}>{children}</ToastPrimitive.Provider>
  );
}

export function SonnerViewport({ className, ...props }: SonnerViewportProps) {
  return (
    <ToastPrimitive.Viewport
      data-slot="sonner-viewport"
      className={cnState(
        "kern-sonner-viewport fixed top-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 outline-none",
        className,
      )}
      {...props}
    />
  );
}

const INTENT_BORDER: Record<SonnerIntent, string> = {
  info: "border-l-(--md-sys-color-info)",
  success: "border-l-(--md-sys-color-success)",
  warning: "border-l-(--md-sys-color-warning)",
  error: "border-l-(--md-sys-color-error)",
};

export function SonnerRoot({
  intent = "info",
  className,
  ...props
}: SonnerRootProps) {
  return (
    <ToastPrimitive.Root
      data-slot="sonner"
      data-intent={intent}
      className={cnState(
        "kern-sonner flex items-start gap-3 rounded-(--md-sys-shape-corner-small) border border-(--md-sys-color-outline-variant) border-l-4 bg-(--md-sys-color-inverse-surface) px-4 py-3 text-sm text-(--md-sys-color-inverse-on-surface) shadow-(--md-sys-elevation-level2)",
        INTENT_BORDER[intent],
        className,
      )}
      {...props}
    />
  );
}

export function SonnerTitle({ className, ...props }: SonnerTitleProps) {
  return (
    <ToastPrimitive.Title
      data-slot="sonner-title"
      className={cnState("kern-sonner-title font-medium", className)}
      {...props}
    />
  );
}

export function SonnerDescription({
  className,
  ...props
}: SonnerDescriptionProps) {
  return (
    <ToastPrimitive.Description
      data-slot="sonner-description"
      className={cnState("kern-sonner-description", className)}
      {...props}
    />
  );
}

export function SonnerAction({ className, ...props }: SonnerActionProps) {
  return (
    <ToastPrimitive.Action
      data-slot="sonner-action"
      className={cnState(
        "kern-sonner-action ml-auto shrink-0 cursor-pointer font-medium text-(--md-sys-color-inverse-primary) outline-none " + FOCUS_RING_CLASS,
        className,
      )}
      {...props}
    />
  );
}

export function SonnerClose({ className, ...props }: SonnerCloseProps) {
  return (
    <ToastPrimitive.Close
      data-slot="sonner-close"
      aria-label="Dismiss"
      className={cnState(
        "kern-sonner-close shrink-0 cursor-pointer outline-none " + FOCUS_RING_CLASS,
        className,
      )}
      {...props}
    />
  );
}

/** Renders the queued messages. Place once inside the viewport. */
export function SonnerList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <SonnerRoot
          key={toast.id}
          toast={toast}
          intent={(toast.type as SonnerIntent | undefined) ?? "info"}
        >
          <SonnerTitle />
          <SonnerDescription />
          <SonnerAction />
          <SonnerClose />
        </SonnerRoot>
      ))}
    </>
  );
}

/**
 * Wraps a Base UI toast manager in the imperative call shape apps expect:
 * `const sonner = createSonnerManager(); sonner.success({ title: "Saved" })`.
 * Pair it with `SonnerProvider toastManager={manager}`.
 */
export function createSonnerManager(): SonnerApi {
  const manager = ToastPrimitive.createToastManager();

  function show(input: SonnerMessage | ReactNode): string {
    const message = toMessage(input);
    return manager.add({
      title: message.title,
      description: message.description,
      type: message.intent,
      timeout: message.timeout,
      actionProps: message.action
        ? { children: message.action.label, onClick: message.action.onClick }
        : undefined,
    });
  }

  return {
    toastManager: manager,
    show,
    info: (message) => show({ ...toMessage(message), intent: "info" }),
    success: (message) => show({ ...toMessage(message), intent: "success" }),
    warning: (message) => show({ ...toMessage(message), intent: "warning" }),
    error: (message) => show({ ...toMessage(message), intent: "error" }),
    promise: (promiseValue, messages) => {
      const id = show({ ...toMessage(messages.loading), timeout: 0 });
      return promiseValue
        .then((value) => {
          manager.update(id, toMessage(messages.success));
          return value;
        })
        .catch((error: unknown) => {
          manager.update(id, {
            ...toMessage(messages.error),
            type: "error",
          });
          throw error;
        });
    },
    dismiss: (id) => manager.close(id),
  };
}

/**
 * Transient top-right messages. Render `SonnerProvider` + `SonnerViewport` once
 * per app; show messages through `createSonnerManager()`.
 */
export const Sonner = {
  Provider: SonnerProvider,
  Viewport: SonnerViewport,
  List: SonnerList,
  Root: SonnerRoot,
  Title: SonnerTitle,
  Description: SonnerDescription,
  Action: SonnerAction,
  Close: SonnerClose,
};
