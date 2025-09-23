'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Star, User, Search } from 'lucide-react'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('discovery')

  const tabs = [
    { id: 'discovery', label: 'Discover', icon: Search },
    { id: 'matches', label: 'Matches', icon: Heart },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'astrology', label: 'Astrology', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'discovery':
        return (
          <div className="p-4">
            <div className="max-w-sm mx-auto">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-96 bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1">
                    <span className="text-sm font-medium">87% Match</span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold">Sarah, 28</h2>
                  <p className="text-purple-600">Aries-Dragon</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'matches':
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Matches</h1>
            <p className="text-gray-600">Your matches will appear here</p>
          </div>
        )
      default:
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{activeTab}</h1>
            <p className="text-gray-600">Content for {activeTab} will appear here</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {renderContent()}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
