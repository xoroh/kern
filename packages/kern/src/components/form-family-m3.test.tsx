import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { SelectRoot, SelectTrigger } from "./select";
import { Slider } from "./slider";
import { Switch } from "./switch";

/**
 * M3 form-family spec pins — every value from material-web v0.192 tokens.
 *
 * Sourced from:
 * - tokens/_md-comp-{filled,outlined}-text-field.scss (87/80 tokens)
 * - tokens/_md-comp-checkbox.scss (62 tokens)
 * - tokens/_md-comp-switch.scss (69 tokens)
 * - tokens/_md-comp-radio.scss, _md-comp-slider.scss, select tokens
 * - material-web.dev/components/{text-field,checkbox,radio,switch,slider,select}/
 *
 * If M3 changes a value, these tests fail first.
 */

describe("Input — outlined is the default treatment", () => {
  it("renders the outlined treatment: 1px outline border, surface fill, 4px shape", () => {
    render(<Input aria-label="name" />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain("border-(--sys-color-outline)");
    expect(el.className).toContain("bg-(--sys-color-surface)");
    expect(el.className).toContain(
      "rounded-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
    );
    expect(el.className).not.toContain("rounded-(--sys-shape-corner-small)");
  });

  it("moves the border to primary 2px on focus without shifting content", () => {
    render(<Input aria-label="name" />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain("focus:border-2");
    expect(el.className).toContain("focus:border-(--sys-color-primary)");
    expect(el.className).toContain("focus:px-[15px]");
  });

  it("renders the filled treatment with active indicator", () => {
    render(<Input variant="filled" aria-label="name" />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(el.className).toContain(
      "rounded-t-[var(--comp-text-field-container-shape,var(--sys-shape-corner-extra-small))]",
    );
    expect(el.className).toContain("border-b");
  });

  it("disables outlined to the M3 split: 38% text, 12% border", () => {
    render(<Input aria-label="name" disabled />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain(
      "disabled:text-(--sys-color-on-surface)/38",
    );
    expect(el.className).toContain(
      "disabled:border-(--sys-color-on-surface)/12",
    );
    expect(el.className).not.toContain("disabled:opacity-50");
  });

  it("paints error on border and message", () => {
    render(<Input aria-label="name" error errorMessage="Required" />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain("border-(--sys-color-error)");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });
});

describe("Checkbox — 2px shape, on-surface-variant border", () => {
  it("renders the 2px M3 container-shape via style, not the 4px scale", () => {
    render(<Checkbox aria-label="agree" />);
    const el = screen.getByRole("checkbox");
    // M3 hardcodes --md-checkbox-container-shape: 2px at component level.
    expect(el.style.borderRadius).toBe("2px");
    expect(el.className).not.toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
    expect(el.className).not.toContain("rounded-[2px]");
  });

  it("borders on-surface-variant unselected, primary selected", () => {
    render(<Checkbox aria-label="agree" />);
    const el = screen.getByRole("checkbox");
    expect(el.className).toContain(
      "border-(--sys-color-on-surface-variant)",
    );
    expect(el.className).toContain(
      "data-checked:border-(--sys-color-primary)",
    );
    expect(el.className).toContain("data-checked:bg-(--sys-color-primary)");
  });

  it("paints pressed layers with M3's inverted colors", () => {
    render(<Checkbox aria-label="agree" />);
    const el = screen.getByRole("checkbox");
    // Unselected press uses the primary layer; selected press uses on-surface.
    expect(el.className).toContain(
      "data-checked:active:before:bg-(--sys-color-on-surface)",
    );
  });

  it("disables to the M3 split, never a whole dim", () => {
    render(<Checkbox aria-label="agree" disabled />);
    const el = screen.getByRole("checkbox");
    expect(el.className).toContain(
      "data-disabled:border-(--sys-color-on-surface)/38",
    );
    expect(el.className).not.toContain("data-disabled:opacity-50");
  });

  it("renders the indeterminate dash", () => {
    render(<Checkbox aria-label="mixed" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });
});

describe("Switch — 52x32 track, state layers, split disabled", () => {
  it("renders the M3 52x32 track with full shape", () => {
    render(<Switch aria-label="wifi" />);
    const el = screen.getByRole("switch");
    expect(el.className).toContain("h-8");
    expect(el.className).toContain("w-[52px]");
    expect(el.className).toContain(
      "rounded-[var(--comp-switch-track-shape,var(--sys-shape-corner-full))]",
    );
  });

  it("paints hover, focus, and pressed layers", () => {
    render(<Switch aria-label="wifi" />);
    const el = screen.getByRole("switch");
    expect(el.className).toContain(
      "hover:before:opacity-[var(--sys-state-hover)]",
    );
    expect(el.className).toContain(
      "focus-visible:before:opacity-[var(--sys-state-focus)]",
    );
    expect(el.className).toContain(
      "active:before:opacity-[var(--sys-state-press)]",
    );
  });

  it("grows the thumb on press per M3 (28px)", () => {
    render(<Switch aria-label="wifi" />);
    const thumb = document.querySelector('[data-slot="switch-thumb"]');
    expect(thumb?.className).toContain("active:size-7");
    expect(thumb?.className).toContain("data-checked:size-6");
  });

  it("disables selected and unselected per M3 split", () => {
    render(<Switch aria-label="wifi" disabled />);
    const el = screen.getByRole("switch");
    expect(el.className).toContain(
      "data-disabled:data-checked:bg-(--sys-color-on-surface)/12",
    );
    expect(el.className).not.toContain("data-disabled:opacity-50");
  });
});

describe("Radio — 20px control, on-surface-variant ring", () => {
  it("renders the 20px M3 control with state layers and split disabled", () => {
    render(
      <RadioGroup value="a">
        <RadioGroupItem value="a">Alpha</RadioGroupItem>
        <RadioGroupItem value="b">Beta</RadioGroupItem>
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    const control = radios[0].closest("[data-slot='radio-group-control']");
    expect(control?.className).toContain("size-5");
    expect(control?.className).toContain(
      "border-(--sys-color-on-surface-variant)",
    );
    expect(control?.className).toContain(
      "hover:before:opacity-[var(--sys-state-hover)]",
    );
    expect(control?.className).not.toContain("data-disabled:opacity-50");
  });
});

describe("Slider — M3 track, thumb, and disabled", () => {
  it("renders the M3 track and thumb treatments", () => {
    render(
      <Slider.Root defaultValue={[50]}>
        <Slider.Thumb aria-label="volume" />
      </Slider.Root>,
    );
    const thumb = document.querySelector('[data-slot="slider-thumb"]');
    expect(thumb?.className).toContain("bg-(--sys-color-primary)");
    expect(thumb?.className).toContain(
      "disabled:bg-(--sys-color-on-surface)/38",
    );
    const track = document.querySelector('[data-slot="slider-track"]');
    expect(track?.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    const indicator = document.querySelector('[data-slot="slider-indicator"]');
    expect(indicator?.className).toContain("bg-(--sys-color-primary)");
  });
});

describe("SelectTrigger — outlined default, filled variant, 4px shape", () => {
  it("renders outlined by default with the 4px shape and primary focus", () => {
    render(
      <SelectRoot>
        <SelectTrigger>
          <span>Pick</span>
        </SelectTrigger>
      </SelectRoot>,
    );
    const el = screen.getByRole("combobox");
    expect(el.className).toContain("border-(--sys-color-outline)");
    expect(el.className).toContain(
      "rounded-(--sys-shape-corner-extra-small)",
    );
    expect(el.className).toContain("focus:border-(--sys-color-primary)");
  });

  it("renders the filled treatment with active indicator", () => {
    render(
      <SelectRoot>
        <SelectTrigger variant="filled">
          <span>Pick</span>
        </SelectTrigger>
      </SelectRoot>,
    );
    const el = screen.getByRole("combobox");
    expect(el.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(el.className).toContain("border-b");
  });

  it("disables to the M3 split", () => {
    render(
      <SelectRoot disabled>
        <SelectTrigger>
          <span>Pick</span>
        </SelectTrigger>
      </SelectRoot>,
    );
    const el = screen.getByRole("combobox");
    expect(el.className).toContain(
      "data-disabled:text-(--sys-color-on-surface)/38",
    );
    expect(el.className).not.toContain("data-disabled:opacity-50");
  });
});

describe("Gap features — affixes, counter, filled textarea", () => {
  it("Input renders prefix and suffix adornments", async () => {
    const { Input } = await import("./input");
    render(<Input aria-label="amount" prefix="$" suffix=".00" />);
    expect(document.querySelector('[data-slot="input-prefix"]')).toHaveTextContent("$");
    expect(document.querySelector('[data-slot="input-suffix"]')).toHaveTextContent(".00");
  });

  it("Input renders a character counter with maxlength", async () => {
    const { Input } = await import("./input");
    render(
      <Input aria-label="title" maxLength={10} showCounter defaultValue="Short" />,
    );
    expect(document.querySelector('[data-slot="input-counter"]')).toHaveTextContent(
      "5/10",
    );
  });

  it("Textarea renders the filled treatment", async () => {
    const { Textarea } = await import("./textarea");
    render(<Textarea aria-label="notes" variant="filled" />);
    const el = screen.getByRole("textbox", { name: "notes" });
    expect(el.className).toContain(
      "bg-(--sys-color-surface-container-highest)",
    );
    expect(el).toHaveAttribute("data-variant", "filled");
  });
});
