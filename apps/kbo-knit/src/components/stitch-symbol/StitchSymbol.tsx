import type { StitchDefinition, StitchIcon } from "../../types/game.types";
import * as s from "./StitchSymbol.css";

type Props = {
  stitch: StitchDefinition;
};

function CableCross({
  direction,
  width
}: {
  direction?: "left" | "right";
  width: number;
}) {
  const start = 8;
  const end = Math.max(start + 12, width - 8);
  const risingPath = `M${start} 20 L${end} 4`;
  const fallingPath = `M${start} 4 L${end} 20`;
  const overPath =
    direction === "right"
      ? fallingPath
      : direction === "left"
        ? risingPath
        : "";
  const underPath = direction === "right" ? risingPath : fallingPath;
  const isDirectional = Boolean(direction);

  return (
    <>
      <path
        d={underPath}
        fill="none"
        stroke="currentColor"
        strokeOpacity={isDirectional ? 0.42 : 1}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d={isDirectional ? overPath : risingPath}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </>
  );
}

function isCustomCable(stitch: StitchDefinition): boolean {
  const symbol = stitch.symbol?.trim().toLowerCase() ?? "";
  return (
    stitch.id.includes("cable") ||
    stitch.label.includes("꽈") ||
    stitch.label.toLowerCase().includes("cable") ||
    symbol === "x" ||
    symbol === "×" ||
    symbol === "c"
  );
}

function getStitchIcon(stitch: StitchDefinition): StitchIcon {
  if (stitch.icon && stitch.icon !== "text") return stitch.icon;

  if (stitch.id === "purl") return "purl";
  if (stitch.id === "yarnOver") return "yarnOver";
  if (stitch.id === "k2tog") return "k2tog";
  if (stitch.id === "ssk") return "ssk";
  if (stitch.id === "centerDoubleDecrease") return "centerDoubleDecrease";
  if (stitch.id.includes("cable") || isCustomCable(stitch)) return "cable";
  return "text";
}

function getCableDirection(
  stitch: StitchDefinition
): "left" | "right" | undefined {
  if (stitch.id.includes("Right")) return "right";
  if (stitch.id.includes("Left")) return "left";
  return undefined;
}

function CustomIconPaths({ paths, span }: { paths: string[]; span: number }) {
  return (
    <g transform={`scale(${span} 1)`}>
      {paths.map((path, index) => (
        <path
          key={`${path}-${index}`}
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

export function StitchSymbol({ stitch }: Props) {
  const span = Math.max(1, stitch.span);
  const width = span * 24;
  const viewBox = `0 0 ${width} 24`;
  const center = width / 2;
  const icon = getStitchIcon(stitch);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={s.symbol}
      viewBox={viewBox}
    >
      {icon === "purl" && (
        <path
          d={`M${center - 6} 12 H${center + 6}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.8}
          strokeLinecap="round"
        />
      )}
      {icon === "yarnOver" && (
        <circle
          cx={center}
          cy={12}
          r={6.6}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
        />
      )}
      {icon === "k2tog" && (
        <>
          <path
            d={`M9 20 L${width - 9} 4`}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d={`M${width - 13} 6 H${width - 6} V13`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {icon === "ssk" && (
        <>
          <path
            d={`M9 4 L${width - 9} 20`}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d="M6 13 V6 H13"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {icon === "centerDoubleDecrease" && (
        <>
          <path
            d={`M10 20 L${center} 4 L${width - 10} 20`}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M${center} 4 V20`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </>
      )}
      {icon === "cable" && (
        <CableCross direction={getCableDirection(stitch)} width={width} />
      )}
      {icon === "custom" && stitch.customIconPaths && (
        <CustomIconPaths paths={stitch.customIconPaths} span={span} />
      )}
      {icon === "text" && stitch.symbol && (
        <text
          x={center}
          y={15}
          className={s.text}
          textAnchor="middle"
          fill="currentColor"
        >
          {stitch.symbol}
        </text>
      )}
    </svg>
  );
}
