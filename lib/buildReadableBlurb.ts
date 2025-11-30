// /lib/buildReadableBlurb.ts
import type { Person, MatchScore } from "@/lib/engine";

export function buildReadableBlurb(a: Person, b: Person, r: MatchScore): string[] {
  const reasons = r.reasons.join(" ");
  const eastTrine = /same trine/i.test(reasons);
  const eastClash = /clash/i.test(reasons);
  const airAir = /Western:\s*[A-Za-z]+\s*\(Air,.*\)\s*×\s*[A-Za-z]+\s*\(Air,/.test(reasons);
  const fireFire = /Western:\s*[A-Za-z]+\s*\(Fire,.*\)\s*×\s*[A-Za-z]+\s*\(Fire,/.test(reasons);
  const waterEarth = /\(Water,.*\).*\(Earth,/.test(reasons) || /\(Earth,.*\).*\(Water,/.test(reasons);
  const waterWater = /Western:\s*[A-Za-z]+\s*\(Water,.*\)\s*×\s*[A-Za-z]+\s*\(Water,/.test(reasons);
  const earthEarth = /Western:\s*[A-Za-z]+\s*\(Earth,.*\)\s*×\s*[A-Za-z]+\s*\(Earth,/.test(reasons);
  const fixedFixed = /Fixed.*×.*Fixed/.test(reasons);
  const mutableMut = /Mutable.*×.*Mutable/.test(reasons);

  const bullets: string[] = [];

  // 1. Spark / Initial chemistry
  if (airAir)
    bullets.push("Spark is instant — witty, playful, endlessly curious energy.");
  else if (fireFire)
    bullets.push("Spark is instant — lively, confident, flirtatious energy.");
  else if (waterEarth)
    bullets.push("The vibe is warm and grounding — you feel safe together.");
  else if (waterWater)
    bullets.push("Deep emotional connection — you understand each other without words.");
  else if (earthEarth)
    bullets.push("Steady, reliable chemistry — you build trust naturally.");
  else if (eastClash)
    bullets.push("Spark is electric — intense attraction with real friction.");
  else
    bullets.push("Different energies create intrigue — opposites attract here.");

  // 2. Challenge / Dynamic
  if (eastTrine && (airAir || fireFire))
    bullets.push("You challenge each other to stay sharp.");
  else if (eastTrine)
    bullets.push("You support each other's goals without effort.");
  else if (eastClash && fireFire)
    bullets.push("You challenge each other constantly — it's passionate but can be draining.");
  else if (eastClash)
    bullets.push("You push each other to grow, but need patience to avoid clashes.");
  else if (fixedFixed)
    bullets.push("Both of you dig in when challenged — compromise doesn't come easy.");
  else if (mutableMut)
    bullets.push("You adapt to each other easily, but need a shared direction.");
  else
    bullets.push("You balance action with flexibility — smooth teamwork.");

  // 3. Connection type / Tempo
  if (fireFire && eastTrine)
    bullets.push("It's a high-energy, passionate connection — never boring.");
  else if (airAir && eastTrine)
    bullets.push("It's a light, fun connection — conversation flows effortlessly.");
  else if (waterWater || waterEarth)
    bullets.push("It's a calm, nurturing connection — you recharge together.");
  else if (eastClash)
    bullets.push("It's an intense, dramatic connection — highs are high, lows are low.");
  else if (eastTrine)
    bullets.push("It's an easy, natural connection — you just click.");
  else
    bullets.push("It's a balanced connection — neither too intense nor too distant.");

  // 4. Growth advice
  if (airAir)
    bullets.push("Growth: slow down sometimes to let depth catch up with chemistry.");
  else if (fireFire)
    bullets.push("Growth: slow down sometimes to let depth catch up with chemistry.");
  else if (eastClash)
    bullets.push("Growth: pause before reacting — kindness during tension builds trust.");
  else if (fixedFixed)
    bullets.push("Growth: take turns leading — small compromises prevent big standoffs.");
  else if (waterEarth)
    bullets.push("Growth: celebrate your differences — they're what keep you balanced.");
  else if (mutableMut)
    bullets.push("Growth: set clear goals together — flexibility needs direction.");
  else
    bullets.push("Growth: keep communicating openly — honesty deepens the bond.");

  return bullets;
}
