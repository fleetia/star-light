import React, { useState, useId } from "react";
import * as styles from "./CollapsibleSection.css";

export type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function CollapsibleSection({
  title,
  defaultOpen = false,
  children
}: CollapsibleSectionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={styles.item}>
      <button
        className={styles.title}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        {title}
      </button>
      {isOpen && (
        <div id={contentId} className={styles.body}>
          {children}
        </div>
      )}
    </div>
  );
}

export { CollapsibleSection };
