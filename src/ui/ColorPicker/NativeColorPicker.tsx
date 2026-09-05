import { clsx } from "clsx";

import { parseColor, hslToRgb, rgbToHex } from "../utils/colorUtils";

import type { ColorPickerProps } from "./ColorPicker.type";
import { truncate } from "./ColorPicker.utils";
import * as styles from "./ColorPicker.css";

export function NativeColorPicker({
  value,
  onChange,
  className
}: Pick<ColorPickerProps, "value" | "onChange" | "className">) {
  const hsla = parseColor(value);
  const hex = rgbToHex(...hslToRgb(hsla.h, hsla.s, hsla.l));

  return (
    <div className={clsx(styles.wrapper, className)}>
      <label className={styles.trigger}>
        <span className={styles.swatch} style={{ background: hex }} />
        <span>{truncate(value, 22)}</span>
        <input
          type="color"
          value={hex}
          onChange={e => onChange(e.target.value)}
          className={styles.nativeInput}
        />
      </label>
    </div>
  );
}
