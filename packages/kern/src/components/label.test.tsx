import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

describe("Label", () => {
  it("renders text and associates with a control", () => {
    render(<Label htmlFor="x">Email</Label>);
    expect(screen.getByText("Email")).toBeTruthy();
  });
});
