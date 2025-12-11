"use client"

import { useTheme } from "@/contexts/ThemeContext"

export default function TestChineseEmojisPage() {
  const { theme } = useTheme()

  // Current animal emojis (from Chinese zodiac page)
  const currentEmojis = {
    Rat: "🐀",
    Ox: "🐂",
    Tiger: "🐅",
    Rabbit: "🐇",
    Dragon: "🐉",
    Snake: "🐍",
    Horse: "🐎",
    Goat: "🐐",
    Monkey: "🐒",
    Rooster: "🐓",
    Dog: "🐕",
    Pig: "🐖",
  }

  // Face emoji options
  const faceEmojis = {
    Rat: "🐹", // Hamster face (closest to rat face)
    Ox: "🐮", // Cow face
    Tiger: "🐯", // Tiger face
    Rabbit: "🐰", // Rabbit face
    Dragon: "🐲", // Dragon face
    Snake: "🐍", // Snake (no face version available)
    Horse: "🐴", // Horse face
    Goat: "🐐", // Goat (no face version, or 🐏 ram)
    Monkey: "🐵", // Monkey face
    Rooster: "🐔", // Chicken (closest to rooster)
    Dog: "🐶", // Dog face
    Pig: "🐷", // Pig face
  }

  // Alternative face emojis
  const altFaceEmojis = {
    Rat: "🐭", // Mouse (alternative)
    Ox: "🐮", // Cow face
    Tiger: "🐯", // Tiger face
    Rabbit: "🐰", // Rabbit face
    Dragon: "🐲", // Dragon face
    Snake: "🐍", // Snake (no face version)
    Horse: "🐴", // Horse face
    Goat: "🐏", // Ram (alternative)
    Monkey: "🐵", // Monkey face
    Rooster: "🐓", // Rooster (no face version)
    Dog: "🐶", // Dog face
    Pig: "🐷", // Pig face
  }

  const signs = Object.keys(currentEmojis) as Array<keyof typeof currentEmojis>

  return (
    <div className={`min-h-screen p-8 ${
      theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
    }`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 text-center ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>
          Chinese Zodiac Emoji Comparison
        </h1>

        <div className="space-y-6">
          {signs.map((sign) => (
            <div
              key={sign}
              className={`p-6 rounded-lg border ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <h2 className={`text-xl font-semibold mb-4 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                {sign}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current (Animal) */}
                <div className={`p-4 rounded border ${
                  theme === "light" ? "bg-gray-50 border-gray-300" : "bg-white/5 border-white/20"
                }`}>
                  <div className="text-sm font-medium mb-2 text-gray-500">Current (Animal)</div>
                  <div className="text-6xl text-center">{currentEmojis[sign]}</div>
                  <div className="text-xs text-center mt-2 text-gray-400">{currentEmojis[sign]}</div>
                </div>

                {/* Face Option 1 */}
                <div className={`p-4 rounded border ${
                  theme === "light" ? "bg-blue-50 border-blue-300" : "bg-blue-500/10 border-blue-500/30"
                }`}>
                  <div className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">Face Option 1</div>
                  <div className="text-6xl text-center">{faceEmojis[sign]}</div>
                  <div className="text-xs text-center mt-2 text-gray-400">{faceEmojis[sign]}</div>
                </div>

                {/* Face Option 2 (if different) */}
                {altFaceEmojis[sign] !== faceEmojis[sign] && (
                  <div className={`p-4 rounded border ${
                    theme === "light" ? "bg-purple-50 border-purple-300" : "bg-purple-500/10 border-purple-500/30"
                  }`}>
                    <div className="text-sm font-medium mb-2 text-purple-600 dark:text-purple-400">Face Option 2</div>
                    <div className="text-6xl text-center">{altFaceEmojis[sign]}</div>
                    <div className="text-xs text-center mt-2 text-gray-400">{altFaceEmojis[sign]}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={`mt-8 p-6 rounded-lg border ${
          theme === "light"
            ? "bg-blue-50 border-blue-200"
            : "bg-blue-500/10 border-blue-500/30"
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === "light" ? "text-blue-900" : "text-blue-200"
          }`}>
            Notes:
          </h3>
          <ul className={`space-y-2 text-sm ${
            theme === "light" ? "text-blue-800" : "text-blue-300"
          }`}>
            <li>• <strong>Snake</strong>: No face emoji available (🐍 is the only option)</li>
            <li>• <strong>Goat</strong>: No face emoji, but 🐏 (ram) is available as alternative</li>
            <li>• <strong>Rooster</strong>: No face emoji, but 🐔 (chicken) is available</li>
            <li>• <strong>Rat</strong>: 🐹 (hamster) or 🐭 (mouse) are face alternatives</li>
            <li>• All other signs have face emoji versions available</li>
          </ul>
        </div>
      </div>
    </div>
  )
}



