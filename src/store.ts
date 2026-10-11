import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionState, TasteProfile } from './types';

type AppState = {
  tasteProfile: TasteProfile | null;
  onboardingComplete: boolean;
  session: SessionState;
  timeMultiplier: number;
  showDebug: boolean;
  setTasteProfile: (profile: TasteProfile | null) => void;
  setOnboardingComplete: (value: boolean) => void;
  setSession: (session: SessionState) => void;
  updateSession: (partial: Partial<SessionState>) => void;
  setTimeMultiplier: (value: number) => void;
  toggleDebug: () => void;
};

const defaultSession: SessionState = {
  startedAt: Date.now(),
  reelsWatched: 0,
  lookBacksUsed: 0,
  history: [],
  currentIndex: 0,
  phase: 0
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tasteProfile: null,
      onboardingComplete: false,
      session: defaultSession,
      timeMultiplier: 1,
      showDebug: false,
      setTasteProfile: (profile) => set({ tasteProfile: profile }),
      setOnboardingComplete: (value) => set({ onboardingComplete: value }),
      setSession: (session) => set({ session }),
      updateSession: (partial) =>
        set((state) => ({
          session: {
            ...state.session,
            ...partial
          }
        })),
      setTimeMultiplier: (value) => set({ timeMultiplier: value }),
      toggleDebug: () => set((state) => ({ showDebug: !state.showDebug }))
    }),
    {
      name: 'scrollless-store',
      partialize: (state) => ({
        tasteProfile: state.tasteProfile,
        onboardingComplete: state.onboardingComplete,
        session: state.session,
        timeMultiplier: state.timeMultiplier
      })
    }
  )
);
