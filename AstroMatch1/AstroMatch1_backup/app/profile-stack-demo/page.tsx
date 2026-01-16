"use client"

import { useState } from "react"
import UserProfileStack from "@/components/UserProfileStack"

// Sample profile data that matches the structure
const sampleProfiles = [
  {
    id: "1",
    name: "Emma",
    age: 28,
    photos: [
      "/placeholder.svg",
      "/placeholder.svg", 
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    westernSign: "Leo",
    easternSign: "Rabbit",
    location: "New York, NY",
    occupation: "Graphic Designer",
    height: "5'6\"",
    children: "No children",
    religion: "Spiritual",
    aboutMe: "I love exploring new places, trying different cuisines, and having deep conversations about life. I'm passionate about art, music, and making meaningful connections with people who share similar values. I believe in living authentically and finding joy in the little moments.",
    interests: ["Photography", "Traveling", "Art galleries", "Cooking", "Yoga", "Reading", "Live music", "Museums", "Hiking", "Coffee shops"],
    relationshipGoals: ["Long-term relationship", "Marriage", "Building a family", "Growing together"],
    compatibility: 87
  },
  {
    id: "2", 
    name: "James",
    age: 32,
    photos: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    westernSign: "Scorpio",
    easternSign: "Dragon",
    location: "Los Angeles, CA",
    occupation: "Software Engineer",
    height: "6'1\"",
    children: "Has children",
    religion: "Agnostic",
    aboutMe: "Tech enthusiast who loves solving complex problems. I enjoy hiking, playing guitar, and exploring new technologies. Looking for someone who shares my curiosity about the world.",
    interests: ["Technology", "Hiking", "Guitar", "Gaming", "Coffee", "Documentaries"],
    relationshipGoals: ["Serious relationship", "Life partnership"],
    compatibility: 92
  },
  {
    id: "3",
    name: "Sophia",
    age: 26,
    photos: [
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    westernSign: "Pisces", 
    easternSign: "Tiger",
    location: "Chicago, IL",
    occupation: "Teacher",
    height: "5'4\"",
    children: "No children",
    religion: "Christian",
    aboutMe: "Passionate educator who believes in the power of learning and growth. I love spending time in nature, reading books, and volunteering in my community.",
    interests: ["Education", "Nature", "Reading", "Volunteering", "Dancing", "Art"],
    relationshipGoals: ["Long-term relationship", "Marriage"],
    compatibility: 78
  }
]

export default function ProfileStackDemo() {
  const [profiles, setProfiles] = useState(sampleProfiles)

  const handleSwipeLeft = (profileId: string) => {
    console.log("Swiped left on profile:", profileId)
    // Remove profile from stack
    setProfiles(prev => prev.filter(p => p.id !== profileId))
  }

  const handleSwipeRight = (profileId: string) => {
    console.log("Swiped right on profile:", profileId)
    // Remove profile from stack
    setProfiles(prev => prev.filter(p => p.id !== profileId))
  }

  const handleLike = (profileId: string) => {
    console.log("Liked profile:", profileId)
  }

  const handleChat = (profileId: string) => {
    console.log("Chat with profile:", profileId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Profile Stack Demo</h1>
          <p className="text-white/70">Identical layout to the profile settings view tab</p>
        </div>
        
        <UserProfileStack
          profiles={profiles}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onLike={handleLike}
          onChat={handleChat}
        />
      </div>
    </div>
  )
}
