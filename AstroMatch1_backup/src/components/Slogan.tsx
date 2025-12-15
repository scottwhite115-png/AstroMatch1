import React from "react";

interface SloganProps {
  text?: string;
  fontSize?: string;
  color?: string;
  marginTop?: string;
  marginLeft?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Slogan({ 
  text = "Find harmony in the stars",
  fontSize = "text-lg",
  color = "#ff7a00",
  marginTop = "0px",
  marginLeft = "90px",
  className = "font-semibold",
  style = {}
}: SloganProps) {
  return (
    <p 
      className={`${className} ${fontSize}`}
      style={{ 
        color, 
        marginTop, 
        marginLeft,
        ...style 
      }}
    >
      {text}
    </p>
  );
}
