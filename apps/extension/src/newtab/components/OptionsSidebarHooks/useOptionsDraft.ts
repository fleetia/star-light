import { useMemo, useState } from "react";

import type { ColorTheme } from "@star-light/components/theme";

import type { GridSettings, Settings } from "../../types";

function shallowEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function deepShallowEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) continue;
    if (
      typeof valA === "object" &&
      valA !== null &&
      typeof valB === "object" &&
      valB !== null &&
      !Array.isArray(valA) &&
      !Array.isArray(valB)
    ) {
      if (
        !shallowEqual(
          valA as Record<string, unknown>,
          valB as Record<string, unknown>
        )
      )
        return false;
    } else {
      return false;
    }
  }
  return true;
}

const cssToSettingsKey: Record<string, keyof GridSettings> = {
  columns: "columns",
  rows: "rows",
  gap: "gap",
  "card-gap": "cardGap",
  "masonry-columns": "masonryColumns"
};

type UseOptionsDraftParams = {
  gridSettings: GridSettings;
  settings: Settings;
  colorTheme: ColorTheme;
  size: number;
  iconSize: number;
  customCSS: string;
  onClose: () => void;
  onGridSettingsUpdate: (settings: GridSettings) => Promise<void>;
  onSettingChange: (
    key: keyof Settings,
    value: boolean | string
  ) => Promise<void>;
  onThemeChange: (key: keyof ColorTheme, value: string) => Promise<void>;
  onSizeChange: (value: number) => Promise<void>;
  onIconSizeChange: (value: number) => Promise<void>;
  onCustomCSSChange: (css: string) => Promise<void>;
};

export function useOptionsDraft({
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
}: UseOptionsDraftParams) {
  const [draftGrid, setDraftGrid] = useState(() =>
    structuredClone(gridSettings)
  );
  const [draftSettings, setDraftSettings] = useState(() =>
    structuredClone(settings)
  );
  const [draftTheme, setDraftTheme] = useState(() =>
    structuredClone(colorTheme)
  );
  const [draftSize, setDraftSize] = useState(size);
  const [draftIconSize, setDraftIconSize] = useState(iconSize);
  const [draftCSS, setDraftCSS] = useState(customCSS);

  const [snapshot] = useState(() => ({
    gridSettings: structuredClone(gridSettings),
    settings: structuredClone(settings),
    colorTheme: structuredClone(colorTheme),
    size,
    iconSize,
    customCSS
  }));

  const isDirty = useMemo(() => {
    return (
      !deepShallowEqual(
        draftGrid as unknown as Record<string, unknown>,
        snapshot.gridSettings as unknown as Record<string, unknown>
      ) ||
      !shallowEqual(
        draftSettings as unknown as Record<string, unknown>,
        snapshot.settings as unknown as Record<string, unknown>
      ) ||
      !shallowEqual(
        draftTheme as unknown as Record<string, unknown>,
        snapshot.colorTheme as unknown as Record<string, unknown>
      ) ||
      draftSize !== snapshot.size ||
      draftIconSize !== snapshot.iconSize ||
      draftCSS !== snapshot.customCSS
    );
  }, [
    draftGrid,
    draftSettings,
    draftTheme,
    draftSize,
    draftIconSize,
    draftCSS,
    snapshot
  ]);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    if (
      !deepShallowEqual(
        draftGrid as unknown as Record<string, unknown>,
        snapshot.gridSettings as unknown as Record<string, unknown>
      )
    ) {
      await onGridSettingsUpdate(draftGrid);
    }
    if (
      !shallowEqual(
        draftSettings as unknown as Record<string, unknown>,
        snapshot.settings as unknown as Record<string, unknown>
      )
    ) {
      for (const key of Object.keys(draftSettings) as (keyof Settings)[]) {
        if (draftSettings[key] !== snapshot.settings[key]) {
          await onSettingChange(key, draftSettings[key] as boolean | string);
        }
      }
    }
    if (
      !shallowEqual(
        draftTheme as unknown as Record<string, unknown>,
        snapshot.colorTheme as unknown as Record<string, unknown>
      )
    ) {
      for (const key of Object.keys(draftTheme) as (keyof ColorTheme)[]) {
        if (draftTheme[key] !== snapshot.colorTheme[key]) {
          await onThemeChange(key, draftTheme[key]);
        }
      }
    }
    if (draftSize !== snapshot.size) await onSizeChange(draftSize);
    if (draftIconSize !== snapshot.iconSize)
      await onIconSizeChange(draftIconSize);
    if (draftCSS !== snapshot.customCSS) await onCustomCSSChange(draftCSS);
    onClose();
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const updateGridCssValue = (key: string, value: string): void => {
    const settingsKey = cssToSettingsKey[key];
    if (settingsKey) {
      const parsed = Number(value);
      setDraftGrid(prev => ({
        ...prev,
        [settingsKey]: Number.isNaN(parsed) ? value : parsed
      }));
    }
  };

  const handleMarginChange = (margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }) => {
    setDraftGrid(prev => ({ ...prev, margin }));
  };

  return {
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
    handleConfirmDiscard: onClose,
    updateGridCssValue,
    handleMarginChange
  };
}
