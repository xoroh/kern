import type { TextProps } from "react-native";
import { Text } from "./text";

export type LabelProps = TextProps;

export function Label(props: LabelProps) {
  return <Text variant="label" {...props} />;
}
