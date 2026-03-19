import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  width?: string;
  height?: string;
};

function FolderIcon({
  width = "60%",
  height = "60%",
  ...props
}: IconProps): React.ReactElement {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
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
  );
}

export { FolderIcon };
