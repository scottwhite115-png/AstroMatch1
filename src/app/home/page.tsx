'use client'

import React from "react";
import SparkleBig from "@/components/SparkleBig";
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
        <div style={{ transform: 'translateY(12px)', marginLeft: '0px' }}>
          <SparkleBig size={48} color="#ff7a00" />
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
