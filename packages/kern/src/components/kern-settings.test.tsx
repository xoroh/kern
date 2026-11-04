import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it } from "vitest";
import {
  KernSettingsRow,
  KernSettingsScreen,
  KernSettingsSection,
  partnerAutoClaimSection,
  poolAutoClaimSection,
  settingDefToRow,
  settingsRoutesToSections,
} from "./kern-settings";

async function axeClean(container: HTMLElement) {
  const result = await axe.run(container, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    },
  });
  expect(result.violations).toEqual([]);
}

describe("KernSettingsRow switch sub-row", () => {
  it("names the switch by the row label and reports changes", async () => {
    const user = userEvent.setup();
    let checked = false;
    render(
      <KernSettingsRow
        label="Push notifications"
        supporting="Alerts on this device"
        control="switch"
        onCheckedChange={(next) => (checked = next)}
      />,
    );
    expect(screen.getByText("Alerts on this device")).toBeInTheDocument();
    await user.click(
      screen.getByRole("switch", { name: "Push notifications" }),
    );
    expect(checked).toBe(true);
  });

  it("is axe-clean", async () => {
    const { container } = render(
      <KernSettingsRow
        label="Push notifications"
        control="switch"
        defaultChecked
      />,
    );
    await axeClean(container);
  });
});

describe("KernSettingsRow segmented sub-row", () => {
  it("offers the choices and reports the pick", async () => {
    const user = userEvent.setup();
    let picked = "";
    render(
      <KernSettingsRow
        label="Theme"
        control="segmented"
        segmentedOptions={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
        onSegmentedChange={(next) => (picked = next)}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Dark" }));
    expect(picked).toBe("dark");
  });

  it("honours a controlled segment (single-exclusive array mapping)", () => {
    render(
      <KernSettingsRow
        label="Theme"
        control="segmented"
        segmentedOptions={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
        segmentedValue="dark"
      />,
    );
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "data-pressed",
    );
  });
});

describe("KernSettingsRow select sub-row", () => {
  it("opens the list and reports the pick", async () => {
    const user = userEvent.setup();
    let picked = "";
    render(
      <KernSettingsRow
        label="Language"
        control="select"
        selectOptions={[
          { value: "en", label: "English" },
          { value: "nl", label: "Nederlands" },
        ]}
        onSelectChange={(next) => (picked = next)}
      />,
    );
    await user.click(screen.getByRole("combobox", { name: "Language" }));
    await user.click(await screen.findByRole("option", { name: "Nederlands" }));
    expect(picked).toBe("nl");
  });
});

describe("KernSettingsRow button sub-row", () => {
  it("renders one navigational control (link or press, never nested)", async () => {
    const user = userEvent.setup();
    let pressed = 0;
    const { rerender } = render(
      <KernSettingsRow
        label="Email"
        control="button"
        onPress={() => pressed++}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Email" }));
    expect(pressed).toBe(1);
    rerender(
      <KernSettingsRow label="Email" control="button" href="/settings/email" />,
    );
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      "/settings/email",
    );
  });

  it("is axe-clean", async () => {
    const { container } = render(
      <KernSettingsRow label="Email" control="button" href="/settings/email" />,
    );
    await axeClean(container);
  });
});

describe("KernSettingsRow custom sub-row", () => {
  it("keeps activation on the trailing control, not the row", () => {
    render(
      <KernSettingsRow
        label="Volume"
        control="custom"
        trailing={<button type="button">Mute</button>}
      />,
    );
    const row = screen.getByTestId("kern-settings-row");
    expect(row.tagName).toBe("DIV");
    expect(
      within(row).getByRole("button", { name: "Mute" }),
    ).toBeInTheDocument();
  });
});

describe("KernSettingsSection", () => {
  it("groups rows under a named heading", () => {
    render(
      <KernSettingsSection
        id="notifications"
        title="Notifications"
        rows={[
          { label: "Push", control: "switch", defaultChecked: true },
          { label: "Email digests", control: "switch" },
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("kern-settings-section-notifications"),
    ).toBeInTheDocument();
  });
});

describe("KernSettingsScreen", () => {
  const SECTIONS = [
    {
      id: "profile",
      title: "Profile",
      rows: [{ label: "Name", control: "button" as const }],
    },
    {
      id: "security",
      title: "Security",
      rows: [{ label: "Passkey", control: "button" as const }],
    },
  ];

  it("sidebar layout shows the active section rows in the detail pane", async () => {
    const user = userEvent.setup();
    render(<KernSettingsScreen sections={SECTIONS} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Security" }));
    expect(screen.getByText("Passkey")).toBeInTheDocument();
  });

  it("tabs layout uses vertical pills (dialog-tabs pattern)", async () => {
    const user = userEvent.setup();
    render(<KernSettingsScreen sections={SECTIONS} layout="tabs" />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Security" }));
    expect(screen.getByText("Passkey")).toBeInTheDocument();
  });

  it("honours a controlled section value", () => {
    render(<KernSettingsScreen sections={SECTIONS} value="security" />);
    expect(screen.getByText("Passkey")).toBeInTheDocument();
  });

  it("sidebar layout is axe-clean", async () => {
    const { container } = render(<KernSettingsScreen sections={SECTIONS} />);
    await axeClean(container);
  });
});

describe("settingDefToRow (D786 adapter)", () => {
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
      settingDefToRow({ key: "d", label: "D", kind: "link", href: "/d" })
        .control,
    ).toBe("button");
  });
});

describe("settingsRoutesToSections (named-routes builder)", () => {
  it("groups manifest routes into sections, order-preserving", () => {
    expect(
      settingsRoutesToSections([
        { path: "/settings/profile", label: "Profile", section: "General" },
        { path: "/settings/security", label: "Security", section: "General" },
      ]),
    ).toEqual([
      {
        key: "General",
        title: "General",
        destinations: [
          { key: "/settings/profile", label: "Profile" },
          { key: "/settings/security", label: "Security" },
        ],
      },
    ]);
  });
});

describe("A-004 auto-claim presets (MS-003/MS-004, shape only)", () => {
  it("pool preset carries off/limited/auto + a bound select", () => {
    const mode = poolAutoClaimSection.rows[0];
    expect(mode.control).toBe("segmented");
    expect(mode.segmentedOptions?.map((o) => o.value)).toEqual([
      "off",
      "limited",
      "auto",
    ]);
    expect(poolAutoClaimSection.rows[1].control).toBe("select");
  });

  it("partner preset stays a bounded choice", () => {
    expect(partnerAutoClaimSection.rows[0].control).toBe("segmented");
    expect(
      partnerAutoClaimSection.rows[0].segmentedOptions?.map((o) => o.value),
    ).toEqual(["off", "limited", "auto"]);
  });
});
