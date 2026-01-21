import { ConnectionBoxNew } from "./ConnectionBoxNew";
import { buildConnectionLines } from "@/lib/connectionText";
import type { ConnectionContext } from "@/lib/connectionText";

const ctx: ConnectionContext = {
  westA: { sign: "Aquarius", element: "Air" },
  westB: { sign: "Leo", element: "Fire" },
  chineseA: { animal: "Monkey", trineName: "Visionaries", yearElement: "Metal" },
  chineseB: { animal: "Goat", trineName: "Artists", yearElement: "Water" },
  chinesePattern: "cross_trine",
  westAspect: "opposition",
};

const lines = buildConnectionLines(ctx);

export function ConnectionBoxExample() {
  return (
    <ConnectionBoxNew
      tier="Opposites Attract"
      score={68}
      westA="Aquarius"
      eastA="Monkey"
      westB="Leo"
      eastB="Goat"
      chineseLine={lines.chineseLine}
      westernLine={lines.westernLine}
      wuXingLine={lines.wuXingLine}
      connectionBlurb="High-voltage chemistry with very different instincts. Great when you're both playful and self-aware; tricky if pride or moodiness take over."
    />
  );
}
















