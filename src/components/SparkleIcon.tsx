import React from "react";
import SparkleBig from "./SparkleBig";

interface SparkleIconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export default function SparkleIcon({ size = 24, color = "#ff7a00", style }: SparkleIconProps) {
  return (
    <div style={{ transform: 'translateY(20px)', marginLeft: '10px', ...style }}>
      <SparkleBig size={size} color={color} />
    </div>
  );
}
