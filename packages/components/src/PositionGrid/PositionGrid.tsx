import React from "react";
import { clsx } from "clsx";

import { useTranslation } from "../i18n";

import type { MarginValues, PositionGridProps } from "./PositionGrid.type";
import * as styles from "./PositionGrid.css";

export type { MarginValues, PositionGridProps };

function PositionGrid({
  value,
  options,
  onChange,
  margin,
  onMarginChange
}: PositionGridProps): React.ReactElement {
  const { t } = useTranslation();

  const handleMargin = (side: keyof MarginValues, val: number) => {
    if (!onMarginChange || !margin) return;
    onMarginChange({ ...margin, [side]: val });
  };

  return (
    <div
      className={styles.positionWrapper}
      role="group"
      aria-label={t("positionGrid.group")}
    >
      {margin && onMarginChange ? (
        <>
          <div className={styles.marginTop}>
            <input
              type="number"
              className={styles.marginInput}
              value={margin.top}
              onChange={e => handleMargin("top", Number(e.target.value))}
              min={0}
              aria-label={t("positionGrid.margin.top")}
            />
            <span className={styles.marginUnit}>px</span>
          </div>
          <div className={styles.marginMiddle}>
            <div className={styles.marginSide}>
              <input
                type="number"
                className={styles.marginInput}
                value={margin.left}
                onChange={e => handleMargin("left", Number(e.target.value))}
                min={0}
                aria-label={t("positionGrid.margin.left")}
              />
              <span className={styles.marginUnit}>px</span>
            </div>
            <div className={styles.positionGrid}>
              {options.map(pos => (
                <button
                  key={pos}
                  className={clsx(
                    styles.positionCell,
                    value === pos && styles.positionActive
                  )}
                  onClick={() => onChange(pos)}
                  aria-label={pos}
                />
              ))}
            </div>
            <div className={styles.marginSide}>
              <input
                type="number"
                className={styles.marginInput}
                value={margin.right}
                onChange={e => handleMargin("right", Number(e.target.value))}
                min={0}
                aria-label={t("positionGrid.margin.right")}
              />
              <span className={styles.marginUnit}>px</span>
            </div>
          </div>
          <div className={styles.marginBottom}>
            <input
              type="number"
              className={styles.marginInput}
              value={margin.bottom}
              onChange={e => handleMargin("bottom", Number(e.target.value))}
              min={0}
              aria-label={t("positionGrid.margin.bottom")}
            />
            <span className={styles.marginUnit}>px</span>
          </div>
        </>
      ) : (
        <div className={styles.positionGrid}>
          {options.map(pos => (
            <button
              key={pos}
              className={clsx(
                styles.positionCell,
                value === pos && styles.positionActive
              )}
              onClick={() => onChange(pos)}
              aria-label={pos}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { PositionGrid };
