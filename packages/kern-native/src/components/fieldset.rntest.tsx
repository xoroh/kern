import { render, screen } from "@testing-library/react-native";
import { Pressable, Text as RNText } from "react-native";
import {
  Fieldset,
  FieldsetItem,
  FieldsetLegend,
  fieldsetStyles,
  useFieldsetDisabled,
} from "./fieldset";

/**
 * The behaviour under test is INHERITANCE: on the web `<fieldset disabled>`
 * disables every descendant for free, and React Native has no equivalent. So
 * these assert what a descendant can learn about its ancestors — not colours.
 */

/** A control that opts in, exactly as a Kern control should. */
function Probe({ label }: { label: string }) {
  const inherited = useFieldsetDisabled();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inherited }}
    >
      <RNText>{label}</RNText>
    </Pressable>
  );
}

describe("Fieldset", () => {
  it("exposes the group role", async () => {
    await render(
      <Fieldset accessibilityLabel="Billing">
        <FieldsetLegend>Billing</FieldsetLegend>
      </Fieldset>,
    );
    expect(screen.getByLabelText("Billing").props.role).toBe("group");
  });

  /**
   * The legend is not a caption — it is what NAMES the group. Derived rather
   * than passed separately, because two sources for one name is a way to have
   * them disagree.
   */
  it("names the group with its legend", async () => {
    await render(
      <Fieldset>
        <FieldsetLegend>Billing address</FieldsetLegend>
      </Fieldset>,
    );
    // No explicit label was passed; the group is still named.
    // Queried by testID, not role: RNTL cannot query the ARIA `role` prop, only
    // `accessibilityRole`. The role is asserted directly in the first test.
    const group = screen.getByTestId("kern-fieldset");
    expect(group.props.accessibilityLabel).toBe("Billing address");
  });

  it("lets an explicit label win over the legend", async () => {
    await render(
      <Fieldset accessibilityLabel="Explicit">
        <FieldsetLegend>Legend text</FieldsetLegend>
      </Fieldset>,
    );
    expect(screen.getByTestId("kern-fieldset").props.accessibilityLabel).toBe(
      "Explicit",
    );
  });

  it("reports the group's own disabled state", async () => {
    await render(
      <Fieldset disabled accessibilityLabel="Billing">
        <FieldsetLegend>Billing</FieldsetLegend>
      </Fieldset>,
    );
    expect(
      screen.getByTestId("kern-fieldset").props.accessibilityState,
    ).toEqual({
      disabled: true,
    });
  });

  /**
   * THE behaviour. A descendant must be able to learn that an ancestor is
   * disabled. Without this a consumer cannot answer "am I disabled?" and the
   * component is just a bordered View.
   */
  it("propagates disabled to descendants", async () => {
    await render(
      <Fieldset disabled accessibilityLabel="Billing">
        <FieldsetLegend>Billing</FieldsetLegend>
        <Probe label="Name" />
      </Fieldset>,
    );
    expect(screen.getByLabelText("Name").props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  it("leaves descendants enabled when the fieldset is not disabled", async () => {
    await render(
      <Fieldset accessibilityLabel="Billing">
        <FieldsetLegend>Billing</FieldsetLegend>
        <Probe label="Name" />
      </Fieldset>,
    );
    expect(screen.getByLabelText("Name").props.accessibilityState).toEqual({
      disabled: false,
    });
  });

  /** Nesting is how forms compose: an outer group must win over an inner one. */
  it("inherits through nested fieldsets", async () => {
    await render(
      <Fieldset disabled accessibilityLabel="Outer">
        <FieldsetLegend>Outer</FieldsetLegend>
        <Fieldset accessibilityLabel="Inner">
          <FieldsetLegend>Inner</FieldsetLegend>
          <Probe label="Name" />
        </Fieldset>
      </Fieldset>,
    );
    expect(screen.getByLabelText("Name").props.accessibilityState).toEqual({
      disabled: true,
    });
  });

  /**
   * Outside a fieldset the hook must answer `false`, not throw — a control is
   * used standalone all the time, and it still has to work.
   */
  it("reports not-disabled for a control used outside any fieldset", async () => {
    await render(<Probe label="Standalone" />);
    expect(
      screen.getByLabelText("Standalone").props.accessibilityState,
    ).toEqual({
      disabled: false,
    });
  });

  it("reflects the inherited state on an item", async () => {
    await render(
      <Fieldset disabled accessibilityLabel="Billing">
        <FieldsetLegend>Billing</FieldsetLegend>
        <FieldsetItem>
          <RNText>Row</RNText>
        </FieldsetItem>
      </Fieldset>,
    );
    expect(
      screen.getByTestId("kern-fieldset-item").props.accessibilityState,
    ).toEqual({ disabled: true });
  });

  it("renders the legend text", async () => {
    await render(
      <Fieldset accessibilityLabel="Billing">
        <FieldsetLegend>Billing address</FieldsetLegend>
      </Fieldset>,
    );
    expect(screen.getByText("Billing address")).toBeTruthy();
  });
});

describe("fieldsetStyles", () => {
  it("dims a disabled group and leaves an enabled one alone", async () => {
    expect(fieldsetStyles(true).root.opacity).toBe(0.5);
    expect(fieldsetStyles(false).root.opacity).toBe(1);
  });
});
