// ------------------------------
// 1. WESTERN PERSONALITY TRAITS
// ------------------------------
export const westernTraits = {
  Aries: "direct and energised",
  Taurus: "steady and grounded",
  Gemini: "curious and adaptive",
  Cancer: "intuitive and protective",
  Leo: "expressive and warm",
  Virgo: "practical and observant",
  Libra: "balanced and social",
  Scorpio: "focused and perceptive",
  Sagittarius: "open and forward-moving",
  Capricorn: "structured and consistent",
  Aquarius: "independent and conceptual",
  Pisces: "intuitive and fluid"
};

// ---------------------------------------------------------
// 2. CHINESE ANIMAL RELATIONSHIPS (Honest + Practical tone)
// ---------------------------------------------------------
// NOTE: You will fill the full 144 with short, specific dynamics.
// I am giving 12 sample pairs to show structure.
// Continue the pattern for the full chart.
export const animalDynamics = {
  "Snake-Tiger": "Snake withdraws; Tiger pushes.",
  "Rabbit-Goat": "Rabbit harmonises; Goat follows softly.",
  // Tiger combinations (sorted alphabetically)
  "Ox-Tiger": "Ox resists; Tiger pushes harder.",
  "Rabbit-Tiger": "Rabbit withdraws; Tiger pushes.",
  "Rat-Tiger": "Rat shifts; Tiger pursues.",
  "Snake-Tiger": "Snake watches; Tiger strikes.",
  "Tiger-Tiger": "Tiger meets Tiger; intensity rises.",
  // Dog combinations (sorted alphabetically)
  "Dog-Dog": "Dog meets Dog; steady but cautious.",
  "Dog-Dragon": "Dragon pushes; Dog resists.",
  "Dog-Goat": "Goat softens; Dog guards.",
  "Dog-Horse": "Horse moves; Dog moderates.",
  "Dog-Monkey": "Monkey shifts; Dog grounds.",
  "Dog-Ox": "Ox holds; Dog guards.",
  "Dog-Pig": "Pig comforts; Dog anchors.",
  "Dog-Rabbit": "Rabbit trusts; Dog protects.",
  "Dog-Rat": "Rat pivots; Dog steadies.",
  "Dog-Rooster": "Rooster directs; Dog stabilises.",
  "Dog-Snake": "Snake withdraws; Dog stays alert.",
  "Dog-Tiger": "Tiger drives; Dog anchors.",
  // Dragon combinations (sorted alphabetically)
  "Dragon-Dragon": "Dragon meets Dragon; pace rises fast.",
  "Dragon-Goat": "Goat softens; Dragon intensifies.",
  "Dragon-Horse": "Horse runs; Dragon directs.",
  "Dragon-Monkey": "Monkey adapts; Dragon charges.",
  "Dragon-Ox": "Ox resists; Dragon pushes.",
  "Dragon-Pig": "Pig absorbs; Dragon asserts.",
  "Dragon-Rabbit": "Rabbit steadies; Dragon moves forward.",
  "Dragon-Rat": "Rat adjusts; Dragon leads.",
  "Dragon-Rooster": "Rooster guides; Dragon pushes.",
  "Dragon-Tiger": "Tiger challenges; Dragon escalates.",
  // Snake combinations (sorted alphabetically)
  "Dragon-Snake": "Dragon drives; Snake moderates.",
  "Ox-Snake": "Ox grounds; Snake watches.",
  "Rabbit-Snake": "Rabbit softens; Snake observes.",
  "Rat-Snake": "Rat advances; Snake evaluates.",
  "Snake-Snake": "Snake matches Snake; pace stays quiet.",
  "Snake-Tiger": "Tiger pushes; Snake resists.",
  // Horse combinations (sorted alphabetically)
  "Dragon-Horse": "Dragon directs; Horse keeps up.",
  "Horse-Horse": "Horse meets Horse; pace stays high.",
  "Horse-Monkey": "Monkey pivots; Horse pushes forward.",
  "Horse-Ox": "Ox slows; Horse pushes.",
  "Horse-Pig": "Pig softens; Horse advances.",
  "Horse-Rabbit": "Rabbit retreats; Horse advances.",
  "Horse-Rat": "Rat accelerates; Horse disrupts flow.",
  "Horse-Rooster": "Rooster critiques; Horse reacts.",
  "Horse-Snake": "Snake slows; Horse surges.",
  "Horse-Tiger": "Tiger drives; Horse matches pace.",
  // Goat combinations (sorted alphabetically)
  "Dragon-Goat": "Dragon pushes; Goat softens.",
  "Goat-Goat": "Goat syncs with Goat; pace stays soft.",
  "Goat-Horse": "Horse leads; Goat adapts.",
  "Goat-Monkey": "Monkey shifts; Goat absorbs.",
  "Goat-Ox": "Ox presses; Goat reacts unevenly.",
  "Goat-Pig": "Pig supports; Goat aligns.",
  "Goat-Rabbit": "Rabbit harmonises; Goat follows.",
  "Goat-Rat": "Rat presses; Goat retreats.",
  "Goat-Rooster": "Rooster corrects; Goat withdraws.",
  "Goat-Snake": "Snake steadies; Goat hesitates.",
  "Goat-Tiger": "Tiger challenges; Goat yields.",
  // Monkey combinations (sorted alphabetically)
  "Dragon-Monkey": "Dragon drives; Monkey pivots.",
  "Goat-Monkey": "Goat yields; Monkey moves.",
  "Horse-Monkey": "Horse pushes; Monkey redirects.",
  "Monkey-Monkey": "Monkey mirrors Monkey; pace stays lively.",
  "Monkey-Ox": "Ox holds; Monkey moves freely.",
  "Monkey-Pig": "Pig softens; Monkey shifts pace.",
  "Monkey-Rabbit": "Rabbit steadies; Monkey shifts.",
  "Monkey-Rat": "Rat adapts; Monkey improvises.",
  "Monkey-Snake": "Snake evaluates; Monkey moves.",
  "Monkey-Tiger": "Tiger pushes; Monkey sidesteps.",
  // Rabbit combinations (sorted alphabetically)
  "Ox-Rabbit": "Ox steadies; Rabbit softens.",
  "Rabbit-Rabbit": "Rabbit matches Rabbit; pace stays gentle.",
  "Rabbit-Rat": "Rat speeds; Rabbit moderates.",
  "Rabbit-Tiger": "Tiger pushes; Rabbit yields.",
  // Rat combinations (sorted alphabetically)
  // Rooster combinations (sorted alphabetically)
  "Dragon-Rooster": "Rooster guides; Dragon drives.",
  "Goat-Rooster": "Rooster directs; Goat hesitates.",
  "Horse-Rooster": "Rooster critiques; Horse pushes.",
  "Monkey-Rooster": "Rooster directs; Monkey improvises.",
  "Ox-Rooster": "Rooster directs; Ox stabilises.",
  "Rabbit-Rooster": "Rooster directs; Rabbit avoids.",
  "Rat-Rooster": "Rooster sharpens; Rat adjusts.",
  "Rooster-Rooster": "Rooster mirrors Rooster; pace stays sharp.",
  "Rooster-Snake": "Rooster clarifies; Snake refines.",
  "Rooster-Tiger": "Rooster critiques; Tiger reacts.",
  // Ox combinations (sorted alphabetically)
  "Ox-Ox": "Ox matches Ox; pace stays firm.",
  "Ox-Rabbit": "Rabbit softens; Ox stabilises.",
  "Ox-Rat": "Rat moves; Ox holds steady.",
  "Ox-Tiger": "Tiger pushes; Ox resists.",
  // Pig combinations (sorted alphabetically)
  "Dog-Pig": "Pig warms; Dog anchors.",
  "Dragon-Pig": "Pig absorbs; Dragon asserts.",
  "Goat-Pig": "Pig supports; Goat aligns.",
  "Horse-Pig": "Pig moderates; Horse accelerates.",
  "Monkey-Pig": "Pig steadies; Monkey moves.",
  "Ox-Pig": "Pig yields; Ox holds.",
  "Pig-Pig": "Pig mirrors Pig; pace stays gentle.",
  "Pig-Rabbit": "Pig comforts; Rabbit blends.",
  "Pig-Rat": "Pig softens; Rat moderates.",
  "Pig-Rooster": "Pig softens; Rooster sharpens.",
  "Pig-Snake": "Pig warms; Snake cools.",
  "Pig-Tiger": "Pig cushions; Tiger presses.",
  // Rat combinations (sorted alphabetically)
  "Rabbit-Rat": "Rabbit softens Rat's pace.",
  "Rat-Rat": "Rat mirrors Rat; pace stays quick.",
  // Continue building until all 144 pairs exist.
};

// Note: Use sorted keys like `${a}-${b}` alphabetically so order doesn't matter.

// ----------------------------------------
// 3. WESTERN ELEMENT INTERACTION SENTENCES
// ----------------------------------------
export const elementDynamics = {
  "Air-Fire": "Air fuels Fire; pace is quick and forward.",
  "Fire-Air": "Fire sparks Air; movement builds fast.",
  "Earth-Water": "Earth stabilises Water; steady and supportive.",
  "Water-Earth": "Water softens Earth; reliable emotional flow.",
  "Fire-Earth": "Fire pushes; Earth moderates pace.",
  "Earth-Fire": "Earth grounds Fire; structure helps progress.",
  "Air-Water": "Air analyses; Water feels. Needs pacing.",
  "Water-Air": "Water absorbs; Air clarifies. Needs balance.",
  "Fire-Water": "Fire heats Water; emotional pacing required.",
  "Water-Fire": "Water cools Fire; clarity keeps flow stable.",
  "Air-Earth": "Air moves; Earth holds. Planning helps.",
  "Earth-Air": "Earth steadies; Air reframes. Needs structure."
};

// ------------------------------
// 4. TIER TONE SENTENCES
// ------------------------------
export const tierTone = {
  "Soulmate": "Strong natural alignment; connection flows easily.",
  "Twin Flame": "High-energy pairing; growth comes through direct honesty.",
  "Excellent": "Clear compatibility; rhythm stays steady with minimal effort.",
  "Good Connection": "Works well with small adjustments; consistent pacing helps.",
  "Neutral": "Low friction match; direction depends on shared interest.",
  "Sparky Friends": "Fast-moving dynamic; thrives when communication stays grounded.",
  "Opposites Attract": "Contrast creates energy; balance comes from patience.",
  "Difficult Match": "Rhythms differ; clarity and pacing are key."
};

// ------------------------------
// 5. BLURB GENERATOR
// ------------------------------
export function buildConnectionBlurb({
  westA,
  westB,
  animalA,
  animalB,
  tierLabel,
  elementPair // e.g. "Air-Fire"
}) {
  // western traits
  const traitA = westernTraits[westA];
  const traitB = westernTraits[westB];

  // chinese dynamics
  const key =
    animalA < animalB
      ? `${animalA}-${animalB}`
      : `${animalB}-${animalA}`;
  const animalLine = animalDynamics[key] || "";

  // element sentence
  const elementLine = elementDynamics[elementPair] || "";

  // tier tone
  const tierLine = tierTone[tierLabel] || "";

  // -------------------------
  // BUILD FINAL BLURB
  // -------------------------
  return (
    `${westA} brings ${traitA}, while ${westB} brings ${traitB}, ` +
    `creating a mix that works best with honest pacing. ` +
    `${animalLine}. ` +
    `Elementally, ${elementLine}. ` +
    `${tierLine}`
  );
}
