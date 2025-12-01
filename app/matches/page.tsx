"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import { explainMatchAndScore } from "@/lib/matchExplainAndScore"
import { computeMatchWithNewEngine } from "@/lib/matchEngineAdapter"
import { computeMatchWithClassifier } from "@/lib/classifierAdapter"
import { type West, type East, getWuXingYearElement, type WuXing, buildMatchResult, type MatchInput, normalizePattern, convertElementRelation, convertAspectRelation, calculateWestAspect, getWesternSignElement, calculateWestElementRelation, type WesternSign as WesternSignType, type ChineseAnimal as ChineseAnimalType, computeWuXingRelation } from "@/lib/matchEngine"
import { autoInsight } from "@/lib/insight"
import { INSIGHT_OVERRIDES, type OverrideKey } from "@/data/insight_overrides"
import { getCompleteLongformBlurb, getTierKeyFromScore, createPairId } from "@/data/longformBlurbsComplete"
import { getWesternSignGlyph, getChineseSignGlyph, capitalizeSign } from "@/lib/zodiacHelpers"
import { buildConnectionBlurb, elementDynamics } from "@/lib/connectionBlurbGenerator"
import { buildConnectionBlurbMinimal, type TierLabel, type ChinesePattern, ChineseChemistryDescription, WesternChemistryDescription, type WesternElementCompatibility } from "@/lib/connectionBlurbMinimal"
import { chinesePairBlurbs, cnKey, type ChineseAnimal as ChineseAnimalPair } from "@/lib/chinesePairBlurbs"
import { getChinesePattern, buildChineseLine, buildChineseHeadingLine, buildChinesePatternSentence, patternDefinitions, type ChinesePatternType, getAnimalMeta } from "@/lib/chinesePatternSystem"
import { westernPairBlurbs, westKey, type WestSign as WestSignPair } from "@/lib/westernPairBlurbs"
// Removed old connection box imports - now using centralized data sources in ConnectionBoxSimple
import { getChineseConnectionBlurb } from "@/lib/compat/chineseConnectionBlurbs"
import { getConnectionBoxWestEntry } from "@/data/connectionBoxWest"
import type { ChineseAnimal } from "@/lib/chineseZodiac"
import MatchProfileCard from "@/components/MatchProfileCard"
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple"
import { ConnectionBox } from "@/components/ConnectionBox"
import { type MatchContext, type MatchLabel as NewMatchLabel } from "@/data/matchLabels"
import type { WestSign } from "@/lib/westernZodiac"
import { getBothSunSignsFromBirthdate, getSavedSunSigns } from "@/lib/sunSignCalculator"
import { useSunSignSystem } from "@/lib/hooks/useSunSign"
import { evaluateMatch } from "@/engine/astromatch-engine"
import { createClient } from "@/lib/supabase/client"
import { recordLike } from "@/lib/match/recordLike"
import { buildConnectionBox, buildConnectionBoxTop, buildMatchContext } from "@/lib/compat/engine"
import type { UserProfile, SimpleConnectionBox, ConnectionBoxTop } from "@/lib/compat/types"
import { getChineseZodiacFromDate, type ChineseElement } from "@/lib/chineseZodiac"
import { TIER_LABEL, type Tier } from "@/engine/labels"
import type { RankKey } from "@/data/rankTheme"
import { getSunMatchBlurb, type WesternSign } from "@/lib/connectionSunVibes"

const FourPointedStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
)

const Heart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const MessageCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const Settings = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

// Test profiles with varied zodiac signs to show ALL match engine rankings
// These profiles work with the NEW 70/30 East/West match engine (computeMatch)
// User profile: Leo-Rabbit (default, loaded from localStorage if available)
// Each profile has westernSign and easternSign which are converted to UserProfile format
// NEW RULES (70/30 system with computeMatch):
// - Score ranges: 95-100 Soulmate Match, 85-94 Twin Flame Match, 75-84 Excellent Match, 60-74 Favourable Match, 50-59 Neutral Match, 35-49 Magnetic Opposites, 0-34 Difficult Match
// - Same West sign CANNOT be Soulmate/Twin Flame/Excellent (max is Favourable 60-74 or Neutral 50-59)
// - San He + strong West (same_element/compatible_element, NOT same_sign) = Soulmate (95+) or Twin Flame (88-94)
// - San He + semi/opposing West = Excellent (75+)
// - Liu He + strong West = Excellent (75+)
// - Liu He + semi/opposing = Favourable (60+)
// - Same animal/same trine + strong West = Excellent (75+)
// - Same animal/same trine + semi/opposing = Favourable (60+)
// - Liu Chong = Magnetic Opposites (35-49)
// - Neutral East pattern = Neutral Match (50-59)
// Profiles are enriched with tropical/sidereal signs calculated from birthdate
// Test profiles cover diverse match scenarios across the full Chinese zodiac cycle
// 24 profiles: 2 for each year from 1972-1983 (complete 12-year cycle), shuffled randomly
const TEST_PROFILES = [
  // 1972 - Rat (Water)
  {
    id: 1,
    name: "Luna",
    age: 52,
    birthdate: "1972-03-15",
    westernSign: "Pisces",
    easternSign: "Rat",
    photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"],
    aboutMe: "Artist and gallery curator. Love exploring new exhibitions and deep conversations over wine.",
    aboutMeText: "Artist and gallery curator. Love exploring new exhibitions and deep conversations over wine.",
    occupation: "Gallery Curator",
    city: "Sydney, NSW",
    height: "5'7\"",
    children: "Have, grown",
    religion: "Spiritual",
    prompts: [
      { question: "My simple pleasures", answer: "Sunday morning markets and spontaneous road trips." },
      { question: "I'm looking for", answer: "Someone who appreciates art, nature, and authentic connection." }
    ],
    distance: 5,
  },
  {
    id: 2,
    name: "Stella",
    age: 52,
    birthdate: "1972-11-20",
    westernSign: "Scorpio",
    easternSign: "Rat",
    photos: ["https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&q=80", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80"],
    aboutMe: "University professor teaching philosophy. Love debating life's big questions.",
    aboutMeText: "University professor teaching philosophy. Love debating life's big questions.",
    occupation: "Professor",
    city: "Melbourne, VIC",
    height: "5'6\"",
    children: "Have, grown",
    religion: "Atheist",
    prompts: [
      { question: "Favorite philosopher", answer: "Simone de Beauvoir for her fearless honesty." },
      { question: "Looking for", answer: "Someone who challenges my thinking." }
    ],
    distance: 8,
  },
  // 1973 - Ox (Water)
  {
    id: 3,
    name: "Sophia",
    age: 51,
    birthdate: "1973-02-03",
    westernSign: "Aquarius",
    easternSign: "Ox",
    photos: ["https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=800&q=80", "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=800&q=80"],
    aboutMe: "Sculptor working with reclaimed materials. Art from waste.",
    aboutMeText: "Sculptor working with reclaimed materials. Art from waste.",
    occupation: "Sculptor",
    city: "Fremantle, WA",
    height: "5'7\"",
    children: "Don't have",
    religion: "Spiritual",
    prompts: [
      { question: "Latest piece", answer: "A life-size whale made entirely from ocean plastic." },
      { question: "Dream", answer: "A solo exhibition at the MCA." }
    ],
    distance: 11,
  },
  {
    id: 4,
    name: "Ivy",
    age: 51,
    birthdate: "1973-10-15",
    westernSign: "Libra",
    easternSign: "Ox",
    photos: ["https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80", "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=800&q=80"],
    aboutMe: "Architect designing sustainable buildings. Beauty and function can coexist.",
    aboutMeText: "Architect designing sustainable buildings. Beauty and function can coexist.",
    occupation: "Architect",
    city: "Brisbane, QLD",
    height: "5'8\"",
    children: "Have, grown",
    religion: "Spiritual",
    prompts: [
      { question: "Best project", answer: "A carbon-neutral school that won an international award." },
      { question: "Dream", answer: "Designing zero-waste homes for everyone." }
    ],
    distance: 14,
  },
  // 1974 - Tiger (Wood)
  {
    id: 5,
    name: "Zara",
    age: 50,
    birthdate: "1974-01-22",
    westernSign: "Aquarius",
    easternSign: "Tiger",
    photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80"],
    aboutMe: "Documentary filmmaker capturing untold stories. Currently working on a climate change series.",
    aboutMeText: "Documentary filmmaker capturing untold stories. Currently working on a climate change series.",
    occupation: "Filmmaker",
    city: "Sydney, NSW",
    height: "5'9\"",
    children: "Don't have",
    religion: "Agnostic",
    prompts: [
      { question: "Most impactful story", answer: "Following indigenous fire management practices in Australia." },
      { question: "Need", answer: "A partner who's as curious about the world as I am." }
    ],
    distance: 6,
  },
  {
    id: 6,
    name: "Freya",
    age: 50,
    birthdate: "1974-05-30",
    westernSign: "Gemini",
    easternSign: "Tiger",
    photos: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"],
    aboutMe: "Pilot flying commercial jets. Love the freedom of the skies.",
    aboutMeText: "Pilot flying commercial jets. Love the freedom of the skies.",
    occupation: "Pilot",
    city: "Sydney, NSW",
    height: "5'10\"",
    children: "Don't have",
    religion: "Agnostic",
    prompts: [
      { question: "Favorite route", answer: "Sydney to Queenstown - the views are unbeatable." },
      { question: "Looking for", answer: "Someone adventurous who doesn't mind long-distance." }
    ],
    distance: 3,
  },
  // 1975 - Rabbit (Wood)
  {
    id: 7,
    name: "Emma",
    age: 49,
    birthdate: "1975-04-12",
    westernSign: "Aries",
    easternSign: "Rabbit",
    photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"],
    aboutMe: "Fashion designer with my own sustainable clothing line. Style with substance.",
    aboutMeText: "Fashion designer with my own sustainable clothing line. Style with substance.",
    occupation: "Fashion Designer",
    city: "Melbourne, VIC",
    height: "5'7\"",
    children: "Have, teenagers",
    religion: "Spiritual",
    prompts: [
      { question: "Design inspiration", answer: "Nature's patterns and indigenous Australian textiles." },
      { question: "Looking for", answer: "Someone creative and conscious." }
    ],
    distance: 7,
  },
  {
    id: 8,
    name: "Delilah",
    age: 49,
    birthdate: "1975-12-05",
    westernSign: "Sagittarius",
    easternSign: "Rabbit",
    photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&q=80"],
    aboutMe: "Travel writer who's visited 75 countries. Always planning the next adventure.",
    aboutMeText: "Travel writer who's visited 75 countries. Always planning the next adventure.",
    occupation: "Travel Writer",
    city: "Brisbane, QLD",
    height: "5'5\"",
    children: "Don't have",
    religion: "Spiritual",
    prompts: [
      { question: "Best trip", answer: "Three months backpacking through Southeast Asia." },
      { question: "Dream date", answer: "Getting lost in a new city with no map." }
    ],
    distance: 15,
  },
  // 1976 - Dragon (Fire)
  {
    id: 9,
    name: "Charlotte",
    age: 48,
    birthdate: "1976-02-10",
    westernSign: "Aquarius",
    easternSign: "Dragon",
    photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80"],
    aboutMe: "Tech entrepreneur who sold her startup. Now investing in women-led businesses.",
    aboutMeText: "Tech entrepreneur who sold her startup. Now investing in women-led businesses.",
    occupation: "Investor",
    city: "Sydney, NSW",
    height: "5'9\"",
    children: "Have, teenagers",
    religion: "Agnostic",
    prompts: [
      { question: "My superpower", answer: "Turning ideas into reality." },
      { question: "Looking for", answer: "Someone ambitious who also knows how to switch off." }
    ],
    distance: 3,
  },
  {
    id: 10,
    name: "Chloe",
    age: 48,
    birthdate: "1976-08-28",
    westernSign: "Virgo",
    easternSign: "Dragon",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80"],
    aboutMe: "Surgeon saving lives in the ER. Adrenaline junkie who also loves quiet moments.",
    aboutMeText: "Surgeon saving lives in the ER. Adrenaline junkie who also loves quiet moments.",
    occupation: "Surgeon",
    city: "Sydney, NSW",
    height: "5'10\"",
    children: "Have, young",
    religion: "Spiritual",
    prompts: [
      { question: "Most rewarding moment", answer: "Every time I hear 'Thank you for saving my life.'" },
      { question: "Off duty", answer: "You'll find me hiking or lost in a good book." }
    ],
    distance: 4,
  },
  // 1977 - Snake (Fire)
  {
    id: 11,
    name: "Isabella",
    age: 47,
    birthdate: "1977-03-08",
    westernSign: "Pisces",
    easternSign: "Snake",
    photos: ["https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80", "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=800&q=80"],
    aboutMe: "Meditation teacher and author. Wrote a bestselling book on mindfulness.",
    aboutMeText: "Meditation teacher and author. Wrote a bestselling book on mindfulness.",
    occupation: "Meditation Teacher",
    city: "Byron Bay, NSW",
    height: "5'5\"",
    children: "Don't have",
    religion: "Buddhist",
    prompts: [
      { question: "Daily practice", answer: "Two hours of meditation, followed by writing." },
      { question: "Looking for", answer: "A calm presence who values inner peace." }
    ],
    distance: 12,
  },
  {
    id: 12,
    name: "Scarlett",
    age: 47,
    birthdate: "1977-11-05",
    westernSign: "Scorpio",
    easternSign: "Snake",
    photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80"],
    aboutMe: "Psychologist specializing in couples therapy. Believer in emotional intelligence.",
    aboutMeText: "Psychologist specializing in couples therapy. Believer in emotional intelligence.",
    occupation: "Psychologist",
    city: "Adelaide, SA",
    height: "5'6\"",
    children: "Have, grown",
    religion: "Jewish",
    prompts: [
      { question: "Best advice I give", answer: "Listen to understand, not to respond." },
      { question: "I value", answer: "Authenticity, curiosity, and emotional depth." }
    ],
    distance: 7,
  },
  // 1978 - Horse (Earth)
  {
    id: 13,
    name: "Violet",
    age: 46,
    birthdate: "1978-02-18",
    westernSign: "Aquarius",
    easternSign: "Horse",
    photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&q=80"],
    aboutMe: "Wildlife photographer capturing the beauty of the Australian outback.",
    aboutMeText: "Wildlife photographer capturing the beauty of the Australian outback.",
    occupation: "Photographer",
    city: "Alice Springs, NT",
    height: "5'8\"",
    children: "Don't have, open",
    religion: "Spiritual",
    prompts: [
      { question: "Best photo", answer: "A kangaroo joey emerging from its mother's pouch at dawn." },
      { question: "Dream", answer: "Publishing a book celebrating Australian wildlife." }
    ],
    distance: 20,
  },
  {
    id: 14,
    name: "Mia",
    age: 46,
    birthdate: "1978-08-25",
    westernSign: "Virgo",
    easternSign: "Horse",
    photos: ["https://images.unsplash.com/photo-1529911194209-c1b1b0c1e2c1?w=800&q=80", "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800&q=80"],
    aboutMe: "Marathon runner and fitness coach. Pushing limits and helping others do the same.",
    aboutMeText: "Marathon runner and fitness coach. Pushing limits and helping others do the same.",
    occupation: "Fitness Coach",
    city: "Perth, WA",
    height: "5'10\"",
    children: "Don't have, undecided",
    religion: "Spiritual",
    prompts: [
      { question: "Current goal", answer: "Qualifying for the Boston Marathon." },
      { question: "Perfect weekend", answer: "Long run, brunch, and a Netflix marathon." }
    ],
    distance: 10,
  },
  // 1979 - Goat (Earth)
  {
    id: 15,
    name: "Hazel",
    age: 45,
    birthdate: "1979-05-23",
    westernSign: "Gemini",
    easternSign: "Goat",
    photos: ["https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80", "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&q=80"],
    aboutMe: "Musician and music teacher. Piano is my first love, but I play six instruments.",
    aboutMeText: "Musician and music teacher. Piano is my first love, but I play six instruments.",
    occupation: "Music Teacher",
    city: "Adelaide, SA",
    height: "5'5\"",
    children: "Have, teenagers",
    religion: "Christian",
    prompts: [
      { question: "Favorite composer", answer: "Debussy for his emotional depth." },
      { question: "Perfect evening", answer: "Live jazz, good company, and red wine." }
    ],
    distance: 8,
  },
  {
    id: 16,
    name: "Olivia",
    age: 45,
    birthdate: "1979-11-30",
    westernSign: "Sagittarius",
    easternSign: "Goat",
    photos: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80"],
    aboutMe: "Interior designer creating spaces that tell stories. Obsessed with mid-century modern.",
    aboutMeText: "Interior designer creating spaces that tell stories. Obsessed with mid-century modern.",
    occupation: "Interior Designer",
    city: "Melbourne, VIC",
    height: "5'7\"",
    children: "Have, young",
    religion: "Christian",
    prompts: [
      { question: "Design philosophy", answer: "Form follows function, but beauty matters too." },
      { question: "Dream project", answer: "Designing a sustainable eco-village." }
    ],
    distance: 6,
  },
  // 1980 - Monkey (Metal)
  {
    id: 17,
    name: "Ava",
    age: 44,
    birthdate: "1980-02-17",
    westernSign: "Aquarius",
    easternSign: "Monkey",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"],
    aboutMe: "Stand-up comedian finding humor in everyday life. Laughter is my love language.",
    aboutMeText: "Stand-up comedian finding humor in everyday life. Laughter is my love language.",
    occupation: "Comedian",
    city: "Sydney, NSW",
    height: "5'5\"",
    children: "Don't have",
    religion: "Agnostic",
    prompts: [
      { question: "Funniest moment", answer: "When my mic failed mid-joke and I had to yell my punchline." },
      { question: "Looking for", answer: "Someone who laughs at life and doesn't take themselves too seriously." }
    ],
    distance: 4,
  },
  {
    id: 18,
    name: "Willow",
    age: 44,
    birthdate: "1980-09-05",
    westernSign: "Virgo",
    easternSign: "Monkey",
    photos: ["https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80", "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=800&q=80"],
    aboutMe: "Data scientist using numbers to solve social problems. Math nerd with a heart.",
    aboutMeText: "Data scientist using numbers to solve social problems. Math nerd with a heart.",
    occupation: "Data Scientist",
    city: "Canberra, ACT",
    height: "5'7\"",
    children: "Don't have",
    religion: "Atheist",
    prompts: [
      { question: "Current project", answer: "Predicting homelessness patterns to improve intervention." },
      { question: "Looking for", answer: "Someone who gets excited about spreadsheets AND sunsets." }
    ],
    distance: 9,
  },
  // 1981 - Rooster (Metal)
  {
    id: 19,
    name: "Harper",
    age: 43,
    birthdate: "1981-04-18",
    westernSign: "Aries",
    easternSign: "Rooster",
    photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&q=80"],
    aboutMe: "Orchestra conductor leading a community ensemble. Music is my passion.",
    aboutMeText: "Orchestra conductor leading a community ensemble. Music is my passion.",
    occupation: "Orchestra Conductor",
    city: "Canberra, ACT",
    height: "5'9\"",
    children: "Have, grown",
    religion: "Spiritual",
    prompts: [
      { question: "Favorite symphony", answer: "Mahler's 5th - it moves me to tears every time." },
      { question: "Looking for", answer: "Someone who appreciates the arts and deep emotion." }
    ],
    distance: 9,
  },
  {
    id: 20,
    name: "Aurora",
    age: 43,
    birthdate: "1981-12-10",
    westernSign: "Sagittarius",
    easternSign: "Rooster",
    photos: ["https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=800&q=80", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80"],
    aboutMe: "Environmental lawyer fighting for climate justice. Passionate about protecting our planet.",
    aboutMeText: "Environmental lawyer fighting for climate justice. Passionate about protecting our planet.",
    occupation: "Environmental Lawyer",
    city: "Canberra, ACT",
    height: "5'8\"",
    children: "Have, teenagers",
    religion: "Spiritual",
    prompts: [
      { question: "My mission", answer: "Making corporations accountable for climate change." },
      { question: "Ideal partner", answer: "Someone who cares about making a difference." }
    ],
    distance: 9,
  },
  // 1982 - Dog (Water)
  {
    id: 21,
    name: "Amelia",
    age: 42,
    birthdate: "1982-03-28",
    westernSign: "Aries",
    easternSign: "Dog",
    photos: ["https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=800&q=80", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"],
    aboutMe: "Social worker helping families in crisis. Empath with strong boundaries.",
    aboutMeText: "Social worker helping families in crisis. Empath with strong boundaries.",
    occupation: "Social Worker",
    city: "Sydney, NSW",
    height: "5'8\"",
    children: "Don't have, undecided",
    religion: "Christian",
    prompts: [
      { question: "What keeps me going", answer: "Seeing families reunite and heal." },
      { question: "Need in a partner", answer: "Emotional maturity and compassion." }
    ],
    distance: 5,
  },
  {
    id: 22,
    name: "Penelope",
    age: 42,
    birthdate: "1982-09-12",
    westernSign: "Virgo",
    easternSign: "Dog",
    photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80"],
    aboutMe: "Veterinarian with a soft spot for rescue animals. My home is a zoo (literally 3 dogs, 2 cats).",
    aboutMeText: "Veterinarian with a soft spot for rescue animals. My home is a zoo (literally 3 dogs, 2 cats).",
    occupation: "Veterinarian",
    city: "Hobart, TAS",
    height: "5'6\"",
    children: "Don't have, open",
    religion: "Spiritual",
    prompts: [
      { question: "Best part of my job", answer: "Seeing a sick animal bounce back to health." },
      { question: "Must love", answer: "Animals. Non-negotiable." }
    ],
    distance: 11,
  },
  // 1983 - Pig (Water)
  {
    id: 23,
    name: "Grace",
    age: 41,
    birthdate: "1983-06-14",
    westernSign: "Gemini",
    easternSign: "Pig",
    photos: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"],
    aboutMe: "Journalist covering political affairs. Speaking truth to power.",
    aboutMeText: "Journalist covering political affairs. Speaking truth to power.",
    occupation: "Journalist",
    city: "Canberra, ACT",
    height: "5'9\"",
    children: "Have, young",
    religion: "Agnostic",
    prompts: [
      { question: "Proudest story", answer: "Exposing corruption that led to policy reform." },
      { question: "Looking for", answer: "Someone who values honesty and critical thinking." }
    ],
    distance: 9,
  },
  {
    id: 24,
    name: "Eloise",
    age: 41,
    birthdate: "1983-12-20",
    westernSign: "Sagittarius",
    easternSign: "Pig",
    photos: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"],
    aboutMe: "Sommelier with a wine bar in the city. Life's too short for bad wine.",
    aboutMeText: "Sommelier with a wine bar in the city. Life's too short for bad wine.",
    occupation: "Sommelier",
    city: "Sydney, NSW",
    height: "5'7\"",
    children: "Don't have",
    religion: "Agnostic",
    prompts: [
      { question: "Favorite wine", answer: "A good Barossa Shiraz on a cold night." },
      { question: "Perfect date", answer: "Wine tasting in the Hunter Valley followed by a sunset picnic." }
    ],
    distance: 5,
  },
]

// Shuffle the profiles randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Apply shuffle once when the module loads
const SHUFFLED_PROFILES = shuffleArray(TEST_PROFILES);


export default function MatchesPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const sunSignSystem = useSunSignSystem()
  const enrichedProfiles = useMemo(() => {
    return SHUFFLED_PROFILES.map((profile) => {
      const { tropical, sidereal } = getBothSunSignsFromBirthdate(profile.birthdate)
      return {
        ...profile,
        tropicalWesternSign: tropical ?? profile.westernSign,
        siderealWesternSign: sidereal ?? profile.westernSign,
      }
    })
  }, [])
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [compatBoxes, setCompatBoxes] = useState<{[key: number]: ConnectionBoxData}>({})
  const [profilesLoading, setProfilesLoading] = useState(false) // Changed to false for immediate load
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    westernSign: '',
    easternSign: ''
  })
  const [chinesePatternFilters, setChinesePatternFilters] = useState({
    SanHe: false,
    LiuHe: false
  })
  const [friendFinderEnabled, setFriendFinderEnabled] = useState(false)
  const [allowInstantMessages, setAllowInstantMessages] = useState(true) // Default ON
  const [filteredProfiles, setFilteredProfiles] = useState(enrichedProfiles)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })
  
  // Detect touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouchDevice()
    window.addEventListener('resize', checkTouchDevice)
    return () => window.removeEventListener('resize', checkTouchDevice)
  }, [])
  
  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  
  // Mouse drag state for desktop
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [mouseStartY, setMouseStartY] = useState<number | null>(null)
  const [mouseEnd, setMouseEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Button swipe state
  const [buttonTouchStart, setButtonTouchStart] = useState<{ x: number, y: number } | null>(null)
  
  // Touch position for swipe indicator
  const [touchY, setTouchY] = useState<number>(0)
  
  // Window width for Bumble-style flash animations
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 375)
  
  // Flash animation state
  const [showLikeFlash, setShowLikeFlash] = useState(false)
  const [showPassFlash, setShowPassFlash] = useState(false)
  
  // Button flash state
  const [likeButtonFlash, setLikeButtonFlash] = useState(false)
  const [passButtonFlash, setPassButtonFlash] = useState(false)
  const [backButtonFlash, setBackButtonFlash] = useState(false)
  const [messageButtonFlash, setMessageButtonFlash] = useState(false)
  
  // Active button state for Tinder-style animations
  const [activeButton, setActiveButton] = useState<'like' | 'pass' | null>(null)
  
  // Match system state
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<typeof currentProfile | null>(null)
  const [matchConversationId, setMatchConversationId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'match' } | null>(null)
  
  // Minimum swipe distance (in px) to trigger an action
  const minSwipeDistance = 100
  
  // User's zodiac signs for matching
  const [userZodiacSigns, setUserZodiacSigns] = useState<{western: string, chinese: string}>({
    western: 'Leo',
    chinese: 'Rabbit'
  })

  // Track window width for Bumble-style animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }
    
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
    
    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])
  
  // Get current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      console.log('[Matches] Current user ID:', user?.id)
    }
    fetchUser()
  }, [])

  // Load user's zodiac signs from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadUserSigns = () => {
      try {
        const userWesternSign = localStorage.getItem("userSunSign")
        const userChineseSign = localStorage.getItem("userChineseSign")

        if (userWesternSign && userChineseSign) {
          setUserZodiacSigns({
            western: capitalizeSign(userWesternSign),
            chinese: capitalizeSign(userChineseSign)
          })
          console.log("[Matches] User signs loaded:", { western: userWesternSign, chinese: userChineseSign })
        } else {
          console.log("[Matches] Using default signs: Leo-Rabbit")
        }
      } catch (error) {
        console.error("[Matches] Error loading zodiac signs:", error)
      }
    }

    loadUserSigns()
    const handleSystemChange = () => loadUserSigns()
    window.addEventListener('sunSignSystemChanged', handleSystemChange)
    return () => window.removeEventListener('sunSignSystemChanged', handleSystemChange)
  }, [])

  // Filter profiles based on search criteria
  useEffect(() => {
    let filtered = [...enrichedProfiles]
    
    const getProfileWesternForSystem = (profile: typeof enrichedProfiles[number]) => {
      const tropical = profile.tropicalWesternSign || profile.westernSign
      const sidereal = profile.siderealWesternSign || profile.westernSign
      return sunSignSystem === "sidereal" ? sidereal : tropical
    }
    
    // Apply zodiac filters
    if (searchFilters.westernSign) {
      filtered = filtered.filter((p) => getProfileWesternForSystem(p) === searchFilters.westernSign)
    }
    if (searchFilters.easternSign) {
      filtered = filtered.filter(p => p.easternSign === searchFilters.easternSign)
    }
    
    // Apply Chinese pattern filters
    const hasActivePatternFilters = chinesePatternFilters.SanHe || chinesePatternFilters.LiuHe
    if (hasActivePatternFilters && Object.keys(compatBoxes).length > 0) {
      filtered = filtered.filter(profile => {
        const compatBox = compatBoxes[profile.id]
        if (!compatBox) return false
        
        const pattern = compatBox.pattern?.toUpperCase() || ''
        
        if (chinesePatternFilters.SanHe && (pattern.includes('SAN_HE') || pattern.includes('SAME_TRINE'))) return true
        if (chinesePatternFilters.LiuHe && pattern.includes('LIU_HE')) return true
        
        return false
      })
    }
    
    // Apply Friend Finder filter
    // Note: When gender/orientation fields are added to profiles, this will filter to show:
    // - For male users: Male profiles with orientation:Woman (heterosexual men seeking friends)
    // - For female users: Female profiles with orientation:Men (heterosexual women seeking friends)
    // This allows same-sex heterosexual friendships based on astrological compatibility
    if (friendFinderEnabled) {
      // TODO: Implement once profile gender/orientation fields are added
      // Example logic (commented out until fields exist):
      /*
      const userGender = getUserGender(); // Get from user profile
      const userOrientation = getUserOrientation(); // Get from user profile
      
      filtered = filtered.filter(profile => {
        // Show same-sex heterosexual profiles
        if (userGender === 'male' && userOrientation === 'woman') {
          return profile.gender === 'male' && profile.orientation === 'woman';
        } else if (userGender === 'woman' && userOrientation === 'men') {
          return profile.gender === 'woman' && profile.orientation === 'men';
        }
        return false;
      });
      */
    }
    
    setFilteredProfiles(filtered)
    setCurrentProfileIndex(0) // Reset to first profile when filters change
  }, [searchFilters, chinesePatternFilters, compatBoxes, enrichedProfiles, sunSignSystem, friendFinderEnabled])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSettingsDropdown && !(event.target as Element).closest('.settings-dropdown-container')) {
        setShowSettingsDropdown(false)
      }
    }

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSettingsDropdown])

  // Helper function to convert SimpleConnectionBox to ConnectionBoxData
  const convertSimpleToConnectionBoxData = (
    simpleBox: SimpleConnectionBox,
    userWest: string,
    userEast: string,
    profileWest: string,
    profileEast: string,
    profile: any,
    userYearElement?: any, // WuXing type
    profileYearElement?: any // WuXing type
  ): ConnectionBoxData => {
    // Map match label to rank key (updated - Good Friends removed, now maps to Neutral Match)
    const labelToRankKey: Record<string, RankKey> = {
      "Soulmate Match": "perfect",
      "Twin Flame Match": "excellent",
      "Excellent Match": "excellent",
      "Favourable Match": "good",
      "Good Friends": "good", // Now maps to good
      "Good Friends Match": "good", // Now maps to good
      "Opposites Attract": "fair",
      "Magnetic Opposites": "fair",
      "Neutral Match": "fair",
      "Difficult Match": "challenging",
    };
    
    const rankKey = labelToRankKey[simpleBox.matchLabel] || "neutral";
    
    // Map label to tier (updated to support new match engine labels)
    const labelToTier = (label: string): Tier => {
      // New match engine labels (from matchLabels.ts)
      if (label === "SOULMATE" || label === "SOULMATE MATCH" || label === "Soulmate Match") return "Soulmate";
      if (label === "TWIN FLAME" || label === "TWIN FLAME MATCH" || label === "Twin Flame Match") return "Twin Flame";
      if (label === "HARMONIOUS" || label === "HARMONIOUS MATCH" || label === "Excellent Match") return "Excellent";
      if (label === "Favourable Match") return "Favourable";
      if (label === "Good Friends" || label === "Good Friends Match") return "Favourable"; // Maps to Favourable
      if (label === "OPPOSITES_ATTRACT" || label === "OPPOSITES ATTRACT" || label === "Opposites Attract" || label === "Magnetic Opposites") return "Magnetic Opposites";
      if (label === "NEUTRAL" || label === "NEUTRAL MATCH" || label === "Neutral Match") return "Neutral";
      if (label === "DIFFICULT" || label === "DIFFICULT MATCH" || label === "Difficult Match") return "Difficult";
      return "Neutral";
    };
    
    // Extract emoji and color from label (updated to support new match engine)
    const labelToEmoji: Record<string, string> = {
      "SOULMATE": "💫",
      "SOULMATE MATCH": "💫",
      "Soulmate Match": "💫",
      "TWIN FLAME": "🔥",
      "TWIN FLAME MATCH": "🔥",
      "Twin Flame Match": "🔥",
      "HARMONIOUS": "✨",
      "HARMONIOUS MATCH": "✨",
      "Excellent Match": "✨",
      "Favourable Match": "✨",
      "Good Friends": "✨",
      "Good Friends Match": "✨",
      "OPPOSITES_ATTRACT": "⚡",
      "OPPOSITES ATTRACT": "⚡",
      "Opposites Attract": "⚡",
      "Magnetic Opposites": "⚡",
      "NEUTRAL": "✨",
      "NEUTRAL MATCH": "✨",
      "Neutral Match": "✨",
      "DIFFICULT": "💔",
      "DIFFICULT MATCH": "💔",
      "Difficult Match": "💔",
    };
    
    const labelToColor: Record<string, string> = {
      "SOULMATE": "rgb(212, 175, 55)",                // Gold
      "SOULMATE MATCH": "rgb(212, 175, 55)",          // Gold
      "Soulmate Match": "rgb(212, 175, 55)",          // Gold
      "TWIN FLAME": "rgb(255, 140, 0)",               // Astromatch Orange
      "TWIN FLAME MATCH": "rgb(255, 140, 0)",         // Astromatch Orange
      "Twin Flame Match": "rgb(255, 140, 0)",         // Astromatch Orange
      "HARMONIOUS": "rgb(219, 39, 119)",              // Hot Pink
      "HARMONIOUS MATCH": "rgb(219, 39, 119)",        // Hot Pink
      "Excellent Match": "rgb(219, 39, 119)",         // Hot Pink
      "Favourable Match": "rgb(219, 39, 119)",        // Hot Pink (same as Excellent)
      "Good Friends": "rgb(34, 139, 34)",             // Green
      "Good Friends Match": "rgb(34, 139, 34)",       // Green
      "OPPOSITES_ATTRACT": "rgb(239, 68, 68)",        // Red
      "OPPOSITES ATTRACT": "rgb(239, 68, 68)",        // Red
      "Opposites Attract": "rgb(239, 68, 68)",        // Red
      "Magnetic Opposites": "rgb(239, 68, 68)",       // Red (same as Opposites Attract)
      "NEUTRAL": "rgb(34, 139, 34)",                  // Green
      "NEUTRAL MATCH": "rgb(34, 139, 34)",            // Green
      "Neutral Match": "rgb(34, 139, 34)",            // Green
      "DIFFICULT": "rgb(239, 68, 68)",                // Red
      "DIFFICULT MATCH": "rgb(239, 68, 68)",          // Red
      "Difficult Match": "rgb(239, 68, 68)",          // Red
    };
    
    const tier = labelToTier(simpleBox.matchLabel);
    
    // Parse Chinese and Western lines to extract relations (for backward compatibility)
    // Note: New format is "Monkey × Rat — San He (三合) "Three Harmonies" (Same Trine: Visionaries 三会)"
    const parseChineseRelation = (line: string): string => {
      if (line.includes("Neutral Pattern")) return "Neutral alignment";
      if (line.includes("San He") || line.includes("三合")) return "San He (Triple Harmony)";
      if (line.includes("Liu He") || line.includes("六合")) return "Liu He (Secret Friends)";
      if (line.includes("Liu Chong") || line.includes("六冲")) return "Six Conflicts";
      if (line.includes("Liu Hai") || line.includes("六害")) return "Six Harms";
      if (line.includes("Xing") || line.includes("刑")) return "Punishment";
      if (line.includes("Po") || line.includes("破")) return "Break";
      if (line.includes("Same Animal")) return "Same Animal";
      if (line.includes("Same Trine") || line.includes("三会")) return "Same Trine";
      return "Neutral alignment";
    };
    
    const parseWesternRelation = (line: string): string => {
      if (line.includes("Same Element")) return "Same Element";
      if (line.includes("Compatible")) return "Compatible Elements";
      if (line.includes("Semi-Compatible")) return "Semi-Compatible";
      if (line.includes("Opposing")) return "Opposing Elements";
      return "Mixed Elements";
    };
    
    // Generate Western sun sign relationship blurb
    const westernSignLine = getSunMatchBlurb(
      userWest as WesternSign,
      profileWest as WesternSign
    );
    
    return {
      score: simpleBox.score,
      rank: simpleBox.matchLabel,
      rankLabel: simpleBox.matchLabel,
      rankKey: rankKey,
      emoji: labelToEmoji[simpleBox.matchLabel] || "🌟",
      colorRgb: labelToColor[simpleBox.matchLabel] || "rgb(34, 139, 34)",
      connectionLabel: simpleBox.headingLine, // "Harmonious Match · 76%"
      tagline: simpleBox.matchLabel,
      east_tagline: simpleBox.chineseLine,
      tags: [],
      // NEW: Map overview from SimpleConnectionBox to both insight and longformBody
      insight: simpleBox.overview || 'Compatibility information is being calculated.',
      longformBody: simpleBox.overview || 'Compatibility information is being calculated.',
      // Use the full formatted lines from the new engine for display
      east_relation: simpleBox.chineseLine, // Full line: "Monkey × Rat — San He (三合) "Three Harmonies" (Same Trine: Visionaries 三会)"
      east_summary: simpleBox.chineseLine,
      east_description: simpleBox.chineseDescription || '', // Pattern-specific description
      west_relation: simpleBox.westernLine, // Full line: "Aquarius × Pisces — Air–Water (semi-compatible)"
      west_summary: simpleBox.westernLine,
      west_description: simpleBox.westernDescription || '', // Western element meaning description
      westernSignLine: westernSignLine, // NEW: Western sun sign relationship blurb
      wuXingLine: simpleBox.wuXingLine, // Wu Xing (Five Elements) harmony line
      a: {
        west: userWest,
        east: userEast,
        westGlyph: getWesternSignGlyph(userWest),
        eastGlyph: getChineseSignGlyph(userEast),
        chineseElement: userYearElement // Wu Xing year element
      },
      b: {
        west: profileWest,
        east: profileEast,
        westGlyph: getWesternSignGlyph(profileWest),
        eastGlyph: getChineseSignGlyph(profileEast),
        chineseElement: profileYearElement // Wu Xing year element
      },
      tier: tier,
      // Profile details for "Show profile" toggle
      aboutMeText: profile.aboutMe || profile.aboutMeText,
      age: profile.age,
      occupation: profile.occupation,
      city: profile.city,
      distance: profile.distance,
      height: profile.height,
      children: profile.children,
      religion: profile.religion,
      selectedDeepPrompts: profile.prompts?.map((p: any) => p.question),
      deepPromptAnswers: profile.prompts?.reduce((acc: any, p: any) => {
        acc[p.question] = p.answer;
        return acc;
      }, {}),
      // Pattern fields for taglines
      chinesePattern: simpleBox.chinesePattern,
      westAspect: simpleBox.westAspect,
      westElementRelation: simpleBox.westElementRelation,
      isChineseOpposite: simpleBox.isChineseOpposite,
      isLivelyPair: simpleBox.isLivelyPair,
      wuXingA: userYearElement as WuXing, // Wu Xing element for User A
      wuXingB: profileYearElement as WuXing, // Wu Xing element for User B
      // NEW: Match engine result fields from simpleBox
      pillLabel: simpleBox.pillLabel,
      pattern: simpleBox.pattern,
      patternFullLabel: simpleBox.patternFullLabel,
      baseTagline: simpleBox.baseTagline,
      patternEmoji: simpleBox.patternEmoji,
      chemistryStars: simpleBox.chemistryStars,
      stabilityStars: simpleBox.stabilityStars,
    };
  };

  // Build compatibility boxes for all test profiles
  useEffect(() => {
    // Don't set loading state - let page render immediately
    
    try {
      if (!userZodiacSigns.western || !userZodiacSigns.chinese) {
        return
      }
      
      if (!enrichedProfiles || enrichedProfiles.length === 0) {
        return
      }
      
      console.log('[Match Engine] Building compatibility boxes for', enrichedProfiles.length, 'profiles')
      const boxes: {[key: number]: ConnectionBoxData} = {}
      
      // Get user profile for new engine
      const userProfile: UserProfile = {
        sunSign: userZodiacSigns.western.toLowerCase() as any,
        animal: userZodiacSigns.chinese.toLowerCase() as any,
      };
      
      // Get user's Wu Xing year element from birthdate
      let userYearElement: any; // WuXing type
      try {
        const userBirthInfo = localStorage.getItem("userBirthInfo");
        if (userBirthInfo) {
          const birthInfo = JSON.parse(userBirthInfo);
          if (birthInfo.birthdate) {
            const userBirthDate = new Date(birthInfo.birthdate);
            const userYear = userBirthDate.getFullYear();
            userYearElement = getWuXingYearElement(userYear);
            console.log('[🚀 Match Engine] User Wu Xing year element:', userYearElement, 'from year', userYear);
          }
        } else {
          // Fallback: Use a default year for the Chinese animal to calculate Wu Xing
          // This is for design mode / testing purposes
          const animalToDefaultYear: Record<string, number> = {
            'rat': 1996,      // Fire Rat
            'ox': 1997,       // Fire Ox
            'tiger': 1998,    // Earth Tiger
            'rabbit': 1999,   // Earth Rabbit
            'dragon': 2000,   // Metal Dragon
            'snake': 2001,    // Metal Snake
            'horse': 2002,    // Water Horse
            'goat': 2003,     // Water Goat
            'monkey': 2004,   // Wood Monkey
            'rooster': 2005,  // Wood Rooster
            'dog': 2006,      // Fire Dog
            'pig': 2007,      // Fire Pig
          };
          const userAnimal = userZodiacSigns.chinese.toLowerCase();
          const defaultYear = animalToDefaultYear[userAnimal] || 1987;
          userYearElement = getWuXingYearElement(defaultYear);
          console.log('[🚀 Match Engine] Using fallback Wu Xing element for user:', userYearElement, 'from default year', defaultYear, 'for', userAnimal);
        }
      } catch (error) {
        console.error('[🚀 Match Engine] Error calculating user Wu Xing year element:', error);
      }
      
      for (const profile of enrichedProfiles) {
        console.log(`[🚀 Match Engine] Processing profile ${profile.id}: ${profile.name}`)
        console.log(`[🚀 Match Engine] Profile birthdate:`, profile.birthdate)
        console.log(`[🚀 Match Engine] Profile signs:`, { western: profile.westernSign, eastern: profile.easternSign })
      try {
        // Get user's display signs based on sun sign system
        const savedSunSigns = getSavedSunSigns()
        const userDisplayWest = sunSignSystem === "sidereal"
          ? (savedSunSigns.sidereal ?? userZodiacSigns.western)
          : (savedSunSigns.tropical ?? userZodiacSigns.western)
        
        const userWest = capitalizeSign(userDisplayWest) as West
        const userEast = capitalizeSign(userZodiacSigns.chinese) as East
        const tropicalProfileWest = capitalizeSign(profile.tropicalWesternSign || profile.westernSign) as West
        const profileEast = capitalizeSign(profile.easternSign) as East
        
        // Calculate profile's Wu Xing year element from birthdate
        let profileYearElement: any; // WuXing type
        try {
          if (profile.birthdate) {
            const profileBirthDate = new Date(profile.birthdate);
            const profileYear = profileBirthDate.getFullYear();
            profileYearElement = getWuXingYearElement(profileYear);
            console.log(`[🚀 Match Engine] Profile ${profile.name} Wu Xing year element:`, profileYearElement, 'from year', profileYear);
          }
        } catch (error) {
          console.error(`[🚀 Match Engine] Error calculating profile Wu Xing year element for ${profile.name}:`, error);
        }
        
        // Use NEW simplified engine with latest updates
        const profileForNewEngine: UserProfile = {
          sunSign: (profile.tropicalWesternSign || profile.westernSign).toLowerCase() as any,
          animal: profile.easternSign.toLowerCase() as any,
        };
        
        // Use buildConnectionBox (latest version) which includes overview paragraph
        let simpleBox;
        try {
          simpleBox = buildConnectionBox(
            userProfile, 
            profileForNewEngine,
            userYearElement,      // Pass user Wu Xing year element
            profileYearElement    // Pass profile Wu Xing year element
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : error instanceof Event ? 'Event error' : String(error);
          const errorStack = error instanceof Error ? error.stack : '';
          console.error(`[✗] Error in buildConnectionBox for ${profile.name}:`, errorMessage, errorStack || error);
          // Skip this profile if there's an error
          continue;
        }
        
        if (!simpleBox) {
          console.error(`[✗] buildConnectionBox returned undefined for ${profile.name}`);
          continue;
        }
        
        const profileDisplayWest = sunSignSystem === "sidereal"
          ? (profile.siderealWesternSign || profile.westernSign)
          : (profile.tropicalWesternSign || profile.westernSign)
        const profileDisplayWestCapitalized = capitalizeSign(profileDisplayWest)
        
        // Convert to ConnectionBoxData format
        let boxData;
        try {
          boxData = convertSimpleToConnectionBoxData(
          simpleBox,
          userWest,
          userEast,
          profileDisplayWestCapitalized,
          profileEast,
          profile,
          userYearElement,  // Pass Wu Xing year element
          profileYearElement // Pass Wu Xing year element
        );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : error instanceof Event ? 'Event error' : String(error);
          const errorStack = error instanceof Error ? error.stack : '';
          console.error(`[✗] Error in convertSimpleToConnectionBoxData for ${profile.name}:`, errorMessage, errorStack || error);
          continue;
        }
        
        if (!boxData) {
          console.error(`[✗] convertSimpleToConnectionBoxData returned undefined for ${profile.name}`);
          continue;
        }
        
        boxes[profile.id] = boxData;
        
        console.log(`[✓ NEW ENGINE] ${profile.name} (ID: ${profile.id}) (${profileDisplayWestCapitalized}-${profile.easternSign}): ${simpleBox.score}% - ${simpleBox.matchLabel}`)
        console.log(`   ${simpleBox.headingLine}`)
        console.log(`   ${simpleBox.pairLine}`)
        console.log(`   ${simpleBox.chineseLine}`)
        console.log(`   ${simpleBox.westernLine}`)
        if (simpleBox.overview) {
          console.log(`   Overview: ${simpleBox.overview.substring(0, 100)}...`)
        }
        console.log(`[✓] Successfully built box for profile ${profile.id} (${profile.name})`)
        console.log(`[✓] Box data keys:`, Object.keys(boxData))
        
        // OLD ENGINE CODE - COMMENTED OUT (using new buildSimpleConnectionBox instead)
        /*
        const savedSunSigns = getSavedSunSigns()
        const userDisplayWest = sunSignSystem === "sidereal"
          ? (savedSunSigns.sidereal ?? userWest)
          : (savedSunSigns.tropical ?? userWest)
        const profileDisplayWest = sunSignSystem === "sidereal"
          ? (profile.siderealWesternSign || profile.westernSign)
          : (profile.tropicalWesternSign || profile.westernSign)
        const profileDisplayWestCapitalized = capitalizeSign(profileDisplayWest)
        
        // Calculate compatibility using NEW classifier (primary)
        const classifierResult = computeMatchWithClassifier(
          userWest,
          userEast,
          tropicalProfileWest,
          profileEast
        )
        
        // Also get result from old engines for fallback/legacy support
        const newEngineResult = computeMatchWithNewEngine(
          userWest,
          userEast,
          tropicalProfileWest,
          profileEast
        )
        
        const astroMatch = evaluateMatch(
          userWest,
          userEast,
          tropicalProfileWest,
          profileEast
        )
        
        const legacyResult = explainMatchAndScore(
          userWest,
          userEast,
          tropicalProfileWest,
          profileEast
        )
        
        // Use new classifier result as primary, with fallback to legacy for missing fields
        const result = {
          score: classifierResult.score,
          rankKey: classifierResult.rankKey,
          rankLabel: classifierResult.rankLabel,
          emoji: classifierResult.emoji,
          colorRgb: classifierResult.colorRgb,
          connectionLabel: classifierResult.connectionLabel,
          east_relation: classifierResult.east_relation,
          east_summary: classifierResult.east_summary,
          west_relation: classifierResult.west_relation,
          west_summary: classifierResult.west_summary,
          tagline: classifierResult.tagline,
          tags: classifierResult.tags || [],
          hasOverride: legacyResult.hasOverride,
          hasLongform: legacyResult.hasLongform,
          tier: classifierResult.tier,
        }
        
        // Create normalized pair ID
        const pairId = createPairId(userWest, userEast, tropicalProfileWest, profileEast)
        
        // Get tier key from score
        const tierKey = getTierKeyFromScore(result.score)
        
        // Try to get longform content
        const longformContent = getCompleteLongformBlurb(pairId, tierKey)
        
        // Get element pair for new blurb generator
        const WEST_ELEMENT: Record<string, string> = {
          aries: "Fire", leo: "Fire", sagittarius: "Fire",
          taurus: "Earth", virgo: "Earth", capricorn: "Earth",
          gemini: "Air", libra: "Air", aquarius: "Air",
          cancer: "Water", scorpio: "Water", pisces: "Water",
        };
        const elemA = WEST_ELEMENT[userWest.toLowerCase()] || "";
        const elemB = WEST_ELEMENT[tropicalProfileWest.toLowerCase()] || "";
        // Try both directions for element pair (Air-Fire or Fire-Air)
        const elementPair = elemA && elemB ? (
          `${elemA}-${elemB}` in elementDynamics ? `${elemA}-${elemB}` :
          `${elemB}-${elemA}` in elementDynamics ? `${elemB}-${elemA}` :
          `${elemA}-${elemB}`
        ) : "";
        
        // Use classifier tags as primary, with fallback to astroMatch badges
        const badgeTags = classifierResult.tags?.length ? classifierResult.tags : (astroMatch.badges?.length ? astroMatch.badges : [])
        const combinedTags = Array.from(new Set([...(result.tags ?? []), ...badgeTags]))
        // Always prioritize classifier result for rank label
        const rankLabelDisplay = classifierResult.rankLabel || result.rankLabel
        
        // Map rank label to TierLabel for minimal blurb generator
        const tierLabelMap: Record<string, TierLabel> = {
          "Soulmate Match": "Soulmate",
          "Twin Flame Match": "Twin Flame",
          "Excellent Match": "Excellent",
          "Good Friends": "Good Friends",
          "Neutral Match": "Neutral",
          "Sparky Friends": "Sparky Friends",
          "Opposites Attract": "Opposites Attract",
          "Difficult Match": "Difficult Match",
        };
        const tierLabel: TierLabel = tierLabelMap[rankLabelDisplay] || "Neutral";
        
        // Get Chinese pattern using the new pattern system
        const userChineseAnimal = capitalizeSign(userEast) as ChineseAnimal;
        const profileChineseAnimal = capitalizeSign(profileEast) as ChineseAnimal;
        const isSameAnimalPair = userChineseAnimal === profileChineseAnimal;
        const newPatternType = isSameAnimalPair
          ? ("same_animal" as ChinesePatternType)
          : getChinesePattern(userChineseAnimal, profileChineseAnimal);
        
        // Map new pattern types to legacy ChinesePattern for backward compatibility
        const patternTypeToLegacy: Record<ChinesePatternType, ChinesePattern> = {
          san_he: "same_trine",
          same_trine: "same_trine",
          same_animal: "same_animal",
          liu_he: "six_harmony",
          liu_chong: "opposites",
          liu_hai: "damage",
          xing: "damage",
          po: "opposites",
          friendly: "neutral",
        };
        const chinesePattern: ChinesePattern = patternTypeToLegacy[newPatternType] || "neutral";
        
        // Build Chinese relationship line using new system
        const chineseRelationshipLine = buildChineseLine(userEast.toLowerCase(), profileEast.toLowerCase());
        
        // Determine Western element compatibility
        let westernCompatibility: WesternElementCompatibility = "mixed";
        if (badgeTags.includes("Same Element (West)")) {
          westernCompatibility = "same";
        } else if (badgeTags.includes("Compatible Elements (West)") || badgeTags.includes("Compatible West Elements")) {
          westernCompatibility = "compatible";
        } else if (badgeTags.includes("Opposite Elements (West)") || badgeTags.includes("Opposite West Elements")) {
          westernCompatibility = "clashing";
        }
        
        // Create base key for deterministic hash
        const baseKey = `${userDisplayWest}-${userEast}|${profileDisplayWestCapitalized}-${profileEast}`;
        
        // Hash function for deterministic selection
        function hashKey(str: string): number {
          let h = 0;
          for (let i = 0; i < str.length; i++) {
            h = (h * 31 + str.charCodeAt(i)) | 0;
          }
          return Math.abs(h);
        }
        
        // Generate Chinese chemistry description
        const chineseDescriptions = ChineseChemistryDescription[chinesePattern];
        const chineseHash = hashKey(baseKey + "chinese" + chinesePattern);
        const chineseDescription = chineseDescriptions[chineseHash % chineseDescriptions.length];
        
        // Generate Western chemistry description
        const westernDescriptions = WesternChemistryDescription[westernCompatibility];
        const westernHash = hashKey(baseKey + "western" + westernCompatibility);
        const westernDescription = westernDescriptions[westernHash % westernDescriptions.length];
        
        // Get latest Chinese pair blurb using cnKey (for detailed descriptions)
        const chinesePairKey = cnKey(userChineseAnimal, profileChineseAnimal);
        const chinesePairBlurb = chinesePairBlurbs[chinesePairKey];
        
        // Get pattern definition from new system
        const patternDef = patternDefinitions[newPatternType];
        
        // Get western pair blurb
        const userWestSign = capitalizeSign(userWest) as WestSign;
        const profileWestSign = capitalizeSign(tropicalProfileWest) as WestSign;
        const westernPairKey = westKey(userWestSign, profileWestSign);
        const westernPairBlurb = westernPairBlurbs[westernPairKey];
        
        // Get NEW shorter connection box blurbs (after we have the signs defined)
        const westBoxBlurb = getConnectionBoxWestEntry(userWestSign as WestSign, profileWestSign as WestSign);
        
        // Use new pattern system for Chinese relationship with traditional Chinese labels and symbols
        // Build Chinese heading line with headlineTag for the label (with error handling)
        let chineseHeadingLine = "";
        let chinesePatternSentence = "";
        try {
          // Get Chinese animal metadata for traditional labels
          const userAnimalMeta = getAnimalMeta(userEast);
          const profileAnimalMeta = getAnimalMeta(profileEast);
          
          // Build Chinese heading line with traditional Chinese characters
          chineseHeadingLine = buildChineseHeadingLine(userEast.toLowerCase(), profileEast.toLowerCase());
          
          // Build Chinese pattern sentence using blurbHint
          chinesePatternSentence = buildChinesePatternSentence(userEast.toLowerCase(), profileEast.toLowerCase());
        } catch (error) {
          console.error(`[✗] Error building Chinese pattern lines for ${profile.name}:`, error);
          // Fallback to existing values
        }
        
        // Extract pattern description: keep English animal names, remove ONLY Chinese zodiac animal sign characters, keep pattern names/symbols, remove repetitions
        const extractPatternDescription = (text: string): string => {
          if (!text) return text;
          
          let result = text;
          
          // Remove ONLY Chinese zodiac animal sign characters: 鼠(rat), 牛(ox), 虎(tiger), 兔(rabbit), 龙(dragon), 蛇(snake), 马(horse), 羊(goat), 猴(monkey), 鸡(rooster), 狗(dog), 猪(pig)
          // DO NOT remove pattern symbols: 三合, 六合, 六冲, 六害, 刑, 破
          result = result.replace(/[鼠牛虎兔龙蛇马羊猴鸡狗猪]/g, "");
          
          // Remove pinyin Chinese animal names in parentheses: (Hóu), (Tù), (Shǔ), (Niú), (Hǔ), (Lóng), (Shé), (Mǎ), (Yáng), (Jī), (Gǒu), (Zhū)
          // Match any pinyin with tone marks in parentheses for the 12 zodiac animals
          result = result.replace(/\([Hh][óòǒō]u\)|\([Tt][ùúǔū]\)|\([Ss]h[ǔùúū]\)|\([Nn]i[úùǔū]\)|\([Hh][ǔùúū]\)|\([Ll][óòǒō]ng\)|\([Ss]h[éèěē]\)|\([Mm][ǎàáā]\)|\([Yy][áàǎā]ng\)|\([Jj][īíìǐ]\)|\([Gg][óòǒō]u\)|\([Zz]h[ūúùǔ]\)/gi, "");
          
          // Remove ALL quoted text - quotes are always duplicates in this context
          // Pattern: "Neutral / Friendly" "Neutral / Friendly" Friendly Pairing -> "Neutral / Friendly" Friendly Pairing
          result = result.replace(/\s*["']([^"']+)["']/g, "");
          
          // Remove duplicate pattern names that appear after the pattern with symbol
          // Pattern: "Xing (刑) Xing punishment" -> "Xing (刑) punishment"
          // Match pattern names: San He, Liu He, Liu Chong, Liu Hai, Xing, Po
          result = result.replace(/\b((?:San He|Liu He|Liu Chong|Liu Hai|Xing|Po))\s*\(([^)]+)\)\s+\1\s+/gi, "$1 ($2) ");
          
          // Remove consecutive duplicate words
          result = result.replace(/\b(\w+)\s+\1\b/gi, "$1");
          
          // Remove "Everyday" from pattern descriptions first
          // Pattern: "Neutral/Friendly Everyday Pairing" -> "Neutral/Friendly Pairing"
          result = result.replace(/\bEveryday\s+/gi, "");
          
          // Remove duplicate words that appear consecutively
          // Pattern: "Friendly Friendly" -> "Friendly"
          result = result.replace(/\b(\w+)\s+\1\b/gi, "$1");
          
          // Handle pattern like "Neutral/Friendly Friendly Pairing" -> "Neutral/Friendly Pairing"
          // Remove duplicate word that appears after a slash pattern
          result = result.replace(/(\w+\/\w+)\s+(\w+)\s+/gi, (match, p1, p2) => {
            const words = p1.toLowerCase().split("/");
            if (words.includes(p2.toLowerCase())) {
              // If the word after matches a word in the slash pattern, remove it
              return p1 + " ";
            }
            return match;
          });
          
          // Replace "/" with " / " for better spacing in patterns like "Neutral/Friendly" -> "Neutral / Friendly"
          result = result.replace(/(\w+)\/(\w+)/g, "$1 / $2");
          
          // Final pass: Remove duplicate words after " / " pattern
          // Pattern: "Neutral / Friendly" Friendly Pairing -> "Neutral / Friendly" Pairing
          result = result.replace(/([\w]+\s+\/\s+[\w]+)\s+(\w+)\s+/gi, (match, p1, p2) => {
            const patternWords = p1.toLowerCase().split(/\s+\/\s+/).map(w => w.trim()).filter(w => w.length > 0);
            if (patternWords.includes(p2.toLowerCase())) {
              return p1 + " ";
            }
            return match;
          });
          
          // Clean up extra spaces and trim
          result = result.replace(/\s+/g, " ").trim();
          
          return result || text; // Return original if all extraction fails
        };
        
        // Build eastLabel - extract pattern description which keeps animal names
        let eastLabel = "";
        const animalPart = `${userEast} × ${profileEast}`;
        
        if (chineseHeadingLine) {
          // Extract pattern - this should keep animal names from before the dash
          eastLabel = extractPatternDescription(chineseHeadingLine);
          // Ensure animal names are present
          if (!eastLabel.toLowerCase().includes(userEast.toLowerCase()) || !eastLabel.toLowerCase().includes(profileEast.toLowerCase())) {
            // If animal names are missing, prepend them
            const dashIndex = eastLabel.indexOf("—");
            if (dashIndex > 0) {
              eastLabel = `${animalPart} ${eastLabel.substring(dashIndex)}`;
            } else {
              eastLabel = `${animalPart} — ${eastLabel}`;
            }
          }
        } else if (chineseRelationshipLine) {
          eastLabel = extractPatternDescription(chineseRelationshipLine);
          // Ensure animal names are present
          if (!eastLabel.toLowerCase().includes(userEast.toLowerCase()) || !eastLabel.toLowerCase().includes(profileEast.toLowerCase())) {
            const dashIndex = eastLabel.indexOf("—");
            if (dashIndex > 0) {
              eastLabel = `${animalPart} ${eastLabel.substring(dashIndex)}`;
            } else {
              eastLabel = `${animalPart} — ${eastLabel}`;
            }
          }
        } else if (patternDef?.label) {
          // patternDef.label is just the pattern label, so add animal names
          eastLabel = `${animalPart} — ${patternDef.label}`;
        } else if (classifierResult.east_relation) {
          eastLabel = extractPatternDescription(classifierResult.east_relation);
          // Ensure animal names are present
          if (!eastLabel.toLowerCase().includes(userEast.toLowerCase()) || !eastLabel.toLowerCase().includes(profileEast.toLowerCase())) {
            const dashIndex = eastLabel.indexOf("—");
            if (dashIndex > 0) {
              eastLabel = `${animalPart} ${eastLabel.substring(dashIndex)}`;
            } else {
              eastLabel = `${animalPart} — ${eastLabel}`;
            }
          }
        } else {
          // Fallback: just use animal names with a generic label
          eastLabel = `${animalPart}`;
        }
        
        // Use the new SHORT connection box blurbs for display
        // Fallback to pattern sentence or full blurbs if needed
        const eastText = chineseBoxBlurb?.description || chinesePatternSentence || chinesePairBlurb || patternDef.shortDescription || classifierResult.east_summary
        
        // Use classifier result directly for west_relation since it already contains the full formatted string
        // Format: "SignA × SignB — Compatibility Type"
        // classifierResult.west_relation already includes the sign names and compatibility type, so use it directly
        const westLabel = classifierResult.west_relation
        const westText = westBoxBlurb?.description || westernPairBlurb || classifierResult.west_summary
        // Always use classifier result for headline/connectionLabel - don't let longform override it
        const headline = result.connectionLabel || classifierResult.rankLabel
        const eastTagline = longformContent?.east_tagline || result.east_tagline || result.tagline
        const overallTagline = longformContent?.tagline || result.tagline
        
        // Generate minimal blurb
        const minimalBlurb = buildConnectionBlurbMinimal({
          tierLabel,
          chinesePattern,
          baseKey,
        });
        
        // Fallback to old generator if minimal doesn't return anything
        const newBlurb = minimalBlurb || buildConnectionBlurb({
          westA: capitalizeSign(userWest),
          westB: capitalizeSign(tropicalProfileWest),
          animalA: capitalizeSign(userEast),
          animalB: capitalizeSign(profileEast),
          tierLabel: rankLabelDisplay,
          elementPair: elementPair
        });
        
        // Determine insight - use minimal blurb generator, fallback to old generator, then longform, then overrides
        let insight: string | undefined
        if (minimalBlurb) {
          insight = minimalBlurb
        } else if (newBlurb) {
          insight = newBlurb
        } else if (longformContent) {
          insight = longformContent.body
        } else {
          const pairKey = `${userWest.toLowerCase()}_${userEast.toLowerCase()}__${tropicalProfileWest.toLowerCase()}_${profileEast.toLowerCase()}` as OverrideKey
          const override = INSIGHT_OVERRIDES[pairKey]
          const useOverride = override && (override.rank === result.rankKey)
          insight = useOverride ? override.insight : autoInsight(result)
        }

        // Remove repeated pattern information from longformBody/insight that's already shown in compatibility lines
        // Extract pattern names/terms from east_relation and west_relation to avoid duplication
        const removeRepeatedPatterns = (text: string): string => {
          if (!text) return text;
          
          // Patterns to remove if they appear in the compatibility lines above
          const patternsToRemove = [
            // Chinese patterns with hanzi
            /Liu Chong \(六冲\)/g,
            /San He \(三合\)/g,
            /Liu He \(六合\)/g,
            /Liu Hai \(六害\)/g,
            /Xing \(刑\)/g,
            /Po \(破\)/g,
            /Self-Punishment \(相刑\)/g,
            // Pattern names without hanzi
            /\bLiu Chong\b/gi,
            /\bSan He\b/gi,
            /\bLiu He\b/gi,
            /\bLiu Hai\b/gi,
            /\bSix Conflicts\b/gi,
            /\bThree Harmonies\b/gi,
            /\bSix Harmonies\b/gi,
            /\bSix Harms\b/gi,
            // Common phrases that might repeat
            /\bOpposing Pair\b/gi,
            /\bSupportive Pair\b/gi,
            /\bTense Pair\b/gi,
            /\bTransformative Pair\b/gi,
            /\bDifficult Pair\b/gi,
            /\bNeutral Pair\b/gi,
            /\bFriendly Everyday Pairing\b/gi,
            /\bEveryday Pairing\b/gi,
          ];
          
          let cleaned = text;
          // Only remove if the pattern appears in east_relation or west_relation
          const combinedRelations = `${eastLabel} ${westLabel}`;
          patternsToRemove.forEach(pattern => {
            if (combinedRelations.match(pattern)) {
              cleaned = cleaned.replace(pattern, '');
            }
          });
          
          // Clean up extra spaces and punctuation
          cleaned = cleaned.replace(/\s+/g, ' ').replace(/\s*,\s*,/g, ',').replace(/\s*\.\s*\./g, '.').trim();
          return cleaned;
        };

        const cleanedInsight = insight ? removeRepeatedPatterns(insight) : insight;
        const cleanedLongformBody = longformContent?.body ? removeRepeatedPatterns(longformContent.body) : (minimalBlurb ? removeRepeatedPatterns(minimalBlurb) : (newBlurb ? removeRepeatedPatterns(newBlurb) : cleanedInsight));

        // NEW: Build match engine result for pattern information
        const userWesternSignTyped = capitalizeSign(userDisplayWest) as WesternSignType;
        const profileWesternSignTyped = capitalizeSign(profileDisplayWestCapitalized) as WesternSignType;
        const userChineseTyped = capitalizeSign(userEast) as ChineseAnimalType;
        const profileChineseTyped = capitalizeSign(profileEast) as ChineseAnimalType;
        
        // Calculate pattern and relations for match engine
        const westAspect = calculateWestAspect(userWesternSignTyped, profileWesternSignTyped);
        const userWestElement = getWesternSignElement(userWesternSignTyped);
        const profileWestElement = getWesternSignElement(profileWesternSignTyped);
        const westElementRelation = calculateWestElementRelation(userWestElement, profileWestElement);
        
        // Get Wu Xing relation
        const userWuXing = getWuXingYearElement(userBirthYear);
        const profileWuXing = getWuXingYearElement(profileBirthYear);
        const wuXingRelation = computeWuXingRelation(userWuXing, profileWuXing);
        
        // Map new pattern type to uppercase format
        const patternTypeMapping: Record<ChinesePatternType, string> = {
          san_he: "SAN_HE",
          same_trine: "SAN_HE",
          same_animal: "SAME_ANIMAL",
          liu_he: "LIU_HE",
          liu_chong: "LIU_CHONG",
          liu_hai: "LIU_HAI",
          xing: "XING",
          po: "PO",
          friendly: "NO_PATTERN",
        };
        const normalizedPattern = normalizePattern(patternTypeMapping[newPatternType] || "NO_PATTERN");
        
        // Build match engine input
        const matchEngineInput: MatchInput = {
          pattern: normalizedPattern,
          westernElementRelation: convertElementRelation(westElementRelation),
          westernAspectRelation: convertAspectRelation(westAspect),
          wuXingRelation,
        };
        
        // Get match result with pattern metadata
        const matchEngineResult = buildMatchResult(matchEngineInput);
        
        // DEBUG: Log match engine result
        console.log(`[Match Engine Result] ${profile.name}:`, {
          pillLabel: matchEngineResult.pillLabel,
          pattern: matchEngineResult.pattern,
          patternEmoji: matchEngineResult.patternEmoji,
          score: matchEngineResult.score
        });

        const boxData: ConnectionBoxData = {
          score: classifierResult.score,
          rank: rankLabelDisplay,
          rankLabel: rankLabelDisplay,
          rankKey: classifierResult.rankKey,  // Always use classifier rankKey
          emoji: classifierResult.emoji,  // Use classifier emoji for consistency
          colorRgb: classifierResult.colorRgb,  // Always use classifier color from TIER_TO_COLOR
          connectionLabel: headline,
          tagline: overallTagline,
          east_tagline: eastTagline,
          tags: combinedTags,
          notes: classifierResult.notes || badgeTags, // Use classifier badges as notes
          insight: cleanedInsight,
          longformBody: cleanedLongformBody,
          hasOverride: result.hasOverride,
          hasLongform: !!longformContent,
          east_relation: eastLabel,
          east_summary: eastText,
          west_relation: westLabel,
          west_summary: westText,
          tier: classifierResult.tier || result.tier,  // Use classifier tier
          // NEW: Match engine result fields
          pillLabel: matchEngineResult.pillLabel,
          patternFullLabel: matchEngineResult.patternFullLabel,
          baseTagline: matchEngineResult.baseTagline,
          patternEmoji: matchEngineResult.patternEmoji,
          pattern: matchEngineResult.pattern,  // ChinesePattern for gradient lookup
          chemistryStars: matchEngineResult.chemistryStars,
          stabilityStars: matchEngineResult.stabilityStars,
          astroMatch,
          a: {
            west: userDisplayWest,
            east: userEast,
            westGlyph: getWesternSignGlyph(userDisplayWest),
            eastGlyph: getChineseSignGlyph(userEast)
          },
          b: {
            west: profileDisplayWestCapitalized,
            east: profileEast,
            westGlyph: getWesternSignGlyph(profileDisplayWestCapitalized),
            eastGlyph: getChineseSignGlyph(profileEast)
          }
        }
        
        boxes[profile.id] = boxData
        
        // Log match engine relationship data for debugging (using classifier results)
        console.log(`[✓] ${profile.name} (${profileDisplayWest}-${profile.easternSign}): ${classifierResult.score}% ${result.emoji} - ${rankLabelDisplay}`)
        console.log(`   Classifier Tier: ${classifierResult.rankLabel} | Rank Key: ${classifierResult.rankKey}`)
        console.log(`   BoxData rankLabel: ${rankLabelDisplay} | rank: ${rankLabelDisplay} | rankKey: ${classifierResult.rankKey}`)
        console.log(`   User: ${userDisplayWest}-${userEast} × Profile: ${profileDisplayWestCapitalized}-${profileEast}`)
        console.log(`   Chinese Pattern: ${newPatternType} (${patternDef.label})`)
        console.log(`   Chinese Relationship: ${chineseRelationshipLine}`)
        console.log(`   Chinese Heading: ${chineseHeadingLine}`)
        console.log(`   East: ${eastLabel}`)
        if (eastText) {
          const source = chinesePatternSentence ? 'Pattern BlurbHint' : chinesePairBlurb ? 'Chinese Pair Blurb' : patternDef.shortDescription ? 'Pattern shortDescription' : 'Classifier';
          console.log(`   East Summary (${source}): ${eastText.substring(0, 80)}...`)
        }
        console.log(`   West: ${westLabel}`)
        if (westText) {
          const source = westernPairBlurb ? 'Western Pair Blurb' : 'Classifier';
          console.log(`   West Summary (${source}): ${westText.substring(0, 80)}...`)
        }
        if (badgeTags.length > 0) console.log(`   Badges: ${badgeTags.join(', ')}`)
        if (profile.name === "Emma") {
          console.log(`[DEBUG EMMA] Full boxData:`, JSON.stringify({
            rank: rankLabelDisplay,
            rankLabel: rankLabelDisplay,
            rankKey: classifierResult.rankKey,
            connectionLabel: headline,
            score: classifierResult.score
          }, null, 2))
        }
        */
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error instanceof Event ? 'Event error' : String(error);
        const errorStack = error instanceof Error ? error.stack : '';
        console.error(`[✗] Error building compatibility for ${profile.name}:`, errorMessage, errorStack || error);
      }
    }
    
    // After processing all profiles, set the boxes
    console.log('[Match Engine] Finished. Total boxes:', Object.keys(boxes).length)
      setCompatBoxes(boxes)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error instanceof Event ? 'Event error' : String(error);
      const errorStack = error instanceof Error ? error.stack : '';
      console.error('[✗] Error in compatibility box building:', errorMessage, errorStack || error);
    }
  }, [userZodiacSigns, enrichedProfiles, sunSignSystem])

  // Debug: Log when compatBoxes changes
  useEffect(() => {
    if (Object.keys(compatBoxes).length > 0) {
      console.log('[🔍 Debug] compatBoxes updated. Count:', Object.keys(compatBoxes).length)
    }
  }, [compatBoxes])

  useEffect(() => {
    setFilteredProfiles(enrichedProfiles)
  }, [enrichedProfiles])

  const currentProfile = filteredProfiles[currentProfileIndex]

  const handlePrevProfile = () => {
    if (currentProfileIndex > 0) {
      // Show button flash
      setBackButtonFlash(true)
      setTimeout(() => setBackButtonFlash(false), 400)
      setCurrentProfileIndex(currentProfileIndex - 1)
      setCurrentPhotoIndex(0)
      setIsUserInteracting(false)
    }
  }

  const handleNextProfile = () => {
    if (currentProfileIndex < filteredProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1)
      setCurrentPhotoIndex(0)
      setIsUserInteracting(false)
    }
  }

  const handleLike = async () => {
    console.log('Liked:', currentProfile.name)
    
    // Save like to database using recordLike
    try {
      if (currentUserId) {
        const result = await recordLike({
          fromUserId: currentUserId,
          toUserId: String(currentProfile.id)
        })
        
        console.log('[Matches] RecordLike result:', result)
        
        if (result.status === "new_match") {
          // It's a mutual match! Show the match modal
          setMatchedProfile(currentProfile)
          setMatchConversationId(result.conversationId)
          setShowMatchModal(true)
          console.log('🎉 New match with:', currentProfile.name)
        } else if (result.status === "liked_only") {
          // One-way like - show toast
          setToast({ message: `You liked ${currentProfile.name}`, type: 'success' })
          setTimeout(() => setToast(null), 3000)
          console.log('✓ Like saved (one-way)')
        } else if (result.status === "already_matched") {
          // Already matched - conversation exists
          console.log('Already matched with:', currentProfile.name)
        } else if (result.status === "error") {
          console.error('Error recording like:', result.error)
        }
      } else {
        console.warn('[Matches] No user ID - cannot save like')
      }
    } catch (error) {
      console.error('Error in handleLike:', error)
    }
    
    // Step 1: Show the heart icon first
    setActiveButton('like')
    setLikeButtonFlash(true)
    setShowLikeFlash(true)
    
    // Step 2: Wait a brief moment (300ms) then start the swipe animation
    setTimeout(() => {
      setIsAnimating(true)
      // Animate card flying off to the right
      setSwipeOffset(1000) // Swipe right off screen
    }, 300)
    
    // Hide flash as card is leaving
    setTimeout(() => setShowLikeFlash(false), 1000)
    
    // Step 3: Reset buttons quickly as soon as card starts leaving (400ms)
    setTimeout(() => {
      setLikeButtonFlash(false)
      setActiveButton(null)
    }, 400) // Buttons return to normal much faster
    
    // Step 4: Change profile while card is off screen
    setTimeout(() => {
      // Change profile FIRST while card is still off screen
      handleNextProfile()
      // Then reset animation state and swipe offset
      setIsAnimating(false)
      setSwipeOffset(0)
    }, 1000) // 300ms pause + 700ms swipe animation
  }

  const handlePass = () => {
    console.log('Passed:', currentProfile.name)
    // Step 1: Show the X icon first
    setActiveButton('pass')
    setPassButtonFlash(true)
    setShowPassFlash(true)
    
    // Step 2: Wait a brief moment (300ms) then start the swipe animation
    setTimeout(() => {
      setIsAnimating(true)
      // Animate card flying off to the left
      setSwipeOffset(-1000) // Swipe left off screen
    }, 300)
    
    // Hide flash as card is leaving
    setTimeout(() => setShowPassFlash(false), 1000)
    
    // Step 3: Reset buttons quickly as soon as card starts leaving (400ms)
    setTimeout(() => {
      setPassButtonFlash(false)
      setActiveButton(null)
    }, 400) // Buttons return to normal much faster
    
    // Step 4: Change profile while card is off screen
    setTimeout(() => {
      // Change profile FIRST while card is still off screen
      handleNextProfile()
      // Then reset animation state and swipe offset
      setIsAnimating(false)
      setSwipeOffset(0)
    }, 1000) // 300ms pause + 700ms swipe animation
  }

  const handleChat = () => {
    console.log('Chat with:', currentProfile.name)
    // Show button flash
    setMessageButtonFlash(true)
    setTimeout(() => setMessageButtonFlash(false), 400)
    router.push(`/messages/${currentProfile.id}`)
  }

  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    setTouchEnd(null)
    setTouchStart(touch.clientX)
    setTouchStartY(touch.clientY)
    setIsUserInteracting(true)
    // Capture the Y position relative to the card
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      setTouchY(touch.clientY - cardRect.top)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const currentTouch = e.targetTouches[0]
    const diff = currentTouch.clientX - touchStart

    if (!isUserInteracting) {
      setIsUserInteracting(true)
    }

    if (touchStartY !== null) {
      const deltaY = currentTouch.clientY - touchStartY
      if (Math.abs(deltaY) > Math.abs(diff) && Math.abs(deltaY) > 8) {
        // treat gesture as vertical scroll; cancel swipe state so page can scroll
        setTouchStart(null)
        setTouchEnd(null)
        setTouchStartY(null)
        setSwipeOffset(0)
        if (showLikeFlash) setShowLikeFlash(false)
        if (showPassFlash) setShowPassFlash(false)
        setLikeButtonFlash(false)
        setPassButtonFlash(false)
        setActiveButton(null)
        setIsUserInteracting(false)
        return
      }
    }

    setSwipeOffset(diff)
    setTouchEnd(currentTouch.clientX)
    
    // Update Y position as user moves finger
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      setTouchY(currentTouch.clientY - cardRect.top)
    }
    
    // Show flash animations immediately when swiping in either direction
    const minSwipeToShow = 50 // Very small threshold - just 50px
    
    if (diff > minSwipeToShow) {
      // Swiping right = like - Trigger ALL button animations immediately
      if (!showLikeFlash) {
        setShowLikeFlash(true)
        setLikeButtonFlash(true)
        setActiveButton('like') // Start button animations NOW
      }
      if (showPassFlash) {
        setShowPassFlash(false)
        setPassButtonFlash(false)
        setActiveButton(null)
      }
    } else if (diff < -minSwipeToShow) {
      // Swiping left = pass - Trigger ALL button animations immediately
      if (!showPassFlash) {
        setShowPassFlash(true)
        setPassButtonFlash(true)
        setActiveButton('pass') // Start button animations NOW
      }
      if (showLikeFlash) {
        setShowLikeFlash(false)
        setLikeButtonFlash(false)
        setActiveButton(null)
      }
    } else {
      // Not far enough, hide both
      if (showLikeFlash) {
        setShowLikeFlash(false)
        setLikeButtonFlash(false)
        setActiveButton(null)
      }
      if (showPassFlash) {
        setShowPassFlash(false)
        setPassButtonFlash(false)
        setActiveButton(null)
      }
    }
  }

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) {
      setSwipeOffset(0)
      setShowLikeFlash(false)
      setShowPassFlash(false)
      setActiveButton(null)
      setTouchStartY(null)
      setIsUserInteracting(false)
      return
    }
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      // Swipe left = pass - Animations already running from onTouchMove
      setIsAnimating(true)
      // Animate card all the way off screen
      setSwipeOffset(-1000)
      
      // Wait for animation to complete, then show next profile from underneath
      setTimeout(() => {
        setShowPassFlash(false)
        setPassButtonFlash(false)
        setActiveButton(null)
        // Change profile FIRST while card is still off screen
        handleNextProfile()
        // Then reset animation state and swipe offset immediately after
        setIsAnimating(false)
        setSwipeOffset(0)
      }, 350)
    } else if (isRightSwipe) {
      // Swipe right = like - Animations already running from onTouchMove
      setIsAnimating(true)
      // Animate card all the way off screen
      setSwipeOffset(1000)
      
      // Wait for animation to complete, then show next profile from underneath
      setTimeout(() => {
        setShowLikeFlash(false)
        setLikeButtonFlash(false)
        setActiveButton(null)
        // Change profile FIRST while card is still off screen
        handleNextProfile()
        // Then reset animation state and swipe offset immediately after
        setIsAnimating(false)
        setSwipeOffset(0)
      }, 350)
    } else {
      // Reset if swipe wasn't far enough
      setSwipeOffset(0)
      setShowLikeFlash(false)
      setShowPassFlash(false)
      setLikeButtonFlash(false)
      setPassButtonFlash(false)
      setActiveButton(null)
      setIsUserInteracting(false)
    }
    
    setTouchStart(null)
    setTouchEnd(null)
    setTouchStartY(null)
    setIsUserInteracting(false)
  }

  const onTouchCancel = () => {
    setSwipeOffset(0)
    setShowLikeFlash(false)
    setShowPassFlash(false)
    setLikeButtonFlash(false)
    setPassButtonFlash(false)
    setActiveButton(null)
    setTouchStart(null)
    setTouchEnd(null)
    setTouchStartY(null)
    setIsUserInteracting(false)
  }

  // Mouse drag handlers for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    if (isTouchDevice) return // Don't handle mouse events on touch devices
    // Only preventDefault if we're actually going to drag (not on buttons/links)
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
      return; // Don't prevent default on interactive elements
    }
    // Remove preventDefault - using CSS touch-action instead
    setMouseEnd(null)
    setMouseStart(e.clientX)
    setMouseStartY(e.clientY)
    setIsDragging(true)
    setIsUserInteracting(true)
    // Capture the Y position relative to the card
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      setTouchY(e.clientY - cardRect.top)
    }
  }

  // Global mouse move handler for dragging
  useEffect(() => {
    if (!isDragging || isTouchDevice) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (mouseStart === null) return
      const diff = e.clientX - mouseStart

      if (mouseStartY !== null) {
        const deltaY = e.clientY - mouseStartY
        if (Math.abs(deltaY) > Math.abs(diff) && Math.abs(deltaY) > 8) {
          // treat gesture as vertical scroll; cancel drag state
          setMouseStart(null)
          setMouseEnd(null)
          setMouseStartY(null)
          setSwipeOffset(0)
          setIsDragging(false)
          if (showLikeFlash) setShowLikeFlash(false)
          if (showPassFlash) setShowPassFlash(false)
          setLikeButtonFlash(false)
          setPassButtonFlash(false)
          setActiveButton(null)
          setIsUserInteracting(false)
          return
        }
      }

      setSwipeOffset(diff)
      setMouseEnd(e.clientX)
      
      // Update Y position as user moves mouse
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect()
        setTouchY(e.clientY - cardRect.top)
      }
      
      // Show flash animations immediately when dragging in either direction
      const minSwipeToShow = 50
      
      if (diff > minSwipeToShow) {
        // Dragging right = like
        if (!showLikeFlash) {
          setShowLikeFlash(true)
          setLikeButtonFlash(true)
          setActiveButton('like')
        }
        if (showPassFlash) {
          setShowPassFlash(false)
          setPassButtonFlash(false)
          setActiveButton(null)
        }
      } else if (diff < -minSwipeToShow) {
        // Dragging left = pass
        if (!showPassFlash) {
          setShowPassFlash(true)
          setPassButtonFlash(true)
          setActiveButton('pass')
        }
        if (showLikeFlash) {
          setShowLikeFlash(false)
          setLikeButtonFlash(false)
          setActiveButton(null)
        }
      } else {
        // Not far enough, hide both
        if (showLikeFlash) {
          setShowLikeFlash(false)
          setLikeButtonFlash(false)
          setActiveButton(null)
        }
        if (showPassFlash) {
          setShowPassFlash(false)
          setPassButtonFlash(false)
          setActiveButton(null)
        }
      }
    }

    const handleGlobalMouseUp = () => {
      if (!isDragging || mouseStart === null || mouseEnd === null || isTouchDevice) {
        setSwipeOffset(0)
        setShowLikeFlash(false)
        setShowPassFlash(false)
        setActiveButton(null)
        setMouseStartY(null)
        setIsDragging(false)
        setIsUserInteracting(false)
        return
      }
      
      const distance = mouseStart - mouseEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance
      
      if (isLeftSwipe) {
        // Drag left = pass
        setIsAnimating(true)
        setSwipeOffset(-1000)
        
        setTimeout(() => {
          setShowPassFlash(false)
          setPassButtonFlash(false)
          setActiveButton(null)
          // Change profile FIRST while card is still off screen
          handleNextProfile()
          // Then reset animation state and swipe offset
          setIsAnimating(false)
          setSwipeOffset(0)
        }, 350)
      } else if (isRightSwipe) {
        // Drag right = like
        setIsAnimating(true)
        setSwipeOffset(1000)
        
        setTimeout(() => {
          setShowLikeFlash(false)
          setLikeButtonFlash(false)
          setActiveButton(null)
          // Change profile FIRST while card is still off screen
          handleNextProfile()
          // Then reset animation state and swipe offset
          setIsAnimating(false)
          setSwipeOffset(0)
        }, 350)
      } else {
        // Reset if drag wasn't far enough
        setSwipeOffset(0)
        setShowLikeFlash(false)
        setShowPassFlash(false)
        setLikeButtonFlash(false)
        setPassButtonFlash(false)
        setActiveButton(null)
        setIsUserInteracting(false)
      }
      
      setMouseStart(null)
      setMouseEnd(null)
      setMouseStartY(null)
      setIsDragging(false)
      setIsUserInteracting(false)
    }

    // Mouse events don't need passive: false, but adding it won't hurt
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false })
    document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false })

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, mouseStart, mouseEnd, mouseStartY, isTouchDevice, showLikeFlash, showPassFlash])

  // Mouse handlers are simplified - global listeners handle the logic
  const onMouseMove = (e: React.MouseEvent) => {
    // Handled by global listener - don't preventDefault on React synthetic events
  }

  const onMouseUp = () => {
    // Handled by global listener
  }

  // Button swipe handlers
  const onButtonTouchStart = (e: React.TouchEvent) => {
    setButtonTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onButtonTouchEnd = (e: React.TouchEvent, action: 'like' | 'pass') => {
    if (!buttonTouchStart) return
    
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchEndX - buttonTouchStart.x
    const diffY = Math.abs(touchEndY - buttonTouchStart.y)
    
    // Only trigger if horizontal swipe is dominant (more than vertical)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
      if (action === 'like' && diffX > 0) {
        // Swipe right on like button
        handleLike()
      } else if (action === 'pass' && diffX < 0) {
        // Swipe left on pass button
        handlePass()
      }
    }
    
    setButtonTouchStart(null)
  }

  // Show loading indicator only if we have no profiles at all
  if (profilesLoading && filteredProfiles.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}>
        <div className="text-center">
          <p className={`text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Loading matches...
          </p>
        </div>
      </div>
    )
  }

  const containerStyle: React.CSSProperties = isTouchDevice
    ? {
        WebkitOverflowScrolling: 'touch',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '100dvh',
        position: 'relative',
        paddingBottom: '90px',
        paddingTop: '16px',
      }
    : {
        WebkitOverflowScrolling: 'auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '120px',
        paddingTop: '24px',
      }

  return (
    <div
      className={`overscroll-y-contain ${theme === "light" ? "bg-white" : "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"}`}
      style={containerStyle}
    >
      {/* CSS Animations for Flash */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        body {
          overflow-x: hidden;
          overscroll-behavior-y: contain;
        }
        
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes buttonFlash {
          0% {
            background-color: var(--button-bg-start);
          }
          50% {
            background-color: rgb(249, 115, 22);
          }
          100% {
            background-color: var(--button-bg-start);
          }
        }
        
        @keyframes buttonFlashActive {
          0% {
            background-color: var(--button-bg-start);
            transform: scale(1);
          }
          40% {
            background-color: rgb(249, 115, 22);
            transform: scale(1.2);
          }
          100% {
            background-color: rgb(249, 115, 22);
            transform: scale(1.15);
          }
        }
        
        @keyframes buttonShrinkOut {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        
        @keyframes iconFlash {
          0% {
            stroke: rgb(249, 115, 22);
            fill: none;
          }
          50% {
            stroke: white;
            fill: white;
          }
          100% {
            stroke: rgb(249, 115, 22);
            fill: none;
          }
        }
        
        @keyframes iconFlashFilled {
          0% {
            fill: rgb(249, 115, 22);
          }
          50% {
            fill: white;
          }
          100% {
            fill: rgb(249, 115, 22);
          }
        }
        
        @keyframes iconFlashActive {
          0% {
            stroke: rgb(249, 115, 22);
            fill: none;
          }
          40% {
            stroke: white;
            fill: white;
          }
          100% {
            stroke: white;
            fill: white;
          }
        }
        
        .button-flash-animation {
          animation: buttonFlash 0.4s ease-out;
        }
        
        .button-flash-active {
          animation: buttonFlashActive 0.5s ease-out forwards;
        }
        
        .button-shrink-out {
          animation: buttonShrinkOut 0.4s ease-out forwards;
        }
        
        .icon-flash-animation {
          animation: iconFlash 0.4s ease-out;
        }
        
        .icon-flash-animation-filled {
          animation: iconFlashFilled 0.4s ease-out;
        }
        
        .icon-flash-active {
          animation: iconFlashActive 0.5s ease-out forwards;
        }
      `}</style>
      
      <div className="relative z-10 max-w-sm mx-auto overflow-visible">
        {/* Header */}
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-0.5">
              <FourPointedStar className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-base bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Matches
              </span>
            </div>
            
            {/* Right side: Back button, Settings and Theme toggle */}
            <div className="flex items-center gap-2">
              {/* Back button */}
              <button
                onClick={handlePrevProfile}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Go to previous profile"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={theme === "light" ? "rgb(75, 85, 99)" : "rgba(255, 255, 255, 0.7)"} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M3 7v6h6" />
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                </svg>
              </button>
              
              {/* Settings Dropdown */}
              <div className="relative settings-dropdown-container">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Match settings"
                >
                  <Settings className={`w-5 h-5 ${theme === "light" ? "text-gray-600" : "text-white/70"}`} />
                </button>
                
                {showSettingsDropdown && (
                  <div className={`absolute right-0 top-10 w-80 backdrop-blur-sm rounded-lg shadow-xl p-4 z-50 ${theme === "light" ? "bg-white border border-gray-200" : "bg-slate-800/40 border border-indigo-500/20 shadow-lg shadow-indigo-950/30"}`}>
                    <h3 className={`text-lg font-bold mb-4 ${theme === "light" ? "text-black" : "text-white"}`}>Search Settings</h3>
                    
                    {/* Western Sign Filter */}
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>Western Zodiac Sign</label>
                      <select
                        value={searchFilters.westernSign}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, westernSign: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-500 ${
                          theme === "light" 
                            ? "bg-white border border-gray-300 text-black" 
                            : "bg-slate-900/50 border border-indigo-400/20 text-white"
                        }`}
                        style={{ 
                          colorScheme: theme === 'light' ? 'light' : 'dark',
                          WebkitTextFillColor: theme === 'light' ? '#000000' : 'white',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none'
                        } as React.CSSProperties}
                      >
                        <option value="" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>Any Western Sign</option>
                        <option value="Aries" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♈ Aries</option>
                        <option value="Taurus" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♉ Taurus</option>
                        <option value="Gemini" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♊ Gemini</option>
                        <option value="Cancer" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♋ Cancer</option>
                        <option value="Leo" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♌ Leo</option>
                        <option value="Virgo" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♍ Virgo</option>
                        <option value="Libra" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♎ Libra</option>
                        <option value="Scorpio" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♏ Scorpio</option>
                        <option value="Sagittarius" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♐ Sagittarius</option>
                        <option value="Capricorn" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♑ Capricorn</option>
                        <option value="Aquarius" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♒ Aquarius</option>
                        <option value="Pisces" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>♓ Pisces</option>
                      </select>
                    </div>
                    
                    {/* Eastern Sign Filter */}
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>Chinese Zodiac Sign</label>
                      <select
                        value={searchFilters.easternSign}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, easternSign: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-purple-500 ${
                          theme === "light" 
                            ? "bg-white border border-gray-300 text-black" 
                            : "bg-slate-900/50 border border-indigo-400/20 text-white"
                        }`}
                        style={{ 
                          colorScheme: theme === 'light' ? 'light' : 'dark',
                          WebkitTextFillColor: theme === 'light' ? '#000000' : 'white',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none'
                        } as React.CSSProperties}
                      >
                        <option value="" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>Any Chinese Sign</option>
                        <option value="Rat" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐭 Rat</option>
                        <option value="Ox" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐂 Ox</option>
                        <option value="Tiger" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐅 Tiger</option>
                        <option value="Rabbit" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐰 Rabbit</option>
                        <option value="Dragon" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐉 Dragon</option>
                        <option value="Snake" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐍 Snake</option>
                        <option value="Horse" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐎 Horse</option>
                        <option value="Goat" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐐 Goat</option>
                        <option value="Monkey" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐒 Monkey</option>
                        <option value="Rooster" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐓 Rooster</option>
                        <option value="Dog" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐕 Dog</option>
                        <option value="Pig" style={{ color: theme === 'light' ? '#000000' : 'white', backgroundColor: theme === 'light' ? '#ffffff' : '#3f3f46' }}>🐷 Pig</option>
                      </select>
                    </div>
                    
                    {/* Chinese Pattern Filters */}
                    <div className="mb-4">
                    <p className={`text-sm mb-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>Chinese Patterns:</p>
                    
                    {/* San He Filter */}
                    <div className="mb-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={chinesePatternFilters.SanHe}
                          onChange={(e) => setChinesePatternFilters(prev => ({ ...prev, SanHe: e.target.checked }))}
                          className={`w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 ${
                            theme === "light" 
                              ? "bg-white border-gray-300" 
                              : "bg-slate-900/50 border-indigo-400/20"
                          }`}
                        />
                        <span className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          🌟 San He (Triple Harmony)
                        </span>
                      </label>
                      <p className={`text-xs mt-1 ml-7 ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                        Highly compatible trine patterns
                      </p>
                    </div>
                    
                    {/* Liu He Filter */}
                    <div className="mb-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={chinesePatternFilters.LiuHe}
                          onChange={(e) => setChinesePatternFilters(prev => ({ ...prev, LiuHe: e.target.checked }))}
                          className={`w-4 h-4 text-purple-600 rounded focus:ring-purple-500 focus:ring-2 ${
                            theme === "light" 
                              ? "bg-white border-gray-300" 
                              : "bg-slate-900/50 border-indigo-400/20"
                          }`}
                        />
                        <span className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                          💫 Liu He (Secret Friends)
                        </span>
                      </label>
                      <p className={`text-xs mt-1 ml-7 ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                        Hidden harmony and support
                      </p>
                    </div>
                    </div>
                    
                    {/* Friend Finder Toggle */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                            🤝 Friend Finder
                          </span>
                        </div>
                        <button
                          onClick={() => setFriendFinderEnabled(!friendFinderEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                            friendFinderEnabled 
                              ? 'bg-purple-600' 
                              : theme === "light" ? 'bg-gray-300' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              friendFinderEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                        Shows same sex profiles in your matches page.
                      </p>
                    </div>
                    
                    {/* Allow Instant Messages Toggle */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white/80"}`}>
                            💬 Allow Instant Messages
                          </span>
                        </div>
                        <button
                          onClick={() => setAllowInstantMessages(!allowInstantMessages)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                            allowInstantMessages 
                              ? 'bg-purple-600' 
                              : theme === "light" ? 'bg-gray-300' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              allowInstantMessages ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/60"}`}>
                        Others can message you directly without matching first
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSearchFilters({ westernSign: '', easternSign: '' })
                          setChinesePatternFilters({ SanHe: false, LiuHe: false })
                          setFriendFinderEnabled(false)
                          setAllowInstantMessages(false)
                          setShowSettingsDropdown(false)
                        }}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                          theme === "light"
                            ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            : "bg-zinc-600/50 hover:bg-zinc-600/70 text-white"
                        }`}
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setShowSettingsDropdown(false)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-500 hover:via-orange-400 hover:to-red-400 text-white text-sm rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`p-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card Stack */}
        {currentProfile ? (
          <div className="pb-32 relative overflow-visible">
            {/* Next profile card (underneath) - Full size and ready */}
            {filteredProfiles[currentProfileIndex + 1] && (
              <div 
                key={`next-${filteredProfiles[currentProfileIndex + 1].id}`}
                className="absolute top-0 left-0 right-0 pb-32"
                style={{
                  zIndex: 1,
                  pointerEvents: 'none',
                  clipPath: 'inset(0 0 0 0)' // Will be overridden by current card
                }}
              >
                <MatchProfileCard
                  profile={{
                    id: filteredProfiles[currentProfileIndex + 1].id,
                    name: filteredProfiles[currentProfileIndex + 1].name,
                    age: filteredProfiles[currentProfileIndex + 1].age,
                    photos: filteredProfiles[currentProfileIndex + 1].photos,
                    aboutMe: filteredProfiles[currentProfileIndex + 1].aboutMe,
                    occupation: filteredProfiles[currentProfileIndex + 1].occupation,
                    city: filteredProfiles[currentProfileIndex + 1].city,
                    height: filteredProfiles[currentProfileIndex + 1].height,
                    children: filteredProfiles[currentProfileIndex + 1].children,
                    religion: filteredProfiles[currentProfileIndex + 1].religion,
                    prompts: filteredProfiles[currentProfileIndex + 1].prompts,
                    westernSign: sunSignSystem === "sidereal"
                      ? (filteredProfiles[currentProfileIndex + 1].siderealWesternSign || filteredProfiles[currentProfileIndex + 1].westernSign)
                      : (filteredProfiles[currentProfileIndex + 1].tropicalWesternSign || filteredProfiles[currentProfileIndex + 1].westernSign),
                    easternSign: filteredProfiles[currentProfileIndex + 1].easternSign,
                  }}
                  connectionBoxData={compatBoxes[filteredProfiles[currentProfileIndex + 1].id]}
                  theme={theme}
                  onPhotoChange={() => {}}
                  onMessageClick={() => {
                    const nextProfile = filteredProfiles[currentProfileIndex + 1];
                    if (nextProfile) {
                      router.push(`/messages/${nextProfile.id}`);
                    }
                  }}
                />
              </div>
            )}
            
            {/* Current profile card (on top) - This card clips the one underneath */}
            <div 
              key={`current-${currentProfile.id}`}
              ref={cardRef}
              className="relative"
              style={{ 
                zIndex: 2, 
                touchAction: isTouchDevice 
                  ? (isUserInteracting ? ('none' as const) : ('pan-y' as const))
                  : ('auto' as const),
                cursor: !isTouchDevice ? (isDragging ? 'grabbing' : 'grab') : 'default',
                // Use a pseudo-element or mask to hide the bottom card below this one
                backgroundColor: 'transparent'
              }}
              onTouchStart={isTouchDevice ? onTouchStart : undefined}
              onTouchMove={isTouchDevice ? onTouchMove : undefined}
              onTouchEnd={isTouchDevice ? onTouchEnd : undefined}
              onTouchCancel={isTouchDevice ? onTouchCancel : undefined}
              onMouseDown={!isTouchDevice ? onMouseDown : undefined}
              onMouseMove={!isTouchDevice ? onMouseMove : undefined}
              onMouseUp={!isTouchDevice ? onMouseUp : undefined}
            >
              <div
                className="relative"
                style={{
                  transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.03}deg)`,
                  transition: isAnimating ? 'transform 0.7s ease-out' : (touchStart || isDragging) ? 'none' : 'transform 0.2s ease-out',
                }}
              >
                {/* 
                ====================================================================
                ORIGINAL FLASH ANIMATION CODE (BACKUP - RESTORE IF NEEDED)
                ====================================================================
                
                {/* Like/Pass Flash - Inside the card, counteracting rotation */}
                {/* Like Flash - Top Left Corner */}
                {/*
                {showLikeFlash && (
                  <div 
                    className="absolute top-8 left-8 z-50 pointer-events-none"
                    style={{
                      transform: `rotate(${-15 - (swipeOffset * 0.03)}deg)`
                    }}
                  >
                    <div style={{ animation: 'scaleIn 0.2s ease-out' }}>
                      <svg 
                        className="w-32 h-32" 
                        viewBox="0 0 24 24" 
                        fill="rgb(249, 115, 22)"
                        style={{
                          filter: 'drop-shadow(0 10px 30px rgba(249, 115, 22, 0.5))'
                        }}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Pass Flash - Top Right Corner */}
                {/*
                {showPassFlash && (
                  <div 
                    className="absolute top-8 right-8 z-50 pointer-events-none"
                    style={{
                      transform: `rotate(${15 - (swipeOffset * 0.03)}deg)`
                    }}
                  >
                    <div style={{ animation: 'scaleIn 0.2s ease-out' }}>
                      <svg 
                        className="w-32 h-32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="rgb(249, 115, 22)" 
                        strokeWidth="3"
                        style={{
                          filter: 'drop-shadow(0 10px 30px rgba(249, 115, 22, 0.5))'
                        }}
                      >
                        <path d="m18 6-12 12" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </div>
                  </div>
                )}
                */}
                
                {/* ====================================================================
                    BUMBLE-STYLE FLASH ANIMATIONS - Slide in from screen edges
                    ==================================================================== */}

                <MatchProfileCard
                  profile={{
                    id: currentProfile.id,
                    name: currentProfile.name,
                    age: currentProfile.age,
                    photos: currentProfile.photos,
                    aboutMe: currentProfile.aboutMe,
                    occupation: currentProfile.occupation,
                    city: currentProfile.city,
                    height: currentProfile.height,
                    children: currentProfile.children,
                    religion: currentProfile.religion,
                    prompts: currentProfile.prompts,
                    westernSign: sunSignSystem === "sidereal"
                      ? (currentProfile.siderealWesternSign || currentProfile.westernSign)
                      : (currentProfile.tropicalWesternSign || currentProfile.westernSign),
                    easternSign: currentProfile.easternSign,
                  }}
                  connectionBoxData={compatBoxes[currentProfile.id]}
                  theme={theme}
                  onPhotoChange={(index) => setCurrentPhotoIndex(index)}
                  onMessageClick={handleChat}
                  onPass={handlePass}
                  onLike={handleLike}
                />
                {/* Debug: Show if connection box data is missing */}
                {process.env.NODE_ENV === 'development' && !compatBoxes[currentProfile.id] && (
                  <div className="p-4 text-center text-yellow-500 text-xs bg-yellow-50 dark:bg-yellow-900/20 rounded m-2">
                    ⚠️ Debug: No connection box data for profile ID {currentProfile.id}. 
                    Available IDs: {Object.keys(compatBoxes).length > 0 ? Object.keys(compatBoxes).join(', ') : 'None'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Bumble-Style Flash Animations - Fixed on screen, slide from opposite edges */}
            {showLikeFlash && (() => {
              // Like flash: swiping right, so flash comes from RIGHT edge (opposite side)
              // Animation phases:
              // 0-120px: slide in from right edge
              // 120-180px: hold at max position (shorter hold)
              // 180px+: retreat WITH the card (starts earlier, very fast - 60px range)
              const maxPosition = windowWidth * 0.58
              const iconSize = 128 // w-28 = 7rem = 112px
              const startPosition = windowWidth + iconSize // Start completely off-screen right
              
              let currentX: number
              let opacity: number
              
              if (swipeOffset <= 120) {
                // Phase 1: Slide in (0-120px)
                const progress = Math.max(swipeOffset, 0) / 120
                currentX = startPosition - (progress * (startPosition - maxPosition))
                opacity = progress
              } else if (swipeOffset <= 180) {
                // Phase 2: Hold at max position (120-180px) - shorter
                currentX = maxPosition
                opacity = 1
              } else {
                // Phase 3: Retreat WITH the card (180px+, only 60px range - very fast)
                const retreatProgress = Math.min((swipeOffset - 180) / 60, 1)
                currentX = maxPosition + (retreatProgress * (startPosition - maxPosition))
                opacity = 1 - retreatProgress
              }
              
              return (
                <div 
                  className="fixed z-50 pointer-events-none"
                  style={{
                    top: '25%',
                    left: 0,
                    transform: `translateX(${currentX}px)`,
                    transition: isAnimating ? 'transform 0.7s ease-out, opacity 0.7s ease-out' : 'none',
                    opacity: opacity * 0.7,
                  }}
                >
                  <svg 
                    className="w-28 h-28" 
                    viewBox="0 0 24 24" 
                    fill="rgba(249, 115, 22, 0.55)"
                    style={{
                      filter: 'drop-shadow(0 8px 28px rgba(249, 115, 22, 0.25)) blur(0.6px)',
                    }}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              )
            })()}
            
            {showPassFlash && (() => {
              // Pass flash: swiping left, so flash comes from LEFT edge (opposite side)
              // Animation phases:
              // 0-120px: slide in from left edge
              // 120-180px: hold at max position (shorter hold)
              // 180px+: retreat WITH the card (starts earlier, very fast - 60px range)
              const maxPosition = windowWidth * 0.12
              const iconSize = 128
              const startPosition = -iconSize // Start completely off-screen left
              
              let currentX: number
              let opacity: number
              
              if (swipeOffset >= -120) {
                // Phase 1: Slide in (0 to -120px)
                const progress = Math.max(-swipeOffset, 0) / 120
                currentX = startPosition + (progress * (maxPosition - startPosition))
                opacity = progress
              } else if (swipeOffset >= -180) {
                // Phase 2: Hold at max position (-120 to -180px) - shorter
                currentX = maxPosition
                opacity = 1
              } else {
                // Phase 3: Retreat WITH the card (-180px and beyond, only 60px range - very fast)
                const retreatProgress = Math.min((-swipeOffset - 180) / 60, 1)
                currentX = maxPosition - (retreatProgress * (maxPosition - startPosition))
                opacity = 1 - retreatProgress
              }
              
              return (
                <div 
                  className="fixed z-50 pointer-events-none"
                  style={{
                    top: '25%',
                    left: 0,
                    transform: `translateX(${currentX}px)`,
                    transition: isAnimating ? 'transform 0.7s ease-out, opacity 0.7s ease-out' : 'none',
                    opacity: opacity * 0.7,
                  }}
                >
                  <svg 
                    className="w-32 h-32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="rgba(249, 115, 22, 0.55)" 
                    strokeWidth="3"
                    style={{
                      filter: 'drop-shadow(0 8px 28px rgba(249, 115, 22, 0.25)) blur(0.6px)',
                    }}
                  >
                    <path d="m18 6-12 12" />
                    <path d="m6 6 12 12" />
                  </svg>
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="px-4 py-8 text-center">
            <p className={`text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              No profiles match your filters
            </p>
            <button
              onClick={() => {
                setSearchFilters({ westernSign: '', easternSign: '' })
                          setMatchTierFilters({ Soulmate: false, "Twin Flame": false, Excellent: false, Favourable: false })
              }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 hover:from-orange-500 hover:via-orange-400 hover:to-red-400 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}


      </div>
      
      {/* Match Modal - "It's a Match!" */}
      {showMatchModal && matchedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 animate-in fade-in duration-300">
          <div className="text-center px-8 max-w-md">
            <div className="mb-8 animate-in zoom-in duration-500">
              <h1 className="text-6xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                It's a Match!
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6">
                You and {matchedProfile.name} like each other!
              </p>
            </div>
            
            <div className="flex gap-4 mb-6 justify-center animate-in slide-in-from-bottom duration-500 delay-200">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 shadow-lg">
                <img 
                  src={matchedProfile.photos[0] || "/placeholder.svg"} 
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3 animate-in slide-in-from-bottom duration-500 delay-300">
              <button
                onClick={() => {
                  setShowMatchModal(false)
                  if (matchConversationId) {
                    router.push(`/messages/${matchConversationId}`)
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg font-semibold rounded-2xl transition-all transform hover:scale-105"
              >
                Send Message
              </button>
              <button
                onClick={() => setShowMatchModal(false)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-2xl transition-all backdrop-blur-sm"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] animate-in slide-in-from-top duration-300">
          <div className={`px-6 py-3 rounded-full shadow-lg backdrop-blur-md ${
            toast.type === 'match' 
              ? 'bg-gradient-to-r from-pink-500/90 to-purple-500/90' 
              : 'bg-black/80'
          }`}>
            <p className="text-white font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

