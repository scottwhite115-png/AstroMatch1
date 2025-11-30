// src/lib/match/weights.ts
export const weights = {
  // Western
  sameElement: 26,
  complementaryElements: 22, // Air↔Fire, Earth↔Water
  neutralElements: 12,
  tenseElements: 4,

  modalitySameMutable: 8,
  modalitySameCardinal: 6,
  modalitySameFixed: 0,
  modalityComplementary: 6,

  aspectTrine: 10,
  aspectSextile: 6,
  aspectOpposition: 4,
  aspectSquare: 0,

  // Chinese
  sameTrine: 28,
  friendlyTrines: 18,
  animalAlliesPrimary: 10,
  animalAlliesSecondary: 4,
  animalClash: -18,
  highTempoBothYang: 6,

  // Cross modifiers
  airUserVisionaryPartner: 8,
  fireUserVisionaryPartner: 6,
  waterUserArtistPartner: 6,
  earthUserStrategistPartner: 6,
  hardCrossPenalty: -6,
};

