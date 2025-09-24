'use client'

import React from "react";
import Logo from "@/components/Logo";
import BottomNavigation from "@/components/BottomNavigation";

export default function Astrology() {
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

      {/* Astrology Content */}
      <div className="w-full max-w-md mx-auto px-4 mt-8">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Astrology</h2>
          
          {/* Western & Chinese Signs */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Signs</h3>
              <div className="flex justify-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl mb-1">♈</div>
                  <p className="text-sm text-gray-600">Western</p>
                  <p className="font-semibold">Aries</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🐉</div>
                  <p className="text-sm text-gray-600">Chinese</p>
                  <p className="font-semibold">Dragon</p>
                </div>
              </div>
            </div>

            {/* Compatibility Insights */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Compatibility Insights</h3>
              <div className="space-y-3">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Best matches:</strong> Fire signs (Leo, Sagittarius) and Earth dragons create passionate connections.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Element harmony:</strong> Your fire energy pairs well with air signs for intellectual stimulation.
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Insight */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Today's Insight</h3>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-orange-800 text-center">
                  Your dragon energy is particularly strong today. Perfect for making meaningful connections!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
