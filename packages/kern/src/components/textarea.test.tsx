import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a multiline field", () => {
    render(<Textarea aria-label="Body" />);
    expect(screen.getByRole("textbox", { name: "Body" })).toBeTruthy();
  });
});
