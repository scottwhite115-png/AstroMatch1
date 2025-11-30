"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/contexts/ThemeContext"
import {
  Camera,
  X,
  Heart,
  Music,
  Plane,
  Book,
  Coffee,
  Dumbbell,
  Palette,
  Film,
  Utensils,
  Gamepad2,
  Sun,
  Moon,
} from "lucide-react"

const INTERESTS = [
  { id: "travel", label: "Travel", icon: Plane },
  { id: "music", label: "Music", icon: Music },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "reading", label: "Reading", icon: Book },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "art", label: "Art", icon: Palette },
  { id: "movies", label: "Movies", icon: Film },
  { id: "foodie", label: "Foodie", icon: Utensils },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
]

const PERSONALITY_TRAITS = [
  "Adventurous",
  "Creative",
  "Ambitious",
  "Laid-back",
  "Outgoing",
  "Thoughtful",
  "Spontaneous",
  "Organized",
  "Humorous",
  "Romantic",
  "Intellectual",
  "Active",
]

export default function ProfileBuilderPage() {
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<string[]>([
    "/portrait-photo-woman-smiling-outdoor.jpg",
    "/woman-hiking-mountain-adventure.jpg",
    "/woman-coffee-shop-casual.jpg",
    "/woman-beach-sunset-happy.jpg",
    "/woman-city-street-fashion.jpg",
    "/woman-restaurant-dining-elegant.jpg",
  ])
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [bio, setBio] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const { theme, setTheme } = useTheme()

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file))
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 6))
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) => (prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]))
  }

  const canProceed = () => {
    if (step === 1) return photos.length >= 2
    if (step === 2) return name && age
    if (step === 3) return bio.length >= 50
    if (step === 4) return selectedInterests.length >= 3 && selectedTraits.length >= 3
    return false
  }

  return (
    <div
      className={`profile-page profile-builder-container min-h-screen ${theme === "starlight" ? "starlight-bg" : ""}`}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Profile</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "light" ? "starlight" : "light")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-gray-700" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <span className="text-sm font-medium text-gray-600">
                Step {step} of {totalSteps}
              </span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Step 1: Photos */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Add your best photos</h2>
              <p className="text-gray-600 text-sm">Upload at least 2 photos. The first one will be your main photo.</p>
            </div>

            <div className="photo-upload-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`photo-upload-slot ${photos[index] ? "has-image" : ""}`}>
                  {photos[index] ? (
                    <>
                      <img src={photos[index] || "/placeholder.svg"} alt={`Photo ${index + 1}`} />
                      <button onClick={() => removePhoto(index)} className="photo-delete-btn">
                        <X size={16} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-gray-900">
                          Main
                        </div>
                      )}
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      <Camera className="text-gray-400 mb-2" size={24} />
                      <span className="text-xs text-gray-500 font-medium">Add Photo</span>
                      <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              ))}
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Profiles with 4+ photos get 3x more matches!
              </p>
            </Card>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600 text-sm">Let's start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-base"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                <Input type="text" placeholder="City, State" className="text-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Occupation</label>
                <Input type="text" placeholder="What do you do?" className="text-base" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Bio */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Write your bio</h2>
              <p className="text-gray-600 text-sm">Share what makes you unique (minimum 50 characters)</p>
            </div>

            <div>
              <Textarea
                placeholder="Tell your story... What are you passionate about? What makes you laugh? What's your ideal weekend?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[200px] text-base resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${bio.length >= 50 ? "text-green-600" : "text-gray-500"}`}>
                  {bio.length >= 50 ? "✓ Looking good!" : `${50 - bio.length} more characters needed`}
                </span>
                <span className="text-sm text-gray-500">{bio.length}/500</span>
              </div>
            </div>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <p className="text-sm text-purple-900 mb-2">
                <strong>Pro tips for a great bio:</strong>
              </p>
              <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                <li>Be authentic and specific</li>
                <li>Share your passions and hobbies</li>
                <li>Add a conversation starter</li>
                <li>Keep it positive and fun</li>
              </ul>
            </Card>
          </div>
        )}

        {/* Step 4: Interests & Personality */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your interests & personality</h2>
              <p className="text-gray-600 text-sm">Select at least 3 of each to help find your perfect match</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interests ({selectedInterests.length} selected)
              </h3>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleInterest(id)}
                    className={`interest-tag ${selectedInterests.includes(id) ? "selected" : ""}`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Personality Traits ({selectedTraits.length} selected)
              </h3>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TRAITS.map((trait) => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`interest-tag ${selectedTraits.includes(trait) ? "selected" : ""}`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-pink-50 border-pink-200">
              <div className="flex items-start gap-3">
                <Heart className="text-pink-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-pink-900">
                  These help us find people who share your vibe and interests. The more you select, the better your
                  matches!
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8 pb-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              if (step < totalSteps) {
                setStep(step + 1)
              } else {
                // Submit profile
                alert("Profile created! 🎉")
              }
            }}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] hover:from-[#ff5252] hover:to-[#ff6b6b]"
          >
            {step === totalSteps ? "Complete Profile" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
