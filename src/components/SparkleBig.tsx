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
              C42 35, 35 42, 0 50
              C35 58, 42 65, 50 100
              C58 65, 65 58, 100 50
              C65 42, 58 35, 50 0
              Z
            "
            fill={color}
          />
    </svg>
  );
}
