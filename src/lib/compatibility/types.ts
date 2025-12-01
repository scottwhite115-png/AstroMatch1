// src/lib/compatibility/types.ts

export type ChinesePatternId =
  | 'neutral'    // 👈 this = no strong harmony or conflict pattern
  | 'same_sign'
  | 'san_he'
  | 'liu_he'
  | 'liu_chong'
  | 'liu_hai'
  | 'xing'
  | 'po';

export type WesternAspect =
  | 'same_sign'
  | 'opposition'
  | 'trine'
  | 'sextile'
  | 'square'
  | 'quincunx'
  | 'semi_sextile'
  | 'none';

