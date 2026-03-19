import React, { useId } from "react";

import { useTranslation } from "../i18n";
import { useFocusTrap } from "../hooks/useFocusTrap";

import type { ConfirmDialogProps } from "./ConfirmDialog.type";
import * as styles from "./ConfirmDialog.css";

export type { ConfirmDialogProps };

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel: confirmLabelProp,
  cancelLabel: cancelLabelProp
}: ConfirmDialogProps): React.ReactElement | null {
  const { t } = useTranslation();
  const messageId = useId();
  const dialogRef = useFocusTrap({
    enabled: isOpen,
    onEscape: onCancel,
    initialFocusSelector: `.${styles.cancelButton}`
  });

  const confirmLabel = confirmLabelProp ?? t("confirmDialog.confirm");
  const cancelLabel = cancelLabelProp ?? t("confirmDialog.cancel");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        onClick={e => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-describedby={messageId}
      >
        <h3 className={styles.title}>{title}</h3>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
