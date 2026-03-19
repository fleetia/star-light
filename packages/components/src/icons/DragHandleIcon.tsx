import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

function DragHandleIcon({
  width = 14,
  height = 14,
  ...props
}: IconProps): React.ReactElement {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <circle cx="6" cy="3.5" r="1.5" />
      <circle cx="10" cy="3.5" r="1.5" />
      <circle cx="6" cy="8" r="1.5" />
      <circle cx="10" cy="8" r="1.5" />
      <circle cx="6" cy="12.5" r="1.5" />
      <circle cx="10" cy="12.5" r="1.5" />
    </svg>
  );
}

export { DragHandleIcon };
