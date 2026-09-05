import React from "react";
import clsx from "clsx";

import * as styles from "./Button.css";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-busy"?: boolean;
};

export function Button({
  variant = "secondary",
  size = "md",
  disabled,
  children,
  onClick,
  type = "button",
  className,
  "aria-busy": ariaBusy
}: ButtonProps): React.ReactElement {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-busy={ariaBusy}
      onClick={onClick}
      className={clsx(styles.size[size], styles.variant[variant], className)}
    >
      {children}
    </button>
  );
}
