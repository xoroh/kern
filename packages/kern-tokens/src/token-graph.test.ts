import { describe, expect, test } from "vitest";
import {
  aliasTarget,
  buildGraph,
  emptyGraph,
  mergeExtends,
  resolveAlias,
  resolvePointer,
} from "./token-graph";
import { validateTokenSource } from "./token-schema";

describe("token schema", () => {
  test("the real tokens.json validates", async () => {
    const tokens = (await import("./tokens")).tokens;
    expect(() => validateTokenSource(tokens)).not.toThrow();
  });

  test("a missing foundation group fails with its name", () => {
    const tokens = { palettes: {}, typography: {} } as unknown;
    expect(() => validateTokenSource(tokens)).toThrow("shape");
  });

  test("prototype keys fail at the boundary", () => {
    const doc = {
      palettes: {},
      typography: {},
      shape: {},
      elevation: {},
      motion: {},
      states: {},
      spacing: {},
      ["__proto__"]: { polluted: true },
    } as unknown;
    expect(() => validateTokenSource(doc)).toThrow("__proto__");
  });
});

describe("aliases", () => {
  test("a chain resolves to the terminal value", () => {
    const graph = emptyGraph();
    graph.nodes.set("a", { id: "a", ref: "b" });
    graph.nodes.set("b", { id: "b", ref: "c" });
    graph.nodes.set("c", { id: "c", value: "#fff" });
    expect(resolveAlias(graph, "a").value).toBe("#fff");
  });

  test("a cycle reports the full chain, not just the endpoint", () => {
    const graph = emptyGraph();
    graph.nodes.set("a", { id: "a", ref: "b" });
    graph.nodes.set("b", { id: "b", ref: "a" });
    expect(() => resolveAlias(graph, "a")).toThrow("a -> b -> a");
  });

  test("a missing target reports the chain walked so far", () => {
    const graph = emptyGraph();
    graph.nodes.set("a", { id: "a", ref: "b" });
    graph.nodes.set("b", { id: "b", ref: "gone" });
    expect(() => resolveAlias(graph, "a")).toThrow("a -> b -> gone");
  });

  test("only whole-string braces are aliases", () => {
    expect(aliasTarget("{a.b}")).toBe("a.b");
    expect(aliasTarget("prefix {a.b}")).toBeUndefined();
    expect(aliasTarget("#fff")).toBeUndefined();
  });
});

describe("pointers", () => {
  const doc = { a: { "b/c": [{ d: 1 }], "e~f": 2 } };

  test("local pointers walk objects and arrays", () => {
    expect(resolvePointer(doc, "#/a/b~1c/0/d")).toBe(1);
    expect(resolvePointer(doc, "#/a/e~0f")).toBe(2);
    expect(resolvePointer(doc, "#")).toBe(doc);
  });

  test("remote pointers are rejected outright", () => {
    expect(() => resolvePointer(doc, "https://x/y.json#/a")).toThrow("remote");
    expect(() => resolvePointer(doc, "a/b")).toThrow("remote");
  });

  test("walking through a leaf fails with the path", () => {
    expect(() => resolvePointer(doc, "#/a/e~0f/deep")).toThrow(
      "walks through a leaf",
    );
  });
});

describe("$extends", () => {
  test("objects merge, leaves replace wholesale", () => {
    const out = mergeExtends(
      { color: { $value: "#000", $type: "color" }, n: 1 },
      { color: { $value: "#fff" }, m: 2 },
    );
    // The extension's leaf REPLACED the base token — no surviving $type from
    // a token that no longer exists in that form.
    expect(out.color).toEqual({ $value: "#fff" });
    expect(out.n).toBe(1);
    expect(out.m).toBe(2);
  });

  test("prototype keys fail", () => {
    expect(() => mergeExtends({}, { ["__proto__"]: 1 } as never)).toThrow(
      "prototype",
    );
  });
});

describe("buildGraph", () => {
  test("group $type flows to typeless children, $value wins locally", () => {
    const graph = buildGraph({
      color: {
        $type: "color",
        a: { $value: "#000" },
        b: { $value: "#111", $type: "other" },
      },
    });
    expect(graph.nodes.get("color.a")?.type).toBe("color");
    expect(graph.nodes.get("color.b")?.type).toBe("other");
  });

  test("string aliases become refs, plain strings stay values", () => {
    const graph = buildGraph({ a: "{b}", b: "#fff", c: "just text" });
    expect(graph.nodes.get("a")?.ref).toBe("b");
    expect(resolveAlias(graph, "a").value).toBe("#fff");
    expect(graph.nodes.get("c")?.value).toBe("just text");
  });
});
