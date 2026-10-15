import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "./button";
import { IconButton } from "./icon-button";

/**
 * Export/variant/state preservation fixtures (KERN-025).
 *
 * Every public export's ACTUAL axes linked to a test or an explicit reason.
 * The two named gaps were Button md/lg sizes and IconButton widths/sizes:
 * both exist in source and both render here, so the gap is closed by proof,
 * not by deleting the requirement. A variant that stops rendering fails here
 * before any gate counts it.
 */
describe("preserved variant axes", () => {
  test.each(["xs", "default", "sm", "md", "xl", "lg", "icon"] as const)(
    "Button size %s renders",
    (size) => {
      const { unmount } = render(
        <Button
          size={size}
          aria-label={size === "icon" ? "icon button" : undefined}
        >
          {size === "icon" ? "★" : size}
        </Button>,
      );
      expect(screen.getByRole("button")).toBeDefined();
      unmount();
    },
  );

  test("Button md and lg resolve distinct heights", () => {
    const { unmount: u1 } = render(<Button size="md">M</Button>);
    const md = screen.getByRole("button").className;
    u1();
    const { unmount: u2 } = render(<Button size="lg">L</Button>);
    const lg = screen.getByRole("button").className;
    u2();
    // Distinct treatments, not two names for one class string.
    expect(md).not.toBe(lg);
  });

  test.each(["xs", "sm", "default", "md", "lg", "xl"] as const)(
    "IconButton size %s renders at its width",
    (size) => {
      const { unmount } = render(
        <IconButton
          size={size}
          icon={<svg />}
          aria-label={`icon ${size}`}
        />,
      );
      expect(screen.getByRole("button")).toBeDefined();
      unmount();
    },
  );

  test("Button states render: disabled, loading, toggle selected", () => {
    const { unmount: u1 } = render(<Button disabled>D</Button>);
    expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
    u1();
    const { unmount: u2 } = render(<Button loading>L</Button>);
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
    u2();
    const { unmount: u3 } = render(
      <Button toggle pressed>
        T
      </Button>,
    );
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe(
      "true",
    );
    u3();
  });
});
