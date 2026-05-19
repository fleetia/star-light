import type React from "react";
import classNames from "classnames/bind";

import { useTranslation } from "@star-light/components/i18n";

import styles from "../OptionsSidebar.module.scss";

const cx = classNames.bind(styles);

type CssTabProps = {
  draftCSS: string;
  setDraftCSS: React.Dispatch<React.SetStateAction<string>>;
};

export function CssTab({
  draftCSS,
  setDraftCSS
}: CssTabProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <label className={cx("subGroupTitle")}>{t("sidebar.css.title")}</label>
      <textarea
        className={cx("cssInput")}
        value={draftCSS}
        onChange={e => setDraftCSS(e.target.value)}
        placeholder={t("sidebar.css.placeholder")}
        spellCheck={false}
      />
    </>
  );
}
