import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputOTP } from "./input-otp";

/**
 * U7 (kern-oss-upstream-v1): input-otp edge hardening.
 *
 * Backup-code and security-key steps stress these paths: the cell count must
 * match the root length, and disabled/readOnly must reach every cell — a
 * half-disabled code row silently eats pastes.
 */
describe("InputOTP", () => {
  function cells(length = 4) {
    return (
      <InputOTP.Root length={length} aria-label="One-time code">
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>
    );
  }

  it("renders one textbox per cell inside the named group", () => {
    render(cells(4));
    expect(
      screen.getByRole("group", { name: "One-time code" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("disables every cell when the root is disabled", () => {
    render(
      <InputOTP.Root length={4} aria-label="One-time code" disabled>
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>,
    );
    for (const box of screen.getAllByRole("textbox")) {
      expect(box).toBeDisabled();
    }
  });

  it("marks every cell read-only when the root is read-only", () => {
    render(
      <InputOTP.Root length={4} aria-label="One-time code" readOnly>
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>,
    );
    for (const box of screen.getAllByRole("textbox")) {
      expect(box).toHaveAttribute("readonly");
    }
  });

  it("reflects a default value across the cells", () => {
    render(
      <InputOTP.Root length={4} aria-label="One-time code" defaultValue="1234">
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
        <InputOTP.Input />
      </InputOTP.Root>,
    );
    const boxes = screen.getAllByRole("textbox");
    expect(boxes.map((box) => (box as HTMLInputElement).value)).toEqual([
      "1",
      "2",
      "3",
      "4",
    ]);
  });
});
