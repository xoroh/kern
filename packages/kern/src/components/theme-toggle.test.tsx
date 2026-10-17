import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

afterEach(cleanup);

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders with destination-named accessible label and toggles on press", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Switch to dark" });
    expect(button).toBeTruthy();
    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);
    expect(
      screen.getByRole("button", { name: "Switch to light" }),
    ).toBeTruthy();
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });

  it("honors controlled mode and onToggle callback", () => {
    const onToggle = vi.fn();
    render(
      <ThemeToggle
        mode="dark"
        onToggle={onToggle}
        testID="theme-toggle-ctrl"
      />,
    );
    const button = screen.getByTestId("theme-toggle-ctrl");
    expect(button.getAttribute("aria-label")).toBe("Switch to light");
    expect(button.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("supports custom label overrides", () => {
    render(<ThemeToggle mode="light" label="Toggle theme appearance" />);
    expect(
      screen.getByRole("button", { name: "Toggle theme appearance" }),
    ).toBeTruthy();
  });

  it("disables interaction when disabled is true", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle disabled onToggle={onToggle} />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("disabled")).not.toBeNull();
    fireEvent.click(button);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
