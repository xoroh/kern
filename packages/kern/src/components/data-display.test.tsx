import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";
import { Calendar } from "./calendar";
import { EmptyState } from "./empty-state";
import { Kbd } from "./kbd";
import { ListItem } from "./list-item";
import { Loader } from "./loader";
import { Meter } from "./meter";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Table } from "./table";

describe("Table", () => {
  it("renders headers with column scope and rows", () => {
    render(
      <Table.Root aria-label="Orders">
        <Table.Head>
          <Table.Row>
            <Table.Header>Item</Table.Header>
            <Table.Header>Qty</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Apples</Table.Cell>
            <Table.Cell>4</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByRole("table", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Item" })).toHaveAttribute(
      "scope",
      "col",
    );
    expect(screen.getByRole("cell", { name: "Apples" })).toBeInTheDocument();
  });
});

describe("Avatar", () => {
  it("shows fallback text", () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>AK</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText("AK")).toBeInTheDocument();
  });
});

describe("Kbd", () => {
  it("renders the shortcut", () => {
    render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
  });
});

describe("Loader", () => {
  it("exposes an accessible status", () => {
    render(<Loader label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });
});

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Progress", () => {
  it("reports its value", () => {
    render(
      <Progress.Root value={40} max={100} aria-label="Upload">
        <Progress.Label>Uploading</Progress.Label>
      </Progress.Root>,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });
});

describe("Meter", () => {
  it("reports a static value", () => {
    render(<Meter.Root value={70} max={100} aria-label="Storage" />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "70");
  });
});

describe("EmptyState", () => {
  it("renders title, description, and action", async () => {
    const user = userEvent.setup();
    let clicked = 0;
    render(
      <EmptyState
        title="No results"
        description="Try another search."
        action={
          <button type="button" onClick={() => clicked++}>
            Retry
          </button>
        }
      />,
    );
    expect(screen.getByText("No results")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(clicked).toBe(1);
  });
});

describe("ListItem", () => {
  it("renders headline with supporting text", () => {
    render(
      <ul>
        <ListItem headline="Invoices" supporting="12 open" trailing="›" />
      </ul>,
    );
    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("12 open")).toBeInTheDocument();
  });
});

describe("Calendar", () => {
  it("selects a day on click", async () => {
    const user = userEvent.setup();
    const seen: Date[] = [];
    render(
      <Calendar
        defaultValue={new Date(2026, 8, 1)}
        onValueChange={(d) => seen.push(d)}
      />,
    );
    await user.click(
      screen.getByRole("gridcell", {
        name: new Date(2026, 8, 15).toDateString(),
      }),
    );
    expect(seen).toHaveLength(1);
    expect(seen[0].getDate()).toBe(15);
  });

  it("moves the focused day with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue={new Date(2026, 8, 15)} />);
    screen
      .getByRole("gridcell", { name: new Date(2026, 8, 15).toDateString() })
      .focus();
    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("gridcell", {
        name: new Date(2026, 8, 16).toDateString(),
      }),
    ).toHaveFocus();
  });

  it("disables days outside min and max", () => {
    render(
      <Calendar
        defaultValue={new Date(2026, 8, 15)}
        min={new Date(2026, 8, 10)}
        max={new Date(2026, 8, 20)}
      />,
    );
    expect(
      screen.getByRole("gridcell", {
        name: new Date(2026, 8, 5).toDateString(),
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole("gridcell", {
        name: new Date(2026, 8, 15).toDateString(),
      }),
    ).not.toBeDisabled();
  });
});
