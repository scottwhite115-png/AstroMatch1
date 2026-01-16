// lib/connectionOverview.ts

// --- TYPES --------------------------------------------------------

export type MatchLabel =
  | "Soulmate"
  | "Twin Flame"
  | "Excellent"
  | "Favourable"
  | "Neutral"
  | "Opposites Attract"
  | "Difficult";

const labelMeaningOptions: Record<MatchLabel, string[]> = {
  Soulmate: [
    "Astrologically, this is one of the strongest pairings in the system: deeply harmonious, familiar, and naturally suited to long-term partnership.",
    "On the chart level, this match sits in the top tier for ease, understanding, and long-range potential.",
  ],
  "Twin Flame": [
    "This combination is highly charged and significant, often experienced as intense, catalytic, and hard to ignore.",
    "Astrologically, this match tends to feel vivid and fated, with strong growth themes and a powerful pull.",
  ],
  Excellent: [
    "Overall, this is a strongly supportive match with easy chemistry and solid long-term potential.",
    "On paper, this pairing scores high for natural compatibility and mutual encouragement.",
  ],
  Favourable: [
    "This is a friendly, workable match that tends to feel natural when both people are in a good place.",
    "Astrologically, this sits in the 'good match' zone: plenty of support, with room for your own choices to shape it.",
  ],
  Neutral: [
    "This is a mid-range match—neither strongly pulled together nor pushed apart by karmic forces.",
  ],
  "Opposites Attract": [
    "This pairing often runs on contrast and chemistry: compelling and colourful, but not always simple.",
    "Astrologically, this is a polarity match: high interest and spark, with differences you'll definitely notice.",
  ],
  Difficult: [
    "This is a more challenging match, with patterns that can rub the wrong way if both people aren't self-aware.",
    "On the chart level, this pairing carries more friction aspects than average and usually asks for extra care and maturity.",
  ],
};

export type Pace = "slow" | "steady" | "fast";
export type Depth = "light" | "medium" | "intense";
export type Independence = "low" | "medium" | "high";

export type LoveNeed =
  | "freedom"
  | "reassurance"
  | "stability"
  | "adventure"
  | "novelty"
  | "intellectual_bond"
  | "emotional_depth"
  | "practical_support"
  | "playfulness"
  | "romance";

export type LoveDislike =
  | "control"
  | "jealousy"
  | "monotony"
  | "emotional_chaos"
  | "coldness"
  | "dishonesty"
  | "disrespect";

export interface LoveStyle {
  pace: Pace;
  depth: Depth;
  independence: Independence;
  needs: LoveNeed[];
  dislikes: LoveDislike[];
}

export interface EastWestProfile {
  id: string; // e.g. "aquarius_monkey"
  displayName: string; // e.g. "Aquarius Monkey"
  loveText?: string; // your Love & Relationships blurb
  loveStyle?: LoveStyle; // optional, kept for backwards compatibility with helper functions
}

// --- PAIR CONTEXT -------------------------------------------------

type PaceRelation =
  | "same_fast"
  | "same_steady"
  | "same_slow"
  | "a_faster"
  | "b_faster";

type DepthRelation =
  | "both_intense"
  | "both_light"
  | "a_deeper"
  | "b_deeper"
  | "mixed";

type IndependenceRelation =
  | "both_need_space"
  | "both_clingy"
  | "balanced"
  | "a_more_space"
  | "b_more_space";

export interface PairContext {
  a: EastWestProfile;
  b: EastWestProfile;
  label: MatchLabel;
  paceRelation: PaceRelation;
  depthRelation: DepthRelation;
  independenceRelation: IndependenceRelation;
  sharedNeeds: LoveNeed[];
  conflictingNeeds: Array<{ aNeed: LoveNeed; bNeed: LoveNeed }>;
  sharedDislikes: LoveDislike[];
}

// --- SMALL HELPERS ------------------------------------------------

function intersect<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return Array.from(new Set(a.filter(x => setB.has(x))));
}

function buildPaceRelation(a: LoveStyle, b: LoveStyle): PaceRelation {
  if (a.pace === b.pace) {
    if (a.pace === "fast") return "same_fast";
    if (a.pace === "steady") return "same_steady";
    return "same_slow";
  }
  // simple ordering: slow < steady < fast
  const order: Record<Pace, number> = { slow: 0, steady: 1, fast: 2 };
  return order[a.pace] > order[b.pace] ? "a_faster" : "b_faster";
}

function buildDepthRelation(a: LoveStyle, b: LoveStyle): DepthRelation {
  if (a.depth === b.depth) {
    if (a.depth === "intense") return "both_intense";
    if (a.depth === "light") return "both_light";
    return "mixed"; // both medium
  }
  const order: Record<Depth, number> = { light: 0, medium: 1, intense: 2 };
  return order[a.depth] > order[b.depth] ? "a_deeper" : "b_deeper";
}

function buildIndependenceRelation(
  a: LoveStyle,
  b: LoveStyle
): IndependenceRelation {
  if (a.independence === b.independence) {
    if (a.independence === "high") return "both_need_space";
    if (a.independence === "low") return "both_clingy";
    return "balanced";
  }
  const order: Record<Independence, number> = {
    low: 0,
    medium: 1,
    high: 2,
  };
  return order[a.independence] > order[b.independence]
    ? "a_more_space"
    : "b_more_space";
}

function buildConflictingNeeds(a: LoveStyle, b: LoveStyle) {
  const conflicts: Array<{ aNeed: LoveNeed; bNeed: LoveNeed }> = [];

  // simple, opinionated mappings
  const isSecurity = (n: LoveNeed) =>
    n === "reassurance" || n === "stability" || n === "practical_support";
  const isFreedom = (n: LoveNeed) => n === "freedom" || n === "adventure";

  a.needs.forEach(aNeed => {
    b.needs.forEach(bNeed => {
      if (isFreedom(aNeed) && isSecurity(bNeed)) {
        conflicts.push({ aNeed, bNeed });
      }
      if (isFreedom(bNeed) && isSecurity(aNeed)) {
        conflicts.push({ aNeed, bNeed });
      }
    });
  });

  return conflicts;
}

export function buildPairContext(
  a: EastWestProfile,
  b: EastWestProfile,
  label: MatchLabel
): PairContext {
  const sharedNeeds = intersect(a.loveStyle.needs, b.loveStyle.needs);
  const sharedDislikes = intersect(a.loveStyle.dislikes, b.loveStyle.dislikes);
  const conflictingNeeds = buildConflictingNeeds(a.loveStyle, b.loveStyle);

  return {
    a,
    b,
    label,
    paceRelation: buildPaceRelation(a.loveStyle, b.loveStyle),
    depthRelation: buildDepthRelation(a.loveStyle, b.loveStyle),
    independenceRelation: buildIndependenceRelation(
      a.loveStyle,
      b.loveStyle
    ),
    sharedNeeds,
    conflictingNeeds,
    sharedDislikes,
  };
}

// --- PHRASE HELPERS -----------------------------------------------

function needPhrase(need: LoveNeed): string {
  switch (need) {
    case "freedom":
      return "freedom and independence";
    case "reassurance":
      return "reassurance and emotional consistency";
    case "stability":
      return "reliability and stability";
    case "adventure":
      return "shared adventure and new experiences";
    case "novelty":
      return "novelty and change";
    case "intellectual_bond":
      return "good conversation and mental chemistry";
    case "emotional_depth":
      return "real emotional honesty and depth";
    case "practical_support":
      return "showing up in practical, everyday ways";
    case "playfulness":
      return "humour and playfulness";
    case "romance":
      return "romantic gestures and affection";
    default:
      return "feeling understood and appreciated";
  }
}

function sharedNeedsPhrase(needs: LoveNeed[]): string {
  if (!needs.length) return "feeling understood and valued";
  const primary = needPhrase(needs[0]);
  if (needs.length === 1) return primary;
  const secondary = needPhrase(needs[1]);
  return `${primary}, as well as ${secondary}`;
}

function sharedValuesPhrase(dislikes: LoveDislike[]): string {
  if (!dislikes.length) return "mutual respect and care";
  const map: Partial<Record<LoveDislike, string>> = {
    dishonesty: "honesty",
    disrespect: "basic respect",
    jealousy: "trust and emotional safety",
    control: "personal freedom and autonomy",
    emotional_chaos: "emotional steadiness",
    coldness: "warmth and responsiveness",
    monotony: "keeping the relationship alive and growing",
  };
  const values = dislikes
    .map(d => map[d])
    .filter(Boolean) as string[];

  if (!values.length) return "mutual respect and care";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values[0]}, ${values[1]}, and ${values[2]}`;
}

function keyNeed(profile: EastWestProfile): LoveNeed | null {
  // first priority: emotional_depth / reassurance / freedom / adventure / stability
  const priority: LoveNeed[] = [
    "emotional_depth",
    "reassurance",
    "freedom",
    "adventure",
    "stability",
    "intellectual_bond",
    "playfulness",
    "romance",
    "practical_support",
    "novelty",
  ];
  for (const p of priority) {
    if (profile.loveStyle.needs.includes(p)) return p;
  }
  return profile.loveStyle.needs[0] ?? null;
}

// --- PROFILE DESCRIPTION HELPERS ------------------------------------------

function describePace(profile: EastWestProfile): string {
  const p = profile.loveStyle.pace;
  if (p === "fast") return "quick-moving in love";
  if (p === "steady") return "steady and consistent once they care";
  return "cautious and slow to fully open up";
}

function describeIndependence(profile: EastWestProfile): string {
  const i = profile.loveStyle.independence;
  if (i === "high") return "needs plenty of space and autonomy";
  if (i === "medium") return "balances closeness with a healthy amount of independence";
  return "prefers reassurance and regular contact";
}

function describeDepth(profile: EastWestProfile): string {
  const d = profile.loveStyle.depth;
  if (d === "intense") return "feels things deeply and takes emotions seriously";
  if (d === "medium") return "can go deep when it matters but doesn't live in heavy feelings";
  return "does best when things stay fairly light and easy";
}

function neutralStyleSnapshot(profile: EastWestProfile): string {
  const parts: string[] = [];
  parts.push(describePace(profile));
  parts.push(describeIndependence(profile));
  if (profile.loveStyle.depth !== "medium") {
    parts.push(describeDepth(profile));
  }
  return parts.join(", and ");
}

function firstSentence(text?: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;

  const dotIndex = trimmed.indexOf(".");
  if (dotIndex === -1 || dotIndex > 280) {
    return trimmed.slice(0, 220).trim() + (trimmed.length > 220 ? "..." : "");
  }

  return trimmed.slice(0, dotIndex + 1).trim();
}

function loveSentenceFor(profile: EastWestProfile): string | null {
  const fromLove = firstSentence(profile.loveText);
  if (fromLove) return fromLove;

  // No fake filler. If we don't have a real Love & Relationships blurb yet,
  // just return null and let the label do the talking.
  return null;
}

function labelSentenceFor(
  a: EastWestProfile,
  b: EastWestProfile,
  label: MatchLabel
): string {
  const options = labelMeaningOptions[label];
  if (!options || options.length === 0) return "";

  const h = hashString(`${a.id}-${b.id}-${label}-label`);
  return options[h % options.length];
}

// --- NEUTRAL OVERVIEW GENERATOR -------------------------------------

function generateNeutralOverview(ctx: PairContext): string {
  const { a, b, sharedNeeds } = ctx;

  const aSentence =
    firstSentence(a.loveText) ??
    `${a.displayName} tends to approach love in a fairly balanced, middle-of-the-road way.`;

  const bSentence =
    firstSentence(b.loveText) ??
    `${b.displayName} brings a similarly moderate style to relationships.`;

  const pairLine =
    sharedNeeds.length > 0
      ? `Together this points to a connection that can feel gentle and low-pressure, with a quiet focus on ${sharedNeedsPhrase(
          sharedNeeds
        )}.`
      : `Together this points to a connection that can feel gentle and low-pressure, shaped more by your personalities than by any strong karmic pull.`;

  const closing =
    `Astrologically, it's the kind of match that often remains "nice enough" and may settle into a quietly comfortable bond when both people feel basically understood.`;

  return `${aSentence} ${bSentence} ${pairLine} ${closing}`;
}

function generateDifficultOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `This connection carries more built-in tension than most and can feel like hard work at times.`,
    c =>
      `There's a strong chance of friction here, especially when stress hits and both of you fall back on your default reactions.`,
  ];

  const middles = [
    c => {
      const { a, b } = c;
      const aNeed = keyNeed(a);
      const bNeed = keyNeed(b);

      const aPhrase = aNeed ? needPhrase(aNeed) : "feeling emotionally secure";
      const bPhrase = bNeed ? needPhrase(bNeed) : "not losing their sense of self";

      return `${a.displayName} is likely to push for ${aPhrase} when things feel wobbly, while ${b.displayName} instinctively protects ${bPhrase}. Those moves can easily collide and create cycles of pursuit, withdrawal, or sharp arguments.`;
    },
    c => {
      const { sharedNeeds } = c;
      if (sharedNeeds.length) {
        return `Underneath the conflict, you do share a desire for ${sharedNeedsPhrase(
          sharedNeeds
        )}, but it can be hard to see that in the moment when old patterns flare up.`;
      }
      return `You may sometimes feel like you're speaking different emotional languages, even when you both care, because your nervous systems are asking for completely different things.`;
    },
  ];

  const closings = [
    c =>
      `If you both have strong self-awareness, are willing to own your patterns, and can slow conflict down instead of escalating it, there are real lessons here—but it's rarely the path of least resistance.`,
    c =>
      `This match can work best when both people are already doing personal growth, open to therapy or honest feedback, and ready to choose understanding over winning during disagreements.`,
  ];

  return composeOverview(ctx, "difficult", intros, middles, closings);
}

function generateOppositesOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `There's a hint of "opposites attract" in the way you come together.`,
    c =>
      `This connection runs on contrast: you don't always think or react the same way, and that's a big part of the appeal.`,
  ];

  const middles = [
    c => {
      const { a, b, sharedDislikes } = c;
      const values = sharedValuesPhrase(sharedDislikes);

      return `${a.displayName} and ${b.displayName} might handle feelings, timing, or decisions differently, but you quietly agree on ${values}. Those shared values are the glue that helps everything else make sense.`;
    },
    c => {
      const aSnap = neutralStyleSnapshot(c.a);
      const bSnap = neutralStyleSnapshot(c.b);
      return `${c.a.displayName} tends to be ${aSnap}, whereas ${c.b.displayName} is ${bSnap}. That mix can be frustrating if you expect a clone of yourself—but it's also what keeps things interesting when life gets too predictable.`;
    },
  ];

  const closings = [
    c =>
      `When you remember you're on the same side and use your differences as extra tools rather than weapons, this kind of chemistry can feel vivid, playful, and surprisingly resilient.`,
    c =>
      `As long as you don't try to "fix" each other into matching your style, the contrast here brings colour and movement to the connection instead of constant conflict.`,
  ];

  return composeOverview(ctx, "opposites", intros, middles, closings);
}

// --- COMPOSE OVERVIEW HELPER -------------------------------------

function composeOverview(
  ctx: PairContext,
  variantKey: string,
  intros: Array<(c: PairContext) => string>,
  middles: Array<(c: PairContext) => string>,
  closings: Array<(c: PairContext) => string>
): string {
  const { a, b } = ctx;
  const hash = hashString(`${a.id}-${b.id}-${variantKey}-v1`);
  const introIdx = hash % intros.length;
  const middleIdx = Math.floor(hash / intros.length) % middles.length;
  const closingIdx =
    Math.floor(hash / (intros.length * middles.length)) % closings.length;

  return (
    intros[introIdx](ctx) +
    " " +
    middles[middleIdx](ctx) +
    " " +
    closings[closingIdx](ctx)
  );
}

function generateSupportiveFastOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `This connection feels energetic and alive right from the start, with both of you leaning into momentum rather than hesitation.`,
    c =>
      `There's a bright, fast-moving quality to this match that makes it hard to stay bored for long.`,
  ];

  const middles = [
    c => {
      const { a, b, sharedNeeds } = c;
      return `${a.displayName} and ${b.displayName} both move quickly when they care and respond strongly to ${sharedNeedsPhrase(
        sharedNeeds
      )}. You tend to spark off each other's ideas and impulses, which keeps the chemistry vivid and spontaneous.`;
    },
    c => {
      const aSnap = neutralStyleSnapshot(c.a);
      const bSnap = neutralStyleSnapshot(c.b);
      return `${c.a.displayName} is ${aSnap}, while ${c.b.displayName} is ${bSnap}. That shared appetite for movement and freedom makes it easier to grow side by side without feeling boxed in.`;
    },
  ];

  const closings = [
    c =>
      `The only real pitfall is racing ahead without checking how you're both actually feeling. When you build in honest conversations between the fun, this has the potential to stay exciting and genuinely supportive over time.`,
    c =>
      `If you can occasionally slow the pace just enough to listen, reassure each other, and follow through on what you promise, this doesn't just feel electric—it starts to feel like a solid partnership you can actually trust.`,
  ];

  return composeOverview(ctx, "supportive-fast", intros, middles, closings);
}

function generateSupportiveSteadyOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `This match is better suited to building something real than chasing short-lived drama.`,
    c =>
      `There's a grounded, steady flavour to this connection that favours long-term growth over instant fireworks.`,
  ];

  const middles = [
    c => {
      const { a, b, sharedNeeds } = c;
      return `${a.displayName} and ${b.displayName} usually take their time and value ${sharedNeedsPhrase(
        sharedNeeds
      )}. That makes it easier to feel safe, show up consistently, and trust that what you're building has substance behind it.`;
    },
    c => {
      const aSnap = neutralStyleSnapshot(c.a);
      const bSnap = neutralStyleSnapshot(c.b);
      return `${c.a.displayName} tends to be ${aSnap}, and ${c.b.displayName} is ${bSnap}. Together, that can look like shared routines, long conversations, and a sense of "we're in this together" when life gets busy.`;
    },
  ];

  const closings = [
    c =>
      `Just be careful not to disappear into habit or politeness. When you keep naming what you both need and make small efforts to surprise each other, this has the feel of a partnership that strengthens quietly year after year.`,
    c =>
      `As long as you keep talking honestly and occasionally step outside your comfort zones together, the stability here becomes a real strength rather than something that ever feels dull.`,
  ];

  return composeOverview(ctx, "supportive-steady", intros, middles, closings);
}

function generateSupportiveSamePaceOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `You're broadly aligned on how quickly a relationship should move, which removes a lot of unnecessary stress from the start.`,
    c =>
      `This connection runs on a compatible rhythm—even when your emotional needs don't always match perfectly.`,
  ];

  const middles = [
    c => {
      const { a, b, sharedNeeds } = c;
      const aNeed = keyNeed(a);
      const bNeed = keyNeed(b);
      const aPhrase = aNeed ? needPhrase(aNeed) : "feeling understood";
      const bPhrase = bNeed ? needPhrase(bNeed) : "having room to be themselves";

      return `${a.displayName} and ${b.displayName} share an appreciation for ${sharedNeedsPhrase(
        sharedNeeds
      )}, but you diverge around what feels most reassuring: one of you leans toward ${aPhrase}, while the other relaxes with more of ${bPhrase}.`;
    },
    c => {
      const aSnap = neutralStyleSnapshot(c.a);
      const bSnap = neutralStyleSnapshot(c.b);
      return `${c.a.displayName} is ${aSnap}, and ${c.b.displayName} is ${bSnap}. Those differences can create friction, but they also mean you bring different strengths to the table when life throws you curveballs.`;
    },
  ];

  const closings = [
    c =>
      `When you talk about these differences openly instead of guessing, you learn how to show care in ways that actually land—and that's where this match starts to feel genuinely strong.`,
    c =>
      `Handled with a bit of awareness, your different priorities become complementary rather than competitive, giving you both a sense that you're seen and supported for who you are.`,
  ];

  return composeOverview(ctx, "supportive-samepace", intros, middles, closings);
}

function generateSupportivePaceMismatchOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `There's a strong sense of recognition here, even if you don't always move at exactly the same speed.`,
    c =>
      `This is a naturally easy match that still comes with a small difference in timing around how quickly each of you leans in.`,
  ];

  const middles = [
    c => {
      const { a, b, paceRelation, sharedNeeds } = c;
      const faster = paceRelation === "a_faster" ? a : b;
      const slower = paceRelation === "a_faster" ? b : a;

      return `${faster.displayName} tends to decide and act faster, while ${slower.displayName} prefers a moment to feel things out. Because you share an instinct for ${sharedNeeds.length
        ? sharedNeedsPhrase(sharedNeeds)
        : "connection and mutual respect"
      }, that timing gap is more of a gentle adjustment than a problem.`;
    },
    c => {
      const { a, b, paceRelation } = c;
      const faster = paceRelation === "a_faster" ? a : b;
      const slower = paceRelation === "a_faster" ? b : a;

      return `${faster.displayName} often brings the spark and initiative, and ${slower.displayName} naturally adds a bit of grounding and perspective. Together that can feel like one of you opening doors and the other deciding which ones are worth walking through.`;
    },
  ];

  const closings = [
    c =>
      `When you talk about timing instead of guessing—sometimes slowing down a little, sometimes trusting the nudge forward—the different pace becomes a balance of spark and steadiness inside an already very compatible match.`,
    c =>
      `As long as you don't interpret the slower rhythm as disinterest or the faster one as pressure, this timing difference actually helps: one of you keeps things moving, the other makes sure what you build is real and sustainable.`,
  ];

  return composeOverview(ctx, "supportive-pacemismatch", intros, middles, closings);
}

function generatePaceMismatchOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `This match highlights a clear difference in how quickly each of you likes to move in love.`,
    c =>
      `One of you tends to press the accelerator while the other prefers a gentler glide, especially at the start.`,
  ];

  const middles = [
    c => {
      const { a, b, paceRelation } = c;
      const faster = paceRelation === "a_faster" ? a : b;
      const slower = paceRelation === "a_faster" ? b : a;

      return `${faster.displayName} often knows what they want quickly, while ${slower.displayName} usually needs more time to feel safe and sure. If you don't talk about that, pauses can be misread as disinterest or pressure.`;
    },
    c => {
      const { a, b, sharedNeeds } = c;
      return `Even with that mismatch, you can still find common ground through ${sharedNeeds.length
        ? sharedNeedsPhrase(sharedNeeds)
        : "simple, honest effort and clear communication"
      }. That's where the relationship feels less like a tug-of-war and more like teamwork.`;
    },
  ];

  const closings = [
    c =>
      `When you're willing to negotiate the pace—sometimes slowing down, sometimes leaning in—you get the benefit of both momentum and caution rather than feeling stuck in a pattern of push and pull.`,
    c =>
      `The more you can name your timing needs without blaming each other, the easier it becomes to meet in the middle and let the connection unfold at a pace that feels exciting but not overwhelming.`,
  ];

  return composeOverview(ctx, "pace-mismatch", intros, middles, closings);
}

function generateDepthMismatchOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `Emotionally, you don't always operate at the same depth or intensity.`,
    c =>
      `This match brings together one person who tends to dive in emotionally and another who's more comfortable closer to the surface.`,
  ];

  const middles = [
    c => {
      const { a, b, depthRelation } = c;
      const deeper =
        depthRelation === "a_deeper" ? a : depthRelation === "b_deeper" ? b : a;
      const lighter =
        depthRelation === "a_deeper" ? b : depthRelation === "b_deeper" ? a : b;

      return `${deeper.displayName} is more likely to notice undercurrents and want heart-to-heart talks, while ${lighter.displayName} often keeps things lighter or focuses on what's going well. That can be magnetic—serious meets carefree—but also confusing if you judge each other's style.`;
    },
    c => {
      const { sharedNeeds } = c;
      if (sharedNeeds.includes("emotional_depth")) {
        return `The good news is that you both, at some level, care about emotional honesty—it just shows up in different ways and at different times.`;
      }
      return `Even if you don't share the exact same emotional priorities, you can still build trust by learning how the other signals care, and not assuming silence means they don't feel anything.`;
    },
  ];

  const closings = [
    c =>
      `When you respect both the need for real talks and the need for levity, you end up with a relationship that feels emotionally alive without becoming heavy all the time.`,
    c =>
      `If you're willing to borrow a bit from each other's style—one softening the intensity, the other leaning into depth now and then—you can create a balance that makes both of you feel more understood.`,
  ];

  return composeOverview(ctx, "depth-mismatch", intros, middles, closings);
}

function generateSpaceSecurityOverview(ctx: PairContext): string {
  const intros = [
    c =>
      `There's a clear theme here around space and security in this connection.`,
    c =>
      `This match throws the classic "space versus closeness" dynamic into focus.`,
  ];

  const middles = [
    c => {
      const { a, b, independenceRelation } = c;
      const needsMoreSpace =
        independenceRelation === "a_more_space" ? a : b;
      const needsMoreReassurance =
        independenceRelation === "a_more_space" ? b : a;

      const spaceNeed = keyNeed(needsMoreSpace);
      const secNeed = keyNeed(needsMoreReassurance);

      return `${needsMoreSpace.displayName} needs room to breathe, explore, and stay independent${
        spaceNeed ? `, and they're nourished by ${needPhrase(spaceNeed)}` : ""
      }, while ${
        needsMoreReassurance.displayName
      } feels loved through consistency, closeness, and clear signals${
        secNeed ? `, especially when it comes to ${needPhrase(secNeed)}` : ""
      }. Neither is wrong—it's just a different love language.`;
    },
    c => {
      const { a, b, independenceRelation } = c;
      const needsMoreSpace =
        independenceRelation === "a_more_space" ? a : b;
      const needsMoreReassurance =
        independenceRelation === "a_more_space" ? b : a;

      const spaceNeed = keyNeed(needsMoreSpace);
      const secNeed = keyNeed(needsMoreReassurance);

      return `${needsMoreSpace.displayName} feels most alive when there's freedom to move, think, and explore${
        spaceNeed ? `, especially around ${needPhrase(spaceNeed)}` : ""
      }. ${
        needsMoreReassurance.displayName
      } relaxes when the bond feels steady, predictable, and emotionally clear${
        secNeed ? `, particularly through ${needPhrase(secNeed)}` : ""
      }.`;
    },
  ];

  const closings = [
    c => {
      const { a, b, independenceRelation } = c;
      const needsMoreSpace =
        independenceRelation === "a_more_space" ? a : b;
      const needsMoreReassurance =
        independenceRelation === "a_more_space" ? b : a;

      return `When ${needsMoreSpace.displayName} offers regular check-ins and honest reassurance, and ${
        needsMoreReassurance.displayName
      } gives a bit more freedom without panic, this tension becomes a growth point instead of a deal-breaker.`;
    },
    c =>
      `When both sides respect that this isn't personal—it's just wiring—you can set up simple rhythms and check-ins that let independence and security sit side by side.`,
  ];

  return composeOverview(ctx, "space-security", intros, middles, closings);
}

// --- VARIANT SELECTION SYSTEM -------------------------------------

// Deterministic hash for variant selection
// Simple deterministic hash so we can vary label phrasing a bit
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickVariantIndex(ctx: PairContext, variantCount: number): number {
  const base = `${ctx.a.id}-${ctx.b.id}-connection-v1`;
  const hash = hashString(base);
  return hash % variantCount; // 0..variantCount-1
}

// --- TEMPLATES + VARIANT SYSTEM ----------------------------------

// ---------- FAST & FREE (same_fast + both_need_space) ------------

// You can add up to 3–4 variants here
const fastFreeTemplates: Array<(ctx: PairContext) => string> = [
  // Variant 0
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `This connection feels quick, lively, and full of movement. ${a.displayName} and ${b.displayName} both move fast in love and thrive on ${sharedNeedsPhrase(
      sharedNeeds
    )}. You spark off each other's ideas and impulses, keeping things from ever feeling dull. The main risk is rushing ahead without checking in emotionally. If you can slow down just enough to listen, share feelings, and follow through on plans, this stays exciting and surprisingly steady over time.`;
  },
  // Variant 1
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `There's a lot of spark and spontaneity here. ${a.displayName} and ${b.displayName} both move quickly when they're interested and light up around ${sharedNeedsPhrase(
      sharedNeeds
    )}. You tend to dive into plans, jokes, and ideas before overthinking them, which keeps the energy fun and bright. Just watch the tendency to skip deeper check-ins or gloss over feelings. A bit of softness and reflection goes a long way toward making this something you can actually rely on, not just enjoy in the moment.`;
  },
  // Variant 2 (example third one – tweak tone however you like)
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `You're wired for momentum. ${a.displayName} and ${b.displayName} move fast, think fast, and bond through ${sharedNeedsPhrase(
      sharedNeeds
    )}. It's easy for you to say "yes" to adventures and keep the vibe playful and alive. What's harder is pausing long enough to check how you're both actually feeling. When you build in small moments of honesty between the fun, this connection can stay electric without burning out.`;
  },
];

// ---------- STEADY & DEEP (same_steady / same_slow) ---------------

const steadyDeepTemplates: Array<(ctx: PairContext) => string> = [
  // Variant 0
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `This is a connection that prefers depth over drama. Both ${a.displayName} and ${b.displayName} lean toward a steadier pace in love and value ${sharedNeedsPhrase(
      sharedNeeds
    )}. You're likely to build trust slowly and keep your promises once you commit. The challenge is avoiding ruts or silent assumptions. With honest conversations and small, consistent gestures, this becomes a quietly powerful bond that feels safe, grounding, and long-lasting.`;
  },
  // Variant 1
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `You're built more for slow-burn connection than whirlwind romance. ${a.displayName} and ${b.displayName} usually take their time, pay attention, and care about ${sharedNeedsPhrase(
      sharedNeeds
    )}. That makes it easier to feel safe and supported, especially once routines settle in. The risk is letting comfort turn into autopilot. If you keep sharing what's on your mind and occasionally shake things up together, this can feel like a solid partnership that deepens quietly over the years.`;
  },
  // Variant 2 – NEW
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `This match is well suited to building a life, not just a phase. ${a.displayName} and ${b.displayName} tend to move carefully, notice the details, and show love through ${sharedNeedsPhrase(
      sharedNeeds
    )}. Over time, that can look like shared routines, practical support, and a sense of "we've got each other." Just be mindful not to bury feelings under politeness or habit. When you keep talking about what you both need, the stability here becomes a real strength rather than something that ever feels dull.`;
  },
];

// ---------- SAME PACE, DIFFERENT NEEDS ---------------------------

const samePaceDifferentNeedsTemplates: Array<(ctx: PairContext) => string> = [
  // Variant 0
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    const aNeed = keyNeed(a);
    const bNeed = keyNeed(b);
    const aPhrase = aNeed ? needPhrase(aNeed) : "being met where they are";
    const bPhrase = bNeed ? needPhrase(bNeed) : "feeling accepted as they are";

    return `You move through relationships at a similar pace, which helps you find rhythm together. ${a.displayName} and ${b.displayName} both appreciate ${sharedNeedsPhrase(
      sharedNeeds
    )}, but you differ around what feels secure in love. One of you leans more toward ${aPhrase}, while the other instinctively reaches for ${bPhrase}. When you listen instead of defending your own style, you'll find ways to meet in the middle—keeping the connection warm without either of you feeling boxed in.`;
  },
  // Variant 1
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    const aNeed = keyNeed(a);
    const bNeed = keyNeed(b);
    const aPhrase = aNeed ? needPhrase(aNeed) : "feeling seen and understood";
    const bPhrase = bNeed ? needPhrase(bNeed) : "trusting they won't be judged";

    return `You're broadly on the same timeline in love, which is a big advantage. ${a.displayName} and ${b.displayName} understand when it's time to move closer or hold steady, and you share an appreciation for ${sharedNeedsPhrase(
      sharedNeeds
    )}. The tension appears when you start needing different things emotionally: one naturally reaches for ${aPhrase}, while the other relaxes when there's more of ${bPhrase}. Clear, calm conversations about what actually soothes you can turn this from a source of friction into a way you actively care for each other.`;
  },
  // Variant 2 – NEW
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    const aNeed = keyNeed(a);
    const bNeed = keyNeed(b);
    const aPhrase = aNeed ? needPhrase(aNeed) : "feeling held emotionally";
    const bPhrase = bNeed ? needPhrase(bNeed) : "having room to be themselves";

    return `You're in sync on how quickly things should move, but not always on what makes love feel "real." ${a.displayName} and ${b.displayName} both enjoy ${sharedNeedsPhrase(
      sharedNeeds
    )}, yet one of you feels most secure when there's more of ${aPhrase}, while the other relaxes when there's plenty of ${bPhrase}. Naming those differences openly instead of guessing lets you show up for each other in very practical ways—and that's what turns compatible potential into an actual, lived connection.`;
  },
];

// ---------- PACE MISMATCH ----------------------------------------

const paceMismatchTemplates: Array<(ctx: PairContext) => string> = [
  // Variant 0
  ctx => {
    const { a, b, paceRelation } = ctx;
    const faster = paceRelation === "a_faster" ? a : b;
    const slower = paceRelation === "a_faster" ? b : a;

    return `This pairing blends different speeds in love. ${faster.displayName} tends to decide and move quickly, while ${slower.displayName} prefers to take time, feel things out, and build trust step by step. Early on, ${faster.displayName} might feel things are dragging, and ${slower.displayName} might feel pushed or overwhelmed. If you can agree on a pace—and reassure each other as you go—you'll discover that the mix of momentum and caution actually balances the relationship in a good way.`;
  },
  // Variant 1
  ctx => {
    const { a, b, paceRelation } = ctx;
    const faster = paceRelation === "a_faster" ? a : b;
    const slower = paceRelation === "a_faster" ? b : a;

    return `${faster.displayName} often knows what they want quickly, while ${slower.displayName} usually needs more time to feel safe and sure. That difference in speed can be exciting at first but confusing later if you don't name it. ${faster.displayName} may read pauses as disinterest, and ${slower.displayName} can experience enthusiasm as pressure. When you respect each other's timing—checking in instead of assuming—you get the best of both worlds: initiative that still honours patience.`;
  },
  // Variant 2 – NEW
  ctx => {
    const { a, b, paceRelation } = ctx;
    const faster = paceRelation === "a_faster" ? a : b;
    const slower = paceRelation === "a_faster" ? b : a;

    return `Think of this as one person on the accelerator and the other on the brakes. ${faster.displayName} is quick to lean in, make plans, or define the connection, while ${slower.displayName} is more cautious and prefers to watch how things unfold. Neither role is wrong—you actually need both in a healthy relationship. When ${faster.displayName} slows their push just a little, and ${slower.displayName} shares what they're feeling instead of going quiet, the two of you can find a pace that feels exciting but not overwhelming.`;
  },
];

// ---------- SPACE VS SECURITY ------------------------------------

const spaceVsSecurityTemplates: Array<(ctx: PairContext) => string> = [
  ctx => {
    const { a, b, independenceRelation } = ctx;
    const needsMoreSpace =
      independenceRelation === "a_more_space" ? a : b;
    const needsMoreReassurance =
      independenceRelation === "a_more_space" ? b : a;

    const spaceNeed = keyNeed(needsMoreSpace);
    const secNeed = keyNeed(needsMoreReassurance);

    return `There's a clear theme here around space and security. ${needsMoreSpace.displayName} needs room to breathe, explore, and stay independent${
      spaceNeed ? `, and they're nourished by ${needPhrase(spaceNeed)}` : ""
    }, while ${
      needsMoreReassurance.displayName
    } feels loved through consistency, closeness, and clear signals${
      secNeed ? `, especially when it comes to ${needPhrase(secNeed)}` : ""
    }. Neither is wrong—it's just a different love language. When ${
      needsMoreSpace.displayName
    } offers regular check-ins and honest reassurance, and ${
      needsMoreReassurance.displayName
    } gives a bit more freedom without panic, this tension becomes a growth point instead of a deal-breaker.`;
  },
  ctx => {
    const { a, b, independenceRelation } = ctx;
    const needsMoreSpace =
      independenceRelation === "a_more_space" ? a : b;
    const needsMoreReassurance =
      independenceRelation === "a_more_space" ? b : a;

    const spaceNeed = keyNeed(needsMoreSpace);
    const secNeed = keyNeed(needsMoreReassurance);

    return `This match throws the classic "space versus closeness" dynamic into focus. ${needsMoreSpace.displayName} feels most alive when there's freedom to move, think, and explore${
      spaceNeed ? `, especially around ${needPhrase(spaceNeed)}` : ""
    }. ${
      needsMoreReassurance.displayName
    } relaxes when the bond feels steady, predictable, and emotionally clear${
      secNeed ? `, particularly through ${needPhrase(secNeed)}` : ""
    }. When both sides respect that this isn't personal—it's just wiring—you can set up simple rhythms and check-ins that let independence and security sit side by side.`;
  },
];

// ---------- DEPTH MISMATCH ---------------------------------------

const depthMismatchTemplates: Array<(ctx: PairContext) => string> = [
  ctx => {
    const { a, b, depthRelation } = ctx;
    const deeper =
      depthRelation === "a_deeper" ? a : depthRelation === "b_deeper" ? b : a;
    const lighter =
      depthRelation === "a_deeper" ? b : depthRelation === "b_deeper" ? a : b;

    return `Emotionally, you don't always swim at the same depth. ${deeper.displayName} tends to feel and process things intensely, looking for meaning and emotional honesty, while ${lighter.displayName} often keeps things more playful, flexible, or in the moment. This can be magnetic—serious meets carefree—but also confusing if you assume the other loves "wrong." When you respect both the need for heart-to-hearts and the need for lightness, the relationship can feel rich without becoming heavy.`;
  },
  ctx => {
    const { a, b, depthRelation } = ctx;
    const deeper =
      depthRelation === "a_deeper" ? a : depthRelation === "b_deeper" ? b : a;
    const lighter =
      depthRelation === "a_deeper" ? b : depthRelation === "b_deeper" ? a : b;

    return `One of you tends to go straight to the emotional core, while the other naturally stays closer to the surface. ${deeper.displayName} is likely to notice undercurrents, unspoken tension, and deeper meanings, whereas ${lighter.displayName} often prefers to keep things easygoing and not overcomplicate what's working. If you can treat those differences as complementary roles—one naming feelings, one keeping things buoyant—you get a relationship that feels both emotionally alive and not weighed down.`;
  },
];

// ---------- OPPOSITES WITH SHARED VALUES -------------------------

const oppositesSharedValuesTemplates: Array<(ctx: PairContext) => string> = [
  ctx => {
    const { a, b, sharedDislikes } = ctx;
    const values = sharedValuesPhrase(sharedDislikes);

    return `On the surface, you approach love differently, but you care about some of the same core things. ${a.displayName} might show affection in a different style to ${b.displayName}, yet you both strongly value ${values}. That's where the real glue sits. If you give each other room to express love in your own way—and keep coming back to those shared values—you turn your differences into contrast and chemistry instead of constant friction.`;
  },
  ctx => {
    const { a, b, sharedDislikes } = ctx;
    const values = sharedValuesPhrase(sharedDislikes);

    return `This match has a hint of "opposites attract," but underneath the stylistic differences, you share important non-negotiables. ${a.displayName} and ${b.displayName} might handle feelings, timing, or conflict in contrasting ways, yet you're on the same page about ${values}. When you remember that you're ultimately on the same side—and use your different strengths to protect those shared values—you get tension with purpose rather than tension for its own sake.`;
  },
];

// ---------- NEUTRAL ----------------------------------------------

const neutralTemplates: Array<(ctx: PairContext) => string> = [
  // Variant 0
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `This connection feels gentle and open-ended. ${a.displayName} and ${b.displayName} don't naturally clash, but you may also not ignite instantly without effort. Your styles in love can coexist comfortably, especially when you both stay curious and willing to learn how the other works. With a bit of initiative—planning time together, sharing honest thoughts, and noticing the small things—you can nudge this from "pleasant" into something quietly meaningful, especially when you remember your shared appreciation for ${sharedNeedsPhrase(
      sharedNeeds
    )}.`;
  },
  // Variant 1
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `This is more of a soft landing than a lightning strike. ${a.displayName} and ${b.displayName} aren't set up for constant drama, but you also might drift into a polite, half-engaged dynamic if no one takes the lead. Where you overlap is in your appreciation for ${sharedNeedsPhrase(
      sharedNeeds
    )}. If you're willing to invest a little energy—making plans, sharing what you're actually feeling, and finding small rituals—you can discover a connection that grows warmer and more comfortable over time.`;
  },
  // Variant 2 – NEW
  ctx => {
    const { a, b, sharedNeeds } = ctx;
    return `At first glance, this match feels easygoing and low-pressure. ${a.displayName} and ${b.displayName} can get along without too many sharp edges, but the energy may stay more "nice" than magnetic unless someone chooses to lean in. You're most likely to click when you build on your shared appreciation for ${sharedNeedsPhrase(
      sharedNeeds
    )}. When you treat each other as real people to get to know—not just another profile—you give this connection a chance to surprise you.`;
  },
];

// ---------- DIFFICULT --------------------------------------------

const difficultTemplates: Array<(ctx: PairContext) => string> = [
  // Variant 0
  ctx => {
    const { a, b } = ctx;
    const aNeed = keyNeed(a);
    const bNeed = keyNeed(b);

    const aPhrase = aNeed ? needPhrase(aNeed) : "feeling safe and understood";
    const bPhrase = bNeed ? needPhrase(bNeed) : "being accepted for who they are";

    return `This connection comes with real tension built into it. ${a.displayName} and ${b.displayName} often want different things at the same time—one might reach for ${aPhrase} while the other defaults to ${bPhrase}. When stress hits, your instincts can pull you in opposite directions, making it easy to misunderstand or escalate conflict. If you choose this match, it asks for extra patience, clear boundaries, and a lot of self-awareness. With maturity on both sides, there are lessons here—but it may not be the path of least resistance.`;
  },
  // Variant 1
  ctx => {
    const { a, b } = ctx;
    const aNeed = keyNeed(a);
    const bNeed = keyNeed(b);

    const aPhrase = aNeed ? needPhrase(aNeed) : "security and consistency";
    const bPhrase = bNeed ? needPhrase(bNeed) : "freedom to be themselves";

    return `There's strong potential for friction here. ${a.displayName} and ${b.displayName} can easily end up pulling in opposite directions, especially when one is trying to create ${aPhrase} while the other is fighting to protect ${bPhrase}. Little misunderstandings may escalate quickly if no one pauses to translate what they're actually needing. This match can work, but it's best suited to two people who are already doing personal growth—able to own their patterns, communicate clearly, and step back when conflict gets hot.`;
  },
  // Variant 2 – NEW
  ctx => {
    const { a, b } = ctx;
    const aNeed = keyNeed(a);
    const bNeed = keyNeed(b);

    const aPhrase = aNeed ? needPhrase(aNeed) : "feeling emotionally secure";
    const bPhrase = bNeed ? needPhrase(bNeed) : "not losing their sense of self";

    return `This pairing can feel like a pattern of push and pull if no one changes course. ${a.displayName} may double down on ${aPhrase} when things feel shaky, while ${b.displayName} instinctively protects ${bPhrase}. That dynamic can create cycles of pursuit, withdrawal, or sharp arguments that repeat the same theme. If you're both willing to slow down reactions, talk about what's actually underneath the tension, and sometimes meet halfway, you can soften the edges—but it's rarely an "easy mode" match.`;
  },
];

// --- MAIN SELECTOR -----------------------------------------------

import { patternSentence, type ChinesePatternKey } from "@/lib/compat/chinesePatterns";

export function generateConnectionOverview(
  label: MatchLabel,
  pattern: ChinesePatternKey
): string {
  const patternLine = patternSentence(pattern);

  // Enhanced label descriptions that work with the pattern line
  const labelLine = (() => {
    switch (label) {
      case "Soulmate":
        return "This is one of the most harmonious combinations in the system, combining deeply supportive astrological patterns with natural compatibility. The connection tends to feel familiar, comfortable, and built for long-term partnership. When both people are ready to commit and communicate openly, this pairing has exceptional potential to grow into something stable, loving, and genuinely supportive over time.";

      case "Twin Flame":
        return "This combination creates a powerful, magnetic connection that often feels intense and significant—more like a defining chapter than a casual encounter. The astrological patterns here suggest strong growth themes and a compelling pull that's hard to ignore. While the intensity can be exciting, it also asks for maturity, self-awareness, and the ability to navigate deep emotions without losing yourself in the process.";

      case "Excellent":
        return "This pairing scores high for natural compatibility, with strong chemistry and solid long-term potential when both people are in a healthy place. The astrological patterns support easy connection and mutual understanding. With consistent effort, honest communication, and a willingness to grow together, this match has the foundation to develop into a deeply satisfying partnership.";

      case "Favourable":
        return "This sits in the 'good match' zone: naturally workable and compatible, especially when you're both meeting each other halfway in real life. The patterns here are supportive without being overwhelming, leaving room for your personalities and choices to shape the connection. With mutual respect and consistent effort, this can develop into a warm, stable relationship.";

      case "Neutral":
        return "This is a mid-range match—neither strongly pulled together nor pushed apart by karmic forces, leaving more space for personality, timing, and choice to determine the outcome. The astrological patterns are neutral, which means the connection's success depends largely on how well you communicate, how much effort you both invest, and whether your life circumstances align. It can work beautifully with intention, but it may not have the automatic ease of higher-tier matches.";

      case "Opposites Attract":
        return "Astrologically, this behaves like a polarity match: strong interest and undeniable spark, with contrasts you'll definitely notice and need to navigate. The magnetic pull is real, but so are the differences in how you approach life, emotions, and relationships. When you remember you're on the same side and use your differences as complementary strengths rather than sources of conflict, this chemistry can feel vivid, exciting, and surprisingly resilient.";

      case "Difficult":
        return "The combination leans more challenging than average, with astrological patterns that can create friction and require extra care. This match asks for significant self-awareness, clear communication, and emotional maturity if you decide to pursue it. While there can be real growth and depth here, it's rarely the path of least resistance. Success depends on both people being willing to own their patterns, slow down during conflict, and choose understanding over winning.";

      default:
        return "This connection has unique characteristics that will unfold based on how both people choose to engage with it.";
    }
  })();

  // Combine pattern context with label-specific guidance
  return `${patternLine} ${labelLine}`.trim();
}

