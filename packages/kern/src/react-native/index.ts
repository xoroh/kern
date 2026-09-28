// React Native entry point — not implemented yet.
//
// Native components will mirror the web API (same names, same tokens)
// on top of @rn-primitives + NativeWind. See packages/kern/src/theme
// for the shared tokens.

export type NativeButtonProps = {
  variant?: "primary" | "ghost";
  label: string;
  onPress?: () => void;
};

export function Button(_props: NativeButtonProps): never {
  throw new Error("@xoroh/kern/native: not implemented yet");
}
