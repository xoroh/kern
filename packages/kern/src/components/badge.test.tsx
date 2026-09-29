import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders label with shape variant", () => {
    render(<Badge variant="dot">New</Badge>);
    expect(screen.getByText("New")).toBeTruthy();
  });
});
