import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { ExtendedFab, type ExtendedFabHandle } from "./extended-fab";

/**
 * P2-1 proof, item 4 of 7: the extended FAB.
 *
 * This component owns the one behaviour M3 specifies that kern cannot trigger
 * itself — the collapse. M3 fires it on scroll, which is host state, so the
 * trigger is an imperative Handle. That makes the Handle the contract, and it
 * is where the interesting defects live.
 */
describe("ExtendedFab", () => {
  // ---------------------------------------------------------------
  // The label is both the visible text and the accessible name.
  // ---------------------------------------------------------------

  it("shows the label beside the icon", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" />);
    expect(screen.getByRole("button")).toHaveTextContent("Compose");
  });

  it("names itself with the label", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" />);
    expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
  });

  // THE load-bearing case: collapsed, the visible label is gone, so `label` on
  // the element is the only thing left to announce. A collapsed FAB that kept
  // the label in the a11y tree would announce a longer name than it shows; one
  // with neither announces nothing at all.
  it("keeps the accessible name when collapsed, though the text is not rendered", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" collapsed />);
    const button = screen.getByRole("button", { name: "Compose" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-collapsed", "true");
    // The visible text is collapsed away — which is exactly why the name must
    // live on the attribute.
    expect(button).not.toHaveTextContent("Compose");
  });

  it("hides the label glyph from assistive tech", () => {
    const { container } = render(<ExtendedFab icon={<svg />} label="Compose" />);
    expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
  });

  // ---------------------------------------------------------------
  // The imperative Handle — M3's scroll-triggered collapse
  // ---------------------------------------------------------------

  it("collapses and expands through the handle", () => {
    const ref = createRef<ExtendedFabHandle>();
    render(<ExtendedFab ref={ref} icon={<svg />} label="Compose" />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveAttribute("data-collapsed");

    // The handle is the component's public API; calling it drives state, so it
    // goes in act() exactly as a user event would.
    act(() => ref.current?.collapse());
    expect(screen.getByRole("button")).toHaveAttribute("data-collapsed", "true");

    act(() => ref.current?.expand());
    expect(screen.getByRole("button")).not.toHaveAttribute("data-collapsed");
  });

  it("toggles through the handle", () => {
    const ref = createRef<ExtendedFabHandle>();
    render(<ExtendedFab ref={ref} icon={<svg />} label="Compose" />);
    act(() => ref.current?.toggle());
    expect(screen.getByRole("button")).toHaveAttribute("data-collapsed", "true");
    act(() => ref.current?.toggle());
    expect(screen.getByRole("button")).not.toHaveAttribute("data-collapsed");
  });

  // IDEMPOTENCE IS THE WHOLE POINT. Two wheel events in the same direction
  // (a trackpad flick produces a stream of them) must report ONE collapse. If
  // collapse() is not idempotent, every consumer binding it to scroll gets a
  // duplicate onCollapsedChange per gesture and has to debounce defensively.
  it("collapse() is idempotent — repeat calls report once", () => {
    const ref = createRef<ExtendedFabHandle>();
    const onCollapsedChange = vi.fn();
    render(
      <ExtendedFab
        ref={ref}
        icon={<svg />}
        label="Compose"
        onCollapsedChange={onCollapsedChange}
      />,
    );
    act(() => {
      ref.current?.collapse();
      ref.current?.collapse();
      ref.current?.collapse();
    });
    expect(onCollapsedChange).toHaveBeenCalledTimes(1);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("expand() is idempotent too", () => {
    const ref = createRef<ExtendedFabHandle>();
    const onCollapsedChange = vi.fn();
    render(
      <ExtendedFab
        ref={ref}
        icon={<svg />}
        label="Compose"
        collapsed
        onCollapsedChange={onCollapsedChange}
      />,
    );
    act(() => {
      ref.current?.expand();
      ref.current?.expand();
    });
    expect(onCollapsedChange).toHaveBeenCalledTimes(1);
    expect(onCollapsedChange).toHaveBeenCalledWith(false);
  });

  // A controlled host may not re-render between two calls in the same tick.
  // Recording the intent immediately is what makes that safe.
  it("reports the second toggle correctly when a controlled host does not re-render", () => {
    const ref = createRef<ExtendedFabHandle>();
    const onCollapsedChange = vi.fn();
    render(
      <ExtendedFab
        ref={ref}
        icon={<svg />}
        label="Compose"
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    act(() => {
      ref.current?.toggle();
      ref.current?.toggle();
    });
    // Without immediate intent recording both calls would read the same stale
    // prop and report true twice.
    expect(onCollapsedChange).toHaveBeenNthCalledWith(1, true);
    expect(onCollapsedChange).toHaveBeenNthCalledWith(2, false);
  });

  // ---------------------------------------------------------------
  // Controlled / uncontrolled
  // ---------------------------------------------------------------

  it("honours defaultCollapsed", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" defaultCollapsed />);
    expect(screen.getByRole("button")).toHaveAttribute("data-collapsed", "true");
  });

  it("does not move a controlled collapsed prop on its own", () => {
    const ref = createRef<ExtendedFabHandle>();
    const onCollapsedChange = vi.fn();
    render(
      <ExtendedFab
        ref={ref}
        icon={<svg />}
        label="Compose"
        collapsed={false}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    act(() => ref.current?.collapse());
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    // Still expanded: the host owns it and has not agreed yet.
    expect(screen.getByRole("button")).not.toHaveAttribute("data-collapsed");
  });

  // ---------------------------------------------------------------
  // Tokens — the extended FAB is the SAME button at a different width
  // ---------------------------------------------------------------

  it("uses the plain FAB's resting elevation and corner-large shape", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" />);
    const className = screen.getByRole("button").className;
    expect(className).toContain("shadow-(--md-sys-elevation-level3)");
    expect(className).toContain("rounded-(--md-sys-shape-corner-large)");
  });

  it("disables the button", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("defaults type to button", () => {
    render(<ExtendedFab icon={<svg />} label="Compose" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});