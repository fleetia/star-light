import React, { useId } from "react";
import clsx from "clsx";

import * as styles from "./TextInput.css";

export type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  min,
  max,
  step,
  className
}: TextInputProps): React.ReactElement {
  const inputId = useId();
  const errorId = useId();

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={clsx(styles.input, error && styles.inputError)}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
