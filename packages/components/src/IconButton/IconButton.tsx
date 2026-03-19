import React from "react";
import { clsx } from "clsx";

import { useTranslation } from "../i18n";

import type { IconButtonProps } from "./IconButton.type";
import * as styles from "./IconButton.css";

export type { IconButtonProps };

const IconButton = React.memo(function IconButton(
  props: IconButtonProps
): React.ReactElement {
  const { type, onClick, layout } = props;
  const isHorizontal = layout === "horizontal";
  const { t } = useTranslation();

  if (type === "folder") {
    const { name, iconUrl, onContextMenu, bookmarkId, folderKey } = props;
    return (
      <button
        className={clsx(
          styles.IconButton,
          styles.folder,
          isHorizontal && styles.horizontal
        )}
        onClick={onClick}
        onContextMenu={e =>
          onContextMenu ? onContextMenu(e) : e.preventDefault()
        }
        aria-label={name}
        data-bookmark-id={bookmarkId}
        data-folder-key={folderKey}
      >
        <div className={clsx(styles.icon, iconUrl && styles.hasIcon)}>
          {iconUrl ? (
            <img src={iconUrl} alt={name} />
          ) : (
            <svg
              width="60%"
              height="60%"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H12L10 5H5C3.89543 5 3 5.89543 3 7Z"
                fill="currentColor"
                opacity="0.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className={styles.name}>{name}</span>
      </button>
    );
  }

  if (type === "empty") {
    return (
      <button
        className={clsx(
          styles.IconButton,
          styles.empty,
          isHorizontal && styles.horizontal
        )}
        onClick={onClick}
        onContextMenu={e => e.preventDefault()}
        aria-label={t("iconButton.add")}
      >
        <div className={styles.icon}>+</div>
        <span className={styles.name}>{t("iconButton.add")}</span>
      </button>
    );
  }

  const { iconUrl, name, onContextMenu, bookmarkId, url, folderKey } = props;

  return (
    <button
      className={clsx(styles.IconButton, isHorizontal && styles.horizontal)}
      onClick={onClick}
      onContextMenu={e =>
        onContextMenu ? onContextMenu(e) : e.preventDefault()
      }
      aria-label={name}
      data-bookmark-id={bookmarkId}
      data-url={url}
      data-folder-key={folderKey}
    >
      <div className={clsx(styles.icon, iconUrl && styles.hasIcon)}>
        {iconUrl ? (
          <img src={iconUrl} alt={name} />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <span className={styles.name}>{name}</span>
    </button>
  );
});

export { IconButton };
