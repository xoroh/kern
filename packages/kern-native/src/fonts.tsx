import { tokens } from "@xoroh/kern-theme";
import { useEffect, useState } from "react";

/**
 * Font wiring (roadmap row 8). Kern uses one family — Inter — at three
 * weights. The *host* owns loading (`expo-font`'s `loadAsync`, or any other
 * loader); components only ever set a weight, resolved through these face
 * names. Keeping the loader injected is what lets `kern-native` stay free of
 * `expo-font` and of every other Expo-only peer.
 */
export const kernFontFaces = tokens.typography.fontFaces;

export type KernFontFace = keyof typeof kernFontFaces;
export type KernFontAssetMap = Record<string, number>;

/** The three Inter faces Kern ships, keyed by their token face name. */
export type KernFontAssets = Record<
  (typeof kernFontFaces)[KernFontFace],
  number
>;

/** Any `loadAsync`-shaped loader — `Font.loadAsync` satisfies this. */
export type KernFontLoader = (assets: KernFontAssets) => Promise<void>;

export type KernFontState = {
  /** `true` once the host loader resolved (or was never needed). */
  loaded: boolean;
  error: Error | null;
};

/**
 * Load Inter through the host's loader and report readiness. Renders nothing;
 * pair with {@link KernFontGate} to hold the first frame until fonts land, so
 * text never paints in the system fallback.
 */
export function useKernFonts(
  assets: KernFontAssets,
  load: KernFontLoader,
  active = true,
): KernFontState {
  const [state, setState] = useState<KernFontState>({
    loaded: !active,
    error: null,
  });

  useEffect(() => {
    if (!active) {
      setState({ loaded: true, error: null });
      return;
    }
    let live = true;
    load(assets).then(
      () => {
        if (live) setState({ loaded: true, error: null });
      },
      (error: unknown) => {
        if (live) {
          setState({
            loaded: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      },
    );
    return () => {
      live = false;
    };
  }, [assets, load, active]);

  return state;
}

export type KernFontGateProps = {
  state: KernFontState;
  /** Shown while fonts load, and when loading failed. */
  fallback: React.ReactNode;
  children: React.ReactNode;
};

/** Hold `children` back until {@link useKernFonts} reports `loaded`. */
export function KernFontGate({ state, fallback, children }: KernFontGateProps) {
  return <>{state.loaded ? children : fallback}</>;
}
