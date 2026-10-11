export type TasteProfile = {
  liked: string[];
  disliked: string[];
  boring: string[];
  interests: string[];
  aesthetic: 'pastel' | 'scrapbook' | 'blueprint' | 'neon' | 'minimal' | 'retro';
  themeId: string;
  calibratedAt: number;
};

export type Reel = {
  id: string;
  creator: string;
  caption: string;
  videoUrl: string;
  posterUrl: string;
  topics: string[];
  kind: 'normal' | 'injected' | 'mirror' | 'probe';
  durationSec: number;
};

export type SessionState = {
  startedAt: number;
  reelsWatched: number;
  lookBacksUsed: number;
  history: string[];
  currentIndex: number;
  phase: 0 | 1 | 2 | 3;
};
