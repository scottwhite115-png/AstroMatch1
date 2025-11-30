// lib/connectionSunVibes.ts

export type WesternSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

const SUN_SIGNS: WesternSign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

function normalizePair(a: WesternSign, b: WesternSign): string {
  // Keep it deterministic: Aries–Leo and Leo–Aries → "Aries-Leo"
  const [s1, s2] = [a, b].sort(
    (x, y) => SUN_SIGNS.indexOf(x) - SUN_SIGNS.indexOf(y)
  );
  return `${s1}-${s2}`;
}

const SUN_MATCH_VIBES: Record<string, string> = {
  // ARIES PAIRS
  "Aries-Aries":
    "Aries × Aries — High-energy, impulsive and direct; amazing momentum if egos don't clash.",
  "Aries-Taurus":
    "Aries × Taurus — Fire meets patience; one moves fast, the other anchors the pace.",
  "Aries-Gemini":
    "Aries × Gemini — Playful, restless and curious; best when you both have room to move.",
  "Aries-Cancer":
    "Aries × Cancer — Bold meets sensitive; learning to blend action with emotional care is key.",
  "Aries-Leo":
    "Aries × Leo — Dramatic, confident and warm; huge chemistry if pride doesn't take over.",
  "Aries-Virgo":
    "Aries × Virgo — Impulse meets precision; great for getting things done if criticism stays gentle.",
  "Aries-Libra":
    "Aries × Libra — Directness vs diplomacy; opposites that spark each other into growth and balance.",
  "Aries-Scorpio":
    "Aries × Scorpio — Intense, confrontational and magnetic; honesty is powerful, control games aren't.",
  "Aries-Sagittarius":
    "Aries × Sagittarius — Adventurous, blunt and upbeat; thrives on shared risks and big horizons.",
  "Aries-Capricorn":
    "Aries × Capricorn — Drive meets discipline; strong team if you respect each other's methods.",
  "Aries-Aquarius":
    "Aries × Aquarius — Rebel energy; bold ideas, unconventional moves and zero interest in boring routines.",
  "Aries-Pisces":
    "Aries × Pisces — Action meets intuition; needs compassion and patience to avoid hurt feelings.",

  // TAURUS PAIRS
  "Taurus-Taurus":
    "Taurus × Taurus — Steady, sensual and stubborn; slow to start, hard to stop once committed.",
  "Taurus-Gemini":
    "Taurus × Gemini — Stability meets variety; works when you mix comfort with a bit of mischief.",
  "Taurus-Cancer":
    "Taurus × Cancer — Cozy, loyal and protective; home, food and emotional safety tie you together.",
  "Taurus-Leo":
    "Taurus × Leo — Pleasure-loving but proud; you both like luxury and loyalty, but hate being pushed.",
  "Taurus-Virgo":
    "Taurus × Virgo — Practical, grounded and patient; small daily gestures build long-term trust.",
  "Taurus-Libra":
    "Taurus × Libra — Venus-ruled duo; drawn to beauty and comfort, but decisions can drag.",
  "Taurus-Scorpio":
    "Taurus × Scorpio — Deep, possessive and intense; powerful chemistry, strong lessons in trust.",
  "Taurus-Sagittarius":
    "Taurus × Sagittarius — Comfort vs freedom; works best with clear space and shared adventures.",
  "Taurus-Capricorn":
    "Taurus × Capricorn — Reliable, realistic and steady-building; ideal for long-term goals and plans.",
  "Taurus-Aquarius":
    "Taurus × Aquarius — Tradition meets rebellion; interesting contrast if you accept each other's quirks.",
  "Taurus-Pisces":
    "Taurus × Pisces — Gentle, creative and soothing; one offers grounding, the other emotional flow.",

  // GEMINI PAIRS
  "Gemini-Gemini":
    "Gemini × Gemini — Fast, witty and changeable; constant conversation, but follow-through takes effort.",
  "Gemini-Cancer":
    "Gemini × Cancer — Mind vs heart; emotional safety plus humour can make this surprisingly sweet.",
  "Gemini-Leo":
    "Gemini × Leo — Playful, dramatic and social; thrives on fun, praise and shared stories.",
  "Gemini-Virgo":
    "Gemini × Virgo — Both ruled by Mercury; detail and discussion overload, so schedule actual feelings.",
  "Gemini-Libra":
    "Gemini × Libra — Charming and airy; easy rapport, lots of ideas and a love of balance.",
  "Gemini-Scorpio":
    "Gemini × Scorpio — Light banter meets deep focus; honesty and consistency are make-or-break.",
  "Gemini-Sagittarius":
    "Gemini × Sagittarius — Curious and restless opposites; loves learning, travel and big philosophical chats.",
  "Gemini-Capricorn":
    "Gemini × Capricorn — Ideas vs structure; works when you respect each other's pace and priorities.",
  "Gemini-Aquarius":
    "Gemini × Aquarius — Brainy, quirky and future-oriented; friendship and ideas fuel the attraction.",
  "Gemini-Pisces":
    "Gemini × Pisces — Dreamy and talkative; needs clear communication to avoid mixed signals.",

  // CANCER PAIRS
  "Cancer-Cancer":
    "Cancer × Cancer — Deep, nurturing and moody; emotionally rich but needs boundaries and space.",
  "Cancer-Leo":
    "Cancer × Leo — Heart-led duo; one protects, one performs, both crave reassurance.",
  "Cancer-Virgo":
    "Cancer × Virgo — Caring and practical; small acts of service mean more than big speeches.",
  "Cancer-Libra":
    "Cancer × Libra — Security vs harmony; good when you balance emotions with fairness and style.",
  "Cancer-Scorpio":
    "Cancer × Scorpio — Intense, loyal and private; powerful emotional bond, but trust is everything.",
  "Cancer-Sagittarius":
    "Cancer × Sagittarius — Homebody meets explorer; honesty about needs keeps things from drifting.",
  "Cancer-Capricorn":
    "Cancer × Capricorn — Roots and ambition; opposite signs that can build something solid and lasting.",
  "Cancer-Aquarius":
    "Cancer × Aquarius — Feelings vs logic; patience and curiosity are needed to bridge worlds.",
  "Cancer-Pisces":
    "Cancer × Pisces — Soft, intuitive and protective; deeply caring connection if boundaries stay healthy.",

  // LEO PAIRS
  "Leo-Leo":
    "Leo × Leo — Bold, theatrical and warm; big love, big drama if ego runs wild.",
  "Leo-Virgo":
    "Leo × Virgo — Showmanship meets refinement; praise plus practical support keeps this glowing.",
  "Leo-Libra":
    "Leo × Libra — Romantic, stylish and social; you enjoy being seen and appreciated together.",
  "Leo-Scorpio":
    "Leo × Scorpio — Powerful, proud and intense; chemistry is high, compromise is crucial.",
  "Leo-Sagittarius":
    "Leo × Sagittarius — Fun, fiery and adventurous; best when life feels like an ongoing adventure.",
  "Leo-Capricorn":
    "Leo × Capricorn — Pride meets purpose; you can be a power couple if respect runs both ways.",
  "Leo-Aquarius":
    "Leo × Aquarius — Heart vs mind opposites; high-voltage connection that thrives on authenticity.",
  "Leo-Pisces":
    "Leo × Pisces — Dramatic meets dreamy; gentle reassurance and creativity keep this tender.",

  // VIRGO PAIRS
  "Virgo-Virgo":
    "Virgo × Virgo — Thoughtful, precise and cautious; great for projects, watch the self-criticism.",
  "Virgo-Libra":
    "Virgo × Libra — Tasteful and considerate; works when decisions don't get stuck in overthinking.",
  "Virgo-Scorpio":
    "Virgo × Scorpio — Quietly intense; detail plus depth can build strong, private loyalty.",
  "Virgo-Sagittarius":
    "Virgo × Sagittarius — Planner meets wanderer; honest communication keeps expectations realistic.",
  "Virgo-Capricorn":
    "Virgo × Capricorn — Responsible, grounded and dependable; ideal for building a stable life together.",
  "Virgo-Aquarius":
    "Virgo × Aquarius — Practical minds with different styles; inventive solutions if you stay flexible.",
  "Virgo-Pisces":
    "Virgo × Pisces — Logic meets intuition; you balance each other when criticism softens into care.",

  // LIBRA PAIRS
  "Libra-Libra":
    "Libra × Libra — Charming and diplomatic; harmony-focused but decisions can take forever.",
  "Libra-Scorpio":
    "Libra × Scorpio — Sweetness meets intensity; attraction is strong, honesty keeps it safe.",
  "Libra-Sagittarius":
    "Libra × Sagittarius — Social, curious and upbeat; shared experiences matter more than rigid plans.",
  "Libra-Capricorn":
    "Libra × Capricorn — Grace meets grit; you blend social finesse with practical ambition.",
  "Libra-Aquarius":
    "Libra × Aquarius — Airy, idealistic and friendly; great for friendship that grows into more.",
  "Libra-Pisces":
    "Libra × Pisces — Romantic and gentle; consider each other's needs clearly to avoid confusion.",

  // SCORPIO PAIRS
  "Scorpio-Scorpio":
    "Scorpio × Scorpio — Deep, magnetic and intense; incredible bond if trust is rock solid.",
  "Scorpio-Sagittarius":
    "Scorpio × Sagittarius — Intensity vs freedom; can be exciting, but needs honesty about limits.",
  "Scorpio-Capricorn":
    "Scorpio × Capricorn — Serious, strategic and loyal; you can build quietly powerful bonds.",
  "Scorpio-Aquarius":
    "Scorpio × Aquarius — Fixed and uncompromising; fascinating connection if you respect each other's edge.",
  "Scorpio-Pisces":
    "Scorpio × Pisces — Emotionally deep and intuitive; healing connection when power is handled gently.",

  // SAGITTARIUS PAIRS
  "Sagittarius-Sagittarius":
    "Sagittarius × Sagittarius — Restless, optimistic and blunt; thrives on freedom and shared adventures.",
  "Sagittarius-Capricorn":
    "Sagittarius × Capricorn — Spontaneity meets structure; works when you align goals and timing.",
  "Sagittarius-Aquarius":
    "Sagittarius × Aquarius — Independent, future-focused and idealistic; big visions and big debates.",
  "Sagittarius-Pisces":
    "Sagittarius × Pisces — Idealistic and changeable; compassionate honesty keeps things from drifting.",

  // CAPRICORN PAIRS
  "Capricorn-Capricorn":
    "Capricorn × Capricorn — Ambitious, steady and reserved; strong long-term potential if work doesn't eclipse warmth.",
  "Capricorn-Aquarius":
    "Capricorn × Aquarius — Tradition meets innovation; you can build new systems together if respect stays high.",
  "Capricorn-Pisces":
    "Capricorn × Pisces — Practical meets sensitive; structure plus empathy can feel surprisingly safe.",

  // AQUARIUS PAIRS
  "Aquarius-Aquarius":
    "Aquarius × Aquarius — Independent, future-minded and quirky; amazing mental rapport, feelings need conscious care.",
  "Aquarius-Pisces":
    "Aquarius × Pisces — Visionary and dreamy; you inspire each other but must ground your plans.",

  // PISCES PAIRS
  "Pisces-Pisces":
    "Pisces × Pisces — Soft, intuitive and romantic; beautiful connection if you keep one foot on the ground.",
};

export function getSunMatchBlurb(
  signA: WesternSign,
  signB: WesternSign
): string {
  const key = normalizePair(signA, signB);
  let blurb = SUN_MATCH_VIBES[key] ?? `${signA} × ${signB} — You bring different strengths; honest communication keeps this flowing.`;
  
  // Check if the blurb has the signs in the normalized order
  // If signA comes after signB in zodiac order, the blurb will have them swapped
  const signAIndex = SUN_SIGNS.indexOf(signA);
  const signBIndex = SUN_SIGNS.indexOf(signB);
  
  // If signA should come second (but we want it first), swap the signs in the blurb
  if (signAIndex > signBIndex) {
    // The blurb has signB × signA, we need to swap it to signA × signB
    const parts = blurb.split(' × ');
    if (parts.length >= 2) {
      // parts[0] = "SignB", parts[1] = "SignA — description"
      const [secondSign, ...descriptionParts] = parts[1].split(' — ');
      const description = descriptionParts.join(' — ');
      blurb = `${signA} × ${signB} — ${description}`;
    }
  }
  
  return blurb;
}

