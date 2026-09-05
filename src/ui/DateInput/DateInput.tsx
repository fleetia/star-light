import React, { useRef, useCallback } from "react";
import clsx from "clsx";

import * as styles from "./DateInput.css";

export type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  min?: string;
  max?: string;
  className?: string;
  hasError?: boolean;
};

function parse(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { year: y || 0, month: m || 0, day: d || 0 };
}

export function DateInput({
  value,
  onChange,
  onFocus,
  min,
  max,
  className,
  hasError
}: DateInputProps): React.ReactElement {
  const nativeRef = useRef<HTMLInputElement>(null);
  const { year, month, day } = parse(value);

  const handleNativeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) onChange(e.target.value);
    },
    [onChange]
  );

  const handleClick = useCallback(() => {
    nativeRef.current?.showPicker();
  }, []);

  return (
    <div
      className={clsx(styles.input, hasError && styles.inputError, className)}
      onClick={handleClick}
    >
      <span className={styles.segment}>{year || "YYYY"}</span>
      <span className={styles.separator}>.</span>
      <span className={styles.segment}>{month || "MM"}</span>
      <span className={styles.separator}>.</span>
      <span className={styles.segment}>{day || "DD"}</span>
      <input
        ref={nativeRef}
        type="date"
        className={styles.nativeInput}
        value={value}
        min={min}
        max={max}
        onChange={handleNativeChange}
        onFocus={onFocus}
        tabIndex={-1}
        aria-hidden
      />
    </div>
  );
}
