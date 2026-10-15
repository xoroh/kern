/**
 * Native behaviour suite for Card anatomy slots — header, content, actions.
 */
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { CardActions, CardContent, CardHeader } from "./card";

describe("Card anatomy (native)", () => {
  it("pads header and content to 16dp", async () => {
    await render(
      <>
        <CardHeader testID="head">
          <Text>Title</Text>
        </CardHeader>
        <CardContent testID="body">
          <Text>Body</Text>
        </CardContent>
      </>,
    );
    expect(screen.getByTestId("head").props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ padding: 16, paddingBottom: 0 }),
      ]),
    );
    expect(screen.getByTestId("body").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ padding: 16 })]),
    );
  });

  it("end-aligns actions in an 8dp row", async () => {
    await render(
      <CardActions testID="actions">
        <Text>OK</Text>
      </CardActions>,
    );
    expect(screen.getByTestId("actions").props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8,
          padding: 8,
        }),
      ]),
    );
  });
});
