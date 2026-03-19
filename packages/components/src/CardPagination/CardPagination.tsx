import React from "react";

import { TriangleUpIcon, TriangleDownIcon } from "../icons";
import { useTranslation } from "../i18n";

import * as styles from "./CardPagination.css";

export type CardPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const CardPagination = React.memo(function CardPagination({
  currentPage,
  totalPages,
  onPrev,
  onNext
}: CardPaginationProps): React.ReactElement {
  const { t } = useTranslation();
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;
  return (
    <nav aria-label="Pagination" className={styles.cardNav}>
      <button
        className={styles.cardNavButton}
        onClick={onPrev}
        aria-label={t("pagination.previousPage")}
        disabled={isFirst}
        aria-disabled={isFirst}
      >
        <TriangleUpIcon />
      </button>
      <span className={styles.cardNavIndicator} aria-current="page">
        {currentPage + 1}/{totalPages}
      </span>
      <button
        className={styles.cardNavButton}
        onClick={onNext}
        aria-label={t("pagination.nextPage")}
        disabled={isLast}
        aria-disabled={isLast}
      >
        <TriangleDownIcon />
      </button>
    </nav>
  );
});

export { CardPagination };
