import { contractFor } from "@kern-parity/contract";
import { render, screen } from "@testing-library/react-native";
import { Table } from "@xoroh/kern-native";

/**
 * Native side of the `table-caption` contract row.
 *
 * This suite exists because the row was `cross-renderer pending`: the native
 * side had `table.rntest.tsx` in `src/components/` — a COMPONENT test. A
 * component test proves the component; a parity test proves the CONTRACT. Both
 * are needed, which is why this is a separate file rather than a move.
 *
 * The row is `interactive: false`, so nothing here presses anything. The shared
 * obligation is that the caption text REACHES assistive tech, and the delivery
 * differs per platform: web has a real `<caption>` element, this platform has
 * none, so the text is appended to the table's accessible name. Asserting a
 * `<caption>` tag here would be asserting a platform that does not exist.
 */
describe("native parity contract: table-caption", () => {
  const columns = [
    { key: "name", title: "Name" },
    { key: "role", title: "Role" },
  ];
  const rows = [{ name: "Ada", role: "Engineer" }];

  it("the row declares itself static, with no state axis", () => {
    const row = contractFor("table-caption");
    expect(row.family).toBe("static-content");
    expect(row.axis).toBeUndefined();
    expect(row.interaction).toBeUndefined();
    expect(row.maxSelected).toBeUndefined();
  });

  it("carries the caption text into the accessible name", async () => {
    const row = contractFor("table-caption");
    await render(<Table columns={columns} rows={rows} caption={row.name} />);
    // The substitution for the missing <caption> element. Without this the
    // caption is visible but silent, which is the failure a
    // presentational-only implementation would ship.
    const table = screen.getByLabelText(`Table, ${row.name}`);
    expect(table.props.accessibilityLabel).toContain(row.name);
  });

  it("keeps the table's own content", async () => {
    const row = contractFor("table-caption");
    await render(<Table columns={columns} rows={rows} caption={row.name} />);
    // The caption must not displace the header or the body.
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Ada")).toBeTruthy();
  });
});
