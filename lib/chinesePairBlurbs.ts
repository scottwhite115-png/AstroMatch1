// chinesePairBlurbs.ts

export type ChineseAnimal =
  | "Rat" | "Ox" | "Tiger" | "Rabbit"
  | "Dragon" | "Snake" | "Horse" | "Goat"
  | "Monkey" | "Rooster" | "Dog" | "Pig";

const CHINESE_ORDER: ChineseAnimal[] = [
  "Rat","Ox","Tiger","Rabbit",
  "Dragon","Snake","Horse","Goat",
  "Monkey","Rooster","Dog","Pig"
];

function cnKey(a: ChineseAnimal, b: ChineseAnimal): string {
  const ia = CHINESE_ORDER.indexOf(a);
  const ib = CHINESE_ORDER.indexOf(b);
  const [first, second] = ia <= ib ? [a, b] : [b, a];
  return `${first}-${second}`;
}

// You'll call: chinesePairBlurbs[cnKey(animalA, animalB)]
export const chinesePairBlurbs: Record<string, string> = {
  // Rat × All 12
  "Rat-Rat":
    "Two Rats form a sharp, mentally alert connection with quick humour and intuitive understanding. But as a self-punishment Xing (相刑) pairing, overthinking and competitive tension can arise if boundaries blur. When both value transparency over guessing games, the relationship becomes supportive and dynamic. Mutual respect keeps the bond strong and productive.",

  "Rat-Ox":
    "Rat and Ox share a Liu He (六合) secret-friend bond, one of the most stable and supportive pairings in the zodiac. Rat supplies clever strategy and adaptability, while Ox offers commitment and grounded reliability. You complement each other beautifully, turning plans into results. This is one of Rat's safest and most enduring matches.",

  "Rat-Tiger":
    "Rat and Tiger both possess strong instincts but express them differently. Rat is strategic and methodical, while Tiger is impulsive and bold, creating an intriguing but uneven rhythm. With communication, the combination becomes energising. Respect for each other's style turns tension into teamwork.",

  "Rat-Rabbit":
    "Rat's sharpness pairs with Rabbit's sensitivity to form a thoughtful, quietly supportive match. Rabbit brings softness that balances Rat's intensity, while Rat brings stability through planning and insight. Though not rooted in San He or Liu He, the relationship grows steadily with kindness. Emotional pacing is key.",

  "Rat-Dragon":
    "Rat and Dragon belong to the San He (三合) visionary trine, creating one of Rat's most empowering matches. Rat's strategy strengthens Dragon's ambition, while Dragon's energy elevates Rat's ideas. You motivate each other naturally and work well toward big goals. This pairing is dynamic, confident, and highly compatible.",

  "Rat-Snake":
    "Rat and Snake share mental sharpness and subtle emotional depth, forming a quietly powerful partnership. Snake's calm insight complements Rat's strategic mind, creating a relationship built on intuition and long-term thinking. Though not a classical harmony, trust grows easily. The connection thrives in privacy and thoughtful conversation.",

  "Rat-Horse":
    "Rat and Horse sit in a Liu Chong (六冲) clash, where rhythm, priorities, and emotional needs differ sharply. Rat prefers planning and security, while Horse needs movement and independence, creating friction around pacing. Still, attraction can spark quickly. The relationship requires patience and careful communication to stabilise.",

  "Rat-Goat":
    "Rat and Goat fall under Liu Hai (六害), where misunderstandings stem from emotional contrasts. Rat's directness may unsettle Goat's sensitivity, while Goat's softer approach may confuse Rat's practicality. Emotional imbalance can occur if neither adjusts. With empathy and pacing, the match becomes workable but remains delicate.",

  "Rat-Monkey":
    "Rat and Monkey share the San He (三合) visionary trine, forming a clever, fast-moving, and mutually uplifting bond. Monkey's creativity and spontaneity blend perfectly with Rat's insight and adaptability. You enhance each other's talents and make decisions quickly. This is one of Rat's most exciting and naturally synergistic matches.",

  "Rat-Rooster":
    "Rat's flexible thinking contrasts with Rooster's structured precision, creating a bond full of both tension and respect. Rooster sharpens Rat's ideas, while Rat brings versatility and inventive solutions. Though not in San He or Liu He, this partnership grows through shared goals. It works best when criticism stays constructive.",

  "Rat-Dog":
    "Rat and Dog share sincerity and strong intuition, forming a genuine and supportive match. Dog's loyalty stabilises Rat's restless side, while Rat provides adaptability that helps Dog navigate life's complexities. You build trust through consistency. Emotional honesty is the heart of this connection.",

  "Rat-Pig":
    "Rat and Pig form a warm, gentle bond when each respects the other's emotional pace. Pig offers kindness and sincerity, while Rat provides structure and inventive problem-solving. There's no classical harmony, but goodwill grows easily. This is a nurturing connection when both stay patient.",

  // Ox × All 12 (note: Ox-Rat is the same as Rat-Ox, already added above)
  "Ox-Ox":
    "Two Oxen create a relationship defined by patience, persistence, and strong values. However, this pairing falls under the self-punishment form of Xing (相刑), meaning shared rigidity can lead to silent tension or emotional standstills. When both stay open to flexibility, the bond becomes deeply supportive and enduring. Mutual respect and gentle communication prevent stubbornness from taking over.",

  "Ox-Tiger":
    "Ox's steady approach contrasts with Tiger's intensity and fast action, creating a dynamic that requires conscious pacing. Without San He or Liu He support, both must adjust expectations to avoid frustration. When Ox stays open to change and Tiger respects stability, the match becomes surprisingly balanced. This connection works best with patience and shared structure.",

  "Ox-Rabbit":
    "Ox and Rabbit make a soft, thoughtful pairing where both value peace and sincerity. Rabbit's sensitivity blends well with Ox's calm consistency, creating emotional safety for both partners. Although not a major classical harmony, the connection grows naturally through mutual care. Kindness and shared comfort form the root of this match.",

  "Ox-Dragon":
    "Ox and Dragon fall under Po (相破), a break relationship where values and methods often diverge. Dragon moves boldly while Ox prefers practical pacing, creating tension around decision-making and momentum. With honest communication, the match can stabilise into mutual respect. Without it, small fractures in trust can widen quickly.",

  "Ox-Snake":
    "Ox and Snake share the San He (三合) strategic trine, giving this match depth, intelligence, and steady long-term potential. Snake's insight complements Ox's determination, creating a partnership built on thoughtful planning and subtle trust. This bond strengthens when both honour each other's inner world. It's one of the most harmonious combinations for Ox.",

  "Ox-Horse":
    "Ox and Horse form a Liu Hai (六害) damaging pair, where energy levels and priorities naturally clash. Ox prefers structure and reliability, while Horse needs movement and autonomy, creating emotional wear if unacknowledged. The connection can become draining without space and clear boundaries. Lightness and realism are essential for stability.",

  "Ox-Goat":
    "Ox and Goat sit opposite in a Liu Chong (六冲) clash pairing, often bringing misunderstandings and mismatched expectations. Ox's grounded nature can feel heavy to Goat, while Goat's shifting moods may unsettle Ox. Despite the tension, kindness and patience can soften the edges. This match requires openness and adaptability to thrive.",

  "Ox-Monkey":
    "Ox values steady effort while Monkey thrives on adaptability and quick changes, creating a rhythm that takes time to sync. Though not in San He or Liu He, the pairing works when each appreciates the other's strengths. Ox's dependability grounds Monkey, while Monkey's creativity opens Ox to new possibilities. Clear communication keeps the bond harmonious.",

  "Ox-Rooster":
    "Ox and Rooster share the San He (三合) strategic trine, creating a focused and mutually respectful partnership. Rooster's clarity aligns well with Ox's discipline, making it easy to collaborate and build long-term stability. Both appreciate commitment and consistent action. This is one of Ox's most naturally harmonious matches.",

  "Ox-Dog":
    "Ox and Dog both value loyalty and fairness, forming a dependable if understated pairing. Dog brings sincerity and intuitive guidance, while Ox provides structure and patience. Although not a classical harmony, the connection strengthens through shared values. Mutual encouragement helps this relationship grow steadily over time.",

  "Ox-Pig":
    "Ox and Pig create a warm, comforting bond built on kindness and sincerity. Pig's emotional softness helps Ox open up, while Ox's reliability gives Pig a sense of safety. This pairing isn't rooted in San He or Liu He, but it flourishes through consistent care. Gentle support keeps the relationship grounded and fulfilling.",

  // Tiger × All 12 (note: Tiger-Rat and Tiger-Ox are the same as Rat-Tiger and Ox-Tiger, already added above)
  "Tiger-Tiger":
    "Two Tigers create a powerful, passionate relationship with strong leadership energy on both sides. As a self-punishment Xing (相刑) pair, shared intensity can quickly escalate conflicts if pride takes over. When both practice patience and listening, the connection becomes unstoppable and deeply inspiring. Mutual respect turns competition into collaboration.",

  "Tiger-Rabbit":
    "Tiger's courage blends with Rabbit's diplomacy, creating a pairing that can balance strength and sensitivity. Tiger protects, while Rabbit soothes, but the emotional pace differs significantly. Without classical harmonies, the match thrives on compromise and gentle communication. When both honour each other's needs, this becomes a quietly supportive relationship.",

  "Tiger-Dragon":
    "Both Tiger and Dragon possess strong Yang energy, creating a dynamic filled with passion, ambition, and assertive momentum. Though not a San He or Liu He match, this partnership can feel powerful when goals align. Conflicts arise when neither wants to yield, but mutual admiration helps smooth edges. When handled well, this pairing burns brightly.",

  "Tiger-Snake":
    "Tiger and Snake fall under Liu Hai (六害), where instinct and temperament often clash beneath the surface. Tiger's openness contrasts with Snake's secrecy, and Snake may find Tiger too forceful. This match requires high emotional awareness to avoid misreading intentions. With respectful distance, the bond can remain functional, but deep blending is difficult.",

  "Tiger-Horse":
    "Tiger and Horse belong to the same San He (三合) Adventurer trine, creating one of the most naturally energising bonds. Both love movement, freedom, and bold ideas, giving the relationship excitement and forward thrust. You inspire each other to take risks and grow. This match thrives when communication stays open and purpose stays shared.",

  "Tiger-Goat":
    "Tiger's intensity can overwhelm Goat's sensitivity unless handled with care. Without San He or Liu He harmony, this relationship requires emotional pacing and willingness to meet in the middle. Goat brings warmth that softens Tiger's edge, while Tiger offers courage that supports Goat's confidence. With tenderness, this pairing becomes nurturing rather than stressful.",

  "Tiger-Monkey":
    "Tiger and Monkey sit directly opposite in the Liu Chong (六冲) system, creating a high-voltage clash pairing. Monkey's cleverness may frustrate Tiger's straightforward style, while Tiger's force can overwhelm Monkey's agility. Yet the chemistry is sharp and immediate, often making this pairing memorable. Success depends on humour, patience, and avoiding power struggles.",

  "Tiger-Rooster":
    "Tiger is bold and fast, while Rooster prefers precision and discipline, making this pairing prone to mismatched expectations. Without classical harmony, both must work to bridge communication differences. When Tiger respects Rooster's detail-oriented nature and Rooster softens rigidity, the connection becomes functional. Shared goals help these personalities complement each other.",

  "Tiger-Dog":
    "Tiger and Dog share the San He (三合) trine, forming a loyal, principled, and mutually supportive match. Dog steadies Tiger's aggression with sincerity, while Tiger protects Dog with courage and passion. This is a bond built on shared ideals and respect. Together, you create a relationship that feels safe, committed, and deeply aligned.",

  "Tiger-Pig":
    "Tiger and Pig form a Liu He (六合) secret-friend harmony, offering trust, emotional openness, and mutual encouragement. Pig softens Tiger's edges while Tiger strengthens Pig's resolve, creating a gentle yet empowered balance. This pairing thrives when communication stays honest and warm. It's one of Tiger's most quietly compatible matches.",

  // Rabbit × All 12 (note: Rabbit-Rat, Rabbit-Ox, and Rabbit-Tiger are the same as Rat-Rabbit, Ox-Rabbit, and Tiger-Rabbit, already added above)
  "Rabbit-Rabbit":
    "Two Rabbits create a deeply empathetic and emotionally intuitive pairing. But as a self-punishment Xing (相刑) match, shared sensitivities can amplify insecurities or withdrawal. When communication stays open and feelings are expressed clearly, the connection becomes nurturing and peaceful. The relationship thrives on gentleness and emotional honesty.",

  "Rabbit-Dragon":
    "Rabbit and Dragon sit in a Liu Hai (六害) damaging relationship, where temperament and priorities naturally clash. Dragon's boldness can overwhelm Rabbit's caution, while Rabbit's quiet approach may frustrate Dragon's drive. Emotional erosion can happen if issues are left unspoken. This pairing requires patience and clarity to stay balanced.",

  "Rabbit-Snake":
    "Rabbit's emotional intuition and Snake's psychological insight create a subtle, reflective connection. Though not a San He or Liu He match, the pairing has emotional depth when trust is present. Rabbit softens Snake's intensity, while Snake gives Rabbit a feeling of protection. This bond grows strongest through privacy and gentle honesty.",

  "Rabbit-Horse":
    "Rabbit and Horse fall into a Po (相破) break relationship, where pace and decision-making often clash. Rabbit prefers calm certainty, while Horse moves quickly on instinct, creating tension if not discussed. The relationship works best with shared structure and emotional transparency. Without it, misunderstandings can accumulate.",

  "Rabbit-Goat":
    "Rabbit and Goat share the San He (三合) Artist trine, making this one of Rabbit's most harmonious pairings. Both value kindness, sincerity, and emotional comfort, creating a gentle and nurturing bond. Conflict is rare when communication stays soft and supportive. This match flourishes through shared values and heartfelt gestures.",

  "Rabbit-Monkey":
    "Rabbit's calm sensitivity contrasts with Monkey's quick, playful energy, creating a lively but delicate blend. Without classical harmonies, compatibility relies on pacing and mutual respect. Rabbit helps Monkey slow down and reflect, while Monkey encourages Rabbit to explore new experiences. Together, the match becomes curious, warm, and balanced.",

  "Rabbit-Rooster":
    "Rabbit and Rooster fall under Liu Chong (六冲), a classical clash marked by contrasting communication styles. Rabbit favours tact and softness, while Rooster prefers precision and direct critique. This can create friction, but also growth when handled with care. Clear boundaries and appreciation for each other's strengths help stabilise the connection.",

  "Rabbit-Dog":
    "Rabbit and Dog share a Liu He (六合) secret-friend bond, offering deep emotional trust and natural companionship. Dog's loyalty comforts Rabbit, while Rabbit's gentleness helps Dog feel understood and appreciated. This pairing excels in honesty, mutual care, and long-term stability. It's one of Rabbit's most reliable and heartfelt matches.",

  "Rabbit-Pig":
    "Rabbit and Pig belong to the same San He (三合) Artist trine, creating emotional harmony, softness, and genuine affection. Both value kindness and connection, making the match peaceful and naturally supportive. Conflict is rare and easily resolved. This is one of the gentlest and most emotionally secure pairings in the zodiac.",

  // Dragon × All 12 (note: Dragon-Rat, Dragon-Ox, Dragon-Tiger, and Dragon-Rabbit are the same as Rat-Dragon, Ox-Dragon, Tiger-Dragon, and Rabbit-Dragon, already added above)
  "Dragon-Dragon":
    "Two Dragons create a bold, charismatic, and high-energy pairing, but one that falls under self-punishment Xing (相刑). Shared intensity can tilt into rivalry or stubbornness if not managed with care. When both learn to celebrate each other's strengths rather than compete, the match becomes dynamic and inspiring. Emotional maturity turns this pairing into a powerful team.",

  "Dragon-Snake":
    "Dragon and Snake share a Liu He (六合) secret-friend harmony, offering depth, insight, and intuitive understanding. Snake's subtle intelligence complements Dragon's bold presence, creating a connection that is both strategic and emotionally complex. You strengthen each other through trust and shared ambition. This is one of Dragon's most affirming relationships.",

  "Dragon-Horse":
    "Dragon and Horse both love excitement and forward movement, creating an energising bond. Though not a classical harmony, this match thrives on freedom, exploration, and shared enthusiasm. Conflicts arise when independence becomes competition. With balanced pacing, the relationship becomes vibrant and mutually motivating.",

  "Dragon-Goat":
    "Dragon's strong presence may initially overwhelm Goat's softer emotional tone. This isn't a San He or Liu He match, so compatibility relies on empathy and pacing rather than instinct. Goat brings emotional warmth, while Dragon offers protection and direction. When each respects the other's rhythm, the connection becomes tender and balanced.",

  "Dragon-Monkey":
    "Dragon and Monkey form the San He (三合) visionary trine, creating a match full of charisma, creativity, and mental spark. Monkey's cleverness helps Dragon act more efficiently, while Dragon's drive elevates Monkey's ideas. Together, you inspire one another with ease. This is a naturally synergistic and rewarding pairing.",

  "Dragon-Rooster":
    "Dragon and Rooster share a Liu He (六合) secret-friend bond, marked by clarity, loyalty, and shared ambition. Rooster's precision supports Dragon's big-picture thinking, making plans more grounded and achievable. Both respect commitment and reliability, strengthening trust over time. This is one of Dragon's most stable and capable matches.",

  "Dragon-Dog":
    "Dragon and Dog are a Liu Chong (六冲) clash pairing, where values and emotional approaches often conflict. Dragon seeks recognition and momentum, while Dog prioritises integrity and caution. Misunderstandings form quickly unless communication is explicit. With patience and empathy, this pairing can build respect, but it requires deliberate effort.",

  "Dragon-Pig":
    "Dragon's strength pairs well with Pig's warmth and generosity, creating a match that feels caring and aspirational. Though not rooted in San He or Liu He, both signs appreciate kindness and sincerity. Pig tempers Dragon's intensity, while Dragon gives Pig direction and confidence. This connection grows steadily when nurtured.",

  // Snake × All 12 (note: Snake-Rat, Snake-Ox, Snake-Tiger, Snake-Rabbit, and Snake-Dragon are the same as Rat-Snake, Ox-Snake, Tiger-Snake, Rabbit-Snake, and Dragon-Snake, already added above)
  "Snake-Snake":
    "Two Snakes create a bond full of intuition, depth, and unspoken understanding. But as a self-punishment Xing (相刑) pair, shared secrecy or sensitivity can lead to emotional stalemate. When communication is open, the relationship becomes deeply intimate. With patience, this pairing forms a lasting, almost telepathic connection.",

  "Snake-Horse":
    "Snake's measured approach contrasts with Horse's desire for motion and spontaneity. Without classical harmony, you must actively manage pacing and expectations. Snake brings strategy and reflection, while Horse brings momentum and optimism. The match grows when both appreciate what the other contributes.",

  "Snake-Goat":
    "Snake and Goat form a tender, thoughtful connection built on sensitivity and reflection. Goat adds warmth and emotional openness, while Snake offers calm and stability. Though not a San He or Liu He bond, the match strengthens through kindness and reassurance. It's a gentle pairing with quiet longevity.",

  "Snake-Monkey":
    "Snake and Monkey share the Liu He (六合) secret-friend harmony, combining wit, intelligence, and adaptability. Monkey energises Snake's ideas, while Snake anchors Monkey's restlessness with depth and clarity. This connection is mentally stimulating and emotionally nuanced. It's one of Snake's most naturally supportive relationships.",

  "Snake-Rooster":
    "Snake and Rooster belong to the San He (三合) strategic trine, forming a sharp, perceptive, and intellectually aligned partnership. Rooster's precision enhances Snake's insight, while Snake's calm intuition balances Rooster's intensity. Together, you create a relationship grounded in clarity and mutual respect. This is one of Snake's strongest matches.",

  "Snake-Dog":
    "Snake and Dog share sincerity and intuition, forming a bond built on honesty and emotional depth. Dog's loyalty provides security for Snake, while Snake's insight comforts Dog's anxieties. Though not a classical harmony, the match grows steadily with mutual reassurance. Trust is the anchor of this connection.",

  "Snake-Pig":
    "Snake and Pig form a Liu Chong (六冲) clash relationship, where emotional expression and priorities differ sharply. Snake's reserved nature can confuse Pig's openness, while Pig's vulnerability may overwhelm Snake's inward style. This pairing requires clear boundaries and patience. Without them, misunderstandings and emotional drain are common.",

  // Horse × All 12 (note: Horse-Rat, Horse-Ox, Horse-Tiger, Horse-Rabbit, Horse-Dragon, and Horse-Snake are the same as Rat-Horse, Ox-Horse, Tiger-Horse, Rabbit-Horse, Dragon-Horse, and Snake-Horse, already added above)
  "Horse-Horse":
    "Two Horses create a passionate, fast-moving relationship driven by enthusiasm and shared adventure. As a self-punishment Xing (相刑) match, however, impulsiveness and restlessness can escalate quickly. When you channel your energy into shared experiences rather than scattered impulses, the bond becomes joyful and inspiring. Mutual grounding keeps the connection stable.",

  "Horse-Goat":
    "Horse and Goat form a gentle Liu He (六合) harmony, offering emotional warmth, creativity, and complementary strengths. Goat's sensitivity softens Horse's intensity, while Horse uplifts Goat with optimism and encouragement. This pairing forms a deeply caring and nurturing bond. It's one of Horse's most comforting matches.",

  "Horse-Monkey":
    "Horse and Monkey share quick minds and lively energy, making the connection fun but sometimes unpredictable. Without classical harmony, both need to manage ego and pace. Monkey brings clever ideas, while Horse adds drive and momentum. Together, the pairing becomes adventurous when communication stays flexible.",

  "Horse-Rooster":
    "Horse values freedom and intuition, while Rooster prefers order and precision. The contrast creates tension but also growth if you appreciate each other's strengths. Rooster's planning provides clarity for Horse, while Horse injects vitality into Rooster's routines. Balance is key to making this relationship thrive.",

  "Horse-Dog":
    "Horse and Dog belong to the San He (三合) Adventurer trine, forming a supportive, purposeful, and deeply loyal connection. Dog gives emotional steadiness and integrity, while Horse brings inspiration and movement. Together, you align with shared ideals and mutual encouragement. This is one of Horse's most compatible and harmonious partnerships.",

  "Horse-Pig":
    "Horse and Pig share sincerity and enthusiasm, creating a friendly and emotionally warm bond. Pig seeks comfort and emotional depth, while Horse seeks stimulation and independence, which requires pacing to align. When both honour these needs, the partnership feels wholesome and uplifting. It's a kind, honest match with potential when nurtured.",

  // Goat × All 12 (note: Goat-Rat, Goat-Ox, Goat-Tiger, Goat-Rabbit, Goat-Dragon, Goat-Snake, and Goat-Horse are the same as Rat-Goat, Ox-Goat, Tiger-Goat, Rabbit-Goat, Dragon-Goat, Snake-Goat, and Horse-Goat, already added above)
  "Goat-Goat":
    "Two Goats create an emotionally intuitive partnership full of empathy, creativity, and shared sensitivity. But as a self-punishment Xing (相刑) match, tension can arise when insecurities mirror each other. When both communicate clearly and avoid retreating into silence, the bond becomes deeply loving. Patience and reassurance are key.",

  "Goat-Monkey":
    "Social and creative mix where playfulness meets emotion, so gentle handling goes a long way.",

  "Goat-Rooster":
    "Goat's emotional openness can clash with Rooster's precision and directness, creating misunderstandings if not managed gently. While not a classical harmony match, this relationship builds well through shared goals and mutual appreciation. Rooster provides clarity, and Goat brings warmth. Balance comes from respecting each other's communication styles.",

  "Goat-Dog":
    "Goat and Dog are part of the San He (三合) Artist/Companion trine (Rabbit–Goat–Pig and Tiger–Horse–Dog interlink harmoniously), sharing emotional sincerity and loyalty. Dog offers stability that comforts Goat, while Goat's warmth reassures Dog's protective nature. The connection is heartfelt, supportive, and built on trust. This is one of Goat's most genuinely grounding matches.",

  "Goat-Pig":
    "Goat and Pig belong to the San He (三合) Artist trine, forming a deeply warm, affectionate, and emotionally rich bond. Both are gentle, intuitive, and caring, making the relationship feel naturally safe. You comfort each other effortlessly and share a similar emotional language. This is one of the most compassionate and peaceful pairings in the zodiac.",

  // Rooster × All 12 (note: Rooster-Rat, Rooster-Ox, Rooster-Tiger, Rooster-Rabbit, Rooster-Dragon, Rooster-Snake, Rooster-Horse, and Rooster-Goat are the same as Rat-Rooster, Ox-Rooster, Tiger-Rooster, Rabbit-Rooster, Dragon-Rooster, Snake-Rooster, Horse-Rooster, and Goat-Rooster, already added above)
  "Rooster-Rooster":
    "Two Roosters create a relationship full of high standards, honesty, and strong values. But as a self-punishment Xing (相刑) pairing, you can become overly critical of each other or get stuck in perfectionism. When appreciation outweighs judgment, the connection becomes powerful and productive. This match thrives with warmth and shared purpose.",

  "Rooster-Monkey":
    "Rooster and Monkey both value intelligence but express it differently — Rooster through refinement, Monkey through improvisation. This creates friction but also admiration. Monkey can energise Rooster's plans, while Rooster gives Monkey direction and structure. It's a lively match that works best when egos stay in check.",

  "Rooster-Dog":
    "Rooster and Dog fall into Liu Hai (六害), where values and emotional styles don't naturally align. Dog seeks emotional truth, while Rooster prioritises accuracy and order, creating misunderstandings. Still, the loyalty and sincerity of both signs can keep the connection functional. Honesty with gentleness is essential.",

  "Rooster-Pig":
    "Rooster's forthrightness blends surprisingly well with Pig's softness and sincerity. Pig brings warmth that eases Rooster's rigidity, while Rooster provides structure that strengthens Pig's confidence. Though not a classical harmony, this match can become emotionally supportive. Kindness and consistency help it grow.",

  // Dog × All 12 (note: Dog-Rat, Dog-Ox, Dog-Tiger, Dog-Rabbit, Dog-Dragon, Dog-Snake, Dog-Horse, Dog-Goat, Dog-Monkey, and Dog-Rooster are the same as Rat-Dog, Ox-Dog, Tiger-Dog, Rabbit-Dog, Dragon-Dog, Snake-Dog, Horse-Dog, Goat-Dog, Monkey-Dog, and Rooster-Dog, already added above)
  "Dog-Dog":
    "Two Dogs create a loyal, heartfelt relationship full of shared values and unwavering commitment. But as a self-punishment Xing (相刑) match, shared intensity and worry can lead to emotional strain. When both practice reassurance and avoid overthinking, the bond becomes deeply protective and fulfilling. You create a safe emotional home for each other.",

  "Dog-Pig":
    "Dog and Pig form a gentle Liu He (六合) secret-friend harmony, bringing warmth, softness, and emotional sincerity into the relationship. Pig's compassion calms Dog's internal tension, while Dog provides loyalty and grounded reassurance. This pairing fosters emotional healing and mutual uplift. It's one of Dog's most affectionate and naturally compatible matches.",

  // Pig × All 12 (note: Pig-Rat, Pig-Ox, Pig-Tiger, Pig-Rabbit, Pig-Dragon, Pig-Snake, Pig-Horse, Pig-Goat, Pig-Monkey, Pig-Rooster, and Pig-Dog are the same as Rat-Pig, Ox-Pig, Tiger-Pig, Rabbit-Pig, Dragon-Pig, Snake-Pig, Horse-Pig, Goat-Pig, Monkey-Pig, Rooster-Pig, and Dog-Pig, already added above)
  "Pig-Pig":
    "Two Pigs create a compassionate, nurturing relationship full of warmth and generosity. However, as a self-punishment Xing (相刑) match, shared softness can lead to avoidance or emotional overextension. When both maintain boundaries and healthy communication, the relationship becomes beautifully supportive. This pairing thrives on mutual care and honesty.",

  // Monkey × All 12 - remaining pairs (note: Monkey-Rat, Monkey-Ox, Monkey-Tiger, Monkey-Rabbit, Monkey-Dragon, Monkey-Snake, Monkey-Horse, Monkey-Goat, Monkey-Rooster, and Monkey-Dog are already added above)
  "Monkey-Monkey":
    "Two Monkeys create a lively, intellectually stimulating relationship full of wit, adaptability, and shared curiosity. But as a self-punishment Xing (相刑) match, restlessness and scattered energy can challenge stability. When you channel your cleverness into shared projects and mutual support, the bond becomes dynamic and inspiring. Focus and commitment help this match thrive.",
};

// Export the helper function for use in other files
export { cnKey };

