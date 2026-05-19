import { useRef } from "react";

import type { ColorTheme } from "@star-light/components/theme";
import {
  exportFull,
  exportToJson,
  importFromJson,
  importFull
} from "@/utils/exportImport";

import type { BackgroundMedia } from "../../hooks/useBackgroundImage";
import type { GridSettings, Settings } from "../../types";

type UseOptionsImportExportParams = {
  gridSettings: GridSettings;
  settings: Settings;
  colorTheme: ColorTheme;
  backgroundMeta: BackgroundMedia | null | undefined;
  customCSS: string;
  onThemePreset: (preset: ColorTheme) => Promise<void>;
};

export function useOptionsImportExport({
  gridSettings,
  settings,
  colorTheme,
  backgroundMeta,
  customCSS,
  onThemePreset
}: UseOptionsImportExportParams) {
  const settingsFileRef = useRef<HTMLInputElement>(null);

  const handleExportSettings = async (): Promise<void> => {
    const data = await exportFull(
      gridSettings,
      settings,
      colorTheme,
      backgroundMeta,
      customCSS
    );
    exportToJson(data, "starlit-settings.json");
  };

  const handleImportSettingsFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = await importFromJson(file);
    if (
      !data ||
      typeof data !== "object" ||
      (!data.gridSettings && !data.settings && !data.colorTheme)
    ) {
      console.warn("Invalid import data: missing required fields");
      return;
    }
    await importFull(data);
    if (data.colorTheme) await onThemePreset(data.colorTheme);
    window.location.reload();
    e.target.value = "";
  };

  const openSettingsImport = () => {
    settingsFileRef.current?.click();
  };

  return {
    settingsFileRef,
    handleExportSettings,
    handleImportSettingsFile,
    openSettingsImport
  };
}
