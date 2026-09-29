import "vitest";

declare module "vitest" {
  interface Assertion<T = unknown, V = unknown> {
    toBeChecked(): T;
    toBeDisabled(): T;
    toBeEmptyDOMElement(): T;
    toBeEnabled(): T;
    toBeInTheDocument(): T;
    toBeInvalid(): T;
    toBePartiallyChecked(): T;
    toBeRequired(): T;
    toBeValid(): T;
    toBeVisible(): T;
    toContainElement(element: HTMLElement | null): T;
    toContainHTML(html: string): T;
    toHaveAccessibleDescription(description?: string | RegExp): T;
    toHaveAccessibleName(name?: string | RegExp): T;
    toHaveAttribute(name: string, value?: string | RegExp): T;
    toHaveClass(...names: string[]): T;
    toHaveFocus(): T;
    toHaveFormValues(values: Record<string, unknown>): T;
    toHaveStyle(css: Record<string, string | number>): T;
    toHaveTextContent(text: string | RegExp): T;
    toHaveValue(value?: unknown): T;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): T;
    toHaveRole(role: string, options?: { hidden?: boolean }): T;
    toHaveErrorMessage(message?: string | RegExp): T;
  }
}
