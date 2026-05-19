import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";

import { ColorRow } from "@star-light/components/ColorRow";
import { RangeInput } from "@star-light/components/RangeInput";
import { useTranslation } from "@star-light/components/i18n";

import type { GridSettings } from "../../types";
import { positionToPlaceSelf } from "../../utils/positionToPlaceSelf";
import type { AppearanceSub, DraftStateProps } from "../OptionsSidebarTypes";
import styles from "../OptionsSidebar.module.scss";

const cx = classNames.bind(styles);

type AppearanceDraftProps = Pick<
  DraftStateProps,
  | "draftGrid"
  | "draftSettings"
  | "draftTheme"
  | "draftSize"
  | "draftIconSize"
  | "setDraftGrid"
  | "setDraftSettings"
  | "setDraftTheme"
  | "setDraftSize"
  | "setDraftIconSize"
>;

type AppearanceTabProps = AppearanceDraftProps & {
  appearanceSub: AppearanceSub;
  backgroundImageUrl: string;
  setBackgroundImageUrl: React.Dispatch<React.SetStateAction<string>>;
  onBackgroundUrl: (url: string) => Promise<void>;
  onBackgroundFile: (file: File) => Promise<void>;
  isBackgroundProcessing: boolean;
  onBackgroundClear: () => Promise<void>;
};

function ProcessingIndicator(): React.ReactElement {
  const { t } = useTranslation();
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const id = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={cx("processingIndicator")}>
      {t("sidebar.background.processing")}
      {".".repeat(dotCount)}
    </div>
  );
}

function LayoutLikeBackgroundPreview({
  draftGrid,
  draftSettings,
  draftTheme
}: Pick<
  AppearanceDraftProps,
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

  const isBgExpandHorizontal = draftSettings.isExpandView && isHorizontal;
  const bgMockCols = isHorizontal ? hCols : cols;

  const bgMockItemSize = isHorizontal
    ? Math.max(20, Math.floor(100 / hCols) - gapScale)
    : Math.max(14, Math.floor(100 / bgMockCols) - gapScale);

  const renderBgItem = (i: number, isFolder: boolean) => {
    const bg = isFolder ? folderColor : iconColorValue;
    return (
      <div
        key={i}
        className={cx("mock-item", { "mock-item-h": isHorizontal })}
        style={{ backgroundColor: bg, width: bgMockItemSize }}
      >
        <div
          className={cx("mock-icon")}
          style={isFolder ? { backgroundColor: folderAccent } : undefined}
        />
        <div className={cx("mock-text")} />
      </div>
    );
  };

  const shouldBgFill = (fill: boolean) => fill && !isBgExpandHorizontal;

  const renderBgCard = (itemCount: number, key: number, fill = false) => (
    <div
      key={key}
      className={cx("mock-card-layout", {
        "mock-card-fill": shouldBgFill(fill)
      })}
      style={{ backgroundColor: bgColorValue }}
    >
      <div className={cx("mock-card-header")}>
        <div className={cx("mock-breadcrumb")} />
        <div className={cx("mock-route")} />
      </div>
      <div
        className={cx("mock-grid", {
          "mock-grid-fill": shouldBgFill(fill)
        })}
        style={{
          gridTemplateColumns: `repeat(${bgMockCols}, 1fr)`,
          gap: `${gapScale}px`
        }}
      >
        {Array.from({ length: itemCount }, (_, i) => renderBgItem(i, i < 2))}
      </div>
    </div>
  );

  const bgCardItemCounts = isBgExpandHorizontal
    ? [Math.max(6, hCols * 3), Math.max(4, hCols * 2), Math.max(3, hCols * 2)]
    : [
        Math.min(bgMockCols * 3, 15),
        Math.min(bgMockCols * 2, 10),
        Math.min(bgMockCols * 2, 8)
      ];

  const bgScrollItemCount = isHorizontal
    ? Math.min(hCols * 3, 10)
    : Math.min(cols * rowCount, 15);

  const bgLayoutContent = draftSettings.isExpandView ? (
    <div
      className={cx("mock-masonry")}
      style={{
        columnCount: masonry,
        columnGap: `${cardGapScale}px`,
        placeSelf: positionToPlaceSelf(draftGrid.position)
      }}
    >
      {bgCardItemCounts.map((count, i) => renderBgCard(count, i, true))}
    </div>
  ) : (
    <div style={{ placeSelf: positionToPlaceSelf(draftGrid.position) }}>
      {renderBgCard(bgScrollItemCount, 0)}
    </div>
  );

  return (
    <div className={cx("mockup", "mockup-background")}>
      <div
        className={cx("mockup-screen")}
        style={{
          background: "var(--background-image, #f0f0f0) center/cover no-repeat"
        }}
      >
        {bgLayoutContent}
      </div>
      <span className={cx("mockup-label")}>
        {t("sidebar.background.preview")}
      </span>
    </div>
  );
}

function ContainerPreview({
  draftGrid,
  draftTheme
}: Pick<AppearanceDraftProps, "draftGrid" | "draftTheme">): React.ReactElement {
  const { t } = useTranslation();
  const borderEnabled = draftGrid.heading?.borderEnabled ?? false;

  const cssVars = {
    "--ct-title-hover": draftTheme.accent,
    "--ct-subtitle-hover": draftGrid.heading?.subtitleHoverColor ?? "#000"
  } as React.CSSProperties;

  return (
    <div className={cx("mockup", "mockup-container")} style={cssVars}>
      <div
        className={cx("mockup-card")}
        style={{ borderRadius: draftGrid.heading?.borderRadius ?? 0 }}
      >
        <span
          className={cx("mockup-title", "mockup-title-hover")}
          style={{
            color: draftGrid.heading?.titleColor ?? "#000",
            fontSize: draftGrid.heading?.titleSize ?? 14,
            paintOrder: "stroke fill",
            WebkitTextStroke: borderEnabled
              ? `${draftGrid.heading?.borderWidth ?? 1}px ${draftGrid.heading?.borderColor ?? "#000"}`
              : undefined
          }}
        >
          {t("sidebar.container.mockupTitle")}
        </span>
        <span
          className={cx("mockup-subtitle", "mockup-subtitle-hover")}
          style={{
            color: draftGrid.heading?.subtitleColor ?? "#999",
            fontSize: draftGrid.heading?.subtitleSize ?? 12
          }}
        >
          {t("sidebar.container.mockupSubtitle")}
        </span>
      </div>
      <span className={cx("mockup-label")}>
        {t("sidebar.container.preview")}
      </span>
    </div>
  );
}

function BookmarkPreview({
  draftGrid,
  draftSettings,
  draftTheme,
  draftSize,
  draftIconSize
}: Pick<
  AppearanceDraftProps,
  "draftGrid" | "draftSettings" | "draftTheme" | "draftSize" | "draftIconSize"
>): React.ReactElement {
  const { t } = useTranslation();
  const iconColorValue = draftGrid.icon?.color ?? "rgba(255, 255, 255, 1)";
  const bmHorizontal = draftSettings.iconLayout === "horizontal";
  const em = draftSize;
  const btnWidth = bmHorizontal ? undefined : em * (draftGrid.icon?.width ?? 4);
  const btnHeight = bmHorizontal
    ? undefined
    : em * (draftGrid.icon?.height ?? 4);
  const iconSz = Math.min(draftIconSize, em * 2);
  const fontSize = em * 0.75;
  const pad = em * 0.5;
  const gapVal = em * 0.5;
  const radius = draftGrid.icon?.borderRadius ?? em * 0.3;

  const cssVars = {
    "--bm-hover-bg": draftTheme.hoverBg,
    "--bm-hover-text": draftTheme.hoverText,
    "--bm-hover-y": `${-em * 0.3}px`,
    "--bm-hover-shadow": `0 ${em * 0.3}px 0 ${draftTheme.accent}`
  } as React.CSSProperties;

  return (
    <div className={cx("mockup", "mockup-bookmark")} style={cssVars}>
      <div
        className={cx("mockup-bm-button", {
          "mockup-bm-button-h": bmHorizontal
        })}
        style={{
          backgroundColor: iconColorValue,
          minWidth: btnWidth,
          minHeight: btnHeight,
          padding: pad,
          gap: gapVal,
          borderRadius: radius
        }}
      >
        <div
          className={cx("mockup-bm-icon")}
          style={{
            width: iconSz,
            height: iconSz,
            borderRadius: draftGrid.icon?.iconRadius ?? em * 0.4,
            background: draftTheme.accent,
            border: `1px solid ${draftTheme.border}`
          }}
        />
        <span
          className={cx("mockup-bm-name", {
            "mockup-bm-name-left": bmHorizontal
          })}
          style={{ color: draftTheme.text, fontSize }}
        >
          {t("sidebar.bookmark.mockupName")}
        </span>
      </div>
      <span className={cx("mockup-label")}>
        {t("sidebar.bookmark.preview")}
      </span>
    </div>
  );
}

function FolderPreview({
  draftGrid,
  draftSettings,
  draftTheme,
  draftSize,
  draftIconSize
}: Pick<
  AppearanceDraftProps,
  "draftGrid" | "draftSettings" | "draftTheme" | "draftSize" | "draftIconSize"
>): React.ReactElement {
  const { t } = useTranslation();
  const flHorizontal = draftSettings.iconLayout === "horizontal";
  const em = draftSize;
  const btnWidth = flHorizontal ? undefined : em * (draftGrid.icon?.width ?? 4);
  const btnHeight = flHorizontal
    ? undefined
    : em * (draftGrid.icon?.height ?? 4);
  const iconSz = Math.min(draftIconSize, em * 2);
  const fontSize = em * 0.75;
  const pad = em * 0.5;
  const gapVal = em * 0.5;
  const radius = draftGrid.icon?.borderRadius ?? em * 0.3;
  const iconRadius = draftGrid.icon?.iconRadius ?? em * 0.4;

  const folderBg = draftGrid.folder?.color ?? draftTheme.surface;
  const folderBorder = draftGrid.folder?.border ?? draftTheme.border;
  const folderAccent = draftGrid.folder?.accent ?? draftTheme.accent;
  const folderAccentText =
    draftGrid.folder?.accentText ?? draftTheme.accentText;
  const folderText = draftGrid.folder?.text ?? draftTheme.text;

  const cssVars = {
    "--fl-hover-bg": draftTheme.hoverBg,
    "--fl-hover-text": draftTheme.hoverText,
    "--fl-hover-y": `${-em * 0.3}px`,
    "--fl-hover-shadow": `0 ${em * 0.3}px 0 ${folderAccent}`
  } as React.CSSProperties;

  return (
    <div className={cx("mockup", "mockup-folder")} style={cssVars}>
      <div
        className={cx("mockup-fl-button", {
          "mockup-fl-button-h": flHorizontal
        })}
        style={{
          backgroundColor: folderBg,
          borderColor: folderBorder,
          minWidth: btnWidth,
          minHeight: btnHeight,
          padding: pad,
          gap: gapVal,
          borderRadius: radius
        }}
      >
        <div
          className={cx("mockup-fl-icon")}
          style={{
            width: iconSz,
            height: iconSz,
            borderRadius: iconRadius,
            backgroundColor: folderAccent,
            color: folderAccentText,
            borderColor: folderBorder
          }}
        >
          F
        </div>
        <span
          className={cx("mockup-fl-name", {
            "mockup-fl-name-left": flHorizontal
          })}
          style={{ color: folderText, fontSize }}
        >
          {t("sidebar.folder.mockupName")}
        </span>
      </div>
      <span className={cx("mockup-label")}>{t("sidebar.folder.preview")}</span>
    </div>
  );
}

function AppearancePreview({
  appearanceSub,
  draftGrid,
  draftSettings,
  draftTheme,
  draftSize,
  draftIconSize
}: Pick<
  AppearanceTabProps,
  | "appearanceSub"
  | "draftGrid"
  | "draftSettings"
  | "draftTheme"
  | "draftSize"
  | "draftIconSize"
>): React.ReactElement | null {
  if (appearanceSub === "background") {
    return (
      <LayoutLikeBackgroundPreview
        draftGrid={draftGrid}
        draftSettings={draftSettings}
        draftTheme={draftTheme}
      />
    );
  }

  if (appearanceSub === "container") {
    return <ContainerPreview draftGrid={draftGrid} draftTheme={draftTheme} />;
  }

  if (appearanceSub === "bookmark") {
    return (
      <BookmarkPreview
        draftGrid={draftGrid}
        draftSettings={draftSettings}
        draftTheme={draftTheme}
        draftSize={draftSize}
        draftIconSize={draftIconSize}
      />
    );
  }

  if (appearanceSub === "folder") {
    return (
      <FolderPreview
        draftGrid={draftGrid}
        draftSettings={draftSettings}
        draftTheme={draftTheme}
        draftSize={draftSize}
        draftIconSize={draftIconSize}
      />
    );
  }

  return null;
}

export function AppearanceTab({
  appearanceSub,
  draftGrid,
  draftSettings,
  draftTheme,
  draftSize,
  draftIconSize,
  setDraftGrid,
  setDraftSettings,
  setDraftTheme,
  setDraftSize,
  setDraftIconSize,
  backgroundImageUrl,
  setBackgroundImageUrl,
  onBackgroundUrl,
  onBackgroundFile,
  isBackgroundProcessing,
  onBackgroundClear
}: AppearanceTabProps): React.ReactElement {
  const { t } = useTranslation();
  const bgImageFileRef = useRef<HTMLInputElement>(null);
  const bgColorValue = draftGrid.background?.color ?? "rgba(255, 255, 255, 1)";
  const iconColorValue = draftGrid.icon?.color ?? "rgba(255, 255, 255, 1)";

  const handleBackgroundImageApply = (): void => {
    if (backgroundImageUrl.trim()) {
      onBackgroundUrl(backgroundImageUrl.trim());
    }
  };

  const handleBackgroundMediaFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onBackgroundFile(file);
    setBackgroundImageUrl("");
    e.target.value = "";
  };

  return (
    <>
      <AppearancePreview
        appearanceSub={appearanceSub}
        draftGrid={draftGrid}
        draftSettings={draftSettings}
        draftTheme={draftTheme}
        draftSize={draftSize}
        draftIconSize={draftIconSize}
      />

      {appearanceSub === "background" && (
        <>
          <label className={cx("subGroupTitle")}>
            {t("sidebar.background.image")}
          </label>
          <div className={cx("backgroundImageContainer")}>
            <input
              name="bg"
              type="text"
              value={backgroundImageUrl}
              onChange={e => setBackgroundImageUrl(e.target.value)}
              placeholder={t("sidebar.background.urlPlaceholder")}
              className={cx("textInput")}
            />
            <button onClick={handleBackgroundImageApply}>
              {t("sidebar.background.apply")}
            </button>
          </div>
          <div className={cx("backgroundImageContainer")}>
            <button
              onClick={() => bgImageFileRef.current?.click()}
              disabled={isBackgroundProcessing}
            >
              {t("sidebar.background.fileUpload")}
            </button>
            <button
              onClick={onBackgroundClear}
              disabled={isBackgroundProcessing}
            >
              {t("sidebar.background.remove")}
            </button>
            <input
              ref={bgImageFileRef}
              type="file"
              accept="image/*,video/*,.gif"
              style={{ display: "none" }}
              onChange={handleBackgroundMediaFile}
            />
          </div>
          {isBackgroundProcessing && <ProcessingIndicator />}
          <label className={cx("subGroupTitle")}>
            {t("sidebar.background.box")}
          </label>
          <ColorRow
            label={t("sidebar.background.color")}
            value={bgColorValue}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                background: { ...prev.background, color }
              }));
            }}
          />
        </>
      )}

      {appearanceSub === "container" && (
        <>
          <label className={cx("subGroupTitle")}>
            {t("sidebar.container.title")}
          </label>
          <ColorRow
            label={t("sidebar.container.text")}
            value={draftGrid.heading?.titleColor ?? "#000000"}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                heading: {
                  ...prev.heading,
                  titleColor: color
                } as GridSettings["heading"]
              }));
            }}
          />
          <RangeInput
            label={t("sidebar.container.size")}
            value={draftGrid.heading?.titleSize ?? 14}
            min={8}
            max={30}
            displayValue={`${draftGrid.heading?.titleSize ?? 14}px`}
            onChange={v => {
              setDraftGrid(prev => ({
                ...prev,
                heading: {
                  ...prev.heading,
                  titleSize: v
                } as GridSettings["heading"]
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.container.hover")}
            value={draftTheme.accent}
            showAlpha
            onChange={color => {
              if (draftGrid.folder?.accent == null) {
                setDraftGrid(prev => ({
                  ...prev,
                  folder: {
                    color: prev.folder?.color ?? draftTheme.surface,
                    text: prev.folder?.text ?? draftTheme.text,
                    border: prev.folder?.border ?? draftTheme.border,
                    accent: draftTheme.accent,
                    accentText: prev.folder?.accentText ?? draftTheme.accentText
                  }
                }));
              }
              setDraftTheme(prev => ({ ...prev, accent: color }));
            }}
          />
          <label className={cx("settingLabel")}>
            <input
              type="checkbox"
              checked={draftGrid.heading?.borderEnabled ?? false}
              onChange={e => {
                const heading = draftGrid.heading ?? {
                  titleColor: "#000000",
                  subtitleColor: "#999999",
                  borderEnabled: false,
                  borderWidth: 1,
                  borderColor: "#000000",
                  subtitleHoverColor: "#000000"
                };
                const next = { ...heading, borderEnabled: e.target.checked };
                setDraftGrid(prev => ({ ...prev, heading: next }));
              }}
              className={cx("checkboxInput")}
            />
            <span className={cx("checkboxLabel")}>
              {t("sidebar.container.border")}
            </span>
          </label>
          {draftGrid.heading?.borderEnabled && (
            <>
              <ColorRow
                label={t("sidebar.container.borderColor")}
                value={draftGrid.heading?.borderColor ?? "#000000"}
                showAlpha
                onChange={color => {
                  const heading = draftGrid.heading!;
                  const next = { ...heading, borderColor: color };
                  setDraftGrid(prev => ({ ...prev, heading: next }));
                }}
              />
              <RangeInput
                label={t("sidebar.container.borderWidth")}
                value={draftGrid.heading?.borderWidth ?? 1}
                min={1}
                max={5}
                displayValue={`${draftGrid.heading?.borderWidth ?? 1}px`}
                onChange={v => {
                  const heading = draftGrid.heading!;
                  const next = { ...heading, borderWidth: v };
                  setDraftGrid(prev => ({ ...prev, heading: next }));
                }}
              />
            </>
          )}

          <label className={cx("subGroupTitle")}>
            {t("sidebar.container.subtitle")}
          </label>
          <ColorRow
            label={t("sidebar.container.text")}
            value={draftGrid.heading?.subtitleColor ?? "#999999"}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                heading: {
                  ...prev.heading,
                  subtitleColor: color
                } as GridSettings["heading"]
              }));
            }}
          />
          <RangeInput
            label={t("sidebar.container.size")}
            value={draftGrid.heading?.subtitleSize ?? 12}
            min={8}
            max={24}
            displayValue={`${draftGrid.heading?.subtitleSize ?? 12}px`}
            onChange={v => {
              setDraftGrid(prev => ({
                ...prev,
                heading: {
                  ...prev.heading,
                  subtitleSize: v
                } as GridSettings["heading"]
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.container.hover")}
            value={draftGrid.heading?.subtitleHoverColor ?? "#000000"}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                heading: {
                  ...prev.heading,
                  subtitleHoverColor: color
                } as GridSettings["heading"]
              }));
            }}
          />

          <label className={cx("subGroupTitle")}>
            {t("sidebar.container.containerBox")}
          </label>
          <RangeInput
            label={t("sidebar.container.borderRadius")}
            value={draftGrid.heading?.borderRadius ?? 0}
            min={0}
            max={30}
            displayValue={`${draftGrid.heading?.borderRadius ?? 0}px`}
            onChange={v => {
              setDraftGrid(prev => ({
                ...prev,
                heading: {
                  ...prev.heading,
                  borderRadius: v
                } as GridSettings["heading"]
              }));
            }}
          />
        </>
      )}

      {appearanceSub === "bookmark" && (
        <>
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
              {t("sidebar.bookmark.horizontalIcon")}
            </span>
          </label>
          <RangeInput
            label={t("sidebar.bookmark.scale")}
            value={draftSize}
            min={10}
            max={50}
            displayValue={`${draftSize}px`}
            onChange={v => setDraftSize(v)}
          />
          {draftSettings.iconLayout !== "horizontal" && (
            <>
              <RangeInput
                label={t("sidebar.bookmark.horizontalSize")}
                value={draftGrid.icon?.width ?? 4}
                min={2}
                max={10}
                step={0.5}
                displayValue={`${draftGrid.icon?.width ?? 4}em`}
                onChange={v => {
                  setDraftGrid(prev => ({
                    ...prev,
                    icon: { ...prev.icon, width: v }
                  }));
                }}
              />
              <RangeInput
                label={t("sidebar.bookmark.verticalSize")}
                value={draftGrid.icon?.height ?? 4}
                min={2}
                max={10}
                step={0.5}
                displayValue={`${draftGrid.icon?.height ?? 4}em`}
                onChange={v => {
                  setDraftGrid(prev => ({
                    ...prev,
                    icon: { ...prev.icon, height: v }
                  }));
                }}
              />
            </>
          )}
          <RangeInput
            label={t("sidebar.bookmark.iconSize")}
            value={draftIconSize}
            min={16}
            max={32}
            displayValue={`${draftIconSize}px`}
            onChange={v => setDraftIconSize(v)}
          />
          <RangeInput
            label={t("sidebar.bookmark.borderRadius")}
            value={draftGrid.icon?.borderRadius ?? Math.round(draftSize * 0.3)}
            min={0}
            max={30}
            displayValue={`${draftGrid.icon?.borderRadius ?? Math.round(draftSize * 0.3)}px`}
            onChange={v => {
              setDraftGrid(prev => ({
                ...prev,
                icon: { ...prev.icon, borderRadius: v }
              }));
            }}
          />
          <RangeInput
            label={t("sidebar.bookmark.iconBorderRadius")}
            value={draftGrid.icon?.iconRadius ?? Math.round(draftSize * 0.4)}
            min={0}
            max={30}
            displayValue={`${draftGrid.icon?.iconRadius ?? Math.round(draftSize * 0.4)}px`}
            onChange={v => {
              setDraftGrid(prev => ({
                ...prev,
                icon: { ...prev.icon, iconRadius: v }
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.bookmark.boxColor")}
            value={iconColorValue}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                icon: { ...prev.icon, color }
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.bookmark.text")}
            value={draftTheme.text}
            showAlpha
            onChange={color => {
              setDraftTheme(prev => ({ ...prev, text: color }));
            }}
          />
          <ColorRow
            label={t("sidebar.bookmark.hoverBackground")}
            value={draftTheme.hoverBg}
            showAlpha
            onChange={color => {
              setDraftTheme(prev => ({ ...prev, hoverBg: color }));
            }}
          />
          <ColorRow
            label={t("sidebar.bookmark.hoverText")}
            value={draftTheme.hoverText}
            showAlpha
            onChange={color => {
              setDraftTheme(prev => ({ ...prev, hoverText: color }));
            }}
          />
        </>
      )}

      {appearanceSub === "folder" && (
        <>
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
              {t("sidebar.folder.horizontalIcon")}
            </span>
          </label>
          <ColorRow
            label={t("sidebar.folder.background")}
            value={draftGrid.folder?.color ?? draftTheme.surface}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                folder: { ...prev.folder, color } as GridSettings["folder"]
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.folder.iconBackground")}
            value={draftGrid.folder?.accent ?? draftTheme.accent}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                folder: {
                  ...prev.folder,
                  accent: color
                } as GridSettings["folder"]
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.folder.iconColor")}
            value={draftGrid.folder?.accentText ?? draftTheme.accentText}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                folder: {
                  ...prev.folder,
                  accentText: color
                } as GridSettings["folder"]
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.folder.text")}
            value={draftGrid.folder?.text ?? draftTheme.text}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                folder: {
                  ...prev.folder,
                  text: color
                } as GridSettings["folder"]
              }));
            }}
          />
          <ColorRow
            label={t("sidebar.folder.border")}
            value={draftGrid.folder?.border ?? draftTheme.border}
            showAlpha
            onChange={color => {
              setDraftGrid(prev => ({
                ...prev,
                folder: {
                  ...prev.folder,
                  border: color
                } as GridSettings["folder"]
              }));
            }}
          />
        </>
      )}
    </>
  );
}
