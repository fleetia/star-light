import type React from "react";
import classNames from "classnames/bind";

import { PositionGrid } from "@star-light/components/PositionGrid";
import { RangeInput } from "@star-light/components/RangeInput";
import { useTranslation } from "@star-light/components/i18n";
import type { ColorTheme } from "@star-light/components/theme";

import type { GridSettings, Settings } from "../../types";
import { positionToPlaceSelf } from "../../utils/positionToPlaceSelf";
import styles from "../OptionsSidebar.module.scss";

const cx = classNames.bind(styles);

const POSITION_OPTIONS = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center-center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];

type LayoutTabProps = {
  draftGrid: GridSettings;
  draftSettings: Settings;
  draftTheme: ColorTheme;
  setDraftGrid: React.Dispatch<React.SetStateAction<GridSettings>>;
  setDraftSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onGridCssValueChange: (key: string, value: string) => void;
  onMarginChange: (margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }) => void;
};

function LayoutPreview({
  draftGrid,
  draftSettings,
  draftTheme
}: Pick<
  LayoutTabProps,
  "draftGrid" | "draftSettings" | "draftTheme"
>): React.ReactElement {
  const { t } = useTranslation();
  const bgColorValue = draftGrid.background?.color ?? "rgba(255, 255, 255, 1)";
  const iconColorValue = draftGrid.icon?.color ?? "rgba(255, 255, 255, 1)";
  const isHorizontal = draftSettings.iconLayout === "horizontal";
  const cols = draftGrid.columns ?? 5;
  const hCols = draftGrid.horizontalColumns ?? 1;
  const rowCount = draftGrid.rows ?? 3;
  const masonry = draftGrid.masonryColumns ?? 2;
  const gapScale = Math.max(
    1,
    Math.round(parseFloat(String(draftGrid.gap)) * 3)
  );
  const cardGapScale = Math.max(
    1,
    Math.round(parseFloat(String(draftGrid.cardGap)) * 3)
  );

  const folderColor = draftGrid.folder?.color ?? draftTheme.surface;
  const folderAccent = draftGrid.folder?.accent ?? draftTheme.accent;

  const isExpandHorizontal = draftSettings.isExpandView && isHorizontal;
  const mockCols = isHorizontal ? hCols : cols;

  const mockItemSize = isHorizontal
    ? Math.max(20, Math.floor(100 / hCols) - gapScale)
    : Math.max(14, Math.floor(100 / mockCols) - gapScale);

  const renderItem = (i: number, isFolder: boolean) => {
    const bg = isFolder ? folderColor : iconColorValue;
    return (
      <div
        key={i}
        className={cx("mock-item", { "mock-item-h": isHorizontal })}
        style={{ backgroundColor: bg, width: mockItemSize }}
      >
        <div
          className={cx("mock-icon")}
          style={isFolder ? { backgroundColor: folderAccent } : undefined}
        />
        <div className={cx("mock-text")} />
      </div>
    );
  };

  const shouldFill = (fill: boolean) => fill && !isExpandHorizontal;

  const renderCard = (itemCount: number, key: number, fill = false) => (
    <div
      key={key}
      className={cx("mock-card-layout", {
        "mock-card-fill": shouldFill(fill)
      })}
      style={{ backgroundColor: bgColorValue }}
    >
      <div className={cx("mock-card-header")}>
        <div className={cx("mock-breadcrumb")} />
        <div className={cx("mock-route")} />
      </div>
      <div
        className={cx("mock-grid", { "mock-grid-fill": shouldFill(fill) })}
        style={{
          gridTemplateColumns: `repeat(${mockCols}, 1fr)`,
          gap: `${gapScale}px`
        }}
      >
        {Array.from({ length: itemCount }, (_, i) => renderItem(i, i < 2))}
      </div>
    </div>
  );

  const cardItemCounts = isExpandHorizontal
    ? [Math.max(6, hCols * 3), Math.max(4, hCols * 2), Math.max(3, hCols * 2)]
    : [
        Math.min(mockCols * 3, 15),
        Math.min(mockCols * 2, 10),
        Math.min(mockCols * 2, 8)
      ];

  if (draftSettings.isExpandView) {
    return (
      <div className={cx("mockup", "mockup-layout")}>
        <div className={cx("mockup-screen")}>
          <div
            className={cx("mock-masonry")}
            style={{
              columnCount: masonry,
              columnGap: `${cardGapScale}px`,
              placeSelf: positionToPlaceSelf(draftGrid.position)
            }}
          >
            {cardItemCounts.map((count, i) => renderCard(count, i, true))}
          </div>
        </div>
        <span className={cx("mockup-label")}>
          {t("sidebar.layout.preview")}
        </span>
        <span className={cx("mockup-note")}>{t("sidebar.preview.note")}</span>
      </div>
    );
  }

  const scrollItemCount = isHorizontal
    ? Math.min(hCols * 3, 10)
    : Math.min(cols * rowCount, 15);

  return (
    <div className={cx("mockup", "mockup-layout")}>
      <div className={cx("mockup-screen")}>
        <div style={{ placeSelf: positionToPlaceSelf(draftGrid.position) }}>
          {renderCard(scrollItemCount, 0)}
        </div>
      </div>
      <span className={cx("mockup-label")}>{t("sidebar.layout.preview")}</span>
    </div>
  );
}

export function LayoutTab({
  draftGrid,
  draftSettings,
  draftTheme,
  setDraftGrid,
  setDraftSettings,
  onGridCssValueChange,
  onMarginChange
}: LayoutTabProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <LayoutPreview
        draftGrid={draftGrid}
        draftSettings={draftSettings}
        draftTheme={draftTheme}
      />

      <label className={cx("settingLabel")}>
        <input
          type="checkbox"
          checked={draftSettings.isExpandView}
          onChange={e =>
            setDraftSettings(prev => ({
              ...prev,
              isExpandView: e.target.checked
            }))
          }
          className={cx("checkboxInput")}
        />
        <span className={cx("checkboxLabel")}>
          {t("sidebar.layout.expandBookmarks")}
        </span>
      </label>
      <label className={cx("settingLabel")}>
        <input
          type="checkbox"
          checked={draftSettings.iconLayout === "horizontal"}
          onChange={e =>
            setDraftSettings(prev => ({
              ...prev,
              iconLayout: e.target.checked ? "horizontal" : "vertical"
            }))
          }
          className={cx("checkboxInput")}
        />
        <span className={cx("checkboxLabel")}>
          {t("sidebar.layout.horizontalIcon")}
        </span>
      </label>

      <div className={cx("box")}>
        <span className={cx("boxTitle")}>
          {draftSettings.isExpandView
            ? t("sidebar.layout.expandLayout")
            : t("sidebar.layout.scrollLayout")}
        </span>
        {draftSettings.isExpandView ? (
          <>
            <RangeInput
              label={t("sidebar.layout.cardColumns")}
              value={draftGrid.masonryColumns ?? 2}
              min={1}
              max={5}
              onChange={v => onGridCssValueChange("masonry-columns", String(v))}
            />
            <RangeInput
              label={
                draftSettings.iconLayout === "horizontal"
                  ? t("sidebar.layout.horizontalSize")
                  : t("sidebar.layout.cardInnerColumns")
              }
              value={draftGrid.columns}
              min={3}
              max={10}
              onChange={v => onGridCssValueChange("columns", String(v))}
            />
            {draftSettings.iconLayout === "horizontal" && (
              <RangeInput
                label={t("sidebar.layout.horizontalColumnCount")}
                value={draftGrid.horizontalColumns ?? 1}
                min={1}
                max={5}
                onChange={v =>
                  setDraftGrid(prev => ({ ...prev, horizontalColumns: v }))
                }
              />
            )}
            <RangeInput
              label={t("sidebar.layout.cardGap")}
              value={parseFloat(String(draftGrid.cardGap)) || 1.5}
              min={0}
              max={5}
              step={0.1}
              displayValue={String(draftGrid.cardGap ?? "1.5em")}
              onChange={v => onGridCssValueChange("card-gap", `${v}em`)}
            />
            <RangeInput
              label={t("sidebar.layout.bookmarkGap")}
              value={parseFloat(String(draftGrid.gap)) || 1}
              min={0}
              max={3}
              step={0.1}
              displayValue={String(draftGrid.gap)}
              onChange={v => onGridCssValueChange("gap", `${v}em`)}
            />
          </>
        ) : (
          <>
            <RangeInput
              label={
                draftSettings.iconLayout === "horizontal"
                  ? t("sidebar.layout.count")
                  : t("sidebar.layout.columnCount")
              }
              value={draftGrid.columns}
              min={3}
              max={10}
              onChange={v => onGridCssValueChange("columns", String(v))}
            />
            {draftSettings.iconLayout === "horizontal" && (
              <RangeInput
                label={t("sidebar.layout.horizontalColumnCount")}
                value={draftGrid.horizontalColumns ?? 1}
                min={1}
                max={5}
                onChange={v =>
                  setDraftGrid(prev => ({ ...prev, horizontalColumns: v }))
                }
              />
            )}
            <RangeInput
              label={t("sidebar.layout.rowCount")}
              value={draftGrid.rows}
              min={1}
              max={5}
              onChange={v => onGridCssValueChange("rows", String(v))}
            />
            <RangeInput
              label={t("sidebar.layout.gap")}
              value={parseFloat(String(draftGrid.gap)) || 1}
              min={0}
              max={3}
              step={0.1}
              displayValue={String(draftGrid.gap)}
              onChange={v => onGridCssValueChange("gap", `${v}em`)}
            />
          </>
        )}
      </div>

      <label className={cx("subGroupTitle")}>
        {t("sidebar.layout.positionMargin")}
      </label>
      <PositionGrid
        value={draftGrid.position || "center-center"}
        options={POSITION_OPTIONS}
        onChange={pos => setDraftGrid(prev => ({ ...prev, position: pos }))}
        margin={draftGrid.margin ?? { top: 0, bottom: 0, left: 0, right: 0 }}
        onMarginChange={onMarginChange}
      />
    </>
  );
}
