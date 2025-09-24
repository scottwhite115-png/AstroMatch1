'use client'

import React from "react";
import Logo from "@/components/Logo";
import BottomNavigation from "@/components/BottomNavigation";

export default function Home() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={{
        background: 'linear-gradient(to top, #fef3c7, #fce7f3, #1e40af)',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto'
      }}
    >
      {/* Logo */}
      <div className="mt-12 text-center">
        <Logo />
      </div>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
