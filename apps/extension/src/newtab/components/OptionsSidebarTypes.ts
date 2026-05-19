import type { Dispatch, RefObject, SetStateAction } from "react";

import type { Locale } from "@star-light/components/i18n";
import type { ColorTheme } from "@star-light/components/theme";

import type { BackgroundMedia } from "../hooks/useBackgroundImage";
import type {
  Bookmark,
  GridSettings,
  GroupPreference,
  Settings
} from "../types";

export type PrimaryTab = "appearance" | "layout" | "css" | "groups" | "general";
export type AppearanceSub = "background" | "container" | "bookmark" | "folder";

export type OptionsSidebarProps = {
  gridSettings: GridSettings;
  settings: Settings;
  size: number;
  iconSize: number;
  onClose: () => void;
  onGridSettingChange: (
    key: keyof GridSettings,
    value: number | string
  ) => Promise<void>;
  onGridSettingsUpdate: (settings: GridSettings) => Promise<void>;
  onSettingChange: (
    key: keyof Settings,
    value: boolean | string
  ) => Promise<void>;
  onSizeChange: (value: number) => Promise<void>;
  onIconSizeChange: (value: number) => Promise<void>;
  onBackgroundUrl: (url: string) => Promise<void>;
  onBackgroundFile: (file: File) => Promise<void>;
  isBackgroundProcessing: boolean;
  onBackgroundClear: () => Promise<void>;
  backgroundMeta: BackgroundMedia | null | undefined;
  colorTheme: ColorTheme;
  onThemeChange: (key: keyof ColorTheme, value: string) => Promise<void>;
  onThemeReset: () => Promise<void>;
  onThemePreset: (preset: ColorTheme) => Promise<void>;
  orderedTree: Bookmark[];
  rootPath: string[];
  groupPreferences: GroupPreference[];
  onSelectRoot: (path: string[]) => void;
  onSiblingReorder: (parentKey: string, titles: string[]) => void;
  onToggleVisibility: (key: string) => void;
  customCSS: string;
  onCustomCSSChange: (css: string) => Promise<void>;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export type DraftStateProps = {
  draftGrid: GridSettings;
  draftSettings: Settings;
  draftTheme: ColorTheme;
  draftSize: number;
  draftIconSize: number;
  draftCSS: string;
  setDraftGrid: Dispatch<SetStateAction<GridSettings>>;
  setDraftSettings: Dispatch<SetStateAction<Settings>>;
  setDraftTheme: Dispatch<SetStateAction<ColorTheme>>;
  setDraftSize: Dispatch<SetStateAction<number>>;
  setDraftIconSize: Dispatch<SetStateAction<number>>;
  setDraftCSS: Dispatch<SetStateAction<string>>;
};

export type SettingsFileInputRef = RefObject<HTMLInputElement | null>;
