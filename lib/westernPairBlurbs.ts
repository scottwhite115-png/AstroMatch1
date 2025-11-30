// westernPairBlurbs.ts

export type WestSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer"
  | "Leo" | "Virgo" | "Libra" | "Scorpio"
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

const WEST_ORDER: WestSign[] = [
  "Aries","Taurus","Gemini","Cancer",
  "Leo","Virgo","Libra","Scorpio",
  "Sagittarius","Capricorn","Aquarius","Pisces"
];

function westKey(a: WestSign, b: WestSign): string {
  const ia = WEST_ORDER.indexOf(a);
  const ib = WEST_ORDER.indexOf(b);
  const [first, second] = ia <= ib ? [a, b] : [b, a];
  return `${first}-${second}`;
}

export const westernPairBlurbs: Record<string, string> = {
  // Aries × All 12 Signs
  "Aries-Aries":
    "Two Aries together create an exhilarating, high-energy dynamic where passion, competition, and spontaneity drive everything. You spark each other's confidence and thrive on shared challenges. The connection ignites fast but stays strong when both learn to cool the flames rather than escalate them. Respecting each other's independence is essential.",

  "Aries-Taurus":
    "Aries pushes forward quickly while Taurus prefers slow, steady progress, making this a blend of momentum and stability. Taurus grounds Aries' impulsiveness, while Aries inspires Taurus to take more risks. With patience, this becomes a loyal, balanced connection. The challenge is syncing pace and expectations.",

  "Aries-Gemini":
    "Aries and Gemini create a lively, mentally stimulating bond that feels exciting from the start. Gemini brings ideas and flexibility, while Aries brings action and direction. You energize each other's curiosity and independence. This works best when communication stays honest and distractions stay in check.",

  "Aries-Cancer":
    "Aries leads with momentum; Cancer leads with emotion — a pairing that requires conscious emotional pacing. When Aries learns softness and Cancer embraces confidence, the bond becomes surprisingly protective and warm. Cancer offers sensitivity that deepens Aries, while Aries encourages Cancer to be bold. Emotional timing is key here.",

  "Aries-Leo":
    "This is a vibrant, charismatic match where mutual enthusiasm and passion create strong chemistry. Leo admires Aries' courage, while Aries thrives on Leo's warmth and devotion. You push each other to shine brighter and dream bigger. The only caution: managing pride and intensity so things don't turn competitive.",

  "Aries-Virgo":
    "Virgo brings precision and thoughtful structure to Aries' impulsive momentum. Aries encourages Virgo to loosen up and trust spontaneity, while Virgo helps Aries refine plans and follow through. This pairing works when differences are seen as complementary rather than critical. Patience unlocks long-term stability.",

  "Aries-Libra":
    "Aries is direct and instinctive, while Libra seeks balance and harmony — creating a dynamic of active attraction and mirrored growth. Libra softens Aries' edges, and Aries helps Libra make firm decisions. Chemistry is strong and immediate, but emotional balance requires communication. Together you learn relationship skills you wouldn't learn elsewhere.",

  "Aries-Scorpio":
    "Both are intense, bold, and passionate — but Aries burns hot and fast while Scorpio navigates the emotional depths. The attraction is magnetic yet demanding, requiring strong emotional awareness from both sides. Scorpio offers depth, Aries offers drive. When trust is established, this becomes transformative; without it, volatile.",

  "Aries-Sagittarius":
    "Aries and Sagittarius share adventure, optimism, and an instinct for independence. The connection feels effortless because both value movement, excitement, and personal freedom. Sagittarius adds humor and perspective to Aries' intensity, while Aries fuels Sagittarius' drive. This is one of the most natural fire-fire pairings.",

  "Aries-Capricorn":
    "Aries brings initiative while Capricorn brings strategy, forming a powerful duo when aligned. Capricorn's discipline stabilizes Aries' impulsive nature, and Aries inspires Capricorn to take bold steps. This connection grows steadily when both honour timing and long-term goals. Respect and patience make it work.",

  "Aries-Aquarius":
    "Aries and Aquarius energize each other intellectually and creatively, forming a forward-moving, future-oriented match. Aquarius' originality intrigues Aries, while Aries' passion excites Aquarius. Independence is respected on both sides, giving the relationship room to breathe. This pairing thrives when communication stays flexible and open.",

  "Aries-Pisces":
    "Aries moves quickly; Pisces feels deeply — creating a dynamic that requires mutual emotional awareness. Pisces brings empathy and intuition, softening Aries' directness. Aries brings protection and confidence, helping Pisces feel grounded. When both prioritize gentle communication, this becomes unexpectedly healing.",

  // Taurus × All 12 Signs
  "Taurus-Aries":
    "Taurus values steadiness, while Aries thrives on speed — creating a blend of stability and momentum. Aries pushes Taurus out of routines, while Taurus teaches Aries patience and grounding. When both respect each other's pace, this becomes a loyal and mutually strengthening match. Flexibility is the key to harmony.",

  "Taurus-Taurus":
    "Two Taurus partners create a calm, sensual, and deeply loyal bond built on consistency and comfort. You understand each other's need for safety, routine, and genuine affection. The connection deepens slowly but lasts long-term. Keeping life from becoming overly predictable keeps the spark alive.",

  "Taurus-Gemini":
    "Taurus seeks stability; Gemini seeks movement — producing a dynamic that works when both appreciate what the other brings. Gemini energizes Taurus with curiosity and new ideas, while Taurus gives Gemini a grounding sense of presence. The challenge is aligning communication styles and expectations. Patience and adaptability make this workable.",

  "Taurus-Cancer":
    "Taurus and Cancer form one of the gentlest, most nurturing combinations. Taurus provides reliability and emotional calm, while Cancer offers intuitive care and tenderness. This match grows beautifully through shared routines and deep trust. Both value emotional safety, which becomes the foundation of the bond.",

  "Taurus-Leo":
    "Taurus builds slowly; Leo leads with boldness — creating a connection that requires mutual appreciation. Leo brings flair and excitement, while Taurus offers steadfast loyalty and grounding. Both are strong-willed, so compromise is essential. Admiration and respect keep this pairing thriving.",

  "Taurus-Virgo":
    "Taurus and Virgo create a stable, practical, and deeply dependable partnership. Virgo's thoughtful precision complements Taurus' patience and warmth. Together you build routines that feel safe and purposeful. Emotional connection grows through acts of service and consistency.",

  "Taurus-Libra":
    "Both appreciate beauty and comfort, but in very different ways. Libra looks for harmony through dialogue and connection, while Taurus values solidity and calm. When you meet in the middle, Libra lightens Taurus' world with elegance and charm, while Taurus anchors Libra emotionally. Balance comes from slow, intentional communication.",

  "Taurus-Scorpio":
    "Taurus brings sensual stability while Scorpio brings emotional depth — creating an intense, magnetic connection. The attraction is undeniable but requires emotional maturity on both sides. Scorpio pushes Taurus toward transformation, and Taurus gives Scorpio grounded safety. Power dynamics must be handled gently.",

  "Taurus-Sagittarius":
    "Taurus seeks consistency; Sagittarius seeks freedom — leading to different rhythms. Sagittarius adds adventure and enthusiasm to Taurus' world, while Taurus gives Sagittarius emotional steadiness. Compromise around space and pacing is crucial. When both feel respected, the connection becomes surprisingly supportive.",

  "Taurus-Capricorn":
    "This is a long-term, reliable match where shared values and practicality align naturally. Capricorn's ambition pairs well with Taurus' consistency, creating a grounded and productive bond. Emotional expression grows steadily through loyalty and mutual respect. Together you build a solid future.",

  "Taurus-Aquarius":
    "Taurus is steady and tactile, while Aquarius is independent and conceptual — making this a pairing that requires patience. Aquarius expands Taurus' worldview with originality, while Taurus anchors Aquarius emotionally. The connection works when both accept each other's very different needs. Flexibility and understanding are essential.",

  "Taurus-Pisces":
    "Taurus and Pisces create a gentle, compassionate bond full of soft emotional resonance. Pisces brings imagination and empathy, while Taurus offers grounding and consistency. You understand each other intuitively, often without needing many words. This match grows strong through kindness and emotional safety.",

  // Gemini × All 12 Signs
  "Gemini-Aries":
    "Gemini and Aries create a lively, spontaneous connection driven by curiosity and shared momentum. Aries brings direction and boldness, while Gemini adds flexibility and humour. You amplify each other's energy and independence. Keeping communication open keeps the bond strong.",

  "Gemini-Taurus":
    "Taurus grounds the connection, while Gemini keeps it moving — a contrast that works when both embrace each other's strengths. Gemini introduces new ideas and perspectives, while Taurus offers steadiness and emotional calm. The challenge is balancing consistency with variety. With mutual respect, this becomes surprisingly supportive.",

  "Gemini-Gemini":
    "Two Geminis create a dynamic, mentally electric bond where conversation never runs dry. You inspire each other's curiosity and enjoy constant movement, ideas, and change. Emotional depth grows slowly but naturally. The relationship thrives when both prioritize presence over distraction.",

  "Gemini-Cancer":
    "Cancer feels deeply; Gemini thinks quickly — creating a blend of emotion and intellect that requires sensitivity. Cancer offers emotional warmth that grounds Gemini, while Gemini brings lightness and perspective to Cancer's world. The connection grows when both adjust their communication styles. Gentle honesty is essential.",

  "Gemini-Leo":
    "Gemini and Leo spark instantly, sharing enthusiasm, playfulness, and a taste for adventure. Leo brings warmth and charisma, while Gemini brings wit and adaptability. The bond feels vibrant and expressive. Consistency in emotional follow-through deepens the connection.",

  "Gemini-Virgo":
    "Both signs are mentally driven and detail-aware, but in different ways — Gemini explores broadly while Virgo refines deeply. Conversation is rich and stimulating, but emotional pacing needs care. When both avoid overthinking, this becomes a productive, thoughtful connection. Intellectual respect is the foundation.",

  "Gemini-Libra":
    "This pairing flows effortlessly with shared social ease, curiosity, and aesthetic appreciation. Libra brings harmony and intention, while Gemini brings movement and ideas. You understand each other's need for freedom and variety. The bond thrives through communication and shared experiences.",

  "Gemini-Scorpio":
    "Scorpio leads with emotional intensity, while Gemini leads with mental agility — creating a magnetic yet demanding polarity. Gemini offers Scorpio perspective and flexibility, while Scorpio brings emotional depth that challenges Gemini to grow. Honesty and boundaries are crucial. This match evolves when both commit to understanding each other's layers.",

  "Gemini-Sagittarius":
    "Gemini and Sagittarius share curiosity, exploration, and an appetite for freedom — making this one of the most energizing opposite-sign pairings. Sagittarius brings big-picture insight, while Gemini contributes adaptability and lightness. The connection feels expansive when neither tries to limit the other. Adventure and mutual respect keep the dynamic healthy.",

  "Gemini-Capricorn":
    "Capricorn seeks structure and long-term clarity, while Gemini prefers fluidity and multiple possibilities. When you meet in the middle, Capricorn offers grounding and consistency, and Gemini brings creativity and fresh perspectives. The key is aligning goals and communication. This works best when both honour each other's pace.",

  "Gemini-Aquarius":
    "Gemini and Aquarius connect easily through shared intellect, originality, and independence. Aquarius brings vision and idealism; Gemini brings adaptability and curiosity. You inspire each other's growth without feeling confined. Emotional depth develops naturally through shared ideas and experiences.",

  "Gemini-Pisces":
    "Pisces feels intuitively, Gemini thinks analytically — creating a dreamy yet delicate dynamic. Pisces adds compassion and imagination to Gemini's world, while Gemini helps Pisces communicate clearly and stay grounded. When both approach differences gently, the match becomes emotionally uplifting. Sensitivity and patience are essential.",

  // Cancer × All 12 Signs
  "Cancer-Aries":
    "Cancer feels first; Aries acts first — creating a rhythm that requires emotional pacing. Aries brings courage and momentum that help Cancer step out of their shell, while Cancer softens Aries' edges and teaches emotional attunement. The chemistry can be warm and protective when both listen closely. Patience on both sides is essential.",

  "Cancer-Taurus":
    "Cancer and Taurus form a naturally comforting connection built on loyalty, tenderness, and emotional safety. Taurus provides stability that helps Cancer feel secure, while Cancer brings nurturing warmth that deepens Taurus' sense of home. You build trust slowly but beautifully. Shared values make this one of the gentlest pairings.",

  "Cancer-Gemini":
    "Cancer absorbs emotion; Gemini moves through ideas — a contrast that works when communication stays thoughtful and patient. Gemini brings lightness and curiosity to Cancer's world, while Cancer offers emotional grounding and sincerity. When both meet halfway, the bond becomes surprisingly supportive. Emotional clarity is key.",

  "Cancer-Cancer":
    "Two Cancers create an intuitive, emotionally rich bond where feelings flow deeply and naturally. You understand each other's need for safety, reassurance, and closeness. The connection feels soulful and protective, though emotional intensity needs conscious balance. Boundaries help keep the relationship steady.",

  "Cancer-Leo":
    "Leo leads with warmth and confidence, while Cancer leads with care and sensitivity — creating a dynamic that works when both value what the other gives. Cancer softens Leo's boldness, and Leo lifts Cancer into brighter emotional territory. Affection is strong, but emotional timing must be respected. Communication keeps things smooth.",

  "Cancer-Virgo":
    "Cancer and Virgo form a thoughtful, nurturing partnership built on trust, care, and quiet loyalty. Virgo brings structure and support, while Cancer brings emotional insight and warmth. You help each other feel understood and grounded. This pairing grows slowly into something deeply reliable.",

  "Cancer-Libra":
    "Cancer moves through emotion, whereas Libra seeks harmony through perspective — creating a delicate but workable contrast. Libra offers calm communication that helps Cancer feel heard, while Cancer brings depth and authenticity that grounds Libra. Balance comes through honest conversation. Mutual reassurance strengthens the bond.",

  "Cancer-Scorpio":
    "Cancer and Scorpio create a powerful emotional connection marked by loyalty, intuition, and depth. Cancer offers softness and emotional safety, while Scorpio provides intensity and unwavering devotion. Trust builds quickly when both feel secure. This match has transformative potential when communicated clearly.",

  "Cancer-Sagittarius":
    "Sagittarius values freedom and exploration, while Cancer values emotional closeness — a contrast that requires conscious compromise. Sagittarius brings optimism that uplifts Cancer, while Cancer offers warmth that helps Sagittarius feel understood. When space and emotional needs are respected, the match becomes surprisingly enriching. Boundaries matter.",

  "Cancer-Capricorn":
    "Cancer leads with heart; Capricorn leads with structure — forming a classic polarity that feels stabilizing and purposeful. Capricorn grounds Cancer's emotions, while Cancer warms Capricorn's reserved nature. You complete each other's missing pieces when intentions are clear. Respect and emotional consistency make this pairing thrive.",

  "Cancer-Aquarius":
    "Aquarius seeks independence and ideals, while Cancer seeks emotional connection — creating a dynamic that demands understanding. Aquarius broadens Cancer's world with perspective, and Cancer helps Aquarius access deeper emotional presence. Differences are significant but workable with maturity. Honesty and space are essential.",

  "Cancer-Pisces":
    "Cancer and Pisces create a deeply empathetic, intuitive bond where emotions flow naturally. Pisces brings imagination and compassion, while Cancer offers protection and emotional steadiness. This is a gentle, soulful match that feels spiritually connected. Healthy boundaries keep the connection balanced.",

  // Leo × All 12 Signs
  "Leo-Aries":
    "Leo and Aries spark quickly with shared passion, confidence, and forward momentum. Aries brings raw drive, while Leo adds warmth and creative shine. The chemistry feels bold and energizing. Balancing pride and impulsiveness keeps the match harmonious.",

  "Leo-Taurus":
    "Leo seeks expression and attention, while Taurus values stability and calm — a contrast that works when both appreciate each other's strengths. Taurus grounds Leo and offers loyalty, while Leo adds enthusiasm and colour to Taurus' world. Strong willpower on both sides requires compromise. Admiration and patience keep this pairing steady.",

  "Leo-Gemini":
    "Gemini brings lightness and mental agility, while Leo brings warmth and charisma — creating a lively, engaging connection. You inspire each other through fun, ideas, and shared curiosity. Emotional depth grows when both stay present rather than distracted. Playfulness is the glue.",

  "Leo-Cancer":
    "Leo leads with confidence; Cancer leads with emotion — creating a dynamic that requires sensitivity. Cancer softens Leo and helps them access deeper feelings, while Leo uplifts Cancer with optimism and loyalty. Affection is strong when emotional timing aligns. Gentle communication keeps this pairing thriving.",

  "Leo-Leo":
    "Two Leos create a warm, expressive, and passionate connection full of creativity and emotional generosity. You understand each other's desire to feel valued and admired. The relationship shines when both share the spotlight rather than compete for it. Mutual appreciation strengthens the bond.",

  "Leo-Virgo":
    "Leo leads with heart; Virgo leads with practicality — making this a mix of passion and precision. Virgo offers grounded support and thoughtful care, while Leo brings joy, courage, and warmth. When differences are respected, the connection becomes balanced and productive. Consistent communication is key.",

  "Leo-Libra":
    "Leo and Libra create a socially graceful, affectionate, and intellectually engaging bond. Libra brings elegance and harmony, while Leo brings passion and vitality. You naturally uplift each other's spirits. Balanced communication makes this one of the most easy-flowing pairings.",

  "Leo-Scorpio":
    "Both are intense and loyal, but Leo expresses openly while Scorpio protects their depth — creating a powerful yet demanding dynamic. Scorpio offers emotional richness, while Leo brings warmth and courage. Attraction is strong but requires emotional maturity. Trust and openness make or break this pairing.",

  "Leo-Sagittarius":
    "Leo and Sagittarius share passion, optimism, and a love for adventure. Sagittarius brings honesty and expansion, while Leo adds warmth, devotion, and creative energy. The connection feels exciting and free-spirited. Mutual respect and independence keep the bond strong.",

  "Leo-Capricorn":
    "Capricorn brings structure and long-term vision, while Leo brings confidence and emotional warmth. Together you form a \"power couple\" energy when aligned. The challenge lies in blending Capricorn's practicality with Leo's expressive nature. Respect and shared goals create a solid foundation.",

  "Leo-Aquarius":
    "Leo brings heart; Aquarius brings vision — creating a magnetic, intellectually charged polarity. Leo offers warmth and emotional expression, while Aquarius brings originality and independence. You challenge each other to grow in different ways. The pairing thrives with mutual respect and emotional balance.",

  "Leo-Pisces":
    "Pisces feels intuitively; Leo expresses boldly — a contrast that can become healing when approached gently. Pisces softens Leo and helps them access deeper empathy, while Leo protects and uplifts Pisces. Emotional clarity is essential to avoid misunderstandings. When balanced, the connection becomes surprisingly inspiring.",

  // Virgo × All 12 Signs
  "Virgo-Aries":
    "Virgo brings precision and order, while Aries brings momentum and initiative — creating a blend of strategy and action. Aries helps Virgo take bolder steps, and Virgo helps Aries refine their impulses. Differences are workable when communication stays calm and practical. Mutual respect keeps things steady.",

  "Virgo-Taurus":
    "Virgo and Taurus form a loyal, grounded connection built on consistency and shared values. Taurus offers warmth and patience, while Virgo provides clarity and thoughtful care. This pairing thrives through routine, trust, and practical support. Emotional depth grows slowly but securely.",

  "Virgo-Gemini":
    "Both signs are curious and intelligent, but Virgo focuses on detail while Gemini explores possibilities. Gemini brings flexibility that helps Virgo loosen up, while Virgo offers structure that helps Gemini stay grounded. Communication can be excellent when both avoid overthinking. Balance comes through patience.",

  "Virgo-Cancer":
    "Virgo and Cancer create a nurturing, steady match built on emotional understanding and reliability. Cancer offers warmth and intuition, while Virgo offers dedication and thoughtful problem-solving. You bring out the best in each other through care and consistency. This pairing feels quietly protective.",

  "Virgo-Leo":
    "Virgo prefers subtlety; Leo expresses boldly — creating a dynamic that works when both appreciate the contrast. Leo inspires Virgo to take emotional risks, while Virgo grounds Leo with practicality and care. The connection grows through mutual admiration. Clear communication smooths differences.",

  "Virgo-Virgo":
    "Two Virgos create a thoughtful, responsible, and detail-oriented partnership. You understand each other's desire for improvement and quiet stability. Emotional expression may take time, but loyalty runs deep. The relationship flourishes when both allow imperfections without critique.",

  "Virgo-Libra":
    "Virgo brings structure; Libra brings harmony — a pairing that works when both communicate with patience. Libra softens Virgo's edges with charm and perspective, while Virgo helps Libra make grounded, practical choices. Differences in decision-making require clarity. Balance is achieved through steady dialogue.",

  "Virgo-Scorpio":
    "Virgo and Scorpio form a deep, purposeful connection driven by loyalty, intuition, and shared emotional depth. Scorpio provides intensity and truth, while Virgo brings steadiness and thoughtful support. Trust grows naturally between you. This pairing feels strong and transformative when emotionally aligned.",

  "Virgo-Sagittarius":
    "Virgo seeks order and reliability; Sagittarius seeks freedom and exploration — creating contrasting priorities. Sagittarius broadens Virgo's worldview, while Virgo helps Sagittarius stay grounded and intentional. The connection works when differences are seen as complementary rather than conflicting. Honest expectations are important.",

  "Virgo-Capricorn":
    "Virgo and Capricorn create a steady, ambitious, and dependable partnership. Capricorn provides long-term vision, while Virgo offers organization and thoughtful care. You work well as a team toward shared goals. Emotional warmth grows from loyalty and mutual effort.",

  "Virgo-Aquarius":
    "Virgo focuses on detail and practicality, while Aquarius focuses on ideas and innovation — creating a dynamic that requires curiosity and patience. Aquarius expands Virgo's thinking, while Virgo helps Aquarius bring ideas into reality. Differences can be stimulating rather than stressful when communicated clearly. Respecting each other's rhythms is key.",

  "Virgo-Pisces":
    "Virgo and Pisces form an intriguing polarity of logic and intuition. Pisces brings imagination and emotional depth, while Virgo provides structure and grounding. You learn from each other's strengths when both stay open and non-judgmental. This pairing becomes deeply healing when balance is maintained.",

  // Libra × All 12 Signs
  "Libra-Aries":
    "Libra seeks harmony and thoughtful pacing, while Aries moves instinctively and directly — creating an energetic push-pull that teaches both balance. Aries brings courage and clarity, while Libra brings refinement and emotional diplomacy. Chemistry is strong but requires honest communication. When both lean into patience, this match becomes mutually empowering.",

  "Libra-Taurus":
    "Both appreciate beauty and comfort, but Libra approaches connection intellectually while Taurus approaches it sensually and practically. Taurus offers steadiness that grounds Libra, while Libra brings lightness and charm that softens Taurus' rigidity. Differences in decision-making require care. Slow, clear communication keeps the relationship steady.",

  "Libra-Gemini":
    "Libra and Gemini share effortless conversation, shared curiosity, and a natural social ease. Gemini brings flexibility and ideas, while Libra brings harmony and emotional balance. The connection feels mentally stimulating and emotionally light. Depth forms when both stay consistent rather than scattered.",

  "Libra-Cancer":
    "Cancer leads with emotion; Libra leads with perspective — creating a dynamic that works when both appreciate each other's approach. Libra helps Cancer communicate clearly, while Cancer helps Libra connect more deeply and authentically. Differences are manageable with patience. Reassurance and thoughtful dialogue strengthen the bond.",

  "Libra-Leo":
    "Leo brings warmth and confidence, while Libra brings grace and relational intelligence. You uplift each other naturally and enjoy shared social connection. Libra softens Leo's edges, and Leo adds passion and direction to Libra's world. This pairing flows with charm and enthusiasm.",

  "Libra-Virgo":
    "Libra seeks harmony, while Virgo seeks precision — creating a partnership that works when both communicate openly. Virgo offers stability and thoughtful support; Libra brings perspective and emotional balance. Differences in decision-making can feel tense but also complementary. Respect and clarity smooth the edges.",

  "Libra-Libra":
    "Two Libras form an elegant, harmonious bond where mutual understanding comes effortlessly. You share values, aesthetics, and a desire for fairness, making communication feel natural. The challenge is avoiding indecision or over-accommodation. Emotional openness and decisiveness keep the relationship balanced and strong.",

  "Libra-Scorpio":
    "Scorpio leads with intensity while Libra navigates through diplomacy — a contrast that can be magnetic but demanding. Scorpio adds depth and focus to Libra's world; Libra brings calm and perspective to Scorpio's emotional terrain. Honesty is crucial to avoid misunderstandings. With trust, this pairing becomes transformative.",

  "Libra-Sagittarius":
    "Libra and Sagittarius create a lively, uplifting match rooted in curiosity, optimism, and shared freedom. Sagittarius brings adventure and truth, while Libra brings grace and relational ease. You energize each other without feeling confined. This pairing grows beautifully through shared experiences and open communication.",

  "Libra-Capricorn":
    "Libra prioritizes connection and balance, while Capricorn prioritizes structure and long-term goals — creating a partnership that requires alignment. Capricorn provides stability and purpose; Libra brings warmth and social ease. When both honour each other's priorities, the relationship becomes strong and grounded. Clear expectations keep it smooth.",

  "Libra-Aquarius":
    "Libra and Aquarius connect through shared ideals, mental clarity, and a sense of social awareness. Aquarius brings originality and vision, while Libra brings harmony and emotional intelligence. The connection feels progressive and stimulating. Independence and communication keep the bond thriving.",

  "Libra-Pisces":
    "Libra expresses gently through thought; Pisces expresses deeply through emotion — creating a soft, imaginative connection. Pisces brings empathy and creativity, while Libra brings balance and clarity. Together you create a peaceful, artistic dynamic. Emotional sensitivity and transparency make this pairing shine.",

  // Scorpio × All 12 Signs
  "Scorpio-Aries":
    "Aries charges forward with raw instinct, while Scorpio moves with emotional strategy — creating a connection that's magnetic but demanding. Aries brings honesty and momentum, while Scorpio offers depth and loyalty. When trust is strong, the intensity becomes transformative. Clear boundaries are essential.",

  "Scorpio-Taurus":
    "Taurus provides stability and sensuality; Scorpio brings emotional depth and passion. This polarity creates undeniable chemistry and powerful long-term potential when both feel secure. Taurus grounds Scorpio's intensity, while Scorpio deepens Taurus' emotional world. Power struggles need gentle handling.",

  "Scorpio-Gemini":
    "Scorpio seeks depth and commitment, while Gemini seeks movement and variety — creating different priorities. Gemini lightens Scorpio's emotional landscape, while Scorpio encourages Gemini to look beneath the surface. This works when communication is honest and paced carefully. Trust and clarity are crucial.",

  "Scorpio-Cancer":
    "Scorpio and Cancer form a strong emotional bond rooted in intuition, loyalty, and depth. Cancer softens Scorpio's intensity with warmth and empathy, while Scorpio gives Cancer security and emotional protection. This pairing feels safe and transformative. Trust builds quickly and beautifully.",

  "Scorpio-Leo":
    "Leo is expressive and open-hearted, while Scorpio is private and emotionally intense — creating a bold but challenging dynamic. Leo brings warmth and courage; Scorpio brings depth and focus. Respect is crucial to avoid power clashes. When both stay emotionally honest, this match becomes surprisingly powerful.",

  "Scorpio-Virgo":
    "Virgo brings practicality and thoughtful support, while Scorpio brings emotional depth and unwavering commitment. Together you create a partnership that feels purposeful and steady. Virgo's clarity balances Scorpio's intensity. This connection strengthens through honesty and dependable effort.",

  "Scorpio-Libra":
    "Libra seeks balance while Scorpio seeks depth — creating a pairing that requires emotional transparency. Libra brings calm communication that steadies Scorpio, while Scorpio brings honesty and emotional weight that deepens Libra's world. Differences can be complementary with patience. Clear intentions keep this healthy.",

  "Scorpio-Scorpio":
    "Two Scorpios create an intense, deeply bonded connection filled with loyalty, passion, and emotional truth. You understand each other's depth, needs, and protective nature. The challenge lies in managing intensity and avoiding emotional power dynamics. When trust is strong, this becomes unbreakable.",

  "Scorpio-Sagittarius":
    "Scorpio seeks emotional depth, while Sagittarius seeks freedom and discovery — creating tension but also growth. Sagittarius broadens Scorpio's perspective, while Scorpio helps Sagittarius develop emotional awareness. This works when both accept each other's different needs. Honesty and space are vital.",

  "Scorpio-Capricorn":
    "Scorpio and Capricorn form a strong, purposeful bond built on loyalty, resilience, and ambition. Capricorn provides structure and stability, while Scorpio adds emotional depth and intuition. You respect each other's strength and determination. This pairing grows steadily and powerfully.",

  "Scorpio-Aquarius":
    "Aquarius leads with ideals and independence, while Scorpio leads with emotional truth — creating a complex but stimulating connection. Aquarius expands Scorpio's worldview; Scorpio deepens Aquarius emotionally. Differences are significant but workable with maturity. Transparency and space make this pairing possible.",

  "Scorpio-Pisces":
    "Scorpio and Pisces form a profound, intuitive bond where empathy and emotional understanding flow naturally. Pisces brings softness and imagination, while Scorpio offers protection and emotional depth. This match feels soulful and healing. Emotional honesty keeps the connection balanced.",

  // Sagittarius × All 12 Signs
  "Sagittarius-Aries":
    "Sagittarius and Aries ignite quickly, sharing enthusiasm, independence, and a love for movement. Aries brings raw courage and focus, while Sagittarius brings optimism and perspective. You energize each other effortlessly. This pairing thrives with honesty and freedom.",

  "Sagittarius-Taurus":
    "Sagittarius values exploration; Taurus values stability — creating different rhythms that require compromise. Taurus grounds Sagittarius with consistency, while Sagittarius helps Taurus embrace spontaneity. Balance comes from respecting each other's pace. Clear expectations keep the bond steady.",

  "Sagittarius-Gemini":
    "Sagittarius seeks big truths; Gemini seeks many possibilities — a polarity that creates exciting, mental chemistry. Gemini adds flexibility and curiosity, while Sagittarius brings vision and experience. This match feels lively, open, and mentally expansive. It works beautifully when both maintain honesty and independence.",

  "Sagittarius-Cancer":
    "Sagittarius moves freely and intuitively, while Cancer seeks emotional security and closeness. Sagittarius encourages Cancer to broaden their world, while Cancer teaches Sagittarius emotional presence and care. The dynamic works with mutual patience. Boundaries and communication are essential.",

  "Sagittarius-Leo":
    "Leo and Sagittarius share enthusiasm, courage, and a bold approach to life. Sagittarius brings honesty and freedom, while Leo brings warmth and devotion. The relationship feels vibrant and uplifting. Respecting each other's independence makes this pairing shine.",

  "Sagittarius-Virgo":
    "Virgo seeks order; Sagittarius seeks possibility — an interplay that creates both challenge and growth. Virgo grounds Sagittarius' impulses with clarity, while Sagittarius helps Virgo see beyond routines. The connection becomes rewarding when differences are embraced rather than resisted. Communication is key.",

  "Sagittarius-Libra":
    "Sagittarius and Libra blend curiosity, lightness, and shared social energy. Libra brings elegance and emotional balance, while Sagittarius brings honesty and adventure. The connection feels easy and uplifting. Openness and mutual respect keep the relationship strong.",

  "Sagittarius-Scorpio":
    "Sagittarius seeks freedom and future horizons, while Scorpio seeks depth and emotional truth — creating a powerful but demanding contrast. Scorpio grounds Sagittarius emotionally, while Sagittarius expands Scorpio's worldview. This pairing succeeds with transparency and patience. Space and trust are vital.",

  "Sagittarius-Sagittarius":
    "Two Sagittarians create an adventurous, spirited match full of movement and possibility. You understand each other's need for independence and intellectual stimulation. The bond stays strong when both stay honest and emotionally present. Shared exploration defines this pairing.",

  "Sagittarius-Capricorn":
    "Sagittarius brings vision and inspiration; Capricorn brings structure and long-term focus. Together you form a dynamic that blends ambition with optimism. Capricorn stabilizes Sagittarius, while Sagittarius encourages Capricorn to take more expansive risks. Shared goals make this pairing powerful.",

  "Sagittarius-Aquarius":
    "Sagittarius and Aquarius form a forward-thinking, mentally stimulating connection rooted in independence and curiosity. Aquarius brings originality and insight, while Sagittarius brings honesty and enthusiasm. You thrive with freedom and shared ideals. The dynamic is exciting and future-oriented.",

  "Sagittarius-Pisces":
    "Pisces feels deeply and intuitively, while Sagittarius moves freely and optimistically — creating a fluid but delicate dynamic. Pisces brings empathy and imagination, while Sagittarius offers perspective and encouragement. This match works with emotional honesty. Gentle communication keeps it in balance.",

  // Capricorn × All 12 Signs
  "Capricorn-Aries":
    "Capricorn plans carefully while Aries moves quickly, creating a blend of strategy and action. Aries brings boldness that helps Capricorn take timely risks, while Capricorn gives Aries stability and direction. This pairing thrives when timing and expectations are aligned. Mutual respect keeps the dynamic strong.",

  "Capricorn-Taurus":
    "Capricorn and Taurus form a loyal, steady, and practical bond built on dependability and shared values. Taurus adds warmth and patience, while Capricorn offers leadership and long-term vision. You work well as a team, strengthening each other's goals. The connection deepens through consistency.",

  "Capricorn-Gemini":
    "Gemini brings ideas and adaptability, while Capricorn brings structure and follow-through — creating different priorities. Capricorn grounds Gemini, while Gemini helps Capricorn think more flexibly. The match works when both appreciate each other's strengths. Clear communication keeps things balanced.",

  "Capricorn-Cancer":
    "Capricorn leads with logic and structure; Cancer leads with emotion and intuition — forming a complementary, stabilizing polarity. Cancer softens Capricorn's reserve, while Capricorn supports Cancer with reliability and direction. When both honour each other's needs, the connection becomes deeply secure. Emotional consistency is crucial.",

  "Capricorn-Leo":
    "Leo brings warmth and expressive energy, while Capricorn brings purpose and discipline. Together you create a \"strength meets vision\" dynamic. The challenge lies in blending Leo's spontaneity with Capricorn's practicality. Respect and shared ambition make this pairing powerful.",

  "Capricorn-Virgo":
    "Capricorn and Virgo share a grounded, rational approach that builds trust naturally. Virgo brings precision and thoughtful care; Capricorn brings stability and long-term leadership. You support each other deeply, both emotionally and practically. This is one of the most dependable earth-earth matches.",

  "Capricorn-Libra":
    "Libra seeks harmony and connection, while Capricorn prioritizes structure and goals — creating contrasting focuses. Libra brings warmth and perspective that softens Capricorn, while Capricorn adds stability and direction to Libra's world. Balance comes from clear expectations. Patience smooths the edges.",

  "Capricorn-Scorpio":
    "Capricorn and Scorpio form a strong, determined pairing rooted in loyalty, depth, and ambition. Scorpio brings emotional insight and intensity; Capricorn brings steadiness and long-term commitment. You work well toward shared goals and protect each other fiercely. This bond deepens through trust.",

  "Capricorn-Sagittarius":
    "Sagittarius inspires Capricorn with optimism, while Capricorn grounds Sagittarius with structure. The connection blends adventure with practicality when aligned. Differences in pace and priorities require patience. Shared goals and respect make this pairing surprisingly strong.",

  "Capricorn-Capricorn":
    "Two Capricorns create a disciplined, goal-oriented partnership built on loyalty, ambition, and mutual understanding. You respect each other's work ethic and reliability. Emotional expression may take time, but commitment runs deep. The relationship grows steadily with intentional effort.",

  "Capricorn-Aquarius":
    "Capricorn brings structure; Aquarius brings innovation — creating a dynamic that blends tradition with forward-thinking. Aquarius helps Capricorn break patterns, while Capricorn helps Aquarius bring ideas to life. Differences can be stimulating. Communication and shared purpose keep the bond aligned.",

  "Capricorn-Pisces":
    "Pisces offers empathy and imagination, while Capricorn provides stability and grounding — creating a supportive, emotionally balanced connection. Pisces helps Capricorn soften emotionally, while Capricorn helps Pisces feel secure and focused. This pairing becomes deeply comforting and meaningful. Gentle communication strengthens it.",

  // Aquarius × All 12 Signs
  "Aquarius-Aries":
    "Aquarius and Aries create a future-focused, energizing connection where independence is respected and ideas flow freely. Aries brings courage and initiative, while Aquarius brings originality and perspective. You inspire each other to grow. The match thrives on honesty and personal freedom.",

  "Aquarius-Taurus":
    "Aquarius values innovation and flexibility; Taurus values stability and predictability. Taurus grounds Aquarius with consistency, while Aquarius opens Taurus to new experiences and unconventional thinking. Differences are significant but can be complementary with patience. Clear communication keeps things steady.",

  "Aquarius-Gemini":
    "Aquarius and Gemini connect instantly through ideas, humour, and shared curiosity. Gemini brings adaptability and wit, while Aquarius brings vision and independent thinking. The relationship feels stimulating and mentally alive. Emotional closeness grows through honest communication.",

  "Aquarius-Cancer":
    "Cancer leads with emotion; Aquarius leads with logic and ideals — creating a contrast that requires sensitivity. Aquarius offers perspective and stability, while Cancer brings warmth and empathy. The dynamic works when both adjust communication styles. Space and reassurance are essential.",

  "Aquarius-Leo":
    "Aquarius brings originality and intellect, while Leo brings warmth and creative presence — producing a magnetic, challenging polarity. Leo offers heart; Aquarius offers vision. When both respect each other's strengths, the connection becomes transformative. Ego and distance must be handled thoughtfully.",

  "Aquarius-Virgo":
    "Virgo focuses on detail and precision; Aquarius focuses on concepts and future-thinking. Virgo helps Aquarius bring ideas into reality, while Aquarius expands Virgo's perspective beyond the practical. Differences can be stimulating with patience. Respect for each other's rhythm is key.",

  "Aquarius-Libra":
    "Aquarius and Libra create a balanced, socially intuitive connection rooted in intellectual chemistry and shared ideals. Libra brings charm and relational ease, while Aquarius brings originality and depth. You support each other's independence without tension. This pairing feels effortless and modern.",

  "Aquarius-Scorpio":
    "Scorpio's emotional depth contrasts sharply with Aquarius' need for space and objectivity — creating a potent but demanding connection. Scorpio grounds Aquarius emotionally, while Aquarius helps Scorpio detach and see clearly. Trust and transparency are crucial. Boundaries make this pairing workable.",

  "Aquarius-Sagittarius":
    "Aquarius and Sagittarius thrive on freedom, ideas, and exploration. Sagittarius brings enthusiasm and honesty; Aquarius brings insight and innovation. The connection feels progressive, open, and mentally stimulating. Shared ideals keep the relationship strong.",

  "Aquarius-Capricorn":
    "Capricorn brings structure and practicality; Aquarius brings originality and vision. Together you create a balance of long-term planning and creative thinking. Capricorn helps Aquarius stay grounded, while Aquarius expands Capricorn's horizons. Mutual respect drives this pairing.",

  "Aquarius-Aquarius":
    "Two Aquarians form a progressive, intellectual bond where freedom and shared values matter deeply. You understand each other's need for space and individuality. The match feels unconventional yet loyal in its own way. Emotional presence strengthens the connection.",

  "Aquarius-Pisces":
    "Pisces leads with intuition and compassion; Aquarius with insight and idealism — creating a gentle but unusual mix. Pisces softens Aquarius, bringing emotional richness, while Aquarius helps Pisces gain clarity and perspective. This pairing grows when both stay honest and patient. Emotional transparency is important.",

  // Pisces × All 12 Signs
  "Pisces-Aries":
    "Pisces feels life through intuition and emotion, while Aries moves through instinct and action — creating a dynamic that requires emotional pacing. Aries offers protection and courage that helps Pisces feel grounded, while Pisces softens Aries with empathy and imagination. The match grows through gentle communication. Respect for emotional timing is crucial.",

  "Pisces-Taurus":
    "Taurus provides stability and warmth, while Pisces brings compassion, creativity, and emotional depth. You create a nurturing, calming environment together. Taurus helps Pisces feel secure, while Pisces enriches Taurus' world with sensitivity and imagination. This is a gentle, steady connection that grows beautifully over time.",

  "Pisces-Gemini":
    "Gemini leads with ideas; Pisces leads with emotion — creating a fluid but delicate balance. Gemini helps Pisces communicate clearly, while Pisces offers empathy and presence that grounds Gemini. The dynamic works when both stay honest about their needs. Patience and clarity keep the bond stable.",

  "Pisces-Cancer":
    "Pisces and Cancer form a deeply intuitive, emotionally connected match where understanding flows naturally. Cancer brings protection and consistency, while Pisces adds imagination and soulful depth. You connect without needing many words. Healthy boundaries keep the emotional intensity balanced.",

  "Pisces-Leo":
    "Leo expresses boldly; Pisces feels softly — creating a dynamic that blends courage with compassion. Pisces encourages Leo to explore emotional vulnerability, while Leo helps Pisces feel seen and supported. The pairing thrives when both honour each other's emotional language. Gentle communication keeps it grounded.",

  "Pisces-Virgo":
    "Pisces sees life through intuition; Virgo through analysis — forming a classic polarity that becomes deeply healing with openness. Virgo offers structure and clarity, while Pisces brings empathy and inspiration. You balance each other beautifully when criticism is replaced with curiosity. This match thrives through emotional honesty.",

  "Pisces-Libra":
    "Libra brings harmony and gentle communication, while Pisces brings emotional richness and imagination. Together you create a peaceful, artistic, and compassionate connection. Differences in decision-making require patience. Mutual reassurance and clarity strengthen this pairing.",

  "Pisces-Scorpio":
    "Pisces and Scorpio share emotional depth, intuition, and powerful unspoken understanding. Scorpio provides strength and protection, while Pisces brings softness and spiritual connection. The relationship feels transformative and emotionally rich. Trust and transparency deepen the bond.",

  "Pisces-Sagittarius":
    "Pisces moves through feeling; Sagittarius moves through optimism and freedom — creating a dynamic that blends sensitivity with adventure. Sagittarius inspires Pisces to explore more widely, while Pisces teaches Sagittarius emotional presence. This connection works best with gentle pacing. Honesty keeps the match balanced.",

  "Pisces-Capricorn":
    "Capricorn offers grounding, reliability, and direction, while Pisces offers compassion, intuition, and emotional nuance. You complement each other beautifully. Capricorn helps Pisces feel safe, and Pisces helps Capricorn soften and trust their emotional world. This pairing grows strong through mutual support.",

  "Pisces-Aquarius":
    "Aquarius brings clarity and vision; Pisces brings empathy and subtlety — forming a thoughtful but unusual blend. Aquarius helps Pisces gain perspective, while Pisces helps Aquarius connect emotionally. Both must communicate openly to avoid misunderstandings. Patience and emotional presence are vital.",

  "Pisces-Pisces":
    "Two Pisces create a dreamy, intuitive, emotionally rich connection where imagination flows freely. You understand each other's softness, creativity, and need for emotional safety. The challenge is staying grounded in reality. With shared intention and clarity, this becomes a soulful, spiritual match.",

  // Legacy entries (keeping for backward compatibility)
  "Cancer-Scorpio":
    "Deep emotional understanding comes naturally; the match strengthens when boundaries are kept clean and grudges cleared quickly.",

  "Taurus-Virgo":
    "Both value reliability and practical care; the connection grows through small, steady gestures more than big dramatic moves.",

  "Gemini-Libra":
    "Social, mentally active energy; things work best when decisions actually get made instead of staying hypothetical.",
};

// Helper function to build a formatted western relationship line
// This creates a simple "SignA × SignB" format
// The compatibility type can be added from classifier results if needed
export function buildWesternLine(signA: string, signB: string, compatibilityType?: string): string {
  // Normalize sign names to match the key format
  const normalizedA = capitalizeSign(signA);
  const normalizedB = capitalizeSign(signB);
  
  if (compatibilityType) {
    return `${normalizedA} × ${normalizedB} — ${compatibilityType}`;
  }
  
  return `${normalizedA} × ${normalizedB}`;
}

// Helper function to capitalize first letter
function capitalizeSign(sign: string): string {
  return sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
}

// Export the helper function for use in other files
export { westKey };

