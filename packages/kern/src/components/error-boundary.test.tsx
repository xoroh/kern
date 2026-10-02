import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { KernErrorBoundary } from "./error-boundary";

/**
 * The four contract obligations from docs/parity-contract.md, each asserted by
 * BEHAVIOUR: catch, fallback receives error + reset, reset re-mounts without a
 * reload, onError is called.
 */
function Boom({ shouldThrow }: { shouldThrow: boolean }): React.ReactNode {
  if (shouldThrow) throw new Error("kaboom");
  return <p>child content</p>;
}

describe("KernErrorBoundary", () => {
  it("catches a thrown render and does NOT blank the app", () => {
    render(
      <KernErrorBoundary
        fallback={({ error }) => <p>caught: {error.message}</p>}
      >
        <Boom shouldThrow />
      </KernErrorBoundary>,
    );
    expect(screen.getByText(/caught: kaboom/)).toBeInTheDocument();
  });

  it("hands the fallback the error AND a reset callback", () => {
    const seen: { error?: Error; reset?: () => void } = {};
    render(
      <KernErrorBoundary
        fallback={(props) => {
          seen.error = props.error;
          seen.reset = props.reset;
          return <p>fallback</p>;
        }}
      >
        <Boom shouldThrow />
      </KernErrorBoundary>,
    );
    expect(seen.error?.message).toBe("kaboom");
    expect(typeof seen.reset).toBe("function");
  });

  // The recovery half of the contract: a fresh mount, NOT a page reload.
  it("reset re-mounts the subtree without a reload", () => {
    function Harness() {
      const [broken, setBroken] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setBroken(false)}>
            repair the child
          </button>
          <KernErrorBoundary
            fallback={({ reset }) => (
              <button type="button" onClick={reset}>
                retry
              </button>
            )}
          >
            <Boom shouldThrow={broken} />
          </KernErrorBoundary>
        </>
      );
    }

    const reload = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload },
    });

    render(<Harness />);
    expect(screen.queryByText(/kaboom/)).toBeNull();
    expect(screen.getByRole("button", { name: "retry" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "retry" }));

    // A reload would have destroyed the sibling button that repairs the child.
    // It is still here, so the recovery was a re-mount inside this document.
    expect(reload).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "repair the child" }),
    ).toBeInTheDocument();

    // Now repair the child and retry: the subtree must come back to life.
    fireEvent.click(screen.getByRole("button", { name: "repair the child" }));
    fireEvent.click(screen.getByRole("button", { name: "retry" }));
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("reports the error through onError", () => {
    const onError = vi.fn();
    // React logs the caught error; silence it so the run stays readable.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <KernErrorBoundary fallback={() => <p>fallback</p>} onError={onError}>
        <Boom shouldThrow />
      </KernErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect((onError.mock.calls[0][0] as Error).message).toBe("kaboom");
    spy.mockRestore();
  });

  it("renders children untouched when nothing throws", () => {
    render(
      <KernErrorBoundary fallback={() => <p>fallback</p>}>
        <Boom shouldThrow={false} />
      </KernErrorBoundary>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
    expect(screen.queryByText("fallback")).toBeNull();
  });
});
