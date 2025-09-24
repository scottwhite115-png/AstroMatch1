import React from "react";

type Props = {
  size?: number;      // px
  color?: string;     // fill color
};

export default function SparkleBig({ size = 48, color = "#ff7a00" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="sparkle"
    >
      {/* Big sparkle: smooth four-point star */}
      <path
        d="
          M50 0
          C37 40, 40 37, 0 50
          C40 60, 37 60, 50 100
          C60 60, 60 63, 100 50
          C60 37, 63 40, 50 0
          Z
        "
        fill={color}
      />
    </svg>
  );
}
