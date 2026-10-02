import { render, screen } from "@testing-library/react-native";
import { Text as RNText } from "react-native";
import { Table } from "./table";

/**
 * Native table CAPTION — the one genuine gap in the `table-*` family.
 *
 * The web `Table` is composable: `TableHead` / `TableBody` / `TableCell` are
 * separate exports. The native `Table` is not — it renders a header row and body
 * rows from `columns` / `rows`. That is an API-SHAPE difference, not a
 * behavioural one: a header, a body and cells all exist natively, so those three
 * are covered rather than gaps.
 *
 * A caption is different. Web renders a real `<caption>` element, which is
 * semantic: a screen reader announces it as the table's summary. React Native has
 * no `<caption>` equivalent, and the native table had NO way to express one at
 * all — so this is real work, not a rename.
 *
 * The obligation asserted here is the substitution, not a DOM element: the
 * caption text is visible AND carried into the table's accessible name, so a
 * screen reader reaches it. Asserting a `<caption>` tag in RN would be asserting
 * a platform that does not exist.
 */
describe("Table caption", () => {
  const columns = [
    { key: "name", title: "Name" },
    { key: "role", title: "Role" },
  ];
  const rows = [{ name: "Ada", role: "Engineer" }];

  it("renders no caption when none is given", async () => {
    await render(<Table columns={columns} rows={rows} />);
    // Absent, not empty: an empty caption node would be announced as a blank
    // summary, which is worse than no summary.
    expect(screen.queryByText("Team roster")).toBeNull();
    expect(screen.getByLabelText("Table")).toBeTruthy();
  });

  it("renders the caption text", async () => {
    await render(<Table columns={columns} rows={rows} caption="Team roster" />);
    expect(screen.getByText("Team roster")).toBeTruthy();
  });

  it("carries the caption into the table's accessible name", async () => {
    await render(<Table columns={columns} rows={rows} caption="Team roster" />);
    // The substitution for `<caption>`: RN has no caption element, so the text
    // must reach assistive tech through the container's label instead. Without
    // this the caption is visible but silent, which is the failure a
    // presentational-only implementation would ship.
    const table = screen.getByLabelText("Table, Team roster");
    expect(table.props.accessibilityLabel).toContain("Team roster");
  });

  it("keeps an explicit label ahead of the caption", async () => {
    await render(
      <Table
        columns={columns}
        rows={rows}
        caption="Team roster"
        accessibilityLabel="Staff"
      />,
    );
    // A caller who names the table explicitly has already said what it is; the
    // caption is appended, never substituted, so neither is lost.
    const table = screen.getByLabelText("Staff, Team roster");
    expect(table.props.accessibilityLabel).toBe("Staff, Team roster");
  });

  it("still renders header and body cells", async () => {
    await render(<Table columns={columns} rows={rows} caption="Team roster" />);
    // The caption must not displace the table's own content.
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Ada")).toBeTruthy();
  });
});
