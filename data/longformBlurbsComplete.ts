// /data/longformBlurbsComplete.ts
// Complete longform compatibility content for all tiers of the 10 reference anchor pairs
// This file contains the full reference system: Soulmate, Twin, Excellent, Good, Learning, and Challenging

export type TierKey = 'soulmate' | 'twin' | 'excellent' | 'good' | 'learning' | 'challenging';

export interface CompleteLongformBlurb {
  tier: TierKey;
  score: number;
  sign_line?: string;
  headline: string;
  body: string;
  east_label: string;
  east_text: string;
  west_label: string;
  west_text: string;
}

// Store all tier variations for each pair
export const COMPLETE_LONGFORM_BLURBS: Record<string, CompleteLongformBlurb> = {
  // ========== SOULMATE TIER (90-100%) ==========
  
  "aquarius_monkey|aquarius_monkey__soulmate": {
    tier: "soulmate",
    score: 100,
    sign_line: "Aquarius / Monkey × Aquarius / Monkey",
    headline: "Perfect Harmony",
    body: "Two inventive souls move in identical rhythm. Conversation flows freely, laughter feels natural, and the bond seems to breathe on its own. It's a meeting of equals who understand one another before words are spoken.",
    east_label: "Monkey × Monkey (Same Sign Visionaries)",
    east_text: "Shared curiosity and effortless timing create instant rapport. Your playful energy and quick adaptability make every moment together feel both exciting and natural.",
    west_label: "Aquarius × Aquarius — Same Element: Air × Air",
    west_text: "A bright, electric harmony of minds. You both think in similar patterns, valuing freedom, innovation, and intellectual connection above all else."
  },

  "aquarius_monkey|gemini_rat__soulmate": {
    tier: "soulmate",
    score: 100,
    sign_line: "Aquarius / Monkey × Gemini / Rat",
    headline: "Perfect Harmony",
    body: "An effortless meeting of wit and wonder. Aquarius brings vision; Gemini brings movement. Ideas come alive and laughter rarely fades—a natural fit between bright minds.",
    east_label: "Monkey × Rat (Same Trine Visionaries)",
    east_text: "Inventive minds that think and dream alike. Your shared vision and quick adaptability create a dynamic partnership that thrives on innovation and opportunity.",
    west_label: "Aquarius × Gemini (Air × Air)",
    west_text: "A quick, sparkling exchange of thought. You both value intellectual freedom and mental stimulation, making conversation your natural connection point."
  },

  "leo_dragon|sagittarius_tiger": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Courage meets adventure. Leo–Dragon brings presence and power; Sagittarius–Tiger adds optimism and faith in the future. You fuel each other's fire, laughing through challenges and chasing new horizons together. The chemistry feels warm, creative, and motivating.",
    east_label: "Dragon × Tiger — Cross Trine (Visionary meets Adventurer)",
    east_text: "Strong-willed, daring spirits with matching ambition. Align your priorities to stay united and channel your powerful energy toward shared goals.",
    west_label: "Leo × Sagittarius — Fire × Fire",
    west_text: "Dynamic and bright, you both radiate confidence and enthusiasm. Rest together to keep passion steady and prevent burnout from your high energy."
  },

  "libra_dragon|pisces_dragon": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Fairness and empathy define this match. Libra creates harmony through balance and beauty; Pisces deepens it with compassion and imagination. With two Dragons, ambition blends with grace, giving your relationship both drive and tenderness.",
    east_label: "Dragon × Dragon — Same Sign (Visionaries)",
    east_text: "Loyal and proud, you both share a powerful drive for success. Share leadership with generosity to avoid competition and build a united front.",
    west_label: "Libra × Pisces — Air × Water (supportive)",
    west_text: "Dreams meet diplomacy in this harmonious blend. Sensitivity guides your decision-making, creating a relationship built on empathy and balance."
  },

  "capricorn_ox|virgo_snake": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Purposeful and composed. Capricorn–Ox provides endurance; Virgo–Snake adds precision and insight. Together you craft a stable, intelligent relationship built on quiet strength and mutual respect. Small details become acts of devotion.",
    east_label: "Ox × Snake — Same Trine (Strategists)",
    east_text: "Wise planners who achieve through patience and careful strategy. Celebrate progress, not just goals, to maintain motivation and appreciation for your journey.",
    west_label: "Capricorn × Virgo — Earth × Earth",
    west_text: "Shared discipline and reliability form the foundation of your bond. Affection grows through constancy and the quiet strength you both bring to the relationship."
  },

  "taurus_rabbit|cancer_sheep": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "A gentle, nurturing union. Taurus–Rabbit brings loyalty and calm; Cancer–Sheep brings sensitivity and warmth. You create a peaceful rhythm where affection feels natural and trust builds easily. Comfort never dulls the bond — it strengthens it.",
    east_label: "Rabbit × Sheep — Same Trine (Artists)",
    east_text: "Graceful and empathetic, you both value beauty and harmony. Communicate openly during mood shifts to maintain the gentle understanding that defines your connection.",
    west_label: "Taurus × Cancer — Earth × Water (supportive)",
    west_text: "Emotional security and shared values sustain your love. You create a nurturing environment where both partners feel safe to express their feelings and needs."
  },

  "scorpio_dragon|aquarius_monkey": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Intensity meets ingenuity. Scorpio–Dragon is passionate and magnetic; Aquarius–Monkey is inventive and expressive. You inspire each other to evolve — one with depth, the other with vision. It's a fusion of power and originality.",
    east_label: "Dragon × Monkey — Same Trine (Visionaries)",
    east_text: "Charisma and creativity align in this powerful partnership. Keep ego in service of shared goals to maximize your combined potential and avoid unnecessary competition.",
    west_label: "Scorpio × Aquarius — Fixed signs (contrast)",
    west_text: "You operate at different speeds, with Scorpio's intensity meeting Aquarius's detachment. Understanding each other's methods keeps harmony and prevents misunderstandings."
  },

  "aries_rat|leo_monkey": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Two fire-starters who thrive on energy and challenge. Aries–Rat charges forward; Leo–Monkey amplifies and sustains. You motivate one another toward bold, joyful experiences. Together, you turn ideas into action and tension into momentum.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Ambitious and clever, you both see opportunities where others see obstacles. Cooperation magnifies your success and turns individual strengths into collective achievement.",
    west_label: "Aries × Leo — Fire × Fire",
    west_text: "Exciting and devoted, your shared fire element creates passionate chemistry. Humor keeps passion light and prevents intensity from becoming overwhelming."
  },

  "gemini_rat|libra_monkey": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Playful and curious, this pairing blends social charm with intelligence. Gemini–Rat imagines, Libra–Monkey refines. You bring out the best in each other's wit and style, forming a partnership that stays interesting for years.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Fast, adaptive thinkers who thrive on change and innovation. Pacing creates longevity, so remember to slow down and appreciate the moments between achievements.",
    west_label: "Gemini × Libra — Air × Air",
    west_text: "Fluid connection flows naturally between your air signs. Honesty deepens understanding and prevents the superficial charm from masking real feelings."
  },

  "pisces_pig|scorpio_snake": {
    tier: "soulmate",
    score: 100,
    headline: "Perfect Harmony",
    body: "Compassion meets strategy. Pisces–Pig offers tenderness and empathy; Scorpio–Snake brings depth and protection. You build emotional security through trust, forgiveness, and shared intuition.",
    east_label: "Pig × Snake — Cross Trine (Artist meets Strategist)",
    east_text: "Sensitivity and wisdom intertwine in this thoughtful pairing. Openness sustains trust and allows both partners to feel truly seen and understood.",
    west_label: "Pisces × Scorpio — Water × Water",
    west_text: "Profound empathy runs deep between your water signs. Independence keeps balance and prevents emotional enmeshment from overwhelming your individual identities."
  },

  // ========== TWIN FLAME TIER (85-89%) ==========

  "aquarius_monkey|gemini_rat__twin": {
    tier: "twin",
    score: 90,
    headline: "Magnetic Synergy",
    body: "Instant recognition and quick chemistry. Ideas ignite fast and spark constant innovation. When collaboration wins over competition, potential becomes momentum.",
    east_label: "Monkey × Rat — Same Trine (Visionaries)",
    east_text: "You share momentum and optimism, creating an exciting dynamic partnership. Slow down to build depth and ensure your connection grows beyond surface-level excitement.",
    west_label: "Aquarius × Gemini — Air × Air",
    west_text: "Connection thrives on curiosity and intellectual stimulation between your air signs. Make space for emotional stillness to balance mental activity with heartfelt moments."
  },

  "leo_dragon|sagittarius_tiger__twin": {
    tier: "twin",
    score: 91,
    headline: "Magnetic Synergy",
    body: "Two bright fires. You amplify each other's confidence and zest for life. Temper pride with humility and your energy becomes creative instead of combustible.",
    east_label: "Dragon × Tiger — Cross Trine (Visionary meets Adventurer)",
    east_text: "Fearless and driven, you both possess incredible determination and courage. Direct passion into a joint mission to channel your powerful energy constructively.",
    west_label: "Leo × Sagittarius — Fire × Fire",
    west_text: "Shared optimism fuels progress and keeps your relationship vibrant. Rest to prevent burnout and maintain the enthusiasm that drew you together."
  },

  "libra_dragon|pisces_dragon__twin": {
    tier: "twin",
    score: 90,
    sign_line: "Libra / Dragon × Pisces / Dragon",
    headline: "Magnetic Synergy",
    body: "A bond defined by elegance and emotion. Libra steadies the current while Pisces deepens it, both wrapped in the Dragon's intensity. Style and feeling move as one.",
    east_label: "Dragon × Dragon (Same Sign Visionaries)",
    east_text: "Two proud hearts mirroring ambition and drive for excellence. Your shared determination creates a powerful bond, but remember to support rather than compete.",
    west_label: "Libra × Pisces (Air × Water)",
    west_text: "Gentle currents that merge intellect and empathy in perfect harmony. Your complementary elements create a balanced relationship where logic meets feeling."
  },

  "capricorn_ox|virgo_snake__twin": {
    tier: "twin",
    score: 88,
    headline: "Magnetic Synergy",
    body: "Precision meets patience. Capricorn brings direction; Virgo ensures mastery in the details. Quiet admiration and dependable progress define the bond.",
    east_label: "Ox × Snake — Same Trine (Strategists)",
    east_text: "Clever planning and long-range trust form the foundation of your partnership. Celebrate small wins along the way to maintain motivation and appreciation.",
    west_label: "Capricorn × Virgo — Earth × Earth",
    west_text: "Strong routines provide stability and security in your relationship. Invite change to keep growth dynamic and prevent your bond from becoming stagnant."
  },

  "taurus_rabbit|cancer_sheep__twin": {
    tier: "twin",
    score: 90,
    headline: "Magnetic Synergy",
    body: "Tender hearts with steady rhythm. Taurus grounds; Cancer nurtures. Comfort is natural — just keep curiosity alive.",
    east_label: "Rabbit × Sheep — Same Trine (Artists)",
    east_text: "Mutual grace and gentleness create a peaceful, harmonious connection. Encourage open honesty to ensure your gentle nature doesn't lead to avoiding difficult conversations.",
    west_label: "Taurus × Cancer — Earth × Water (supportive)",
    west_text: "Security and care blend well in this nurturing partnership. Add shared adventures to keep your relationship exciting and prevent comfort from turning into complacency."
  },

  "scorpio_dragon|aquarius_monkey__twin": {
    tier: "twin",
    score: 90,
    sign_line: "Scorpio / Dragon × Aquarius / Monkey",
    headline: "Magnetic Synergy",
    body: "Intensity meets invention in a bond that never stands still. Scorpio's depth fuses with Aquarius's originality, forming a chemistry that challenges and excites. It feels fated—two strong forces transforming through each other.",
    east_label: "Dragon × Monkey (Same Trine Visionaries)",
    east_text: "Passionate creators drawn to shared purpose and ambitious goals. Your combined creativity and drive make you a formidable team when aligned.",
    west_label: "Scorpio × Aquarius (Fixed Signs Contrast)",
    west_text: "Tension that turns into power when channeled correctly. Your contrasting fixed signs create magnetic attraction through your differences."
  },

  "aries_rat|leo_monkey__twin": {
    tier: "twin",
    score: 89,
    headline: "Magnetic Synergy",
    body: "Confidence recognizes confidence. Initiative meets flair. Learn to listen as much as you lead and this becomes a partnership in motion.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Fast-moving and optimistic, you both thrive on momentum and opportunity. Channel competition into shared progress to maximize your combined potential.",
    west_label: "Aries × Leo — Fire × Fire",
    west_text: "Courageous spirits with matching confidence and drive. Balance independence with cooperation to create a partnership that honors both your individual strengths."
  },

  "gemini_rat|libra_monkey__twin": {
    tier: "twin",
    score: 90,
    headline: "Magnetic Synergy",
    body: "Conversation and charm rule. Connection flows easily — the key is turning fascination into commitment.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Brilliant together, your combined intelligence and creativity are impressive. Stay grounded in shared goals to ensure your partnership moves forward purposefully.",
    west_label: "Gemini × Libra — Air × Air",
    west_text: "Communication is your gift, making conversation effortless and engaging. Decisions need deadlines to prevent endless discussion from delaying action."
  },

  "pisces_pig|scorpio_snake__twin": {
    tier: "twin",
    score: 88,
    headline: "Magnetic Synergy",
    body: "Emotional depth meets intuitive understanding. There's a private, loyal bond when trust is earned.",
    east_label: "Pig × Snake — Cross Trine (Artist meets Strategist)",
    east_text: "Kindness and insight balance each other beautifully in this thoughtful pairing. Be open when moods shift to maintain understanding and connection.",
    west_label: "Pisces × Scorpio — Water × Water",
    west_text: "Emotional fluency runs deep between your water signs, creating intense understanding. Maintain boundaries to stay balanced and prevent emotional overwhelm."
  },

  "aquarius_monkey|aquarius_monkey__twin": {
    tier: "twin",
    score: 89,
    headline: "Magnetic Synergy",
    body: "Two originals mirror each other's brilliance and restlessness. Avoid detachment by grounding ideals in shared action.",
    east_label: "Monkey × Monkey — Same Sign (Visionaries)",
    east_text: "Vibrant, witty, and inventive, you both share an energetic and creative spirit. Give each other space to recharge and maintain your individual identities.",
    west_label: "Aquarius × Aquarius — Same Element: Air × Air",
    west_text: "Shared rhythm of ideas creates natural intellectual harmony between you. Stay emotionally present to balance mental connection with heartfelt intimacy."
  },

  // ========== EXCELLENT TIER (70-84%) ==========
  
  "aquarius_monkey|gemini_rat__excellent": {
    tier: "excellent",
    score: 82,
    headline: "Kindred Spirits",
    body: "An animated, innovative match. Aquarius inspires with vision; Gemini keeps things flexible. Excitement lasts when ideas become shared action.",
    east_label: "Monkey × Rat — Same Trine (Visionaries)",
    east_text: "Creative and opportunistic, you both excel at spotting and seizing opportunities. Keep teamwork focused on outcomes to ensure your ideas translate into tangible results.",
    west_label: "Aquarius × Gemini — Air × Air",
    west_text: "Light, social, and mentally in sync, your air element connection is naturally harmonious. Balance thought with emotion to add depth to your intellectual rapport."
  },

  "leo_dragon|sagittarius_tiger__excellent": {
    tier: "excellent",
    score: 82,
    sign_line: "Leo / Dragon × Sagittarius / Tiger",
    headline: "Dynamic Allies",
    body: "This union blazes with vitality and mutual admiration. Both love big moments, grand gestures, and fearless honesty. Together you radiate confidence—the kind of pair that inspires others to live louder.",
    east_label: "Dragon × Tiger (Cross Trine: Visionary meets Adventurer)",
    east_text: "A dazzling mix of drive and daring creates an exciting, dynamic partnership. Your combined ambition and courage make you a powerful team when aligned.",
    west_label: "Leo × Sagittarius (Fire × Fire)",
    west_text: "Warmth that glows brighter together through your shared fire element. Your mutual enthusiasm and optimism create a vibrant, inspiring connection."
  },

  "libra_dragon|pisces_dragon__excellent": {
    tier: "excellent",
    score: 80,
    headline: "Balanced Devotion",
    body: "Libra brings harmony, Pisces brings depth. With two Dragons, standards are high. Empathy and fairness turn this into steady affection.",
    east_label: "Dragon × Dragon — Same Sign (Visionaries)",
    east_text: "Mutual drive and pride create a strong foundation for your partnership. Keep compassion front and center to ensure your ambition doesn't overshadow your connection.",
    west_label: "Libra × Pisces — Air × Water (supportive)",
    west_text: "Intellect guided by intuition creates a balanced approach to decision-making. Patience builds trust and allows your complementary elements to harmonize naturally."
  },

  "capricorn_ox|virgo_snake__excellent": {
    tier: "excellent",
    score: 81,
    headline: "Steady Understanding",
    body: "Practical, grounded, discerning. Capricorn builds; Virgo refines. Warmth grows through appreciation more than dramatics.",
    east_label: "Ox × Snake — Same Trine (Strategists)",
    east_text: "Reliable rhythm and wise cooperation form the backbone of your stable partnership. Celebrate progress to maintain motivation and appreciation for your steady growth.",
    west_label: "Capricorn × Virgo — Earth × Earth",
    west_text: "Loyal and secure, your earth element connection provides deep stability. Loosen routines occasionally to keep your relationship fresh and prevent predictability."
  },

  "taurus_rabbit|cancer_sheep__excellent": {
    tier: "excellent",
    score: 83,
    sign_line: "Taurus / Rabbit × Cancer / Sheep",
    headline: "Quiet Harmony",
    body: "A soft and comforting union that feels like home. Taurus provides calm structure; Cancer adds emotional warmth. Tenderness lives in the small, thoughtful moments.",
    east_label: "Rabbit × Sheep (Same Trine Artists)",
    east_text: "A union of grace and sensitivity creates a gentle, harmonious connection. Your shared appreciation for beauty and peace makes your relationship naturally nurturing.",
    west_label: "Taurus × Cancer (Earth × Water)",
    west_text: "Grounded devotion with emotional depth forms a secure, caring partnership. Your complementary elements create stability while maintaining heartfelt intimacy."
  },

  "scorpio_dragon|aquarius_monkey__excellent": {
    tier: "excellent",
    score: 80,
    headline: "Inspired Collaboration",
    body: "Focus meets originality. Fascination can become friction without respect for differences. Aligned purpose makes you unstoppable.",
    east_label: "Dragon × Monkey — Same Trine (Visionaries)",
    east_text: "Inventive and strong-minded, you both bring powerful creativity and determination. Unity brings success when you align your individual strengths toward common goals.",
    west_label: "Scorpio × Aquarius — Fixed signs (contrast)",
    west_text: "Different tempos create both challenge and attraction in your fixed sign pairing. Patience builds understanding and helps you appreciate each other's unique approach."
  },

  "aries_rat|leo_monkey__excellent": {
    tier: "excellent",
    score: 83,
    headline: "Energetic Companions",
    body: "Charisma meets drive. Aries initiates; Leo sustains. The spark is undeniable — listening keeps it lasting.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Ambitious and future-focused, you both share a drive for achievement and progress. Stay collaborative, not competitive, to maximize your combined potential.",
    west_label: "Aries × Leo — Fire × Fire",
    west_text: "Passionate and proud, your shared fire element creates intense chemistry and mutual admiration. Humor smooths rough edges and keeps your connection lighthearted."
  },

  "gemini_rat|libra_monkey__excellent": {
    tier: "excellent",
    score: 81,
    headline: "Effortless Rapport",
    body: "Easy communication and social grace. You thrive when shared projects or travel keep life interesting.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Quick-thinking and adaptable, you both excel at navigating change and opportunity. Keep commitments steady to build trust and reliability in your partnership.",
    west_label: "Gemini × Libra — Air × Air",
    west_text: "Mental flow and balance come naturally between your air signs. Clarity prevents indecision and helps you move from discussion to action together."
  },

  "pisces_pig|scorpio_snake__excellent": {
    tier: "excellent",
    score: 82,
    headline: "Emotional Symmetry",
    body: "Pisces feels deeply; Scorpio sees deeply. Sensitivity meets strategy — strengthened by honest communication.",
    east_label: "Pig × Snake — Cross Trine (Artist meets Strategist)",
    east_text: "Empathy joined with insight creates a thoughtful, understanding connection. Openness dissolves tension and allows both partners to feel truly heard.",
    west_label: "Pisces × Scorpio — Water × Water",
    west_text: "Shared depth runs profound between your water signs, creating intense emotional understanding. Boundaries preserve balance and prevent overwhelming enmeshment."
  },

  "aquarius_monkey|aquarius_monkey__excellent": {
    tier: "excellent",
    score: 82,
    headline: "Reflective Partners",
    body: "A mirror-like connection — bright and unconventional. Balance ideas with grounded emotion and shared goals. Give each other space to recharge, then regroup with intention so curiosity turns into shared progress.",
    east_label: "Monkey × Monkey — Same Sign (Visionaries)",
    east_text: "Witty, versatile, and restless, you both share an energetic and curious nature. Direct energy into shared purpose to channel your restlessness constructively.",
    west_label: "Aquarius × Aquarius — Same Element: Air × Air",
    west_text: "Clever minds connect naturally through your shared air element. Empathy keeps things real and prevents intellectual connection from replacing emotional intimacy."
  },

  // ========== GOOD TIER (55-69%) ==========

  "aquarius_monkey|gemini_rat__good": {
    tier: "good",
    score: 68,
    headline: "Cosmic Companions",
    body: "Lively and curious — you share an inventive outlook but may race ahead of practical follow-through. Friendship stays strong when ideas become something real.",
    east_label: "Monkey × Rat — Same Trine (Visionaries)",
    east_text: "Fast thinkers who thrive on momentum and quick decision-making. Pause to listen and ensure you're both moving in the same direction before accelerating.",
    west_label: "Aquarius × Gemini — Air × Air",
    west_text: "Intellectual harmony comes naturally between your air signs. Ground plans before they drift to turn your brilliant ideas into tangible reality."
  },

  "leo_dragon|sagittarius_tiger__good": {
    tier: "good",
    score: 67,
    headline: "Cosmic Companions",
    body: "Two confident spirits with high energy. Patience keeps pride from creating drama.",
    east_label: "Dragon × Tiger — Cross Trine (Visionary meets Adventurer)",
    east_text: "Courage and charisma meet in this powerful, dynamic pairing. Keep egos balanced to prevent competition from overshadowing your connection.",
    west_label: "Leo × Sagittarius — Fire × Fire",
    west_text: "Inspiring but volatile, your shared fire element creates passionate intensity. Laughter restores balance and keeps your relationship from becoming too serious."
  },

  "libra_dragon|pisces_dragon__good": {
    tier: "good",
    score: 66,
    headline: "Cosmic Companions",
    body: "You share kindness and imagination, though one seeks structure while the other drifts. Empathy beats control.",
    east_label: "Dragon × Dragon — Same Sign (Visionaries)",
    east_text: "Strong wills create both strength and potential conflict in your partnership. Lead with respect, not competition, to channel your ambition constructively.",
    west_label: "Libra × Pisces — Air × Water (supportive)",
    west_text: "Gentle blend of intellect and emotion creates a harmonious connection. Clear boundaries keep harmony and prevent your supportive nature from becoming enmeshment."
  },

  "capricorn_ox|virgo_snake__good": {
    tier: "good",
    score: 65,
    headline: "Cosmic Companions",
    body: "Reliable and realistic, you value similar things but risk routine fatigue. Small gestures of warmth keep the spark alive.",
    east_label: "Ox × Snake — Same Trine (Strategists)",
    east_text: "Steady and loyal, you both value reliability and long-term commitment. Loosen schedules occasionally to keep your relationship from becoming too rigid.",
    west_label: "Capricorn × Virgo — Earth × Earth",
    west_text: "Stable by nature, your earth element connection provides deep security. Add play to avoid monotony and keep your practical partnership feeling fresh."
  },

  "taurus_rabbit|cancer_sheep__good": {
    tier: "good",
    score: 69,
    headline: "Cosmic Companions",
    body: "Comfort and care define this match. You nurture each other easily; honest discussion keeps sensitivity from spiraling.",
    east_label: "Rabbit × Sheep — Same Trine (Artists)",
    east_text: "Gentle souls who value peace and harmony in your relationship. Express needs clearly to ensure your gentle nature doesn't lead to unspoken resentment.",
    west_label: "Taurus × Cancer — Earth × Water (supportive)",
    west_text: "Protective bond creates a secure, nurturing environment for both partners. Routine affection strengthens it and maintains the emotional connection you both need."
  },

  "scorpio_dragon|aquarius_monkey__good": {
    tier: "good",
    score: 64,
    headline: "Cosmic Companions",
    body: "Different temperaments create fascination and friction. Growth depends on patience with each other's style.",
    east_label: "Dragon × Monkey — Same Trine (Visionaries)",
    east_text: "Inventive duo with matching creativity and ambition. Unite purpose to stay cohesive and ensure your individual drives support rather than compete.",
    west_label: "Scorpio × Aquarius — Fixed signs (contrast)",
    west_text: "Power-struggle risk exists due to your contrasting fixed sign natures. Flexibility restores flow and helps you appreciate each other's different approaches."
  },

  "aries_rat|leo_monkey__good": {
    tier: "good",
    score: 68,
    sign_line: "Aries / Rat × Leo / Monkey",
    headline: "Cosmic Companions",
    body: "Energetic and expressive, this pair lives out loud. Aries lights the spark; Leo fans it into flame. Drive and playfulness move in tandem.",
    east_label: "Rat × Monkey (Same Trine Visionaries)",
    east_text: "Dynamic minds with fearless enthusiasm create an exciting, fast-paced partnership. Your combined energy and ambition make you a formidable team when aligned.",
    west_label: "Aries × Leo (Fire × Fire)",
    west_text: "Vivid passion that refuses to fade through your shared fire element. Your mutual intensity and confidence create a magnetic, inspiring connection."
  },

  "gemini_rat|libra_monkey__good": {
    tier: "good",
    score: 67,
    sign_line: "Gemini / Rat × Libra / Monkey",
    headline: "Cosmic Companions",
    body: "Light, talkative, and endlessly curious—you understand each other's rhythm. The connection feels playful and bright, like conversation that never quite ends. Beneath the wit lies genuine affection and easy compatibility.",
    east_label: "Rat × Monkey (Same Trine Visionaries)",
    east_text: "Quick thinkers with matching humor and wit create a playful, engaging dynamic. Your shared intelligence and adaptability make conversation effortless.",
    west_label: "Gemini × Libra (Air × Air)",
    west_text: "Breezy rapport that feels effortless through your air element connection. Your natural communication and social grace make your relationship feel light and enjoyable."
  },

  "pisces_pig|scorpio_snake__good": {
    tier: "good",
    score: 66,
    headline: "Cosmic Companions",
    body: "Emotional but supportive. The bond feels deep yet delicate — honesty keeps it balanced.",
    east_label: "Pig × Snake — Cross Trine (Artist meets Strategist)",
    east_text: "Empathy meets insight in this thoughtful, understanding pairing. Speak directly when uncertain to prevent misunderstandings from your different communication styles.",
    west_label: "Pisces × Scorpio — Water × Water",
    west_text: "Emotional trust runs deep between your water signs, creating intense intimacy. Independence maintains flow and prevents your deep connection from becoming overwhelming."
  },

  "aquarius_monkey|aquarius_monkey__good": {
    tier: "good",
    score: 67,
    headline: "Cosmic Companions",
    body: "You mirror each other's quirks and creativity. Shared purpose keeps sameness from dulling growth.",
    east_label: "Monkey × Monkey — Same Sign (Visionaries)",
    east_text: "Energetic minds share a restless, curious nature that keeps life interesting. Routine helps you stay grounded and prevents your restlessness from creating instability.",
    west_label: "Aquarius × Aquarius — Same Element: Air × Air",
    west_text: "Strong mental match creates natural intellectual harmony between you. Emotional effort sustains depth and prevents your connection from remaining purely cerebral."
  },

  // ========== LEARNING TIER (40-54%) ==========

  "aquarius_monkey|gemini_rat__learning": {
    tier: "learning",
    score: 52,
    headline: "Karmic Teachers",
    body: "Chemistry is quick, but so are misunderstandings. Stimulating becomes scattered until shared direction is found.",
    east_label: "Monkey × Rat — Same Trine (Visionaries)",
    east_text: "Lively, clever pairing with matching intelligence and quick thinking. Follow-through keeps trust and ensures your brilliant ideas don't remain just ideas.",
    west_label: "Aquarius × Gemini — Air × Air",
    west_text: "Brilliant but restless, your air element connection thrives on mental stimulation. Emotional grounding needed to balance intellectual activity with heartfelt connection."
  },

  "leo_dragon|sagittarius_tiger__learning": {
    tier: "learning",
    score: 51,
    headline: "Karmic Teachers",
    body: "Adventure and ego wrestle here. Respect softens pride and restores playfulness.",
    east_label: "Dragon × Tiger — Cross Trine (Visionary meets Adventurer)",
    east_text: "Dynamic but headstrong, you both possess strong wills and determination. Teamwork over rivalry ensures your powerful energy supports rather than competes.",
    west_label: "Leo × Sagittarius — Fire × Fire",
    west_text: "Shared passion creates intense chemistry and mutual admiration. Cooling-off time prevents burnout and helps you maintain the enthusiasm that drew you together."
  },

  "libra_dragon|pisces_dragon__learning": {
    tier: "learning",
    score: 50,
    headline: "Karmic Teachers",
    body: "You care deeply but process emotions differently. Less logic, more listening builds trust.",
    east_label: "Dragon × Dragon — Same Sign (Visionaries)",
    east_text: "Pride clashes when both partners want to lead and control. Empathy steadies the balance and helps you support rather than compete with each other.",
    west_label: "Libra × Pisces — Air × Water (supportive)",
    west_text: "Intuition needs clarity to prevent misunderstandings between your different communication styles. Avoid mixed signals by expressing needs directly and honestly."
  },

  "capricorn_ox|virgo_snake__learning": {
    tier: "learning",
    score: 50,
    sign_line: "Capricorn / Ox × Virgo / Snake",
    headline: "Karmic Teachers",
    body: "Quiet, careful, and deliberate, this pair values precision and self-control. The connection deepens slowly, revealing respect and a shared need for order. Two minds crafting something lasting from discipline and subtle devotion.",
    east_label: "Ox × Snake (Same Trine Strategists)",
    east_text: "An alliance built on planning and patience creates a stable, reliable foundation. Your shared strategic approach ensures long-term success when aligned.",
    west_label: "Capricorn × Virgo (Earth × Earth)",
    west_text: "Steady, structured affection grows through consistency and reliability. Your earth element connection provides deep security and mutual respect."
  },

  "taurus_rabbit|cancer_sheep__learning": {
    tier: "learning",
    score: 53,
    headline: "Karmic Teachers",
    body: "Gentle hearts, but unspoken emotions stagnate. Courage in vulnerability deepens trust.",
    east_label: "Rabbit × Sheep — Same Trine (Artists)",
    east_text: "Compassionate and mild, you both value peace and avoid conflict. Openness strengthens the bond and prevents your gentle nature from leading to avoidance.",
    west_label: "Taurus × Cancer — Earth × Water (supportive)",
    west_text: "Nurturing blend creates a secure, caring environment for both partners. Honest dialogue prevents distance and ensures your emotional needs are met."
  },

  "scorpio_dragon|aquarius_monkey__learning": {
    tier: "learning",
    score: 48,
    headline: "Karmic Teachers",
    body: "Strong minds, different motives. Merge purpose with independence without power struggles.",
    east_label: "Dragon × Monkey — Same Trine (Visionaries)",
    east_text: "Potential allies with matching creativity and ambition. Coordinate direction early to ensure your powerful drives support rather than compete.",
    west_label: "Scorpio × Aquarius — Fixed signs (contrast)",
    west_text: "Intensity versus freedom creates both attraction and challenge in your pairing. Empathy restores balance and helps you appreciate each other's different approaches."
  },

  "aries_rat|leo_monkey__learning": {
    tier: "learning",
    score: 51,
    headline: "Karmic Teachers",
    body: "High energy and big opinions excite and exhaust. Share leadership; dominance breaks the flow.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Inventive, assertive pair with matching ambition and drive. Take turns leading to ensure both partners feel valued and heard in the relationship.",
    west_label: "Aries × Leo — Fire × Fire",
    west_text: "Passion drives progress through your shared fire element's intensity. Listening fuels harmony and prevents your mutual confidence from becoming competition."
  },

  "gemini_rat|libra_monkey__learning": {
    tier: "learning",
    score: 49,
    headline: "Karmic Teachers",
    body: "Charming but scattered. Maturity grows when honesty replaces politeness.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Quick synergy creates instant connection through your matching intelligence. Grounding brings stability and ensures your fast-paced energy doesn't create chaos.",
    west_label: "Gemini × Libra — Air × Air",
    west_text: "Shared curiosity makes conversation effortless and endlessly engaging. Decisions need commitment to prevent endless discussion from delaying important choices."
  },

  "pisces_pig|scorpio_snake__learning": {
    tier: "learning",
    score: 50,
    headline: "Karmic Teachers",
    body: "Deep emotions meet power dynamics. Meet in the middle and both transform.",
    east_label: "Pig × Snake — Cross Trine (Artist meets Strategist)",
    east_text: "Gentle meets guarded in this thoughtful pairing of different communication styles. Honesty clears tension and prevents misunderstandings from building.",
    west_label: "Pisces × Scorpio — Water × Water",
    west_text: "Sensitive and loyal, your water element connection creates deep emotional understanding. Balance compassion with self-respect to maintain healthy boundaries."
  },

  "aquarius_monkey|aquarius_monkey__learning": {
    tier: "learning",
    score: 52,
    sign_line: "Aquarius / Monkey × Aquarius / Monkey",
    headline: "Karmic Teachers",
    body: "Fascinating mirrors with identical tempo. The connection is clever, quick, and full of sparks, yet asks for depth to match the brilliance. Similarity becomes strength when feeling joins thought.",
    east_label: "Monkey × Monkey — Same Sign: Visionaries",
    east_text: "Twin rhythms that crave direction and purpose to channel your restless energy. Your shared nature creates instant understanding but needs focus to thrive.",
    west_label: "Aquarius × Aquarius — Same Element: Air × Air",
    west_text: "Mirror minds seeking warmth to balance your intellectual connection. Your shared air element creates harmony but requires emotional effort for depth."
  },

  // ========== CHALLENGING TIER (25-39%) ==========

  "aquarius_monkey|gemini_rat__challenging": {
    tier: "challenging",
    score: 38,
    headline: "Fated Contrast",
    body: "You think alike but act from different motives. Shared cleverness turns competitive without patience.",
    east_label: "Monkey × Rat — Same Trine (Visionaries)",
    east_text: "Brilliant yet restless, you both thrive on mental stimulation and quick thinking. Patience anchors progress and ensures your ideas translate into action.",
    west_label: "Aquarius × Gemini — Air × Air",
    west_text: "Talk without empathy breeds distance despite your natural communication skills. Feelings matter and need attention to balance your intellectual rapport."
  },

  "leo_dragon|sagittarius_tiger__challenging": {
    tier: "challenging",
    score: 36,
    headline: "Fated Contrast",
    body: "Fire meets more fire — dazzling but volatile. Pride and dominance clash unless admiration wins over ego.",
    east_label: "Dragon × Tiger — Cross Trine (Visionary meets Adventurer)",
    east_text: "Powerful but headstrong, you both possess strong wills and determination. Compromise is survival and essential for maintaining harmony in your partnership.",
    west_label: "Leo × Sagittarius — Fire × Fire",
    west_text: "Inspiration burns bright through your shared fire element's passion and enthusiasm. Humility keeps it alive and prevents ego from overshadowing your connection."
  },

  "libra_dragon|pisces_dragon__challenging": {
    tier: "challenging",
    score: 37,
    headline: "Fated Contrast",
    body: "Shared ideals, different languages. Mixed signals test patience; compassion rebuilds trust.",
    east_label: "Dragon × Dragon — Same Sign (Visionaries)",
    east_text: "Pride can polarize when both partners want control and recognition. Empathy softens tension and helps you support rather than compete with each other.",
    west_label: "Libra × Pisces — Air × Water (supportive)",
    west_text: "One rational, one emotional creates both balance and potential misunderstanding. Gentle listening bridges the gap and honors both communication styles."
  },

  "capricorn_ox|virgo_snake__challenging": {
    tier: "challenging",
    score: 35,
    headline: "Fated Contrast",
    body: "Perfectionism meets perfectionism. Shared discipline can feel like critique. Praise more, fix less.",
    east_label: "Ox × Snake — Same Trine (Strategists)",
    east_text: "Efficient but rigid, your shared strategic approach can become too structured. Flexibility is growth and helps prevent your relationship from feeling stagnant.",
    west_label: "Capricorn × Virgo — Earth × Earth",
    west_text: "Stable yet heavy, your earth element connection provides security but can feel too serious. Laughter restores ease and keeps your practical partnership feeling light."
  },

  "taurus_rabbit|cancer_sheep__challenging": {
    tier: "challenging",
    score: 39,
    headline: "Fated Contrast",
    body: "Security is both strength and weakness. Clinging and withdrawing cycle until vulnerability replaces control.",
    east_label: "Rabbit × Sheep — Same Trine (Artists)",
    east_text: "Gentle but avoidant, your shared peaceful nature can lead to avoiding difficult conversations. Honesty is courage and essential for maintaining genuine connection.",
    west_label: "Taurus × Cancer — Earth × Water (supportive)",
    west_text: "Emotional loops form when feelings aren't expressed clearly and directly. Truth resets balance and prevents your nurturing bond from becoming codependent."
  },

  "scorpio_dragon|aquarius_monkey__challenging": {
    tier: "challenging",
    score: 36,
    sign_line: "Scorpio / Dragon × Aquarius / Monkey",
    headline: "Fated Contrast",
    body: "Two powerful personalities orbiting opposite extremes. Scorpio's depth meets Aquarius's distance, creating a charge that is as compelling as it is uncontained. The air hums with purpose and paradox.",
    east_label: "Dragon × Monkey (Same Trine Visionaries)",
    east_text: "A meeting of brilliance that resists containment through your shared creativity and ambition. Your powerful energy needs direction to avoid chaos.",
    west_label: "Scorpio × Aquarius (Fixed Signs Contrast)",
    west_text: "Magnetism born from difference creates intense attraction and challenge. Your contrasting fixed signs create both fascination and potential conflict."
  },

  "aries_rat|leo_monkey__challenging": {
    tier: "challenging",
    score: 37,
    headline: "Fated Contrast",
    body: "Two leaders, one stage. Passion is real but tempers quick. Own the fire and conflict fuels growth.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Bold equals with matching confidence and ambition create a dynamic partnership. Respect differences to stay close and prevent competition from dividing you.",
    west_label: "Aries × Leo — Fire × Fire",
    west_text: "Shared courage through your fire element creates passionate intensity and mutual admiration. Cooperation, not command, ensures both partners feel valued."
  },

  "gemini_rat|libra_monkey__challenging": {
    tier: "challenging",
    score: 35,
    headline: "Fated Contrast",
    body: "Mental spark, emotional mismatch. Charm masks avoidance until real talk begins.",
    east_label: "Rat × Monkey — Same Trine (Visionaries)",
    east_text: "Creative but unfocused, your shared intelligence can scatter without clear direction. Discipline builds trust and ensures your ideas translate into action.",
    west_label: "Gemini × Libra — Air × Air",
    west_text: "Social harmony comes naturally through your air element's communication skills. Depth comes through honesty and prevents your connection from remaining superficial."
  },

  "pisces_pig|scorpio_snake__challenging": {
    tier: "challenging",
    score: 37,
    sign_line: "Pisces / Pig × Scorpio / Snake",
    headline: "Fated Contrast",
    body: "Emotion meets control in a pairing full of depth and contradiction. The attraction is undeniable, shifting between fascination and intensity. You reflect each other's hidden worlds—tender yet powerful.",
    east_label: "Pig × Snake (Cross Trine: Artist meets Strategist)",
    east_text: "Feeling and foresight entwined create a thoughtful, intuitive connection. Your different approaches complement each other when communication stays open.",
    west_label: "Pisces × Scorpio (Water × Water)",
    west_text: "Waves of emotion that mirror the soul through your deep water element connection. Your intense emotional understanding requires boundaries to maintain balance."
  },

  "aquarius_monkey|aquarius_monkey__challenging": {
    tier: "challenging",
    score: 38,
    headline: "Fated Contrast",
    body: "Identical strengths, identical blind spots. Vulnerability must replace analysis for real closeness.",
    east_label: "Monkey × Monkey — Same Sign (Visionaries)",
    east_text: "Brilliant mirrors reflect each other's intelligence and restlessness perfectly. Emotional risk creates depth and prevents your connection from remaining purely mental.",
    west_label: "Aquarius × Aquarius — Same Element: Air × Air",
    west_text: "Shared ideals create natural harmony through your matching air element. Feeling grounds the intellect and adds the emotional depth your relationship needs."
  },

  "aquarius_monkey|cancer_horse__learning": {
    tier: "learning",
    score: 55,
    sign_line: "Aquarius / Monkey × Cancer / Horse",
    headline: "Ideas Meet Feelings",
    body: "Ideas meet feelings here. Aquarius Monkey moves quickly through change, while Cancer Horse needs rhythm, reassurance, and emotional continuity.",
    east_label: "Monkey × Horse — Cross-Trine Contrast",
    east_text: "Monkey–Horse cross-trine heightens pace mismatch; you teach each other patience and empathy. Different worlds, mutual lessons when patience grows.",
    west_label: "Aquarius × Cancer — Element Friction",
    west_text: "Air–Water mixes create fascination but mixed signals. Attraction through curiosity, harmony through compromise."
  },
};

// Helper to get content by pair ID and optional tier
export function getCompleteLongformBlurb(
  pairId: string,
  tier?: TierKey
): CompleteLongformBlurb | null {
  // Construct the key with tier suffix
  const targetTier = tier || 'soulmate';
  const key = `${pairId}__${targetTier}`;
  
  // Direct lookup
  if (COMPLETE_LONGFORM_BLURBS[key]) {
    return COMPLETE_LONGFORM_BLURBS[key];
  }
  
  // Try reversed pair ID
  const [a, b] = pairId.split('|');
  if (a && b) {
    const reversedKey = `${b}|${a}__${targetTier}`;
    if (COMPLETE_LONGFORM_BLURBS[reversedKey]) {
      return COMPLETE_LONGFORM_BLURBS[reversedKey];
    }
  }
  
  return null;
}

// Helper to get all tier versions for a pair
export function getAllTiersForPair(basePairId: string): Record<TierKey, CompleteLongformBlurb | null> {
  return {
    soulmate: COMPLETE_LONGFORM_BLURBS[`${basePairId}__soulmate`] || null,
    twin: COMPLETE_LONGFORM_BLURBS[`${basePairId}__twin`] || null,
    excellent: COMPLETE_LONGFORM_BLURBS[`${basePairId}__excellent`] || null,
    good: COMPLETE_LONGFORM_BLURBS[`${basePairId}__good`] || null,
    learning: COMPLETE_LONGFORM_BLURBS[`${basePairId}__learning`] || null,
    challenging: COMPLETE_LONGFORM_BLURBS[`${basePairId}__challenging`] || null,
  };
}

// Helper to get appropriate tier based on score
export function getTierKeyFromScore(score: number): TierKey {
  if (score >= 90) return 'soulmate';
  if (score >= 85) return 'twin';
  if (score >= 70) return 'excellent';
  if (score >= 55) return 'good';
  if (score >= 40) return 'learning';
  return 'challenging';
}

// Create normalized pair ID
export function createPairId(westA: string, eastA: string, westB: string, eastB: string): string {
  const a = `${westA.toLowerCase()}_${eastA.toLowerCase()}`;
  const b = `${westB.toLowerCase()}_${eastB.toLowerCase()}`;
  return a <= b ? `${a}|${b}` : `${b}|${a}`;
}

