import { cn } from "./cn";

export type StateClassName<State> =
  | string
  | false
  | null
  | undefined
  | ((state: State) => string | undefined);

/** Merge defaults with a primitive's state-aware className prop. */
export function cnState<State>(
  defaults: string,
  ...custom: StateClassName<State>[]
): string | ((state: State) => string) {
  const merge = (state?: State) =>
    cn(
      defaults,
      ...custom.map((entry) =>
        typeof entry === "function" ? entry(state as State) : entry,
      ),
    );
  return custom.some((entry) => typeof entry === "function")
    ? (state) => merge(state)
    : merge();
}
