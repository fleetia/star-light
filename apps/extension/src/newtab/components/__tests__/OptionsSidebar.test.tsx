import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { I18nProvider } from "@star-light/components/i18n";

import { defaultOptionValue } from "../../defaultOptionValue";
import { OptionsSidebar } from "../OptionsSidebar";
import type { OptionsSidebarProps } from "../OptionsSidebarTypes";

const exportImportMocks = vi.hoisted(() => ({
  exportFull: vi.fn(),
  exportToJson: vi.fn(),
  importFromJson: vi.fn(),
  importFull: vi.fn()
}));

vi.mock("@/utils/exportImport", () => exportImportMocks);

function createProps(): OptionsSidebarProps {
  return {
    gridSettings: structuredClone(defaultOptionValue.gridSettings),
    settings: structuredClone(defaultOptionValue.settings),
    size: defaultOptionValue.displaySize,
    iconSize: 24,
    onClose: vi.fn(),
    onGridSettingChange: vi.fn().mockResolvedValue(undefined),
    onGridSettingsUpdate: vi.fn().mockResolvedValue(undefined),
    onSettingChange: vi.fn().mockResolvedValue(undefined),
    onSizeChange: vi.fn().mockResolvedValue(undefined),
    onIconSizeChange: vi.fn().mockResolvedValue(undefined),
    onBackgroundUrl: vi.fn().mockResolvedValue(undefined),
    onBackgroundFile: vi.fn().mockResolvedValue(undefined),
    isBackgroundProcessing: false,
    onBackgroundClear: vi.fn().mockResolvedValue(undefined),
    backgroundMeta: {
      type: "image",
      source: "url",
      url: "https://example.com/bg.png"
    },
    colorTheme: structuredClone(defaultOptionValue.colorTheme),
    onThemeChange: vi.fn().mockResolvedValue(undefined),
    onThemeReset: vi.fn().mockResolvedValue(undefined),
    onThemePreset: vi.fn().mockResolvedValue(undefined),
    orderedTree: [
      {
        title: "Work",
        route: ["Work"],
        children: [
          {
            title: "Docs",
            route: ["Work", "Docs"],
            url: "https://example.com/docs"
          }
        ]
      }
    ],
    rootPath: ["Work"],
    groupPreferences: [],
    onSelectRoot: vi.fn(),
    onSiblingReorder: vi.fn(),
    onToggleVisibility: vi.fn(),
    customCSS: ".bookmark { color: red; }",
    onCustomCSSChange: vi.fn().mockResolvedValue(undefined),
    locale: "en",
    onLocaleChange: vi.fn()
  };
}

function renderSidebar(props = createProps()) {
  return {
    props,
    ...render(
      <I18nProvider locale="en">
        <OptionsSidebar {...props} />
      </I18nProvider>
    )
  };
}

describe("OptionsSidebar baseline", () => {
  beforeEach(() => {
    exportImportMocks.exportFull.mockResolvedValue({
      gridSettings: defaultOptionValue.gridSettings,
      settings: defaultOptionValue.settings,
      colorTheme: defaultOptionValue.colorTheme,
      customCSS: ".bookmark { color: red; }"
    });
  });

  it("renders primary tabs and starts on the general settings tab", () => {
    renderSidebar();

    expect(screen.getByRole("button", { name: "General" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Appearance" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Layout" })).toBeDefined();
    expect(screen.getByRole("button", { name: "CSS" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Groups" })).toBeDefined();
    expect(screen.getByText("Language")).toBeDefined();
    expect(screen.getByText("Export / Import")).toBeDefined();

    const saveButton = screen.getByRole("button", {
      name: "Save"
    }) as HTMLButtonElement;
    expect(saveButton.disabled).toBe(true);
  });

  it("keeps general changes in draft state until save", async () => {
    const { props } = renderSidebar();

    fireEvent.click(screen.getByLabelText("Open in new tab by default"));

    expect(props.onSettingChange).not.toHaveBeenCalled();

    const saveButton = screen.getByRole("button", {
      name: "Save"
    }) as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(props.onSettingChange).toHaveBeenCalledWith(
        "isOpenInNewTab",
        true
      );
    });
    expect(props.onClose).toHaveBeenCalled();
  });

  it("keeps background URL input across tab switches and applies trimmed URL", () => {
    const { props } = renderSidebar();

    fireEvent.click(screen.getByRole("button", { name: "Appearance" }));
    const urlInput = screen.getByPlaceholderText(
      "Enter URL"
    ) as HTMLInputElement;
    fireEvent.change(urlInput, {
      target: { value: "  https://example.com/new-bg.png  " }
    });

    fireEvent.click(screen.getByRole("button", { name: "Layout" }));
    fireEvent.click(screen.getByRole("button", { name: "Appearance" }));

    expect(
      (screen.getByPlaceholderText("Enter URL") as HTMLInputElement).value
    ).toBe("  https://example.com/new-bg.png  ");

    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(props.onBackgroundUrl).toHaveBeenCalledWith(
      "https://example.com/new-bg.png"
    );
  });

  it("exports the current settings payload as a Starlit JSON file", async () => {
    const { props } = renderSidebar();

    fireEvent.click(screen.getByRole("button", { name: "Export" }));

    await waitFor(() => {
      expect(exportImportMocks.exportFull).toHaveBeenCalledWith(
        props.gridSettings,
        props.settings,
        props.colorTheme,
        props.backgroundMeta,
        props.customCSS
      );
      expect(exportImportMocks.exportToJson).toHaveBeenCalledWith(
        expect.objectContaining({
          gridSettings: defaultOptionValue.gridSettings,
          settings: defaultOptionValue.settings,
          colorTheme: defaultOptionValue.colorTheme
        }),
        "starlit-settings.json"
      );
    });
  });
});
