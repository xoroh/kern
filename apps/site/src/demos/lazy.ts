/**
 * Lazy demo/showcase registries — keep the heavy modules out of route chunks.
 *
 * `demos/web/registry` pulls every web demo (the whole `@xoroh/kern`
 * component surface exercised live), `demos/mobile/registry` pulls
 * `@xoroh/kern-native` through react-native-web, and `showcase/registry`
 * pulls every configurator plus example (including the barrel `<Icon>`,
 * i.e. the full shape registry). None of that belongs in the entry or the
 * components route chunks.
 *
 * The pattern mirrors `search-palette`: a `useEffect` dynamic `import()`,
 * state-held modules, and fixed-size skeletons until they arrive — so SSR
 * and prerender emit the same boxes the client fills in, with no layout
 * shift. Types are `typeof import(...)` (erased at compile), so this module
 * itself adds nothing to any chunk.
 */
import { useEffect, useState } from "react";

export type WebDemoRegistry = typeof import("../demos/web/registry");
export type MobileDemoRegistry = typeof import("../demos/mobile/registry");
export type ShowcaseRegistry = typeof import("../showcase/registry");

export type DemoRegistries = {
  web?: WebDemoRegistry;
  mobile?: MobileDemoRegistry;
};

type DemoNeed = "web" | "mobile" | "both";

/**
 * The requested demo registries, or `{}` until the async chunks arrive.
 *
 * `need` keeps the other platform out of the fetch set: a web-tab component
 * page never downloads `@xoroh/kern-native` (and through it, the icon
 * registry) just because the mobile tab exists. Unneeded platforms stay
 * unfetched; switchingneed later loads the missing side on demand.
 */
export function useDemoRegistries(need: DemoNeed = "both"): DemoRegistries {
  const [mods, setMods] = useState<DemoRegistries>({});
  useEffect(() => {
    let live = true;
    const jobs: Promise<void>[] = [];
    if (need !== "mobile") {
      jobs.push(
        import("../demos/web/registry").then((web) => {
          if (live) setMods((prev) => (prev.web ? prev : { ...prev, web }));
        }),
      );
    }
    if (need !== "web") {
      jobs.push(
        import("../demos/mobile/registry").then((mobile) => {
          if (live)
            setMods((prev) => (prev.mobile ? prev : { ...prev, mobile }));
        }),
      );
    }
    void Promise.all(jobs);
    return () => {
      live = false;
    };
  }, [need]);
  return mods;
}

/** The showcase registry (configurators + examples), or null until it arrives. */
export function useShowcaseRegistry(): ShowcaseRegistry | null {
  const [mod, setMod] = useState<ShowcaseRegistry | null>(null);
  useEffect(() => {
    let live = true;
    void import("../showcase/registry").then((m) => {
      if (live) setMod(m);
    });
    return () => {
      live = false;
    };
  }, []);
  return mod;
}
