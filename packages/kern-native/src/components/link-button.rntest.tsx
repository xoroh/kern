/**
 * Native behaviour suite for LinkButton — the button treatment on a
 * navigation control. Bridges onto `buttonStyles` (one treatment, two
 * roles); what differs from Button is the link role and the default press.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";
import { LinkButton } from "./link-button";

describe("LinkButton (native)", () => {
  it("exposes the link role, not the button role", async () => {
    await render(<LinkButton href="https://example.com">Docs</LinkButton>);
    expect(screen.getByRole("link", { name: "Docs" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Docs" })).toBeNull();
  });

  it("opens href via Linking when no onPress is given", async () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    try {
      await render(<LinkButton href="https://example.com">Docs</LinkButton>);
      fireEvent.press(screen.getByRole("link", { name: "Docs" }));
      expect(open).toHaveBeenCalledWith("https://example.com");
    } finally {
      open.mockRestore();
    }
  });

  it("prefers onPress over the default openURL", async () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    const onPress = jest.fn();
    try {
      await render(
        <LinkButton href="https://example.com" onPress={onPress}>
          Docs
        </LinkButton>,
      );
      fireEvent.press(screen.getByRole("link", { name: "Docs" }));
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(open).not.toHaveBeenCalled();
    } finally {
      open.mockRestore();
    }
  });

  it("blocks the press while disabled", async () => {
    const open = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    try {
      await render(
        <LinkButton href="https://example.com" disabled>
          Docs
        </LinkButton>,
      );
      fireEvent.press(screen.getByRole("link", { name: "Docs" }));
      expect(open).not.toHaveBeenCalled();
    } finally {
      open.mockRestore();
    }
  });

  it("wears the Button treatment for every variant", async () => {
    await render(
      <LinkButton href="https://example.com" variant="tonal">
        Docs
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "Docs" })).toBeTruthy();
    expect(screen.getByTestId("kern-link-button")).toBeTruthy();
  });
});
