import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title, description and the primary action", async () => {
    const onPress = jest.fn();
    await render(
      <EmptyState
        title="No rides yet"
        description="Book your first ride."
        primaryAction={<Text onPress={onPress}>Book now</Text>}
      />,
    );
    expect(screen.getByText("No rides yet")).toBeTruthy();
    expect(screen.getByText("Book your first ride.")).toBeTruthy();
    expect(screen.getByText("Book now")).toBeTruthy();
  });

  it("keeps `action` as the primary-action alias", async () => {
    await render(<EmptyState title="Empty" action={<Text>Retry</Text>} />);
    expect(screen.getByText("Retry")).toBeTruthy();
  });

  it("renders primary + secondary actions", async () => {
    await render(
      <EmptyState
        title="Empty"
        primaryAction={<Text>Retry</Text>}
        secondaryAction={<Text>Support</Text>}
      />,
    );
    expect(screen.getByText("Retry")).toBeTruthy();
    expect(screen.getByText("Support")).toBeTruthy();
  });

  it("scales padding per placement variant: page", async () => {
    await render(<EmptyState title="Page" variant="page" />);
    const pageStyle = screen.getByTestId("kern-empty-state").props.style;
    expect(JSON.stringify(pageStyle)).toContain("48");
  });

  it("scales padding per placement variant: list-row", async () => {
    await render(<EmptyState title="Row" variant="list-row" />);
    const rowStyle = screen.getByTestId("kern-empty-state").props.style;
    expect(JSON.stringify(rowStyle)).toContain("16");
  });

  it("fires the primary action", async () => {
    const onPress = jest.fn();
    await render(
      <EmptyState
        title="Empty"
        primaryAction={<Text onPress={onPress}>Retry</Text>}
      />,
    );
    fireEvent.press(screen.getByText("Retry"));
    expect(onPress).toHaveBeenCalled();
  });
});
