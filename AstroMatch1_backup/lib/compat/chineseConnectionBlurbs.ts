// chineseConnectionBlurbs.ts
// Chinese zodiac connection blurbs for the connection box
// Key format: "UserA-UserB" with blurb written from UserA's perspective

export type ChineseAnimal =
  | "Rat"
  | "Ox"
  | "Tiger"
  | "Rabbit"
  | "Dragon"
  | "Snake"
  | "Horse"
  | "Goat"
  | "Monkey"
  | "Rooster"
  | "Dog"
  | "Pig";

// We key by "A-B" so the blurb can be written with User A first.
export type ChinesePairKey = `${ChineseAnimal}-${ChineseAnimal}`;

export const CHINESE_CONNECTION_BLURBS: Record<ChinesePairKey, string> = {
  // RAT AS A ▼
  "Rat-Rat":
    "Quick, mentally alert connection with lots of talk, planning, and problem-solving together.",
  "Rat-Ox":
    "Rat brings ideas and movement; Ox adds patience and stability, making a solid, practical pairing.",
  "Rat-Tiger":
    "Fast, energetic mix where quick thinking meets bold action, sometimes pushing toward strong moves.",
  "Rat-Rabbit":
    "Quiet, observant connection that pays attention to small changes in mood, tone, and surroundings.",
  "Rat-Dragon":
    "Shared focus on progress and results, with a sharp, ambitious feel and an eye on outcomes.",
  "Rat-Snake":
    "Calm on the surface but very watchful underneath, with careful timing and thoughtful moves.",
  "Rat-Horse":
    "Busy, changeable pairing that likes movement and can lose interest when things feel too routine.",
  "Rat-Goat":
    "Practical thinking meets emotional sensitivity, with a gentle tone that notices support and reassurance.",
  "Rat-Monkey":
    "Quick mental connection with lots of shared ideas; witty, playful, and mentally engaging together.",
  "Rat-Rooster":
    "Strong focus on order and efficiency, with attention to details and how things are done.",
  "Rat-Dog":
    "Serious, dependable feel, with a strong emphasis on loyalty, reliability, and follow-through.",
  "Rat-Pig":
    "Warm, considerate connection where quick awareness meets kindness and goodwill.",

  // OX AS A ▼
  "Ox-Rat":
    "Rat brings movement and ideas; Ox brings steadiness and follow-through, making plans more solid and realistic.",
  "Ox-Ox":
    "Slow, steady connection that values reliability, routine, and doing things properly over time.",
  "Ox-Tiger":
    "Ox prefers structure, Tiger prefers bold moves, creating a strong pairing that can clash over pace and control.",
  "Ox-Rabbit":
    "Calm, careful bond where Ox offers stability and Rabbit adds sensitivity and awareness of mood.",
  "Ox-Dragon":
    "Ox provides endurance while Dragon brings ambition, creating a determined pair that can handle big goals.",
  "Ox-Snake":
    "Both like to think before acting, giving this pairing a measured, strategic, and quietly stable feel.",
  "Ox-Horse":
    "Ox moves slowly and steadily; Horse moves quickly, creating effort and tension around timing and direction.",
  "Ox-Goat":
    "Steady Ox meets sensitive Goat, with practical support on one side and emotional depth on the other.",
  "Ox-Monkey":
    "Ox focuses on results while Monkey plays with options, making a capable pair that may differ on risk and style.",
  "Ox-Rooster":
    "Order and standards are important here, with attention to detail, routine, and doing things correctly.",
  "Ox-Dog":
    "Duty and loyalty stand out, with a serious approach to promises, work, and protecting what matters.",
  "Ox-Pig":
    "Life tends to move at a calm, manageable pace, with a focus on comfort, kindness, and simple stability.",

  // TIGER AS A ▼
  "Tiger-Rat":
    "Rat thinks ahead while Tiger moves quickly, creating an energetic pairing that leans toward strong, decisive action.",
  "Tiger-Ox":
    "Tiger pushes for change; Ox prefers stability, so there's strength here but tension around control and pace.",
  "Tiger-Tiger":
    "High-energy connection with big feelings on both sides, often direct, bold, and quick to react.",
  "Tiger-Rabbit":
    "Tiger is more forceful, Rabbit more gentle, making a caring bond that is sensitive to how conflict is expressed.",
  "Tiger-Dragon":
    "Both bring presence and drive, creating a dramatic, ambitious pairing drawn to big goals and impact.",
  "Tiger-Snake":
    "Tiger acts from instinct while Snake thinks things through, giving this match a quiet, intense, and watchful edge.",
  "Tiger-Horse":
    "Freedom and movement are central here, with a passionate, adventurous tone and a dislike of feeling held back.",
  "Tiger-Goat":
    "Tiger's directness meets Goat's sensitivity, creating an emotional bond that responds strongly to tone and reassurance.",
  "Tiger-Monkey":
    "Lively, competitive pairing where both are sharp and quick, with a tendency to test or challenge each other.",
  "Tiger-Rooster":
    "Tiger speaks plainly while Rooster watches details, making a straightforward match that can clash over criticism and control.",
  "Tiger-Dog":
    "Shared focus on loyalty and principle, with a protective, honest style and strong reactions to anything unfair.",
  "Tiger-Pig":
    "Tiger brings intensity; Pig brings softness, creating a warm bond that can be easily bruised by harsh words or anger.",

  // RABBIT AS A ▼
  "Rabbit-Rat":
    "Quiet, observant connection where both notice small shifts in mood and environment.",
  "Rabbit-Ox":
    "Ox brings stability while Rabbit brings sensitivity, creating a calm pairing that values safety and routine.",
  "Rabbit-Tiger":
    "Tiger is stronger in push, Rabbit softer in tone, making an emotional bond that reacts strongly to how conflict is handled.",
  "Rabbit-Rabbit":
    "Very gentle, inward-looking connection, easily affected by harsh words, tension, or unstable conditions.",
  "Rabbit-Dragon":
    "Soft Rabbit meets forceful Dragon, creating a mix of imagination, pressure, and awareness of power differences.",
  "Rabbit-Snake":
    "Both lean toward subtle signals over loud reactions, giving this match a quiet, intuitive, and private feel.",
  "Rabbit-Horse":
    "The pace can feel uneven, with warm feelings on both sides and sensitivity to change and consistency.",
  "Rabbit-Goat":
    "Tender, artistic pairing that values beauty, comfort, and emotional understanding.",
  "Rabbit-Monkey":
    "Clever energy meets a more delicate style, so teasing, speed, and tone can make a big difference.",
  "Rabbit-Rooster":
    "Neat, careful pairing that can get tense around criticism, standards, and small mistakes.",
  "Rabbit-Dog":
    "Caring, protective connection that is loyal, gentle, and easily worried about trust and security.",
  "Rabbit-Pig":
    "Soft, warm bond that leans into comfort, kindness, and shared emotional support.",

  // DRAGON AS A ▼
  "Dragon-Rat":
    "Shared focus on progress and results, with sharp thinking and a drive to move things forward.",
  "Dragon-Ox":
    "Dragon sets big goals while Ox provides steady effort, making a determined pairing that can handle a lot.",
  "Dragon-Tiger":
    "Both bring strong will and presence, creating a bold, intense match drawn to challenge and impact.",
  "Dragon-Rabbit":
    "Dragon is more forceful, Rabbit more gentle, so this bond mixes pressure, protection, and sensitivity.",
  "Dragon-Dragon":
    "Very strong, proud pairing that likes to lead, stand out, and push toward big outcomes.",
  "Dragon-Snake":
    "Ambition meets strategy, giving this match a controlled, thoughtful, and long-range feel.",
  "Dragon-Horse":
    "High energy and forward motion, with a shared taste for activity, risk, and new directions.",
  "Dragon-Goat":
    "Dragon brings drive; Goat brings feeling, creating an ambitious but emotionally sensitive connection.",
  "Dragon-Monkey":
    "Ideas and action link easily here, with a clever, energetic focus on projects and possibilities.",
  "Dragon-Rooster":
    "Image and standards matter, with organised effort and attention to how things are done and presented.",
  "Dragon-Dog":
    "Principle and pride can clash or combine, making a serious bond that reacts strongly to respect and fairness.",
  "Dragon-Pig":
    "Dragon brings intensity, Pig brings warmth, creating a generous connection that feels pressure when demands are high.",

  // SNAKE AS A ▼
  "Snake-Rat":
    "Calm on the surface but mentally active, with careful timing and a watchful approach to people and situations.",
  "Snake-Ox":
    "Both prefer slow, considered moves, creating a steady, private pairing focused on security and long-term outcomes.",
  "Snake-Tiger":
    "Tiger acts on instinct while Snake calculates, giving this match a tense but perceptive edge around power and control.",
  "Snake-Rabbit":
    "Quiet, subtle connection that relies on trust, soft handling, and reading unspoken signals.",
  "Snake-Dragon":
    "Ambition is filtered through strategy, creating a controlled, capable match that thinks in long arcs.",
  "Snake-Snake":
    "Very inward-focused pairing where feelings run deep but are rarely shown quickly.",
  "Snake-Horse":
    "Horse moves faster than Snake prefers, leading to active lives with some unease around pace and change.",
  "Snake-Goat":
    "Emotion runs under the surface, with both affected by atmosphere, tone, and how safe things feel.",
  "Snake-Monkey":
    "Both like to think several steps ahead, giving this pairing a clever, analytical, and often shrewd feel.",
  "Snake-Rooster":
    "Shared respect for precision, with a controlled, exacting tone and strong attention to detail.",
  "Snake-Dog":
    "Trust matters but takes time, creating a serious, reserved connection that opens slowly.",
  "Snake-Pig":
    "Softness meets guardedness, with kindness on one side and caution on the other, making honesty and consistency important.",

  // HORSE AS A ▼
  "Horse-Rat":
    "Busy, active connection where quick thinking and constant movement keep life from feeling still for long.",
  "Horse-Ox":
    "Horse wants change; Ox wants stability, creating effort and tension around pace, timing, and direction.",
  "Horse-Tiger":
    "Freedom and fire on both sides, making a passionate, outspoken match that dislikes feeling restricted.",
  "Horse-Rabbit":
    "Warm pairing with uneven speed, as Rabbit seeks reassurance while Horse leans toward motion and change.",
  "Horse-Dragon":
    "High-drive combination that pushes toward bigger goals, activity, and visible progress.",
  "Horse-Snake":
    "Movement meets caution, giving this bond an active but observant feel that watches before committing.",
  "Horse-Horse":
    "Very restless connection that likes variety, new experiences, and space to move independently.",
  "Horse-Goat":
    "Emotion and movement blend, with open expression and a strong response to stability and support.",
  "Horse-Monkey":
    "Fast-paced, lively match that enjoys stimulation, plans, and the freedom to switch things up.",
  "Horse-Rooster":
    "Busy, task-focused pairing where time, schedules, and expectations can become central themes.",
  "Horse-Dog":
    "Duty and activity combine, with loyalty to what matters and a serious approach to pulling weight.",
  "Horse-Pig":
    "Friendly, open connection that leans into enjoyment, social energy, and shared experiences.",

  // GOAT AS A ▼
  "Goat-Rat":
    "Practical worry from Rat meets emotional depth from Goat, creating a thoughtful bond that notices support and tone.",
  "Goat-Ox":
    "Steady Ox gives structure while Goat brings feeling, making a careful pairing that reacts strongly to criticism and pressure.",
  "Goat-Tiger":
    "Tiger is direct; Goat is sensitive, creating an expressive match that needs care with intensity and words.",
  "Goat-Rabbit":
    "Soft, artistic connection that leans into beauty, comfort, and emotional understanding.",
  "Goat-Dragon":
    "Dragon brings drive; Goat brings sensitivity, forming an ambitious bond that is easily affected by recognition and support.",
  "Goat-Snake":
    "Emotion runs under quiet surfaces, with both noticing trust, safety, and subtle shifts in mood.",
  "Goat-Horse":
    "Feeling and movement mix, with open expression and a strong response to stability, rhythm, and reliability.",
  "Goat-Goat":
    "Very tender pairing that can be deeply caring but easily unsettled by harshness or long-running stress.",
  "Goat-Monkey":
    "Social and creative mix where playfulness meets emotion, so gentle handling goes a long way.",
  "Goat-Rooster":
    "Goat brings softness while Rooster brings standards, forming a caring bond that reacts to feedback and tone.",
  "Goat-Dog":
    "Care and protection are central, with loyalty, support, and worry about security close to the surface.",
  "Goat-Pig":
    "Comfort-focused, affectionate pairing that leans into closeness, shared pleasures, and emotional support.",

  // MONKEY AS A ▼
  "Monkey-Rat":
    "Quick mental connection with lots of shared ideas; witty, playful, and mentally engaging together.",
  "Monkey-Ox":
    "Monkey brings flexibility to Ox's steadiness, making a capable pairing that can differ on risk, routine, and pace.",
  "Monkey-Tiger":
    "Competitive, high-energy match that can feel tense without clear respect and fair play.",
  "Monkey-Rabbit":
    "Clever energy meets a softer, more sensitive style, so humour and tone have a strong impact.",
  "Monkey-Dragon":
    "Ideas move easily toward action, with a shared focus on projects, results, and progress.",
  "Monkey-Snake":
    "Both like to think things through, giving this pairing a sharp, observant, and strategic feel.",
  "Monkey-Horse":
    "Fast-paced, lively connection that enjoys movement, stimulation, and freedom to change plans.",
  "Monkey-Goat":
    "Social and creative mix where playfulness meets emotion, so gentle handling goes a long way.",
  "Monkey-Monkey":
    "Very active mentally and socially, full of talk, jokes, and new ideas.",
  "Monkey-Rooster":
    "Monkey improvises while Rooster corrects, making a sharp pair that can slide into critique or debate.",
  "Monkey-Dog":
    "Curious mind meets strong conscience, with a shared interest in what feels honest and fair.",
  "Monkey-Pig":
    "Light, friendly connection where charm and warmth are clear on both sides.",

  // ROOSTER AS A ▼
  "Rooster-Rat":
    "Strong focus on efficiency and details, with low patience for waste or disorganisation.",
  "Rooster-Ox":
    "Both value structure and responsibility, making a disciplined, methodical pairing.",
  "Rooster-Tiger":
    "Rooster notices details while Tiger pushes hard, creating a direct match that can clash over tone and control.",
  "Rooster-Rabbit":
    "Tidy and careful, but easily tense around criticism, expectations, and small mistakes.",
  "Rooster-Dragon":
    "Presentation and standards matter, with organised effort and an eye on impact and reputation.",
  "Rooster-Snake":
    "Shared respect for precision and timing, giving this pairing a controlled, discerning feel.",
  "Rooster-Horse":
    "Busy, task-focused connection where time, schedules, and demands are constant themes.",
  "Rooster-Goat":
    "Goat brings softness while Rooster brings standards, making a caring match that reacts strongly to feedback and tone.",
  "Rooster-Monkey":
    "Monkey improvises, Rooster corrects, creating a clever pairing that can slide into arguments over details.",
  "Rooster-Rooster":
    "Very exacting bond that notices flaws quickly and cares about doing things the \"right\" way.",
  "Rooster-Dog":
    "Both care about duty and standards, with a serious approach to promises, work, and fairness.",
  "Rooster-Pig":
    "Rooster manages the practical side while Pig offers support, forming a helpful, attentive connection.",

  // DOG AS A ▼
  "Dog-Rat":
    "Rat spots opportunities while Dog checks for risks, creating a serious pairing focused on reliability.",
  "Dog-Ox":
    "Duty and steady effort align, with a grounded, responsible feel and respect for hard work.",
  "Dog-Tiger":
    "Both react strongly to unfairness, making an intense, honest bond built around loyalty and principle.",
  "Dog-Rabbit":
    "Caring, protective connection where safety, reassurance, and trust matter a lot.",
  "Dog-Dragon":
    "Dog's conviction meets Dragon's pride, creating a direct match that reacts quickly to respect or disrespect.",
  "Dog-Snake":
    "Trust builds slowly, with a reserved tone and careful reading of intentions.",
  "Dog-Horse":
    "Activity and duty combine, with loyalty to shared goals and a drive to keep things moving.",
  "Dog-Goat":
    "Supportive but often worried, with kindness, care, and concern about stability close to the surface.",
  "Dog-Monkey":
    "Curious mind meets strong conscience, bringing frank questions about what's fair and workable.",
  "Dog-Rooster":
    "Both care about standards and follow-through, with a straightforward, organised style.",
  "Dog-Dog":
    "Very loyal, serious pairing that treats commitment, promises, and protection as central.",
  "Dog-Pig":
    "Dog guards while Pig nurtures, creating a gentle, reassuring bond around safety and care.",

  // PIG AS A ▼
  "Pig-Rat":
    "Goodwill meets quick thinking, blending warmth, awareness, and sensitivity to tone.",
  "Pig-Ox":
    "Life tends to move at a steady pace, with a quiet focus on comfort, security, and routine.",
  "Pig-Tiger":
    "Pig softens Tiger's intensity, forming a warm, emotional bond that feels strong but easily bruised by rough edges.",
  "Pig-Rabbit":
    "Very gentle connection that leans into kindness, sentiment, and emotional support.",
  "Pig-Dragon":
    "Pig brings warmth to Dragon's drive, creating a generous pairing that can feel pressure when demands run high.",
  "Pig-Snake":
    "Softness meets caution, with a mix of kindness, watchfulness, and a need for honesty and consistency.",
  "Pig-Horse":
    "Open, sociable bond that enjoys company, activity, and shared experiences.",
  "Pig-Goat":
    "Comfort and emotion are central, with a romantic, indulgent tone and a strong focus on feeling safe together.",
  "Pig-Monkey":
    "Light, friendly connection where charm, humour, and easygoing energy stand out.",
  "Pig-Rooster":
    "Pig supports while Rooster organises, forming a helpful match that responds to both structure and appreciation.",
  "Pig-Dog":
    "Dog protects and Pig soothes, creating a caring, loyal bond centred on safety and understanding.",
  "Pig-Pig":
    "Very soft, accommodating pairing that prefers peace and can be easily drained by ongoing conflict.",
} as const;

/**
 * Get the Chinese connection blurb for a given pair,
 * always written with userA's sign first.
 */
export function getChineseConnectionBlurb(
  animalA: ChineseAnimal,
  animalB: ChineseAnimal
): string | null {
  const key = `${animalA}-${animalB}` as ChinesePairKey;
  return CHINESE_CONNECTION_BLURBS[key] ?? null;
}

