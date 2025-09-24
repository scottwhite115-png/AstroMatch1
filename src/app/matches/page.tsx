'use client'

import React from "react";
import Image from "next/image";
import { Star, MessageCircle } from "lucide-react";
import Logo from "@/components/Logo";
import BottomNavigation from "@/components/BottomNavigation";

export default function Matches() {
  const matches = [
    {
      id: 1,
      name: "Emily",
      age: 26,
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
      signs: "Leo-Tiger",
      compatibility: 92,
      lastMessage: "Hey! I love your astrology insights ✨",
      timeAgo: "2h ago"
    },
    {
      id: 2,
      name: "Jessica",
      age: 24,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      signs: "Sagittarius-Dragon",
      compatibility: 88,
      lastMessage: "The stars aligned for us to meet! 🌟",
      timeAgo: "1d ago"
    },
    {
      id: 3,
      name: "Maria",
      age: 29,
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      signs: "Gemini-Horse",
      compatibility: 85,
      lastMessage: "Coffee under the full moon? ☕🌙",
      timeAgo: "3d ago"
    },
    {
      id: 4,
      name: "Sophie",
      age: 27,
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
      signs: "Libra-Monkey",
      compatibility: 82,
      lastMessage: "Your energy is amazing! 💫",
      timeAgo: "1w ago"
    }
  ];

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
      <div className="mt-8 text-center">
        <Logo starSize={12} textSize='1.5rem' />
      </div>

      {/* Matches List */}
      <div className="w-full max-w-md mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Your Matches</h2>
        
        <div className="space-y-3">
          {matches.map((match) => (
            <div key={match.id} className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 hover:bg-white/95 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                {/* Profile Photo */}
                <div className="relative">
                  <Image
                    src={match.photo}
                    alt={`${match.name}'s profile`}
                    width={60}
                    height={60}
                    className="rounded-full"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Match Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {match.name}, {match.age}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                      <span className="text-gray-600 font-medium">{match.compatibility}%</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-purple-600 font-medium mb-2">{match.signs}</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                      {match.lastMessage}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{match.timeAgo}</span>
                  </div>
                </div>

                {/* Message Icon */}
                <div className="flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#ff7a00]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Matches Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#ff7a00] text-white px-4 py-2 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4" fill="currentColor" />
            <span>4 new matches today!</span>
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
