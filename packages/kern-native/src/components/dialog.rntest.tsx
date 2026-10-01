/**
 * The dialog's role on the RN floor.
 *
 * Why this file exists: `kern-native`'s Dialog shipped `accessibilityRole="none"`
 * on its card. `accessibilityRole` is the *platform-trait* prop and its union has
 * no `dialog` member at all — so "none" was not a styling choice, it was the only
 * way to say "there is no role I can express" with that prop. The result is that
 * every screen reader treated a modal dialog as an unnamed, unstructured View:
 * it had a label, but nothing announced that the content behind it was inert.
 *
 * RN ships TWO role props:
 *   - `accessibilityRole` — the native trait union (button, adjustable, …). No
 *     `dialog`. Checked in
 *     node_modules/react-native/Libraries/Components/View/ViewAccessibility.d.ts:188
 *   - `role` — the ARIA-aligned prop, and `Role` (same file, line 364) DOES
 *     contain `'dialog'` (line 378). Fabric resolves it to `Role::Dialog`
 *     (ReactCommon/react/renderer/components/view/accessibilityPropsConversions.h:651).
 *
 * So the fix is `role="dialog"`, not a `accessibilityRole` value that does not
 * exist. `accessibilityRole="alert"` rides along as the repo's established
 * dialog mapping (see alert-dialog.tsx:67 and the sheets family): it is the
 * closest real trait VoiceOver/TalkBack have for "this container interrupted
 * you", and it is what the rest of the repo already does for a modal surface.
 *
 * These probes walk the RENDERED a11y tree rather than reading the source, so a
 * regression that drops the prop, moves it to a wrapper, or drops the label on
 * the way down the tree fails here.
 */
import { render, screen } from "@testing-library/react-native";
import { AlertDialog } from "./alert-dialog";
import { Dialog } from "./dialog";

type A11yNode = {
  role?: string;
  a11yRole?: string;
  label?: string;
  isModal?: boolean;
};

/**
 * Collect every host node in the rendered tree that carries any accessibility
 * signal. Walking the tree (rather than trusting `getByTestId().props`) is the
 * point: it proves the props reach a host element instead of dying on a wrapper.
 */
function a11yTree(): A11yNode[] {
  const found: A11yNode[] = [];
  const walk = (node: unknown): void => {
    if (node === null || typeof node !== "object") {
      return;
    }
    const candidate = node as {
      type?: unknown;
      props?: Record<string, unknown>;
      children?: unknown[];
    };
    const props = candidate.props ?? {};
    const role = props.role;
    const a11yRole = props.accessibilityRole;
    const label = props.accessibilityLabel;
    const isModal = props.accessibilityViewIsModal;
    if (
      typeof role === "string" ||
      typeof a11yRole === "string" ||
      typeof label === "string" ||
      isModal === true
    ) {
      found.push({
        role: typeof role === "string" ? role : undefined,
        a11yRole: typeof a11yRole === "string" ? a11yRole : undefined,
        label: typeof label === "string" ? label : undefined,
        isModal: isModal === true ? true : undefined,
      });
    }
    for (const child of candidate.children ?? []) {
      walk(child);
    }
  };
  walk(screen.toJSON() as unknown);
  return found;
}

describe("Dialog role on the RN floor", () => {
  it("declares role=dialog on the labelled surface", async () => {
    await render(<Dialog visible title="Discard draft?" testID="dlg" />);

    const tree = a11yTree();
    const dialogs = tree.filter((node) => node.role === "dialog");
    // Exactly one, so the role cannot be sprayed onto a wrapper and the card.
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0].label).toBe("Discard draft?");
  });

  it("keeps the repo's accessibilityRole=alert mapping as the fallback", async () => {
    await render(<Dialog visible title="Discard draft?" testID="dlg" />);

    const tree = a11yTree();
    const dialogs = tree.filter((node) => node.role === "dialog");
    expect(dialogs[0].a11yRole).toBe("alert");
  });

  it("never reports role=none on the dialog surface", async () => {
    await render(<Dialog visible title="Discard draft?" testID="dlg" />);

    const surface = a11yTree().find((node) => node.label === "Discard draft?");
    expect(surface?.role).not.toBe("none");
    expect(surface?.a11yRole).not.toBe("none");
  });

  it("marks the modal so the content behind it is announced as inert", async () => {
    await render(<Dialog visible title="Discard draft?" testID="dlg" />);

    // `accessibilityViewIsModal` lives on the Modal, one level above the card —
    // asserting the whole tree is how the probe proves it is actually emitted.
    expect(a11yTree().some((node) => node.isModal === true)).toBe(true);
  });

  it("leaves the alert-dialog sibling on its existing mapping", async () => {
    // AlertDialog is NOT in this task's scope. Pinning it here is a guard: the
    // fix must not silently restyle a sibling through a shared constant.
    await render(<AlertDialog visible title="Discard draft?" testID="adlg" />);

    const tree = a11yTree();
    expect(tree.filter((node) => node.role === "dialog")).toHaveLength(0);
    expect(tree.some((node) => node.a11yRole === "alert")).toBe(true);
  });
});
