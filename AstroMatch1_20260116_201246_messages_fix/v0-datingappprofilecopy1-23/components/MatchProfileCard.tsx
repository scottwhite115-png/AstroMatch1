"use client";

import ProfilePhotoCarouselWithRanking from "@/components/ProfilePhotoCarouselWithRanking";
import ConnectionBoxSimple from "@/components/ConnectionBoxSimple";
import type { ConnectionBoxData } from "@/components/ConnectionBoxSimple";

interface MatchProfileCardProps {
  profile: {
    id: number;
    name: string;
    age: number;
    photos: string[];
    aboutMe?: string;
    occupation?: string;
    city?: string;
    height?: string;
    children?: string;
    religion?: string;
    prompts?: Array<{ question: string; answer: string }>;
  };
  connectionBoxData?: ConnectionBoxData;
  theme?: "light" | "dark";
  onPhotoChange?: (index: number) => void;
  onMessageClick?: () => void;
}

const MessageCircle = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="rgb(249, 115, 22)" strokeWidth="2" className={className} style={style}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default function MatchProfileCard({
  profile,
  connectionBoxData,
  theme = "dark",
  onPhotoChange,
  onMessageClick,
}: MatchProfileCardProps) {
  return (
    <div
      className={`w-full rounded-2xl ${theme === "light" ? "bg-white" : "bg-black"} pb-4 shadow-xl overflow-hidden flex flex-col`}
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      {/* Photo Carousel with Ranking */}
      {profile.photos.length > 0 && (
        <div className="px-2 mb-3 pt-4 relative">
          {/* Message button - Top right corner of photo carousel */}
          {onMessageClick && (
            <button
              onClick={onMessageClick}
              className={`absolute top-12 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-700 hover:bg-gray-600"}`}
              aria-label="Message"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          )}
          <ProfilePhotoCarouselWithRanking
            images={profile.photos}
            profileName={profile.name}
            profileAge={profile.age}
            connectionBoxData={connectionBoxData}
            theme={theme}
            showDropdown={false}
            badgePosition="overlay-bottom"
            aboutMeText={profile.aboutMe}
            selectedOccupation={profile.occupation}
            selectedCity={profile.city}
            cityInput={profile.city || ""}
            selectedHeight={profile.height}
            selectedChildrenOption={profile.children}
            selectedReligion={profile.religion}
            onPhotoChange={onPhotoChange}
          />
        </div>
      )}

      {/* Connection Box - Permanently displayed below photo carousel */}
      {connectionBoxData && (
        <div className="px-2 mt-auto">
          <ConnectionBoxSimple
            data={{
              ...connectionBoxData,
              aboutMeText: connectionBoxData.aboutMeText ?? profile.aboutMe,
              occupation: connectionBoxData.occupation ?? profile.occupation,
              city: connectionBoxData.city ?? profile.city,
              height: connectionBoxData.height ?? profile.height,
              children: connectionBoxData.children ?? profile.children,
              religion: connectionBoxData.religion ?? profile.religion,
              age: connectionBoxData.age ?? profile.age,
            }}
            alwaysExpanded={true}
            hideHeader={true}
          />
        </div>
      )}
    </div>
  );
}
