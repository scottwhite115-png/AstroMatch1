interface ChineseZodiacIconProps {
  animal:
    | "rat"
    | "ox"
    | "tiger"
    | "rabbit"
    | "dragon"
    | "snake"
    | "horse"
    | "goat"
    | "monkey"
    | "rooster"
    | "dog"
    | "pig"
  size?: "small" | "medium" | "large" | "xl"
  className?: string
}

export function ChineseZodiacIcon({ animal, size = "medium", className = "" }: ChineseZodiacIconProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
    xl: "w-10 h-10",
  }

  const animalIcons = {
    rat: "🐭",
    ox: "🐂",
    tiger: "🐅",
    rabbit: "🐰",
    dragon: "🐉",
    snake: "🐍",
    horse: "🐎",
    goat: "🐐",
    monkey: "🐒",
    rooster: "🐓",
    dog: "🐕",
    pig: "🐷",
  }

  return (
    <span className={`${sizeClasses[size]} ${className} inline-flex items-center justify-center`}>
      {animalIcons[animal]}
    </span>
  )
}
