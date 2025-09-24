import React from "react";

interface AstroMatchTextProps {
  fontSize?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function AstroMatchText({ 
  fontSize = '3rem', 
  color = '#ff7a00', 
  style = {},
  className = "text-5xl font-light tracking-wide"
}: AstroMatchTextProps) {
  return (
    <span 
      className={className}
      style={{ 
        fontSize, 
        transform: 'translateY(8px)', 
        color, 
        marginLeft: '25px',
        ...style 
      }}
    >
      AstroMatch
    </span>
  );
}
