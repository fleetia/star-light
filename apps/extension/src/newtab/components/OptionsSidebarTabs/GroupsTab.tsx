import type React from "react";

import type { Bookmark, GroupPreference } from "../../types";
import { BookmarkTreeSelector } from "../BookmarkTreeSelector";

type GroupsTabProps = {
  orderedTree: Bookmark[];
  rootPath: string[];
  groupPreferences: GroupPreference[];
  onSelectRoot: (path: string[]) => void;
  onSiblingReorder: (parentKey: string, titles: string[]) => void;
  onToggleVisibility: (key: string) => void;
};

export function GroupsTab({
  orderedTree,
  rootPath,
  groupPreferences,
  onSelectRoot,
  onSiblingReorder,
  onToggleVisibility
}: GroupsTabProps): React.ReactElement {
  return (
    <BookmarkTreeSelector
      bookmarks={orderedTree}
      rootPath={rootPath}
      groupPreferences={groupPreferences}
      onSelectRoot={onSelectRoot}
      onSiblingReorder={onSiblingReorder}
      onToggleVisibility={onToggleVisibility}
    />
  );
}
