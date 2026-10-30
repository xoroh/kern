import { resolveThemeDetails } from "@xoroh/kern-tokens";
import { describe, expect, it } from "vitest";
import { KERN_EXTRA_ROLES } from "./kern-roles";

/**
 * U1 (kern-oss-upstream-v1): status roles ship canonically from kern-tokens.
 *
 * Platform keeps a local `status-colors` shim; this test pins the OSS side
 * of the contract so the shim can become an alias: the 12 K2 status roles
 * (success/warning/info + on/container pairs) resolve to valid hex in every
 * mode x contrast scheme. The generic gates (check:kern, tokens-css.test)
 * cover counts and CSS emission; this pins the names U1 promises.
 */
const STATUS_ROLES = (Object.keys(KERN_EXTRA_ROLES) as string[]).filter(
  (role) => role !== "surfaceTonal",
);

const HEX_RE = /^#[0-9a-f]{6}$/i;

describe("U1 status roles resolve in every scheme", () => {
  it("pins exactly the 12 K2 status roles", () => {
    expect(STATUS_ROLES.sort()).toEqual(
      [
        "info",
        "infoContainer",
        "onInfo",
        "onInfoContainer",
        "onSuccess",
        "onSuccessContainer",
        "onWarning",
        "onWarningContainer",
        "success",
        "successContainer",
        "warning",
        "warningContainer",
      ].sort(),
    );
  });

  it.each(["light", "dark"] as const)(
    "resolves in %s, all contrasts",
    (mode) => {
      for (const contrast of ["standard", "medium", "high"] as const) {
        const scheme = resolveThemeDetails(mode, contrast, "material-3");
        for (const role of STATUS_ROLES) {
          expect(
            HEX_RE.test(scheme.color[role] ?? ""),
            `${mode}/${contrast}.${role}`,
          ).toBe(true);
        }
      }
    },
  );
});
