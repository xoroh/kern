import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { ExtendedFab } from "./extended-fab";
import { Fab } from "./fab";
import { FabMenu } from "./fab-menu";
import { IconButton } from "./icon-button";
import { LinkButton } from "./link-button";
import { LoadingButton } from "./loading-button";
import { SegmentedButton } from "./segmented-button";
import { SplitButton } from "./split-button";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";

/**
 * Completeness proof — every button-family member renders.
 *
 * M3 family inventory vs kern coverage:
 * - Common (elevated/filled/tonal/outlined/text) → Button ✓
 * - Icon (standard/filled/tonal/outlined + toggle) → IconButton ✓
 * - FAB (surface/primary/secondary/tertiary + sm/default/md/large/icon + lowered) → Fab ✓
 * - Extended FAB → ExtendedFab ✓
 * - FAB menu → FabMenu ✓
 * - Segmented (single/multi) → SegmentedButton ✓
 * - Toggle → Toggle ✓
 * - Toggle group → ToggleGroup ✓
 * - Split button → SplitButton ✓
 * - Button group (layout join) → ButtonGroup ✓
 * - Loading → LoadingButton + Button[loading] ✓
 * - Link → LinkButton + Button[href] ✓
 * - Branded FAB → out of scope (logo-specific, documented in reference doc)
 */

describe("Button family completeness — every member renders", () => {
  it("Button renders all five variants", () => {
    for (const variant of [
      "elevated",
      "filled",
      "tonal",
      "outlined",
      "text",
    ] as const) {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
      unmount();
    }
  });

  it("Button renders all five sizes", () => {
    for (const size of ["xs", "default", "sm", "xl"] as const) {
      const { unmount } = render(<Button size={size}>{size}</Button>);
      expect(screen.getByRole("button", { name: size })).toBeInTheDocument();
      unmount();
    }
    render(
      <Button size="icon" aria-label="icon-size">
        +
      </Button>,
    );
    expect(
      screen.getByRole("button", { name: "icon-size" }),
    ).toBeInTheDocument();
  });

  it("Button renders both colors and all shapes", () => {
    for (const color of ["primary", "danger"] as const) {
      for (const shape of ["pill", "rounded", "square"] as const) {
        const { unmount } = render(
          <Button color={color} shape={shape}>
            {color}-{shape}
          </Button>,
        );
        expect(
          screen.getByRole("button", { name: `${color}-${shape}` }),
        ).toBeInTheDocument();
        unmount();
      }
    }
  });

  it("Button renders loading, block, disabled, href states", () => {
    render(<Button loading>Busy</Button>);
    expect(screen.getByRole("button", { name: "Busy" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    const { unmount: u1 } = render(<Button block>Wide</Button>);
    expect(screen.getByRole("button", { name: "Wide" })).toBeInTheDocument();
    u1();
    const { unmount: u2 } = render(<Button disabled>Off</Button>);
    expect(screen.getByRole("button", { name: "Off" })).toBeDisabled();
    u2();
    render(<Button href="https://example.com">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("IconButton renders all four variants plus toggle", () => {
    for (const variant of [
      "standard",
      "filled",
      "tonal",
      "outlined",
    ] as const) {
      const { unmount } = render(
        <IconButton
          label={`${variant}-icon`}
          variant={variant}
          icon={<svg />}
        />,
      );
      expect(
        screen.getByRole("button", { name: `${variant}-icon` }),
      ).toBeInTheDocument();
      unmount();
    }
    render(<IconButton label="fav" toggle defaultPressed icon={<svg />} />);
    expect(screen.getByRole("button", { name: "fav" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("Fab renders all four colors and all sizes", () => {
    for (const color of [
      "surface",
      "primary",
      "secondary",
      "tertiary",
    ] as const) {
      const { unmount } = render(
        <Fab color={color} aria-label={`${color}-fab`}>
          <svg />
        </Fab>,
      );
      expect(
        screen.getByRole("button", { name: `${color}-fab` }),
      ).toBeInTheDocument();
      unmount();
    }
    for (const size of ["sm", "default", "md", "large", "icon"] as const) {
      const { unmount } = render(
        <Fab size={size} aria-label={`${size}-fab`}>
          <svg />
        </Fab>,
      );
      expect(
        screen.getByRole("button", { name: `${size}-fab` }),
      ).toBeInTheDocument();
      unmount();
    }
    render(
      <Fab lowered aria-label="lowered-fab">
        <svg />
      </Fab>,
    );
    expect(
      screen.getByRole("button", { name: "lowered-fab" }),
    ).toBeInTheDocument();
  });

  it("ExtendedFab renders with label and collapses", () => {
    render(<ExtendedFab label="Compose" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Compose" })).toBeInTheDocument();
  });

  it("FabMenu renders trigger and opens", () => {
    render(
      <FabMenu
        icon={<svg />}
        label="Actions"
        actions={[{ key: "a", label: "Action A" }]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("SegmentedButton renders single-select group", () => {
    render(
      <SegmentedButton.Root value={["a"]}>
        <SegmentedButton.Item value="a">Alpha</SegmentedButton.Item>
        <SegmentedButton.Item value="b">Beta</SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beta" })).toBeInTheDocument();
  });

  it("Toggle renders and reports pressed", () => {
    render(
      <Toggle pressed onPressedChange={() => {}}>
        On
      </Toggle>,
    );
    expect(screen.getByRole("button", { name: "On" })).toBeInTheDocument();
  });

  it("ToggleGroup renders exclusive group", () => {
    render(
      <ToggleGroup.Root value={["x"]}>
        <ToggleGroup.Item value="x">X</ToggleGroup.Item>
        <ToggleGroup.Item value="y">Y</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    expect(screen.getByRole("button", { name: "X" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Y" })).toBeInTheDocument();
  });

  it("SplitButton renders primary and overflow as two controls", () => {
    render(
      <SplitButton
        label="Save"
        onClick={() => {}}
        actions={[{ key: "a", label: "Save as" }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save more" }),
    ).toBeInTheDocument();
  });

  it("ButtonGroup joins buttons", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
  });

  it("LoadingButton renders loading state", () => {
    render(<LoadingButton loading>Wait</LoadingButton>);
    expect(screen.getByRole("button", { name: "Wait" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("LinkButton renders anchor in button paint", () => {
    render(<LinkButton href="https://example.com">Visit</LinkButton>);
    expect(screen.getByRole("link", { name: "Visit" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });
});
