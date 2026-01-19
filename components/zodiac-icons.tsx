// Traditional Zodiac Glyphs - Clean Original Versions

// Western Zodiac Icons - Classic Astrological Symbols
export const AriesIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♈ - Ram's horns */}
    <path d="M50 75 L50 35 M35 35 Q35 25 40 20 Q45 15 50 20 M65 35 Q65 25 60 20 Q55 15 50 20" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const TaurusIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♉ - Bull's head */}
    <circle cx="50" cy="60" r="20" stroke="currentColor" strokeWidth="5"/>
    <path d="M25 35 Q25 25 35 25 Q42 25 47 32 M75 35 Q75 25 65 25 Q58 25 53 32" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const GeminiIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♊ - Roman numeral II */}
    <line x1="37" y1="25" x2="37" y2="75" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <line x1="63" y1="25" x2="63" y2="75" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <line x1="25" y1="35" x2="75" y2="35" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <line x1="25" y1="65" x2="75" y2="65" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const CancerIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♋ - Crab claws (69 shape) */}
    <circle cx="65" cy="35" r="10" stroke="currentColor" strokeWidth="5"/>
    <path d="M65 45 Q60 50 50 50 Q40 50 35 55 Q30 60 30 68" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="30" cy="68" r="7" stroke="currentColor" strokeWidth="5"/>
    <circle cx="35" cy="65" r="10" stroke="currentColor" strokeWidth="5"/>
    <path d="M35 55 Q40 50 50 50 Q60 50 65 45 Q70 40 70 32" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const LeoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♌ - Lion's mane and tail */}
    <circle cx="35" cy="45" r="15" stroke="currentColor" strokeWidth="5"/>
    <path d="M50 45 Q60 40 70 50 Q75 60 70 70 Q60 75 50 70" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const VirgoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♍ - Maiden (stylized M with loop) */}
    <path d="M20 75 L20 30 Q20 22 27 22 Q32 22 32 30 L32 75 M32 30 Q32 22 39 22 Q44 22 44 30 L44 75 M44 30 Q44 22 51 22 Q56 22 56 30 L56 65 Q56 75 65 75 Q72 75 75 70" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const LibraIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♎ - Scales */}
    <line x1="25" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <line x1="25" y1="70" x2="75" y2="70" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <path d="M30 40 Q30 30 50 30 Q70 30 70 40 Q70 50 50 55" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const ScorpioIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♏ - Scorpion with stinger tail */}
    <path d="M20 75 L20 30 Q20 22 27 22 Q32 22 32 30 L32 75 M32 30 Q32 22 39 22 Q44 22 44 30 L44 75 M44 30 Q44 22 51 22 Q56 22 56 30 L56 60 Q65 50 75 55 L82 50 M75 55 L80 60" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const SagittariusIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♐ - Arrow */}
    <line x1="25" y1="75" x2="75" y2="25" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <polyline points="55,25 75,25 75,45" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="35" y1="55" x2="45" y2="45" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const CapricornIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♑ - Goat with fish tail */}
    <path d="M25 80 L25 45 Q25 28 45 28 Q60 28 60 43 L60 58 Q68 53 73 60 Q76 67 70 72 Q64 77 58 72" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const AquariusIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♒ - Water waves */}
    <path d="M20 38 Q30 30 40 38 Q50 46 60 38 Q70 30 80 38" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <path d="M20 58 Q30 50 40 58 Q50 66 60 58 Q70 50 80 58" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

export const PiscesIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ♓ - Two fish */}
    <path d="M30 30 Q22 40 22 50 Q22 60 30 70 Q40 80 55 70 Q63 60 63 50 Q63 40 55 30" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <path d="M70 30 Q78 40 78 50 Q78 60 70 70 Q60 80 45 70 Q37 60 37 50 Q37 40 45 30" 
      stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
    <line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
  </svg>
)

// Chinese Zodiac Icons - Traditional Animal Representations
export const RatIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 鼠 - Rat/Mouse */}
    <ellipse cx="50" cy="58" rx="22" ry="18" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="50" cy="38" r="14" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="45" cy="36" r="2.5" fill="currentColor"/>
    <circle cx="55" cy="36" r="2.5" fill="currentColor"/>
    <ellipse cx="32" cy="32" rx="7" ry="11" stroke="currentColor" strokeWidth="4"/>
    <ellipse cx="68" cy="32" rx="7" ry="11" stroke="currentColor" strokeWidth="4"/>
    <ellipse cx="50" cy="40" rx="3" ry="2" fill="currentColor"/>
    <path d="M68 72 Q78 82 84 88" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
)

export const OxIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 牛 - Ox/Bull */}
    <ellipse cx="50" cy="58" rx="24" ry="20" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="50" cy="36" r="16" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="44" cy="34" r="2.5" fill="currentColor"/>
    <circle cx="56" cy="34" r="2.5" fill="currentColor"/>
    <path d="M36 26 Q30 16 25 19 M64 26 Q70 16 75 19" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
    <ellipse cx="50" cy="41" rx="5" ry="4" stroke="currentColor" strokeWidth="3.5"/>
    <circle cx="47" cy="41" r="1.8" fill="currentColor"/>
    <circle cx="53" cy="41" r="1.8" fill="currentColor"/>
  </svg>
)

export const TigerIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 虎 - Tiger */}
    <ellipse cx="50" cy="56" rx="26" ry="22" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="50" cy="36" r="18" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="43" cy="34" r="3" fill="currentColor"/>
    <circle cx="57" cy="34" r="3" fill="currentColor"/>
    <path d="M34 24 L29 12 M42 22 L37 10 M58 22 L63 10 M66 24 L71 12" 
      stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="50" cy="42" rx="4" ry="2.5" stroke="currentColor" strokeWidth="3"/>
    <path d="M36 46 L40 50 M64 46 L60 50" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

export const RabbitIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 兔 - Rabbit */}
    <ellipse cx="50" cy="60" rx="20" ry="18" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="50" cy="42" r="14" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="45" cy="40" r="2" fill="currentColor"/>
    <circle cx="55" cy="40" r="2" fill="currentColor"/>
    <ellipse cx="39" cy="18" rx="5" ry="16" stroke="currentColor" strokeWidth="4.5"/>
    <ellipse cx="61" cy="18" rx="5" ry="16" stroke="currentColor" strokeWidth="4.5"/>
    <path d="M50 46 L50 50 M47 50 L53 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
)

export const DragonIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 龍 - Dragon */}
    <path d="M22 54 Q32 36 50 42 Q68 48 78 38" 
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="44" cy="48" r="3" fill="currentColor"/>
    <circle cx="56" cy="48" r="3" fill="currentColor"/>
    <path d="M36 40 L31 30 M42 38 L37 28 M58 38 L63 28 M64 40 L69 30" 
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M46 56 Q50 60 54 56" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

export const SnakeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 蛇 - Snake */}
    <path d="M18 32 Q30 22 42 32 Q54 42 66 32 Q78 42 74 54 Q70 66 58 62 Q46 58 40 68" 
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
    <ellipse cx="16" cy="32" rx="9" ry="7" stroke="currentColor" strokeWidth="4"/>
    <circle cx="13" cy="30" r="2" fill="currentColor"/>
    <circle cx="19" cy="30" r="2" fill="currentColor"/>
  </svg>
)

export const HorseIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 馬 - Horse */}
    <ellipse cx="50" cy="60" rx="24" ry="22" stroke="currentColor" strokeWidth="4.5"/>
    <ellipse cx="50" cy="36" rx="18" ry="16" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="44" cy="34" r="2.5" fill="currentColor"/>
    <circle cx="56" cy="34" r="2.5" fill="currentColor"/>
    <path d="M38 23 Q32 13 28 17 M62 23 Q68 13 72 17" 
      stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M44 18 Q40 10 36 14 M56 18 Q60 10 64 14" 
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <ellipse cx="50" cy="42" rx="4" ry="2.5" stroke="currentColor" strokeWidth="3"/>
  </svg>
)

export const GoatIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 羊 - Goat/Sheep */}
    <ellipse cx="50" cy="58" rx="22" ry="20" stroke="currentColor" strokeWidth="4.5"/>
    <ellipse cx="50" cy="38" rx="16" ry="14" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="44" cy="36" r="2" fill="currentColor"/>
    <circle cx="56" cy="36" r="2" fill="currentColor"/>
    <path d="M38 28 Q32 18 28 22 Q32 26 38 28 M62 28 Q68 18 72 22 Q68 26 62 28" 
      stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="50" cy="43" rx="3.5" ry="2.5" stroke="currentColor" strokeWidth="2.5"/>
  </svg>
)

export const MonkeyIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 猴 - Monkey */}
    <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="43" cy="46" r="3" fill="currentColor"/>
    <circle cx="57" cy="46" r="3" fill="currentColor"/>
    <ellipse cx="50" cy="53" rx="5" ry="3.5" stroke="currentColor" strokeWidth="3"/>
    <path d="M42 60 Q50 66 58 60" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <circle cx="28" cy="46" r="9" stroke="currentColor" strokeWidth="4"/>
    <circle cx="72" cy="46" r="9" stroke="currentColor" strokeWidth="4"/>
  </svg>
)

export const RoosterIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 鷄 - Rooster */}
    <ellipse cx="50" cy="54" rx="20" ry="24" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="50" cy="32" r="12" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="46" cy="30" r="2" fill="currentColor"/>
    <circle cx="54" cy="30" r="2" fill="currentColor"/>
    <path d="M44 22 Q40 14 36 17 Q40 19 44 22 M56 22 Q60 14 64 17 Q60 19 56 22" 
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M50 36 L50 40 M47 40 L53 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <line x1="42" y1="78" x2="42" y2="84" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="50" y1="80" x2="50" y2="86" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="58" y1="78" x2="58" y2="84" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

export const DogIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 犬 - Dog */}
    <ellipse cx="50" cy="60" rx="24" ry="20" stroke="currentColor" strokeWidth="4.5"/>
    <ellipse cx="50" cy="38" rx="18" ry="16" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="44" cy="36" r="2.5" fill="currentColor"/>
    <circle cx="56" cy="36" r="2.5" fill="currentColor"/>
    <path d="M34 30 Q28 24 26 30 Q28 36 32 38 M66 30 Q72 24 74 30 Q72 36 68 38" 
      stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="50" cy="43" rx="4" ry="3" stroke="currentColor" strokeWidth="3"/>
    <path d="M50 46 L50 50 M43 53 Q50 59 57 53" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

export const PigIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 豬 - Pig */}
    <ellipse cx="50" cy="58" rx="26" ry="22" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="50" cy="36" r="16" stroke="currentColor" strokeWidth="4.5"/>
    <circle cx="43" cy="34" r="2.5" fill="currentColor"/>
    <circle cx="57" cy="34" r="2.5" fill="currentColor"/>
    <ellipse cx="50" cy="42" rx="7" ry="6" stroke="currentColor" strokeWidth="4"/>
    <circle cx="46" cy="42" r="2.2" fill="currentColor"/>
    <circle cx="54" cy="42" r="2.2" fill="currentColor"/>
    <path d="M42 52 Q50 58 58 52" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
)

// Mapping objects for easy access
export const westernZodiacIcons = {
  aries: AriesIcon,
  taurus: TaurusIcon,
  gemini: GeminiIcon,
  cancer: CancerIcon,
  leo: LeoIcon,
  virgo: VirgoIcon,
  libra: LibraIcon,
  scorpio: ScorpioIcon,
  sagittarius: SagittariusIcon,
  capricorn: CapricornIcon,
  aquarius: AquariusIcon,
  pisces: PiscesIcon,
}

export const chineseZodiacIcons = {
  rat: RatIcon,
  ox: OxIcon,
  tiger: TigerIcon,
  rabbit: RabbitIcon,
  dragon: DragonIcon,
  snake: SnakeIcon,
  horse: HorseIcon,
  goat: GoatIcon,
  monkey: MonkeyIcon,
  rooster: RoosterIcon,
  dog: DogIcon,
  pig: PigIcon,
}
