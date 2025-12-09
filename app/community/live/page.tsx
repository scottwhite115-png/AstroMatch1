"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { SAN_HE_HOUSES, REGION_SCOPES, getHouseByAnimal } from "./houses"
import { ChatRegionScope } from "@prisma/client"

export default function LivePage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [regionScope, setRegionScope] = useState<ChatRegionScope>(ChatRegionScope.GLOBAL)
  
  // TODO: Get user's Chinese sign from profile
  // For now, hardcoded as null - will be replaced with actual profile data
  const userChineseSign = null // e.g., "Monkey"
  const userHouse = getHouseByAnimal(userChineseSign)

  return (
    <div className="space-y-6">
      {/* Region Selector */}
      <div className={`rounded-xl border p-4 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-slate-900/60 border-slate-700"
      }`}>
        <h3 className={`text-sm font-semibold mb-3 ${
          theme === "light" ? "text-gray-900" : "text-slate-50"
        }`}>
          Choose your region
        </h3>
        <div className="flex gap-2">
          {REGION_SCOPES.map((scope) => (
            <button
              key={scope.value}
              onClick={() => setRegionScope(scope.value as ChatRegionScope)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                regionScope === scope.value
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md"
                  : theme === "light"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span className="mr-1.5">{scope.icon}</span>
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* House Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {SAN_HE_HOUSES.map((house) => {
          const isUserHouse = userHouse?.id === house.id

          return (
            <div
              key={house.id}
              className={`relative rounded-xl border p-5 transition-all ${
                theme === "light"
                  ? "bg-white border-gray-200 hover:border-gray-300"
                  : "bg-slate-900/60 border-slate-700 hover:border-slate-600"
              }`}
            >
              {/* Badge for user's home house */}
              {isUserHouse && (
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    theme === "light"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-emerald-950/50 text-emerald-300"
                  }`}>
                    Your trine
                  </span>
                </div>
              )}

              {/* Emojis */}
              <div className="text-3xl mb-3">{house.emojis}</div>

              {/* Name */}
              <h3 className={`text-lg font-bold mb-1 bg-gradient-to-r ${house.color} bg-clip-text text-transparent`}>
                {house.name}
              </h3>

              {/* Animals */}
              <p className={`text-xs mb-2 ${
                theme === "light" ? "text-gray-600" : "text-slate-400"
              }`}>
                {house.animals.join(" · ")}
              </p>

              {/* Description */}
              <p className={`text-xs mb-4 ${
                theme === "light" ? "text-gray-500" : "text-slate-500"
              }`}>
                {house.description}
              </p>

              {/* Join Button */}
              <button
                onClick={() => {
                  router.push(`/community/live/${house.slug}?scope=${regionScope}`)
                }}
                className={`w-full px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isUserHouse
                    ? `bg-gradient-to-r ${house.color} text-white shadow-md hover:shadow-lg`
                    : theme === "light"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {isUserHouse ? "Join your lounge" : "Visit lounge"}
              </button>
            </div>
          )
        })}
      </div>

      {/* Info footer */}
      <div className={`text-center text-xs ${
        theme === "light" ? "text-gray-500" : "text-slate-500"
      }`}>
        <p>San He (三合) connects the three signs of each trine.</p>
        <p className="mt-1">Chat with your trine or explore other houses!</p>
      </div>
    </div>
  )
}

