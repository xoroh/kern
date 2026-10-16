// Test double for react-native: host-free stand-ins so suite logic runs in bun/jest.
import type { ReactNode } from "react";

const stub = (name: string) => {
  const C = ({ children, ..._props }: { children?: ReactNode }) =>
    children ?? null;
  C.displayName = name;
  return C;
};

export const View = stub("View");
export const Text = stub("Text");
export const Pressable = stub("Pressable");
export const ScrollView = stub("ScrollView");
export const TextInput = stub("TextInput");
export const ActivityIndicator = stub("ActivityIndicator");
// Added for the Axis cutover (migration PR): Axis components import
// these hosts, so the stub must resolve them for headless suites.
// Real implementations run under jest/RNTL + Expo host instead.
export const Modal = stub("Modal");
export const Image = stub("Image");
export const PanResponder = {
  create: (config: Record<string, unknown>) => ({
    panHandlers: {},
    ...(config as object),
  }),
};
export const useWindowDimensions = () => ({ width: 390, height: 844 });

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T): T => styles,
  flatten: (style: unknown) => style,
  absoluteFill: {},
  hairlineWidth: 1,
};

export const Animated = {
  View: stub("Animated.View"),
  Text: stub("Animated.Text"),
  Value: class {
    setValue() {}
    interpolate() {
      return this;
    }
  },
  timing: () => ({
    start: (cb?: (r: { finished: boolean }) => void) =>
      cb?.({ finished: true }),
  }),
  loop: () => ({ start: () => {} }),
  sequence: () => ({ start: () => {} }),
  parallel: () => ({ start: () => {} }),
};

export const Easing = {
  linear: (t: number) => t,
  ease: (t: number) => t,
  inOut: (f: unknown) => f,
};

export const Platform = {
  OS: "ios",
  select: (o: Record<string, unknown>) => o.ios ?? o.default,
};
export const useColorScheme = () => "light";
export const AccessibilityInfo = { isScreenReaderEnabled: async () => false };

export default {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Image,
  PanResponder,
  useWindowDimensions,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  useColorScheme,
  AccessibilityInfo,
};
