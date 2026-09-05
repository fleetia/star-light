import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";

import { type ColorFormat, hslToRgb, rgbToHex } from "../utils/colorUtils";

import type { ColorPickerProps } from "./ColorPicker.type";
import { truncate } from "./ColorPicker.utils";
import { useColorWheel } from "./useColorWheel";
import { useColorPanel } from "./useColorPanel";
import { isTouchDevice } from "./ColorPicker.constants";
import { NativeColorPicker } from "./NativeColorPicker";
import * as styles from "./ColorPicker.css";

function ColorPicker({
  value,
  onChange,
  showAlpha = false,
  align = "right",
  className
}: ColorPickerProps) {
  const {
    hsla,
    format,
    setFormat,
    displayValue,
    swatchColor,
    canvasRef,
    alphaTrackRef,
    drawWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleAlphaPointerDown,
    handleAlphaPointerMove,
    handleFieldChange,
    handleHexInput
  } = useColorWheel(value, onChange, showAlpha);

  const { open, setOpen, panelPos, wrapperRef, toggleOpen } =
    useColorPanel(align);

  useEffect(() => {
    if (open) drawWheel();
  }, [open, drawWheel]);

  return (
    <div className={clsx(styles.wrapper, className)} ref={wrapperRef}>
      <button type="button" className={styles.trigger} onClick={toggleOpen}>
        <span className={styles.swatch} style={{ background: swatchColor }} />
        <span>{truncate(displayValue, 22)}</span>
      </button>

      {open &&
        createPortal(
          <>
            <div
              className={styles.backdrop}
              onClick={() => setOpen(false)}
              aria-label="Close color picker"
            />
            <div
              className={styles.panel}
              style={
                panelPos
                  ? { top: panelPos.top, left: panelPos.left }
                  : undefined
              }
              role="dialog"
              aria-label="Color picker"
            >
              <div className={styles.canvasWrap}>
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
              </div>

              {showAlpha && (
                <div className={styles.alphaSection}>
                  <span className={styles.alphaLabel}>
                    Alpha: {Math.round(hsla.a * 100)}%
                  </span>
                  <div
                    ref={alphaTrackRef}
                    className={styles.alphaTrack}
                    onPointerDown={handleAlphaPointerDown}
                    onPointerMove={handleAlphaPointerMove}
                    onPointerUp={handlePointerUp}
                  >
                    <div
                      className={styles.alphaGradient}
                      style={{
                        background: `linear-gradient(to right, transparent, ${rgbToHex(...hslToRgb(hsla.h, hsla.s, hsla.l))})`
                      }}
                    />
                    <div
                      className={styles.alphaThumb}
                      style={{ left: `${hsla.a * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className={styles.formatRow}>
                {(["hex", "rgba", "hsla"] as ColorFormat[]).map(f => (
                  <button
                    key={f}
                    type="button"
                    className={clsx(
                      styles.formatButton,
                      format === f && styles.formatButtonActive
                    )}
                    onClick={() => setFormat(f)}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>

              {format === "hex" && (
                <div className={styles.inputRow}>
                  <div className={styles.fieldGroup}>
                    <input
                      className={styles.fieldInput}
                      value={rgbToHex(...hslToRgb(hsla.h, hsla.s, hsla.l))}
                      onChange={e => handleHexInput(e.target.value)}
                    />
                    <span className={styles.fieldLabel}>HEX</span>
                  </div>
                </div>
              )}

              {format === "rgba" &&
                (() => {
                  const [r, g, b] = hslToRgb(hsla.h, hsla.s, hsla.l);
                  const fields = [
                    { label: "R", field: "r", value: r, max: 255 },
                    { label: "G", field: "g", value: g, max: 255 },
                    { label: "B", field: "b", value: b, max: 255 },
                    ...(showAlpha
                      ? [{ label: "A", field: "a", value: hsla.a, max: 1 }]
                      : [])
                  ];
                  return (
                    <div className={styles.inputRow}>
                      {fields.map(({ label, field, value: v }) => (
                        <div key={field} className={styles.fieldGroup}>
                          <input
                            className={styles.fieldInput}
                            type="number"
                            step={field === "a" ? 0.01 : 1}
                            value={v}
                            onChange={e =>
                              handleFieldChange(field, e.target.value)
                            }
                          />
                          <span className={styles.fieldLabel}>{label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

              {format === "hsla" &&
                (() => {
                  const fields = [
                    { label: "H", field: "h", value: hsla.h },
                    { label: "S", field: "s", value: hsla.s },
                    { label: "L", field: "l", value: hsla.l },
                    ...(showAlpha
                      ? [{ label: "A", field: "a", value: hsla.a }]
                      : [])
                  ];
                  return (
                    <div className={styles.inputRow}>
                      {fields.map(({ label, field, value: v }) => (
                        <div key={field} className={styles.fieldGroup}>
                          <input
                            className={styles.fieldInput}
                            type="number"
                            step={field === "a" ? 0.01 : 1}
                            value={v}
                            onChange={e =>
                              handleFieldChange(field, e.target.value)
                            }
                          />
                          <span className={styles.fieldLabel}>{label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

function ColorPickerSwitch(props: ColorPickerProps) {
  return isTouchDevice ? (
    <NativeColorPicker
      value={props.value}
      onChange={props.onChange}
      className={props.className}
    />
  ) : (
    <ColorPicker {...props} />
  );
}

const MemoizedColorPicker = React.memo(ColorPickerSwitch);
export { MemoizedColorPicker as ColorPicker };
export type { ColorPickerProps };
