import React from "react";
import SparkleBig from "./SparkleBig";

interface SparkleIconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export default function SparkleIcon({ size = 24, color = "#ff7a00", style }: SparkleIconProps) {
  return (
    <div style={{ transform: 'translateY(12px)', marginLeft: '14px', ...style }}>
      <SparkleBig size={size} color={color} />
    </div>
  );
}
