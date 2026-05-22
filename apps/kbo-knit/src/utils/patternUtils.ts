import type {
  KnitPattern,
  PatternViewOrigin,
  StitchDefinition,
  StitchIcon
} from "../types/game.types";

export const FALLBACK_STITCH_ID = "knit";
export const MIN_PATTERN_SIZE = 1;
export const MAX_PATTERN_HEIGHT = 48;
export const DEFAULT_PATTERN_CELL_SIZE = 8;
export const MIN_PATTERN_CELL_SIZE = 6;
export const MAX_PATTERN_CELL_SIZE = 24;
const MAX_CUSTOM_STITCH_SYMBOL_LENGTH = 8;
const MAX_CUSTOM_ICON_PATHS = 8;
const MAX_CUSTOM_ICON_PATH_LENGTH = 600;
const PATH_D_ATTRIBUTE_RE = /\bd\s*=\s*["']([^"']+)["']/gi;
const SVG_PATH_RE = /^[MmZzLlHhVvCcSsQqTtAaEe0-9.,+\-\s]+$/;

const STITCH_ICONS: StitchIcon[] = [
  "text",
  "purl",
  "yarnOver",
  "k2tog",
  "ssk",
  "centerDoubleDecrease",
  "cable",
  "custom"
];

export const CUSTOM_STITCH_ICON_OPTIONS: {
  value: StitchIcon;
  label: string;
}[] = [
  { value: "text", label: "문자" },
  { value: "purl", label: "안뜨기" },
  { value: "yarnOver", label: "바늘비우기" },
  { value: "k2tog", label: "오른쪽 모아뜨기" },
  { value: "ssk", label: "왼쪽 모아뜨기" },
  { value: "centerDoubleDecrease", label: "중심 모아뜨기" },
  { value: "cable", label: "꽈배기" },
  { value: "custom", label: "개인 SVG" }
];

export const BUILT_IN_STITCHES: StitchDefinition[] = [
  { id: FALLBACK_STITCH_ID, label: "겉뜨기", span: 1 },
  { id: "purl", label: "안뜨기", span: 1 },
  { id: "yarnOver", label: "바늘비우기", span: 1 },
  { id: "k2tog", label: "오른쪽 2코 모아뜨기", span: 2 },
  { id: "ssk", label: "왼쪽 2코 모아뜨기", span: 2 },
  { id: "cableLeft2", label: "2코 왼꽈배기", span: 2 },
  { id: "cableRight2", label: "2코 오른꽈배기", span: 2 },
  { id: "centerDoubleDecrease", label: "중심 3코 모아뜨기", span: 3 },
  { id: "cableLeft3", label: "3코 왼꽈배기", span: 3 },
  { id: "cableRight3", label: "3코 오른꽈배기", span: 3 }
];

export const DEFAULT_KNIT_PATTERN: KnitPattern = {
  width: 12,
  height: 2,
  cells: Array.from({ length: 2 }, () =>
    Array.from({ length: 12 }, () => FALLBACK_STITCH_ID)
  ),
  customStitches: []
};

function clampSize(value: unknown, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(MIN_PATTERN_SIZE, Math.floor(n)));
}

function clampWidth(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(MIN_PATTERN_SIZE, Math.floor(n));
}

function clampSpan(value: unknown, fallback = 1): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(MIN_PATTERN_SIZE, Math.floor(n));
}

function sanitizeStitchIcon(value: unknown): StitchIcon {
  return STITCH_ICONS.includes(value as StitchIcon)
    ? (value as StitchIcon)
    : "text";
}

function getCustomIconLabel(icon: StitchIcon): string {
  return (
    CUSTOM_STITCH_ICON_OPTIONS.find(option => option.value === icon)?.label ??
    "기호"
  );
}

export function clampPatternCellSize(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_PATTERN_CELL_SIZE;
  return Math.min(
    MAX_PATTERN_CELL_SIZE,
    Math.max(MIN_PATTERN_CELL_SIZE, Math.floor(n))
  );
}

function sanitizeSymbol(value: string): string {
  return Array.from(value.trim().replace(/\s+/g, " "))
    .slice(0, MAX_CUSTOM_STITCH_SYMBOL_LENGTH)
    .join("");
}

function sanitizeIconPath(path: string): string {
  const normalized = path.trim().replace(/\s+/g, " ");
  if (!normalized || normalized.length > MAX_CUSTOM_ICON_PATH_LENGTH) return "";
  return SVG_PATH_RE.test(normalized) ? normalized : "";
}

function sanitizeCustomIconPaths(value: unknown): string[] {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? (() => {
          const matches = Array.from(value.matchAll(PATH_D_ATTRIBUTE_RE)).map(
            match => match[1]
          );
          return matches.length > 0 ? matches : value.split(/\n+/);
        })()
      : [];

  const seen = new Set<string>();
  return values.reduce<string[]>((acc, rawPath) => {
    if (acc.length >= MAX_CUSTOM_ICON_PATHS || typeof rawPath !== "string") {
      return acc;
    }

    const path = sanitizeIconPath(rawPath);
    if (!path || seen.has(path)) return acc;

    seen.add(path);
    acc.push(path);
    return acc;
  }, []);
}

function sanitizeCustomStitches(
  stitches: StitchDefinition[] | undefined
): StitchDefinition[] {
  if (!Array.isArray(stitches)) return [];

  const seen = new Set(BUILT_IN_STITCHES.map(s => s.id));
  return stitches.reduce<StitchDefinition[]>((acc, stitch) => {
    const id = typeof stitch.id === "string" ? stitch.id.trim() : "";
    const symbol =
      typeof stitch.symbol === "string" ? sanitizeSymbol(stitch.symbol) : "";
    const label =
      typeof stitch.label === "string" ? stitch.label.trim() || symbol : symbol;
    const span = clampSpan(stitch.span);
    const icon = sanitizeStitchIcon(stitch.icon);
    const customIconPaths =
      icon === "custom" ? sanitizeCustomIconPaths(stitch.customIconPaths) : [];

    if (
      !id ||
      !symbol ||
      seen.has(id) ||
      (icon === "custom" && customIconPaths.length === 0)
    ) {
      return acc;
    }

    seen.add(id);
    acc.push({
      id,
      label,
      symbol,
      span,
      ...(icon !== "text" ? { icon } : {}),
      ...(customIconPaths.length > 0 ? { customIconPaths } : {})
    });
    return acc;
  }, []);
}

export function normalizeKnitPattern(
  pattern?: Partial<KnitPattern> | null
): KnitPattern {
  const width = clampWidth(pattern?.width, DEFAULT_KNIT_PATTERN.width);
  const height = clampSize(
    pattern?.height,
    MAX_PATTERN_HEIGHT,
    DEFAULT_KNIT_PATTERN.height
  );

  return {
    width,
    height,
    cells: Array.from({ length: height }, (_, rowIndex) =>
      Array.from({ length: width }, (_, colIndex) => {
        const stitchId = pattern?.cells?.[rowIndex]?.[colIndex];
        return typeof stitchId === "string" && stitchId.trim()
          ? stitchId
          : FALLBACK_STITCH_ID;
      })
    ),
    customStitches: sanitizeCustomStitches(pattern?.customStitches)
  };
}

export function getStitches(pattern: KnitPattern): StitchDefinition[] {
  return [...BUILT_IN_STITCHES, ...pattern.customStitches];
}

export function getStitchDefinition(
  pattern: KnitPattern,
  stitchId: string
): StitchDefinition {
  return (
    getStitches(pattern).find(stitch => stitch.id === stitchId) ??
    BUILT_IN_STITCHES[0]
  );
}

export function getPatternStitchesForRow(
  pattern: KnitPattern,
  rowIndex: number
): StitchDefinition[] {
  const normalized = normalizeKnitPattern(pattern);
  const patternRow =
    normalized.cells[rowIndex % normalized.height] ?? normalized.cells[0];

  return patternRow.map(stitchId => getStitchDefinition(normalized, stitchId));
}

export type PatternCell = {
  stitch: StitchDefinition;
  colIndex: number;
  span: number;
};

export function getPatternCellsForRow(
  pattern: KnitPattern,
  rowIndex: number
): PatternCell[] {
  const normalized = normalizeKnitPattern(pattern);
  const patternRow =
    normalized.cells[rowIndex % normalized.height] ?? normalized.cells[0];
  const cells: PatternCell[] = [];

  for (let colIndex = 0; colIndex < normalized.width; ) {
    const stitch = getStitchDefinition(normalized, patternRow[colIndex]);
    const span =
      stitch.span > 1 && colIndex + stitch.span <= normalized.width
        ? stitch.span
        : 1;
    cells.push({
      stitch:
        span === stitch.span
          ? stitch
          : getStitchDefinition(normalized, FALLBACK_STITCH_ID),
      colIndex,
      span
    });
    colIndex += span;
  }

  return cells;
}

export function resizeKnitPattern(
  pattern: KnitPattern,
  width: number,
  height: number
): KnitPattern {
  return normalizeKnitPattern({
    ...pattern,
    width,
    height
  });
}

export function updateKnitPatternCell(
  pattern: KnitPattern,
  rowIndex: number,
  colIndex: number,
  stitchId: string
): KnitPattern {
  const base = normalizeKnitPattern(pattern);
  const stitch = getStitchDefinition(base, stitchId);
  const width = Math.max(base.width, colIndex + stitch.span);

  const normalized =
    width === base.width ? base : resizeKnitPattern(base, width, base.height);
  if (
    rowIndex < 0 ||
    rowIndex >= normalized.height ||
    colIndex < 0 ||
    colIndex >= normalized.width
  ) {
    return normalized;
  }

  return {
    ...normalized,
    cells: normalized.cells.map((row, r) =>
      r === rowIndex
        ? row.map((cell, c) => (c === colIndex ? stitchId : cell))
        : row
    )
  };
}

export function addCustomStitch(
  pattern: KnitPattern,
  value: string,
  spanValue: unknown = 1,
  iconValue: unknown = "text",
  customIconPathValue: unknown = ""
): { pattern: KnitPattern; stitchId: string } | null {
  const icon = sanitizeStitchIcon(iconValue);
  const customLabel = sanitizeSymbol(value);
  const customIconPaths =
    icon === "custom" ? sanitizeCustomIconPaths(customIconPathValue) : [];
  const symbol =
    icon === "text" ? customLabel : customLabel || getCustomIconLabel(icon);
  if (!symbol || (icon === "custom" && customIconPaths.length === 0)) {
    return null;
  }

  const normalized = normalizeKnitPattern(pattern);
  const span = clampSpan(spanValue);
  const customIconKey = customIconPaths.join("|");
  const existing = getStitches(normalized).find(
    stitch =>
      (stitch.symbol ?? stitch.label).toLowerCase() === symbol.toLowerCase() &&
      stitch.span === span &&
      sanitizeStitchIcon(stitch.icon) === icon &&
      (icon !== "custom" ||
        sanitizeCustomIconPaths(stitch.customIconPaths).join("|") ===
          customIconKey)
  );
  if (existing) return { pattern: normalized, stitchId: existing.id };

  const base =
    `${symbol}-${icon}-${span}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "stitch";
  const ids = new Set(getStitches(normalized).map(stitch => stitch.id));
  let id = `custom-${base}`;
  let n = 2;
  while (ids.has(id)) {
    id = `custom-${base}-${n}`;
    n += 1;
  }

  return {
    pattern: {
      ...normalized,
      customStitches: [
        ...normalized.customStitches,
        {
          id,
          label: span > 1 ? `${symbol} (${span}코)` : symbol,
          symbol,
          ...(icon !== "text" ? { icon } : {}),
          ...(customIconPaths.length > 0 ? { customIconPaths } : {}),
          span
        }
      ]
    },
    stitchId: id
  };
}

export function removeCustomStitch(
  pattern: KnitPattern,
  stitchId: string
): KnitPattern {
  const normalized = normalizeKnitPattern(pattern);
  return {
    ...normalized,
    customStitches: normalized.customStitches.filter(
      stitch => stitch.id !== stitchId
    )
  };
}

function parseHexColor(color: string): [number, number, number] | null {
  const hex = color.trim().replace(/^#/, "");
  const expanded =
    hex.length === 3
      ? hex
          .split("")
          .map(ch => `${ch}${ch}`)
          .join("")
      : hex;

  if (!/^[0-9a-f]{6}$/i.test(expanded)) return null;

  return [
    parseInt(expanded.slice(0, 2), 16),
    parseInt(expanded.slice(2, 4), 16),
    parseInt(expanded.slice(4, 6), 16)
  ];
}

export function getReadableTextColor(background: string): string {
  const rgb = parseHexColor(background);
  if (!rgb) return "#111111";

  const [r, g, b] = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.48 ? "#111111" : "#ffffff";
}

export function darkenColor(color: string, percent: number): string {
  const rgb = parseHexColor(color);
  if (!rgb) return color;

  const ratio = Math.max(0, Math.min(100, percent)) / 100;
  const [r, g, b] = rgb.map(channel => Math.round(channel * (1 - ratio)));
  return `#${[r, g, b]
    .map(channel => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function getVisualRowIndex(
  rowIndex: number,
  totalRows: number,
  origin: PatternViewOrigin
): number {
  return origin === "bottom" ? totalRows - 1 - rowIndex : rowIndex;
}

export function getMarkerDarkenAmount(
  index: number,
  lastIndex: number
): number {
  if (index % 10 === 0) return 15;
  if (index === 1 || index === lastIndex) return 10;
  if (index % 5 === 0) return 10;
  return 0;
}
