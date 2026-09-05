export type HSLA = { h: number; s: number; l: number; a: number };
export type ColorFormat = "hex" | "rgba" | "hsla";

// --- Color conversion ---

export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  const s1 = s / 100;
  const l1 = l / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const r1 = r / 255,
    g1 = g / 255,
    b1 = b / 255;
  const max = Math.max(r1, g1, b1),
    min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r1) h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) * 60;
  else if (max === g1) h = ((b1 - r1) / d + 2) * 60;
  else h = ((r1 - g1) / d + 4) * 60;
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  if (!hex || typeof hex !== "string") {
    return [0, 0, 0];
  }
  const h = hex.replace("#", "");
  let full: string;
  if (h.length === 3) {
    // #RGB -> #RRGGBB
    full = h
      .split("")
      .map(c => c + c)
      .join("");
  } else if (h.length === 4) {
    // #RGBA -> #RRGGBB (ignore alpha)
    full = h
      .slice(0, 3)
      .split("")
      .map(c => c + c)
      .join("");
  } else if (h.length === 6) {
    full = h;
  } else if (h.length === 8) {
    // #RRGGBBAA -> #RRGGBB (ignore alpha)
    full = h.slice(0, 6);
  } else {
    throw new Error(
      `Unsupported hex format: "${hex}". Expected 3, 4, 6, or 8 hex digits.`
    );
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return [0, 0, 0];
  }
  return [
    parseInt(full.substring(0, 2), 16),
    parseInt(full.substring(2, 4), 16),
    parseInt(full.substring(4, 6), 16)
  ];
}

// --- Parsing ---

export function parseColor(str: string): HSLA {
  if (!str) return { h: 0, s: 0, l: 100, a: 1 };

  // rgba / rgb
  const rgbaMatch = str.match(
    /rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)/
  );
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const [h, s, l] = rgbToHsl(+r, +g, +b);
    return { h, s, l, a: a != null ? +a : 1 };
  }

  // hsla / hsl
  const hslaMatch = str.match(
    /hsla?\(\s*([\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\s*\)/
  );
  if (hslaMatch) {
    const [, h, s, l, a] = hslaMatch;
    return { h: +h, s: +s, l: +l, a: a != null ? +a : 1 };
  }

  // hex
  if (str.startsWith("#")) {
    const [r, g, b] = hexToRgb(str);
    const [h, s, l] = rgbToHsl(r, g, b);
    return { h, s, l, a: 1 };
  }

  return { h: 0, s: 0, l: 100, a: 1 };
}

export function formatColor(hsla: HSLA, format: ColorFormat): string {
  const { h, s, l, a } = hsla;
  if (format === "hsla") {
    return a < 1
      ? `hsla(${h}, ${s}%, ${l}%, ${round2(a)})`
      : `hsl(${h}, ${s}%, ${l}%)`;
  }
  const [r, g, b] = hslToRgb(h, s, l);
  if (format === "rgba") {
    return a < 1
      ? `rgba(${r}, ${g}, ${b}, ${round2(a)})`
      : `rgb(${r}, ${g}, ${b})`;
  }
  // hex — no alpha support, just rgb
  return rgbToHex(r, g, b);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// --- Geometry helpers ---

export type Point = { x: number; y: number };

export function cartesianToAngle(x: number, y: number): number {
  const rad = Math.atan2(y, x);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Barycentric hit-test */
export function pointInTriangle(
  p: Point,
  a: Point,
  b: Point,
  c: Point
): boolean {
  const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / d;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / d;
  const w = 1 - u - v;
  return u >= -0.01 && v >= -0.01 && w >= -0.01;
}

/** Clamp a point to the nearest point inside the triangle */
export function clampToTriangle(p: Point, a: Point, b: Point, c: Point): Point {
  if (pointInTriangle(p, a, b, c)) return p;
  const edges: [Point, Point][] = [
    [a, b],
    [b, c],
    [c, a]
  ];
  let best = a;
  let bestDist = Infinity;
  for (const [e0, e1] of edges) {
    const pt = closestPointOnSegment(p, e0, e1);
    const dx = pt.x - p.x,
      dy = pt.y - p.y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = pt;
    }
  }
  return best;
}

function closestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x,
    dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return a;
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2)
  );
  return { x: a.x + t * dx, y: a.y + t * dy };
}

/** Get triangle vertices for the current hue, given center and radius */
export function getTriangleVertices(
  cx: number,
  cy: number,
  radius: number,
  hueDeg: number
): [Point, Point, Point] {
  const v0 = polarToCartesian(cx, cy, radius, hueDeg - 90);
  const v1 = polarToCartesian(cx, cy, radius, hueDeg + 30);
  const v2 = polarToCartesian(cx, cy, radius, hueDeg + 150);
  return [v0, v1, v2];
}

/** Convert S/L to a point inside the triangle (v0=pure hue, v1=white, v2=black) */
export function slToTrianglePoint(
  s: number,
  l: number,
  v0: Point,
  v1: Point,
  v2: Point
): Point {
  const s1 = s / 100;
  const l1 = l / 100;
  const wWhite = (1 - s1) * l1;
  const wBlack = (1 - s1) * (1 - l1);
  const wHue = s1;
  const total = wWhite + wBlack + wHue || 1;
  return {
    x: (v1.x * wWhite + v2.x * wBlack + v0.x * wHue) / total,
    y: (v1.y * wWhite + v2.y * wBlack + v0.y * wHue) / total
  };
}

/** Convert a point inside the triangle back to S/L */
export function trianglePointToSL(
  p: Point,
  v0: Point,
  v1: Point,
  v2: Point
): { s: number; l: number } {
  const d = (v1.y - v2.y) * (v0.x - v2.x) + (v2.x - v1.x) * (v0.y - v2.y);
  if (Math.abs(d) < 0.001) return { s: 0, l: 50 };
  const wHue =
    ((v1.y - v2.y) * (p.x - v2.x) + (v2.x - v1.x) * (p.y - v2.y)) / d;
  const wWhite =
    ((v2.y - v0.y) * (p.x - v2.x) + (v0.x - v2.x) * (p.y - v2.y)) / d;
  const wBlack = 1 - wHue - wWhite;

  const total = wWhite + wBlack + wHue || 1;
  const s = Math.round(Math.max(0, Math.min(100, (wHue / total) * 100)));
  const l1 = (wWhite + wHue * 0.5) / total;
  const l = Math.round(Math.max(0, Math.min(100, l1 * 100)));
  return { s, l };
}
