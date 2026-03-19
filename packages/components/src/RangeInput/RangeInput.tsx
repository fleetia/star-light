import React, { useId } from "react";

import * as styles from "./RangeInput.css";

export type RangeInputProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue?: string;
  onChange: (value: number) => void;
};

function RangeInput({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange
}: RangeInputProps): React.ReactElement {
  const inputId = useId();

  return (
    <div className={styles.rangeInputWrapper}>
      <label htmlFor={inputId} className={styles.settingLabel}>
        <span className={styles.rangeLabel}>
          {label}: {displayValue ?? value}
        </span>
      </label>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={styles.rangeInput}
      />
    </div>
  );
}

export { RangeInput };
