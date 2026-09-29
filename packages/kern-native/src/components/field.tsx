import type { ReactNode } from "react";
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { NativeFieldProvider } from "../field-context";
import { FieldMessage } from "./field-message";
import { Input } from "./input";
import { Text } from "./text";

export type NativeFieldRootProps = Omit<ViewProps, "children"> & {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type NativeFieldPartProps = { children: ReactNode };

function FieldLabel({ children }: NativeFieldPartProps) {
  return <Text variant="label">{children}</Text>;
}

function FieldDescription({ children }: NativeFieldPartProps) {
  return <FieldMessage>{children}</FieldMessage>;
}

function FieldError({ children }: NativeFieldPartProps) {
  return <FieldMessage variant="error">{children}</FieldMessage>;
}

function Root({
  label,
  description,
  error,
  children,
  style,
  testID,
  ...props
}: NativeFieldRootProps) {
  return (
    <NativeFieldProvider value={{ label, description, error }}>
      <View
        {...props}
        testID={testID ?? "kern-field"}
        style={[{ gap: 6 }, style]}
      >
        <FieldLabel>{label}</FieldLabel>
        {children}
        {error ? (
          <FieldError>{error}</FieldError>
        ) : description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </View>
    </NativeFieldProvider>
  );
}

/** Native field composition; Input consumes label/error context for a11y. */
export const Field = {
  Root,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: Input,
};

export { Root as FieldRoot };
