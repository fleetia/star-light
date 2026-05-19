import React, { useState } from "react";
import classNames from "classnames/bind";

import { Button } from "@star-light/components/Button";
import { useTranslation } from "@star-light/components/i18n";

import { useOptionsDraft } from "./OptionsSidebarHooks/useOptionsDraft";
import { useOptionsImportExport } from "./OptionsSidebarHooks/useOptionsImportExport";
import type {
  AppearanceSub,
  OptionsSidebarProps,
  PrimaryTab
} from "./OptionsSidebarTypes";
import { AppearanceTab } from "./OptionsSidebarTabs/AppearanceTab";
import { CssTab } from "./OptionsSidebarTabs/CssTab";
import { GeneralTab } from "./OptionsSidebarTabs/GeneralTab";
import { GroupsTab } from "./OptionsSidebarTabs/GroupsTab";
import { LayoutTab } from "./OptionsSidebarTabs/LayoutTab";
import styles from "./OptionsSidebar.module.scss";

const cx = classNames.bind(styles);

export function OptionsSidebar({
  gridSettings,
  settings,
  size,
  iconSize,
  onClose,
  onGridSettingsUpdate,
  onSettingChange,
  onSizeChange,
  onIconSizeChange,
  onBackgroundUrl,
  onBackgroundFile,
  isBackgroundProcessing,
  onBackgroundClear,
  backgroundMeta,
  colorTheme,
  onThemeChange,
  onThemeReset,
  onThemePreset,
  orderedTree,
  rootPath,
  groupPreferences,
  onSelectRoot,
  onSiblingReorder,
  onToggleVisibility,
  customCSS,
  onCustomCSSChange,
  locale,
  onLocaleChange
}: OptionsSidebarProps): React.ReactElement {
  const { t } = useTranslation();
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("general");
  const [appearanceSub, setAppearanceSub] =
    useState<AppearanceSub>("background");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  const {
    draftGrid,
    draftSettings,
    draftTheme,
    draftSize,
    draftIconSize,
    draftCSS,
    setDraftGrid,
    setDraftSettings,
    setDraftTheme,
    setDraftSize,
    setDraftIconSize,
    setDraftCSS,
    isDirty,
    showConfirm,
    setShowConfirm,
    handleSave,
    handleCancel,
    handleConfirmDiscard,
    updateGridCssValue,
    handleMarginChange
  } = useOptionsDraft({
    gridSettings,
    settings,
    colorTheme,
    size,
    iconSize,
    customCSS,
    onClose,
    onGridSettingsUpdate,
    onSettingChange,
    onThemeChange,
    onSizeChange,
    onIconSizeChange,
    onCustomCSSChange
  });

  const {
    settingsFileRef,
    handleExportSettings,
    handleImportSettingsFile,
    openSettingsImport
  } = useOptionsImportExport({
    gridSettings,
    settings,
    colorTheme,
    backgroundMeta,
    customCSS,
    onThemePreset
  });

  const primaryTabs: { key: PrimaryTab; label: string }[] = [
    { key: "general", label: t("sidebar.tab.general") },
    { key: "appearance", label: t("sidebar.tab.appearance") },
    { key: "layout", label: t("sidebar.tab.layout") },
    { key: "css", label: t("sidebar.tab.css") },
    { key: "groups", label: t("sidebar.tab.groups") }
  ];

  const appearanceSubTabs: { key: AppearanceSub; label: string }[] = [
    { key: "background", label: t("sidebar.appearance.background") },
    { key: "container", label: t("sidebar.appearance.container") },
    { key: "bookmark", label: t("sidebar.appearance.bookmark") },
    { key: "folder", label: t("sidebar.appearance.folder") }
  ];

  const subTabs = primaryTab === "appearance" ? appearanceSubTabs : [];
  const currentSub = primaryTab === "appearance" ? appearanceSub : null;

  const setCurrentSub = (key: string) => {
    if (primaryTab === "appearance") setAppearanceSub(key as AppearanceSub);
  };

  const renderCurrentTab = () => {
    if (primaryTab === "appearance") {
      return (
        <AppearanceTab
          appearanceSub={appearanceSub}
          draftGrid={draftGrid}
          draftSettings={draftSettings}
          draftTheme={draftTheme}
          draftSize={draftSize}
          draftIconSize={draftIconSize}
          setDraftGrid={setDraftGrid}
          setDraftSettings={setDraftSettings}
          setDraftTheme={setDraftTheme}
          setDraftSize={setDraftSize}
          setDraftIconSize={setDraftIconSize}
          backgroundImageUrl={backgroundImageUrl}
          setBackgroundImageUrl={setBackgroundImageUrl}
          onBackgroundUrl={onBackgroundUrl}
          onBackgroundFile={onBackgroundFile}
          isBackgroundProcessing={isBackgroundProcessing}
          onBackgroundClear={onBackgroundClear}
        />
      );
    }

    if (primaryTab === "layout") {
      return (
        <LayoutTab
          draftGrid={draftGrid}
          draftSettings={draftSettings}
          draftTheme={draftTheme}
          setDraftGrid={setDraftGrid}
          setDraftSettings={setDraftSettings}
          onGridCssValueChange={updateGridCssValue}
          onMarginChange={handleMarginChange}
        />
      );
    }

    if (primaryTab === "css") {
      return <CssTab draftCSS={draftCSS} setDraftCSS={setDraftCSS} />;
    }

    if (primaryTab === "groups") {
      return (
        <GroupsTab
          orderedTree={orderedTree}
          rootPath={rootPath}
          groupPreferences={groupPreferences}
          onSelectRoot={onSelectRoot}
          onSiblingReorder={onSiblingReorder}
          onToggleVisibility={onToggleVisibility}
        />
      );
    }

    return (
      <GeneralTab
        draftSettings={draftSettings}
        setDraftSettings={setDraftSettings}
        locale={locale}
        onLocaleChange={onLocaleChange}
        onThemeReset={onThemeReset}
        settingsFileRef={settingsFileRef}
        onExportSettings={handleExportSettings}
        onImportSettingsFile={handleImportSettingsFile}
        onOpenSettingsImport={openSettingsImport}
      />
    );
  };

  return (
    <div className={cx("overlay")} onClick={handleCancel}>
      <div className={cx("modal")} onClick={e => e.stopPropagation()}>
        <div className={cx("tab-bar-primary")}>
          {primaryTabs.map(tab => (
            <button
              key={tab.key}
              className={cx("tab-primary", {
                "tab-active": primaryTab === tab.key
              })}
              onClick={() => setPrimaryTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className={cx("modal-body", { "has-sidebar": subTabs.length > 0 })}
        >
          {subTabs.length > 0 && (
            <div className={cx("tab-bar-secondary")}>
              {subTabs.map(tab => (
                <button
                  key={tab.key}
                  className={cx("tab-secondary", {
                    "tab-secondary-active": currentSub === tab.key
                  })}
                  onClick={() => setCurrentSub(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className={cx("tab-content")}>{renderCurrentTab()}</div>
        </div>

        <div className={cx("modal-footer")}>
          <button className={cx("cancel-button")} onClick={handleCancel}>
            {t("sidebar.cancel")}
          </button>
          <button
            className={cx("save-button")}
            disabled={!isDirty}
            onClick={handleSave}
          >
            {t("sidebar.save")}
          </button>
        </div>

        {showConfirm && (
          <div className={cx("confirm-overlay")}>
            <div className={cx("confirm-box")}>
              <p>{t("sidebar.confirm.unsavedChanges")}</p>
              <div className={cx("confirm-actions")}>
                <Button onClick={handleConfirmDiscard}>
                  {t("sidebar.confirm.yes")}
                </Button>
                <Button
                  variant={"primary"}
                  onClick={() => setShowConfirm(false)}
                >
                  {t("sidebar.confirm.no")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
