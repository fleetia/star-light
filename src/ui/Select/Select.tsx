import React from "react";
import clsx from "clsx";
import * as styles from "./Select.css";

export type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
};

export function Select({
  value,
  onChange,
  children,
  size = "md",
  className,
  disabled
}: SelectProps): React.ReactElement {
  return (
    <select
      className={clsx(styles.size[size], className)}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

export type SelectLabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function SelectLabel({
  children,
  className
}: SelectLabelProps): React.ReactElement {
  return <span className={clsx(styles.label, className)}>{children}</span>;
}

export type SelectGroupProps = {
  children: React.ReactNode;
  className?: string;
};

export function SelectGroup({
  children,
  className
}: SelectGroupProps): React.ReactElement {
  return <div className={clsx(styles.wrapper, className)}>{children}</div>;
}
