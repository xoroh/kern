import { describe, expect, it, vi } from "vitest";

vi.mock(
  "react-native",
  async () => await import("../../test-doubles/react-native"),
);

import { resolveThemeDetails } from "@xoroh/kern-tokens";
import {
  comboboxPopupStyles,
  comboboxStyles,
  defaultComboboxFilter,
} from "./combobox";

describe("comboboxStyles", () => {
  it("gives options a 48dp target", () => {
    expect(comboboxStyles().option.minHeight).toBe(48);
  });

  it("marks the selected option with the tonal fill", () => {
    const scheme = resolveThemeDetails("light", "standard", "kern");
    expect(comboboxStyles(scheme).optionSelected).toMatchObject({
      backgroundColor: scheme.color.surfaceTonal,
    });
  });
});

describe("comboboxPopupStyles", () => {
  it("resolves the card to the medium radius on surface-container", () => {
    const scheme = resolveThemeDetails("light", "standard", "kern");
    expect(comboboxPopupStyles(scheme).card).toMatchObject({
      borderRadius: Number.parseFloat(scheme.shape.medium),
      backgroundColor: scheme.color.surfaceContainer,
    });
  });

  it("caps the card at half the viewport height (sheet 50% cap law)", () => {
    expect(comboboxPopupStyles().card.maxHeight).toBe("50%");
  });

  it("keeps the M3 menu width caps", () => {
    expect(comboboxPopupStyles().card).toMatchObject({
      minWidth: 112,
      maxWidth: 280,
    });
  });
});

describe("defaultComboboxFilter", () => {
  it("matches case-insensitive substrings over the label", () => {
    const option = { value: "apple", label: "Green Apple" };
    expect(defaultComboboxFilter(option, "apple")).toBe(true);
    expect(defaultComboboxFilter(option, "APPLE")).toBe(true);
    expect(defaultComboboxFilter(option, "zzz")).toBe(false);
  });

  it("ignores surrounding whitespace in the query", () => {
    const option = { value: "apple", label: "Apple" };
    expect(defaultComboboxFilter(option, "  apple  ")).toBe(true);
  });

  it("matches the value nowhere — labels only", () => {
    const option = { value: "apple", label: "Green" };
    expect(defaultComboboxFilter(option, "apple")).toBe(false);
  });
});
