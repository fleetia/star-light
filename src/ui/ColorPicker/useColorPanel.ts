import { useEffect, useRef, useState } from "react";

import type { ColorPickerProps } from "./ColorPicker.type";

export function useColorPanel(align: ColorPickerProps["align"] = "right") {
  const [open, setOpen] = useState(false);
  const [panelPos, setPanelPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    if (!open) {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        const panelW = 240;
        const panelH = 340;
        const flipUp = rect.bottom + panelH > window.innerHeight;
        const top = flipUp ? rect.top - panelH - 4 : rect.bottom + 4;
        let left = align === "left" ? rect.left : rect.right - panelW;
        // clamp to viewport
        left = Math.max(4, Math.min(left, window.innerWidth - panelW - 4));
        setPanelPos({ top, left });
      }
    }
    setOpen(!open);
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return { open, setOpen, panelPos, wrapperRef, toggleOpen };
}
