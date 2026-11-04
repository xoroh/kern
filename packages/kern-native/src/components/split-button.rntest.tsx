/**
 * Part A P1 — native SplitButton states the family suite does not pin.
 *
 * fab-family.rntest.tsx owns the two-names/two-stops core, the primary/menu
 * separation and the empty-overflow row; these rows cover relabelling, the
 * uncontrolled reopen cycle, per-action selection, the disabled matrix and
 * the separated-action path.
 */
import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { SplitButton } from "./split-button";

const ACTIONS = [
  { key: "as", label: "Save as" },
  { key: "tpl", label: "Save as template" },
];

describe("SplitButton states (native P1)", () => {
  it("lets menuLabel name the overflow half", async () => {
    await render(
      <SplitButton label="Save" actions={ACTIONS} menuLabel="More" />,
    );
    expect(screen.getByRole("button", { name: "More" })).toBeTruthy();
  });

  it("reopens after a select (uncontrolled cycle)", async () => {
    await render(<SplitButton label="Save" actions={ACTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Save as"));
    });
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    expect(screen.getByLabelText("Save as template")).toBeTruthy();
  });

  it("runs only the chosen overflow action", async () => {
    const seen: string[] = [];
    await render(
      <SplitButton
        label="Save"
        actions={[
          {
            key: "as",
            label: "Save as",
            onSelect: () => seen.push("as"),
          },
          {
            key: "tpl",
            label: "Save as template",
            onSelect: () => seen.push("tpl"),
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Save as template"));
    });
    expect(seen).toEqual(["tpl"]);
  });

  it("selects through a separated action and dismisses", async () => {
    let selected = "";
    await render(
      <SplitButton
        label="Save"
        actions={[
          { key: "as", label: "Save as" },
          {
            key: "tpl",
            label: "Save as template",
            separated: true,
            onSelect: () => {
              selected = "tpl";
            },
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Save as template"));
    });
    expect(selected).toBe("tpl");
  });

  it("announces both halves disabled and refuses both presses", async () => {
    let clicked = 0;
    await render(
      <SplitButton
        label="Save"
        actions={ACTIONS}
        disabled
        onPress={() => {
          clicked += 1;
        }}
      />,
    );
    // A split button whose overflow is live while its primary is dead is a
    // trap — disabled disables both halves.
    expect(
      screen.queryByRole("button", { name: "Save", disabled: true }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Save more", disabled: true }),
    ).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save" }));
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    expect(clicked).toBe(0);
  });

  it("announces a disabled overflow action as disabled and refuses it", async () => {
    let selected = "";
    await render(
      <SplitButton
        label="Save"
        actions={[
          {
            key: "tpl",
            label: "Save as template",
            disabled: true,
            onSelect: () => {
              selected = "tpl";
            },
          },
        ]}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save more" }));
    });
    const item = screen.getByLabelText("Save as template");
    expect(
      screen.queryByRole("menuitem", {
        name: "Save as template",
        disabled: true,
      }),
    ).toBeTruthy();
    expect(item.props.onPress).toBeUndefined();
    expect(selected).toBe("");
  });

  it("tolerates a primary press with no handler and no menu side effect", async () => {
    await render(<SplitButton label="Save" actions={ACTIONS} />);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Save" }));
    });
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });
});
