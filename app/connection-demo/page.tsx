"use client";

import { ConnectionBox } from "@/components/ConnectionBox";
import { useTheme } from "@/contexts/ThemeContext";

export default function ConnectionBoxDemo() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
        : "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    } p-4`}>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className={`text-2xl font-bold mb-6 text-center ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>
          New Connection Box Design
        </h1>

        <ConnectionBox
          matchLabel="San He 三合 · Triple Harmony"
          matchLabelColor="gold"
          leftSunLabel="Gemini"
          leftSunEmoji="♊️"
          leftChineseLabel="Pig"
          leftChineseEmoji="🐷"
          rightSunLabel="Gemini"
          rightSunEmoji="♊️"
          rightChineseLabel="Dragon"
          rightChineseEmoji="🐉"
          mainLine="A harmonious trine connection — supportive and naturally aligned."
          chineseLine="Pig × Dragon — Cross-Trine"
          chineseSubline="Different instincts and life rhythms."
          westernLine="Gemini × Gemini — Same Element: Air × Air"
          westernSubline="A meeting of minds — communicative, curious, and light-hearted."
          pattern="SAN_HE"
          onPass={() => console.log('Passed')}
          onLike={() => console.log('Liked')}
          onMessageClick={() => console.log('Chat opened')}
          onViewProfile={() => console.log('Profile viewed')}
        />

        <div className="mt-8">
          <ConnectionBox
            matchLabel="Liu He 六合 · Six Harmoniess"
            matchLabelColor="pink"
            leftSunLabel="Aries"
            leftSunEmoji="♈️"
            leftChineseLabel="Tiger"
            leftChineseEmoji="🐯"
            rightSunLabel="Leo"
            rightSunEmoji="♌️"
            rightChineseLabel="Horse"
            rightChineseEmoji="🐴"
            mainLine="Secret allies — a special bond of mutual understanding and support."
            chineseLine="Tiger × Horse — San He 三合 · 'Triple Harmony'"
            westernLine="Aries × Leo — Fire × Fire"
            westernSubline="Bold, adventurous, and mutually inspiring."
            pattern="SAN_HE"
            onPass={() => console.log('Passed')}
            onLike={() => console.log('Liked')}
            onMessageClick={() => console.log('Chat opened')}
            onViewProfile={() => console.log('Profile viewed')}
          />
        </div>

        <div className="mt-8">
          <ConnectionBox
            matchLabel="Liu Chong 六冲 · Six Conflicts"
            matchLabelColor="red"
            leftSunLabel="Cancer"
            leftSunEmoji="♋️"
            leftChineseLabel="Rabbit"
            leftChineseEmoji="🐰"
            rightSunLabel="Capricorn"
            rightSunEmoji="♑️"
            rightChineseLabel="Rooster"
            rightChineseEmoji="🐓"
            mainLine="Direct opposites — magnetic but challenging, requires compromise."
            chineseLine="Rabbit × Rooster — Liu Chong 六冲 · 'Six Conflicts'"
            chineseSubline="Direct opposites in the Chinese zodiac wheel."
            westernLine="Cancer × Capricorn — Water × Earth"
            westernSubline="Cardinal signs in opposition — different approaches to life."
            pattern="LIU_CHONG"
            onPass={() => console.log('Passed')}
            onLike={() => console.log('Liked')}
            onMessageClick={() => console.log('Chat opened')}
            onViewProfile={() => console.log('Profile viewed')}
          />
        </div>
      </div>
    </div>
  );
}

