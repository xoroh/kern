import { describe, expect, test } from "vitest";
import { defineBlock } from "./block";
import {
  type ComponentRecord,
  defineComponent,
  registryKey,
} from "./component";
import { defineIcon, MISSING_ICON_POLICY } from "./icon";
import {
  defineCliConfig,
  defineReceipt,
  RECEIPT_SCHEMA_VERSION,
} from "./install";
import {
  defineProvider,
  isProviderIdShape,
  MATERIAL_PROVIDER,
  PROVIDER_ID,
} from "./provider";
import schemaJson from "./schema.json";
import { schemaCompatible, versionCoordinates } from "./version";

const component = (over: Partial<ComponentRecord> = {}): ComponentRecord => ({
  schemaVersion: "1.0.0",
  provider: "m3",
  renderer: "web",
  name: "rich-tooltip",
  export: "RichTooltip",
  entrypoint: ".",
  path: "src/components/tooltip.tsx",
  status: "real",
  origin: "spec-native",
  capabilities: { resting: "verified" },
  ...over,
});

describe("provider", () => {
  test("the Material provider validates", () => {
    expect(defineProvider(MATERIAL_PROVIDER).id).toBe("m3");
    expect(PROVIDER_ID).toBe("m3");
  });

  test("an unknown provider fails loud", () => {
    expect(() =>
      defineProvider({ ...MATERIAL_PROVIDER, id: "other" as never }),
    ).toThrow("Only");
  });

  test("blank evidence fails", () => {
    expect(() =>
      defineProvider({ ...MATERIAL_PROVIDER, evidence: "  " }),
    ).toThrow("evidence");
  });

  test("id shape accepts kebab, rejects spaces", () => {
    expect(isProviderIdShape("m3")).toBe(true);
    expect(isProviderIdShape("Material 3")).toBe(false);
  });
});

describe("component", () => {
  test("a real row validates, including a /start entrypoint", () => {
    expect(
      defineComponent(
        component({
          name: "search-bar",
          export: "SearchBar",
          entrypoint: "./start",
          path: "src/start/blocks.tsx",
        }),
      ).entrypoint,
    ).toBe("./start");
  });

  test("an unknown provider fails", () => {
    expect(() =>
      defineComponent(component({ provider: "other" as never })),
    ).toThrow("provider");
  });

  test("a lowercase export fails", () => {
    expect(() => defineComponent(component({ export: "richTooltip" }))).toThrow(
      "export",
    );
  });

  test("a bad entrypoint fails", () => {
    expect(() =>
      defineComponent(component({ entrypoint: "./nowhere" as never })),
    ).toThrow("entrypoint");
  });

  test("an unknown capability state fails", () => {
    expect(() =>
      defineComponent({
        ...component(),
        capabilities: { resting: "maybe" as never },
      }),
    ).toThrow("resting");
  });

  test("registry keys collide on platform/name, not export", () => {
    expect(registryKey("web", "rich-tooltip")).toBe("web/rich-tooltip");
    expect(registryKey("native", "rich-tooltip")).not.toBe(
      registryKey("web", "rich-tooltip"),
    );
  });
});

describe("block", () => {
  const block = {
    schemaVersion: "1.0.0",
    name: "auth-form",
    title: "Auth form",
    description: "Sign-in composed section.",
    category: "auth",
    platforms: ["web"] as Array<"web">,
    components: ["Button", "Input"],
    installCommand: "kern add auth-form",
    files: ["auth-form.tsx"],
  };

  test("a real block validates", () => {
    expect(defineBlock(block).name).toBe("auth-form");
  });

  test("an empty component list fails", () => {
    expect(() => defineBlock({ ...block, components: [] })).toThrow(
      "components",
    );
  });

  test("an empty file list fails — a block with no files installs nothing", () => {
    expect(() => defineBlock({ ...block, files: [] })).toThrow("files");
  });
});

describe("icon", () => {
  test("a real icon validates", () => {
    expect(
      defineIcon({
        schemaVersion: "1.0.0",
        name: "menu-book",
        glyph: "menu_book",
        meaning: "Documentation index",
        sizes: [20, 24],
        fill: true,
        decorative: false,
      }).glyph,
    ).toBe("menu_book");
  });

  test("a blank meaning fails — meaning is the contract", () => {
    expect(() =>
      defineIcon({
        schemaVersion: "1.0.0",
        name: "menu-book",
        glyph: "menu_book",
        meaning: "  ",
        sizes: [24],
        fill: false,
        decorative: true,
      }),
    ).toThrow("meaning");
  });

  test("the missing-icon policy is null, never a wrong glyph", () => {
    expect(MISSING_ICON_POLICY).toBe("null-with-dev-warning");
  });
});

describe("install", () => {
  const receipt = {
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    releaseSet: "2026-10-13",
    mode: "source-hybrid" as const,
    files: [
      {
        path: "button.tsx",
        baselineHash: "abc",
        currentHash: "abc",
        owner: "kern",
        customized: false,
      },
    ],
    assets: [],
    licenses: ["MIT"],
    config: { target: "apps/site" },
  };

  test("a real receipt validates", () => {
    expect(defineReceipt(receipt).releaseSet).toBe("2026-10-13");
  });

  test("a wrong schema version fails", () => {
    expect(() =>
      defineReceipt({ ...receipt, schemaVersion: "1" as never }),
    ).toThrow("schemaVersion");
  });

  test("blank hashes fail — a receipt that cannot diff is not a receipt", () => {
    expect(() =>
      defineReceipt({
        ...receipt,
        files: [
          {
            path: "button.tsx",
            baselineHash: "",
            currentHash: "",
            owner: "kern",
            customized: false,
          },
        ],
      }),
    ).toThrow("hashes");
  });

  test("CLI config validates renderer and mode", () => {
    expect(
      defineCliConfig({ target: "apps/site", renderer: "web", mode: "package" })
        .mode,
    ).toBe("package");
    expect(() =>
      defineCliConfig({
        target: "x",
        renderer: "all" as never,
        mode: "package",
      }),
    ).toThrow("renderer");
  });
});

describe("schema.json", () => {
  test("the published JSON schema covers provider and component records", () => {
    const props = (schemaJson as { properties: Record<string, unknown> })
      .properties;
    expect(Object.keys(props).sort()).toEqual(["component", "provider"]);
    const component = (
      schemaJson as {
        properties: { component: { required: string[] } };
      }
    ).properties.component;
    // The schema must require the fields the validators require — a second
    // source of truth that drifts is how a half-row starts reading as
    // complete. This pins them together.
    for (const field of [
      "schemaVersion",
      "provider",
      "renderer",
      "name",
      "export",
      "entrypoint",
      "path",
      "status",
      "origin",
      "capabilities",
    ]) {
      expect(component.required).toContain(field);
    }
  });
});
describe("version", () => {
  test("coordinates carry all three versions", () => {
    expect(versionCoordinates("0.0.0")).toEqual({
      package: "0.0.0",
      schema: "1.0.0",
      receipt: "2",
    });
  });

  test("same-major readers consume older writers, never newer majors", () => {
    expect(schemaCompatible("1.2.0", "1.0.0")).toBe(true);
    expect(schemaCompatible("1.0.0", "1.2.0")).toBe(false);
    expect(schemaCompatible("2.0.0", "1.9.9")).toBe(false);
  });
});
