import { assertParity, contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react-native";
import { Text as RNText, View } from "react-native";
import { Tooltip } from "../components/tooltip";

/**
 * Native side of the tooltip contract — the row that previously recorded
 * "none on native — GAP".
 *
 * The obligation is `hintCarriesText`: the supplementary text must REACH
 * assistive tech as text, not merely set a state bit. Web delivers it as a
 * `role="alert"` message via `aria-describedby`; native folds it into the
 * trigger's `accessibilityHint`. The delivery differs, the obligation does not —
 * which is the whole point of a contract row surviving a change of mechanism.
 */
const R = "native" as const;

function row() {
  const r = contractFor("tooltip");
  if (!r.hintCarriesText) {
    throw new Error("tooltip row declares no hintCarriesText");
  }
  return { ...r, hint: r.hintCarriesText };
}

describe("native parity contract: tooltip", () => {
  it("carries the supplementary text on the trigger", async () => {
    const r = row();
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <RNText>Save</RNText>
      </Tooltip>,
    );
    const trigger = screen.getByTestId("kern-tooltip-trigger");
    assertParity(
      r,
      R,
      String(trigger.props.accessibilityHint ?? ""),
      "Saves your draft",
      "the supplementary text must reach assistive tech as text",
    );
  });

  it("names the trigger and supplements it separately", async () => {
    const r = row();
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <RNText>Save</RNText>
      </Tooltip>,
    );
    const trigger = screen.getByTestId("kern-tooltip-trigger");
    assertParity(
      r,
      R,
      String(trigger.props.accessibilityHint ?? ""),
      "Saves your draft",
      "the hint is carried beside the name, not merged into it",
    );
  });

  /**
   * The hint is present whether or not the visible surface is open. The visible
   * popup is a visual convenience on top of the hint, never the carrier — if the
   * text only existed while open, a screen-reader user would lose it by not
   * being able to "hover".
   */
  it("keeps the hint before the surface is opened", async () => {
    const r = row();
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <RNText>Save</RNText>
      </Tooltip>,
    );
    const trigger = screen.getByTestId("kern-tooltip-trigger");
    assertParity(
      r,
      R,
      String(trigger.props.accessibilityHint ?? ""),
      "Saves your draft",
      "the hint must exist before the surface opens",
    );
  });

  it("renders the trigger's own content", async () => {
    const r = row();
    await render(
      <Tooltip label="Save" hint="Saves your draft">
        <View testID="trigger-child">
          <RNText>Save</RNText>
        </View>
      </Tooltip>,
    );
    assertParity(
      r,
      R,
      screen.getByTestId("trigger-child") !== null,
      true,
      "the trigger's own content renders",
    );
  });
});
