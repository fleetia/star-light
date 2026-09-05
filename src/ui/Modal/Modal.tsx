import React, { useId } from "react";
import clsx from "clsx";

import { useTranslation } from "../i18n";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

import type { ModalProps } from "./Modal.type";
import * as styles from "./Modal.css";

export type { ModalProps };

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  title,
  className
}: ModalProps): React.ReactElement | null {
  const { t } = useTranslation();
  const titleId = useId();
  const modalRef = useFocusTrap({ enabled: isOpen, onEscape: onClose });

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className={clsx(styles.modal[size], className)}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label={t("modal.close")}
            >
              &times;
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
