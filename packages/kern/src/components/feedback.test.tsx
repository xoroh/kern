import { render, renderHook, screen } from "@testing-library/react";
import {
  registerFeedbackVariant,
  resolveFeedbackVariant,
} from "@xoroh/kern-theme";
import { describe, expect, it, vi } from "vitest";
import { markAppReady, useAppReady } from "./app-ready";
import { BootIndicator } from "./boot-indicator";
import { CircularProgress } from "./circular-progress";
import { LinearProgress } from "./linear-progress";
import { LoadingButton } from "./loading-button";
import { PageLoader } from "./page-loader";

vi.mock("./button", () => ({
  buttonVariants: () => "kern-button",
}));

describe("CircularProgress", () => {
  it("renders the M3 spinner ring for the `spinner` style", () => {
    const { container } = render(<CircularProgress loaderStyle="spinner" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("class")).toContain("animate-spin");
    expect(svg?.querySelector("circle")).not.toBeNull();
    expect(screen.getByRole("status")).toHaveAccessibleName("Loading");
  });

  it("renders three staggered dots for the `dots` style", () => {
    const { container } = render(<CircularProgress loaderStyle="dots" />);
    const dots = container.querySelectorAll(".kern-circular-progress-dot");
    expect(dots.length).toBe(3);
    for (const dot of dots) {
      expect(dot.getAttribute("class")).toContain("animate-kern-loader-dot");
    }
    expect(dots[0].getAttribute("style")).toContain("animation-delay: -300ms");
    expect(dots[1].getAttribute("style")).toContain("animation-delay: -150ms");
    expect(dots[2].getAttribute("style")).toContain("animation-delay: 0ms");
  });

  it("renders four equalizer bars for the `bar` style", () => {
    const { container } = render(<CircularProgress loaderStyle="bar" />);
    const bars = container.querySelectorAll(".kern-circular-progress-bar");
    expect(bars.length).toBe(4);
    const heights = [...bars].map((bar) => bar.getAttribute("style"));
    expect(heights[0]).toContain("height: 60%");
    expect(heights[1]).toContain("height: 100%");
    expect(heights[2]).toContain("height: 80%");
    expect(heights[3]).toContain("height: 50%");
    expect(bars[0].getAttribute("class")).toContain("animate-kern-loader-bar");
  });

  it("renders the brand trio for the `shapes` style", () => {
    const { container } = render(<CircularProgress loaderStyle="shapes" />);
    const glyphs = container.querySelectorAll(".kern-circular-progress-shape");
    expect(glyphs.length).toBe(3);
    expect(glyphs[0].firstElementChild?.tagName).toBe("polygon");
    expect(glyphs[1].firstElementChild?.tagName).toBe("circle");
    expect(glyphs[2].firstElementChild?.tagName).toBe("rect");
    for (const glyph of glyphs) {
      expect(glyph.getAttribute("class")).toContain(
        "animate-kern-loader-shape",
      );
    }
  });

  it("honors a custom shape list for the `shapes` style", () => {
    const { container } = render(
      <CircularProgress loaderStyle="shapes" shapes={["pill", "arch"]} />,
    );
    const glyphs = container.querySelectorAll(".kern-circular-progress-shape");
    expect(glyphs.length).toBe(2);
    expect(glyphs[0].firstElementChild?.tagName).toBe("rect");
    expect(glyphs[1].firstElementChild?.tagName).toBe("path");
  });

  it("renders the determinate M3 arc with progress semantics", () => {
    render(<CircularProgress value={0.5} label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar.getAttribute("class")).toContain("-rotate-90");
    expect(bar.querySelectorAll("circle").length).toBe(2);
  });

  it("clamps determinate values to the 0–1 range", () => {
    render(<CircularProgress value={2} label="High" />);
    expect(screen.getByRole("progressbar", { name: "High" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    render(<CircularProgress value={-1} label="Low" />);
    expect(screen.getByRole("progressbar", { name: "Low" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("renders the determinate arc regardless of loader style", () => {
    render(<CircularProgress value={0.25} loaderStyle="dots" label="Mix" />);
    const bar = screen.getByRole("progressbar", { name: "Mix" });
    expect(bar.getAttribute("class")).toContain("-rotate-90");
    expect(screen.queryByRole("status")).toBeNull();
  });

  for (const reserved of [
    "conveyor",
    "contained",
    "orbit",
    "morph",
    "assembly",
  ] as const) {
    it(`throws on the reserved "${reserved}" style`, () => {
      expect(() => render(<CircularProgress loaderStyle={reserved} />)).toThrow(
        `CircularProgress: loading style "${reserved}" is reserved and not rendered yet`,
      );
    });
  }
});

describe("resolveFeedbackVariant parity", () => {
  it("matches the native suite literal for the default JSON", () => {
    expect(JSON.stringify(resolveFeedbackVariant())).toBe(
      '{"shapes":["triangle","circle","square"],"style":"shapes","tone":"surface"}',
    );
  });

  it("matches the native suite literal for a registered tenant JSON", () => {
    registerFeedbackVariant("web-parity", {
      shapes: ["diamond", "pill", "circle"],
      style: "dots",
      tone: "inverse",
    });
    expect(JSON.stringify(resolveFeedbackVariant("web-parity"))).toBe(
      '{"shapes":["diamond","pill","circle"],"style":"dots","tone":"inverse"}',
    );
  });

  it("fails loud on an unknown tenant id", () => {
    expect(() => resolveFeedbackVariant("web-nope")).toThrow(
      "Unknown feedback variant: web-nope",
    );
  });
});

describe("LinearProgress", () => {
  it("renders the determinate fill with progress semantics", () => {
    render(<LinearProgress value={0.4} label="Sync" />);
    const bar = screen.getByRole("progressbar", { name: "Sync" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    const fill = bar.querySelector(
      "[data-slot='linear-progress-indicator']",
    ) as HTMLElement;
    expect(fill.style.width).toBe("40%");
  });

  it("clamps the fill width to the 0–1 range", () => {
    const { container } = render(<LinearProgress value={1.8} />);
    const fill = container.querySelector(
      "[data-slot='linear-progress-indicator']",
    ) as HTMLElement;
    expect(fill.style.width).toBe("100%");
  });
});

describe("LoadingButton", () => {
  it("keeps its label and blocks interaction while loading", () => {
    const { rerender } = render(<LoadingButton>Send</LoadingButton>);
    const idle = screen.getByTestId("loading-button");
    expect(idle).toHaveTextContent("Send");
    expect(idle).not.toHaveAttribute("data-loading");
    expect(idle).not.toBeDisabled();

    rerender(
      <LoadingButton loading value={0.5}>
        Send
      </LoadingButton>,
    );
    const busy = screen.getByTestId("loading-button");
    expect(busy).toHaveAttribute("data-loading", "");
    expect(busy).toHaveAttribute("aria-busy", "true");
    expect(busy).toBeDisabled();
    expect(busy).toHaveTextContent("Send");
    expect(
      busy.querySelector("[data-testid='circular-progress']"),
    ).not.toBeNull();
  });
});

describe("BootIndicator", () => {
  it("renders the brand trio and the signature wordmark", () => {
    const { container } = render(<BootIndicator signature="Xoroh" />);
    const boot = screen.getByTestId("boot-indicator");
    expect(boot).toHaveAttribute("role", "status");
    const glyphs = container.querySelectorAll(".kern-circular-progress-shape");
    expect(glyphs.length).toBe(3);
    expect(boot).toHaveTextContent("from");
    expect(boot).toHaveTextContent("Xoroh");
  });

  it("omits the signature block when no wordmark is given", () => {
    const { container } = render(<BootIndicator />);
    expect(container.textContent).not.toContain("from");
  });
});

describe("PageLoader", () => {
  it("renders the loading surface with its label", () => {
    render(<PageLoader label="Fetching rides" />);
    const page = screen.getByTestId("page-loader");
    expect(page).toHaveAttribute("aria-label", "Fetching rides");
    expect(page).toHaveTextContent("Fetching rides");
  });
});

describe("app-ready handoff", () => {
  it("markAppReady sets data-app-ready and useAppReady reads the state", () => {
    expect(document.documentElement.hasAttribute("data-app-ready")).toBe(false);
    markAppReady();
    expect(document.documentElement.getAttribute("data-app-ready")).toBe("");
    expect(useAppReady).toBeTypeOf("function");
    const { result } = renderHook(() => useAppReady());
    expect(result.current).toBe(true);
  });
});
