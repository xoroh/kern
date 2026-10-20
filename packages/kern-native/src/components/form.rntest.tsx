import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Form } from "./form";

describe("Form native component", () => {
  it("renders form container and children", async () => {
    await render(
      <Form testID="test-form">
        <Text>Form Content</Text>
      </Form>,
    );
    expect(screen.getByTestId("test-form")).toBeTruthy();
    expect(screen.getByText("Form Content")).toBeTruthy();
  });
});
