import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

function TriangleUpIcon({
  width = 12,
  height = 8,
  ...props
}: IconProps): React.ReactElement {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 8"
      fill="none"
      {...props}
    >
      <path d="M6 0L12 8H0L6 0Z" fill="currentColor" />
    </svg>
  );
}

export { TriangleUpIcon };
