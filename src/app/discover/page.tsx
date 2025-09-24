'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, X, Star } from 'lucide-react'
import Logo from "@/components/Logo";
import BottomNavigation from "@/components/BottomNavigation";

export default function Discover() {
  const [currentPhoto, setCurrentPhoto] = useState(0)

  const photos = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
  ]

  const handleNextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % photos.length)
  }

  const handlePrevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handlePass = () => {
    // TODO: Implement pass logic
    console.log('Passed on this match')
  }

  const handleLike = () => {
    // TODO: Implement like logic
    console.log('Liked this match')
  }

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

      {/* Discovery Card */}
      <div className="w-full max-w-sm mx-auto px-4 mt-6">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
          <div className="relative h-[600px]">
            <Image
              src={photos[currentPhoto]}
              alt="Profile photo"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Photo indicators */}
            <div className="absolute top-4 right-4 flex space-x-1">
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`w-6 h-1 rounded-full ${
                    currentPhoto === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentPhoto(index)}
                />
              ))}
            </div>

            {/* Profile info */}
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-3xl font-bold">Sarah, 28</h2>
              <p className="text-purple-300 font-medium">Aries-Dragon</p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-sm font-semibold">87% Match</span>
              </div>
            </div>
          </div>

          {/* Touch areas for photo navigation */}
          <div className="absolute inset-0 flex justify-between items-center px-2">
            <button
              className="w-1/2 h-full"
              onClick={handlePrevPhoto}
              aria-label="Previous photo"
            />
            <button
              className="w-1/2 h-full"
              onClick={handleNextPhoto}
              aria-label="Next photo"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-8 mt-6">
          <button 
            onClick={handlePass}
            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
          <button 
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-[#ff7a00] flex items-center justify-center shadow-lg hover:opacity-90 transition-colors"
          >
            <Heart className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
