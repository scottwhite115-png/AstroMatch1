// bookOverrides.ts - Fine-grained compatibility adjustments from real-world observations

import type { West, East } from "@/lib/eastWestHelpers";

export type WestFilter = West[] | "any";

export interface BookOverride {
  targetAnimal: East;
  westFilter?: WestFilter;                  // e.g., ["Gemini","Libra"] or "any"
  action: "favor" | "avoid";
  delta: { chem?: number; long?: number; comm?: number }; // keep small: ±2..±6
  note?: string;                            // your own tiny paraphrase (optional)
}

export type BookOverridesMap = Record<`${West}-${East}`, BookOverride[]>;

// Start small; we'll expand as we sweep the profiles
export const bookOverrides: BookOverridesMap = {
  // ========== ARIES COMBINATIONS ==========
  
  // Aries-Rat: Ambitious, clever, fast-talking; fearless and inventive
  "Aries-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mutual drive and charisma" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared wit and quick rapport" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different priorities and tempo" },
  ],
  
  // Aries-Ox: Persistent builder with courage and stamina
  "Aries-Ox": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strategic match with shared focus" },
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Mutual trust and practical sense" },
    { targetAnimal: "Tiger",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control vs independence" },
  ],
  
  // Aries-Tiger: Brave, magnetic, freedom-loving leader
  "Aries-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Fire on fire; thrilling and bold" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyal comradeship and faith" },
    { targetAnimal: "Snake", westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Suspicion and differing styles" },
  ],
  
  // Aries-Rabbit: Tender yet self-driven; needs encouragement
  "Aries-Rabbit": [
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Gentle emotional balance" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Kindness softens Aries edge" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Pride and pace conflict" },
  ],
  
  // Aries-Dragon: Charismatic conqueror; visionary spirit
  "Aries-Dragon": [
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Exciting, witty powerhouse" },
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Clever mutual advancement" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Dominance rivalry" },
  ],
  
  // Aries-Snake: Ambitious, strategic, alluring
  "Aries-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual persistence and logic" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Purposeful and detailed" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too sentimental for Aries pace" },
  ],
  
  // Aries-Horse: Enthusiastic, spontaneous, fun-driven
  "Aries-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Courage and passion in motion" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared honesty and ideals" },
    { targetAnimal: "Ox",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control vs wanderlust" },
  ],
  
  // Aries-Goat: Gentle dreamer with flair for beauty
  "Aries-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual kindness and charm" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Caring, nurturing rapport" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Overpowering energy" },
  ],
  
  // Aries-Monkey: Quick-thinking, playful strategist
  "Aries-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Vibrant mental and physical chemistry" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Adventurous, magnetic duo" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different needs in love tempo" },
  ],
  
  // Aries-Rooster: Brave perfectionist; outspoken and bold
  "Aries-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared precision and focus" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Grounded partnership" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Critique vs sensitivity" },
  ],
  
  // Aries-Dog: Idealistic fighter for justice; loyal and passionate
  "Aries-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Shared courage and faith" },
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Active, trusting connection" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Too competitive" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overly delicate pairing" },
  ],
  
  // Aries-Pig: Warm, optimistic, honest and protective
  "Aries-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Gentle, loving bond" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Affection and understanding" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional vs strategic tension" },
  ],
  
  // ========== PISCES COMBINATIONS ==========
  
  // Pisces-Rat: Sensitive dreamer with brains; imaginative yet practical
  "Pisces-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Inspired, creative bond" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Humor and intuition mix beautifully" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Moodiness clashes with sensitivity" },
  ],
  
  // Pisces-Ox: Patient, loyal, spiritual builder; soft-spoken and steady
  "Pisces-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Dependable love and trust" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Quiet strength meets devotion" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too direct for Pisces calm" },
  ],
  
  // Pisces-Tiger: Compassionate yet courageous; emotional but loyal
  "Pisces-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Fire and feeling coexist well" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyal, spiritual devotion" },
    { targetAnimal: "Ox",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Rigidity vs emotion" },
  ],
  
  // Pisces-Rabbit: Emotional healer; gentle, imaginative, nurturing
  "Pisces-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Emotional harmony and artistry" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Unconditional love and understanding" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism hurts sensitive nature" },
  ],
  
  // Pisces-Dragon: Charismatic visionary; mystical and powerful
  "Pisces-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mutual inspiration and admiration" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Creative balance of power and feeling" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control and ego friction" },
  ],
  
  // Pisces-Snake: Emotional mystic; wise, patient, protective
  "Pisces-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Faithful calm and devotion" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Deep, respectful love" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: -4, long:-3}, note:"Idealism vs practicality tension" },
  ],
  
  // Pisces-Horse: Romantic free spirit; intuitive, emotional, and lively
  "Pisces-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mutual passion and loyalty" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust with excitement" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Detached logic frustrates Pisces" },
  ],
  
  // Pisces-Goat: Dreamer and empath; sensitive, artistic, deeply kind
  "Pisces-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Soft hearts in sync" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Gentle emotional sanctuary" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too assertive for peace" },
  ],
  
  // Pisces-Monkey: Clever dreamer; imaginative, playful, adaptable
  "Pisces-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Creative friendship and insight" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Passion meets imagination" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too sensitive for mental pace" },
  ],
  
  // Pisces-Rooster: Gentle perfectionist; humble, loyal, idealistic
  "Pisces-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Practical love with patience" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust and structure" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Oversensitivity causes confusion" },
  ],
  
  // Pisces-Dog: Loyal protector; empathic, moral, emotionally grounded
  "Pisces-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared ideals and faith" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Empathy and mutual protection" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control clashes with peace" },
  ],
  
  // Pisces-Pig: Old-soul romantic; gentle, wise, kind, and intuitive
  "Pisces-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Unconditional love and empathy" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Soulful harmony and trust" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional warmth vs reserve" },
  ],
  
  // ========== CAPRICORN COMBINATIONS ==========
  
  // Capricorn-Rat: Ambitious builder; clever, resourceful, and loyal
  "Capricorn-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Shared ambition and respect" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Clever partnership with purpose" },
    { targetAnimal: "Horse",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different life pace and priorities" },
  ],
  
  // Capricorn-Ox: Patient, focused, dependable; values loyalty above all
  "Capricorn-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared work ethic and devotion" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Trust and emotional depth" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Unstable energy for Capricorn calm" },
  ],
  
  // Capricorn-Tiger: Serious yet brave; strong protector with high standards
  "Capricorn-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Integrity and courage align" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Devotion through honesty" },
    { targetAnimal: "Snake", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Trust and emotion tension" },
  ],
  
  // Capricorn-Rabbit: Loyal, reserved, thoughtful; appreciates emotional steadiness
  "Capricorn-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Nurturing loyalty and peace" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Kindness and calm affection" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism dulls warmth" },
  ],
  
  // Capricorn-Dragon: Authoritative yet composed; power meets discipline
  "Capricorn-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mutual respect and drive" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Smart, ambitious partnership" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Moral rigidity clashes with pride" },
  ],
  
  // Capricorn-Snake: Strategic, sensual, patient; wise and protective
  "Capricorn-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Loyal and composed match" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared purpose and focus" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too open for Capricorn's caution" },
  ],
  
  // Capricorn-Horse: Independent achiever; cautious but adventurous at heart
  "Capricorn-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual courage and curiosity" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust and shared values" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Jealousy over independence" },
  ],
  
  // Capricorn-Goat: Quiet dreamer; artistic, emotional, and loyal when secure
  "Capricorn-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Compassion meets patience" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Softness and security" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Power overwhelms peace" },
  ],
  
  // Capricorn-Monkey: Ambitious, shrewd, witty strategist; practical yet fun
  "Capricorn-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mental synergy and ambition" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Power and wit balanced" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional values" },
  ],
  
  // Capricorn-Rooster: Pragmatic, perfectionist, and loyal; values honesty
  "Capricorn-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Practical and passionate" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Dependable, loyal pair" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Gentle vs critical tension" },
  ],
  
  // Capricorn-Dog: Faithful, protective, ethical; slow to trust but loyal for life
  "Capricorn-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Devotion built on respect" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Kind and loyal affection" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Moral vs pride tension" },
  ],
  
  // Capricorn-Pig: Generous, sincere, affectionate, practical in love
  "Capricorn-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loving and honest warmth" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Stable emotional support" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional tone misaligned" },
  ],
  
  // ========== SAGITTARIUS COMBINATIONS ==========
  
  // Sagittarius-Rat: Bold thinker; witty, confident, endlessly curious
  "Sagittarius-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Visionary energy and humor align" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Playful brilliance and optimism" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Freedom vs sensitivity clash" },
  ],
  
  // Sagittarius-Ox: Grounded dreamer; adventurous yet principled
  "Sagittarius-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Philosophy meets practicality" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared depth beneath calm" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Clash of dominance and restlessness" },
  ],
  
  // Sagittarius-Tiger: Magnetic explorer; thrives on risk and passion
  "Sagittarius-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Perfect adventure partners" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Faithful excitement and courage" },
    { targetAnimal: "Ox",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different approaches to freedom" },
  ],
  
  // Sagittarius-Rabbit: Cheerful, artistic, easygoing, loves variety
  "Sagittarius-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Playful tenderness and peace" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Joyful optimism and care" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism dulls spontaneity" },
  ],
  
  // Sagittarius-Dragon: Adventurous visionary; loves freedom and leadership
  "Sagittarius-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Magnetic power couple" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Inventive and passionate match" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Ideals conflict with pride" },
  ],
  
  // Sagittarius-Snake: Philosophical, sensual, intuitive; quietly strong
  "Sagittarius-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strategic calm meets curiosity" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Clever and composed chemistry" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotion vs reason divide" },
  ],
  
  // Sagittarius-Horse: Wild optimist; independent yet romantic
  "Sagittarius-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Fire meets freedom" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust supports exploration" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional needs" },
  ],
  
  // Sagittarius-Goat: Warmhearted idealist; emotional and artistic
  "Sagittarius-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Gentle affection and trust" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Joyful and compassionate" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Intensity vs softness" },
  ],
  
  // Sagittarius-Monkey: Clever adventurer; witty and bold
  "Sagittarius-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Brilliant synergy and laughter" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Magnetic and ambitious" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional pace" },
  ],
  
  // Sagittarius-Rooster: Honest, precise, enthusiastic; idealistic truth-seeker
  "Sagittarius-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared wisdom and curiosity" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Grounded inspiration" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Gentle vs assertive mismatch" },
  ],
  
  // Sagittarius-Dog: Adventurous but principled; honest and loyal
  "Sagittarius-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Trust and excitement intertwine" },
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Adventurous faithfulness" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Egos compete" },
  ],
  
  // Sagittarius-Pig: Warm, generous, loving; open-hearted and kind
  "Sagittarius-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Easy laughter and loyalty" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Affectionate and fun-loving" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Conflicting depths" },
  ],
  
  // ========== SCORPIO COMBINATIONS ==========
  
  // Scorpio-Rat: Strategic, loyal, emotionally intelligent, ambitious
  "Scorpio-Rat": [
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared determination and loyalty" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Magnetic, ambitious match" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional imbalance" },
  ],
  
  // Scorpio-Ox: Steadfast, intense, dependable; takes relationships seriously
  "Scorpio-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyal partnership built on trust" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Deep sensual connection" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control and pride conflicts" },
  ],
  
  // Scorpio-Tiger: Passionate, fearless, and protective; thrives in intensity
  "Scorpio-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Fire and loyalty unite" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Deep emotional trust" },
    { targetAnimal: "Ox",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Rigid vs impulsive friction" },
  ],
  
  // Scorpio-Rabbit: Emotional healer; gentle yet powerful in love
  "Scorpio-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Soft affection meets depth" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotional healing and warmth" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Critical vs intuitive" },
  ],
  
  // Scorpio-Dragon: Intense, magnetic, dominant; natural leader
  "Scorpio-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Passion and intellect ignite" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strategic and playful energy" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Ideals and control clash" },
  ],
  
  // Scorpio-Snake: Seductive, wise, loyal, and intuitive; thrives in secrecy and connection
  "Scorpio-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Deep trust and sensual bond" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared discipline and loyalty" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overt emotion unsettles Scorpio" },
  ],
  
  // Scorpio-Horse: Passionate, adventurous, emotional risk-taker
  "Scorpio-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Fiery chemistry and devotion" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual honesty and drive" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Jealousy and control issues" },
  ],
  
  // Scorpio-Goat: Creative, sensitive, romantic; drawn to emotional safety
  "Scorpio-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Empathy and tenderness" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Deep emotional harmony" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Intensity overwhelms balance" },
  ],
  
  // Scorpio-Monkey: Magnetic, clever, mischievous, and seductive
  "Scorpio-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Electric connection and wit" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Dynamic powerhouse duo" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional languages" },
  ],
  
  // Scorpio-Rooster: Proud perfectionist with a passionate heart
  "Scorpio-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Discipline meets desire" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Faithful, consistent connection" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Gentleness vs dominance" },
  ],
  
  // Scorpio-Dog: Loyal, honest, protective; fiercely faithful
  "Scorpio-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Devoted and sincere" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Calm, caring partnership" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Power struggle tendencies" },
  ],
  
  // Scorpio-Pig: Deeply loving, emotional, and generous; craves genuine connection
  "Scorpio-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotional resonance and comfort" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Soft-hearted and romantic" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional disconnect" },
  ],
  
  // ========== LIBRA COMBINATIONS ==========
  
  // Libra-Rat: Social, intelligent, charming negotiator; loves ideas and admiration
  "Libra-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Shared charisma and curiosity" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Wit and fun in perfect rhythm" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too sensitive for Libra balance" },
  ],
  
  // Libra-Ox: Elegant, loyal, diplomatic yet decisive
  "Libra-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Balanced logic and loyalty" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Sophisticated chemistry" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Restless vs steady tension" },
  ],
  
  // Libra-Tiger: Magnetic, flirtatious, independent thinker; loves excitement
  "Libra-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Adventure and laughter" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared faith and honesty" },
    { targetAnimal: "Snake", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional distance issues" },
  ],
  
  // Libra-Rabbit: Romantic, artistic, peace-seeking diplomat
  "Libra-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Creative peace and affection" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Kindness and tenderness" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overanalyzing drains joy" },
  ],
  
  // Libra-Dragon: Charismatic leader with vision and grace
  "Libra-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Power and poise align" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Clever and magnetic union" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Pride clashes with principle" },
  ],
  
  // Libra-Snake: Charming, thoughtful, sensual, and strategic
  "Libra-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Refined and loyal match" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Sophisticated chemistry" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Logic vs feeling imbalance" },
  ],
  
  // Libra-Horse: Romantic, outgoing, freedom-loving; thrives in connection
  "Libra-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Charismatic and passionate" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Playful loyalty" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Ego friction" },
  ],
  
  // Libra-Goat: Kind-hearted romantic; intuitive and expressive
  "Libra-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Harmonious emotional flow" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Compassion and sweetness" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overpowering presence" },
  ],
  
  // Libra-Monkey: Flirtatious, witty, adaptable; social butterfly
  "Libra-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"High-energy mental connection" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mutual admiration and creativity" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Uneven intensity" },
  ],
  
  // Libra-Rooster: Idealistic perfectionist; diplomatic yet outspoken
  "Libra-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared refinement" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Reliable, structured affection" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different conflict styles" },
  ],
  
  // Libra-Dog: Loyal, moral, faithful; romantic idealist
  "Libra-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Honesty and shared vision" },
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Freedom with devotion" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Power clash" },
  ],
  
  // Libra-Pig: Affectionate, kind, creative, devoted to love
  "Libra-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Tender and romantic" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Compassionate harmony" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional needs" },
  ],
  
  // ========== VIRGO COMBINATIONS ==========
  
  // Virgo-Rat: Intelligent, meticulous, pragmatic; a planner at heart
  "Virgo-Rat": [
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Methodical trust and loyalty" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared ambition and logic" },
    { targetAnimal: "Horse",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Chaos vs control" },
  ],
  
  // Virgo-Ox: Patient, methodical, careful; values hard work and order
  "Virgo-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared practicality and reliability" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strategic, intellectual harmony" },
    { targetAnimal: "Goat",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overly emotional pairing" },
  ],
  
  // Virgo-Tiger: Ambitious perfectionist; private but strong-willed
  "Virgo-Tiger": [
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Energy tempered by wisdom" },
    { targetAnimal: "Dog",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Principled trust" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Power dynamic mismatch" },
  ],
  
  // Virgo-Rabbit: Soft-spoken, loyal, refined; emotional intelligence high
  "Virgo-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared grace and kindness" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Peaceful emotional flow" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Critique vs sensitivity" },
  ],
  
  // Virgo-Dragon: Strong organizer; pragmatic yet visionary
  "Virgo-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Smart, ambitious partnership" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Clever, inspiring match" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Principle vs pride tension" },
  ],
  
  // Virgo-Snake: Discerning, mysterious, deeply loyal when secure
  "Virgo-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Patience and quiet depth" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual respect for perfection" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Logic vs emotion mismatch" },
  ],
  
  // Virgo-Horse: Thoughtful explorer; seeks meaning and loyalty
  "Virgo-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyalty and curiosity align" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Sincere and grounded trust" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional needs" },
  ],
  
  // Virgo-Goat: Empathetic, loyal, artistic; seeks emotional stability
  "Virgo-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Soft, caring rhythm" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Kindred gentle spirits" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overpowering leadership" },
  ],
  
  // Virgo-Monkey: Bright, strategic, witty perfectionist
  "Virgo-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Sharp minds in sync" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Intellect and drive match" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional overload" },
  ],
  
  // Virgo-Rooster: Meticulous, articulate, honest, and loyal
  "Virgo-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Practical precision" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Orderly, dependable match" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Delicacy clashes with critique" },
  ],
  
  // Virgo-Dog: Devoted, protective, moral; a thoughtful partner
  "Virgo-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Honesty and steadiness" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyal and supportive" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Pride vs principle" },
  ],
  
  // Virgo-Pig: Sensitive, patient, affectionate; healing energy
  "Virgo-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Heartfelt empathy" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotional harmony" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different communication needs" },
  ],
  
  // ========== LEO COMBINATIONS ==========
  
  // Leo-Rat: Charismatic, ambitious, fiercely loyal, loves attention
  "Leo-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Power couple; creative and bold" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Quick wit fuels attraction" },
    { targetAnimal: "Horse",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too restless for Leo pride" },
  ],
  
  // Leo-Ox: Strong, proud, patient; leads with quiet confidence
  "Leo-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Ambitious stability" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strategic passion and trust" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Ego and freedom clash" },
  ],
  
  // Leo-Tiger: Magnetic, dramatic, courageous; thrives on excitement
  "Leo-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Shared fire and thrill" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual loyalty and faith" },
    { targetAnimal: "Snake", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Hidden motives unsettle Leo" },
  ],
  
  // Leo-Rabbit: Affectionate, generous, socially skilled
  "Leo-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Tenderness tames ego" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Warmth and mutual devotion" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Clash of pride and critique" },
  ],
  
  // Leo-Dragon: Fiery, dominant, magnetic leader; loves admiration
  "Leo-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Vision and confidence align" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Dynamic, inventive pairing" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Pride vs principle clash" },
  ],
  
  // Leo-Snake: Seductive, strategic, passionate; intuitive leader
  "Leo-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared sensual control and poise" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Admiration and refinement" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional tempos" },
  ],
  
  // Leo-Horse: Bold, dramatic, freedom-loving; thrives on admiration
  "Leo-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Magnetic, fearless match" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyalty supports independence" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Conflicting egos" },
  ],
  
  // Leo-Goat: Generous, artistic, expressive; romantic and warm
  "Leo-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Affection and balance" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loving and loyal" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Dominant vs gentle tension" },
  ],
  
  // Leo-Monkey: Clever, bold, charismatic; playful confidence
  "Leo-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Lively trine — pure charisma" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Ambitious match made in spotlight" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different priorities in love" },
  ],
  
  // Leo-Rooster: Proud, articulate, commanding presence
  "Leo-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared power and flair" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Reliable and proud pair" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Softness meets dominance" },
  ],
  
  // Leo-Dog: Loyal, passionate, and protective; strong moral compass
  "Leo-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Courageous, idealistic bond" },
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Honest enthusiasm" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Competing for spotlight" },
  ],
  
  // Leo-Pig: Generous, affectionate, expressive, and loving
  "Leo-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Heartfelt and devoted" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Affection and creative flow" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional wavelengths" },
  ],
  
  // ========== CANCER COMBINATIONS ==========
  
  // Cancer-Rat: Emotional strategist; protective, perceptive, and ambitious
  "Cancer-Rat": [
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Steady ally grounds emotion" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared drive and loyalty" },
    { targetAnimal: "Horse",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Restless vs homebody conflict" },
  ],
  
  // Cancer-Ox: Quiet builder; loyal, sincere, dependable
  "Cancer-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strong mutual devotion" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotional stability with wisdom" },
    { targetAnimal: "Goat",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Sensitivity overload" },
  ],
  
  // Cancer-Tiger: Emotional courage; nurturing but easily hurt
  "Cancer-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Romantic adventure with loyalty" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Deep emotional faith" },
    { targetAnimal: "Snake", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Secretive vs openhearted tension" },
  ],
  
  // Cancer-Rabbit: Gentle, emotional, family-minded
  "Cancer-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual empathy and safety" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Warm, affectionate support" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism wounds sensitivity" },
  ],
  
  // Cancer-Dragon: Proud protector; deep feelings under control
  "Cancer-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual ambition with devotion" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Clever emotional partnership" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control vs independence friction" },
  ],
  
  // Cancer-Snake: Private, magnetic, nurturing yet guarded
  "Cancer-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust and shared discretion" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Structured affection" },
    { targetAnimal: "Pig",     westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too open or sentimental" },
  ],
  
  // Cancer-Horse: Sensitive free-spirit; needs reassurance
  "Cancer-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotional excitement with devotion" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyalty softens insecurity" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different love languages" },
  ],
  
  // Cancer-Goat: Dreamy, romantic, artistic; seeks security
  "Cancer-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Soulful comfort" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Affectionate harmony" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Intensity disturbs peace" },
  ],
  
  // Cancer-Monkey: Clever but emotional; playful and affectionate
  "Cancer-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Fun and emotional engagement" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strong yet caring chemistry" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Sensitivity gap" },
  ],
  
  // Cancer-Rooster: Protective perfectionist; values loyalty and precision
  "Cancer-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Reliable, passionate match" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Faithful and secure" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Misaligned sensitivity" },
  ],
  
  // Cancer-Dog: Loyal, protective, home-centered caretaker
  "Cancer-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Warmth and trust" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared kindness and family goals" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Power dynamic clashes" },
  ],
  
  // Cancer-Pig: Generous, intuitive, deeply loving
  "Cancer-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotionally aligned and kind" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Comfort and mutual devotion" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional disconnect" },
  ],
  
  // ========== GEMINI COMBINATIONS ==========
  
  // Gemini-Rat: Quick, witty, adaptable, intellectually curious
  "Gemini-Rat": [
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"High-energy, fast-thinking duo" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Shared humor and mental spark" },
    { targetAnimal: "Goat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overly sensitive for Gemini pace" },
  ],
  
  // Gemini-Ox: Grounded talker; dependable yet free-thinking
  "Gemini-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Grounded wit and shared goals" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Deep thinker meets clear mind" },
    { targetAnimal: "Tiger", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Restless friction" },
  ],
  
  // Gemini-Tiger: Charismatic communicator; loves challenge and novelty
  "Gemini-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Playful, fast-paced chemistry" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Loyal, lively connection" },
    { targetAnimal: "Snake", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different communication tempo" },
  ],
  
  // Gemini-Rabbit: Charming, refined, socially intuitive
  "Gemini-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Peaceful artistic vibe" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Supportive emotional warmth" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism dulls flow" },
  ],
  
  // Gemini-Dragon: Charismatic visionary with quick wit
  "Gemini-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Mental agility and confidence" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Creative dynamism and fun" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Ego and ideals clash" },
  ],
  
  // Gemini-Snake: Persuasive, analytical, sensual; cerebral matchmaker
  "Gemini-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Balanced reason and intuition" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual respect for intellect" },
    { targetAnimal: "Tiger",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional styles" },
  ],
  
  // Gemini-Horse: Adventurous, expressive, flirtatious
  "Gemini-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Excitement and variety" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust keeps freedom safe" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Jealousy over autonomy" },
  ],
  
  // Gemini-Goat: Artistic, emotional, free-spirited; thrives on love
  "Gemini-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Creative, kind-hearted duo" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Affection and trust" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overpowering ego" },
  ],
  
  // Gemini-Monkey: Social genius; witty and charming
  "Gemini-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Perfect trine — ideas flow fast" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Adventurous powerhouse" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotionally mismatched" },
  ],
  
  // Gemini-Rooster: Observant, clever, outspoken communicator
  "Gemini-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Sharp logic and attraction" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Respectful, honest dialogue" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Softness vs bluntness" },
  ],
  
  // Gemini-Dog: Kind, intellectual, humorous; needs loyalty
  "Gemini-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Bright optimism and trust" },
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Playful and open" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too dominant for peace" },
  ],
  
  // Gemini-Pig: Warm, generous, emotionally intuitive communicator
  "Gemini-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Sincere, affectionate match" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Gentle support and warmth" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Cool logic vs deep emotion" },
  ],
  
  // ========== TAURUS COMBINATIONS ==========
  
  // Taurus-Rat: Practical, ambitious, loyal; builds patiently
  "Taurus-Rat": [
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Solid builder + loyal partner" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual ambition and power" },
    { targetAnimal: "Horse",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different pace and patience" },
  ],
  
  // Taurus-Ox: Grounded, determined, dependable
  "Taurus-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust and teamwork" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Strategic minds align" },
    { targetAnimal: "Goat",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Overly emotional for Taurus calm" },
  ],
  
  // Taurus-Tiger: Stubborn yet passionate; loyal once secure
  "Taurus-Tiger": [
    { targetAnimal: "Dog",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared loyalty and values" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Caring and supportive" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Power struggle" },
  ],
  
  // Taurus-Rabbit: Peaceful, loving, patient; values comfort
  "Taurus-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Warm, steady affection" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Gentle harmony and care" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism wounds Taurus" },
  ],
  
  // Taurus-Dragon: Strong-willed builder with quiet pride
  "Taurus-Dragon": [
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Brains + ambition in sync" },
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual practicality" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Control vs independence" },
  ],
  
  // Taurus-Snake: Calm, sensual, discerning
  "Taurus-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual patience and sensuality" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared taste and precision" },
    { targetAnimal: "Tiger",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too unpredictable" },
  ],
  
  // Taurus-Horse: Faithful yet freedom-loving; tactile and social
  "Taurus-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Balanced excitement and loyalty" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared honesty" },
    { targetAnimal: "Ox",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Freedom vs control" },
  ],
  
  // Taurus-Goat: Gentle romantic, artistic, steady devotion
  "Taurus-Goat": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Peaceful, loving bond" },
    { targetAnimal: "Pig",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Kind and affectionate" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Intensity overwhelms Goat calm" },
  ],
  
  // Taurus-Monkey: Pragmatic with playful wit; sensual yet curious
  "Taurus-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Quick rapport + shared goals" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Strong creative teamwork" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional speeds" },
  ],
  
  // Taurus-Rooster: Precise, loyal, self-assured; enjoys clear order
  "Taurus-Rooster": [
    { targetAnimal: "Snake",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared perfectionism and taste" },
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Dependable mutual respect" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism stings" },
  ],
  
  // Taurus-Dog: Dependable, moral, affectionate protector
  "Taurus-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual loyalty and integrity" },
    { targetAnimal: "Horse",  westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Honest, caring match" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Clashing authority" },
  ],
  
  // Taurus-Pig: Warm, forgiving, indulgent in love
  "Taurus-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust and nurturing bond" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Artistic comfort and love" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional mismatch" },
  ],
  
  // ========== AQUARIUS COMBINATIONS ==========
  
  // Aquarius-Rat: Inventive, sociable, witty
  "Aquarius-Rat": [
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Grounded ally supports ideas" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Vision + drive pairing" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Witty and fluid connection" },
    { targetAnimal: "Horse",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Restless rhythm mismatch" },
  ],
  
  // Aquarius-Ox: Determined yet quirky; idealistic builder
  "Aquarius-Ox": [
    { targetAnimal: "Rat",   westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Supportive and patient ally" },
    { targetAnimal: "Snake", westFilter: "any", action:"favor", delta:{chem: +4, long:+2}, note:"Quiet strategist matches depth" },
    { targetAnimal: "Goat",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different priorities" },
  ],
  
  // Aquarius-Tiger: Visionary and bold; humanitarian streak
  "Aquarius-Tiger": [
    { targetAnimal: "Horse", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Dynamic, energetic flow" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual respect and purpose" },
    { targetAnimal: "Ox",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Too fixed; clashes on freedom" },
  ],
  
  // Aquarius-Rabbit: Gentle innovator; emotional yet cerebral
  "Aquarius-Rabbit": [
    { targetAnimal: "Goat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Emotional resonance and peace" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Affectionate, empathetic" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Criticism vs sensitivity" },
  ],
  
  // Aquarius-Dragon: Charismatic visionary; natural leader
  "Aquarius-Dragon": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mind and motivation in sync" },
    { targetAnimal: "Monkey", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Firecracker combination" },
    { targetAnimal: "Dog",    westFilter: "any", action:"avoid", delta:{chem: -5, long:-4}, note:"Leadership competition" },
  ],
  
  // Aquarius-Snake: Mysterious thinker; strategic and intuitive
  "Aquarius-Snake": [
    { targetAnimal: "Ox",      westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Mutual respect for logic" },
    { targetAnimal: "Rooster", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Sharp minds, shared precision" },
    { targetAnimal: "Tiger",   westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different communication style" },
  ],
  
  // Aquarius-Horse: Free-spirited and inventive; high energy
  "Aquarius-Horse": [
    { targetAnimal: "Tiger", westFilter: "any", action:"favor", delta:{chem: +5, long:+3}, note:"Shared enthusiasm and adventure" },
    { targetAnimal: "Dog",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Trust and shared goals" },
    { targetAnimal: "Rat",   westFilter: "any", action:"avoid", delta:{chem: -5, long:-3}, note:"Clash of pace and ego" },
  ],
  
  // Aquarius-Goat: Artistic, peace-seeking, intuitive
  "Aquarius-Goat": [
    { targetAnimal: "Rabbit",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Shared gentleness and art" },
    { targetAnimal: "Pig",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Caring, affectionate flow" },
    { targetAnimal: "Rooster", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Critique vs sensitivity" },
  ],
  
  // Aquarius-Monkey: Charismatic, clever, quick-minded
  "Aquarius-Monkey": [
    { targetAnimal: "Rat",    westFilter: "any", action:"favor", delta:{chem: +6, long:+5}, note:"Brilliant rapport; shared humor" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +5, long:+4}, note:"Power duo, visionary drive" },
    { targetAnimal: "Pig",    westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Different emotional languages" },
  ],
  
  // Aquarius-Rooster: Independent, outspoken, visionary critic
  "Aquarius-Rooster": [
    { targetAnimal: "Ox",     westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Mutual respect for structure" },
    { targetAnimal: "Dragon", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Confidence and ambition align" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Sensitivity vs bluntness" },
  ],
  
  // Aquarius-Dog: Loyal, idealistic, intelligent
  "Aquarius-Dog": [
    { targetAnimal: "Tiger",  westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Courage and loyalty" },
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +3, long:+3}, note:"Peaceful, balanced pair" },
    { targetAnimal: "Dragon", westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Control vs independence tension" },
  ],
  
  // Aquarius-Pig: Kind-hearted visionary; open and loving
  "Aquarius-Pig": [
    { targetAnimal: "Rabbit", westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Warmth and shared hope" },
    { targetAnimal: "Goat",   westFilter: "any", action:"favor", delta:{chem: +4, long:+3}, note:"Creativity and empathy" },
    { targetAnimal: "Snake",  westFilter: "any", action:"avoid", delta:{chem: -4, long:-3}, note:"Emotional vs logical friction" },
  ],
  
  // ========== OTHER COMBINATIONS (previously added) ==========
  
  // Sagittarius-Dragon (example sketch)
  "Sagittarius-Dragon": [
    { targetAnimal: "Monkey", westFilter: ["Aries","Leo","Libra","Aquarius"], action:"favor", delta:{chem:+4,long:+3,comm:+2}, note:"Agility + ambition" },
    { targetAnimal: "Rat",    westFilter: ["Leo","Aquarius"],                 action:"favor", delta:{chem:+3,long:+2,comm:+2}, note:"Bright, devoted, quick" },
    { targetAnimal: "Dog",    westFilter: ["Gemini","Virgo","Pisces"],        action:"avoid", delta:{chem:-4,long:-3,comm:-2}, note:"Principles collide" },
  ],
};

/**
 * Apply book overrides for a specific person-to-person match
 * @param aWest Person A's Western sign
 * @param aEast Person A's Eastern animal
 * @param bWest Person B's Western sign
 * @param bEast Person B's Eastern animal
 * @returns Deltas to apply: { chemistry, longTerm, communication }
 */
export function applyBookOverridesForPair(
  aWest: West,
  aEast: East,
  bWest: West,
  bEast: East
): { chemistry: number; longTerm: number; communication: number } {
  let chemistry = 0;
  let longTerm = 0;
  let communication = 0;

  // Check A → B
  const keyA = `${aWest}-${aEast}` as `${West}-${East}`;
  const overridesA = bookOverrides[keyA];
  if (overridesA) {
    for (const override of overridesA) {
      if (override.targetAnimal === bEast) {
        // Check if B's western sign matches filter
        if (!override.westFilter || override.westFilter === "any" || override.westFilter.includes(bWest)) {
          chemistry += override.delta.chem ?? 0;
          longTerm += override.delta.long ?? 0;
          communication += override.delta.comm ?? 0;
        }
      }
    }
  }

  // Check B → A
  const keyB = `${bWest}-${bEast}` as `${West}-${East}`;
  const overridesB = bookOverrides[keyB];
  if (overridesB) {
    for (const override of overridesB) {
      if (override.targetAnimal === aEast) {
        // Check if A's western sign matches filter
        if (!override.westFilter || override.westFilter === "any" || override.westFilter.includes(aWest)) {
          chemistry += override.delta.chem ?? 0;
          longTerm += override.delta.long ?? 0;
          communication += override.delta.comm ?? 0;
        }
      }
    }
  }

  return { chemistry, longTerm, communication };
}

