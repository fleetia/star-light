import React from "react";

import { ColorPicker } from "../ColorPicker";

import * as styles from "./ColorRow.css";

export type ColorRowProps = {
  label: string;
  value: string;
  showAlpha?: boolean;
  onChange: (color: string) => void;
};

function ColorRow({
  label,
  value,
  showAlpha,
  onChange
}: ColorRowProps): React.ReactElement {
  return (
    <div className={styles.colorRow}>
      <span>{label}</span>
      <ColorPicker value={value} showAlpha={showAlpha} onChange={onChange} />
    </div>
  );
}

export { ColorRow };
