import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
};

function ChevronLeftIcon({
  width = 24,
  height = 24,
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
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { ChevronLeftIcon };
