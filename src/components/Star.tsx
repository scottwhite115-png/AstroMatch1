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
          C37 28, 28 37, 0 50
          C28 63, 37 72, 50 100
          C63 72, 72 63, 100 50
          C72 37, 63 28, 50 0
          Z
        "
        fill={color}
      />
    </svg>
  );
}
