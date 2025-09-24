import React from "react";

export default function TwinkleBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-red-500">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-pink-200 to-blue-800" />
    </div>
  );
}


