"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ChineseZodiacIcon } from "@/components/chinese-zodiac-icon"
import { ChevronLeft, X } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { getFusionArchetypeData, getArchetypeName } from "@/lib/fusionArchetypes"
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple"
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple"
import { ConnectionBoxNew } from "@/components/ConnectionBoxNew"
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from "@/lib/zodiacHelpers"
import { saveSunSigns } from "@/lib/sunSignCalculator"
import { buildConnectionBox } from "@/lib/compat/engine"
import type { UserProfile } from "@/lib/compat/types"
import { getWuXingYearElement } from "@/lib/matchEngine"
import { getSunMatchBlurb, type WesternSign } from "@/lib/connectionSunVibes"

interface ZodiacCombinationPageProps {
  params: {
    western: string
    chinese: string
  }
}

const westernSigns = {
  aries: {
    name: "Aries",
    symbol: "♈",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    traits: ["Bold", "Energetic", "Pioneering"],
  },
  taurus: {
    name: "Taurus",
    symbol: "♉",
    dates: "Apr 20 - May 20",
    element: "Earth",
    traits: ["Reliable", "Patient", "Practical"],
  },
  gemini: {
    name: "Gemini",
    symbol: "♊",
    dates: "May 21 - Jun 20",
    element: "Air",
    traits: ["Curious", "Adaptable", "Communicative"],
  },
  cancer: {
    name: "Cancer",
    symbol: "♋",
    dates: "Jun 21 - Jul 22",
    element: "Water",
    traits: ["Nurturing", "Intuitive", "Protective"],
  },
  leo: {
    name: "Leo",
    symbol: "♌",
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    traits: ["Confident", "Generous", "Creative"],
  },
  virgo: {
    name: "Virgo",
    symbol: "♍",
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    traits: ["Analytical", "Helpful", "Perfectionist"],
  },
  libra: {
    name: "Libra",
    symbol: "♎",
    dates: "Sep 23 - Oct 22",
    element: "Air",
    traits: ["Diplomatic", "Balanced", "Social"],
  },
  scorpio: {
    name: "Scorpio",
    symbol: "♏",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    traits: ["Intense", "Mysterious", "Transformative"],
  },
  sagittarius: {
    name: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    traits: ["Adventurous", "Philosophical", "Optimistic"],
  },
  capricorn: {
    name: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    traits: ["Ambitious", "Disciplined", "Responsible"],
  },
  aquarius: {
    name: "Aquarius",
    symbol: "♒",
    dates: "Jan 20 - Feb 18",
    element: "Air",
    traits: ["Independent", "Innovative", "Humanitarian"],
  },
  pisces: {
    name: "Pisces",
    symbol: "♓",
    dates: "Feb 19 - Mar 20",
    element: "Water",
    traits: ["Compassionate", "Artistic", "Intuitive"],
  },
}

const chineseSigns = {
  rat: {
    name: "Rat",
    symbol: "rat",
    element: "Water",
    traits: ["Clever", "Resourceful", "Charming"],
    years: "1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020",
    dateRanges: [
      "Feb 15, 1972 – Feb 2, 1973",
      "Feb 2, 1984 – Feb 19, 1985",
      "Feb 19, 1996 – Feb 6, 1997",
      "Feb 7, 2008 – Jan 25, 2009",
      "Jan 25, 2020 – Feb 11, 2021",
    ],
  },
  ox: {
    name: "Ox",
    symbol: "ox",
    element: "Earth",
    traits: ["Reliable", "Strong", "Determined"],
    years: "1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021",
    dateRanges: [
      "Jan 31, 1949 – Feb 16, 1950",
      "Feb 15, 1961 – Feb 4, 1962",
      "Feb 3, 1973 – Jan 22, 1974",
      "Feb 20, 1985 – Feb 8, 1986",
      "Feb 7, 1997 – Jan 27, 1998",
      "Jan 26, 2009 – Feb 13, 2010",
      "Feb 12, 2021 – Jan 31, 2022",
    ],
  },
  tiger: {
    name: "Tiger",
    symbol: "tiger",
    element: "Wood",
    traits: ["Brave", "Competitive", "Unpredictable"],
    years: "1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022",
    dateRanges: [
      "Feb 18, 1950 – Feb 7, 1951",
      "Feb 6, 1970 – Jan 26, 1971",
      "Jan 25, 1982 – Feb 12, 1983",
      "Feb 10, 1994 – Jan 30, 1995",
      "Jan 29, 1999 – Feb 17, 2000",
      "Feb 16, 2018 – Feb 4, 2019",
      "Feb 3, 2030 – Jan 22, 2031",
    ],
  },
  rabbit: {
    name: "Rabbit",
    symbol: "rabbit",
    element: "Wood",
    traits: ["Gentle", "Quiet", "Elegant"],
    years: "1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023",
    dateRanges: [
      "Feb 17, 1951 – Feb 6, 1952",
      "Feb 6, 1963 – Jan 25, 1964",
      "Jan 25, 1975 – Feb 12, 1976",
      "Feb 12, 1987 – Jan 30, 1988",
      "Jan 29, 1999 – Feb 17, 2000",
      "Feb 16, 2018 – Feb 4, 2019",
      "Feb 3, 2030 – Jan 22, 2031",
    ],
  },
  dragon: {
    name: "Dragon",
    symbol: "dragon",
    element: "Earth",
    traits: ["Confident", "Intelligent", "Enthusiastic"],
    years: "1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024",
    dateRanges: [
      "Jan 27, 1952 – Feb 13, 1953",
      "Feb 13, 1964 – Feb 1, 1965",
      "Jan 31, 1976 – Feb 17, 1977",
      "Feb 17, 1988 – Feb 5, 1989",
      "Feb 5, 2000 – Jan 23, 2001",
      "Jan 23, 2012 – Feb 9, 2013",
      "Feb 10, 2024 – Jan 28, 2025",
    ],
  },
  snake: {
    name: "Snake",
    symbol: "snake",
    element: "Fire",
    traits: ["Wise", "Intuitive", "Mysterious"],
    years: "1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025",
    dateRanges: [
      "Feb 14, 1953 – Feb 2, 1954",
      "Feb 2, 1965 – Jan 20, 1966",
      "Jan 31, 1976 – Feb 17, 1977",
      "Feb 17, 1988 – Feb 5, 1989",
      "Feb 5, 2000 – Jan 23, 2001",
      "Jan 23, 2012 – Feb 9, 2013",
      "Feb 10, 2024 – Jan 28, 2025",
    ],
  },
  horse: {
    name: "Horse",
    symbol: "horse",
    element: "Fire",
    traits: ["Energetic", "Independent", "Impatient"],
    years: "1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026",
    dateRanges: [
      "Feb 3, 1954 – Jan 23, 1955",
      "Jan 21, 1966 – Feb 8, 1967",
      "Feb 7, 1978 – Jan 27, 1979",
      "Jan 27, 1990 – Feb 14, 1991",
      "Feb 12, 2002 – Jan 31, 2003",
      "Jan 31, 2014 – Feb 18, 2015",
      "Feb 17, 2026 – Feb 5, 2027",
    ],
  },
  goat: {
    name: "Goat",
    symbol: "goat",
    element: "Earth",
    traits: ["Calm", "Gentle", "Sympathetic"],
    years: "1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027",
    dateRanges: [
      "Jan 24, 1955 – Feb 11, 1956",
      "Feb 9, 1967 – Jan 29, 1968",
      "Jan 28, 1979 – Feb 15, 1980",
      "Feb 15, 1991 – Feb 3, 1992",
      "Feb 1, 2003 – Jan 21, 2004",
      "Feb 19, 2015 – Feb 7, 2016",
      "Feb 6, 2027 – Jan 25, 2028",
    ],
  },
  monkey: {
    name: "Monkey",
    symbol: "monkey",
    element: "Metal",
    traits: ["Witty", "Intelligent", "Curious"],
    years: "1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028",
    dateRanges: [
      "Feb 12, 1956 – Jan 30, 1957",
      "Jan 30, 1968 – Feb 16, 1969",
      "Feb 16, 1980 – Feb 4, 1981",
      "Feb 4, 1992 – Jan 22, 1993",
      "Jan 22, 2004 – Feb 8, 2005",
      "Feb 8, 2016 – Jan 27, 2017",
      "Jan 26, 2028 – Feb 12, 2029",
    ],
  },
  rooster: {
    name: "Rooster",
    symbol: "rooster",
    element: "Metal",
    traits: ["Observant", "Hardworking", "Courageous"],
    years: "1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029",
    dateRanges: [
      "Jan 31, 1957 – Feb 17, 1958",
      "Feb 17, 1969 – Feb 5, 1970",
      "Feb 5, 1981 – Jan 24, 1982",
      "Jan 23, 1993 – Feb 9, 1994",
      "Feb 9, 2005 – Jan 28, 2006",
      "Jan 28, 2017 – Feb 15, 2018",
      "Feb 13, 2029 – Feb 2, 2030",
    ],
  },
  dog: {
    name: "Dog",
    symbol: "dog",
    element: "Earth",
    traits: ["Loyal", "Responsible", "Reliable"],
    years: "1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030",
    dateRanges: [
      "Feb 18, 1958 – Feb 7, 1959",
      "Feb 6, 1970 – Jan 26, 1971",
      "Jan 25, 1982 – Feb 12, 1983",
      "Feb 10, 1994 – Jan 30, 1995",
      "Jan 29, 2006 – Feb 17, 2007",
      "Feb 16, 2018 – Feb 4, 2019",
      "Feb 3, 2030 – Jan 22, 2031",
    ],
  },
  pig: {
    name: "Pig",
    symbol: "pig",
    element: "Water",
    traits: ["Honest", "Generous", "Reliable"],
    years: "1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031",
    dateRanges: [
      "Feb 8, 1959 – Jan 27, 1960",
      "Jan 27, 1971 – Feb 14, 1972",
      "Feb 13, 1983 – Feb 1, 1984",
      "Jan 31, 1995 – Feb 18, 1996",
      "Feb 18, 2007 – Feb 6, 2008",
      "Feb 5, 2019 – Jan 24, 2020",
      "Jan 23, 2031 – Feb 10, 2032",
    ],
  },
}

const spiritAnimals: { [key: string]: string } = {
  "aquarius-dog": "Chameleon",
  "aquarius-dragon": "Leopard",
  "aquarius-horse": "Unicorn",
  "aquarius-monkey": "Dolphin",
  "aquarius-ox": "Walrus",
  "aquarius-pig": "Pufferfish",
  "aquarius-rabbit": "Sloth",
  "aquarius-rat": "Meerkat",
  "aquarius-rooster": "Bird-of-Paradise",
  "aquarius-goat": "Handfish",
  "aquarius-snake": "Boa Constrictor",
  "aquarius-tiger": "Panther",
  "aries-dog": "Doberman Pinscher",
  "aries-dragon": "Tyrannosaurus Rex",
  "aries-horse": "Hammerhead Shark",
  "aries-monkey": "Gorilla",
  "aries-ox": "Hippopotamus",
  "aries-pig": "Dodo",
  "aries-rabbit": "Llama",
  "aries-rat": "Piranha",
  "aries-rooster": "Goldfinch",
  "aries-goat": "Catfish",
  "aries-snake": "Praying Mantis",
  "aries-tiger": "Rhinoceros",
  "cancer-dog": "Pit Bull",
  "cancer-dragon": "Hornet",
  "cancer-horse": "Hermit Crab",
  "cancer-monkey": "Emperor Tamarin",
  "cancer-ox": "Black Bear",
  "cancer-pig": "Lobster",
  "cancer-rabbit": "Turtle",
  "cancer-rat": "Seahorse",
  "cancer-rooster": "Iguana",
  "cancer-goat": "Duck",
  "cancer-snake": "Snail",
  "cancer-tiger": "Vampire Bat",
  "capricorn-dog": "Boxer",
  "capricorn-dragon": "Eagle",
  "capricorn-horse": "Salmon",
  "capricorn-monkey": "Woodpecker",
  "capricorn-ox": "Ant",
  "capricorn-pig": "Spider",
  "capricorn-rabbit": "Weaver Finch",
  "capricorn-rat": "Aardvark",
  "capricorn-rooster": "Bee",
  "capricorn-goat": "Mole",
  "capricorn-snake": "Alligator",
  "capricorn-tiger": "Komodo Dragon",
  "gemini-dog": "Deer",
  "gemini-dragon": "Hummingbird",
  "gemini-horse": "Great White Shark",
  "gemini-monkey": "Seal",
  "gemini-ox": "Coyote",
  "gemini-pig": "Cricket",
  "gemini-rabbit": "Toucan",
  "gemini-rat": "Chipmunk",
  "gemini-rooster": "Parrot",
  "gemini-goat": "Centipede",
  "gemini-snake": "Lemur",
  "gemini-tiger": "Chimpanzee",
  "leo-dog": "Shih Tzu",
  "leo-dragon": "Orca",
  "leo-horse": "Hyena",
  "leo-monkey": "Ferret",
  "leo-ox": "Sun Bear",
  "leo-pig": "Quetzal",
  "leo-rabbit": "Angora Rabbit",
  "leo-rat": "Otter",
  "leo-rooster": "Peacock",
  "leo-goat": "Swan",
  "leo-snake": "Fox",
  "leo-tiger": "Wolverine",
  "libra-dog": "Crane",
  "libra-dragon": "Porcupine",
  "libra-horse": "Goose",
  "libra-monkey": "Axolotl",
  "libra-ox": "Elephant",
  "libra-pig": "Marmot",
  "libra-rabbit": "Butterfly",
  "libra-rat": "Vulture",
  "libra-rooster": "Pelican",
  "libra-goat": "Clownfish",
  "libra-snake": "Ladybug",
  "libra-tiger": "Tasmanian Devil",
  "pisces-dog": "Tarsier",
  "pisces-dragon": "Firefly",
  "pisces-horse": "Gecko",
  "pisces-monkey": "Cheetah",
  "pisces-ox": "Moose",
  "pisces-pig": "Zebra",
  "pisces-rabbit": "Silkworm",
  "pisces-rat": "Lemming",
  "pisces-rooster": "Ocelot",
  "pisces-goat": "Leafy Seadragon",
  "pisces-snake": "Frog",
  "pisces-tiger": "Stingray",
  "sagittarius-dog": "Golden Retriever",
  "sagittarius-dragon": "Whale",
  "sagittarius-horse": "Dove",
  "sagittarius-monkey": "Roadrunner",
  "sagittarius-ox": "Raccoon",
  "sagittarius-pig": "Camel",
  "sagittarius-rabbit": "Sugar Glider",
  "sagittarius-rat": "Skunk",
  "sagittarius-rooster": "Swordfish",
  "sagittarius-goat": "Tortoise",
  "sagittarius-snake": "Tarantula",
  "sagittarius-tiger": "Mongoose",
  "scorpio-dog": "Octopus",
  "scorpio-dragon": "Jaguar",
  "scorpio-horse": "Dragonfly",
  "scorpio-monkey": "Raven",
  "scorpio-ox": "Platypus",
  "scorpio-pig": "Squid",
  "scorpio-rabbit": "Koala",
  "scorpio-rat": "Anaconda",
  "scorpio-rooster": "Owl",
  "scorpio-goat": "Panda",
  "scorpio-snake": "Anglerfish",
  "scorpio-tiger": "Honey Badger",
  "taurus-dog": "Seagull",
  "taurus-dragon": "Rattlesnake",
  "taurus-horse": "Kangaroo",
  "taurus-monkey": "Ostrich",
  "taurus-ox": "Yak",
  "taurus-pig": "Wombat",
  "taurus-rabbit": "Hedgehog",
  "taurus-rat": "Squirrel",
  "taurus-rooster": "Beaver",
  "taurus-goat": "Buffalo",
  "taurus-snake": "Jackal",
  "taurus-tiger": "Wolf",
  "virgo-dog": "Salamander",
  "virgo-dragon": "Polar Bear",
  "virgo-horse": "Giraffe",
  "virgo-monkey": "Penguin",
  "virgo-ox": "Sea Star",
  "virgo-pig": "Gazelle",
  "virgo-rabbit": "Earthworm",
  "virgo-rat": "Mouse",
  "virgo-rooster": "Corgi",
  "virgo-goat": "Flamingo",
  "virgo-snake": "Jellyfish",
  "virgo-tiger": "Narwhal",
}

// Sign combination content data
const signCombinationData: { [key: string]: any } = {
  "aries-rat": {
    personality: `The Aries Rat blends initiative with sharp intellect. Aries contributes drive, courage, and confidence, while the Rat adds quick thinking and adaptability. This creates a fast-moving personality that thrives on challenge and opportunity. They act decisively, rarely second-guessing choices, and their charm draws others into their momentum. At their best, they're inventive leaders who combine intuition with strategy; at their worst, impatience can lead to overextension or unfinished projects. Their strength lies in staying focused on meaningful goals rather than distractions.`,
    love_relationships: `They love passionately and spontaneously, enjoying flirtation and shared adventures. Their emotions run high, and they value partners who can keep up with their pace intellectually and socially. Loyalty is strong once trust is earned, but they resist any feeling of control. To sustain love, they must balance independence with emotional availability, learning that vulnerability enhances rather than limits freedom.`,
    profession: `They succeed in entrepreneurship, marketing, technology, or leadership—anywhere initiative meets innovation. Aries gives courage; Rat gives timing and strategy. They're problem solvers who anticipate trends and seize opportunity. Developing patience and consistency allows their bright ideas to mature into lasting achievements.`
  },
  "aries-ox": {
    personality: `The Aries Ox combines determination with structure. Aries supplies fire and enthusiasm, while the Ox adds endurance and moral strength. They approach life with discipline and quiet confidence, preferring steady progress over quick wins. Beneath a calm surface lies fierce ambition. They can appear stubborn but possess deep reliability. Their challenge is remaining flexible when plans change; adaptability transforms persistence into true mastery.`,
    love_relationships: `They're loyal and serious about love, seeking dependable partners who appreciate stability. Aries brings passion; Ox brings steadiness. They can appear reserved but care deeply, showing affection through protection and effort. They dislike drama or inconsistency. Learning to express emotion openly keeps their relationships alive and mutually inspiring.`,
    profession: `They excel in engineering, management, law, or education—fields requiring patience and accountability. Aries contributes leadership; Ox contributes endurance. They build success step by step and earn respect through reliability. Avoiding perfectionism helps them enjoy the results of their labor.`
  },
  "aries-tiger": {
    personality: `The Aries Tiger is fearless, charismatic, and passionate about purpose. Aries adds directness and drive; Tiger adds moral courage and flair. They act boldly, often inspiring others through confidence and honesty. They dislike restriction and are drawn to challenges that test their strength. They can be impulsive or confrontational, yet their integrity keeps them likable. Their growth lies in channeling intensity into strategy rather than reaction.`,
    love_relationships: `They love wholeheartedly and dramatically, seeking partners who share their courage and enthusiasm. They value independence and equality. When they trust, loyalty is total; when betrayed, distance appears quickly. They thrive on excitement but must learn that quiet moments sustain connection as much as passion.`,
    profession: `They shine in leadership, entrepreneurship, sports, or social reform—anywhere bravery and initiative matter. Aries offers drive; Tiger adds charisma. They rally teams through vision and example. Practicing patience and planning ensures their victories last beyond the first triumph.`
  },
  "aries-rabbit": {
    personality: `The Aries Rabbit mixes assertiveness with refinement. Aries contributes confidence and momentum, while Rabbit adds diplomacy and empathy. This creates a personality that pursues goals boldly but with grace. They're sociable, persuasive, and considerate, preferring cooperation over confrontation. They dislike cruelty or disorganization and instinctively bring calm after chaos. Their challenge is maintaining boundaries so kindness doesn't become compromise.`,
    love_relationships: `They are romantic idealists who express affection through warmth and thoughtfulness. They crave understanding and gentle encouragement. They're sensitive to criticism but quick to forgive. A partner who admires their courage while respecting their sensitivity keeps them devoted. Their task is to communicate honestly instead of retreating when hurt.`,
    profession: `They thrive in design, diplomacy, education, or healthcare—careers balancing service and leadership. Aries supplies ambition; Rabbit offers tact. They excel when empathy guides action. Setting firm priorities prevents them from spreading energy too thin.`
  },
  "aries-dragon": {
    personality: `The Aries Dragon is dynamic, confident, and visionary. Aries adds boldness and initiative; Dragon contributes charisma and pride. They radiate authority and thrive under pressure, often leading without intending to. They dislike limitation and seek challenges that stretch their power. At their best, they inspire progress through courage and originality; at their worst, pride can cloud cooperation. Their path is learning humility while maintaining their innate brilliance.`,
    love_relationships: `They love intensely and expect loyalty, respect, and admiration. They are protective of their partners and generous with affection but require recognition to feel secure. They dislike criticism and will withdraw if undervalued. True emotional fulfillment arrives when they balance strength with vulnerability and allow tenderness to guide passion.`,
    profession: `They excel in leadership, politics, entertainment, or entrepreneurship—fields that demand confidence and innovation. Aries provides drive; Dragon provides vision. They achieve greatness when ambition serves purpose rather than ego. Collaboration multiplies their influence and keeps creativity grounded.`
  },
  "aries-snake": {
    personality: `The Aries Snake is poised, strategic, and perceptive. Aries brings courage and spontaneity; Snake adds wisdom and self-control. Together they create an individual who acts decisively but thinks several steps ahead. They value independence and discretion and dislike being rushed or underestimated. Calm in crisis, they prefer persuasion to confrontation. Their challenge is balancing secrecy with openness—trust turns insight into wisdom.`,
    love_relationships: `They approach love carefully, seeking partners who value loyalty and intellect. Their emotions run deep but are expressed subtly. Once committed, they're sensual and steadfast. They dislike manipulation or unpredictability. Love flourishes when they share vulnerability rather than analyzing it.`,
    profession: `They succeed in research, strategy, psychology, or design. Aries contributes initiative; Snake contributes timing and insight. They thrive where intuition and logic meet. Building trusted partnerships prevents isolation and enhances long-term success.`
  },
  "aries-horse": {
    personality: `Energetic, sociable, and optimistic, the Aries Horse loves momentum. Aries grants assertiveness and courage; Horse adds humor and enthusiasm. They are natural motivators who keep teams inspired and spirits high. Restless by nature, they dislike monotony and seek new horizons. Their strength lies in resilience and adaptability; their challenge is sustaining focus once the excitement fades.`,
    love_relationships: `They love freely and passionately. Independence is vital—they need partners who trust rather than restrict them. They give affection through laughter, adventure, and loyalty when respected. They can lose interest if routine dominates. Shared curiosity and emotional honesty keep romance vivid.`,
    profession: `They thrive in media, travel, entrepreneurship, or sports—fields that reward initiative and charisma. Aries gives ambition; Horse gives stamina. They shine as communicators and motivators. Scheduling rest and reflection helps maintain direction amid constant motion.`
  },
  "aries-goat": {
    personality: `The Aries Goat blends confidence with compassion. Aries contributes determination and initiative; Goat adds creativity and sensitivity. They possess strong artistic instincts and a caring nature, often using talent to uplift others. Though ambitious, they avoid harsh competition, preferring cooperation and emotional balance. They can be self-critical when misunderstood. Their growth lies in trusting their strength without sacrificing kindness.`,
    love_relationships: `They are gentle yet passionate lovers who seek emotional harmony. They express affection through support and imagination. They dislike conflict and respond best to patience and appreciation. A partner who values both their courage and tenderness earns lifelong devotion.`,
    profession: `They excel in art, design, wellness, or humanitarian work. Aries adds initiative; Goat adds empathy. They perform best in creative or collaborative roles. Confidence and structure help transform inspiration into tangible success.`
  },
  "aries-monkey": {
    personality: `The Aries Monkey is inventive, witty, and fast-moving. Aries supplies initiative and boldness; Monkey adds curiosity and problem-solving skill. They are charismatic multitaskers who enjoy challenges that keep their minds sharp. Quick to learn and eager to lead, they sometimes juggle too much at once. When disciplined, they combine creativity with precision, turning bright ideas into genuine results. Their challenge is patience—learning that consistency amplifies brilliance.`,
    love_relationships: `They love playfully and sincerely. Flirtation and humor come naturally, but they seek partners who challenge their intellect as well as their heart. They dislike emotional stagnation or jealousy. When trust forms, they become devoted and surprising partners. Keeping focus on emotional depth ensures lasting intimacy beyond initial excitement.`,
    profession: `They thrive in media, technology, strategy, or entrepreneurship—fields demanding quick thought and innovation. Aries contributes courage; Monkey adds adaptability. They excel in dynamic teams where ideas flow freely. Finishing projects before chasing the next spark cements their reputation for genius.`
  },
  "aries-rooster": {
    personality: `The Aries Rooster combines confidence with order. Aries fuels drive and ambition; Rooster brings precision, honesty, and pride in workmanship. They value integrity and efficiency, preferring action backed by planning. They are direct communicators who dislike ambiguity and half-hearted effort. When balanced, they inspire trust through reliability and fairness. Their task is softening perfectionism with humor and compassion.`,
    love_relationships: `They are loyal and principled partners who expect sincerity and respect. They show affection through acts of service and consistent care. They can be critical when anxious but mean well. A partner who appreciates their dedication while helping them relax creates an enduring bond.`,
    profession: `They excel in management, design, education, or public service—roles needing organization and accountability. Aries adds leadership; Rooster ensures structure. They succeed through preparation and attention to detail. Remembering that collaboration equals strength keeps their teams thriving.`
  },
  "aries-dog": {
    personality: `The Aries Dog is courageous, honest, and principled. Aries adds initiative and independence; Dog contributes loyalty, conscience, and empathy. They are defenders of fairness and speak their mind with conviction. Friends and colleagues trust them implicitly. They sometimes take on too much responsibility, believing they must protect everyone. Learning to share the load and enjoy life restores balance to their serious nature.`,
    love_relationships: `They love sincerely and steadfastly. They seek partners who value honesty and reliability. They may appear guarded but are deeply affectionate once secure. They dislike deceit or mixed signals. Their growth lies in allowing lightness and play to coexist with duty and devotion.`,
    profession: `They thrive in law, healthcare, education, or advocacy—careers built on service and ethics. Aries gives initiative; Dog gives perseverance. They lead by example and inspire loyalty. Regular rest and recreation keep their generous spirit refreshed.`
  },
  "aries-pig": {
    personality: `The Aries Pig is warm-hearted, optimistic, and resilient. Aries contributes drive and courage; Pig adds kindness, humor, and patience. They believe in fairness and hard work, approaching life with enthusiasm and sincerity. People are drawn to their open spirit and integrity. They can overextend themselves trying to help everyone, so learning healthy boundaries preserves their energy. Their charm comes from genuine goodwill joined with quiet strength.`,
    love_relationships: `They love openly and faithfully, valuing trust and laughter. They dislike conflict or hidden motives. Generous and affectionate, they give wholeheartedly but expect respect in return. A partner who offers appreciation and gentle reassurance keeps their loyalty unshakable. Their lesson is balancing giving with self-care.`,
    profession: `They excel in hospitality, teaching, wellness, or creative business. Aries adds initiative; Pig adds compassion and endurance. They succeed through teamwork and sincerity rather than competition. Maintaining boundaries allows them to keep helping others without depletion.`
  },
  "taurus-rat": {
    personality: `The Taurus Rat joins practicality with quick intelligence. Taurus provides patience, persistence, and a steady nature; the Rat contributes cleverness, strategy, and charm. Together they form a persuasive achiever who builds success through both diligence and timing. They appreciate security but are alert to opportunity, thriving in stable environments that still offer growth. When balanced, they combine loyalty with innovation; when stressed, they can become overly cautious or controlling. Their strength lies in methodical planning joined with social grace.`,
    love_relationships: `They value comfort and trust in love. Romantic but grounded, they show devotion through reliability and thoughtful acts. They prefer partners who respect their need for stability yet keep conversation lively. Jealousy can surface if they feel ignored, but clear reassurance restores calm. Genuine affection and shared goals create an enduring partnership.`,
    profession: `They thrive in business, real estate, finance, or design—fields requiring patience and practical creativity. Taurus supplies persistence; Rat adds strategy. They handle money wisely and build reputations for dependability. Balancing caution with timely risk keeps their progress steady and prosperous.`
  },
  "taurus-ox": {
    personality: `The Taurus Ox represents endurance, reliability, and moral strength. Both signs value patience, duty, and tangible results. They are calm, deliberate thinkers who rarely rush decisions and prefer to let actions speak. They can appear reserved but possess deep conviction and quiet pride. They dislike dishonesty or chaos, finding comfort in routine. Their lesson is flexibility—learning that progress sometimes means trusting spontaneity as much as structure.`,
    love_relationships: `They love steadily and faithfully, taking relationships seriously. Loyalty and shared values outweigh passion alone. They dislike drama and require reassurance through consistency rather than words. Their affection is shown in practical ways—protection, generosity, and commitment. A gentle partner who appreciates sincerity earns lifelong devotion.`,
    profession: `They excel in management, construction, agriculture, or finance—any profession demanding persistence and ethics. Taurus adds realism; Ox adds stamina. They achieve mastery through experience. Allowing creativity into their disciplined routine prevents monotony and keeps ambitions fresh.`
  },
  "taurus-tiger": {
    personality: `The Taurus Tiger blends stability with courage. Taurus grounds the Tiger's impulsive energy, creating a strong-willed yet measured leader. They are protective, principled, and pragmatic, guided by both heart and logic. They dislike injustice and will defend loved ones fearlessly. Occasionally stubborn or blunt, they learn best through patience and empathy. Their strength lies in pairing conviction with calm persistence.`,
    love_relationships: `They love with depth and loyalty. They want partners who share purpose and respect boundaries. Passion runs high, but so does the need for trust. They dislike emotional games or inconsistency. Learning to express tenderness as easily as strength brings harmony to their relationships.`,
    profession: `They thrive in leadership, law enforcement, sports, or business—careers demanding integrity and courage. Taurus offers endurance; Tiger brings charisma. They motivate teams through reliability and fairness. Their legacy grows when they balance ambition with compassion.`
  },
  "taurus-rabbit": {
    personality: `The Taurus Rabbit is gentle, diplomatic, and composed. Taurus contributes steadiness and practicality; Rabbit brings sensitivity, taste, and refinement. They seek peace and beauty, preferring cooperation over confrontation. Hardworking yet soft-spoken, they excel in environments built on trust. Their vulnerability is avoiding conflict to keep harmony. Learning assertive communication allows them to maintain calm without self-sacrifice.`,
    love_relationships: `They love kindly and patiently. They need emotional safety and enjoy shared comfort. They dislike harsh criticism or pressure. With a caring partner, they are loyal and attentive, building homes filled with peace. Encouragement helps them voice feelings instead of retreating in silence.`,
    profession: `They flourish in design, education, counselling, or hospitality—fields combining service and creativity. Taurus provides structure; Rabbit offers diplomacy. They create harmony wherever they work. Recognizing their quiet authority ensures steady professional respect.`
  },
  "taurus-dragon": {
    personality: `The Taurus Dragon combines the Dragon's commanding presence with Taurus's calm endurance. They are confident yet grounded, ambitious but practical. They prefer to build tangible results from bold ideas and possess strong leadership instincts tempered by patience. People are drawn to their quiet authority and loyalty. Their potential pitfall is pride—believing their way is always best. Humility and teamwork transform power into lasting achievement.`,
    love_relationships: `They love deeply and steadfastly, seeking loyalty and admiration in equal measure. They're affectionate but value respect above all. They may appear serious, but romance awakens their warmth and humor. They need partners who appreciate their drive without challenging their stability. Love flourishes when they allow gentleness to share space with ambition.`,
    profession: `They excel in architecture, management, entrepreneurship, or finance—careers that reward persistence and vision. Taurus adds discipline; Dragon adds charisma. They succeed through long-term planning and ethical leadership. Delegating trust keeps them from overwork and expands their influence.`
  },
  "taurus-snake": {
    personality: `Composed and discerning, the Taurus Snake blends Taurus's patience with the Snake's intellect and intuition. They are calm observers who value security and refinement. Cautious but insightful, they rarely act without thought. They handle emotion with grace and dislike chaos or waste. Their quiet determination hides deep resilience. Their growth lies in sharing thoughts openly instead of holding secrets in silence.`,
    love_relationships: `They love with subtle devotion. Affection is expressed through care and constancy rather than grand gestures. They need loyalty, privacy, and emotional intelligence in a partner. They dislike mind games or confrontation. Trust and intellectual companionship sustain their affection through every season.`,
    profession: `They thrive in finance, psychology, design, or strategy—fields requiring intuition and planning. Taurus contributes reliability; Snake contributes precision. They work best in peaceful environments where depth and detail matter. Embracing collaboration enhances both creativity and security.`
  },
  "taurus-horse": {
    personality: `The Taurus Horse mixes stability with enthusiasm. Taurus provides perseverance and realism; Horse contributes vitality and charisma. They're approachable, humorous, and motivated by both comfort and challenge. They enjoy work that keeps them moving but dislike pressure without reward. Their optimism is steady rather than impulsive. Their task is finding balance between freedom and responsibility so neither is lost.`,
    love_relationships: `They love sincerely and playfully, valuing independence within commitment. They dislike jealousy or rigid expectations. They offer loyalty through shared experience and humor. When trusted, they become devoted companions who bring lightness to daily life. Patience and appreciation keep affection strong.`,
    profession: `They succeed in hospitality, travel, sales, or management—careers blending movement with structure. Taurus grants persistence; Horse grants energy. They motivate others through steady confidence. Keeping clear goals prevents restlessness and anchors long-term progress.`
  },
  "taurus-goat": {
    personality: `The Taurus Goat is artistic, kind, and quietly ambitious. Taurus adds discipline and reliability; Goat adds imagination and sensitivity. They strive for beauty and stability, seeking harmony in work and relationships. They can be gentle but surprisingly strong when defending their ideals. They may doubt themselves despite steady progress. Their growth lies in trusting their competence as much as their compassion.`,
    love_relationships: `They are nurturing partners who value peace and loyalty. They give affection through warmth and understanding and dislike harsh words or conflict. They need appreciation to feel secure. When encouraged, they become deeply faithful and emotionally generous.`,
    profession: `They flourish in art, education, or counselling—roles blending structure with compassion. Taurus supplies structure; Goat supplies empathy. They create comfort wherever they work. Setting clear boundaries protects their generous spirit from burnout.`
  },
  "taurus-monkey": {
    personality: `The Taurus Monkey is practical yet inventive. Taurus contributes patience and persistence; Monkey brings agility, wit, and curiosity. They combine steady ambition with adaptability, creating a resourceful problem-solver who knows when to act and when to wait. Their humor and reliability make them natural collaborators. Their challenge is staying focused rather than scattering effort among too many ideas. With discipline, they transform cleverness into mastery.`,
    love_relationships: `They approach love with warmth and playfulness. They're affectionate but value trust and consistency. They dislike unpredictability or emotional extremes. When they feel secure, they offer devotion and stability while keeping relationships fun. Shared laughter and mutual respect sustain affection through the years.`,
    profession: `They excel in communications, business, or technology—roles blending logic and creativity. Taurus provides structure; Monkey provides innovation. They're quick learners who execute plans carefully. Clear scheduling keeps their projects on track and their reputation dependable.`
  },
  "taurus-rooster": {
    personality: `Disciplined, precise, and proud, the Taurus Rooster merges Taurus's patience with the Rooster's love of order and truth. They are perfectionists who expect the best from themselves and others. Their calm authority earns respect, and their honesty can be refreshing. They occasionally need to soften rigid opinions and embrace flexibility. When balance is achieved, they lead with integrity and kindness.`,
    love_relationships: `They love through loyalty and reliability. They show care by creating stability and order for loved ones. Criticism can surface from worry rather than judgment. They need partners who understand their sincerity and remind them to relax. Love deepens when they value warmth over perfection.`,
    profession: `They thrive in management, design, law, or academia—fields that reward accuracy and discipline. Taurus adds persistence; Rooster adds precision. They build steady careers through dedication. Allowing space for creativity prevents burnout and sustains enthusiasm.`
  },
  "taurus-dog": {
    personality: `The Taurus Dog is loyal, trustworthy, and grounded. Taurus gives patience and practicality; Dog adds honesty and moral courage. They're steady companions who value security, family, and principle. They avoid drama and prefer calm routines. They can be cautious around new people but deeply protective once trust forms. Their integrity makes them admired, though they must remember that rest is also responsibility.`,
    love_relationships: `They love sincerely and faithfully. They prefer honesty over romance games. They protect loved ones fiercely and sometimes worry too much. Encouragement and humor help them relax. With reassurance, they become affectionate and unwaveringly loyal partners.`,
    profession: `They succeed in teaching, healthcare, law, or community work. Taurus provides persistence; Dog provides ethics. They thrive where stability and fairness matter. Setting limits on workload preserves their steady optimism and caring nature.`
  },
  "taurus-pig": {
    personality: `The Taurus Pig is generous, calm, and dependable. Taurus adds endurance and practicality; Pig brings kindness, humor, and sincerity. They are steady builders who value peace, comfort, and loyalty. Their empathy makes them beloved friends and reliable partners. Occasionally, they give too much, forgetting self-care. Learning to set boundaries allows their warmth to shine sustainably.`,
    love_relationships: `They love wholeheartedly and seek harmony above all. They dislike conflict or coldness. Their affection is expressed through patience, humor, and shared comfort. They are faithful partners who value emotional safety. Love thrives when generosity flows both ways.`,
    profession: `They flourish in hospitality, teaching, wellness, or the arts—roles that reward compassion and consistency. Taurus offers determination; Pig adds emotional intelligence. They achieve long-term success through trust and teamwork. Protecting their energy ensures they can keep giving without depletion.`
  },
  "gemini-rat": {
    personality: `The Gemini Rat is quick, curious, and socially agile. Gemini gives adaptability, wit, and communication skill; the Rat adds clever strategy and ambition. They process information at lightning speed and excel at connecting people and ideas. Restless by nature, they prefer variety to routine and learn best through experience. Their brilliance can scatter without focus, yet when disciplined they become persuasive innovators. Their charm and humor win allies everywhere.`,
    love_relationships: `They fall for intelligence and playfulness. Conversation is their love language, and boredom is their biggest threat. They may flirt easily but commit when truly intrigued. They dislike possessiveness or dull routines. Keeping romance light, honest, and mentally engaging keeps their hearts faithful and excited.`,
    profession: `They thrive in media, sales, technology, or education—fields that reward communication and insight. Gemini supplies versatility; Rat supplies timing. They're natural networkers who anticipate trends. A clear structure for deadlines turns inspiration into consistent success.`
  },
  "gemini-ox": {
    personality: `The Gemini Ox combines a curious mind with methodical persistence. Gemini contributes flexibility and intellect; Ox adds reliability and determination. They're thinkers who turn ideas into structure. Less impulsive than most Geminis, they weigh possibilities carefully before acting. Their calm logic earns respect, though they must guard against rigidity. When balanced, they blend creativity with discipline, turning imagination into dependable results.`,
    love_relationships: `They love sincerely but prefer slow, steady development over instant passion. Loyalty and intellectual connection mean more than showy gestures. They need partners who appreciate their honesty and patience. Learning to express affection more freely keeps love vibrant.`,
    profession: `They excel in research, management, architecture, or engineering. Gemini provides communication; Ox ensures endurance. They're reliable planners who follow through. Balancing analysis with flexibility keeps their careers dynamic and rewarding.`
  },
  "gemini-tiger": {
    personality: `The Gemini Tiger is bold, outspoken, and charismatic. Gemini brings wit and curiosity; Tiger brings passion and courage. They thrive on excitement and exploration, always ready for new experiences. They defend their beliefs with humor and conviction. They can be impulsive or impatient but rarely dull. Their growth lies in channeling enthusiasm into sustained goals instead of short bursts.`,
    love_relationships: `They're passionate and loyal when in love, drawn to confident, independent partners. They dislike monotony or restriction. They express affection through action and encouragement. Love deepens when they balance adventure with attentive listening.`,
    profession: `They succeed in leadership, arts, sports, or media—careers blending courage and communication. Gemini grants versatility; Tiger grants drive. They inspire others through optimism. Routine grounding keeps their ambitions achievable.`
  },
  "gemini-rabbit": {
    personality: `The Gemini Rabbit is charming, diplomatic, and imaginative. Gemini adds quick intellect; Rabbit adds grace and empathy. They excel in social settings and avoid unnecessary conflict. Their minds are curious, and their manners refined. They may hesitate when decisions involve risk but excel at harmonizing groups. Their challenge is confidence—trusting intuition as much as analysis.`,
    love_relationships: `They love gently and sincerely. They need emotional safety and intellectual stimulation. They dislike harshness or inconsistency. Encouragement and humor draw out their warmth. A patient partner helps them share feelings without fear.`,
    profession: `They flourish in writing, education, design, or counselling. Gemini contributes communication; Rabbit contributes sensitivity. They're valued mediators and storytellers. Protecting quiet time replenishes their social energy.`
  },
  "gemini-dragon": {
    personality: `The Gemini Dragon is magnetic, intelligent, and endlessly inventive. Gemini offers wit and adaptability; Dragon contributes charisma and ambition. They are visionaries who think far ahead and communicate ideas with confidence. They draw others through enthusiasm and quick reasoning. Their challenge is consistency—staying grounded while chasing big dreams. When balanced, they lead with imagination backed by skill, inspiring progress wherever they go.`,
    love_relationships: `They love passionately and intellectually, drawn to partners who challenge their ideas and respect their independence. They dislike monotony or criticism. They are affectionate but need admiration to stay engaged. Love thrives when mutual respect equals passion.`,
    profession: `They excel in technology, entertainment, politics, or entrepreneurship—fields where bold ideas meet visibility. Gemini gives curiosity; Dragon gives courage. They shine in leadership and innovation. Organization and humility ensure lasting success.`
  },
  "gemini-snake": {
    personality: `The Gemini Snake is perceptive, refined, and strategic. Gemini brings curiosity and expression; Snake brings wisdom, restraint, and intuition. They read people easily and prefer observation to confrontation. Their minds are analytical yet creative, balancing intellect with instinct. They can appear mysterious but rarely act without purpose. Their growth lies in trusting emotion as much as logic to achieve harmony.`,
    love_relationships: `They love thoughtfully and with depth. They value loyalty and mental rapport. They're romantic but private, needing time to trust fully. They dislike emotional volatility. Love deepens when they reveal vulnerability instead of hiding behind intellect.`,
    profession: `They thrive in research, writing, psychology, or design—fields requiring patience and insight. Gemini supplies communication; Snake adds discernment. They succeed through subtle influence rather than force. Regular rest sustains their creative and analytical energy.`
  },
  "gemini-horse": {
    personality: `The Gemini Horse is vivacious, talkative, and adventurous. Gemini contributes wit and curiosity; Horse adds enthusiasm and independence. They live for experiences and dislike feeling confined. They are charming storytellers who connect easily with others. Their restlessness can make focus difficult, but variety fuels their inspiration. Their strength lies in optimism and adaptability, allowing them to turn setbacks into stories worth sharing.`,
    love_relationships: `They love freely and with humor. They're affectionate but need space to recharge and explore. They dislike jealousy or heavy expectations. Partners who share curiosity and laughter keep their hearts loyal. Communication keeps romance alive.`,
    profession: `They excel in media, travel, education, or performance—careers involving people and movement. Gemini gives ideas; Horse gives energy. They inspire enthusiasm wherever they go. Routine structure helps their creativity produce real-world results.`
  },
  "gemini-goat": {
    personality: `The Gemini Goat is artistic, gentle, and imaginative. Gemini provides curiosity and communication; Goat adds sensitivity and aesthetic sense. They express emotions through creativity and value harmony over conflict. They're flexible and compassionate, but indecision can slow progress. Their strength lies in empathy joined with versatility. When confident, they bring beauty and kindness to every environment.`,
    love_relationships: `They love tenderly and idealistically. They seek partners who offer understanding and emotional warmth. They dislike criticism or pressure. Patience and kindness keep their trust strong. Encouragement helps them voice needs instead of retreating quietly.`,
    profession: `They flourish in art, music, counselling, or education—careers uniting creativity and empathy. Gemini adds versatility; Goat adds emotional intelligence. They nurture others through imagination. Setting firm goals transforms dreams into rewarding work.`
  },
  "gemini-monkey": {
    personality: `The Gemini Monkey is quick-witted, inventive, and endlessly curious. Gemini offers adaptability and humor; Monkey adds mischief and sharp intelligence. They think on their feet and delight in puzzles, conversation, and new experiences. They can multitask effortlessly but risk overcommitting. Their challenge is depth—learning to stay with one pursuit long enough to master it. When focused, they're brilliant innovators and communicators with unmatched charm.`,
    love_relationships: `They're flirtatious, lively partners who value laughter and mental stimulation. They dislike boredom or emotional heaviness. Once genuinely captivated, they become loyal and creative lovers who keep romance exciting. Encouraging trust and slowing down deepens their emotional bond.`,
    profession: `They thrive in technology, communication, performance, or entrepreneurship—careers that reward fast thinking. Gemini provides expression; Monkey provides resourcefulness. They shine in roles that evolve quickly. Building consistency transforms talent into legacy.`
  },
  "gemini-rooster": {
    personality: `The Gemini Rooster merges intellect with precision. Gemini contributes curiosity and versatility; Rooster adds discipline, order, and conviction. They have strong opinions and sharp humor, preferring clarity over confusion. They pursue excellence in everything and speak their minds honestly. Their challenge is balancing flexibility with their need for control. When open-minded, they become brilliant thinkers who elevate everyone around them.`,
    love_relationships: `They are loyal, articulate partners who value honesty and respect. They can be critical when anxious but mean well. They need a partner who appreciates their integrity and reminds them to relax. Humor and reassurance strengthen connection.`,
    profession: `They excel in education, analysis, media, or design—professions demanding accuracy and communication. Gemini brings adaptability; Rooster brings organization. They succeed through thoroughness and persistence. Allowing creativity keeps their work inspired rather than rigid.`
  },
  "gemini-dog": {
    personality: `The Gemini Dog is principled, honest, and sharp-minded. Gemini adds wit and openness; Dog adds loyalty and a strong moral compass. They are articulate advocates who defend fairness with intelligence and tact. Their words carry sincerity, and their advice is trusted. They may worry about others too much, but their intentions are noble. Their strength lies in transforming concern into constructive action.`,
    love_relationships: `They love with devotion and transparency. They value trust and clear communication above all. They may seem serious but have a dry sense of humor that warms relationships. They need reassurance and shared ideals to feel secure. Mutual honesty sustains lasting affection.`,
    profession: `They thrive in teaching, law, writing, or humanitarian fields. Gemini supplies adaptability; Dog supplies integrity. They lead with conscience and competence. Maintaining boundaries prevents burnout and keeps empathy strong.`
  },
  "gemini-pig": {
    personality: `The Gemini Pig is optimistic, kind, and expressive. Gemini gives curiosity and versatility; Pig adds generosity and patience. They're open-minded communicators who believe in people's goodness. Their humor and sincerity make them well liked. They sometimes overextend themselves trying to please everyone. Their growth lies in balance—saying yes to joy but no to depletion. When centered, they radiate warmth and creativity.`,
    love_relationships: `They love affectionately and openly, seeking honesty and shared laughter. They dislike tension or criticism. They forgive easily but need appreciation to stay content. A partner who respects their kindness and sense of fun keeps them loyal and inspired.`,
    profession: `They excel in hospitality, teaching, entertainment, or design—professions where empathy meets creativity. Gemini offers communication; Pig offers endurance. They flourish in cooperative environments. Protecting their emotional energy keeps their optimism vibrant.`
  },
  "cancer-rat": {
    personality: `The Cancer Rat is intuitive, resourceful, and quietly ambitious. Cancer contributes sensitivity and empathy; the Rat adds cleverness and strategy. They notice subtle details others miss and can read both moods and motives. Protective of loved ones, they combine heart with shrewd judgment. They dislike instability yet adapt quickly when life demands it. Their strength lies in emotional intelligence applied with practicality.`,
    love_relationships: `They love deeply and loyally, valuing trust and comfort. They can be cautious at first but commit wholeheartedly once secure. They crave affection and reassurance, offering devotion and humor in return. They dislike coldness or unpredictability. Nurturing and attentive, they create love that lasts.`,
    profession: `They thrive in finance, real estate, counselling, or management—fields balancing intuition and planning. Cancer gives empathy; Rat gives resourcefulness. They make reliable strategists who sense opportunity early. Guarding against overthinking keeps their progress steady.`
  },
  "cancer-ox": {
    personality: `The Cancer Ox is steady, protective, and deeply loyal. Cancer adds emotional awareness; Ox brings endurance and integrity. They prefer routine, family, and meaningful work over constant change. Calm under pressure, they rarely abandon responsibility. They can appear reserved but possess rich inner lives. Their lesson is allowing vulnerability to complement strength.`,
    love_relationships: `They express love through loyalty and practical support. They're dependable partners who build relationships slowly but solidly. They dislike uncertainty or betrayal. Emotional warmth from a patient partner keeps them open and affectionate. Shared goals anchor their devotion.`,
    profession: `They excel in management, healthcare, or education—roles that reward consistency and compassion. Cancer contributes care; Ox contributes diligence. They earn trust through hard work. Flexibility ensures long-term satisfaction in their careers.`
  },
  "cancer-tiger": {
    personality: `The Cancer Tiger is bold yet compassionate. Cancer offers empathy and intuition; Tiger adds bravery and leadership. They feel deeply but act decisively when protecting others. They may shift between sensitivity and assertiveness, blending nurturing instincts with courage. Their challenge is tempering passion with patience. When balanced, they are both guardians and innovators.`,
    love_relationships: `They love intensely and protectively. They're drawn to honesty and emotional depth. They dislike manipulation or withdrawal. Their affection is fierce but genuine, and they'll fight for love when necessary. Learning to listen as much as lead keeps harmony strong.`,
    profession: `They thrive in leadership, social advocacy, or creative enterprise. Cancer provides intuition; Tiger provides determination. They succeed when purpose drives action. Reflection and rest help sustain their enthusiasm.`
  },
  "cancer-rabbit": {
    personality: `The Cancer Rabbit is gentle, empathetic, and refined. Cancer contributes nurturing instincts; Rabbit adds diplomacy and grace. They're peacemakers who sense emotional currents instantly and prefer harmony to conflict. Their intuition makes them excellent listeners and mediators. They may avoid confrontation, but their quiet strength runs deep. Their growth lies in trusting that saying no can be loving too.`,
    love_relationships: `They love with tenderness and patience. They give affection through care and attentiveness. They dislike aggression or sarcasm. Partners who provide emotional security and appreciation keep their hearts devoted. Love flourishes when mutual gentleness prevails.`,
    profession: `They flourish in art, counselling, or education—fields built on empathy. Cancer adds intuition; Rabbit adds diplomacy. They foster calm wherever they work. Boundaries and self-care preserve their generous spirit.`
  },
  "cancer-dragon": {
    personality: `The Cancer Dragon is charismatic, creative, and deeply intuitive. Cancer brings empathy and emotional intelligence; Dragon adds strength, ambition, and magnetism. They care deeply about others yet maintain a strong personal presence. They can be protective and visionary, inspiring confidence through compassion. At times, pride or overextension may test their balance, but self-awareness turns intensity into leadership.`,
    love_relationships: `They love with passion and purpose. Emotion and loyalty run deep, and they expect the same devotion in return. They dislike coldness or indifference and prefer heartfelt honesty. When they feel safe, they are affectionate and generous partners. Vulnerability makes their love truly transformative.`,
    profession: `They excel in the arts, leadership, or social causes—roles requiring creativity and courage. Cancer gives heart; Dragon gives presence. They motivate others naturally. Rest and reflection prevent burnout and sustain their inspiring energy.`
  },
  "cancer-snake": {
    personality: `The Cancer Snake is wise, composed, and emotionally perceptive. Cancer lends warmth and sensitivity; Snake adds insight and strategic depth. They navigate life with quiet observation and a deep sense of timing. Their intuition is almost psychic, and they prefer depth over display. They can retreat too far into solitude, but when engaged, their guidance is profound. Their balance comes from trusting connection as much as intuition.`,
    love_relationships: `They love in subtle but devoted ways. They value privacy, loyalty, and emotional intelligence. They dislike superficial or erratic partners. Once they feel safe, they are affectionate and deeply loyal. Love endures when communication stays honest and calm.`,
    profession: `They thrive in psychology, research, finance, or healing arts—fields where perception matters. Cancer provides empathy; Snake provides focus. They make wise advisors and patient builders. Protecting emotional energy keeps their insight sharp.`
  },
  "cancer-horse": {
    personality: `The Cancer Horse is expressive, kind, and energetic. Cancer contributes empathy and imagination; Horse adds independence and charisma. They're sociable and lively yet crave emotional security. They love freedom but remain loyal to family and friends. Their moods can fluctuate, but their optimism always returns. Their lesson lies in balancing exploration with stability.`,
    love_relationships: `They love passionately and generously. They seek partners who share their curiosity yet respect their need for emotional grounding. They dislike distance or coldness. When communication is open, their love remains playful and strong.`,
    profession: `They excel in education, communication, or travel-related careers. Cancer gives care; Horse gives enthusiasm. They bring warmth to any environment. Clear goals and structure transform spontaneity into achievement.`
  },
  "cancer-goat": {
    personality: `The Cancer Goat is nurturing, artistic, and sensitive. Cancer adds empathy and protectiveness; Goat adds creativity and gentleness. They have a deep appreciation for beauty and kindness and often channel emotion into art or service. Their vulnerability is also their strength—they feel deeply and heal others through compassion. Their challenge is learning resilience amid sensitivity.`,
    love_relationships: `They love selflessly, offering comfort and loyalty. They dislike conflict or neglect and need appreciation to thrive. With warmth and reassurance, they become deeply affectionate partners. Love for them is a safe, creative space shared with someone who truly listens.`,
    profession: `They flourish in art, caregiving, therapy, or design. Cancer gives intuition; Goat gives creativity. They excel where empathy meets expression. Routine self-care protects their generous hearts from emotional fatigue.`
  },
  "cancer-monkey": {
    personality: `The Cancer Monkey is intuitive, witty, and adaptable. Cancer brings empathy and emotional understanding; Monkey adds cleverness and humor. They navigate social circles with ease, using charm to uplift and protect others. Emotionally intelligent yet quick-thinking, they can manage both heart and mind effectively. Their challenge is staying grounded when curiosity leads them in too many directions. When centered, they are insightful, entertaining, and caring leaders.`,
    love_relationships: `They love playfully yet sincerely. They need partners who appreciate humor and sensitivity in equal measure. They dislike coldness or emotional distance. When they trust, they are loyal, attentive, and endlessly inventive in showing affection.`,
    profession: `They excel in communication, teaching, marketing, or creative industries. Cancer adds compassion; Monkey adds ingenuity. They work best in dynamic settings where empathy meets innovation. Staying consistent brings their many talents into focus.`
  },
  "cancer-rooster": {
    personality: `The Cancer Rooster is thoughtful, principled, and precise. Cancer offers intuition and emotional depth; Rooster contributes discipline, honesty, and a sense of duty. They are organized nurturers who take pride in doing things right. They can be self-critical or perfectionistic but mean well. Their goal is balance—honoring their feelings while trusting that not everything must be flawless.`,
    love_relationships: `They love sincerely and show affection through loyalty and acts of care. They dislike mixed signals or chaos. They can be protective and slightly cautious but reveal warmth easily once secure. Mutual respect and reassurance keep their love harmonious.`,
    profession: `They succeed in healthcare, management, education, or administration. Cancer gives compassion; Rooster gives structure. They lead through example and reliability. Rest and humor help them avoid overwork.`
  },
  "cancer-dog": {
    personality: `The Cancer Dog is devoted, empathetic, and protective. Cancer brings emotional intelligence and loyalty; Dog adds honesty, justice, and patience. They are dependable friends who listen deeply and defend those they love. They can be cautious with strangers but steadfast once trust forms. Their purpose is service—to make life safer and kinder for others. Their challenge is learning to rest their caring heart.`,
    love_relationships: `They love faithfully and without pretense. They seek a partner who values honesty and kindness. They may worry over loved ones but give affection freely. They dislike dishonesty or neglect. When reassured, they become the emotional anchor of any relationship.`,
    profession: `They excel in law, social work, education, or community leadership. Cancer provides empathy; Dog provides perseverance. They build harmony through fairness and compassion. Regular downtime renews their generous spirit.`
  },
  "cancer-pig": {
    personality: `The Cancer Pig is gentle, generous, and deeply caring. Cancer gives emotional awareness and protectiveness; Pig adds humor, patience, and optimism. They are kind souls who want to make others feel safe and appreciated. They dislike conflict and believe love can heal most wounds. Their only vulnerability is giving too much without replenishing. Their path is learning that boundaries protect empathy, not weaken it.`,
    love_relationships: `They are affectionate, open-hearted partners who value loyalty and harmony. They dislike harsh words or coldness. They express devotion through comfort, laughter, and consistency. A partner who values kindness as much as passion keeps them endlessly devoted.`,
    profession: `They thrive in wellness, hospitality, art, or teaching. Cancer supplies empathy; Pig supplies perseverance. They build strong, supportive communities wherever they work. Balance between service and self-care ensures lifelong fulfillment.`
  },
  "leo-rat": {
    personality: `The Leo Rat is confident, clever, and charismatic. Leo adds pride, warmth, and leadership; the Rat contributes adaptability and strategic intelligence. They attract attention easily and know how to turn charm into opportunity. Their optimism and timing make them excellent decision-makers. At times, they can become overly concerned with recognition, yet their natural generosity keeps them beloved. Their power lies in uniting ambition with empathy.`,
    love_relationships: `They love enthusiastically and expect loyalty and admiration. They are romantic and expressive but can grow restless without appreciation. They need a partner who celebrates their achievements yet reminds them that affection is not performance. When balanced, they create joyous, inspiring unions full of laughter and devotion.`,
    profession: `They thrive in business, entertainment, or leadership—any role involving creativity and visibility. Leo provides drive; Rat provides strategic thinking. They succeed when they combine intuition with preparation. Humility keeps their influence enduring.`
  },
  "leo-ox": {
    personality: `The Leo Ox joins Leo's radiance with the Ox's steadiness. They are dignified, hardworking, and trustworthy, preferring real progress to empty praise. Their strength lies in quiet authority—they lead through consistency and fairness. They dislike shortcuts or dishonesty and hold themselves to high standards. When pride softens into patience, they become pillars of dependability and respect.`,
    love_relationships: `They are loyal partners who love through protection and reliability. They prefer stability to drama and expect honesty above all. Their affection is steady, expressed through actions rather than words. A caring partner who values integrity will find lifelong devotion.`,
    profession: `They excel in management, design, education, or law—fields requiring integrity and stamina. Leo gives confidence; Ox gives diligence. They achieve success step by step. Allowing creativity within routine prevents rigidity and keeps them inspired.`
  },
  "leo-tiger": {
    personality: `The Leo Tiger is courageous, expressive, and magnetic. Leo contributes confidence and heart; Tiger adds daring and independence. They are natural performers and leaders, unafraid of the spotlight. Their vitality inspires others, though impulsiveness can sometimes cloud judgment. When they balance passion with reflection, they radiate strength and compassion in equal measure.`,
    love_relationships: `They love boldly and protectively. They seek partners who match their fire and honesty. They dislike indifference or secrecy. Loyalty is absolute once trust forms, but they require space to maintain individuality. Love endures when admiration flows both ways.`,
    profession: `They flourish in creative leadership, entrepreneurship, or sports—careers demanding vision and courage. Leo offers charisma; Tiger offers determination. They motivate teams through enthusiasm. Consistency turns their grand ideas into reality.`
  },
  "leo-rabbit": {
    personality: `The Leo Rabbit blends confidence with elegance. Leo adds warmth and optimism; Rabbit contributes grace, diplomacy, and taste. They are charming without arrogance, preferring harmony over competition. They enjoy beauty, art, and refined company. Beneath their gentle manner lies quiet strength. Their task is balancing generosity with discernment so that kindness never becomes self-sacrifice.`,
    love_relationships: `They are affectionate and attentive lovers who cherish emotional connection. They dislike conflict and respond best to calm, appreciative partners. They give loyalty and tenderness but must learn to express needs directly. When supported, they radiate steady devotion.`,
    profession: `They thrive in art, hospitality, or diplomacy—fields combining creativity and people skills. Leo gives flair; Rabbit gives sensitivity. They shine where cooperation matters. Confidence coupled with tact leads them to success.`
  },
  "leo-dragon": {
    personality: `The Leo Dragon is bold, regal, and visionary. Leo provides creativity and warmth; Dragon adds charisma and ambition. They radiate confidence and thrive in leadership roles, drawing others through enthusiasm and courage. They dislike mediocrity and set high standards for themselves and those around them. Their potential is immense, but pride can sometimes overshadow empathy. When they channel strength into service, they become inspiring figures who elevate everyone near them.`,
    love_relationships: `They love with intensity and generosity. Passionate and loyal, they want relationships that feel grand and meaningful. They need admiration but also emotional honesty. They dislike neglect or criticism delivered without care. When love becomes partnership rather than performance, they find genuine fulfillment.`,
    profession: `They excel in leadership, entertainment, or entrepreneurship—fields that reward bold vision. Leo brings flair; Dragon brings drive. They accomplish great things through inspiration and persistence. Reflection and humility ensure their success benefits others as well.`
  },
  "leo-snake": {
    personality: `The Leo Snake is sophisticated, insightful, and magnetic. Leo contributes confidence and expression; Snake adds intuition and mystery. They possess strong emotional intelligence and a polished demeanor. They can captivate others effortlessly yet prefer depth over attention. Calm under pressure, they plan carefully before acting. Their power lies in grace—achieving through persuasion rather than force.`,
    love_relationships: `They love deeply and selectively. They are affectionate but value privacy and loyalty. They dislike drama and dishonesty. They prefer relationships built on trust and quiet understanding. When emotionally safe, they are romantic, sensual, and fiercely protective.`,
    profession: `They thrive in design, psychology, business strategy, or the arts. Leo offers creativity; Snake offers refinement. They succeed where insight meets presentation. Building a small circle of trusted collaborators keeps their work meaningful and focused.`
  },
  "leo-horse": {
    personality: `The Leo Horse is dynamic, friendly, and full of life. Leo supplies charisma and confidence; Horse adds independence and energy. They love challenges and enjoy inspiring others through enthusiasm and action. They can overcommit due to their excitement, but optimism always helps them bounce back. Their lesson is learning to pace themselves so that passion becomes endurance.`,
    love_relationships: `They love freely and joyfully, valuing trust and adventure. They dislike possessiveness or heavy moods. Their relationships thrive on laughter, shared goals, and loyalty born from friendship. When understood, they are devoted and generous partners.`,
    profession: `They excel in media, performance, sports, or entrepreneurship—any field demanding courage and visibility. Leo gives leadership; Horse gives drive. They bring warmth to every team. Rest and reflection balance their unstoppable momentum.`
  },
  "leo-goat": {
    personality: `The Leo Goat is creative, kind, and graceful. Leo brings optimism and self-expression; Goat adds empathy and artistry. They are warm-hearted visionaries who lead through inspiration rather than authority. They prefer harmony to conflict and have an eye for aesthetics. Their challenge is learning assertiveness without losing gentleness. When confident, they create communities filled with trust and beauty.`,
    love_relationships: `They love romantically and supportively. They need appreciation and tenderness to thrive. They dislike coldness or criticism. A loving partner who values both their strength and softness wins lasting devotion. Emotional warmth keeps their light shining bright.`,
    profession: `They flourish in art, fashion, therapy, or event design. Leo gives enthusiasm; Goat gives sensitivity. They succeed where creativity meets care. Setting firm boundaries ensures their generosity stays sustainable.`
  },
  "leo-monkey": {
    personality: `The Leo Monkey is witty, confident, and inventive. Leo provides charisma and leadership; Monkey adds cleverness and humor. They have a natural stage presence and love making others smile. Quick-thinking and bold, they often turn creativity into opportunity. Their optimism can sometimes border on restlessness, but their energy is infectious. When disciplined, they combine flair with focus to achieve remarkable results.`,
    love_relationships: `They love playfully and sincerely. They enjoy romance that feels like adventure and dislike dullness or emotional distance. They are loyal when respected and inspired. A partner who shares laughter and ambition keeps their heart fully engaged.`,
    profession: `They excel in entertainment, communication, marketing, or entrepreneurship—roles that reward innovation and charm. Leo adds drive; Monkey adds ingenuity. They achieve best when balancing confidence with humility and consistency.`
  },
  "leo-rooster": {
    personality: `The Leo Rooster is proud, articulate, and precise. Leo offers warmth and confidence; Rooster adds discipline and clarity. They lead with integrity and speak their minds honestly. They value excellence and dislike carelessness or laziness. Their perfectionism can be intense, but their sincerity earns respect. Their challenge is to relax control and let creativity flow more freely.`,
    love_relationships: `They love sincerely and express affection through loyalty and reliability. They may appear demanding but only because they care deeply. They need partners who appreciate their devotion and remind them to unwind. Shared purpose strengthens their bond.`,
    profession: `They thrive in education, management, design, or public service—careers emphasizing responsibility. Leo gives leadership; Rooster gives organization. They succeed through preparation and ethics. Embracing flexibility ensures lasting satisfaction.`
  },
  "leo-dog": {
    personality: `The Leo Dog is loyal, brave, and big-hearted. Leo contributes generosity and optimism; Dog adds honesty and moral strength. They stand up for others and radiate trustworthiness. People look to them for support and reassurance. They can take life too seriously at times, but their warmth always wins people back. Their gift is leadership rooted in empathy and integrity.`,
    love_relationships: `They love faithfully and passionately. They seek commitment built on mutual respect. They can be protective or occasionally stubborn but are unfailingly sincere. They dislike dishonesty and thrive with a partner who values openness and laughter.`,
    profession: `They excel in community work, healthcare, law, or leadership. Leo brings charisma; Dog brings dedication. They inspire loyalty through fairness. Taking time for fun keeps their generous nature refreshed.`
  },
  "leo-pig": {
    personality: `The Leo Pig is warm, generous, and joyful. Leo gives confidence and expression; Pig adds kindness, humor, and patience. They are optimistic souls who believe in people and prefer cooperation over conflict. They can sometimes overextend themselves trying to make everyone happy, but their sincerity is undeniable. Their life lesson is balancing giving with self-respect. Their charm lies in genuine goodwill.`,
    love_relationships: `They love wholeheartedly and openly. They value kindness, laughter, and emotional honesty. They dislike coldness or criticism. When cherished, they give loyalty without limit. Love flourishes when affection is reciprocated with care and gratitude.`,
    profession: `They thrive in hospitality, education, art, or social leadership—careers that nurture connection. Leo provides energy; Pig provides compassion. They lead through encouragement rather than ego. Protecting personal time keeps their light radiant and strong.`
  },
  "virgo-rat": {
    personality: `The Virgo Rat is intelligent, efficient, and observant. Virgo contributes precision and a love of detail; the Rat adds quick thinking and adaptability. They analyze situations clearly and often find the most practical solution before others. They value order and preparation but can adapt when life surprises them. Sometimes self-critical, they must remember that imperfection fuels progress. When balanced, they blend logic with charm and reliability.`,
    love_relationships: `They love sincerely but cautiously. They need time to build trust and prefer partners who appreciate loyalty and steadiness. They dislike chaos or emotional manipulation. Once committed, they show affection through care and support. Love deepens through communication and reassurance.`,
    profession: `They thrive in management, technology, writing, or science—careers rewarding precision and insight. Virgo gives organization; Rat gives resourcefulness. They're efficient planners who value consistency. Allowing creativity to share space with structure keeps them inspired.`
  },
  "virgo-ox": {
    personality: `The Virgo Ox is dependable, disciplined, and conscientious. Virgo brings analytical focus; Ox contributes endurance and moral integrity. They value responsibility and strive to do things the right way every time. They dislike shortcuts and prefer steady, proven methods. They can seem reserved but possess quiet confidence and strong convictions. Their growth lies in letting flexibility complement precision.`,
    love_relationships: `They love faithfully and without drama. They show affection through reliability and practical kindness. They dislike impulsiveness or broken promises. They build relationships slowly but deeply, valuing trust and loyalty above excitement. Once committed, they are unwavering partners.`,
    profession: `They excel in engineering, medicine, or administration—fields demanding patience and ethics. Virgo adds detail; Ox adds determination. They achieve mastery through consistent effort. Allowing playfulness prevents burnout and restores balance.`
  },
  "virgo-tiger": {
    personality: `The Virgo Tiger is brave, idealistic, and principled. Virgo adds thoughtfulness and precision; Tiger brings courage and passion. They stand firmly for fairness and often lead through example. They can be perfectionists with strong moral codes, occasionally expecting too much of themselves. Their task is learning to channel intensity into patience and compassion. When centered, they balance idealism with wisdom.`,
    love_relationships: `They love sincerely and protectively. They're drawn to honesty, intellect, and integrity in partners. They can be critical when anxious but quickly make amends. They thrive in relationships built on respect and shared values. When emotionally heard, they give unwavering loyalty.`,
    profession: `They succeed in law, education, or management—careers where integrity matters. Virgo provides organization; Tiger provides drive. They inspire trust through diligence. Rest and humor remind them that progress also needs ease.`
  },
  "virgo-rabbit": {
    personality: `The Virgo Rabbit is refined, intelligent, and compassionate. Virgo lends precision and humility; Rabbit adds diplomacy and grace. They value harmony, order, and beauty, preferring calm efficiency to conflict. Their attention to detail and empathy make them natural caregivers and creators. Their challenge is confidence—learning that gentleness can be powerful when paired with conviction.`,
    love_relationships: `They love with patience and care. They need emotional safety and dislike confrontation. They express affection through small gestures and daily consistency. Partners who appreciate subtlety and reliability earn lifelong devotion.`,
    profession: `They flourish in healthcare, design, or education—professions joining empathy with structure. Virgo gives practicality; Rabbit gives tact. They create order through compassion. Regular rest keeps their generous nature balanced.`
  },
  "virgo-dragon": {
    personality: `The Virgo Dragon is ambitious, analytical, and commanding. Virgo contributes precision and realism; Dragon adds charisma and confidence. They have high standards and often lead by quiet example. Driven to improve their environment, they dislike disorder and inefficiency. At their best, they combine vision with practicality, achieving lasting results. Their challenge is releasing control and trusting others to meet their high ideals.`,
    love_relationships: `They love deeply but selectively. They respect loyalty and honesty and are drawn to capable, independent partners. They dislike irresponsibility or insincerity. Once committed, they are protective and supportive. Mutual respect and communication make their love enduring.`,
    profession: `They thrive in leadership, science, or business strategy—roles that demand intelligence and precision. Virgo provides detail; Dragon provides confidence. They achieve greatness when humility balances authority.`
  },
  "virgo-snake": {
    personality: `The Virgo Snake is perceptive, refined, and disciplined. Virgo adds logic and practicality; Snake contributes intuition and sophistication. They read people well and plan every step carefully. Calm under pressure, they value privacy and efficiency. They dislike chaos or unpredictability, preferring structure and serenity. Their challenge is letting others share in their insights rather than keeping thoughts hidden.`,
    love_relationships: `They love quietly but sincerely. They are loyal and sensual partners who value honesty and subtlety. They dislike emotional games or instability. They reveal affection through patience and reliability. Trust grows as communication deepens.`,
    profession: `They excel in research, design, finance, or psychology. Virgo offers organization; Snake offers perception. They work best in thoughtful, refined settings. Balancing solitude with teamwork enhances success and satisfaction.`
  },
  "virgo-horse": {
    personality: `The Virgo Horse is energetic, intelligent, and pragmatic. Virgo brings structure and critical thinking; Horse adds enthusiasm and independence. They are quick learners who thrive on challenge and improvement. They dislike inefficiency or carelessness but must avoid self-criticism. Their gift lies in turning motion into mastery—bringing order to chaos through perseverance.`,
    love_relationships: `They love actively and wholeheartedly. They are generous partners who value loyalty and shared purpose. They can become restless if routine dominates, but open communication reignites connection. Encouragement and respect keep affection strong.`,
    profession: `They thrive in education, business, technology, or healthcare. Virgo supplies detail; Horse supplies drive. They achieve balance when hard work is paired with rest. Confidence in their process ensures steady advancement.`
  },
  "virgo-goat": {
    personality: `The Virgo Goat is gentle, creative, and conscientious. Virgo adds focus and humility; Goat adds imagination and empathy. They combine artistry with discipline, producing beauty through effort and care. They dislike conflict and prefer peaceful cooperation. Their sensitivity can make them cautious, but when self-assured, they become deeply inspiring and quietly influential.`,
    love_relationships: `They love kindly and consistently. They give affection through thoughtful gestures and need reassurance in return. They dislike coldness or harshness. With appreciation and patience, they open up fully and build lasting bonds.`,
    profession: `They flourish in design, writing, counselling, or education—fields blending structure and compassion. Virgo offers precision; Goat offers creativity. They succeed through teamwork and purpose-driven work. Confidence enhances their natural charm.`
  },
  "virgo-monkey": {
    personality: `The Virgo Monkey is sharp, curious, and inventive. Virgo offers precision and realism; Monkey adds humor and flexibility. They enjoy solving problems creatively and often find efficient shortcuts others overlook. Their intellect and charm make them natural innovators and communicators. Their challenge is finishing what they start, as curiosity sometimes outpaces patience. When focused, they're both brilliant and reliable.`,
    love_relationships: `They love playfully yet sincerely. They need partners who appreciate intelligence, humor, and honesty. They dislike monotony or emotional drama. They show love through acts of service and encouragement. Balanced affection keeps them loyal and engaged.`,
    profession: `They excel in communication, research, or business—roles blending analysis and adaptability. Virgo provides organization; Monkey provides inventiveness. They thrive in fast-paced environments. Clear goals transform their ideas into tangible achievements.`
  },
  "virgo-rooster": {
    personality: `The Virgo Rooster is precise, dependable, and articulate. Virgo contributes attention to detail and humility; Rooster adds pride, logic, and diligence. They believe in doing things properly and dislike disorganization or carelessness. Their honesty is refreshing, though they can be overly self-critical. Their path is learning that perfection is a goal, not a prison. When relaxed, they become wise and encouraging mentors.`,
    love_relationships: `They love sincerely and show affection through reliability and thoughtful gestures. They value loyalty and moral alignment. They can be exacting but have warm hearts. A patient, communicative partner brings out their humor and devotion.`,
    profession: `They succeed in management, research, design, or teaching. Virgo gives analytical depth; Rooster gives precision. They earn respect for quality and ethics. Balancing seriousness with lightheartedness keeps their work fulfilling.`
  },
  "virgo-dog": {
    personality: `The Virgo Dog is loyal, honest, and pragmatic. Virgo supplies practicality and discipline; Dog adds sincerity and a sense of justice. They're dependable allies who place integrity above ambition. They dislike deceit and will stand up for what's right. Their strength lies in consistency and moral clarity. Their only challenge is worrying too much—trusting life softens their edges.`,
    love_relationships: `They love faithfully and seriously. They seek stability, trust, and shared values. They can be reserved emotionally but are deeply affectionate once comfortable. They need reassurance and laughter to balance their strong sense of duty.`,
    profession: `They thrive in law, healthcare, education, or service industries. Virgo brings order; Dog brings ethics. They lead through example and dependability. Taking breaks and embracing joy strengthens their endurance.`
  },
  "virgo-pig": {
    personality: `The Virgo Pig is kind, practical, and quietly ambitious. Virgo gives structure and attention to detail; Pig adds generosity and patience. They work diligently to create comfort and harmony. Their empathy makes them trusted confidants, and their sense of fairness defines every decision. They sometimes take on too much for others, but clear boundaries preserve balance. Their charm is sincerity itself.`,
    love_relationships: `They love openly and reliably, showing affection through support and humor. They need stability and gentle appreciation. They dislike tension or dishonesty. With kindness and gratitude, their love deepens into lifelong partnership.`,
    profession: `They excel in healthcare, teaching, or community work—careers blending service with precision. Virgo offers diligence; Pig offers compassion. They succeed through teamwork and sincerity. Self-care sustains their generous nature.`
  },
  "libra-rat": {
    personality: `The Libra Rat is charming, intelligent, and socially graceful. Libra contributes diplomacy and refinement; Rat adds quick thinking and strategic awareness. They read a room instantly and know how to connect people. Their curiosity and persuasion make them skilled negotiators, though indecision can slow them down. When balanced, they combine elegance with clever timing to achieve success while keeping harmony intact.`,
    love_relationships: `They love playfully and sincerely, thriving on conversation and shared laughter. They dislike conflict or criticism and seek understanding over confrontation. Once emotionally invested, they are loyal and generous partners. A relationship that blends warmth with wit keeps them devoted.`,
    profession: `They excel in communications, marketing, or diplomacy—fields requiring charm and logic. Libra supplies cooperation; Rat provides strategy. They succeed through partnerships and smart planning. Clarity of priorities keeps them consistent.`
  },
  "libra-ox": {
    personality: `The Libra Ox is balanced, responsible, and composed. Libra offers tact and idealism; Ox adds discipline and endurance. They prefer fairness backed by facts and rarely rush into decisions. Calm and loyal, they build stability through effort rather than words. Their challenge is remaining open-minded when others move faster. When they pair grace with flexibility, they become trusted guides.`,
    love_relationships: `They love steadily and thoughtfully. They express affection through loyalty and reliability. They dislike emotional chaos and need peace to thrive. A partner who values both reason and tenderness earns their lasting devotion.`,
    profession: `They thrive in law, design, or administration—any field joining structure with balance. Libra gives vision; Ox gives stamina. They're reliable collaborators who finish what they start. Allowing creativity prevents rigidity and keeps their outlook fresh.`
  },
  "libra-tiger": {
    personality: `The Libra Tiger is bold, charismatic, and idealistic. Libra adds diplomacy and fairness; Tiger brings courage and conviction. They fight for justice but prefer peaceful methods when possible. They're magnetic leaders with a moral compass. At times impatience disrupts their balance, but empathy restores it. Their strength lies in passionate advocacy guided by heart and reason.`,
    love_relationships: `They love deeply and protectively, drawn to strong-minded partners who share purpose. They dislike deceit or apathy. They give affection through encouragement and loyalty. Relationships flourish when independence and equality coexist.`,
    profession: `They succeed in leadership, arts, or public service—roles requiring courage and vision. Libra contributes diplomacy; Tiger contributes drive. They inspire through fairness. Pausing to recharge sustains their idealism.`
  },
  "libra-rabbit": {
    personality: `The Libra Rabbit is refined, creative, and kind. Libra brings harmony and aesthetic sense; Rabbit adds tact and sensitivity. They value peace and beauty, often mediating between opposing sides. They can be cautious about confrontation but possess quiet confidence. Their calm presence comforts others. Their growth lies in trusting their instincts even when it disrupts consensus.`,
    love_relationships: `They love gently and romantically. They crave safety and appreciation and dislike harsh words. Their loyalty runs deep once trust forms. A caring partner who respects their sensitivity keeps love enduring.`,
    profession: `They flourish in design, counselling, or diplomacy—professions linking empathy with style. Libra offers refinement; Rabbit offers grace. They create harmony wherever they work. Protecting downtime maintains emotional balance.`
  },
  "libra-dragon": {
    personality: `The Libra Dragon is magnetic, intelligent, and visionary. Libra provides charm and fairness; Dragon contributes power and ambition. They balance diplomacy with drive, using persuasion instead of pressure to reach goals. They are confident leaders who value harmony as much as progress. Their challenge lies in managing pride and sensitivity together. When centered, they inspire trust through strength tempered by grace.`,
    love_relationships: `They love passionately and with grandeur. They seek admiration but also genuine connection. They dislike routine and need partners who stimulate both heart and mind. Their relationships flourish when respect equals affection.`,
    profession: `They thrive in leadership, media, or design—fields blending creativity and presence. Libra adds cooperation; Dragon adds determination. They succeed when collaboration supports ambition. Reflection keeps their influence balanced.`
  },
  "libra-snake": {
    personality: `The Libra Snake is poised, insightful, and sophisticated. Libra contributes elegance and reasoning; Snake adds depth and intuition. They navigate social settings effortlessly and often know more than they reveal. They dislike confrontation but are formidable when pushed. Their calm confidence draws respect, and their wisdom comes from observation. Their lesson is trusting their instincts as much as intellect.`,
    love_relationships: `They love subtly but with great devotion. They are affectionate and private, preferring long-term stability over fleeting romance. They dislike jealousy or unpredictability. Emotional honesty from both sides keeps the bond strong.`,
    profession: `They excel in strategy, psychology, design, or research. Libra provides balance; Snake provides insight. They're graceful problem-solvers. Allowing collaboration keeps them from retreating into solitude.`
  },
  "libra-horse": {
    personality: `The Libra Horse is sociable, lively, and optimistic. Libra adds charm and balance; Horse adds vitality and independence. They're natural communicators who attract diverse friends and opportunities. They thrive in change but must manage impatience. Their spirit shines brightest when they combine freedom with responsibility.`,
    love_relationships: `They love playfully and wholeheartedly. They need excitement and honesty to stay invested. They dislike jealousy or boredom. They remain loyal when allowed space to explore. Mutual encouragement strengthens connection.`,
    profession: `They succeed in travel, teaching, or entertainment—roles blending people skills with creativity. Libra brings harmony; Horse brings enthusiasm. They motivate through positivity. Structure turns their momentum into sustainable success.`
  },
  "libra-goat": {
    personality: `The Libra Goat is artistic, kind, and emotionally intelligent. Libra provides refinement and logic; Goat offers compassion and imagination. They create harmony wherever they go and dislike confrontation. Their empathy attracts others naturally. Their challenge is asserting needs clearly rather than pleasing everyone. Confidence transforms sensitivity into power.`,
    love_relationships: `They love sweetly and sincerely. They give affection through tenderness and creativity. They dislike harsh tones or emotional neglect. With patience and reassurance, they become deeply devoted partners.`,
    profession: `They flourish in art, counselling, or diplomacy—fields valuing cooperation and aesthetics. Libra gives diplomacy; Goat gives empathy. They excel in teamwork and inspiration. Maintaining boundaries protects their balance.`
  },
  "libra-monkey": {
    personality: `The Libra Monkey is witty, articulate, and charming. Libra adds grace and fairness; Monkey contributes intelligence and humor. They thrive on connection, always curious about people and ideas. Their quick wit wins admiration, though they must guard against spreading energy too thin. When they balance intellect with empathy, they become skillful mediators and innovators who bring people together.`,
    love_relationships: `They love playfully and intellectually. They seek partners who enjoy conversation, humor, and shared experiences. They dislike tension or boredom. Once committed, they're attentive, generous, and loyal. Honest dialogue keeps their love thriving.`,
    profession: `They excel in media, communication, or entrepreneurship. Libra brings diplomacy; Monkey brings ingenuity. They're natural collaborators who find creative solutions. Consistency ensures their many ideas take root and flourish.`
  },
  "libra-rooster": {
    personality: `The Libra Rooster is articulate, principled, and organized. Libra provides fairness and diplomacy; Rooster adds discipline and precision. They strive for harmony but also for excellence. They dislike confusion and may appear perfectionistic, yet their intentions are sincere. Their challenge is softening critique with compassion. When balanced, they're brilliant analysts and loyal friends.`,
    love_relationships: `They love sincerely and responsibly. They appreciate honesty and consistency and dislike emotional games. They may be cautious but are devoted once sure. Humor and patience bring out their warmth and devotion.`,
    profession: `They thrive in education, design, or management—fields requiring clarity and ethics. Libra adds refinement; Rooster adds order. They earn trust through professionalism. Allowing flexibility enhances satisfaction and creativity.`
  },
  "libra-dog": {
    personality: `The Libra Dog is loyal, wise, and morally grounded. Libra contributes diplomacy and empathy; Dog adds sincerity and courage. They stand up for fairness and defend those in need. They dislike conflict but cannot tolerate injustice. Their presence brings calm and reliability. Their lesson is trusting that balance doesn't mean compromise of values.`,
    love_relationships: `They love faithfully and tenderly. They're drawn to honesty and shared ideals. They dislike secrecy or disloyalty. They express love through protection and partnership. Encouragement and laughter keep their relationships grounded and affectionate.`,
    profession: `They excel in law, psychology, or community service. Libra brings reason; Dog brings ethics. They're respected for fairness and consistency. Time in nature restores their balance and focus.`
  },
  "libra-pig": {
    personality: `The Libra Pig is kind, artistic, and emotionally aware. Libra gives balance and social ease; Pig adds sincerity and generosity. They love harmony and want everyone around them to feel accepted. Their optimism and warmth make them popular and trusted. They can sometimes take on others' burdens, but self-care restores their peace. Their strength lies in compassion guided by fairness.`,
    love_relationships: `They love openly and affectionately. They seek relationships full of kindness and shared joy. They dislike coldness or judgment. They give selflessly, but need gentle appreciation in return. Love thrives when empathy flows both ways.`,
    profession: `They flourish in teaching, design, or the arts—fields joining creativity and care. Libra brings refinement; Pig brings generosity. They shine in team-oriented settings. Protecting emotional boundaries keeps their optimism alive.`
  },
  "scorpio-rat": {
    personality: `The Scorpio Rat is intense, strategic, and magnetic. Scorpio brings emotional depth and focus; Rat adds quick intellect and adaptability. They read motives effortlessly and approach every goal with precision. They are persuasive, private, and rarely waste energy. Their challenge lies in learning to trust others instead of managing everything alone. When balanced, they combine intuition with practical strategy to achieve quiet mastery.`,
    love_relationships: `They love passionately and protectively. They crave loyalty and emotional honesty. They dislike mixed signals or superficiality. Once committed, they are faithful and generous but expect the same in return. Vulnerability deepens their already powerful devotion.`,
    profession: `They excel in investigation, psychology, finance, or strategy—fields that reward insight and secrecy. Scorpio gives determination; Rat gives calculation. They succeed through planning and subtle leadership. Balance between intensity and rest preserves their power.`
  },
  "scorpio-ox": {
    personality: `The Scorpio Ox is resolute, patient, and deeply loyal. Scorpio offers willpower and intuition; Ox provides endurance and discipline. They work quietly but relentlessly toward their goals. They dislike shortcuts and prefer mastery through steady effort. Their emotions run deep beneath a calm surface. When compassion meets focus, they become rock-solid allies and trusted leaders.`,
    love_relationships: `They love faithfully and with great depth. They show affection through protection and reliability. They dislike unpredictability or betrayal. They require time to open up but love permanently once they do. Mutual trust sustains their peace.`,
    profession: `They thrive in medicine, management, or research. Scorpio contributes insight; Ox contributes perseverance. They earn respect through competence and calm strength. Regular breaks prevent overwork from turning into isolation.`
  },
  "scorpio-tiger": {
    personality: `The Scorpio Tiger is bold, intense, and uncompromising. Scorpio gives emotional power and focus; Tiger adds courage and passion. They command attention without trying and often challenge injustice head-on. They can be impulsive, but their instincts are sharp. Their life path is about tempering fire with foresight. When they master patience, they become fearless leaders who inspire trust and loyalty.`,
    love_relationships: `They love dramatically and wholeheartedly. They dislike indifference or dishonesty. They need partners strong enough to match their conviction yet gentle enough to calm their storms. Respect and shared purpose keep their hearts devoted.`,
    profession: `They flourish in leadership, politics, or performance—any role requiring courage and influence. Scorpio supplies focus; Tiger supplies drive. They motivate through authenticity. Reflection and rest balance their unstoppable energy.`
  },
  "scorpio-rabbit": {
    personality: `The Scorpio Rabbit is insightful, composed, and quietly persuasive. Scorpio adds depth and mystery; Rabbit brings grace and diplomacy. They sense emotional undercurrents and prefer subtle influence to confrontation. Their empathy softens Scorpio's intensity, allowing them to build bridges instead of walls. Their challenge is confidence—trusting their intuition even when others doubt it.`,
    love_relationships: `They love tenderly but intensely. They need emotional security and dislike harshness. They give devotion through patience and understanding. A gentle, honest partner helps them reveal their passion safely.`,
    profession: `They excel in counselling, design, or mediation. Scorpio offers perception; Rabbit offers tact. They succeed in calm, focused environments. Self-care and solitude renew their emotional strength.`
  },
  "scorpio-dragon": {
    personality: `The Scorpio Dragon is commanding, ambitious, and fearless. Scorpio provides focus and emotional depth; Dragon contributes confidence and vision. They have immense personal magnetism and pursue goals with unwavering determination. They dislike weakness or inconsistency but admire sincerity and courage. Their potential for leadership is vast when tempered by humility. When guided by empathy, they become transformative figures capable of inspiring great loyalty.`,
    love_relationships: `They love passionately and protectively. They are drawn to partners who share strength and honesty. They dislike emotional games or passivity. Their love thrives when built on admiration and shared power. Vulnerability deepens their intensity into devotion.`,
    profession: `They excel in leadership, finance, or creative industries that reward initiative. Scorpio gives strategy; Dragon gives charisma. They're natural motivators. Balancing ambition with compassion keeps their power constructive.`
  },
  "scorpio-snake": {
    personality: `The Scorpio Snake is mysterious, composed, and intellectually sharp. Scorpio adds emotional depth; Snake adds wisdom and elegance. They think and feel deeply but rarely reveal everything. They prefer control and secrecy, which can make them seem enigmatic. Their strength lies in perception—seeing patterns others miss. When their insight serves understanding rather than judgment, they become brilliant mentors and healers.`,
    love_relationships: `They love quietly but profoundly. They value loyalty and privacy and dislike manipulation. Their affection is sensual and thoughtful. They open up to partners who are honest, calm, and self-aware. Emotional safety allows their passion to flourish.`,
    profession: `They thrive in psychology, research, or diplomacy—fields that demand discretion and perception. Scorpio provides intuition; Snake provides refinement. They lead with quiet authority. Regular solitude renews their clarity and creativity.`
  },
  "scorpio-horse": {
    personality: `The Scorpio Horse is energetic, bold, and self-reliant. Scorpio offers intensity and strategy; Horse adds enthusiasm and courage. They are driven and charismatic, thriving on challenge and motion. Their intuition guides them toward meaningful risks. Their challenge lies in balancing freedom with commitment. When they unite focus with adventure, they become unstoppable forces for change.`,
    love_relationships: `They love with passion and humor. They need emotional connection but fear restriction. They dislike jealousy or criticism. When trusted, they are loyal and generous lovers who keep romance exciting and alive.`,
    profession: `They excel in media, travel, or entrepreneurship—roles that reward charisma and persistence. Scorpio gives vision; Horse gives energy. They inspire others through confidence. Planning ensures their bursts of drive create lasting impact.`
  },
  "scorpio-goat": {
    personality: `The Scorpio Goat is sensitive, artistic, and deep. Scorpio contributes passion and purpose; Goat brings empathy and creativity. They feel life intensely and express emotions through art or compassion. They dislike harshness or injustice. Their kindness softens Scorpio's edge, creating a soul both strong and gentle. Their growth lies in channeling emotion into purposeful creation.`,
    love_relationships: `They love sincerely and need tenderness to thrive. They're drawn to partners who appreciate their sensitivity and emotional intelligence. They dislike coldness or detachment. Encouragement and consistency sustain their devotion.`,
    profession: `They flourish in art, therapy, or education—professions blending feeling with form. Scorpio adds depth; Goat adds artistry. They bring empathy to every team. Self-care protects their generous spirit from exhaustion.`
  },
  "scorpio-monkey": {
    personality: `The Scorpio Monkey is clever, strategic, and intense. Scorpio adds focus and emotional depth; Monkey brings wit and adaptability. They navigate challenges with sharp observation and quick humor, often turning problems into opportunities. Their magnetic confidence attracts others easily. They must guard against manipulation or impatience, but when they lead with sincerity, their insight becomes transformative.`,
    love_relationships: `They love passionately yet playfully. They crave intrigue and intellectual stimulation. They dislike boredom or dishonesty. Once truly engaged, they are loyal, affectionate, and deeply protective. Humor and trust keep their love dynamic and strong.`,
    profession: `They excel in media, psychology, or entrepreneurship—fields valuing both intellect and charisma. Scorpio offers drive; Monkey offers creativity. They succeed through innovation. Staying grounded ensures their brilliance translates into real achievement.`
  },
  "scorpio-rooster": {
    personality: `The Scorpio Rooster is disciplined, perceptive, and principled. Scorpio contributes determination and intuition; Rooster adds precision and moral clarity. They hold high standards and often become the quiet conscience of their circle. They dislike disorder or hypocrisy but can soften with compassion. Their wisdom and courage make them respected leaders and advisors. Their challenge is allowing imperfection without losing purpose.`,
    love_relationships: `They love loyally and with honor. They seek stability and mutual respect. They can be intense, yet their devotion runs deep. They dislike dishonesty or inconsistency. Warmth and patience help their relationships thrive.`,
    profession: `They thrive in law, healthcare, or leadership roles. Scorpio gives resolve; Rooster gives organization. They're dedicated and trustworthy professionals. Letting humor in keeps their focus from becoming rigidity.`
  },
  "scorpio-dog": {
    personality: `The Scorpio Dog is loyal, brave, and deeply ethical. Scorpio adds emotional intensity; Dog brings honesty and devotion. They have a strong sense of justice and often protect those who cannot protect themselves. Their compassion makes them natural defenders and confidants. They dislike betrayal and take promises seriously. Their power lies in integrity paired with empathy.`,
    love_relationships: `They love faithfully and wholeheartedly. They value honesty and shared ideals. They can worry for loved ones but express love through protection and care. Open reassurance keeps their emotional world calm and secure.`,
    profession: `They excel in law, counselling, or social advocacy. Scorpio contributes intuition; Dog contributes integrity. They lead by example. Regular time in nature or solitude restores their strength and balance.`
  },
  "scorpio-pig": {
    personality: `The Scorpio Pig is generous, passionate, and wise. Scorpio gives purpose and focus; Pig adds warmth and sincerity. They are kind souls with deep emotional strength. They stand by friends and family through any trial. Their empathy makes them trusted confidants, though they must avoid absorbing others' burdens. When balanced, they embody compassion guided by willpower.`,
    love_relationships: `They love affectionately and without reservation. They seek honesty and mutual care. They dislike harshness or manipulation. They give all to their partners and flourish in relationships rooted in respect and kindness.`,
    profession: `They thrive in healing, art, or humanitarian fields—work that uplifts others. Scorpio offers focus; Pig offers patience. They succeed when passion serves compassion. Protecting boundaries keeps their generosity sustainable.`
  },
  "sagittarius-rat": {
    personality: `The Sagittarius Rat is lively, curious, and enterprising. Sagittarius brings optimism and independence; Rat adds quick thinking and adaptability. They love variety and thrive on challenge, always chasing new experiences. Their enthusiasm can be contagious, though they sometimes promise more than they can deliver. When grounded, they turn restless energy into brilliant creativity and opportunity.`,
    love_relationships: `They love playfully and with freedom. They dislike jealousy or restriction. They're loyal when trusted and admired for their humor and honesty. Shared adventures and laughter keep their relationships bright.`,
    profession: `They excel in travel, media, or innovation—fields rewarding curiosity and cleverness. Sagittarius gives vision; Rat gives strategy. They succeed through momentum and networking. Consistency turns their excitement into true expertise.`
  },
  "sagittarius-ox": {
    personality: `The Sagittarius Ox is determined, wise, and principled. Sagittarius contributes enthusiasm and faith; Ox adds structure and perseverance. They dream big but execute with patience. Their moral compass is strong, and they rarely abandon a commitment. Their challenge is learning flexibility when plans change. When balanced, they combine optimism with reliability and inspire steady confidence in others.`,
    love_relationships: `They love sincerely and value loyalty. They dislike impulsiveness or broken promises. They're steadfast once committed and appreciate honesty above charm. Emotional warmth keeps their affection enduring.`,
    profession: `They thrive in education, engineering, or leadership—roles requiring discipline and foresight. Sagittarius provides vision; Ox provides focus. They achieve mastery through persistence. Learning to relax opens room for creativity.`
  },
  "sagittarius-tiger": {
    personality: `The Sagittarius Tiger is bold, adventurous, and inspiring. Sagittarius offers curiosity and faith; Tiger brings courage and independence. They are born explorers who dislike limits of any kind. They lead through example and enthusiasm, though impatience can spark drama. When their idealism meets self-discipline, they achieve remarkable influence and success.`,
    love_relationships: `They love passionately and need excitement in romance. They admire honesty and self-assured partners. They dislike emotional restraint or routine. When love feels free, they stay loyal and protective.`,
    profession: `They excel in travel, media, or activism—fields uniting courage and communication. Sagittarius gives optimism; Tiger gives drive. They're natural motivators. Reflection turns their passion into lasting legacy.`
  },
  "sagittarius-rabbit": {
    personality: `The Sagittarius Rabbit is graceful, thoughtful, and imaginative. Sagittarius brings openness and vision; Rabbit adds empathy and diplomacy. They see life through a lens of compassion and curiosity. Their optimism is gentle rather than loud. They dislike harshness and thrive in supportive environments. Their strength lies in understanding both sides of every story, making them natural mediators.`,
    love_relationships: `They love with kindness and patience. They're attracted to warmth and humor and dislike confrontation. A partner who values peace and shared dreams keeps them deeply fulfilled.`,
    profession: `They flourish in education, art, or counselling—professions blending intellect and empathy. Sagittarius provides curiosity; Rabbit provides tact. They foster harmony wherever they go. Quiet reflection keeps inspiration fresh.`
  },
  "sagittarius-dragon": {
    personality: `The Sagittarius Dragon is magnetic, courageous, and visionary. Sagittarius offers optimism and exploration; Dragon adds ambition and charisma. They believe in big dreams and pursue them with passion and confidence. Their enthusiasm inspires others, though they must guard against overconfidence. When they pair bold vision with wisdom, they become unstoppable forces for positive change.`,
    love_relationships: `They love passionately and with conviction. They seek admiration but also understanding. They dislike possessiveness or limitation. A partner who matches their energy and supports their growth wins lifelong devotion.`,
    profession: `They thrive in leadership, performance, or entrepreneurship—fields rewarding creativity and courage. Sagittarius contributes faith; Dragon contributes drive. They achieve greatness when they balance freedom with strategy.`
  },
  "sagittarius-snake": {
    personality: `The Sagittarius Snake is insightful, composed, and philosophical. Sagittarius gives curiosity and optimism; Snake adds wisdom and restraint. They're seekers of truth who balance intellect with intuition. They enjoy deep thinking but dislike being rushed. Their calm presence hides intense focus. When they unite faith with strategy, they find success that feels both meaningful and sustainable.`,
    love_relationships: `They love deeply and thoughtfully. They value honesty and spiritual connection. They dislike drama or dishonesty. Emotional maturity and patience keep their relationships serene and fulfilling.`,
    profession: `They excel in research, teaching, or counselling—careers involving depth and purpose. Sagittarius adds vision; Snake adds perception. They communicate with calm authority. Regular solitude recharges their inspiration.`
  },
  "sagittarius-horse": {
    personality: `The Sagittarius Horse is adventurous, spontaneous, and charismatic. Sagittarius provides vision and humor; Horse brings freedom and drive. They live for excitement and dislike restriction of any kind. Their optimism is contagious, but they must learn consistency to sustain success. When focused, they blend passion with wisdom, turning motion into progress.`,
    love_relationships: `They love joyfully and openly. They seek independence within connection. They dislike jealousy or criticism. A partner who shares curiosity and adventure will find their affection unending.`,
    profession: `They thrive in travel, education, or media—fields rewarding mobility and enthusiasm. Sagittarius adds imagination; Horse adds initiative. They shine through authenticity. Commitment transforms their potential into legacy.`
  },
  "sagittarius-goat": {
    personality: `The Sagittarius Goat is gentle, idealistic, and creative. Sagittarius offers optimism and insight; Goat adds empathy and artistry. They express themselves through imagination and kindness, believing the world can be healed through understanding. They dislike confrontation but have quiet strength. Their challenge is following through on their many inspired ideas.`,
    love_relationships: `They love compassionately and sincerely. They value honesty and emotional warmth. They dislike coldness or distance. Encouragement and shared dreams strengthen their love and sense of belonging.`,
    profession: `They flourish in art, writing, or humanitarian work. Sagittarius brings vision; Goat brings empathy. They inspire others through beauty and truth. Practical structure turns inspiration into accomplishment.`
  },
  "sagittarius-monkey": {
    personality: `The Sagittarius Monkey is curious, humorous, and inventive. Sagittarius contributes adventure and vision; Monkey adds quick wit and adaptability. They learn fast and think faster, thriving in change and discovery. Their minds are full of ideas, and they love sharing insights with others. Their challenge is patience—learning that mastery requires time. When disciplined, they become brilliant communicators and innovators.`,
    love_relationships: `They love playfully and with enthusiasm. They crave laughter and shared curiosity. They dislike dullness or routine. Partners who can keep up intellectually and emotionally find in them a loyal, vibrant companion.`,
    profession: `They excel in communication, media, or entrepreneurship—professions that reward creativity and agility. Sagittarius gives optimism; Monkey gives ingenuity. They shine when work remains dynamic and purpose-driven.`
  },
  "sagittarius-rooster": {
    personality: `The Sagittarius Rooster is confident, articulate, and organized. Sagittarius adds idealism and humor; Rooster adds logic and precision. They are outspoken yet fair, thriving when teaching or leading. They can be perfectionists but have generous hearts. When they relax control, their intelligence becomes deeply inspiring to others.`,
    love_relationships: `They love honestly and expect respect. They dislike games or evasiveness. They show care through loyalty and consistency. Humor and appreciation bring out their warmth and playful spirit.`,
    profession: `They thrive in law, education, or leadership—roles demanding clarity and responsibility. Sagittarius brings optimism; Rooster brings discipline. They achieve respect through competence and sincerity.`
  },
  "sagittarius-dog": {
    personality: `The Sagittarius Dog is idealistic, loyal, and courageous. Sagittarius gives faith and curiosity; Dog adds honesty and principle. They're protective truth-seekers who live by their morals. They dislike injustice or hypocrisy and often defend the underdog. Their optimism is steady rather than naive, and their presence brings reassurance. Their challenge is balancing duty with spontaneity.`,
    love_relationships: `They love sincerely and with humor. They need a partner who shares values and integrity. They dislike secrecy or emotional withdrawal. They show love through loyalty, encouragement, and everyday care.`,
    profession: `They excel in education, counselling, or humanitarian work. Sagittarius offers vision; Dog offers reliability. They motivate through example and kindness. Personal downtime keeps their optimism grounded.`
  },
  "sagittarius-pig": {
    personality: `The Sagittarius Pig is warm, generous, and adventurous. Sagittarius provides optimism and humor; Pig adds compassion and patience. They believe in goodness and approach life with trust and joy. They dislike cruelty or dishonesty. Their sincerity makes them beloved, though they must learn to set boundaries. Their joy of living is contagious and uplifting.`,
    love_relationships: `They love openly and wholeheartedly. They seek honesty, laughter, and emotional comfort. They dislike cynicism or coldness. They give affection freely and thrive in supportive partnerships filled with trust and play.`,
    profession: `They flourish in teaching, design, or community service—careers focused on inspiration and empathy. Sagittarius adds enthusiasm; Pig adds kindness. They excel when creativity serves others. Rest and reflection keep their spirit bright.`
  },
  "capricorn-rat": {
    personality: `The Capricorn Rat is disciplined, strategic, and quick-minded. Capricorn adds patience and ambition; Rat contributes adaptability and clever resourcefulness. They plan meticulously but seize opportunity in an instant. Practical yet shrewd, they're masters of timing. Their challenge is learning to relax control and trust others. When balanced, they combine focus with flexibility to achieve consistent success.`,
    love_relationships: `They love cautiously and realistically. They prefer loyalty and intelligence to drama or unpredictability. Once committed, they're dependable and supportive partners. Affection expressed through humor and shared purpose keeps the connection strong.`,
    profession: `They excel in management, finance, or technology—fields demanding foresight and analysis. Capricorn supplies discipline; Rat supplies strategy. They succeed through planning and persistence. Occasional spontaneity keeps ambition joyful.`
  },
  "capricorn-ox": {
    personality: `The Capricorn Ox is steadfast, responsible, and quietly powerful. Capricorn offers ambition and structure; Ox adds endurance and moral strength. They dislike shortcuts and earn respect through integrity. Hard work defines them, but they must remember that rest sustains achievement. Their confidence grows with each solid step forward.`,
    love_relationships: `They love faithfully and show care through reliability and protection. They dislike chaos or emotional volatility. A patient partner who values stability will find enduring devotion and security.`,
    profession: `They thrive in engineering, law, or architecture—professions rewarding patience and order. Capricorn brings discipline; Ox brings diligence. They build legacies through persistence. Balance between duty and joy preserves wellbeing.`
  },
  "capricorn-tiger": {
    personality: `The Capricorn Tiger is bold, ambitious, and courageous. Capricorn adds strategy and structure; Tiger brings passion and independence. They lead through determination and fearless pursuit of goals. They can appear reserved but are driven by conviction. Their growth lies in softening authority with empathy. When balanced, they're inspiring visionaries with unshakable will.`,
    love_relationships: `They love strongly and expect honesty and loyalty. They admire capable partners who match their drive. They dislike unreliability or manipulation. Mutual respect and shared ambition forge lasting bonds.`,
    profession: `They flourish in leadership, finance, or creative strategy—roles combining risk and planning. Capricorn supplies calculation; Tiger supplies courage. They motivate through example. Reflection keeps intensity constructive.`
  },
  "capricorn-rabbit": {
    personality: `The Capricorn Rabbit is polite, composed, and quietly determined. Capricorn lends discipline and realism; Rabbit adds tact and refinement. They achieve through subtle influence rather than force. They value peace, order, and dependable relationships. Their calm confidence often hides deep emotional insight. Their lesson is trusting intuition alongside logic.`,
    love_relationships: `They love thoughtfully and sincerely. They seek harmony and loyalty and dislike confrontation. Once secure, they are affectionate and deeply committed. Shared kindness and consistency keep love thriving.`,
    profession: `They excel in education, diplomacy, or design—fields that reward steadiness and grace. Capricorn offers structure; Rabbit offers elegance. They succeed through patience and teamwork. Self-care protects their balanced nature.`
  },
  "capricorn-dragon": {
    personality: `The Capricorn Dragon is ambitious, confident, and commanding. Capricorn offers persistence and practicality; Dragon adds charisma and vision. They're natural leaders who plan long-term and execute with precision. They dislike disorder or inconsistency, preferring structure and authority. Their challenge is balancing ambition with humility. When guided by integrity, they achieve remarkable influence and success.`,
    love_relationships: `They love intensely and are protective of their partners. They need admiration but also respect independence. They dislike deceit or indifference. Mutual trust and emotional understanding turn passion into lasting devotion.`,
    profession: `They thrive in leadership, business, or engineering—fields rewarding vision and execution. Capricorn gives discipline; Dragon gives drive. They're skilled organizers who inspire others. Rest and reflection prevent burnout.`
  },
  "capricorn-snake": {
    personality: `The Capricorn Snake is strategic, composed, and refined. Capricorn contributes patience and organization; Snake adds perception and subtlety. They rarely rush and always calculate the next move carefully. Their insight into people and systems is exceptional. They dislike chaos or shallow talk. When intuition joins logic, they make thoughtful and wise decisions.`,
    love_relationships: `They love privately and deeply. They value loyalty and emotional intelligence. They dislike emotional volatility. A calm, perceptive partner helps them feel secure enough to express affection openly.`,
    profession: `They excel in finance, psychology, or research—professions requiring discretion and patience. Capricorn offers planning; Snake offers intuition. They succeed through steady focus. Balance between solitude and collaboration enhances success.`
  },
  "capricorn-horse": {
    personality: `The Capricorn Horse is determined, independent, and ambitious. Capricorn adds responsibility and foresight; Horse brings enthusiasm and energy. They move fast toward goals but always with strategy. They can appear serious yet possess a strong sense of humor and adventure. Their challenge is learning flexibility when plans change. When balanced, they combine endurance with vision to achieve greatness.`,
    love_relationships: `They love earnestly and show affection through loyalty and support. They need partners who respect independence but offer consistency. They dislike emotional games. Shared goals and laughter keep love solid and inspiring.`,
    profession: `They thrive in business, travel, or management. Capricorn supplies structure; Horse supplies momentum. They're productive and self-motivated. Regular rest and recreation sustain their high energy and ambition.`
  },
  "capricorn-goat": {
    personality: `The Capricorn Goat is gentle, artistic, and steadfast. Capricorn contributes practicality and perseverance; Goat adds empathy and imagination. They're grounded creators who balance realism with beauty. They dislike conflict and prefer calm progress. Their challenge lies in asserting confidence and boundaries. When focused, they achieve lasting success through persistence and heart.`,
    love_relationships: `They love kindly and consistently. They need emotional reassurance and mutual respect. They dislike harsh criticism or unpredictability. When supported, they return devotion tenfold through care and loyalty.`,
    profession: `They flourish in art, education, or counselling—roles blending structure with compassion. Capricorn provides focus; Goat provides creativity. They succeed through cooperation and empathy. Self-belief fuels their potential.`
  },
  "capricorn-monkey": {
    personality: `The Capricorn Monkey is clever, ambitious, and adaptable. Capricorn offers discipline and focus; Monkey adds creativity and humor. They're practical innovators who use intellect to solve complex problems. They plan ahead but know when to improvise. Their charm makes them natural leaders and connectors. Their challenge is avoiding overwork by delegating trustfully.`,
    love_relationships: `They love playfully but with commitment. They seek intelligent, honest partners who share goals and humor. They dislike emotional confusion. When supported, they are loyal, resourceful, and affectionate.`,
    profession: `They excel in technology, communication, or business strategy—fields joining structure with innovation. Capricorn gives persistence; Monkey gives ingenuity. They thrive on challenges. Regular rest keeps ambition sustainable.`
  },
  "capricorn-rooster": {
    personality: `The Capricorn Rooster is meticulous, responsible, and insightful. Capricorn contributes diligence and patience; Rooster adds precision and candor. They set high standards and live by clear principles. They dislike disorder or dishonesty but can become overly self-critical. When balanced, they combine vision with humility and make excellent mentors.`,
    love_relationships: `They love earnestly and express care through loyalty and honesty. They dislike mind games or uncertainty. A partner who values integrity and humor brings out their warmth and romantic steadiness.`,
    profession: `They thrive in management, finance, or academia—roles rewarding structure and discipline. Capricorn provides ambition; Rooster provides organization. They lead with example and reliability. Embracing imperfection keeps them content.`
  },
  "capricorn-dog": {
    personality: `The Capricorn Dog is loyal, ethical, and pragmatic. Capricorn gives discipline and foresight; Dog brings honesty and empathy. They're dependable and fair, valuing principle over popularity. They dislike shortcuts or deceit. Their calm persistence earns respect. Their growth lies in allowing warmth to match responsibility.`,
    love_relationships: `They love deeply and steadily. They seek trust, honesty, and shared purpose. They dislike drama or unpredictability. When comfortable, they are caring and protective partners who build lasting relationships.`,
    profession: `They excel in law, education, or community service. Capricorn supplies structure; Dog supplies integrity. They inspire through example. Taking time for play prevents over-seriousness and keeps spirits bright.`
  },
  "capricorn-pig": {
    personality: `The Capricorn Pig is kind, diligent, and grounded. Capricorn adds ambition and focus; Pig adds compassion and optimism. They work hard to create comfort and fairness for everyone. They dislike conflict but handle pressure calmly. Their sincerity earns admiration and trust. Their challenge is remembering that their needs matter too.`,
    love_relationships: `They love with generosity and devotion. They dislike coldness or selfishness. They nurture relationships with humor, warmth, and dependability. Appreciation and honesty keep their hearts secure.`,
    profession: `They flourish in teaching, healthcare, or design—professions that reward service and care. Capricorn brings order; Pig brings empathy. They succeed through reliability and kindness. Regular self-care renews their strength and joy.`
  },
  "aquarius-rat": {
    personality: `The Aquarius Rat is inventive, witty, and quick-thinking. Aquarius adds originality and independence; Rat adds resourcefulness and charm. They excel at understanding people and ideas, often one step ahead of the crowd. They dislike routine and thrive on innovation. Their challenge is following through on the many concepts they generate. When focused, they become true visionaries capable of turning ideas into progress.`,
    love_relationships: `They love playfully and intellectually. They seek partners who respect freedom and individuality. They dislike possessiveness or predictability. Once committed, they are loyal and imaginative, keeping relationships stimulating and sincere.`,
    profession: `They thrive in media, technology, or design—fields where creativity meets intelligence. Aquarius gives inspiration; Rat gives practicality. They innovate effortlessly. Consistency turns their brilliance into long-term success.`
  },
  "aquarius-ox": {
    personality: `The Aquarius Ox is disciplined, reliable, and visionary. Aquarius offers originality and big-picture thinking; Ox adds patience and structure. They dream boldly but prefer step-by-step execution. They value honesty and reason and dislike rashness. Their calm persistence grounds their creativity. When they unite flexibility with determination, they become trusted innovators who make lasting change.`,
    love_relationships: `They love thoughtfully and steadily. They prefer commitment over drama. They dislike inconsistency or emotional volatility. Their affection is quiet but dependable. Shared respect and honesty form the foundation of their love.`,
    profession: `They excel in science, architecture, or research—fields joining logic with innovation. Aquarius provides imagination; Ox provides stamina. They build their legacy slowly and surely. Reflection balances their strong work ethic.`
  },
  "aquarius-tiger": {
    personality: `The Aquarius Tiger is bold, idealistic, and forward-looking. Aquarius brings vision and intellect; Tiger adds courage and conviction. They fight for progress and independence, unafraid to challenge norms. Their charisma attracts attention, and their beliefs inspire loyalty. Their challenge lies in tempering impulse with patience. When guided by wisdom, they become leaders of thought and movement.`,
    love_relationships: `They love passionately and honestly. They seek partners who share purpose and freedom. They dislike jealousy or control. When mutual respect thrives, their love becomes a partnership of equals and shared adventure.`,
    profession: `They succeed in leadership, activism, or creative innovation—fields requiring passion and foresight. Aquarius offers originality; Tiger offers courage. They motivate others through conviction. Rest and grounding keep their spark sustainable.`
  },
  "aquarius-rabbit": {
    personality: `The Aquarius Rabbit is gentle, intelligent, and empathetic. Aquarius gives imagination and curiosity; Rabbit adds diplomacy and grace. They seek to understand rather than dominate and approach life with creative peace. They can appear reserved but are quietly confident. They dislike conflict but excel at harmonizing groups. When self-assured, they become voices of kindness and progress.`,
    love_relationships: `They love with care and sincerity. They need emotional safety and appreciation. They dislike tension or harsh words. A supportive, humorous partner helps them express affection freely and deeply.`,
    profession: `They flourish in art, design, or counselling—professions blending intellect and empathy. Aquarius supplies innovation; Rabbit supplies tact. They inspire through calm leadership. Solitude restores their balance and creativity.`
  },
  "aquarius-dragon": {
    personality: `The Aquarius Dragon is charismatic, confident, and imaginative. Aquarius adds originality and intellect; Dragon contributes vitality and ambition. They possess natural magnetism and love inspiring new ideas. Their confidence can border on stubbornness, but their motives are noble. They dislike conformity and thrive in innovation and leadership. When they balance vision with humility, they become catalysts for progress and inspiration.`,
    love_relationships: `They love passionately and idealistically. They're drawn to partners who share big dreams and self-assurance. They dislike complacency or possessiveness. Their relationships flourish through admiration, trust, and shared adventure.`,
    profession: `They excel in technology, entrepreneurship, or creative leadership. Aquarius provides ideas; Dragon provides drive. They motivate through enthusiasm and originality. Reflection keeps their ambition aligned with purpose.`
  },
  "aquarius-snake": {
    personality: `The Aquarius Snake is insightful, strategic, and graceful. Aquarius brings intellect and foresight; Snake adds intuition and composure. They think deeply before acting and often understand hidden motives. They dislike superficiality or chaos. Calm and persuasive, they achieve through influence rather than force. When intellect merges with empathy, they become wise innovators and teachers.`,
    love_relationships: `They love thoughtfully and selectively. They value loyalty and emotional intelligence. They dislike drama or dishonesty. They express affection through subtle gestures and enduring support. Emotional honesty builds lasting connection.`,
    profession: `They thrive in research, design, or psychology—fields joining intellect and sensitivity. Aquarius supplies curiosity; Snake supplies insight. They succeed through quiet mastery. Regular solitude strengthens clarity and creativity.`
  },
  "aquarius-horse": {
    personality: `The Aquarius Horse is energetic, inventive, and sociable. Aquarius gives originality and independence; Horse brings vitality and charisma. They live for experience and ideas, often ahead of their time. They dislike constraint and need movement to stay inspired. Their optimism and adaptability make them leaders in creative or humanitarian projects. Their challenge is grounding their ideals with structure.`,
    love_relationships: `They love enthusiastically and freely. They value honesty and shared adventure. They dislike possessiveness or monotony. They thrive with partners who encourage exploration and mutual trust.`,
    profession: `They excel in travel, communication, or social enterprise. Aquarius provides innovation; Horse provides drive. They motivate through enthusiasm and kindness. Focused routines help sustain their visionary energy.`
  },
  "aquarius-goat": {
    personality: `The Aquarius Goat is creative, idealistic, and compassionate. Aquarius offers innovation and curiosity; Goat adds empathy and artistry. They envision a better world and often express their ideals through art or service. They dislike conflict but stand firm in their values. Their gentle approach hides strong resolve. When confidence meets empathy, they inspire others toward harmony.`,
    love_relationships: `They love tenderly and selflessly. They're drawn to kind, open-minded partners. They dislike harshness or criticism. A nurturing connection helps them express affection fearlessly and grow together.`,
    profession: `They flourish in art, education, or humanitarian work. Aquarius gives vision; Goat gives sensitivity. They work best in supportive teams. Protecting downtime nurtures their creativity and emotional wellbeing.`
  },
  "aquarius-monkey": {
    personality: `The Aquarius Monkey is brilliant, witty, and inventive. Aquarius contributes originality and independence; Monkey adds humor and adaptability. They think quickly and love solving problems in unconventional ways. They're engaging conversationalists with limitless curiosity. They must guard against scattered focus and overcommitment. When grounded, they're visionary creators who turn fresh ideas into tangible success.`,
    love_relationships: `They love playfully and sincerely. They value intellectual chemistry and laughter. They dislike jealousy or monotony. With freedom and fun, they form loyal and dynamic bonds full of creativity and affection.`,
    profession: `They thrive in technology, entrepreneurship, or entertainment—professions that reward ingenuity. Aquarius supplies ideas; Monkey supplies execution. They shine where innovation meets human connection. Consistent planning ensures lasting results.`
  },
  "aquarius-rooster": {
    personality: `The Aquarius Rooster is confident, articulate, and insightful. Aquarius gives originality and intellect; Rooster adds precision and honesty. They have sharp minds and speak their truth clearly. They're reformers who prefer rational solutions to emotion-driven drama. They can be perfectionists but are admired for fairness and reliability. When they balance intellect with empathy, their wisdom becomes transformational.`,
    love_relationships: `They love sincerely and thoughtfully. They value respect and open dialogue. They dislike mind games or disorganization. Their devotion shows in loyalty and practical support. Shared ideals keep love stable and inspiring.`,
    profession: `They excel in teaching, science, or management. Aquarius offers foresight; Rooster offers discipline. They succeed where integrity meets innovation. Taking time for reflection keeps their creativity replenished.`
  },
  "aquarius-dog": {
    personality: `The Aquarius Dog is honest, principled, and visionary. Aquarius provides intellect and innovation; Dog adds loyalty and fairness. They're truth-seekers who defend equality and justice. People trust their sincerity and idealism. They can be serious at times, but humor restores their balance. Their purpose is to unite reason with compassion for the greater good.`,
    love_relationships: `They love faithfully and respectfully. They seek partners who share purpose and authenticity. They dislike deceit or apathy. When emotionally secure, they're affectionate and dedicated companions.`,
    profession: `They thrive in law, education, or humanitarian work. Aquarius gives vision; Dog gives moral strength. They inspire trust through fairness. Regular relaxation renews their clarity and optimism.`
  },
  "aquarius-pig": {
    personality: `The Aquarius Pig is kind, open-minded, and imaginative. Aquarius adds intellect and originality; Pig brings patience and compassion. They approach life with curiosity and sincerity, seeking harmony through understanding. They dislike cruelty or cynicism and bring optimism to any group. Their generosity of spirit inspires friendship and cooperation everywhere they go.`,
    love_relationships: `They love wholeheartedly and with optimism. They crave mutual respect and warmth. They dislike harshness or emotional distance. With kindness and humor, they build affectionate, lasting relationships.`,
    profession: `They flourish in education, art, or community leadership. Aquarius provides ideas; Pig provides empathy. They lead with positivity and creativity. Maintaining healthy boundaries preserves their radiant goodwill.`
  },
  "pisces-rat": {
    personality: `The Pisces Rat is imaginative, intuitive, and strategic. Pisces adds empathy and artistry; Rat contributes adaptability and clever thinking. They sense opportunity as easily as emotion, blending heart with intelligence. They dislike rigid systems and thrive in fluid, creative environments. Their challenge is turning inspiration into consistent follow-through. When focused, they unite intuition and logic to create practical magic.`,
    love_relationships: `They love romantically and sincerely. They value trust and shared dreams. They dislike coldness or control. Once devoted, they nurture their partner with warmth and imagination. Emotional honesty keeps their connection luminous.`,
    profession: `They excel in design, communication, or counselling—fields joining creativity and insight. Pisces supplies vision; Rat supplies strategy. They succeed when discipline supports inspiration.`
  },
  "pisces-ox": {
    personality: `The Pisces Ox is gentle, reliable, and quietly determined. Pisces offers sensitivity and compassion; Ox adds steadiness and practicality. They balance heart and discipline, creating peace through persistence. They may appear reserved but feel deeply. Their strength lies in calm devotion. When emotion and structure cooperate, they build lasting harmony.`,
    love_relationships: `They love faithfully and patiently. They express affection through care and dependability. They dislike conflict or chaos. A grounded yet kind partner earns their lifelong loyalty and affection.`,
    profession: `They thrive in healthcare, education, or management—professions valuing consistency and empathy. Pisces gives understanding; Ox gives endurance. They achieve through reliability and compassion.`
  },
  "pisces-tiger": {
    personality: `The Pisces Tiger is passionate, idealistic, and courageous. Pisces adds intuition and empathy; Tiger adds strength and daring. They fight for what feels right and inspire others with heartfelt conviction. They dislike injustice or cruelty. Their emotions run deep, but courage turns feeling into action. When balanced, they become fearless protectors guided by compassion.`,
    love_relationships: `They love boldly and protectively. They crave honesty and shared ideals. They dislike insincerity or coldness. With understanding and loyalty, their love becomes both sanctuary and adventure.`,
    profession: `They excel in activism, art, or leadership—fields that demand passion with purpose. Pisces brings imagination; Tiger brings drive. They motivate others through empathy in motion.`
  },
  "pisces-rabbit": {
    personality: `The Pisces Rabbit is kind, intuitive, and refined. Pisces gives emotional depth and creativity; Rabbit adds grace and diplomacy. They sense others' moods instantly and strive to create calm. They dislike aggression or haste. Their quiet confidence makes them natural healers and artists. When self-trust grows, they turn sensitivity into serenity.`,
    love_relationships: `They love with tenderness and patience. They need security and affection. They dislike criticism or neglect. When cherished, they offer gentle devotion that feels timeless.`,
    profession: `They flourish in art, counselling, or design—fields blending empathy and beauty. Pisces contributes imagination; Rabbit contributes tact. They excel through patience and peaceful collaboration.`
  },
  "pisces-dragon": {
    personality: `The Pisces Dragon is magnetic, imaginative, and spiritually driven. Pisces contributes empathy and vision; Dragon adds strength and charisma. They dream on a grand scale and inspire others through creativity and courage. Their intuition is powerful, but they must stay grounded to realize their ideas. When faith meets focus, they turn imagination into impact.`,
    love_relationships: `They love deeply and passionately. They seek partners who believe in their dreams and return honesty. They dislike indifference or control. Emotional openness and shared wonder keep their love radiant.`,
    profession: `They thrive in art, leadership, or humanitarian projects—careers that join inspiration with influence. Pisces brings compassion; Dragon brings drive. They achieve greatness when they align idealism with discipline.`
  },
  "pisces-snake": {
    personality: `The Pisces Snake is intuitive, elegant, and wise. Pisces provides empathy and creativity; Snake contributes insight and composure. They move through life gracefully, preferring thought over haste. Their intuition is keen, and they often understand emotions others can't express. They dislike superficiality or chaos. Their gift lies in merging depth with calm wisdom.`,
    love_relationships: `They love thoughtfully and loyally. They value privacy, sensitivity, and emotional truth. They dislike drama or mistrust. Their affection is deep and enduring when met with mutual understanding.`,
    profession: `They excel in psychology, design, or writing—fields requiring subtlety and vision. Pisces gives imagination; Snake gives discernment. They succeed quietly but powerfully. Solitude nurtures their insight and artistry.`
  },
  "pisces-horse": {
    personality: `The Pisces Horse is creative, expressive, and free-spirited. Pisces brings imagination and empathy; Horse adds enthusiasm and independence. They're magnetic storytellers who follow intuition rather than convention. They dislike restriction or cynicism. Their energy flows best when emotion inspires action. When grounded, they combine sensitivity with courage and achieve authentic success.`,
    love_relationships: `They love openly and romantically. They seek adventure mixed with tenderness. They dislike criticism or emotional distance. With appreciation and freedom, their love becomes passionate and enduring.`,
    profession: `They thrive in travel, music, or communication—roles blending expression and exploration. Pisces offers creativity; Horse offers initiative. They lead through inspiration. Structure keeps their brilliance consistent.`
  },
  "pisces-goat": {
    personality: `The Pisces Goat is artistic, gentle, and deeply compassionate. Pisces provides empathy and imagination; Goat adds kindness and grace. They see beauty and potential in everyone and often serve as healers or artists. They dislike conflict and prefer peace. Their sensitivity is profound but requires strong boundaries. When self-assured, they bring harmony wherever they go.`,
    love_relationships: `They love tenderly and selflessly. They need reassurance and affection to feel secure. They dislike harshness or neglect. Encouragement and warmth help them share their heart fearlessly.`,
    profession: `They flourish in art, teaching, or wellness—professions linking compassion with creativity. Pisces adds intuition; Goat adds empathy. They inspire through understanding. Quiet time restores their emotional balance.`
  },
  "pisces-monkey": {
    personality: `The Pisces Monkey is imaginative, intelligent, and quick-witted. Pisces adds empathy and artistry; Monkey contributes humor and adaptability. They understand emotions deeply but prefer to lighten life with laughter and ideas. Their curiosity keeps them exploring new possibilities, yet they must focus to finish what they start. When centered, they're insightful storytellers who inspire others with both heart and intellect.`,
    love_relationships: `They love playfully and affectionately. They seek emotional and intellectual harmony. They dislike dullness or insecurity. A partner who brings humor, patience, and depth unlocks their most devoted and creative love.`,
    profession: `They thrive in media, communication, or creative entrepreneurship—fields where expression meets vision. Pisces supplies intuition; Monkey supplies cleverness. They succeed through flexibility and inspiration.`
  },
  "pisces-rooster": {
    personality: `The Pisces Rooster is idealistic, principled, and analytical. Pisces offers intuition and kindness; Rooster adds clarity and focus. They strive to live by truth and help others find theirs. They dislike confusion and can be self-critical, but their heart is pure. Their challenge is blending realism with compassion. When balanced, they become steady guides and eloquent thinkers.`,
    love_relationships: `They love earnestly and truthfully. They need transparency and respect. They dislike dishonesty or disorganization. Shared values and trust create lifelong stability in love.`,
    profession: `They excel in education, research, or healthcare—roles combining structure and empathy. Pisces brings emotional wisdom; Rooster brings method. They lead with precision and care. Creative outlets maintain their emotional balance.`
  },
  "pisces-dog": {
    personality: `The Pisces Dog is compassionate, loyal, and idealistic. Pisces contributes sensitivity and vision; Dog adds sincerity and principle. They defend those they love and strive to bring kindness into every space. They dislike injustice or emotional neglect. Their challenge lies in trusting joy as much as duty. When hopeful, they're healers who uplift everyone around them.`,
    love_relationships: `They love faithfully and wholeheartedly. They seek honesty, reassurance, and emotional safety. They dislike betrayal or apathy. With trust, they form deep bonds built on devotion and empathy.`,
    profession: `They thrive in social work, education, or wellness—fields focused on helping others. Pisces gives intuition; Dog gives integrity. They inspire through compassion and service. Rest keeps their generous spirit renewed.`
  },
  "pisces-pig": {
    personality: `The Pisces Pig is kind, artistic, and serene. Pisces brings imagination and spirituality; Pig offers warmth and sincerity. They radiate calm understanding and easily earn trust. They dislike conflict and prefer harmony through love and acceptance. Their optimism and intuition guide them through life's challenges with grace. When balanced, they embody true emotional wisdom.`,
    love_relationships: `They love wholeheartedly and with forgiveness. They value kindness, laughter, and peace. They dislike tension or criticism. They create emotional safety through patience and open-hearted devotion.`,
    profession: `They flourish in the arts, healing, or community leadership—roles that spread compassion. Pisces contributes creativity; Pig contributes generosity. They succeed when work aligns with purpose. Self-care keeps their empathy luminous.`
  }
}

function generatePersonalityDescription(western: any, chinese: any): string {
  const key = `${western.name.toLowerCase()}-${chinese.name.toLowerCase()}`
  const data = signCombinationData[key]
  return data?.personality || "This unique combination blends the best qualities of both traditions, creating a complex and fascinating personality profile."
}

function generateLoveCompatibility(western: any, chinese: any): string {
  const key = `${western.name.toLowerCase()}-${chinese.name.toLowerCase()}`
  const data = signCombinationData[key]
  return data?.love_relationships || "This unique astrological combination creates a distinctive approach to love and relationships, blending passionate expression with deep emotional wisdom."
}

function generateProfessionDescription(western: any, chinese: any): string {
  const key = `${western.name.toLowerCase()}-${chinese.name.toLowerCase()}`
  const data = signCombinationData[key]
  return data?.profession || "Your unique astrological combination suggests success in careers that allow you to express both your Western and Eastern zodiac strengths, blending ambition with wisdom."
}

function getUserZodiacSigns() {
  if (typeof window === "undefined") return null

  const userSunSign = localStorage.getItem("userSunSign") || "aquarius"
  const userChineseSign = localStorage.getItem("userChineseSign") || "monkey"

  return {
    western: userSunSign,
    chinese: userChineseSign,
  }
}

function calculateCompatibilityRating(
  userWestern: string,
  userChinese: string,
  pageWestern: string,
  pageChinese: string,
): number {
  // Map lowercase sign names to proper case for the matching engine
  const capitalizeSign = (sign: string): string => {
    return sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase()
  }

  try {
    // Create hybrid signatures for both users
    const userSignature: HybridSignature = {
      western: capitalizeSign(userWestern) as SiderealSign,
      animal: capitalizeSign(userChinese) as ChineseAnimal,
    }

    const pageSignature: HybridSignature = {
      western: capitalizeSign(pageWestern) as SiderealSign,
      animal: capitalizeSign(pageChinese) as ChineseAnimal,
    }

    console.log("🔍 Compatibility Debug:")
    console.log("User:", userSignature)
    console.log("Page:", pageSignature)

    // Use the sophisticated matching engine's pairScore function
    const score = pairScore(userSignature, pageSignature)
    
    console.log("Calculated Score:", score)
    
    return score
  } catch (error) {
    console.error("❌ Error calculating compatibility:", error)
    // Fallback to 75 if there's an error
    return 75
  }
}

function getCompatibilityDescription(rating: number): { level: string; description: string; color: string } {
  if (rating >= 90) {
    return {
      level: "Exceptional Match",
      description:
        "Your astrological energies align beautifully, creating potential for deep understanding and harmony.",
      color: "text-green-400",
    }
  } else if (rating >= 80) {
    return {
      level: "Strong Compatibility",
      description: "Your zodiac combinations complement each other well, suggesting great potential for connection.",
      color: "text-blue-400",
    }
  } else if (rating >= 70) {
    return {
      level: "Mixed Match",
      description: "Balanced synergy with room for growth — consistent effort keeps momentum moving forward.",
      color: "text-yellow-400",
    }
  } else if (rating >= 60) {
    return {
      level: "Moderate Compatibility",
      description: "Your zodiac signs have some challenges but also opportunities for learning from each other.",
      color: "text-orange-400",
    }
  } else {
    return {
      level: "Challenging Match",
      description: "Your astrological energies may clash, but with understanding, you can learn from your differences.",
      color: "text-red-400",
    }
  }
}

export default function ZodiacCombinationPage({ params }: ZodiacCombinationPageProps) {
  const { theme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [userSigns, setUserSigns] = useState<{ western: string; chinese: string } | null>(null)
  const [compatBox, setCompatBox] = useState<ConnectionBoxData | null>(null)
  const [pageSigns, setPageSigns] = useState<{ western: string; chinese: string } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  // Extract page signs from params
  useEffect(() => {
    console.log('[Astrology Page] Extracting page signs from params:', params)
    setPageSigns({
      western: params.western.toLowerCase(),
      chinese: params.chinese.toLowerCase()
    })
    console.log('[Astrology Page] Page signs set to:', {
      western: params.western.toLowerCase(),
      chinese: params.chinese.toLowerCase()
    })
  }, [params.western, params.chinese])

  useEffect(() => {
    setMounted(true)
    
    console.log('[Astrology Page] Component mounted, loading user signs...')
    
    // Load user's zodiac signs from localStorage
    const storedWestern = localStorage.getItem("userSunSign")
    const storedChinese = localStorage.getItem("userChineseSign")

    console.log("[Astrology Page] Loading from localStorage:", { storedWestern, storedChinese })

    if (storedWestern && storedChinese) {
      const signs = {
        western: storedWestern.toLowerCase(),
        chinese: storedChinese.toLowerCase(),
      }
      setUserSigns(signs)
      console.log("[Astrology Page] User signs loaded from storage:", signs)
    } else {
      // Default fallback - Use Aquarius Monkey as you mentioned
      console.warn("[Astrology Page] No user signs in localStorage, using default Aquarius-Monkey")
      const defaultSigns = {
        western: 'aquarius',
        chinese: 'monkey'
      }
      setUserSigns(defaultSigns)
      // Also set them in localStorage so they persist
      localStorage.setItem("userSunSign", "aquarius")
      localStorage.setItem("userChineseSign", "monkey")
      saveSunSigns("Aquarius", "Aquarius")
      console.log("[Astrology Page] Default user signs set:", defaultSigns)
    }
  }, [])

  // Helper function to convert SimpleConnectionBox to ConnectionBoxData
  const convertSimpleToConnectionBoxData = (
    simpleBox: any, // SimpleConnectionBox type
    userWest: string,
    userEast: string,
    profileWest: string,
    profileEast: string,
    userYearElement?: any,
    profileYearElement?: any
  ): ConnectionBoxData => {
    // Map match label to rank key
    const labelToRankKey: Record<string, string> = {
      "Soulmate Match": "perfect",
      "Twin Flame Match": "excellent",
      "Excellent Match": "excellent",
      "Harmonious Match": "excellent",
      "Favourable Match": "good",
      "Good Friends": "good",
      "Good Friends Match": "good",
      "Opposites Attract": "fair",
      "Magnetic Opposites": "fair",
      "Neutral Match": "fair",
      "Difficult Match": "challenging",
    };
    
    const rankKey = labelToRankKey[simpleBox.matchLabel] || "neutral";
    
    // Map label to tier
    const labelToTier = (label: string): any => {
      if (label === "Soulmate Match") return "Soulmate";
      if (label === "Twin Flame Match") return "Twin Flame";
      if (label === "Excellent Match" || label === "Harmonious Match") return "Excellent";
      if (label === "Favourable Match") return "Favourable";
      if (label === "Good Friends" || label === "Good Friends Match") return "Favourable";
      if (label === "Opposites Attract" || label === "Magnetic Opposites") return "Magnetic Opposites";
      if (label === "Neutral Match") return "Neutral";
      if (label === "Difficult Match") return "Difficult";
      return "Neutral";
    };
    
    // Extract emoji and color from label
    const labelToEmoji: Record<string, string> = {
      "Soulmate Match": "💫",
      "Twin Flame Match": "🔥",
      "Excellent Match": "✨",
      "Harmonious Match": "✨",
      "Favourable Match": "✨",
      "Good Friends": "✨",
      "Good Friends Match": "✨",
      "Opposites Attract": "⚡",
      "Magnetic Opposites": "⚡",
      "Neutral Match": "✨",
      "Difficult Match": "💔",
    };
    
    const labelToColor: Record<string, string> = {
      "Soulmate Match": "rgb(212, 175, 55)",
      "Twin Flame Match": "rgb(255, 140, 0)",
      "Excellent Match": "rgb(219, 39, 119)",
      "Harmonious Match": "rgb(219, 39, 119)",
      "Favourable Match": "rgb(219, 39, 119)",
      "Good Friends": "rgb(34, 139, 34)",
      "Good Friends Match": "rgb(34, 139, 34)",
      "Opposites Attract": "rgb(239, 68, 68)",
      "Magnetic Opposites": "rgb(239, 68, 68)",
      "Neutral Match": "rgb(34, 139, 34)",
      "Difficult Match": "rgb(239, 68, 68)",
    };
    
    const tier = labelToTier(simpleBox.matchLabel);
    
    // Generate Western sun sign relationship blurb
    const westernSignLine = getSunMatchBlurb(
      userWest.toLowerCase() as WesternSign,
      profileWest.toLowerCase() as WesternSign
    );
    
    return {
      score: simpleBox.score,
      rank: simpleBox.matchLabel,
      rankLabel: simpleBox.matchLabel,
      rankKey: rankKey as any,
      emoji: labelToEmoji[simpleBox.matchLabel] || "🌟",
      colorRgb: labelToColor[simpleBox.matchLabel] || "rgb(34, 139, 34)",
      connectionLabel: simpleBox.headingLine,
      tagline: simpleBox.matchLabel,
      east_tagline: simpleBox.chineseLine,
      tags: [],
      insight: simpleBox.overview || 'Compatibility information is being calculated.',
      longformBody: simpleBox.overview || 'Compatibility information is being calculated.',
      east_relation: simpleBox.chineseLine,
      east_summary: simpleBox.chineseLine,
      east_description: simpleBox.chineseDescription || '',
      west_relation: simpleBox.westernLine,
      west_summary: simpleBox.westernLine,
      west_description: simpleBox.westernDescription || '',
      westernSignLine: westernSignLine,
      wuXingLine: simpleBox.wuXingLine,
      a: {
        west: userWest,
        east: userEast,
        westGlyph: getWesternSignGlyph(userWest),
        eastGlyph: getChineseSignGlyph(userEast),
        chineseElement: userYearElement
      },
      b: {
        west: profileWest,
        east: profileEast,
        westGlyph: getWesternSignGlyph(profileWest),
        eastGlyph: getChineseSignGlyph(profileEast),
        chineseElement: profileYearElement
      },
      tier: tier as any,
      // Pattern fields from SimpleConnectionBox
      chinesePattern: simpleBox.chinesePattern,
      westAspect: simpleBox.westAspect,
      westElementRelation: simpleBox.westElementRelation,
      isChineseOpposite: simpleBox.isChineseOpposite,
      isLivelyPair: simpleBox.isLivelyPair,
      wuXingA: userYearElement,
      wuXingB: profileYearElement,
      // Match engine result fields
      pillLabel: simpleBox.pillLabel,
      pattern: simpleBox.pattern,
      patternFullLabel: simpleBox.patternFullLabel,
      baseTagline: simpleBox.baseTagline,
      patternEmoji: simpleBox.patternEmoji,
      chemistryStars: simpleBox.chemistryStars,
      stabilityStars: simpleBox.stabilityStars,
    }
  }

  // Build compatibility box when user signs are loaded
  useEffect(() => {
    console.log('[Astrology Page] useEffect TRIGGERED - userSigns:', userSigns, 'pageSigns:', pageSigns)
    
    if (!userSigns || !pageSigns) {
      console.log('[Astrology Page] Missing signs:', { userSigns, pageSigns })
      return
    }
    
    console.log('[Astrology Page] Starting compatibility calculation with new match engine...')
    
    try {
      // Create UserProfile objects for the new match engine
      const userProfile: UserProfile = {
        sunSign: userSigns.western.toLowerCase() as any,
        animal: userSigns.chinese.toLowerCase() as any,
      }
      
      const pageProfile: UserProfile = {
        sunSign: pageSigns.western.toLowerCase() as any,
        animal: pageSigns.chinese.toLowerCase() as any,
      }
      
      console.log('[Astrology Page] User profiles:', { userProfile, pageProfile })
      
      // Get year elements from localStorage if available, or use defaults
      // Try to get user birthdate to calculate year element
      const userBirthdate = localStorage.getItem("userBirthdate")
      const pageBirthdate = null // Page signs don't have birthdates
      
      let userYearElement: any = undefined
      let pageYearElement: any = undefined
      
      if (userBirthdate) {
        try {
          const birthYear = new Date(userBirthdate).getFullYear()
          userYearElement = getWuXingYearElement(birthYear)
          console.log('[Astrology Page] User year element calculated:', userYearElement)
        } catch (e) {
          console.warn('[Astrology Page] Could not calculate user year element:', e)
        }
      }
      
      // Use default year (1990) for page profile if needed
      // In a real scenario, you might want to use a different default or make it configurable
      pageYearElement = getWuXingYearElement(1990)
      
      // Use the new match engine buildConnectionBox function
      const simpleBox = buildConnectionBox(
        userProfile,
        pageProfile,
        userYearElement,
        pageYearElement
      )
      
      console.log('[Astrology Page] SimpleConnectionBox from new engine:', simpleBox)
      
      if (!simpleBox) {
        throw new Error('buildConnectionBox returned an empty result')
      }
      
      // Convert SimpleConnectionBox to ConnectionBoxData
      const boxData = convertSimpleToConnectionBoxData(
        simpleBox,
        capitalizeSign(userSigns.western),
        capitalizeSign(userSigns.chinese),
        capitalizeSign(pageSigns.western),
        capitalizeSign(pageSigns.chinese),
        userYearElement,
        pageYearElement
      )
      
      setCompatBox(boxData)
      console.log('[Astrology Page] ✅ Compat box set successfully using new match engine!')
    } catch (error) {
      console.error("[Astrology Page] ❌ Error building compat box:", error)
      console.error("[Astrology Page] Error message:", error instanceof Error ? error.message : String(error))
      console.error("[Astrology Page] Error stack:", error instanceof Error ? error.stack : 'No stack')
      // Set compatBox to null to show error state
      setCompatBox(null)
    }
  }, [userSigns, pageSigns])

  const westernSign = pageSigns ? westernSigns[pageSigns.western as keyof typeof westernSigns] : null
  const chineseSign = pageSigns ? chineseSigns[pageSigns.chinese as keyof typeof chineseSigns] : null

  const spiritAnimalKey = pageSigns ? `${pageSigns.western}-${pageSigns.chinese}` : ''
  const spiritAnimal = spiritAnimalKey ? spiritAnimals[spiritAnimalKey] : null
  const spiritAnimalUrl = spiritAnimal
    ? `https://www.primalastrology.com/${spiritAnimal.toLowerCase().replace(/\s+/g, "-")}.html`
    : null

  if (!mounted) {
    return (
      <div className="mobile-container">
        <div className={`${theme === "starlight" ? "astrology-cosmic-bg" : theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-4 w-48 mx-auto"></div>
              <div className="h-4 bg-white/10 rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!westernSign || !chineseSign) {
    return (
      <div className="mobile-container">
        <div className={`${theme === "starlight" ? "astrology-cosmic-bg" : theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} min-h-screen flex items-center justify-center`}>
          <div className="text-center">
            <h1 className="astrology-heading-primary mb-4">Combination Not Found</h1>
            <Link href="/astrology" className="zodiac-list-item inline-flex items-center gap-2 px-6 py-3">
              Return to Astrology
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const personalityDescription = westernSign && chineseSign ? generatePersonalityDescription(westernSign, chineseSign) : null
  const loveCompatibility = westernSign && chineseSign ? generateLoveCompatibility(westernSign, chineseSign) : null
  const professionDescription = westernSign && chineseSign ? generateProfessionDescription(westernSign, chineseSign) : null
  const fusionArchetypeData = pageSigns ? getFusionArchetypeData(pageSigns.western, pageSigns.chinese) : null
  const archetypeName = pageSigns ? getArchetypeName(pageSigns.western, pageSigns.chinese) : ''

  return (
    <div className="mobile-container">
      <div
        className={`${theme === "starlight" ? "astrology-cosmic-bg" : theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"} combination-page min-h-screen pb-20`}
      >

        <div className="relative z-10 px-4 pt-2 pb-8">
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => router.back()}
              className={`inline-flex items-center gap-1 transition-colors ${
                theme === "light" 
                  ? "text-black hover:text-black/70" 
                  : "text-white hover:text-white/80"
              }`}
            >
              <svg 
                className="w-8 h-8 drop-shadow-lg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            <div className="flex items-center gap-0.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  style={{ fill: "#fbbf24" }}
                />
              </svg>
              <span className="font-bold text-base bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                AstroLibrary
              </span>
            </div>

            <div className="w-[60px]" />
          </div>

          {/* Match Engine Connection Box */}
          {compatBox && userSigns ? (
            <div className="mb-6">
              {(() => {
                // Map rankLabel to ConnectionBoxNew tier format
                const mapTier = (label?: string): "Soulmate Match" | "Twin Flame Match" | "Excellent Match" | "Favourable Match" | "Neutral Match" | "Opposites Attract" | "Difficult Match" => {
                  const l = (label || "").toLowerCase();
                  if (l.includes("soulmate")) return "Soulmate Match";
                  if (l.includes("twin flame")) return "Twin Flame Match";
                  if (l.includes("excellent")) return "Excellent Match";
                  if (l.includes("favourable") || l.includes("favorable")) return "Favourable Match";
                  if (l.includes("opposites attract") || l.includes("magnetic opposites")) return "Opposites Attract";
                  if (l.includes("difficult") || l.includes("challenging")) return "Difficult Match";
                  return "Neutral Match";
                };
                
                return (
                  <ConnectionBoxNew
                    tier={mapTier(compatBox.rankLabel || compatBox.rank) as any}
                    score={compatBox.score}
                    westA={compatBox.a?.west || ""}
                    eastA={compatBox.a?.east || ""}
                    westB={compatBox.b?.west || ""}
                    eastB={compatBox.b?.east || ""}
                    chineseLine={compatBox.east_relation || compatBox.east_summary || ""}
                    sunMatchBlurb={compatBox.westernSignLine || ""}
                    westernLine={compatBox.west_relation || compatBox.west_summary || ""}
                    wuXingLine={compatBox.wuXingLine}
                    connectionBlurb={compatBox.insight}
                    theme={theme}
                    chineseElementA={compatBox.a?.chineseElement}
                    chineseElementB={compatBox.b?.chineseElement}
                    chinesePattern={compatBox.chinesePattern as any}
                    westAspect={compatBox.westAspect as any}
                    westElementRelation={compatBox.westElementRelation as any}
                    isChineseOpposite={compatBox.isChineseOpposite}
                    isLivelyPair={compatBox.isLivelyPair}
                    patternFullLabel={compatBox.patternFullLabel}
                    pillLabel={compatBox.pillLabel}
                    baseTagline={compatBox.baseTagline}
                    patternEmoji={compatBox.patternEmoji}
                    pattern={compatBox.pattern}
                    chemistryStars={compatBox.chemistryStars}
                    stabilityStars={compatBox.stabilityStars}
                    showProfile={false}
                    showElements={true}
                  />
                );
              })()}
            </div>
          ) : userSigns && !compatBox ? (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
              <div className="text-center py-4">
                <p className="text-sm text-red-400 mb-2">Unable to load connection data</p>
                <p className="text-xs text-gray-600 dark:text-white/60">User Signs: {userSigns.western}/{userSigns.chinese}</p>
                <p className="text-xs text-gray-600 dark:text-white/60">Page Signs: {pageSigns?.western}/{pageSigns?.chinese}</p>
                <p className="text-xs text-gray-600 dark:text-white/60 mt-2">Check console for detailed errors</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 dark:text-white/60 italic">Loading your connection...</p>
                {!userSigns && <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Loading user signs...</p>}
                {!pageSigns && <p className="text-xs text-gray-500 dark:text-white/50 mt-1">Loading page signs...</p>}
              </div>
            </div>
          )}

          {/* Fusion Archetype Box - Combined */}
          <div className="zodiac-sign-card mb-6" style={{ border: "1px solid #d1d5db" }}>
            {/* Sign Combination Header */}
            <div className="text-center mb-6">
              <h1 className="astrology-heading-primary mb-4">
                {westernSign.name} {chineseSign.name}
              </h1>
              
              <div className="flex justify-center items-center gap-8 mb-4">
                <div className="text-center">
                  <div 
                    className={`zodiac-symbol mb-2 ${theme === "starlight" ? "text-white" : "text-white/95"}`}
                    style={{ background: "transparent", border: "none", fontSize: "2.25rem" }}
                  >
                    {westernSign.symbol}
                  </div>
                  <p className={`zodiac-name ${theme === "starlight" ? "text-white" : "text-white/95"}`}>{westernSign.name}</p>
                  <p className={`zodiac-dates ${theme === "starlight" ? "text-white/70" : "text-white/70"}`}>{westernSign.element} Element</p>
                </div>

                <div className={`text-4xl ${theme === "starlight" ? "text-white/40" : "text-white/40"}`}>×</div>

                <div className="text-center">
                  <div 
                    className="zodiac-symbol mb-2"
                    style={{ background: "transparent", border: "none", fontSize: "3rem" }}
                  >
                    <ChineseZodiacIcon
                      animal={chineseSign.symbol as any}
                      size="xl"
                      className={`${theme === "starlight" ? "text-white" : "text-white/95"}`}
                    />
                  </div>
                  <p className={`zodiac-name ${theme === "starlight" ? "text-white" : "text-white/95"}`}>{chineseSign.name}</p>
                  <p className={`zodiac-dates ${theme === "starlight" ? "text-white/70" : "text-white/70"}`}>{chineseSign.element} Element</p>
                </div>
              </div>
            </div>
            
            <h2 className="astrology-heading-secondary mb-6 text-center">
              The {archetypeName}
            </h2>

            {/* Personality Section */}
            <div className="mb-6">
              <h2 className="astrology-heading-secondary mb-3">Personality</h2>
              <p className={`text-base leading-relaxed ${theme === "starlight" ? "text-white/80" : "text-white/80"}`}>
                {personalityDescription}
              </p>
            </div>

            {/* Love & Relationships Section */}
            <div className="mb-6">
              <h2 className="astrology-heading-secondary mb-3">Love & Relationships</h2>
              <p className={`text-base leading-relaxed ${theme === "starlight" ? "text-white/80" : "text-white/80"}`}>
                {loveCompatibility}
              </p>
            </div>

            {/* Profession Section */}
            <div>
              <h2 className="astrology-heading-secondary mb-3">Profession</h2>
              <p className={`text-base leading-relaxed ${theme === "starlight" ? "text-white/80" : "text-white/80"}`}>
                {professionDescription}
              </p>
            </div>
          </div>

          <div className="space-y-6">

            <div className="zodiac-sign-card" style={{ border: "1px solid #d1d5db" }}>
              <h2 className="astrology-heading-secondary mb-3">Spirit Animal Sign</h2>
              {spiritAnimal ? (
            <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="astrology-heading-tertiary mb-1">Your Primal Zodiac Sign</h3>
                    <p className={`text-2xl font-bold ${theme === "starlight" ? "text-white" : "text-white/95"} mb-2`}>
                      {spiritAnimal}
                    </p>
                  </div>
                  <p className={`text-base leading-relaxed ${theme === "starlight" ? "text-white/80" : "text-white/80"}`}>
                    According to Primal Astrology, the combination of {westernSign.name} and {chineseSign.name} creates
                    the {spiritAnimal} spirit animal sign. This unique fusion represents your core personality traits
                    and spiritual essence.
                  </p>
                  {spiritAnimalUrl && (
                    <a
                      href={spiritAnimalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-base ${theme === "starlight" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} transition-colors`}
                    >
                      Learn more about the {spiritAnimal} on Primal Astrology
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              ) : (
                <p className={`text-base leading-relaxed ${theme === "starlight" ? "text-white/80" : "text-white/80"}`}>
                  Spirit animal information not available for this combination.
                </p>
              )}
            </div>

            {/* Chinese Zodiac Trine Compatibility Table */}

          </div>
        </div>
      </div>
    </div>
  )
}
