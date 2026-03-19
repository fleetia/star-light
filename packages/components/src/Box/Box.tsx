import React, { useId } from "react";
import clsx from "clsx";

import * as styles from "./Box.css";

export type BoxProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Box({
  title,
  subtitle,
  children,
  className
}: BoxProps): React.ReactElement {
  const titleId = useId();
  const hasHeader = title != null || subtitle != null;
  const isStringTitle = typeof title === "string";

  return (
    <section
      role={isStringTitle ? "group" : undefined}
      aria-labelledby={isStringTitle ? titleId : undefined}
      className={clsx(styles.container, className)}
    >
      {hasHeader && (
        <div className={styles.header}>
          {isStringTitle ? (
            <span id={titleId} className={styles.title}>
              {title}
            </span>
          ) : (
            title
          )}
          {subtitle != null &&
            (typeof subtitle === "string" ? (
              <span className={styles.subtitle}>{subtitle}</span>
            ) : (
              subtitle
            ))}
        </div>
      )}
      {children}
    </section>
  );
}
