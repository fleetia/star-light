import React, { useId } from "react";
import clsx from "clsx";

import { DateInput } from "../DateInput";
import * as styles from "./TextInput.css";

export type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  type?: string;
  lang?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  className?: string;
};

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  type = "text",
  lang,
  min,
  max,
  step,
  className
}: TextInputProps): React.ReactElement {
  const inputId = useId();
  const errorId = useId();

  const isDate = type === "date";

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={isDate ? undefined : inputId} className={styles.label}>
          {label}
        </label>
      )}
      {isDate ? (
        <DateInput
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          min={typeof min === "string" ? min : undefined}
          max={typeof max === "string" ? max : undefined}
          hasError={!!error}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          lang={lang}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={clsx(styles.input, error && styles.inputError)}
        />
      )}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
