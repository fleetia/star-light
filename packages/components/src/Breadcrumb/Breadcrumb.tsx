import React from "react";
import { clsx } from "clsx";

import * as styles from "./Breadcrumb.css";

export type BreadcrumbItem = {
  label: string;
  onClick?: () => void;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function Breadcrumb({ items, className }: BreadcrumbProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className={clsx(styles.breadcrumb, className)}>
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && (
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
          )}
          <button
            className={clsx(
              styles.breadcrumbItem,
              i === items.length - 1 && styles.breadcrumbItemActive
            )}
            onClick={item.onClick}
            aria-current={i === items.length - 1 ? "page" : undefined}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

export { Breadcrumb };
