import type React from "react";
import classNames from "classnames/bind";

import { useTranslation, type Locale } from "@star-light/components/i18n";
import storage from "@/utils/storage";

import { defaultOptionValue } from "../../defaultOptionValue";
import type { Settings } from "../../types";
import type { SettingsFileInputRef } from "../OptionsSidebarTypes";
import styles from "../OptionsSidebar.module.scss";

const cx = classNames.bind(styles);

type GeneralTabProps = {
  draftSettings: Settings;
  setDraftSettings: React.Dispatch<React.SetStateAction<Settings>>;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onThemeReset: () => Promise<void>;
  settingsFileRef: SettingsFileInputRef;
  onExportSettings: () => Promise<void>;
  onImportSettingsFile: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  onOpenSettingsImport: () => void;
};

export function GeneralTab({
  draftSettings,
  setDraftSettings,
  locale,
  onLocaleChange,
  onThemeReset,
  settingsFileRef,
  onExportSettings,
  onImportSettingsFile,
  onOpenSettingsImport
}: GeneralTabProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <label className={cx("subGroupTitle")}>
        {t("sidebar.general.language")}
      </label>
      <div className={cx("languageSelect")}>
        {(
          [
            ["en", "English"],
            ["ko", "한국어"],
            ["ja", "日本語"]
          ] as const
        ).map(([code, label]) => (
          <button
            key={code}
            className={cx("languageButton", {
              "languageButton-active": locale === code
            })}
            onClick={() => onLocaleChange(code)}
          >
            {label}
          </button>
        ))}
      </div>

      <label className={cx("settingLabel")}>
        <input
          type="checkbox"
          checked={draftSettings.isOpenInNewTab}
          onChange={e =>
            setDraftSettings(prev => ({
              ...prev,
              isOpenInNewTab: e.target.checked
            }))
          }
          className={cx("checkboxInput")}
        />
        <span className={cx("checkboxLabel")}>
          {t("sidebar.general.openInNewTab")}
        </span>
      </label>

      <label className={cx("subGroupTitle")}>
        {t("sidebar.general.exportImport")}
      </label>
      <div className={cx("exportImportRow")}>
        <button className={cx("actionButton")} onClick={onExportSettings}>
          {t("sidebar.general.export")}
        </button>
        <button className={cx("actionButton")} onClick={onOpenSettingsImport}>
          {t("sidebar.general.import")}
        </button>
        <input
          ref={settingsFileRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={onImportSettingsFile}
        />
      </div>

      <label className={cx("subGroupTitle")}>
        {t("sidebar.general.reset")}
      </label>
      <button
        className={cx("resetButton")}
        onClick={async () => {
          await onThemeReset();
          window.location.reload();
        }}
      >
        {t("sidebar.general.resetTheme")}
      </button>
      <button
        onClick={() => {
          const { ...options } = defaultOptionValue;
          storage.sync.set(options);
          window.location.reload();
        }}
        className={cx("resetButton")}
      >
        {t("sidebar.general.resetAll")}
      </button>

      <label className={cx("subGroupTitle")}>
        {t("sidebar.general.credits")}
      </label>
      <div className={cx("creditsList")}>
        <div className={cx("creditsItem")}>
          <a
            href="https://x.com/FlogLammer"
            target="_blank"
            rel="noopener noreferrer"
            className={cx("creditsName")}
          >
            @FlogLammer
          </a>
          <span className={cx("creditsRole")}>
            {t("sidebar.general.credits.dev")}
          </span>
        </div>
        <div className={cx("creditsItem")}>
          <a
            href="https://x.com/dn_blanked"
            target="_blank"
            rel="noopener noreferrer"
            className={cx("creditsName")}
          >
            @dn_blanked
          </a>
          <span className={cx("creditsRole")}>
            {t("sidebar.general.credits.planning")}
          </span>
        </div>
      </div>
      <div className={cx("creditsLinks")}>
        {/* TODO: GitHub URL 확정 후 교체 */}
        <a href="#" className={cx("creditsLink")}>
          {t("sidebar.general.credits.github")}
        </a>
        {/* TODO: README URL 확정 후 교체 */}
        <a href="#" className={cx("creditsLink")}>
          {t("sidebar.general.credits.readme")}
        </a>
        {/* TODO: Postype URL 확정 후 교체 */}
        <a href="#" className={cx("creditsLink")}>
          {t("sidebar.general.credits.postype")}
        </a>
        {/* TODO: GitHub Issues URL 확정 후 교체 */}
        <a href="#" className={cx("creditsLink")}>
          {t("sidebar.general.credits.bugReport")}
        </a>
        <a
          href="https://star-light.space"
          target="_blank"
          rel="noopener noreferrer"
          className={cx("creditsLink")}
        >
          {t("sidebar.general.credits.homepage")}
        </a>
        <a
          href="https://coff.ee/starlight.space"
          target="_blank"
          rel="noopener noreferrer"
          className={cx("creditsLink")}
        >
          {t("sidebar.general.credits.buyMeACoffee")}
        </a>
      </div>
    </>
  );
}
