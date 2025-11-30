"use client";

import { ConnectionBoxNew } from "@/components/ConnectionBoxNew";
import { buildConnectionLines, type ConnectionContext, type Element, type WuXing, type ChinesePattern, type WestAspect } from "@/lib/connectionText";

export default function ConnectionBoxDemo() {
  // Example 1: Aquarius Monkey × Leo Goat
  const example1Context: ConnectionContext = {
    westA: { sign: "Aquarius", element: "Air" as Element },
    westB: { sign: "Leo", element: "Fire" as Element },
    chineseA: { animal: "Monkey", trineName: "Visionaries" },
    chineseB: { animal: "Goat", trineName: "Artists" },
    chinesePattern: "cross_trine" as ChinesePattern,
    westAspect: "opposition" as WestAspect,
  };
  const example1Lines = buildConnectionLines(example1Context);

  // Example 2: Gemini Rabbit × Sagittarius Rabbit (Twin Flames)
  const example2Context: ConnectionContext = {
    westA: { sign: "Gemini", element: "Air" as Element },
    westB: { sign: "Sagittarius", element: "Air" as Element },
    chineseA: { animal: "Rabbit", trineName: "Artists" },
    chineseB: { animal: "Rabbit", trineName: "Artists" },
    chinesePattern: "same_animal" as ChinesePattern,
    westAspect: "opposition" as WestAspect,
  };
  const example2Lines = buildConnectionLines(example2Context);

  // Example 3: Taurus Dragon × Virgo Monkey
  const example3Context: ConnectionContext = {
    westA: { sign: "Taurus", element: "Earth" as Element },
    westB: { sign: "Virgo", element: "Earth" as Element },
    chineseA: { animal: "Dragon", trineName: "Visionaries" },
    chineseB: { animal: "Monkey", trineName: "Visionaries" },
    chinesePattern: "same_trine" as ChinesePattern,
    westAspect: "trine" as WestAspect,
  };
  const example3Lines = buildConnectionLines(example3Context);

  // Example 4: Leo Rat × Aquarius Horse (Liu Chong opposition)
  const example4Context: ConnectionContext = {
    westA: { sign: "Leo", element: "Fire" as Element },
    westB: { sign: "Aquarius", element: "Air" as Element },
    chineseA: { animal: "Rat", trineName: "Visionaries" },
    chineseB: { animal: "Horse", trineName: "Adventurers" },
    chinesePattern: "liu_chong" as ChinesePattern,
    westAspect: "opposition" as WestAspect,
  };
  const example4Lines = buildConnectionLines(example4Context);

  // Example 5: Pisces Pig × Cancer Goat (San He with Wu Xing)
  const example5Context: ConnectionContext = {
    westA: { sign: "Pisces", element: "Water" as Element },
    westB: { sign: "Cancer", element: "Water" as Element },
    chineseA: { animal: "Pig", trineName: "Artists", yearElement: "Water" as WuXing },
    chineseB: { animal: "Goat", trineName: "Artists", yearElement: "Wood" as WuXing },
    chinesePattern: "san_he" as ChinesePattern,
    westAspect: "trine" as WestAspect,
  };
  const example5Lines = buildConnectionLines(example5Context);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-3">
            🌟 AstroMatch Connection Box
          </h1>
          <p className="text-slate-300 text-lg">
            New compatibility display with beautiful connection descriptions
          </p>
        </div>

        <div className="grid gap-8">
          {/* Example 1 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3 drop-shadow-lg">
              Opposites Attract
            </h2>
            <ConnectionBoxNew
              tier="Opposites Attract"
              score={88}
              westA="Aquarius"
              eastA="Monkey"
              westB="Leo"
              eastB="Goat"
              chineseLine={example1Lines.chineseLine}
              westernLine={example1Lines.westernLine}
              wuXingLine={example1Lines.wuXingLine}
              connectionBlurb="High-voltage chemistry with magnetic pull. This pairing thrives on differences that create spark and excitement."
            />
          </div>

          {/* Example 2 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3 drop-shadow-lg">
              Twin Flame Match
            </h2>
            <ConnectionBoxNew
              tier="Twin Flame"
              score={95}
              westA="Gemini"
              eastA="Rabbit"
              westB="Sagittarius"
              eastB="Rabbit"
              chineseLine={example2Lines.chineseLine}
              westernLine={example2Lines.westernLine}
              wuXingLine={example2Lines.wuXingLine}
              connectionBlurb="Intense mutual spark with strong attraction and big growth potential. Like looking in a mirror with cosmic electricity."
            />
          </div>

          {/* Example 3 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3 drop-shadow-lg">
              Excellent Match
            </h2>
            <ConnectionBoxNew
              tier="Excellent"
              score={92}
              westA="Taurus"
              eastA="Dragon"
              westB="Virgo"
              eastB="Monkey"
              chineseLine={example3Lines.chineseLine}
              westernLine={example3Lines.westernLine}
              wuXingLine={example3Lines.wuXingLine}
              connectionBlurb="Grounded earth energy meets visionary thinking. This pairing builds something solid together."
            />
          </div>

          {/* Example 4 */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3 drop-shadow-lg">
              Difficult Match
            </h2>
            <ConnectionBoxNew
              tier="Difficult"
              score={45}
              westA="Leo"
              eastA="Rat"
              westB="Aquarius"
              eastB="Horse"
              chineseLine={example4Lines.chineseLine}
              westernLine={example4Lines.westernLine}
              wuXingLine={example4Lines.wuXingLine}
              connectionBlurb="Double opposition creates intense friction. Growth requires conscious effort and mutual understanding."
            />
          </div>

          {/* Example 5 - With Wu Xing */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3 drop-shadow-lg">
              Soulmate Match (with Wu Xing harmony)
            </h2>
            <ConnectionBoxNew
              tier="Soulmate"
              score={97}
              westA="Pisces"
              eastA="Pig"
              westB="Cancer"
              eastB="Goat"
              chineseLine={example5Lines.chineseLine}
              westernLine={example5Lines.westernLine}
              wuXingLine={example5Lines.wuXingLine}
              connectionBlurb="Deep water connection with artistic souls. The five elements support each other naturally."
            />
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-3">
            ✨ Features
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Beautiful gradient badges for each match tier</li>
            <li>• Clear score display (0-100)</li>
            <li>• West/East sign pairing visualization</li>
            <li>• Chinese zodiac pattern descriptions with 中文 characters</li>
            <li>• Western astrology element and aspect analysis</li>
            <li>• Optional Wu Xing (Five Elements) harmony line</li>
            <li>• Connection blurb for additional context</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

