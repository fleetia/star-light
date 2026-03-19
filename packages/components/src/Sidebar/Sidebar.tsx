import React from "react";
import { clsx } from "clsx";

import * as styles from "./Sidebar.css";

export type SidebarProps = {
  children: React.ReactNode;
  className?: string;
  position?: "left" | "right";
  "aria-label"?: string;
  ref?: React.Ref<HTMLElement>;
};

function Sidebar({
  children,
  className,
  position = "right",
  "aria-label": ariaLabel,
  ref
}: SidebarProps) {
  return (
    <section
      ref={ref}
      className={clsx(
        styles.sidebar,
        position === "right" ? styles.sidebarRight : styles.sidebarLeft,
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

export { Sidebar };
