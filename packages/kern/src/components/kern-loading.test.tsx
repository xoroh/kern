import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KernLoading } from "./kern-loading";

describe("KernLoading", () => {
  it("renders a spinner with an announced label by default", () => {
    render(<KernLoading label="Loading rides" />);
    const region = document.querySelector(
      "[data-slot='kern-loading'][data-kind='spinner']",
    );
    expect(region).toBeTruthy();
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading rides",
    );
  });

  it("renders a skeleton list with the requested row count", () => {
    render(<KernLoading kind="skeleton-list" count={4} label="Loading list" />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-label", "Loading list");
    expect(document.querySelectorAll("[data-slot='skeleton']")).toHaveLength(4);
  });

  it("renders determinate progress with a real value", () => {
    render(<KernLoading kind="progress" value={0.4} label="Syncing" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });

  it("renders the indeterminate loop when progress value is null", () => {
    render(<KernLoading kind="progress" value={null} label="Syncing" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("renders a shimmer card composition", () => {
    render(<KernLoading kind="shimmer-card" label="Loading card" />);
    const region = document.querySelector(
      "[data-slot='kern-loading'][data-kind='shimmer-card']",
    );
    expect(region).toBeTruthy();
    expect(
      region?.querySelectorAll("[data-slot='skeleton']").length,
    ).toBeGreaterThan(2);
  });
});
