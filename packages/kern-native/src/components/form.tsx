import {
  Form as AxisForm,
  type FormProps as AxisFormProps,
  type FormActions,
  type FormState,
} from "@xoroh/axis";
import type { ReactNode, Ref } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";

export type NativeFormProps = AxisFormProps & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<FormActions>;
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
});

/**
 * M3 Form on the Axis `Form` behavior primitive.
 * Connects Field validation, form actions ref, and error aggregation.
 */
export function Form({ style, ...props }: NativeFormProps) {
  return (
    <AxisForm
      {...props}
      style={[styles.form, typeof style === "function" ? undefined : style]}
    />
  );
}

export type { FormActions, FormState };
