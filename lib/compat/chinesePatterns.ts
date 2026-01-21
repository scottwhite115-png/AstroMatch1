// chinesePatterns.ts

export type ChinesePattern =
  | 'san_he'
  | 'liu_he'
  | 'same_animal'
  | 'same_trine'
  | 'liu_chong'
  | 'liu_chong_xing' // Liu Chong + Xing combo
  | 'liu_hai'
  | 'xing'
  | 'po'
  | 'neutral';

// You can expand this as needed
export type ChinesePatternKey =
  | "SAN_HE"
  | "LIU_HE"
  | "LIU_CHONG"
  | "LIU_CHONG_XING"
  | "LIU_HAI"
  | "XING"
  | "PO"
  | "NEUTRAL";

export function patternSentence(pattern: ChinesePatternKey): string {
  switch (pattern) {
    case "SAN_HE":
      return "In Chinese astrology this falls under a San He 三合 harmony pattern, which strongly supports teamwork, ease, and long-term compatibility.";

    case "LIU_HE":
      return "In Chinese astrology this is a Liu He 六合 harmony pairing, favouring cooperation, mutual support, and a quietly reliable bond.";

    case "LIU_CHONG":
      return "This pairing sits under a Liu Chong 六冲 opposition pattern, bringing stronger contrasts, friction, and a tendency toward on–off dynamics if issues aren't handled well.";

    case "LIU_CHONG_XING":
      return "This pairing sits under Liu Chong 六冲 and Xing 刑, one of the more volatile combinations, with intense attraction and equally intense clashes when energy is mishandled.";

    case "LIU_HAI":
      return "This is a Liu Hai 六害 pattern, associated with subtle wear and tear over time if small frustrations and misunderstandings aren't addressed.";

    case "XING":
      return "This is a Xing 刑 pattern, linked to pressure, criticism, or \"punishing\" dynamics when conflict isn't handled consciously.";

    case "PO":
      return "This is a Po 破 \"break\" pattern, often tied to disruption, sharp shifts, or stop–start cycles in the connection.";

    case "NEUTRAL":
    default:
      return "In Chinese astrology this falls under a more neutral pattern, without strong San He harmony or heavy conflict lines.";
  }
}

export type TrineName =
  | 'Visionaries 水三会'
  | 'Strategists 金三会'
  | 'Adventurers 木三会'
  | 'Artists 土三会';

export interface ChineseSection {
  headingLine: string;
  line2: string;
  line3: string;
}

/**
 * Builds the heading line, e.g.:
 * "Monkey × Dragon — San He (三合) \"Three Harmonies\" (Same Trine: Visionaries 水三会)"
 */
function buildChineseHeading(
  animalA: string,
  animalB: string,
  pattern: ChinesePattern,
  opts?: { trineName?: TrineName; sameTrine?: boolean }
): string {
  const trineTag =
    opts?.sameTrine && opts.trineName
      ? `(Same Trine: ${opts.trineName})`
      : '(Cross-Trine)';

  switch (pattern) {
    case 'san_he':
      return `${animalA} × ${animalB} — San He (三合) "Three Harmonies" ${trineTag}`;
    case 'liu_he':
      return `${animalA} × ${animalB} — Liu He (六合) "Six Harmonies / Six Harmoniess" ${trineTag}`;
    case 'same_trine':
      return `${animalA} × ${animalB} — Same Trine (三会) "Shared Elemental Nature" (Same Trine: ${opts?.trineName ?? '三会'})`;
    case 'same_animal':
      return `${animalA} × ${animalB} — Same Animal "Shared Temperament" (Same Trine: ${opts?.trineName ?? '三会'})`;
    case 'liu_chong':
      return `${animalA} × ${animalB} — Liu Chong (六冲) "Opposition Pattern" (Cross-Trine)`;
    case 'liu_chong_xing':
      return `${animalA} × ${animalB} — Liu Chong (六冲) + Xing (刑) "Opposition & Punishment" (Cross-Trine)`;
    case 'xing':
      return `${animalA} × ${animalB} — Xing (刑) "Punishment Pattern" ${trineTag}`;
    case 'liu_hai':
      return `${animalA} × ${animalB} — Liu Hai (六害) "Harm Pattern" ${trineTag}`;
    case 'po':
      return `${animalA} × ${animalB} — Po (破) "Break Pattern" ${trineTag}`;
    case 'neutral':
    default:
      return `${animalA} × ${animalB} — Neutral Pattern (Cross-Trine)`;
  }
}

/**
 * Returns the 3-sentence description for each pattern.
 * We then split into line2 (first 1–2 sentences) and line3 (last sentence / vibe).
 */
function getPatternDescription(
  pattern: ChinesePattern
): { allSentences: string[] } {
  switch (pattern) {
    case 'san_he':
      return {
        allSentences: [
          'A naturally powerful compatibility pattern marked by shared instinct, rhythm, and inner direction.',
          'Animals within the same San He triad move alike, understand each other effortlessly, and connect with deep intuitive ease.',
          'The bond feels smooth, cooperative, and inherently aligned — the kind of synergy that forms strong, lasting partnerships.'
        ]
      };
    case 'liu_he':
      return {
        allSentences: [
          'A deeply complementary bond rooted in natural affinity.',
          "Each animal fills the subtle gaps in the other's temperament, creating a quiet balance and unspoken support.",
          'The connection feels steady, warm, and intuitively cooperative.'
        ]
      };
    case 'same_trine':
      return {
        allSentences: [
          'A connection shaped by identical elemental nature, offering shared temperament and compatible rhythm.',
          'Both signs move through life with similar pacing and outlook, creating natural ease and mutual recognition.',
          'The energy feels aligned, steady, and fundamentally harmonious.'
        ]
      };
    case 'same_animal':
      return {
        allSentences: [
          'A mirrored pairing with matching instincts, reactions, and emotional style.',
          'Each person recognises aspects of themselves in the other, creating instant familiarity and psychological clarity.',
          'This bond can feel grounding, playful, or intensely reflective.'
        ]
      };
    case 'liu_chong':
      return {
        allSentences: [
          'A high-contrast pairing sitting on opposite axes in the Chinese zodiac.',
          'The energy is charged, reactive, and naturally polarised — attraction and friction arrive together.',
          'This is one of the most dynamic patterns, full of movement, challenge, and intensity.'
        ]
      };
    case 'liu_chong_xing':
      return {
        allSentences: [
          'A vivid, forceful interaction combining opposition and internal tension.',
          'Opposing instincts collide with a sharper emotional edge, creating strong chemistry wrapped in contrast.',
          'The bond carries intensity, momentum, and unmistakable karmic pressure.'
        ]
      };
    case 'xing':
      return {
        allSentences: [
          'A pattern marked by internal friction and mismatched instincts.',
          'The energy feels taut, uneven, or emotionally compressed, with each sign tugging in a different direction.',
          'It creates a noticeable sense of tension or psychological grind beneath the connection.'
        ]
      };
    case 'liu_hai':
      return {
        allSentences: [
          'A subtle but persistent mismatch in temperament.',
          'Energies move out of sync, producing small emotional misalignments or muted resonance.',
          'The bond can feel quiet, delicate, or gently destabilised.'
        ]
      };
    case 'po':
      return {
        allSentences: [
          'A disruptive pairing known for sudden shifts and irregular emotional flow.',
          'The energy moves in uneven bursts, creating an unpredictable or stop–start rhythm.',
          'The connection carries a sense of instability or quick-changing tone.'
        ]
      };
    case 'neutral':
      return {
        allSentences: [
          'A balanced, open connection without strong karmic influence.',
          'No major harmony or conflict defines the bond, allowing individual personality to shape the dynamic.',
          'The energy feels flexible, unpressured, and open-ended.'
        ]
      };
    default:
      // Fallback for any unhandled patterns
      console.warn(`[⚠️] Unhandled pattern in getPatternDescription: ${pattern}`);
      return {
        allSentences: [
          'A balanced, open connection without strong karmic influence.',
          'No major harmony or conflict defines the bond, allowing individual personality to shape the dynamic.',
          'The energy feels flexible, unpressured, and open-ended.'
        ]
      };
  }
}

/**
 * Build the Chinese pattern block for the connection box:
 *
 * headingLine:
 *   "Monkey × Dragon — San He (三合) "Three Harmonies" (Same Trine: Visionaries 水三会)"
 *
 * line2:
 *   "The strongest compatibility pattern in Chinese astrology. Animals in the same San He triad share instinct, rhythm, goals, and natural cooperation."
 *
 * line3:
 *   "Effortless synergy, deep understanding, and strong long-term potential."
 */
export function buildChineseSection(params: {
  animalA: string;
  animalB: string;
  pattern: ChinesePattern;
  trineName?: TrineName;
  sameTrine?: boolean;
}): ChineseSection {
  const headingLine = buildChineseHeading(
    params.animalA,
    params.animalB,
    params.pattern,
    { trineName: params.trineName, sameTrine: params.sameTrine }
  );

  const { allSentences } = getPatternDescription(params.pattern);

  // line2: all but last sentence
  const line2 =
    allSentences.length > 1
      ? allSentences.slice(0, -1).join(' ')
      : allSentences[0] ?? '';

  // line3: last sentence (relationship vibe)
  const line3 =
    allSentences.length > 1
      ? allSentences[allSentences.length - 1]
      : '';

  return { headingLine, line2, line3 };
}

import { getAnimalPairDescription } from './chineseAnimalPairDescriptions';

export function getChinesePatternLines(
  animalAName: string, // e.g. "Monkey"
  animalBName: string, // e.g. "Goat"
  pattern: ChinesePatternKey,
  trineName?: TrineName // e.g. "Visionaries 水三会"
): { heading: string; description: string } {
  // Get animal-specific description if available
  const animalSpecificDesc = getAnimalPairDescription(animalAName, animalBName);
  
  console.log('[getChinesePatternLines]', {
    animalAName,
    animalBName,
    pattern,
    animalSpecificDesc,
    hasDescription: !!animalSpecificDesc
  });
  
  switch (pattern) {
    case "SAN_HE": {
      // For San He patterns, include the trine group and its Chinese symbol
      // Format: "Visionaries (水三会)" from "Visionaries 水三会"
      let trinePart = '';
      if (trineName) {
        // Extract the group name and Chinese symbol from trineName (e.g., "Visionaries 水三会")
        const parts = trineName.split(' ');
        if (parts.length >= 2) {
          const groupName = parts[0]; // "Visionaries"
          const symbol = parts.slice(1).join(' '); // "水三会"
          trinePart = ` ${groupName} (${symbol})`;
        } else {
          trinePart = ` ${trineName}`;
        }
      }
      const heading = `${animalAName} × ${animalBName} — San He 三合 "Visionaries"${trinePart}`;
      const description = animalSpecificDesc || "A deeply harmonious pattern with shared instinct and rhythm, where cooperation and mutual support come naturally.";
      return { heading, description };
    }

    case "LIU_HE": {
      const heading = `${animalAName} × ${animalBName} — Liu He 六合 "Six Harmoniess"`;
      const description = animalSpecificDesc || "A gentle, complementary pattern that favours loyalty, mutual help, and a quietly reliable bond.";
      return { heading, description };
    }

    case "LIU_CHONG": {
      const heading = `${animalAName} × ${animalBName} — Liu Chong 六冲`;
      const description = animalSpecificDesc || "A collision pattern where instincts pull against each other, creating sharp reactions and on–off chemistry.";
      return { heading, description };
    }

    case "LIU_CHONG_XING": {
      const heading = `${animalAName} × ${animalBName} — Liu Chong 六冲 + Xing 刑`;
      const description = animalSpecificDesc || "High-voltage opposites: the attraction is intense, the clashes are real, and the relationship often burns bright and unforgettable, even if it isn't always built for the long haul.";
      return { heading, description };
    }

    case "LIU_HAI": {
      const heading = `${animalAName} × ${animalBName} — Liu Hai 六害`;
      const description = animalSpecificDesc || "A subtle, wearing pattern where small misalignments and irritations can quietly erode goodwill over time.";
      return { heading, description };
    }

    case "XING": {
      const heading = `${animalAName} × ${animalBName} — Xing 刑`;
      const description = animalSpecificDesc || "An edgy pattern where pressure, criticism, or blame can surface easily if conflict isn't handled with care.";
      return { heading, description };
    }

    case "PO": {
      const heading = `${animalAName} × ${animalBName} — Po 破`;
      const description = animalSpecificDesc || "A disruptive pattern that brings stop–start cycles, sudden breaks, or structural shifts in the connection.";
      return { heading, description };
    }

    case "NEUTRAL":
    default: {
      const heading = `${animalAName} × ${animalBName} — Neutral Pattern`;
      const description = animalSpecificDesc || "No major classical pattern: chemistry depends more on Western signs and personal maturity.";
      return { heading, description };
    }
  }
}

