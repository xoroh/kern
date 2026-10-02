import type { ComponentDoc } from "../types";

/**
 * `pressIsCancelled` is NOT a component. It is a pure predicate exported from
 * the IconButton implementation, and this page documents its contract rather
 * than inventing an anatomy it does not have.
 */
export const pressIsCancelled: ComponentDoc = {
  slug: "press-is-cancelled",
  name: "pressIsCancelled",
  oneLiner:
    "pressIsCancelled is a pure predicate that reports whether a host cancelled a press event.",
  features:
    "This is not a component. It exists as a named, exported predicate so the contract can be tested honestly, and that is the whole reason it is a top-level export at all. React Native's Testing Library synthesises press events exposing both `preventDefault()` and `isDefaultPrevented()`, but `isDefaultPrevented()` is a no-op stub that returns `false` even after `preventDefault()` was called — so `fireEvent.press` cannot exercise a `isDefaultPrevented()` guard at all. Testing this predicate directly is the only way the contract is actually covered. Reach for it in your own press handlers if you want the same rule: a press the host cancelled should not act.",
  meta: {
    status: "real",
    package: "@xoroh/kern-native",
    // Native-only utility. The web `onClick` model has `defaultPrevented` on
    // the DOM event itself; there is no kern export to name as a peer.
    nativePeer: "none",
    variants: [],
    elevation: "none",
  },
  // Which exports this page documents. `parts` is ownership, not anatomy — so
  // the predicate is listed here while `anatomy` stays absent below.
  parts: ["pressIsCancelled"],
  customization: {
    supported: [
      "Call it with the event object your press handler receives and branch on the result.",
    ],
    notSupported: [
      "It renders nothing and has no visual form.",
      "There is no configuration: the rule is fixed and total — an event whose `isDefaultPrevented()` says true is cancelled, everything else is not.",
    ],
  },
  api: [
    {
      name: "event",
      type: "{ isDefaultPrevented?: () => boolean } | undefined",
      note: "The press event. Optional — and an absent or unknown event is treated as NOT cancelled, because a press with no event object is a press we have no reason to suppress.",
    },
    {
      name: "returns",
      type: "boolean",
      note: "`true` only when `isDefaultPrevented` is a function and it returns `true`. Anything else — no event, no such method, a method that returns false — is `false`.",
    },
  ],
  aria: [
    "Pure logic; no accessibility tree.",
    "It is nevertheless an accessibility-relevant contract: a cancelled press is one the host said not to act on, and ignoring that would fire actions the host explicitly suppressed.",
    "The testing note is worth keeping in mind when writing your own tests — `fireEvent.press` cannot reach this branch, so assert the predicate directly.",
  ],
};
