import React, { useId } from "react";
import clsx from "clsx";

import * as styles from "./RadioGroup.css";

export type RadioOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type RadioGroupProps<T extends string = string> = {
  name?: string;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
};

export function RadioGroup<T extends string = string>({
  name,
  options,
  value,
  onChange,
  disabled,
  className
}: RadioGroupProps<T>): React.ReactElement {
  const groupId = useId();
  const groupName = name ?? groupId;

  return (
    <div role="radiogroup" className={clsx(styles.group, className)}>
      {options.map(option => {
        const isDisabled = disabled || option.disabled;
        return (
          <label
            key={option.value}
            className={styles.label}
            data-disabled={isDisabled || undefined}
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={isDisabled}
              className={styles.input}
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
