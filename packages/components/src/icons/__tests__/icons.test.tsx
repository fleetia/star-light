import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChevronLeftIcon } from "../ChevronLeftIcon";
import { ChevronRightIcon } from "../ChevronRightIcon";
import { TriangleUpIcon } from "../TriangleUpIcon";
import { TriangleDownIcon } from "../TriangleDownIcon";
import { GearIcon } from "../GearIcon";
import { FolderIcon } from "../FolderIcon";
import { EyeIcon } from "../EyeIcon";
import { DragHandleIcon } from "../DragHandleIcon";

describe("ChevronLeftIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<ChevronLeftIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<ChevronLeftIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<ChevronLeftIcon width={16} height={16} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("height")).toBe("16");
  });

  it("passes additional SVG props", () => {
    const { container } = render(
      <ChevronLeftIcon data-testid="icon" className="custom" />
    );
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("data-testid")).toBe("icon");
    expect(svg.getAttribute("class")).toBe("custom");
  });
});

describe("ChevronRightIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<ChevronRightIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<ChevronRightIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<ChevronRightIcon width={32} height={32} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
  });
});

describe("TriangleUpIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<TriangleUpIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<TriangleUpIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("12");
    expect(svg.getAttribute("height")).toBe("8");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<TriangleUpIcon width={20} height={14} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("14");
  });
});

describe("TriangleDownIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<TriangleDownIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<TriangleDownIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("12");
    expect(svg.getAttribute("height")).toBe("8");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<TriangleDownIcon width={20} height={14} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("14");
  });
});

describe("GearIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<GearIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<GearIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<GearIcon width={24} height={24} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
  });
});

describe("FolderIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<FolderIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<FolderIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("60%");
    expect(svg.getAttribute("height")).toBe("60%");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<FolderIcon width="40%" height="40%" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("40%");
    expect(svg.getAttribute("height")).toBe("40%");
  });
});

describe("EyeIcon", () => {
  it("renders an SVG element when visible", () => {
    const { container } = render(<EyeIcon isVisible />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("renders an SVG element when not visible", () => {
    const { container } = render(<EyeIcon isVisible={false} />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("renders different paths for visible and hidden states", () => {
    const { container: visibleContainer } = render(<EyeIcon isVisible />);
    const { container: hiddenContainer } = render(
      <EyeIcon isVisible={false} />
    );
    const visibleHTML = visibleContainer.querySelector("svg")!.innerHTML;
    const hiddenHTML = hiddenContainer.querySelector("svg")!.innerHTML;
    expect(visibleHTML).not.toBe(hiddenHTML);
  });

  it("uses default dimensions", () => {
    const { container } = render(<EyeIcon isVisible />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("14");
    expect(svg.getAttribute("height")).toBe("14");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<EyeIcon isVisible width={20} height={20} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });
});

describe("DragHandleIcon", () => {
  it("renders an SVG element", () => {
    const { container } = render(<DragHandleIcon />);
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("uses default dimensions", () => {
    const { container } = render(<DragHandleIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("14");
    expect(svg.getAttribute("height")).toBe("14");
  });

  it("accepts custom dimensions", () => {
    const { container } = render(<DragHandleIcon width={20} height={20} />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });

  it("renders six circles for the drag handle", () => {
    const { container } = render(<DragHandleIcon />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(6);
  });
});
