// src/lib/astrolab/vedicContent.ts

export type VedicCardId =
  | 'vedic-101'
  | 'vedic-big-three'
  | 'vedic-love-compatibility'
  | 'vedic-timing-mahadashas';

export interface VedicCard {
  id: VedicCardId;
  title: string;
  subtitle: string;
  preview: string;
  body: string;
  comingSoon?: boolean;
}

export const VEDIC_CARDS: VedicCard[] = [
  {
    id: 'vedic-101',
    title: 'Vedic Astrology 101',
    subtitle: 'Jyotisa – "the science of light"',
    preview:
      'What Vedic astrology is, how it differs from Western, and why we care about it in AstroMatch.',
    body: [
      'Vedic astrology — known in Sanskrit as **Jyotisa**, "the science of light" — is an ancient system that looks at how the real sky (sidereal zodiac) reflects your inner life and timing.',
      '',
      '### How it differs from Western astrology',
      '',
      '- **Sidereal zodiac:** Vedic signs are tied to the constellations, so your Vedic Sun or Moon may be in a different sign than in your Western chart.',
      '- **The Moon matters more:** Your **Moon sign** shows how you feel, bond and respond emotionally. It is a big deal for relationships.',
      '- **Ascendant (Lagna):** Your Vedic rising sign sets the whole chart. It describes your body, style and life direction.',
      '- **Dashas (timing cycles):** Vedic astrology tracks planetary periods (mahadashas) that describe which themes are "activated" in your life right now.',
      '',
      'In this section we keep things simple and focused on what actually helps:',
      '',
      '- Your **Vedic Big Three** – Ascendant, Moon, Sun',
      '- How Vedic signs and houses talk about **love and partnership**',
      '- A gentle intro to **timing cycles** so you do not get lost in jargon',
    ].join('\n'),
  },
  {
    id: 'vedic-big-three',
    title: 'Your Vedic Big Three',
    subtitle: 'Ascendant, Moon, Sun – your core Vedic profile',
    preview:
      'Why Vedic puts so much weight on your Ascendant and Moon, and how we will use that in AstroLab.',
    body: [
      'In Vedic astrology, your **Ascendant** and **Moon** are often more important than your Sun.',
      'Together, they describe how you show up, how you feel, and what your life is trying to grow you into.',
      '',
      '### Ascendant (Lagna): your path & body',
      '',
      'Your Vedic Ascendant is the sign that was rising in the east at your birth.',
      'It colours your body, style, first impressions and the overall "movie" of your life.',
      'It sets the houses – the 12 areas of life – so it is the backbone of your chart.',
      '',
      '### Moon: your heart & wiring',
      '',
      'The Moon shows your emotional wiring: what feels safe, how you attach, and how you instinctively react.',
      'In relationships, Moon sign compatibility often matters more than Sun sign compatibility.',
      '',
      '### Sun: your dharma & vitality',
      '',
      'The Sun is your life force, purpose and ego – what you are growing towards.',
      'In Vedic astrology it is important, but it is not the whole story. The Sun shines through the filter of your Ascendant and Moon.',
      '',
      '### How we will use this in AstroMatch',
      '',
      'For now, we treat Vedic as a **bonus lens** in AstroLab:',
      '',
      '- Your Chinese + Western engine does the heavy lifting.',
      '- Vedic pieces add extra nuance if you want to explore your chart more deeply.',
    ].join('\n'),
  },
  {
    id: 'vedic-love-compatibility',
    title: 'Vedic Love & Compatibility',
    subtitle: 'Moon, Ascendant and the 7th house',
    preview:
      'How Vedic charts look at emotional fit, partnership style and the kind of partner you attract.',
    body: [
      'Vedic astrology looks at **Moon signs**, **rising signs** and the **7th house** to understand how two people give and receive love.',
      'It is less about "perfect matches" and more about emotional fit and life direction.',
      '',
      '### Moon sign compatibility',
      '',
      'The Moon shows what each person needs to feel safe and loved.',
      'When two Moons are in compatible signs, it is easier to live together, share space and soothe each other.',
      '',
      'We often look at:',
      '',
      '- **Element harmony** (Fire, Earth, Air, Water in the sidereal signs)',
      '- Whether one person\'s Moon **supports or drains** the other\'s Moon sign',
      '',
      'Think of it as: *"Can we actually relax around each other?"*',
      '',
      '### Ascendant & 7th house',
      '',
      'The **Ascendant (1st house)** is "me", the **7th house** is "you" – partners, marriage, serious bonds.',
      'The sign on your 7th house and any planets there describe:',
      '',
      '- The kind of partner you attract',
      '- What relationships teach you',
      '- Where things feel easy or challenging',
      '',
      'In matching, this shows the **type** of partner your chart keeps calling in, not just who you are attracted to this week.',
      '',
      '### Vedic as a bonus lens in AstroMatch',
      '',
      'The main AstroMatch engine is built on:',
      '',
      '- **Chinese patterns + elements** (~70%)',
      '- **Western signs + elements** (~30%)',
      '',
      'Vedic insights are an **extra layer** you can explore in AstroLab – especially useful if you are already into Vedic, or you want to understand why a connection feels karmic, fated or strangely timed.',
    ].join('\n'),
  },
  {
    id: 'vedic-timing-mahadashas',
    title: 'Timing & Mahadashas',
    subtitle: 'Planetary periods and relationship timing',
    preview:
      'A simple introduction to Vedic planetary periods – why some years feel soft and romantic, and others feel heavy or karmic.',
    comingSoon: true,
    body: [
      'In Vedic astrology, long planetary cycles called **mahadashas** describe which planet is "running the show" in your life at any given time.',
      'Each period usually lasts several years and colours everything – work, health, relationships, inner focus.',
      '',
      'When a relationship begins during a **Venus, Moon or Jupiter** period, it often feels very different than one that starts in a **Saturn or Ketu** period.',
      '',
      'For AstroLab, we will eventually add a **simple, user-friendly view** of these cycles – no complicated tables, just:',
      '',
      '- The theme of your current planetary period',
      '- How it colours your love life right now',
      '',
      'For now, treat mahadashas as a reminder that **timing matters**.',
      'Sometimes the chart is saying "open up", and sometimes it is saying "rebuild and reset" before the next big connection.',
    ].join('\n'),
  },
];
