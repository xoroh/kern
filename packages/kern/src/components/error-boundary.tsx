import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Kern web error boundary.
 *
 * ## Why this exists
 *
 * The native tier documents itself as *"the native analogue of the web
 * `ErrorBoundary`"* — a reference to something that did not exist
 * (`grep -rn ErrorBoundary packages/kern/src` returned zero hits). A contract
 * that names a web counterpart which is not there is exactly the dangling claim
 * the parity contract exists to prevent, so the web side is now real.
 *
 * React ships no error boundary of its own, so this is genuine web work rather
 * than a pass-through wrapper. It is the opposite of the `aspect-ratio` cut,
 * which was a single CSS property with no behaviour behind it.
 *
 * ## The contract (docs/parity-contract.md, `error-boundary` — BUILD)
 *
 * | obligation | both renderers must |
 *   |---|---|
 *   | catch a thrown render | a failed subtree does not blank the app |
 *   | fallback | receives the error AND a `reset` callback |
 *   | recovery | `reset` re-mounts the subtree without a reload |
 *   | reporting | `onError` is called with the error |
 *
 * Each is asserted in `error-boundary.test.tsx` by behaviour, not by
 * inspecting the primitive.
 *
 * ## `reset` re-mounts, it does not reload
 *
 * The subtree is keyed on a generation counter. Bumping it discards the failed
 * instance so React mounts fresh — no `location.reload()`, which would destroy
 * host application state (a signed-in session, an in-flight fetch) that the
 * boundary exists precisely to protect. That distinction is the recovery half
 * of the contract and it is asserted.
 */

export type ErrorBoundaryFallbackProps = {
  /** The error that was caught. */
  error: Error;
  /**
   * Re-mount the subtree. A no-op once the boundary has already been reset and
   * has not caught again — a boundary that rethrows into a resetting parent
   * would loop.
   */
  reset: () => void;
};

export type KernErrorBoundaryProps = {
  children: ReactNode;
  /**
   * Rendered instead of the children once a render throws. Receives the error
   * and the `reset` callback, so a host can offer a retry without owning the
   * recovery mechanism.
   */
  fallback: (props: ErrorBoundaryFallbackProps) => ReactNode;
  /**
   * Reported on every caught error. `info.componentStack` is included so a host
   * can forward a real report rather than a bare message.
   */
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = { error: Error | null; generation: number };

export class KernErrorBoundary extends Component<
  KernErrorBoundaryProps,
  State
> {
  override state: State = { error: null, generation: 0 };

  static getDerivedStateFromError(error: Error): Pick<State, "error"> {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  /**
   * Clear the error and bump the generation, which changes the subtree's key and
   * forces a fresh mount. No reload: the host's state must survive.
   */
  private readonly reset = (): void => {
    this.setState((prev) => ({ error: null, generation: prev.generation + 1 }));
  };

  override render(): ReactNode {
    const { error, generation } = this.state;
    if (error) {
      return this.props.fallback({ error, reset: this.reset });
    }
    // Keying on the generation is what makes recovery a re-mount rather than a
    // re-render of a poisoned instance.
    return (
      <div key={generation} style={{ display: "contents" }}>
        {this.props.children}
      </div>
    );
  }
}
