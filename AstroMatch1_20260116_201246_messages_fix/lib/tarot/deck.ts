export type TarotCard = {
  id: string;
  name: string;
  meaningUp: string;
  meaningRev: string;
};

export const TAROT_DECK: TarotCard[] = [
  { id: '00-fool', name: 'The Fool', meaningUp: 'Beginnings, trust, openness.', meaningRev: 'Recklessness, avoidance, naivety.' },
  { id: '01-magician', name: 'The Magician', meaningUp: 'Focus, will, creation.', meaningRev: 'Scattered energy, manipulation.' },
  // TODO: expand to full deck
];

