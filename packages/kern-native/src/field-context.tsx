import { createContext, type PropsWithChildren, useContext } from "react";

export type NativeFieldContextValue = {
  label: string;
  description?: string;
  error?: string;
};

const Context = createContext<NativeFieldContextValue | null>(null);

export function NativeFieldProvider({
  value,
  children,
}: PropsWithChildren<{ value: NativeFieldContextValue }>) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useNativeField(): NativeFieldContextValue | null {
  return useContext(Context);
}
