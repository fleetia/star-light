import React from "react";
import clsx from "clsx";

import * as styles from "./Badge.css";

export type BadgeProps = {
  variant?: "active" | "inactive" | "default";
  children: React.ReactNode;
  className?: string;
};

export function Badge({
  variant = "default",
  children,
  className
}: BadgeProps): React.ReactElement {
  return (
    <span
      role={variant !== "default" ? "status" : undefined}
      className={clsx(styles.variant[variant], className)}
    >
      {children}
    </span>
  );
}
