import React, { useId } from "react";
import clsx from "clsx";

import * as styles from "./Checkbox.css";

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
  className
}: CheckboxProps): React.ReactElement {
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={clsx(styles.wrapper, className)}
      data-disabled={disabled || undefined}
    >
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        aria-checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
