import type { ComponentDoc } from "../types";

export const errorBoundary: ComponentDoc = {
  slug: "error-boundary",
  name: "Error boundary",
  oneLiner:
    "Error boundaries catch a thrown render so one broken screen does not blank the whole app.",
  features:
    "Reach for an error boundary around a screen or a route, so a crash in one place leaves the rest of the app standing. It is the native analogue of the web `ErrorBoundary` and works the same way: children render normally, and if they throw, the boundary catches and renders your fallback instead. The fallback receives both the error and a `reset` callback, so recovery is yours to design — and the source is explicit that recovery differs per route, which is why the fallback is app-specific rather than a default kern screen. Keep it high enough to matter and low enough to be specific.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // The web counterpart is named `KernErrorBoundary`, not `ErrorBoundary` —
    // checked in the web inventory rather than assumed, which is what the peer
    // gate is for. Same role, different name across the two packages.
    nativePeer: "KernErrorBoundary",
    variants: [],
    elevation: "surface",
  },
  parts: ["ErrorBoundary"],
  customization: {
    supported: [
      "`fallback` is a function of the error and a `reset` callback, so recovery is entirely yours.",
      "`onError` reports the error and the React error info for logging.",
      "`children` is what it protects.",
    ],
    notSupported: [
      "There is no default fallback UI. Kern ships no recovery screen, because recovery differs per route — a generic one would be wrong for most apps.",
      "There is no `onReset`/`retryCount`. The reset is the callback passed to your fallback.",
      "It does not catch errors outside render — event handlers and async work are not its scope.",
    ],
  },
  api: [
    {
      name: "fallback",
      type: "(error: Error, reset: () => void) => ReactNode",
      note: "Rendered WITH the error and a reset callback. App-specific on purpose — the source says recovery differs per route, so kern ships no default screen.",
    },
    {
      name: "onError",
      type: "(error: Error, info: ErrorInfo) => void",
      note: "Reports the error and the React error info. This is where logging goes.",
    },
    {
      name: "children",
      type: "ReactNode",
      note: "What it protects. A thrown render in here is caught rather than blanking the app.",
    },
    {
      name: "class",
      type: "React.Component",
      note: "It is a CLASS component — the one form React supports for error boundaries. Function components cannot do this.",
    },
  ],
  aria: [
    "The fallback is what a reader lands on after a crash, so it is the recovery path's only chance to say what happened and what to do.",
    "The `reset` callback is what makes recovery possible rather than a dead end — a boundary with no way back turns one error into a closed app.",
    "It catches RENDER errors only. Errors in event handlers and async work are outside its scope and need their own handling.",
  ],
};
