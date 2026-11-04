import { fireEvent, render, screen } from "@testing-library/react-native";
import { act } from "react";
import { Text as RNText } from "react-native";
import {
  KernSettingsRow,
  KernSettingsScreen,
  partnerAutoClaimSection,
  poolAutoClaimSection,
  settingDefToRow,
} from "./kern-settings";

describe("KernSettingsRow", () => {
  it("names the row by its label and reports switch changes", async () => {
    const onCheckedChange = jest.fn();
    await render(
      <KernSettingsRow
        label="Notifications"
        supporting="Push and email"
        control="switch"
        onCheckedChange={onCheckedChange}
      />,
    );
    // Row and control share the accessible name (the pre-existing
    // settings-row contract: the row names, the control acts).
    expect(screen.getAllByLabelText("Notifications")).toHaveLength(2);
    expect(screen.getByText("Push and email")).toBeTruthy();
    await act(async () => {
      fireEvent.press(screen.getByRole("switch"));
    });
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("picks segments and reports the choice", async () => {
    const onSegmentedChange = jest.fn();
    await render(
      <KernSettingsRow
        label="Theme"
        control="segmented"
        segmentedOptions={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
        onSegmentedChange={onSegmentedChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("radio", { name: "Dark" }));
    });
    expect(onSegmentedChange).toHaveBeenCalledWith("dark");
  });

  it("opens the sheet from the select row and reports the pick", async () => {
    const onSelectChange = jest.fn();
    await render(
      <KernSettingsRow
        label="Language"
        control="select"
        selectOptions={[
          { value: "en", label: "English" },
          { value: "nl", label: "Nederlands" },
        ]}
        onSelectChange={onSelectChange}
      />,
    );
    await act(async () => {
      fireEvent.press(screen.getByTestId("kern-settings-row-select"));
    });
    await act(async () => {
      fireEvent.press(screen.getByLabelText("Nederlands"));
    });
    expect(onSelectChange).toHaveBeenCalledWith("nl");
  });

  it("navigational rows are one pressable (activation on the row)", async () => {
    const onPress = jest.fn();
    await render(
      <KernSettingsRow label="Email" control="button" onPress={onPress} />,
    );
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Email" }));
    });
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders the custom trailing slot", async () => {
    await render(
      <KernSettingsRow
        label="Volume"
        control="custom"
        trailing={<RNText>Mute</RNText>}
      />,
    );
    expect(screen.getByText("Mute")).toBeTruthy();
  });
});

describe("settingDefToRow", () => {
  it("maps each def kind to its row control", () => {
    expect(
      settingDefToRow({ key: "a", label: "A", kind: "toggle" }).control,
    ).toBe("switch");
    expect(
      settingDefToRow({ key: "b", label: "B", kind: "choice", choices: [] })
        .control,
    ).toBe("segmented");
    expect(
      settingDefToRow({ key: "c", label: "C", kind: "select", options: [] })
        .control,
    ).toBe("select");
    expect(
      settingDefToRow({ key: "d", label: "D", kind: "link" }).control,
    ).toBe("button");
  });
});

describe("KernSettingsScreen (grouped list)", () => {
  it("renders every section with its rows", async () => {
    await render(
      <KernSettingsScreen
        sections={[
          {
            id: "profile",
            title: "Profile",
            rows: [{ label: "Name", control: "button" }],
          },
          {
            id: "security",
            title: "Security",
            rows: [{ label: "Passkey", control: "button" }],
          },
        ]}
      />,
    );
    expect(screen.getByTestId("kern-settings-screen")).toBeTruthy();
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Passkey")).toBeTruthy();
  });
});

describe("A-004 auto-claim presets (MS-003/MS-004, shape only)", () => {
  it("pool preset carries off/limited/auto + a bound select", () => {
    expect(poolAutoClaimSection.rows[0].control).toBe("segmented");
    expect(
      poolAutoClaimSection.rows[0].segmentedOptions?.map((o) => o.value),
    ).toEqual(["off", "limited", "auto"]);
    expect(poolAutoClaimSection.rows[1].control).toBe("select");
  });

  it("partner preset stays a bounded choice", () => {
    expect(partnerAutoClaimSection.rows[0].control).toBe("segmented");
  });
});
