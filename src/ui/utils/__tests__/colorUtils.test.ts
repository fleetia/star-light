import { describe, it, expect } from "vitest";
import {
  hslToRgb,
  rgbToHsl,
  rgbToHex,
  hexToRgb,
  parseColor,
  formatColor,
  cartesianToAngle,
  polarToCartesian,
  pointInTriangle,
  clampToTriangle,
  getTriangleVertices,
  slToTrianglePoint,
  trianglePointToSL
} from "../colorUtils";

// --- Color conversion ---

describe("hslToRgb", () => {
  it("순수 빨강 (0, 100, 50)", () => {
    expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
  });

  it("순수 초록 (120, 100, 50)", () => {
    expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
  });

  it("순수 파랑 (240, 100, 50)", () => {
    expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
  });

  it("흰색 (0, 0, 100)", () => {
    expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]);
  });

  it("검정 (0, 0, 0)", () => {
    expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]);
  });

  it("회색 (0, 0, 50) — 무채색", () => {
    expect(hslToRgb(0, 0, 50)).toEqual([128, 128, 128]);
  });

  it("각 60도 구간별 색상 변환", () => {
    // 노랑 (60도)
    expect(hslToRgb(60, 100, 50)).toEqual([255, 255, 0]);
    // 시안 (180도)
    expect(hslToRgb(180, 100, 50)).toEqual([0, 255, 255]);
    // 마젠타 (300도)
    expect(hslToRgb(300, 100, 50)).toEqual([255, 0, 255]);
  });
});

describe("rgbToHsl", () => {
  it("순수 빨강", () => {
    expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
  });

  it("흰색", () => {
    expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
  });

  it("검정", () => {
    expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
  });

  it("hslToRgb와 round-trip 변환이 일치한다", () => {
    const cases: [number, number, number][] = [
      [0, 100, 50],
      [120, 100, 50],
      [240, 100, 50],
      [30, 80, 60],
      [200, 50, 30]
    ];
    for (const [h, s, l] of cases) {
      const [r, g, b] = hslToRgb(h, s, l);
      const [h2, s2, l2] = rgbToHsl(r, g, b);
      expect(h2).toBeCloseTo(h, -1);
      expect(s2).toBeCloseTo(s, -1);
      expect(l2).toBeCloseTo(l, -1);
    }
  });
});

describe("rgbToHex", () => {
  it("검정", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
  });

  it("흰색", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
  });

  it("빨강", () => {
    expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
  });

  it("ColorPicker에서 사용하는 패턴: hslToRgb → rgbToHex", () => {
    // ColorPicker.tsx:147 — rgbToHex(...hslToRgb(h, s, l))
    expect(rgbToHex(...hslToRgb(210, 60, 45))).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("hexToRgb", () => {
  it("6자리 hex (#ff0000)", () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
  });

  it("3자리 shorthand (#f00)", () => {
    expect(hexToRgb("#f00")).toEqual([255, 0, 0]);
  });

  it("4자리 RGBA shorthand (#f00f) — alpha 무시", () => {
    expect(hexToRgb("#f00f")).toEqual([255, 0, 0]);
  });

  it("8자리 RRGGBBAA (#ff000080) — alpha 무시", () => {
    expect(hexToRgb("#ff000080")).toEqual([255, 0, 0]);
  });

  it("# 없는 hex도 처리", () => {
    expect(hexToRgb("ff0000")).toEqual([255, 0, 0]);
  });

  it("빈 문자열이면 [0,0,0] 반환", () => {
    expect(hexToRgb("")).toEqual([0, 0, 0]);
  });

  it("null/undefined는 [0,0,0] 반환", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(hexToRgb(null as any)).toEqual([0, 0, 0]);
  });

  it("지원하지 않는 길이는 에러를 던진다", () => {
    expect(() => hexToRgb("#abcde")).toThrow("Unsupported hex format");
  });

  it("잘못된 hex 문자는 [0,0,0] 반환", () => {
    expect(hexToRgb("#gggggg")).toEqual([0, 0, 0]);
  });
});

// --- Parsing & Formatting ---

describe("parseColor", () => {
  it("hex 문자열 파싱", () => {
    const result = parseColor("#ff0000");
    expect(result.h).toBeCloseTo(0, -1);
    expect(result.s).toBeCloseTo(100, -1);
    expect(result.l).toBeCloseTo(50, -1);
    expect(result.a).toBe(1);
  });

  it("rgb() 문자열 파싱", () => {
    const result = parseColor("rgb(0, 128, 255)");
    expect(result.a).toBe(1);
    expect(result.s).toBeGreaterThan(0);
  });

  it("rgba() 문자열 파싱 — alpha 포함", () => {
    const result = parseColor("rgba(255, 0, 0, 0.5)");
    expect(result.h).toBeCloseTo(0, -1);
    expect(result.a).toBe(0.5);
  });

  it("hsl() 문자열 파싱", () => {
    const result = parseColor("hsl(120, 100%, 50%)");
    expect(result.h).toBe(120);
    expect(result.s).toBe(100);
    expect(result.l).toBe(50);
  });

  it("hsla() 문자열 파싱", () => {
    const result = parseColor("hsla(240, 80%, 60%, 0.7)");
    expect(result.h).toBe(240);
    expect(result.a).toBe(0.7);
  });

  it("빈 문자열이면 흰색 기본값 반환", () => {
    expect(parseColor("")).toEqual({ h: 0, s: 0, l: 100, a: 1 });
  });

  it("인식할 수 없는 문자열이면 흰색 기본값 반환", () => {
    expect(parseColor("not-a-color")).toEqual({ h: 0, s: 0, l: 100, a: 1 });
  });

  it("ColorPicker 실제 사용: value prop으로 들어오는 패턴", () => {
    // hex
    const hex = parseColor("#3498db");
    expect(hex.a).toBe(1);
    // rgba from formatColor output
    const rgba = parseColor("rgba(52, 152, 219, 0.8)");
    expect(rgba.a).toBe(0.8);
  });
});

describe("formatColor", () => {
  it("hex 포맷", () => {
    expect(formatColor({ h: 0, s: 100, l: 50, a: 1 }, "hex")).toBe("#ff0000");
  });

  it("rgba 포맷 — alpha 1이면 rgb()", () => {
    const result = formatColor({ h: 0, s: 100, l: 50, a: 1 }, "rgba");
    expect(result).toBe("rgb(255, 0, 0)");
  });

  it("rgba 포맷 — alpha < 1이면 rgba()", () => {
    const result = formatColor({ h: 0, s: 100, l: 50, a: 0.5 }, "rgba");
    expect(result).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("hsla 포맷 — alpha 1이면 hsl()", () => {
    const result = formatColor({ h: 120, s: 80, l: 60, a: 1 }, "hsla");
    expect(result).toBe("hsl(120, 80%, 60%)");
  });

  it("hsla 포맷 — alpha < 1이면 hsla()", () => {
    const result = formatColor({ h: 120, s: 80, l: 60, a: 0.3 }, "hsla");
    expect(result).toBe("hsla(120, 80%, 60%, 0.3)");
  });

  it("parseColor → formatColor round-trip", () => {
    const original = "#3498db";
    const parsed = parseColor(original);
    const formatted = formatColor(parsed, "hex");
    // hex round-trip은 rounding으로 약간 다를 수 있지만 유사해야 함
    const reparsed = parseColor(formatted);
    expect(reparsed.h).toBeCloseTo(parsed.h, -1);
    expect(reparsed.s).toBeCloseTo(parsed.s, -1);
    expect(reparsed.l).toBeCloseTo(parsed.l, -1);
  });
});

// --- Geometry helpers ---

describe("cartesianToAngle", () => {
  it("오른쪽 (1, 0) → 0도", () => {
    expect(cartesianToAngle(1, 0)).toBeCloseTo(0);
  });

  it("아래쪽 (0, 1) → 90도", () => {
    expect(cartesianToAngle(0, 1)).toBeCloseTo(90);
  });

  it("왼쪽 (-1, 0) → 180도", () => {
    expect(cartesianToAngle(-1, 0)).toBeCloseTo(180);
  });

  it("위쪽 (0, -1) → 270도", () => {
    expect(cartesianToAngle(0, -1)).toBeCloseTo(270);
  });
});

describe("polarToCartesian", () => {
  it("0도에서 x축 방향으로 이동", () => {
    const p = polarToCartesian(0, 0, 10, 0);
    expect(p.x).toBeCloseTo(10);
    expect(p.y).toBeCloseTo(0);
  });

  it("90도에서 y축 방향으로 이동", () => {
    const p = polarToCartesian(0, 0, 10, 90);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(10);
  });

  it("중심 오프셋 반영", () => {
    const p = polarToCartesian(100, 100, 10, 0);
    expect(p.x).toBeCloseTo(110);
    expect(p.y).toBeCloseTo(100);
  });
});

describe("pointInTriangle", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 10, y: 0 };
  const c = { x: 5, y: 10 };

  it("삼각형 내부의 점 → true", () => {
    expect(pointInTriangle({ x: 5, y: 3 }, a, b, c)).toBe(true);
  });

  it("삼각형 외부의 점 → false", () => {
    expect(pointInTriangle({ x: 20, y: 20 }, a, b, c)).toBe(false);
  });

  it("꼭짓점 위의 점 → true", () => {
    expect(pointInTriangle(a, a, b, c)).toBe(true);
  });
});

describe("clampToTriangle", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 10, y: 0 };
  const c = { x: 5, y: 10 };

  it("내부 점은 그대로 반환", () => {
    const p = { x: 5, y: 3 };
    expect(clampToTriangle(p, a, b, c)).toEqual(p);
  });

  it("외부 점은 가장 가까운 변 위의 점으로 클램프", () => {
    const p = { x: 20, y: 0 };
    const result = clampToTriangle(p, a, b, c);
    expect(pointInTriangle(result, a, b, c)).toBe(true);
  });
});

describe("getTriangleVertices / slToTrianglePoint / trianglePointToSL", () => {
  // ColorPicker에서 사용하는 실제 값
  const CX = 110;
  const CY = 110;
  const RADIUS = 84;

  it("getTriangleVertices가 3개의 꼭짓점을 반환한다", () => {
    const vertices = getTriangleVertices(CX, CY, RADIUS, 0);
    expect(vertices).toHaveLength(3);
    vertices.forEach(v => {
      expect(typeof v.x).toBe("number");
      expect(typeof v.y).toBe("number");
    });
  });

  it("slToTrianglePoint → trianglePointToSL round-trip", () => {
    const [v0, v1, v2] = getTriangleVertices(CX, CY, RADIUS, 0);

    const cases = [
      { s: 100, l: 50 }, // 순수 hue
      { s: 0, l: 100 }, // 흰색
      { s: 0, l: 0 }, // 검정
      { s: 50, l: 50 } // 중간값
    ];

    for (const { s, l } of cases) {
      const pt = slToTrianglePoint(s, l, v0, v1, v2);
      const result = trianglePointToSL(pt, v0, v1, v2);
      expect(result.s).toBeCloseTo(s, -1);
      expect(result.l).toBeCloseTo(l, -1);
    }
  });

  it("ColorPicker 실제 패턴: hue 변경 시 삼각형 좌표 재계산", () => {
    const hues = [0, 90, 180, 270];
    for (const hue of hues) {
      const [v0, v1, v2] = getTriangleVertices(CX, CY, RADIUS, hue);
      const pt = slToTrianglePoint(80, 50, v0, v1, v2);
      // 변환된 점이 삼각형 내부에 있어야 함
      expect(pointInTriangle(pt, v0, v1, v2)).toBe(true);
    }
  });
});
