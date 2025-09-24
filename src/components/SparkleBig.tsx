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
              L40 40
              L0 50
              L40 60
              L50 100
              L60 60
              L100 50
              L60 40
              L50 0
              Z
            "
            fill={color}
          />
    </svg>
  );
}
