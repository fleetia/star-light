import type React from "react";

type BaseIconButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  layout?: "vertical" | "horizontal";
};

type NormalIconButtonProps = BaseIconButtonProps & {
  type: "normal";
  iconUrl?: string;
  name: string;
  bookmarkId?: string;
  url?: string;
  folderKey?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
};

type FolderIconButtonProps = BaseIconButtonProps & {
  type: "folder";
  name: string;
  iconUrl?: string;
  bookmarkId?: string;
  folderKey?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
};

type EmptyIconButtonProps = BaseIconButtonProps & {
  type: "empty";
};

export type IconButtonProps =
  | NormalIconButtonProps
  | FolderIconButtonProps
  | EmptyIconButtonProps;
