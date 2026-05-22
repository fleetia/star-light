import { useMemo, useState } from "react";
import { Box } from "@star-light/components/Box";
import { Button } from "@star-light/components/Button";
import { RangeInput } from "@star-light/components/RangeInput";
import { RadioGroup } from "@star-light/components/RadioGroup";
import { TextInput } from "@star-light/components/TextInput";

import type {
  KnitPattern,
  PatternViewOrigin,
  StitchIcon
} from "../../types/game.types";
import { StitchSymbol } from "../stitch-symbol/StitchSymbol";
import {
  addCustomStitch,
  BUILT_IN_STITCHES,
  CUSTOM_STITCH_ICON_OPTIONS,
  darkenColor,
  FALLBACK_STITCH_ID,
  getMarkerDarkenAmount,
  getPatternCellsForRow,
  getStitches,
  getVisualRowIndex,
  MAX_PATTERN_CELL_SIZE,
  MAX_PATTERN_HEIGHT,
  MIN_PATTERN_CELL_SIZE,
  MIN_PATTERN_SIZE,
  removeCustomStitch,
  resizeKnitPattern,
  updateKnitPatternCell
} from "../../utils/patternUtils";
import * as s from "./KnitPatternEditor.css";

type Props = {
  pattern: KnitPattern;
  cellSize: number;
  viewOrigin: PatternViewOrigin;
  onChange: (pattern: KnitPattern) => void;
  onCellSizeChange: (size: number) => void;
  onViewOriginChange: (origin: PatternViewOrigin) => void;
};

function clampDraft(value: string, fallback: number): number {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(MIN_PATTERN_SIZE, n);
}

function clampHeightDraft(value: string, fallback: number): number {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(MAX_PATTERN_HEIGHT, Math.max(MIN_PATTERN_SIZE, n));
}

export function KnitPatternEditor({
  pattern,
  cellSize,
  viewOrigin,
  onChange,
  onCellSizeChange,
  onViewOriginChange
}: Props) {
  const [selectedStitchId, setSelectedStitchId] = useState(FALLBACK_STITCH_ID);
  const [widthDraft, setWidthDraft] = useState<string | null>(null);
  const [heightDraft, setHeightDraft] = useState<string | null>(null);
  const [customDraft, setCustomDraft] = useState("");
  const [customSpanDraft, setCustomSpanDraft] = useState("1");
  const [customIcon, setCustomIcon] = useState<StitchIcon>("text");
  const [customIconPathDraft, setCustomIconPathDraft] = useState("");
  const stitches = useMemo(() => getStitches(pattern), [pattern]);
  const gridTemplateColumns = `2.8rem repeat(${pattern.width}, ${cellSize}px)`;
  const markerColumns = Array.from({ length: pattern.width }, (_, index) => {
    const colNumber = index + 1;
    return {
      colNumber,
      darkenAmount: getMarkerDarkenAmount(colNumber, pattern.width)
    };
  });
  const visualRows = Array.from({ length: pattern.height }, (_, rowIndex) =>
    getVisualRowIndex(rowIndex, pattern.height, viewOrigin)
  );
  const canAddCustom =
    customIcon === "text"
      ? customDraft.trim().length > 0
      : customIcon === "custom"
        ? customIconPathDraft.trim().length > 0
        : true;

  const applySize = () => {
    const width = clampDraft(
      widthDraft ?? String(pattern.width),
      pattern.width
    );
    const height = clampHeightDraft(
      heightDraft ?? String(pattern.height),
      pattern.height
    );
    setWidthDraft(null);
    setHeightDraft(null);
    if (width !== pattern.width || height !== pattern.height) {
      onChange(resizeKnitPattern(pattern, width, height));
    }
  };

  const handleAddCustom = () => {
    const result = addCustomStitch(
      pattern,
      customDraft,
      customSpanDraft,
      customIcon,
      customIconPathDraft
    );
    if (!result) return;
    setCustomDraft("");
    setCustomSpanDraft("1");
    setCustomIcon("text");
    setCustomIconPathDraft("");
    setSelectedStitchId(result.stitchId);
    onChange(result.pattern);
  };

  const handleRemoveCustom = (stitchId: string) => {
    if (selectedStitchId === stitchId) setSelectedStitchId(FALLBACK_STITCH_ID);
    onChange(removeCustomStitch(pattern, stitchId));
  };

  return (
    <Box title="뜨개 패턴" className={s.group}>
      <div className={s.controls}>
        <TextInput
          label="가로 코 수"
          type="number"
          min={MIN_PATTERN_SIZE}
          value={widthDraft ?? String(pattern.width)}
          onChange={setWidthDraft}
          onBlur={applySize}
          className={s.sizeInput}
        />
        <TextInput
          label="세로 단 수"
          type="number"
          min={MIN_PATTERN_SIZE}
          max={MAX_PATTERN_HEIGHT}
          value={heightDraft ?? String(pattern.height)}
          onChange={setHeightDraft}
          onBlur={applySize}
          className={s.sizeInput}
        />
        <div className={s.zoom}>
          <RangeInput
            label="칸 크기"
            min={MIN_PATTERN_CELL_SIZE}
            max={MAX_PATTERN_CELL_SIZE}
            step={1}
            value={cellSize}
            displayValue={`${cellSize}px`}
            onChange={onCellSizeChange}
          />
        </div>
        <div className={s.viewMode}>
          <RadioGroup
            name="pattern-view-origin"
            value={viewOrigin}
            onChange={value => onViewOriginChange(value as PatternViewOrigin)}
            options={[
              { value: "bottom", label: "아래에서부터 보기" },
              { value: "top", label: "위에서부터 보기" }
            ]}
          />
        </div>
      </div>

      <div className={s.stitchBar} aria-label="뜨개 기호">
        {stitches.map(stitch => {
          const isCustom = !BUILT_IN_STITCHES.some(s => s.id === stitch.id);
          return (
            <span key={stitch.id} className={s.customStitch}>
              <button
                type="button"
                className={s.stitchButton}
                aria-pressed={selectedStitchId === stitch.id}
                onClick={() => setSelectedStitchId(stitch.id)}
              >
                <span>{stitch.label}</span>
                <span className={s.stitchSymbol}>
                  <StitchSymbol stitch={stitch} />
                </span>
              </button>
              {isCustom && (
                <button
                  type="button"
                  className={s.deleteButton}
                  aria-label={`${stitch.label} 삭제`}
                  onClick={() => handleRemoveCustom(stitch.id)}
                >
                  삭제
                </button>
              )}
            </span>
          );
        })}
      </div>

      <div className={s.iconPicker} aria-label="등록할 아이콘">
        {CUSTOM_STITCH_ICON_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            className={s.iconButton}
            aria-label={`${option.label} 아이콘`}
            aria-pressed={customIcon === option.value}
            onClick={() => setCustomIcon(option.value)}
          >
            <span className={s.iconPreview}>
              <StitchSymbol
                stitch={{
                  id: `preview-${option.value}`,
                  label: option.label,
                  symbol: option.value === "text" ? "A" : option.label,
                  icon: option.value,
                  ...(option.value === "custom"
                    ? { customIconPaths: ["M5 19 C8 5 16 5 19 19"] }
                    : {}),
                  span:
                    option.value === "centerDoubleDecrease" ||
                    option.value === "cable" ||
                    option.value === "custom"
                      ? 3
                      : option.value === "text" ||
                          option.value === "purl" ||
                          option.value === "yarnOver"
                        ? 1
                        : 2
                }}
              />
            </span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <div className={s.addRow}>
        <TextInput
          label="기호 이름"
          value={customDraft}
          onChange={setCustomDraft}
          className={s.addInput}
        />
        <TextInput
          label="기호 코 수"
          type="number"
          min={MIN_PATTERN_SIZE}
          value={customSpanDraft}
          onChange={setCustomSpanDraft}
          className={s.spanInput}
        />
        {customIcon === "custom" && (
          <TextInput
            label="SVG path"
            placeholder='M5 19 C8 5 16 5 19 19 또는 <path d="..." />'
            value={customIconPathDraft}
            onChange={setCustomIconPathDraft}
            className={s.pathInput}
          />
        )}
        <Button size="sm" onClick={handleAddCustom} disabled={!canAddCustom}>
          추가
        </Button>
      </div>

      <div className={s.gridWrap}>
        <div className={s.grid}>
          {visualRows.map(rowIndex => {
            const rowNumber = rowIndex + 1;
            const rowMarkerDarken = getMarkerDarkenAmount(
              rowNumber,
              pattern.height
            );
            return (
              <div
                key={rowIndex}
                className={s.row}
                style={{ gridTemplateColumns }}
              >
                <span
                  className={s.rowNumber}
                  style={{
                    background:
                      rowMarkerDarken > 0
                        ? darkenColor("#ffffff", rowMarkerDarken)
                        : undefined,
                    height: cellSize
                  }}
                >
                  {rowMarkerDarken > 0 ? rowNumber : ""}
                </span>
                {getPatternCellsForRow(pattern, rowIndex).map(
                  ({ stitch, colIndex, span }) => {
                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        type="button"
                        className={s.cell}
                        style={{ gridColumn: `span ${span}`, height: cellSize }}
                        title={stitch.label}
                        aria-label={`${rowIndex + 1}단 ${colIndex + 1}코 ${stitch.label}`}
                        onClick={() =>
                          onChange(
                            updateKnitPatternCell(
                              pattern,
                              rowIndex,
                              colIndex,
                              selectedStitchId
                            )
                          )
                        }
                      >
                        <StitchSymbol stitch={stitch} />
                      </button>
                    );
                  }
                )}
              </div>
            );
          })}
          <div
            className={s.footerRow}
            style={{ gridTemplateColumns }}
            aria-hidden="true"
          >
            <span className={s.corner} />
            {markerColumns.map(({ colNumber, darkenAmount }) => (
              <span
                key={colNumber}
                className={s.colNumber}
                style={{
                  background:
                    darkenAmount > 0
                      ? darkenColor("#ffffff", darkenAmount)
                      : undefined
                }}
              >
                {darkenAmount > 0 ? colNumber : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}
