import React from "react";
import clsx from "clsx";

import * as styles from "./Toggle.css";

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export function Toggle({
  checked,
  onChange,
  disabled,
  label,
  className
}: ToggleProps): React.ReactElement {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={clsx(styles.wrapper, className)}
      data-disabled={disabled || undefined}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={styles.track}
        data-checked={checked || undefined}
        onClick={handleClick}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
