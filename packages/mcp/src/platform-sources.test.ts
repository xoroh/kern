import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getComponent, getDtcg, listComponents } from "./tools.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const readWeb = (rel: string) =>
  readFileSync(join(HERE, "..", "..", "kern", rel), "utf8");
const readNative = (rel: string) =>
  readFileSync(join(HERE, "..", "..", "kern-native", rel), "utf8");

/**
 * Platform source routing (D08) — `getComponent(name, platform)` serves the
 * row's OWN renderer source. It once served WEB source for native rows (every
 * row went through readKernFile), so an agent installing from the output
 * shipped the wrong renderer. Byte-equality with the on-disk file is the
 * assertion: the tool serves what the package ships, not a second copy.
 */
describe("platform source routing", () => {
  it("serves web source for a web row", async () => {
    const got = await getComponent("button", "web");
    if ("error" in got) throw new Error(got.error);
    expect(got.sourceCode).toBe(readWeb("src/components/button.tsx"));
  });

  it("serves native source for a native row — never web bytes", async () => {
    const got = await getComponent("button", "native");
    if ("error" in got) throw new Error(got.error);
    expect(got.sourceCode).toBe(readNative("src/components/button.tsx"));
    const web = await getComponent("button", "web");
    if ("error" in web) throw new Error(web.error);
    expect(got.sourceCode).not.toBe(web.sourceCode);
  });

  it("reports unknown platform/name pairs instead of guessing", async () => {
    const got = await getComponent("does-not-exist", "native");
    if (!("error" in got))
      throw new Error("expected an unknown-component error");
    expect(got.error).toMatch("unknown component");
  });

  it("lists the published import per platform", async () => {
    const list = await listComponents();
    if ("error" in list) throw new Error(list.error);
    const { components } = list;
    const web = components.find(
      (c) => c.name === "button" && c.platform === "web",
    );
    const native = components.find(
      (c) => c.name === "button" && c.platform === "native",
    );
    expect(web?.import).toBe("@xoroh/kern");
    expect(native?.import).toBe("@xoroh/kern-native");
  });

  it("publishes the /start entrypoint on composition rows", async () => {
    const list = await listComponents("web");
    if ("error" in list) throw new Error(list.error);
    const { components } = list;
    const searchBar = components.find((c) => c.name === "search-bar");
    expect(searchBar?.entrypoint).toBe("./start");
    expect(searchBar?.import).toBe("@xoroh/kern/start");
  });

  it("serves the DTCG interchange document", async () => {
    const got = await getDtcg();
    expect("error" in got).toBe(false);
    if ("error" in got) return;
    expect(got.spec).toBe("DTCG 2025.10");
    const doc = got.document as { ref: Record<string, unknown>; sys: unknown };
    expect(doc.ref).toBeDefined();
    expect(doc.sys).toBeDefined();
  });
});
