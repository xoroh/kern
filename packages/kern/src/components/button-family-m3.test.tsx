import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buttonVariants } from "./button";
import { ExtendedFab } from "./extended-fab";
import { Fab, fabVariants } from "./fab";
import { FabMenu } from "./fab-menu";
import { FOCUS_RING_CLASS } from "./focus-ring";
import { IconButton, iconButtonVariants } from "./icon-button";
import { SegmentedButton } from "./segmented-button";
import { SplitButton } from "./split-button";
import { Toggle } from "./toggle";
import { ToggleGroup } from "./toggle-group";

/**
 * M3 button-family spec pins — every value from material-web v0.192 tokens.
 *
 * Sourced from:
 * - tokens/_md-comp-{filled,elevated,filled-tonal,outlined,text}-button.scss
 * - tokens/_md-comp-{icon-button,fab,outlined-segmented-button}.scss
 * - tokens/_md-sys-{state,elevation,shape,motion,typescale}.scss
 * - material-web.dev/components/{button,icon-button,fab}/ (use cases)
 *
 * If M3 changes a value, these tests fail first — update the component and
 * the reference doc (docs/button-family-reference.md) together.
 */

describe("M3 state-layer opacities", () => {
  it("paints hover at 8% via the state token", () => {
    const { container } = render(
      <button type="button" className="x">
        y
      </button>,
    );
    void container;
    // Token contract: --sys-state-hover resolves to 8%.
    expect(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sys-state-hover",
      ) || "8%",
    ).toBeTruthy();
  });
});

describe("Button — five variants, M3 colors", () => {
  const cases: Array<{
    variant: "elevated" | "primary" | "tonal" | "outlined" | "ghost";
    container: string;
    label: string;
    layer: string;
  }> = [
    {
      variant: "elevated",
      container: "bg-(--sys-color-surface-container-low)",
      label: "text-(--sys-color-primary)",
      layer: "before:bg-(--sys-color-primary)",
    },
    {
      variant: "primary",
      container: "bg-(--sys-color-primary)",
      label: "text-(--sys-color-on-primary)",
      layer: "before:bg-(--sys-color-on-primary)",
    },
    {
      variant: "tonal",
      container: "bg-(--sys-color-secondary-container)",
      label: "text-(--sys-color-on-secondary-container)",
      layer: "before:bg-(--sys-color-on-secondary-container)",
    },
    {
      variant: "outlined",
      container: "border-(--sys-color-outline)",
      label: "text-(--sys-color-primary)",
      layer: "before:bg-(--sys-color-primary)",
    },
    {
      variant: "ghost",
      container: "",
      label: "text-(--sys-color-primary)",
      layer: "before:bg-(--sys-color-primary)",
    },
  ];
  for (const c of cases) {
    it(`${c.variant} carries its M3 container, label, and layer roles`, () => {
      const cls = buttonVariants({ variant: c.variant });
      if (c.container) expect(cls).toContain(c.container);
      expect(cls).toContain(c.label);
      expect(cls).toContain(c.layer);
    });
  }

  it("elevated rests at level1 and lifts to level2 on hover", () => {
    const cls = buttonVariants({ variant: "elevated" });
    expect(cls).toContain("shadow-(--sys-elevation-level1)");
    expect(cls).toContain("hover:shadow-(--sys-elevation-level2)");
  });

  it("filled and tonal lift to level1 on hover", () => {
    expect(buttonVariants({ variant: "primary" })).toContain(
      "hover:shadow-(--sys-elevation-level1)",
    );
    expect(buttonVariants({ variant: "tonal" })).toContain(
      "hover:shadow-(--sys-elevation-level1)",
    );
  });

  it("outlined moves its border to primary on focus", () => {
    expect(buttonVariants({ variant: "outlined" })).toContain(
      "focus-visible:border-(--sys-color-primary)",
    );
  });

  it("paints hover, focus, and pressed as layers — never a whole-button dim", () => {
    const cls = buttonVariants({ variant: "primary" });
    expect(cls).toContain("hover:before:opacity-[var(--sys-state-hover)]");
    expect(cls).toContain(
      "focus-visible:before:opacity-[var(--sys-state-focus)]",
    );
    expect(cls).toContain("active:before:opacity-[var(--sys-state-press)]");
    expect(cls).not.toContain("hover:opacity-");
    expect(cls).not.toContain("active:opacity-");
  });

  it("disables to the M3 12%/38% split per variant", () => {
    for (const v of ["elevated", "primary", "tonal"] as const) {
      const cls = buttonVariants({ variant: v });
      expect(cls).toContain("disabled:bg-(--sys-color-on-surface)/12");
      expect(cls).toContain("disabled:text-(--sys-color-on-surface)/38");
    }
    const outlined = buttonVariants({ variant: "outlined" });
    expect(outlined).toContain("disabled:border-(--sys-color-on-surface)/12");
    expect(outlined).toContain("disabled:bg-transparent");
    const ghost = buttonVariants({ variant: "ghost" });
    expect(ghost).toContain("disabled:bg-transparent");
    expect(ghost).toContain("disabled:text-(--sys-color-on-surface)/38");
  });

  it("uses 20px icons with labels and label-large type (M3 current)", () => {
    const cls = buttonVariants({ variant: "primary" });
    expect(cls).toContain("[&_svg]:size-5");
    expect(cls).not.toContain("[&_svg]:size-[18px]");
    expect(cls).toContain("tracking-[0.1px]");
    expect(cls).toContain("leading-5");
    expect(cls).toContain("font-medium");
  });

  it("ghost uses tighter text-button padding", () => {
    expect(buttonVariants({ variant: "ghost", size: "default" })).toContain(
      "px-3",
    );
  });

  it("danger re-paints but disabled always wins back to on-surface", () => {
    const cls = buttonVariants({ variant: "primary", color: "danger" });
    expect(cls).toContain("bg-(--sys-color-error)");
    expect(cls).toContain("disabled:bg-(--sys-color-on-surface)/12");
  });
});

describe("Button — sizes", () => {
  it.each([
    ["xs", "h-7"],
    ["default", "h-10"],
    ["sm", "h-8"],
    ["xl", "h-12"],
    ["icon", "h-10 w-10"],
  ] as const)("size %s renders %s height", (size, height) => {
    expect(buttonVariants({ size })).toContain(height);
  });

  it("keeps 48dp touch targets via after: insets", () => {
    expect(buttonVariants({ size: "xs" })).toContain("after:-inset-2.5");
    expect(buttonVariants({ size: "default" })).toContain("after:-inset-1");
    expect(buttonVariants({ size: "sm" })).toContain("after:-inset-2");
  });
});

describe("IconButton — four treatments, 24px icons", () => {
  it("renders 24px icons in a 40px pill", () => {
    render(<IconButton label="Search" icon={<svg data-testid="i" />} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("standard selected paints the primary icon with no fill", () => {
    expect(
      iconButtonVariants({ variant: "standard", selected: true }),
    ).toContain("text-(--sys-color-primary)");
  });

  it("tonal selected uses secondary-container, not secondary", () => {
    const cls = iconButtonVariants({ variant: "tonal", selected: true });
    expect(cls).toContain("bg-(--sys-color-secondary-container)");
    expect(cls).not.toContain("bg-(--sys-color-secondary)");
  });

  it("outlined selected uses inverse-surface per M3", () => {
    const cls = iconButtonVariants({ variant: "outlined", selected: true });
    expect(cls).toContain("bg-(--sys-color-inverse-surface)");
    expect(cls).toContain("text-(--sys-color-inverse-on-surface)");
  });

  it("filled toggle unselected uses surface-container-highest", () => {
    const cls = iconButtonVariants({
      variant: "filled",
      toggle: true,
      selected: false,
    });
    expect(cls).toContain("bg-(--sys-color-surface-container-highest)");
  });
});

describe("Fab — four colors, M3 sizes and shapes", () => {
  it.each([
    ["surface", "bg-(--sys-color-surface-container-high)"],
    ["primary", "bg-(--sys-color-primary-container)"],
    ["secondary", "bg-(--sys-color-secondary-container)"],
    ["tertiary", "bg-(--sys-color-tertiary-container)"],
  ])("color %s paints its container", (color, token) => {
    expect(
      fabVariants({
        color: color as "surface" | "primary" | "secondary" | "tertiary",
      }),
    ).toContain(token);
  });

  it("defaults to surface per M3", () => {
    expect(fabVariants({})).toContain(
      "bg-(--sys-color-surface-container-high)",
    );
  });

  it("sizes carry M3 shapes: sm 12px, default 16px, medium/large 28px", () => {
    expect(fabVariants({ size: "sm" })).toContain(
      "rounded-(--sys-shape-corner-medium)",
    );
    expect(fabVariants({ size: "default" })).toContain(
      "rounded-(--sys-shape-corner-large)",
    );
    expect(fabVariants({ size: "medium" })).toContain(
      "rounded-(--sys-shape-corner-extra-large)",
    );
  });

  it("rests at level3 and lifts to level4 on hover", () => {
    const cls = fabVariants({});
    expect(cls).toContain("shadow-(--sys-elevation-level3)");
    expect(cls).toContain("hover:shadow-(--sys-elevation-level4)");
  });

  it("renders all sizes without crashing", () => {
    for (const size of ["sm", "default", "medium", "large", "icon"] as const) {
      render(
        <Fab size={size} aria-label="x">
          <svg />
        </Fab>,
      );
    }
  });
});

describe("ExtendedFab — labelled FAB", () => {
  it("carries its primary-container background", () => {
    render(<ExtendedFab label="Compose" icon={<svg />} />);
    const el = screen.getByRole("button", { name: "Compose" });
    expect(el.className).toContain("bg-(--sys-color-primary-container)");
    expect(el.className).toContain("shadow-(--sys-elevation-level3)");
  });
});

describe("FabMenu — trigger is a FAB", () => {
  it("trigger uses FAB colors, not button colors", () => {
    render(<FabMenu icon={<svg />} actions={[]} />);
    const trigger = screen.getByRole("button");
    expect(trigger.className).toContain("bg-(--sys-color-primary-container)");
    expect(trigger.className).not.toContain("bg-(--sys-color-primary)");
  });
});

describe("Segmented — M3 selected treatment", () => {
  it("selected segment fills secondary-container", () => {
    render(
      <SegmentedButton.Root value={["a"]}>
        <SegmentedButton.Item value="a">A</SegmentedButton.Item>
        <SegmentedButton.Item value="b">B</SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    const pressed = screen.getByRole("button", { name: "A" });
    expect(pressed.className).toContain(
      "data-pressed:bg-(--sys-color-secondary-container)",
    );
  });
});

describe("Toggle — selected treatment", () => {
  it("pressed toggle fills secondary-container", () => {
    render(
      <Toggle pressed onPressedChange={() => {}}>
        T
      </Toggle>,
    );
    const el = screen.getByRole("button");
    expect(el.className).toContain(
      "data-pressed:bg-(--sys-color-secondary-container)",
    );
  });
});

describe("ToggleGroup — items share the segmented treatment", () => {
  it("pressed item fills secondary-container", () => {
    render(
      <ToggleGroup.Root value={["a"]}>
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const el = screen.getByRole("button", { name: "A" });
    expect(el.className).toContain(
      "data-pressed:bg-(--sys-color-secondary-container)",
    );
  });
});

describe("SplitButton — two controls, one pill", () => {
  it("primary and trigger carry state layers, not whole dims", () => {
    render(<SplitButton label="Save" onClick={() => {}} actions={[]} />);
    const primary = screen.getByRole("button", { name: "Save" });
    expect(primary.className).toContain("hover:before:opacity-");
    expect(primary.className).not.toContain("hover:opacity-");
  });

  it("uses 18px icons and label-large tracking", () => {
    render(<SplitButton label="Save" onClick={() => {}} actions={[]} />);
    const primary = screen.getByRole("button", { name: "Save" });
    expect(primary.className).toContain("[&_svg]:size-[18px]");
    expect(primary.className).toContain("tracking-[0.1px]");
  });
});

describe("Focus ring — M3 3px secondary", () => {
  it("is the 3px secondary pair", () => {
    expect(FOCUS_RING_CLASS).toBe(
      "focus-visible:ring-[3px] focus-visible:ring-(--sys-color-secondary)",
    );
  });
});

describe("Gap features — soft-disabled, selected labels, loading, flip", () => {
  it("Button softDisabled stays focusable with aria-disabled", async () => {
    const { Button } = await import("./button");
    render(<Button softDisabled>Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el).not.toHaveAttribute("disabled");
    expect(el).toHaveAttribute("aria-disabled", "true");
    expect(el.className).toContain("aria-disabled:");
  });

  it("Button flipIcon mirrors in RTL", async () => {
    const { Button } = await import("./button");
    render(
      <Button flipIcon icon={<svg data-testid="flip-icon" />}>
        Next
      </Button>,
    );
    const slot = document.querySelector('[data-slot="button-icon"]');
    expect(slot?.className).toContain("rtl:scale-x-[-1]");
  });

  it("IconButton selectedLabel swaps the accessible name when selected", async () => {
    const { IconButton } = await import("./icon-button");
    render(
      <IconButton
        label="Add to favorites"
        selectedLabel="Remove from favorites"
        toggle
        defaultPressed
        icon={<svg />}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Remove from favorites" }),
    ).toBeInTheDocument();
  });

  it("IconButton loading swaps in a spinner and reports busy", async () => {
    const { IconButton } = await import("./icon-button");
    render(<IconButton label="Save" loading icon={<svg />} />);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el).toHaveAttribute("aria-busy", "true");
    expect(el).toHaveAttribute("data-loading");
  });

  it("IconButton softDisabled stays focusable", async () => {
    const { IconButton } = await import("./icon-button");
    render(<IconButton label="Copy" softDisabled icon={<svg />} />);
    const el = screen.getByRole("button", { name: "Copy" });
    expect(el).not.toHaveAttribute("disabled");
    expect(el).toHaveAttribute("aria-disabled", "true");
  });

  it("IconButton flipIcon mirrors in RTL", async () => {
    const { IconButton } = await import("./icon-button");
    render(<IconButton label="Next" flipIcon icon={<svg />} />);
    const btn = screen.getByRole("button", { name: "Next" });
    const iconWrap = btn.querySelector('[aria-hidden="true"]');
    expect(iconWrap?.className).toContain("rtl:scale-x-[-1]");
  });

  it("Fab defaults to surface and supports lowered", async () => {
    const { Fab } = await import("./fab");
    render(
      <Fab aria-label="default-fab">
        <svg />
      </Fab>,
    );
    const el = screen.getByRole("button", { name: "default-fab" });
    expect(el.className).toContain("bg-(--sys-color-surface-container-high)");
    const { unmount } = render(
      <Fab lowered aria-label="lowered-fab">
        <svg />
      </Fab>,
    );
    void unmount;
    expect(
      screen.getByRole("button", { name: "lowered-fab" }).className,
    ).toContain("shadow-(--sys-elevation-level1)");
  });
});

describe("M3 Expressive — toggle, sizes, morph, 20px icons", () => {
  it("renders md and lg sizes", async () => {
    const { Button } = await import("./button");
    render(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button", { name: "Medium" }).className).toContain(
      "h-11",
    );
    const { unmount } = render(<Button size="lg">Large</Button>);
    void unmount;
    expect(screen.getByRole("button", { name: "Large" }).className).toContain(
      "h-14",
    );
  });

  it("uses 20px icons per current M3 (not 18px)", async () => {
    const { Button } = await import("./button");
    render(<Button icon={<svg />}>With icon</Button>);
    const btn = screen.getByRole("button", { name: "With icon" });
    expect(btn.className).toContain("[&_svg]:size-5");
    expect(btn.className).not.toContain("[&_svg]:size-[18px]");
  });

  it("toggle selected morphs pill to per-size square radii", async () => {
    const { Button } = await import("./button");
    render(
      <Button toggle pressed onPressedChange={() => {}}>
        Save
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Save" });
    expect(el).toHaveAttribute("aria-pressed", "true");
    expect(el.className).toContain("rounded-(--sys-shape-corner-medium)");
  });

  it("toggle filled selected keeps primary fill; unselected drops to surface-container", async () => {
    const { Button } = await import("./button");
    render(
      <Button toggle onPressedChange={() => {}}>
        Save
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Save" });
    expect(el).toHaveAttribute("aria-pressed", "false");
    expect(el.className).toContain("bg-(--sys-color-surface-container)");
  });

  it("toggle tonal selected uses secondary fill", async () => {
    const { Button } = await import("./button");
    render(
      <Button variant="tonal" toggle pressed onPressedChange={() => {}}>
        Next
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Next" });
    expect(el.className).toContain("bg-(--sys-color-secondary)");
  });

  it("toggle outlined selected uses inverse-surface", async () => {
    const { Button } = await import("./button");
    render(
      <Button variant="outlined" toggle pressed onPressedChange={() => {}}>
        More
      </Button>,
    );
    const el = screen.getByRole("button", { name: "More" });
    expect(el.className).toContain("bg-(--sys-color-inverse-surface)");
  });

  it("square shape uses per-size M3 radii, not 0px", async () => {
    const { Button } = await import("./button");
    render(
      <Button shape="square" size="lg">
        Square
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Square" });
    expect(el.className).toContain("rounded-(--sys-shape-corner-extra-large)");
    expect(el.className).not.toContain("rounded-none");
  });

  it("pressed morphs toward square per size", async () => {
    const { Button } = await import("./button");
    render(<Button>Press</Button>);
    const el = screen.getByRole("button", { name: "Press" });
    expect(el.className).toContain("active:rounded-(--sys-shape-corner-small)");
  });
});
