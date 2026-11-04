import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  StatusPill,
  statusToneClassNames,
  statusToneDotClassName,
} from "./status-pill";

describe("StatusPill", () => {
  it("renders the label with the neutral container by default", () => {
    render(<StatusPill>Pending</StatusPill>);
    const pill = screen
      .getByText("Pending")
      .closest("[data-slot='status-pill']");
    expect(pill).toHaveAttribute("data-tone", "neutral");
    expect(pill?.className).toContain(
      "bg-(--sys-color-surface-container-high)",
    );
  });

  it("paints all 7 registry tones with container roles (soft)", () => {
    const tones = [
      ["primary", "bg-(--sys-color-primary-container)"],
      ["secondary", "bg-(--sys-color-secondary-container)"],
      ["success", "bg-(--sys-color-success-container)"],
      ["warning", "bg-(--sys-color-warning-container)"],
      ["error", "bg-(--sys-color-error-container)"],
      ["info", "bg-(--sys-color-info-container)"],
      ["neutral", "bg-(--sys-color-surface-container-high)"],
    ] as const;
    for (const [tone, bg] of tones) {
      const { unmount } = render(<StatusPill tone={tone}>{tone}</StatusPill>);
      const pill = screen.getByText(tone).closest("[data-slot='status-pill']");
      expect(pill?.className).toContain(bg);
      unmount();
    }
  });

  it("fills solid emphasis with the tone roles", () => {
    render(
      <StatusPill tone="error" emphasis="solid">
        Failed
      </StatusPill>,
    );
    const pill = screen
      .getByText("Failed")
      .closest("[data-slot='status-pill']");
    expect(pill?.className).toContain("bg-(--sys-color-error)");
    expect(pill?.className).toContain("text-(--sys-color-on-error)");
  });

  it("shows a tone dot by default and an icon slot when given", () => {
    const { unmount } = render(<StatusPill tone="success">Active</StatusPill>);
    const dot = document.querySelector("[data-slot='status-pill-dot']");
    expect(dot?.className).toContain("bg-(--sys-color-success)");
    unmount();

    render(
      <StatusPill tone="warning" icon={<span data-testid="pill-icon">!</span>}>
        Hold
      </StatusPill>,
    );
    expect(screen.getByTestId("pill-icon")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='status-pill-dot']")).toBeNull();
  });

  it("scales with density", () => {
    render(<StatusPill density="compact">Tiny</StatusPill>);
    const pill = screen.getByText("Tiny").closest("[data-slot='status-pill']");
    expect(pill?.className).toContain("h-6");
  });
});

describe("tone registry helpers", () => {
  it("maps every tone to --sys-* roles only (no raw hex)", () => {
    const tones = [
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
      "info",
      "neutral",
    ] as const;
    for (const tone of tones) {
      for (const emphasis of ["soft", "solid"] as const) {
        const classes = statusToneClassNames(tone, emphasis);
        expect(classes).toContain("--sys-color-");
        expect(classes).not.toMatch(/#[0-9a-f]{3,8}/i);
      }
      expect(statusToneDotClassName(tone)).toContain("--sys-color-");
    }
  });
});
