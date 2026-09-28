import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldMessage } from "./field-message";
import { Separator } from "./separator";
import { Text } from "./text";

describe("Text", () => {
  it("renders the title variant", () => {
    render(<Text variant="title">Hello</Text>);
    expect(screen.getByText("Hello")).toHaveClass("text-lg");
  });
});

describe("Separator", () => {
  it("renders horizontal by default", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep).toHaveAttribute("role", "separator");
    expect(sep).toHaveClass("h-px");
  });
});

describe("FieldMessage", () => {
  it("announces errors", () => {
    render(<FieldMessage variant="error">Required</FieldMessage>);
    const message = screen.getByRole("alert");
    expect(message).toHaveTextContent("Required");
    expect(message).toHaveClass("text-(--md-sys-color-error)");
  });
});
