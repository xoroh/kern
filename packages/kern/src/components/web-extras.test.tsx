import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Banner, BannerAction } from "./banner";
import { Command } from "./command";
import { type CountryOption, CountrySelect } from "./country-select";
import { SegmentedButton } from "./segmented-button";
import { createSonnerManager, Sonner } from "./sonner";

describe("Banner", () => {
  it("renders its message under a polite status role", () => {
    render(<Banner>Scheduled maintenance tonight</Banner>);
    const banner = screen.getByRole("status");
    expect(banner).toHaveTextContent("Scheduled maintenance tonight");
    expect(banner).toHaveAttribute("data-variant", "info");
  });

  it("announces assertively when asked", () => {
    render(<Banner assertive>Payment failed</Banner>);
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
  });

  it("marks the intent variant for styling", () => {
    render(<Banner variant="error">Out of stock</Banner>);
    expect(screen.getByRole("status")).toHaveAttribute("data-variant", "error");
  });

  it("renders a dismiss control only when onDismiss is given", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<Banner>Heads up</Banner>);
    expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
    rerender(
      <Banner onDismiss={onDismiss}>
        Heads up
        <BannerAction>Details</BannerAction>
      </Banner>,
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Details" })).toBeInTheDocument();
  });
});

describe("SegmentedButton", () => {
  it("keeps exactly one segment pressed", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedButton.Root
        defaultValue={["list"]}
        onValueChange={onValueChange}
      >
        <SegmentedButton.Item value="list">List</SegmentedButton.Item>
        <SegmentedButton.Item value="grid">Grid</SegmentedButton.Item>
      </SegmentedButton.Root>,
    );
    const list = screen.getByRole("button", { name: "List" });
    const grid = screen.getByRole("button", { name: "Grid" });
    expect(list).toHaveAttribute("aria-pressed", "true");
    expect(grid).toHaveAttribute("aria-pressed", "false");
    await user.click(grid);
    expect(grid).toHaveAttribute("aria-pressed", "true");
    expect(list).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenCalledWith(["grid"], expect.anything());
  });
});

describe("Command", () => {
  const options = [
    { value: "new", label: "New project", keywords: ["create"] },
    { value: "open", label: "Open project", shortcut: "⌘O" },
  ];

  function renderPalette(onValueChange = vi.fn()) {
    render(
      <Command.Root options={options} onValueChange={onValueChange}>
        <Command.Input aria-label="Command" />
        <Command.Content>
          <Command.List>
            {(option: (typeof options)[number]) => (
              <Command.Item
                key={option.value}
                value={option.value}
                shortcut={option.shortcut}
              >
                {option.label}
              </Command.Item>
            )}
          </Command.List>
          <Command.Empty>No results</Command.Empty>
        </Command.Content>
      </Command.Root>,
    );
    return onValueChange;
  }

  it("filters rows by the typed query", async () => {
    const user = userEvent.setup();
    renderPalette();
    const input = screen.getByRole("combobox", { name: "Command" });
    await user.type(input, "open");
    expect(screen.getByText("Open project")).toBeInTheDocument();
    expect(screen.queryByText("New project")).toBeNull();
  });

  it("matches keywords as well as labels", async () => {
    const user = userEvent.setup();
    renderPalette();
    const input = screen.getByRole("combobox", { name: "Command" });
    await user.type(input, "create");
    expect(screen.getByText("New project")).toBeInTheDocument();
    expect(screen.queryByText("Open project")).toBeNull();
  });

  it("reports the chosen row's value", async () => {
    const user = userEvent.setup();
    const onValueChange = renderPalette();
    const input = screen.getByRole("combobox", { name: "Command" });
    await user.type(input, "open");
    await user.click(screen.getByText("Open project"));
    expect(onValueChange).toHaveBeenCalledWith("open", expect.anything());
  });

  it("shows the empty row when nothing matches", async () => {
    const user = userEvent.setup();
    renderPalette();
    const input = screen.getByRole("combobox", { name: "Command" });
    await user.type(input, "zzzz");
    expect(screen.getByText("No results")).toBeInTheDocument();
  });
});

describe("CountrySelect", () => {
  const options = [
    { code: "de", name: "Germany", flag: "🇩🇪" },
    { code: "nl", name: "Netherlands" },
  ];

  it("offers the countries passed as a prop", async () => {
    const user = userEvent.setup();
    render(
      <CountrySelect.Root options={options}>
        <CountrySelect.Trigger aria-label="Country" />
        <CountrySelect.Content>
          {options.map((country) => (
            <CountrySelect.Item key={country.code} value={country}>
              {country.flag ? <span>{country.flag}</span> : null}
              {country.name}
            </CountrySelect.Item>
          ))}
        </CountrySelect.Content>
      </CountrySelect.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Country" }));
    expect(screen.getByText("Germany")).toBeInTheDocument();
    expect(screen.getByText("Netherlands")).toBeInTheDocument();
  });

  it("hands the chosen country back to the consumer", async () => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    render(
      <CountrySelect.Root options={options} onCountryChange={onCountryChange}>
        <CountrySelect.Trigger aria-label="Country" />
        <CountrySelect.Content>
          {options.map((country) => (
            <CountrySelect.Item key={country.code} value={country}>
              {country.name}
            </CountrySelect.Item>
          ))}
        </CountrySelect.Content>
      </CountrySelect.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Country" }));
    await user.click(screen.getByText("Netherlands"));
    expect(onCountryChange).toHaveBeenCalledWith(options[1]);
  });

  it("does not choose a disabled option", async () => {
    // Edge composition, carried from the move-5 Group lesson: the disabled
    // flag on CountryOption is the dataset-level edge, so the test pins a
    // disabled country unchoosable. Sensitivity-proven: asserting the call
    // fires fails (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    const withDisabled: CountryOption[] = [
      ...options,
      { code: "aq", name: "Antarctica", disabled: true },
    ];
    const onCountryChange = vi.fn();
    render(
      <CountrySelect.Root
        options={withDisabled}
        onCountryChange={onCountryChange}
      >
        <CountrySelect.Trigger aria-label="Country" />
        <CountrySelect.Content>
          {withDisabled.map((country) => (
            <CountrySelect.Item
              key={country.code}
              value={country}
              disabled={country.disabled}
            >
              {country.name}
            </CountrySelect.Item>
          ))}
        </CountrySelect.Content>
      </CountrySelect.Root>,
    );
    await user.click(screen.getByRole("combobox", { name: "Country" }));
    await user.click(screen.getByText("Antarctica"));
    expect(onCountryChange).not.toHaveBeenCalled();
  });
});

describe("Sonner", () => {
  it("shows a message through the imperative manager", async () => {
    const manager = createSonnerManager();
    render(
      <Sonner.Provider toastManager={manager.toastManager}>
        <Sonner.Viewport>
          <Sonner.List />
        </Sonner.Viewport>
      </Sonner.Provider>,
    );
    act(() => {
      manager.success({ title: "Saved" });
    });
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("marks the intent so the border role can differ", async () => {
    const manager = createSonnerManager();
    render(
      <Sonner.Provider toastManager={manager.toastManager}>
        <Sonner.Viewport>
          <Sonner.List />
        </Sonner.Viewport>
      </Sonner.Provider>,
    );
    act(() => {
      manager.error({ title: "Upload failed" });
    });
    const toast = await screen.findByText("Upload failed");
    expect(toast.closest("[data-slot='sonner']")).toHaveAttribute(
      "data-intent",
      "error",
    );
  });

  it("renders the action and fires it", async () => {
    // Edge composition, carried from the move-5 Group lesson: the action is
    // a live control inside the transient surface, not decoration.
    // Sensitivity-proven: the same assertions against an action-less push
    // fail (scratch probe, RED confirmed, deleted).
    const user = userEvent.setup();
    const onAction = vi.fn();
    const manager = createSonnerManager();
    render(
      <Sonner.Provider toastManager={manager.toastManager}>
        <Sonner.Viewport>
          <Sonner.List />
        </Sonner.Viewport>
      </Sonner.Provider>,
    );
    act(() => {
      manager.success({
        title: "Saved",
        action: { label: "Undo", onClick: onAction },
      });
    });
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("dismisses by id", async () => {
    const manager = createSonnerManager();
    render(
      <Sonner.Provider toastManager={manager.toastManager}>
        <Sonner.Viewport>
          <Sonner.List />
        </Sonner.Viewport>
      </Sonner.Provider>,
    );
    let id = "";
    act(() => {
      id = manager.info("Syncing");
    });
    expect(await screen.findByText("Syncing")).toBeInTheDocument();
    act(() => {
      manager.dismiss(id);
    });
    expect(screen.queryByText("Syncing")).toBeNull();
  });

  it("swaps the loading message when the promise resolves", async () => {
    const manager = createSonnerManager();
    render(
      <Sonner.Provider toastManager={manager.toastManager}>
        <Sonner.Viewport>
          <Sonner.List />
        </Sonner.Viewport>
      </Sonner.Provider>,
    );
    await act(async () => {
      await manager.promise(Promise.resolve("done"), {
        loading: { title: "Saving…" },
        success: { title: "Saved" },
        error: { title: "Failed" },
      });
    });
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.queryByText("Saving…")).toBeNull();
  });
});
