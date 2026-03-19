import React from "react";
import { clsx } from "clsx";

import { ChevronLeftIcon, ChevronRightIcon } from "../icons";
import { useTranslation } from "../i18n";

import * as styles from "./NavigationButton.css";

export type NavigationButtonProps = {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
};

function NavigationButton({
  direction,
  onClick,
  className
}: NavigationButtonProps): React.ReactElement {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={clsx(styles.pageButton, className)}
      aria-label={
        direction === "left" ? t("navigation.previous") : t("navigation.next")
      }
    >
      {direction === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
}

export { NavigationButton };
