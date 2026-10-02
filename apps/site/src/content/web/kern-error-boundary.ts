import type { ComponentDoc } from "../types";

export const kernErrorBoundary: ComponentDoc = {
  slug: "kern-error-boundary",
  name: "Kern error boundary",
  oneLiner:
    "The kern error boundary catches a thrown render, shows your fallback with a working reset, and never reloads the page to recover.",
  features:
    "Reach for this boundary wherever a subtree's failure should degrade to a message instead of blanking the app. React ships no error boundary of its own, so this is a real class boundary, not a wrapper: a thrown render is caught, the fallback receives BOTH the error and a `reset` callback, and `onError` reports the error with its component stack so a host can forward a real report. Recovery is a re-mount, not a reload — the subtree is keyed on a generation counter, so `reset` discards the failed instance and mounts fresh while host state (a session, an in-flight fetch) survives. The name carries the `Kern` prefix because native's counterpart is `ErrorBoundary`: same role, different name across packages, and the pages cross-reference rather than pretend otherwise.",
  meta: {
    status: "real",
    package: "@xoroh/kern",
    nativePeer: "ErrorBoundary",
    variants: [],
    // The boundary renders no surface of its own (a display-contents wrapper),
    // so it carries no elevation token and M3 tabulates nothing for it.
    elevation: "surface",
  },
  parts: ["KernErrorBoundary"],
  customization: {
    supported: [
      "`fallback` is a render prop receiving `{ error, reset }` — the message AND the way out, in one place.",
      "`onError` receives the error and React's error info, whose `componentStack` makes the report something a host can act on.",
      "`reset` can be offered by the fallback as a retry: it clears the error and re-mounts the subtree.",
    ],
    notSupported: [
      "There is no default fallback UI. A boundary that guesses a message is a boundary that guesses wrong — the fallback is required.",
      "There is no reload-based recovery and no `location.reload()` escape hatch: re-mounting is the recovery, so host application state survives it.",
      "Event handlers and async code outside render are not caught — this is a RENDER boundary, matching React's own semantics.",
    ],
  },
  api: [
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: "The subtree under protection. Re-mounted fresh on every `reset` — the generation key is what makes recovery a re-mount rather than a re-render of a poisoned instance.",
    },
    {
      name: "fallback",
      type: "(props: ErrorBoundaryFallbackProps) => ReactNode",
      required: true,
      note: "Receives `{ error, reset }`. A reset after a successful recovery is a no-op until something throws again — a boundary that rethrows into a resetting parent would loop.",
    },
    {
      name: "onError",
      type: "(error: Error, info: ErrorInfo) => void",
      note: "Called on every caught error with React's error info — `info.componentStack` included so a host can forward a real report rather than a bare message.",
    },
  ],
  aria: [
    "The boundary adds no semantics: the wrapper is `display: contents`, so the fallback you render is the whole accessible surface — name it and make its retry control a real button.",
    "Recovery must be perceivable: when `reset` re-mounts the subtree, moving focus back into the recovered content is the fallback's job, and it is what makes the retry work for everyone.",
    "A caught error that only reaches `onError` is invisible to the user — the fallback is the announcement that something failed.",
  ],
};
