// Local enum instead of importing from Prisma
enum SanHeHouse {
  VISIONARIES = "VISIONARIES",
  STRATEGISTS = "STRATEGISTS",
  ADVENTURERS = "ADVENTURERS",
  ARTISTS = "ARTISTS",
}

export const SAN_HE_HOUSES = [
  {
    id: SanHeHouse.VISIONARIES,
    slug: "visionaries",
    name: "Visionaries",
    animals: ["Rat", "Dragon", "Monkey"],
    emojis: "🐀🐉🐒",
    description: "Innovative, clever, and transformative spirits",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: SanHeHouse.STRATEGISTS,
    slug: "strategists",
    name: "Strategists",
    animals: ["Ox", "Snake", "Rooster"],
    emojis: "🐂🐍🐓",
    description: "Patient, wise, and methodical planners",
    color: "from-emerald-600 to-green-500",
  },
  {
    id: SanHeHouse.ADVENTURERS,
    slug: "adventurers",
    name: "Adventurers",
    animals: ["Tiger", "Horse", "Dog"],
    emojis: "🐅🐴🐕",
    description: "Bold, passionate, and loyal companions",
    color: "from-orange-600 to-red-500",
  },
  {
    id: SanHeHouse.ARTISTS,
    slug: "artists",
    name: "Artists",
    animals: ["Rabbit", "Goat", "Pig"],
    emojis: "🐇🐐🐷",
    description: "Creative, harmonious, and compassionate souls",
    color: "from-purple-600 to-pink-500",
  },
] as const

export function getHouseBySlug(slug: string) {
  return SAN_HE_HOUSES.find((h) => h.slug === slug)
}

export function getHouseByAnimal(animal: string | null | undefined) {
  if (!animal) return null
  const normalized = animal.toLowerCase()
  return SAN_HE_HOUSES.find((h) => 
    h.animals.some((a) => a.toLowerCase() === normalized)
  )
}

export const REGION_SCOPES = [
  { value: "NEAR_ME", label: "Near me", icon: "📍" },
  { value: "COUNTRY", label: "My country", icon: "🗺️" },
  { value: "GLOBAL", label: "Global", icon: "🌍" },
] as const


