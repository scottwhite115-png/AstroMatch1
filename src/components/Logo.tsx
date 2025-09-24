import React from "react";
import SparkleIcon from "./SparkleIcon";
import AstroMatchText from "./AstroMatchText";

interface LogoProps {
  starSize?: number;
  starColor?: string;
  textSize?: string;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ 
  starSize = 14, 
  starColor = "#ff7a00", 
  textSize = '1.75rem', 
  textColor = '#ff7a00',
  className = "flex items-start gap-2 select-none",
  style = {}
}: LogoProps) {
  return (
    <div className={className} style={style}>
      <SparkleIcon size={starSize} color={starColor} />
      <AstroMatchText fontSize={textSize} color={textColor} />
    </div>
  );
}


