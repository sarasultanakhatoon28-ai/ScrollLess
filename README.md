import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { buildReelList } from './data/reels';
import { useAppStore } from './store';
import { TasteProfile } from './types';

type SurveyAnswerState = {
  liked: string[];
  disliked: string[];
  hobbies: string[];
  boring: string[];
  aesthetic: string[];
  goals: string[];
  formats: string[];
  interests: string[];
};

const themeMap = {
  pastel: {
    id: 'pastel',
    bg: '#F8E3D5',
    panel: '#FFF8F3',
    accent: '#F58B74',
    accentStrong: '#E9776F',
    accentTwo: '#99D6C7',
    text: '#362728',
    border: '#F3C9D8',
    buttonRadius: '9999px',
    fontFamily: '"Trebuchet MS", "Avenir Next", sans-serif',
    label: 'Pastel'
  },
  scrapbook: {
    id: 'scrapbook',
    bg: '#FEEBD9',
    panel: '#FFF9F1',
    accent: '#EFAF71',
    accentStrong: '#F48077',
    accentTwo: '#8ED2AF',
    text: '#3D2B2E',
    border: '#F1CFAF',
    buttonRadius: '1.25rem',
    fontFamily: '"Comic Sans MS", "Marker Felt", sans-serif',
    label: 'Scrapbook'
  },
  blueprint: {
    id: 'blueprint',
    bg: '#EAF3FF',
    panel: '#F6FAFF',
    accent: '#5C8DFF',
    accentStrong: '#3E6FED',
    accentTwo: '#77C9D7',
    text: '#1B2D3F',
    border: '#BFD8FF',
    buttonRadius: '0.85rem',
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    label: 'Science'
  },
  neon: {
    id: 'neon',
    bg: '#120F2B',
    panel: '#1E1A39',
    accent: '#00F5D4',
    accentStrong: '#FF4D8D',
    accentTwo: '#FFB703',
    text: '#F6F0FF',
    border: '#4BFFCF',
    buttonRadius: '0.9rem',
    fontFamily: '"Courier New", monospace',
    label: 'Gaming'
  },
  minimal: {
    id: 'minimal',
    bg: '#F4F4F3',
    panel: '#FEFEFE',
    accent: '#242424',
    accentStrong: '#4B4B4B',
    accentTwo: '#ADADAD',
    text: '#1E1E1E',
    border: '#D9D9D9',
    buttonRadius: '9999px',
    fontFamily: '"Helvetica Neue", sans-serif',
    label: 'Minimal'
  },
  retro: {
    id: 'retro',
    bg: '#F6B5A0',
    panel: '#F8E7D3',
    accent: '#D76A6A',
    accentStrong: '#FB8F67',
    accentTwo: '#F7D67A',
    text: '#2C1E1D',
    border: '#E68F7A',
    buttonRadius: '1.2rem',
    fontFamily: '"Georgia", serif',
    label: 'Retro'
  }
} as const;

const SurveyQuestions = [
  { key: 'liked', prompt: 'What topics make you feel alive?', options: ['vlogs', 'lifestyle', 'travel', 'food', 'art', 'music', 'gaming', 'fashion', 'science', 'nature'], multi: true },
  { key: 'disliked', prompt: 'Which topics do you actively dislike?', options: ['politics', 'news', 'sales', 'reality TV', 'crypto', 'fitness', 'horror', 'makeup', 'finance', 'drama'], multi: true },
  { key: 'hobbies', prompt: 'What hobbies light you up?', options: ['reading', 'drawing', 'gardening', 'crafting', 'baking', 'cycling', 'hiking', 'learning', 'games', 'journaling'], multi: true },
  { key: 'boring', prompt: 'Which of these would bore you?', options: ['science explainers', 'DIY/craft', 'coding', 'history', 'nature documentaries', 'economics', 'manuals', 'long lectures', 'backyard gardening', 'slow travel'], multi: true },
  { key: 'aesthetic', prompt: 'What vibe feels right for your app?', options: ['pastel', 'scrapbook', 'blueprint', 'neon', 'minimal', 'retro'], multi: false },
  { key: 'interests', prompt: 'What are you curious about in daily life?', options: ['wellness', 'design', 'architecture', 'books', 'health', 'culture', 'space', 'sustainability', 'photography', 'food'], multi: true },
  { key: 'goals', prompt: 'Do you want to spend less time on your phone?', options: ['Yes, a lot less', 'Somewhat', 'Not sure', 'I want better control', 'I am not trying to change'], multi: false },
  { key: 'formats', prompt: 'What content formats do you enjoy?', options: ['vlog', 'tutorial', 'comedy', 'science', 'gaming', 'DIY', 'documentary', 'talks', 'storytime', 'challenges'], multi: true },
  { key: 'liked', prompt: 'Which of these feels like a perfect evening scroll?', options: ['cozy routines', 'soft voiceovers', 'slow life videos', 'food stories', 'home décor', 'creative process', 'nature loops', 'short comedy', 'micro science', 'cute animals'], multi: true },
  { key: 'disliked', prompt: 'What kind of content feels overstimulating?', options: ['fast cuts', 'shouting voices', 'commentary wars', 'constant notifications', 'too much text', 'aggressive edits', 'caption overload', 'instant reactivity'], multi: true },
  { key: 'hobbies', prompt: 'What do you love doing when you are not on your phone?', options: ['making things', 'journaling', 'walking', 'cooking', 'reading', 'playing games', 'watching films', 'studying', 'listening to music', 'being outside'], multi: true },
  { key: 'interests', prompt: 'Which subjects would you happily spend 20 minutes learning?', options: ['history', 'biology', 'design', 'psychology', 'crafting', 'languages', 'geography', 'astronomy', 'coding', 'architecture'], multi: true },
  { key: 'formats', prompt: 'What kind of short content feels satisfying to finish?', options: ['story arcs', 'how-to clips', 'quiet ambient videos', 'explainers', 'mini challenges', 'travel diaries', 'facts', 'cute moments', 'behind-the-scenes', 'good ideas'], multi: true },
  { key: 'aesthetic', prompt: 'Choose the visual style you enjoy most in content.', options: ['pastel', 'scrapbook', 'blueprint', 'neon', 'minimal', 'retro'], multi: false },
  { key: 'goals', prompt: 'Which is the truest statement for you right now?', options: ['I want my attention back', 'I want more calm', 'I want more inspiration', 'I want balance', 'I want to keep scrolling but with awareness'], multi: false },
  { key: 'formats', prompt: 'Which kinds of creators do you trust most?', options: ['slow vloggers', 'creators with calm pacing', 'scientists', 'curators', 'teachers', 'documentarians', 'creatives', 'comedians', 'storytellers', 'gamers'], multi: true }
];

const defaultSurveyAnswers: SurveyAnswerState = {
  liked: ['vlogs', 'lifestyle'],
  disliked: ['news'],
  hobbies: ['reading', 'drawing', 'walking'],
  boring: ['science explainers', 'DIY/craft', 'coding', 'history', 'nature documentaries'],
  aesthetic: ['scrapbook'],
  goals: ['I want my attention back'],
  formats: ['vlog', 'tutorial', 'science', 'documentary'],
  interests: ['wellness', 'design', 'food', 'culture']
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function toReadableTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function buildTasteProfileFromSurvey(answers: SurveyAnswerState): TasteProfile {
  const liked = Array.from(new Set([...answers.liked, 'vlogs', 'lifestyle', 'travel', 'food', 'wellness']));
  const disliked = Array.from(new Set([...answers.disliked, 'news', 'sales', 'crypto']));
  const interests = Array.from(new Set([...answers.interests, 'design', 'wellness', 'architecture', 'books']));
  const boring = Array.from(new Set(answers.boring.length ? answers.boring : ['science explainers', 'DIY/craft', 'coding', 'history', 'nature documentaries']));
  const aestheticValue = (answers.aesthetic[0] as TasteProfile['aesthetic']) || 'scrapbook';
  const themeId = aestheticValue === 'pastel' ? 'pastel' : aestheticValue === 'blueprint' ? 'blueprint' : aestheticValue === 'neon' ? 'neon' : aestheticValue === 'minimal' ? 'minimal' : aestheticValue === 'retro' ? 'retro' : 'scrapbook';

  return {
    liked,
    disliked,
    boring,
    interests,
    aesthetic: aestheticValue,
    themeId,
    calibratedAt: Date.now()
  };
}

function ThemeProvider({ children, value }: { children: ReactNode; value: (typeof themeMap)[keyof typeof themeMap] }) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

const ThemeContext = React.createContext<(typeof themeMap)[keyof typeof themeMap]>(themeMap.scrapbook);

function App() {
  const {
    onboardingComplete,
    setOnboardingComplete,
    setSession,
    session,
    setTasteProfile,
    tasteProfile,
    timeMultiplier,
    setTimeMultiplier,
    showDebug,
    toggleDebug
  } = useAppStore();

  const [surveyStep, setSurveyStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswerState>(defaultSurveyAnswers);
  const [toast, setToast] = useState<string | null>(null);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [heartBurst, setHeartBurst] = useState<string | null>(null);
  const [isExitedScreen, setIsExitedScreen] = useState(false);
  const [pauseVideo, setPauseVideo] = useState(false);
  const [clockSeconds, setClockSeconds] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const feedRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const reelList = useMemo(() => buildReelList(tasteProfile), [tasteProfile]);

  const currentTheme = useMemo(() => {
    const mapKey = tasteProfile?.themeId as keyof typeof themeMap | undefined;
    return mapKey ? themeMap[mapKey] || themeMap.scrapbook : themeMap.scrapbook;
  }, [tasteProfile]);

  const elapsedAppSeconds = useMemo(() => {
    if (!onboardingComplete || !session.startedAt) return 0;
    return ((Date.now() - session.startedAt) / 1000) * timeMultiplier;
  }, [onboardingComplete, session.startedAt, timeMultiplier]);

  useEffect(() => {
    if (!onboardingComplete) return;
    const id = window.setInterval(() => setClockSeconds(elapsedAppSeconds), 1000);
    return () => window.clearInterval(id);
  }, [elapsedAppSeconds, onboardingComplete]);

  const surveyProgress = ((surveyStep + 1) / SurveyQuestions.length) * 100;
  const currentQuestion = SurveyQuestions[surveyStep];

  const calibrationProgress = useMemo(() => {
    if (!onboardingComplete) return 0;
    const timeRatio = clamp((clockSeconds / (60 * 60)) * 100, 0, 100);
    const interactionRatio = clamp((session.reelsWatched / 40) * 100, 0, 100);
    return Math.round(Math.min(timeRatio, interactionRatio));
  }, [clockSeconds, onboardingComplete, session.reelsWatched]);

  const activePhase = useMemo(() => {
    if (!onboardingComplete) return 0;
    if (clockSeconds >= 30 * 60) return 3;
    if (clockSeconds >= 10 * 60) return 2;
    if (clockSeconds >= 60 || session.reelsWatched >= 40) return 1;
    return 0;
  }, [clockSeconds, onboardingComplete, session.reelsWatched]);

  useEffect(() => {
    if (!onboardingComplete) return;
    setSession({
      ...session,
      phase: activePhase as 0 | 1 | 2 | 3
    });
  }, [activePhase, onboardingComplete]);

  const creativity = useMemo(() => {
    const value = 100 * Math.exp(-session.reelsWatched / 80);
    return clamp(Math.round(value), 0, 100);
  }, [session.reelsWatched]);

  const brainStage = useMemo(() => {
    if (creativity >= 90) return 1;
    if (creativity >= 70) return 2;
    if (creativity >= 40) return 3;
    if (creativity >= 15) return 4;
    return 5;
  }, [creativity]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!onboardingComplete) return;
    const video = videoRefs.current[reelList[currentIndex]?.id];
    if (!video) return;
    if (pauseVideo) {
      video.pause();
    } else {
      video.play().catch(() => undefined);
    }
  }, [currentIndex, onboardingComplete, pauseVideo, reelList]);

  const lookBacksLeft = Math.max(0, 3 - session.lookBacksUsed);

  function handleSelect(option: string) {
    const key = currentQuestion.key as keyof SurveyAnswerState;

    if (currentQuestion.multi) {
      setAnswers((prev) => {
        const existing = prev[key] as string[];
        return {
          ...prev,
          [key]: existing.includes(option) ? existing.filter((value) => value !== option) : [...existing, option]
        };
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [key]: [option]
      }));
      setSurveyStep((step) => step + 1);
    }
  }

  function advanceSurvey() {
    if (surveyStep >= SurveyQuestions.length - 1) {
      const profile = buildTasteProfileFromSurvey(answers);
      setTasteProfile(profile);
      setOnboardingComplete(true);
      setSession({
        startedAt: Date.now(),
        reelsWatched: 0,
        lookBacksUsed: 0,
        history: ['calibration-started'],
        currentIndex: 0,
        phase: 0
      });
      return;
    }

    setSurveyStep((step) => step + 1);
  }

  function handleFeedScroll() {
    if (!feedRef.current) return;
    const container = feedRef.current;
    const nextIndex = Math.round(container.scrollTop / container.clientHeight);
    if (nextIndex === currentIndex) return;

    const previousIndex = currentIndex;
    const safeIndex = clamp(nextIndex, 0, reelList.length - 1);

    setCurrentIndex(safeIndex);
    setSession({
      ...session,
      currentIndex: safeIndex,
      reelsWatched: Math.max(session.reelsWatched, safeIndex + 1),
      history: [...session.history, `reel-${safeIndex}`]
    });

    // Look-back rule: users may only revisit the last 5 reels
    // and only 3 times total for the full session.
    if (safeIndex < previousIndex) {
      if (safeIndex >= Math.max(0, reelList.length - 5) && session.lookBacksUsed < 3) {
        setSession({
          ...session,
          currentIndex: safeIndex,
          lookBacksUsed: session.lookBacksUsed + 1,
          reelsWatched: Math.max(session.reelsWatched, safeIndex + 1)
        });
      } else {
        setToast('You\'ve used all your look-backs. Forward is the only way now.');
        container.scrollTo({ top: previousIndex * container.clientHeight, behavior: 'smooth' });
      }
    }
  }

  function handleBackAttempt() {
    if (session.lookBacksUsed >= 3 || session.currentIndex < reelList.length - 5) {
      setToast('You\'ve used all your look-backs. Forward is the only way now.');
      return;
    }

    const nextIndex = Math.max(0, session.currentIndex - 1);
    setCurrentIndex(nextIndex);
    setSession({
      ...session,
      currentIndex: nextIndex,
      lookBacksUsed: session.lookBacksUsed + 1,
      reelsWatched: Math.max(session.reelsWatched, nextIndex + 1)
    });

    if (feedRef.current) {
      const height = feedRef.current.clientHeight;
      feedRef.current.scrollTo({ top: nextIndex * height, behavior: 'smooth' });
    }
  }

  function toggleLike(reelId: string) {
    setLikedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
    setHeartBurst(reelId);
    window.setTimeout(() => setHeartBurst(null), 600);
  }

  if (!onboardingComplete) {
    return (
      <ThemeProvider value={themeMap.scrapbook}>
        <div className="min-h-screen bg-[#FFF7F0] p-4 flex items-center justify-center">
          <div className="phone-shell" style={{ background: '#FFF8F5', borderColor: 'rgba(108,82,70,0.18)' }}>
            <div className="h-full p-4 flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.25em] text-stone-400">ScrollLess</div>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F9D9C8] text-[#2D1A1D]">
                  Step {surveyStep + 1}/{SurveyQuestions.length}
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#F58B74] via-[#F7A97D] to-[#8DD8C4]"
                  initial={{ width: 0 }}
                  animate={{ width: `${surveyProgress}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.prompt}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.22 }}
                  className="mt-8 flex-1"
                >
                  <div className="mb-5 text-[0.68rem] uppercase tracking-[0.2em] text-stone-500">Research Hour</div>
                  <h1 className="text-3xl font-black leading-tight text-[#2D1A1D]">{currentQuestion.prompt}</h1>

                  <div className="mt-6 space-y-3">
                    {currentQuestion.options.map((option) => {
                      const selected = currentQuestion.multi
                        ? (answers[currentQuestion.key as keyof SurveyAnswerState] as string[]).includes(option)
                        : (answers[currentQuestion.key as keyof SurveyAnswerState] as string[])[0] === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelect(option)}
                          className={[
                            'w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all',
                            selected ? 'border-[#F58B74] bg-[#FCEEE7] text-[#2D1A1D] shadow-sm' : 'border-[#E8DED8] bg-white/70 text-[#4A3940]'
                          ].join(' ')}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSurveyStep((value) => Math.max(value - 1, 0))}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 disabled:opacity-40"
                  disabled={surveyStep === 0}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentQuestion.multi) {
                      advanceSurvey();
                    }
                  }}
                  className="rounded-full bg-[#2D1A1D] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {surveyStep === SurveyQuestions.length - 1 ? 'Finish survey' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (isExitedScreen) {
    return (
      <ThemeProvider value={currentTheme}>
        <div className="min-h-screen bg-[#FFF8F3] p-4 flex items-center justify-center">
          <div className="phone-shell" style={{ background: currentTheme.bg, borderColor: currentTheme.border }}>
            <div className="h-full flex flex-col items-center justify-center px-8 text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-5 text-6xl">🌿</motion.div>
              <h2 className="text-3xl font-black text-[#2D1A1D]">Take a breath.</h2>
              <p className="mt-3 text-base text-[#4A3940]">ScrollLess is here to remind you that not every moment needs to be optimized.</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-8 rounded-full bg-[#2D1A1D] px-6 py-3 text-sm font-semibold text-white">
                Restart
              </button>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={currentTheme}>
      <div className="min-h-screen p-4 text-[#2D1A1D] flex items-center justify-center" style={{ background: currentTheme.bg, fontFamily: currentTheme.fontFamily }}>
        <div className="phone-shell relative" style={{ background: currentTheme.bg, borderColor: currentTheme.border }}>
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-2 pt-4">
            <div className="rounded-full border border-black/10 bg-white/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur">{currentTheme.label}</div>
            <button type="button" onClick={toggleDebug} className="rounded-full border border-black/10 bg-white/60 px-2 py-2 text-lg backdrop-blur">⚙</button>
          </div>

          {showDebug && (
            <div className="absolute left-2 top-14 z-50 w-[220px] rounded-2xl border border-stone-200 bg-white/90 p-3 shadow-xl backdrop-blur">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Debug</span>
                <button type="button" onClick={toggleDebug} className="text-[10px] uppercase tracking-[0.2em] text-stone-600">Hide</button>
              </div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-stone-500">Time multiplier</label>
              <input type="range" min={1} max={120} step={1} value={timeMultiplier} onChange={(e) => setTimeMultiplier(Number(e.target.value))} className="w-full" />
              <div className="mt-2 text-sm font-semibold text-[#2D1A1D]">1 real sec = {timeMultiplier} app sec</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setSession({ ...session, phase: 0, startedAt: Date.now(), currentIndex: 0 })} className="rounded-lg bg-stone-100 px-2 py-1.5 text-[10px]">Phase 0</button>
                <button type="button" onClick={() => setSession({ ...session, phase: 1, startedAt: Date.now() - 10 * 60 * 1000, currentIndex: 0 })} className="rounded-lg bg-stone-100 px-2 py-1.5 text-[10px]">Phase 1</button>
                <button type="button" onClick={() => setSession({ ...session, phase: 2, startedAt: Date.now() - 20 * 60 * 1000, currentIndex: 0 })} className="rounded-lg bg-stone-100 px-2 py-1.5 text-[10px]">Phase 2</button>
                <button type="button" onClick={() => setSession({ ...session, phase: 3, startedAt: Date.now() - 30 * 60 * 1000, currentIndex: 0 })} className="rounded-lg bg-stone-100 px-2 py-1.5 text-[10px]">Phase 3</button>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-16 z-20 flex flex-col gap-2">
            <MindMeter creativity={creativity} brainStage={brainStage} />
          </div>

          <div className="absolute right-3 top-16 z-20 flex flex-col gap-3">
            <button type="button" onClick={() => toggleLike(reelList[currentIndex]?.id || 'empty')} className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 text-xl shadow-sm">
              {likedReels[reelList[currentIndex]?.id || 'empty'] ? '♥' : '♡'}
            </button>
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 text-xl shadow-sm">💬</button>
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 text-xl shadow-sm">↗</button>
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 text-xl shadow-sm">🔖</button>
          </div>

          <div ref={feedRef} className="feed-scroll h-full overflow-y-auto" onScroll={handleFeedScroll}>
            {reelList.map((reel, index) => {
              const isActive = index === currentIndex;
              const showProbe = activePhase === 0 && index > 0 && index % 5 === 0 && index < 40;
              const showMirror = activePhase === 3 && index > 0 && index % 10 === 0;

              return (
                <div key={reel.id} className="feed-card relative h-full w-full">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.38)), url(${reel.posterUrl})` }} />
                  <video
                    ref={(node) => {
                      if (node) videoRefs.current[reel.id] = node;
                    }}
                    playsInline
                    muted
                    loop
                    autoPlay={isActive}
                    poster={reel.posterUrl}
                    className={`h-full w-full object-cover transition-all ${isActive ? 'opacity-100' : 'opacity-80'}`}
                    onClick={() => setPauseVideo((value) => !value)}
                    onDoubleClick={() => toggleLike(reel.id)}
                  >
                    <source src={reel.videoUrl} type="video/mp4" />
                  </video>

                  {heartBurst === reel.id && (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl text-[#F76C6C]">
                      ❤
                    </motion.div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <div className="flex items-end justify-between gap-3">
                      <div className="max-w-[74%]">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">{reel.creator}</div>
                          {reel.kind === 'injected' && <div className="rounded-full bg-[#F9E2D9] px-2 py-0.5 text-[9px] font-medium text-[#4A3940]">Why am I seeing this?</div>}
                        </div>
                        <p className="text-sm leading-relaxed text-white drop-shadow-md">{reel.caption}</p>
                      </div>
                    </div>
                  </div>

                  {reel.kind === 'injected' && (
                    <div className="absolute left-1/2 top-24 -translate-x-1/2 rounded-full border border-white/50 bg-black/30 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      Because you said it bored you
                    </div>
                  )}

                  {showProbe && (
                    <div className="absolute inset-x-4 bottom-24 z-20">
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-[#E5D7CD] bg-white/90 p-4 shadow-lg">
                        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">Calibration Probe</div>
                        <div className="mb-4 text-lg font-black text-[#2D1A1D]">How did that feel?</div>
                        <div className="grid grid-cols-3 gap-2">
                          {['Boring', 'Fine', 'Love it'].map((label) => (
                            <button key={label} type="button" className="rounded-full bg-[#F9EFEA] px-3 py-3 text-sm font-semibold text-[#2D1A1D]" onClick={() => setToast(`Logged feedback: ${label}`)}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {showMirror && (
                    <div className="absolute inset-x-4 top-24 z-20">
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-[#E5D7CD] bg-white/90 p-4 shadow-lg">
                        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">Personal Stats</div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-[#2D1A1D]">
                          <div><span className="block text-stone-500">Minutes</span><strong>{toReadableTime(clockSeconds)}</strong></div>
                          <div><span className="block text-stone-500">Reels</span><strong>{session.reelsWatched}</strong></div>
                          <div><span className="block text-stone-500">Dopamine spikes</span><strong>{Math.round(session.reelsWatched * 0.8)}</strong></div>
                          <div><span className="block text-stone-500">Lost/yr</span><strong>{Math.round((session.reelsWatched / 60) * 220)}h</strong></div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/40 via-black/20 to-transparent px-4 pb-4 pt-10">
            <div className="flex items-center justify-between gap-2">
              <div className="rounded-full bg-white/80 px-3 py-2 text-[11px] font-semibold text-[#2D1A1D] backdrop-blur">
                {activePhase === 0 ? `Calibration: ${calibrationProgress}% complete` : activePhase === 1 ? 'Phase 1: feed' : activePhase === 2 ? 'Phase 2: boredom injection' : 'Phase 3: reality check'}
              </div>
              <div className="rounded-full bg-white/80 px-3 py-2 text-[11px] font-semibold text-[#2D1A1D] backdrop-blur">⏱ {toReadableTime(clockSeconds)}</div>
            </div>
          </div>

          <div className="absolute left-3 bottom-20 z-20">
            <div className={['rounded-full border border-black/10 bg-white/80 px-3 py-2 text-xs font-semibold text-[#2D1A1D] backdrop-blur transition-all duration-200', session.lookBacksUsed >= 3 ? 'opacity-40 grayscale' : 'opacity-100'].join(' ')}>
              ↩ Look-backs left: {lookBacksLeft}/3
            </div>
          </div>

          <div className="absolute left-1/2 bottom-20 z-20 -translate-x-1/2">
            <button type="button" onClick={handleBackAttempt} className={['rounded-full border border-black/10 bg-white/80 px-3 py-2 text-xs font-semibold text-[#2D1A1D] transition-all', session.lookBacksUsed >= 3 ? 'grayscale opacity-40' : 'opacity-100'].join(' ')}>
              Look back
            </button>
          </div>

          {activePhase === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 bg-[#FFF9F5]/90 backdrop-blur-md">
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <motion.div className="mb-6 h-24 w-24 rounded-full border-[12px] border-[#F4B7A1] bg-[#F7E2D5] shadow-lg" animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

                <div className="mb-6 text-4xl font-black text-[#2D1A1D]">Take a break.</div>
                <div className="mb-6 flex items-center gap-3 text-sm text-[#473A3D]">
                  <span>4</span>
                  <div className="h-px w-8 bg-[#473A3D]" />
                  <span>7</span>
                  <div className="h-px w-8 bg-[#473A3D]" />
                  <span>8</span>
                </div>

                <div className="grid w-full max-w-[260px] gap-3">
                  <button type="button" onClick={() => { setToast('Take a break. The app is pausing for a moment.'); setIsExitedScreen(true); }} className="rounded-full bg-[#2D1A1D] px-4 py-3 text-sm font-semibold text-white">
                    Close the app
                  </button>
                  <button type="button" onClick={() => { setToast('You chose a short pause.'); setIsExitedScreen(true); }} className="rounded-full border border-[#2D1A1D]/20 bg-white/70 px-4 py-3 text-sm font-semibold text-[#2D1A1D]">
                    Take a break
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {toast && (
            <div className="absolute bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#2D1A1D] px-4 py-2 text-xs font-semibold text-white shadow-lg">{toast}</div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

function MindMeter({ creativity, brainStage }: { creativity: number; brainStage: number }) {
  const stageTexts = [
    'Brain\'s feeling inspired!',
    'Hmm, where did that idea go?',
    'Brain is buffering…',
    'Brain has left the chat.',
    'Creative battery: 4%. Please go outside.'
  ];

  const stageColors = ['#F8B7C4', '#E7B898', '#A7A7A7', '#888989', '#636363'];

  return (
    <motion.div layout className="rounded-[26px] border border-black/10 bg-white/70 p-3 shadow-sm backdrop-blur" animate={{ backgroundColor: stageColors[brainStage - 1] ?? '#F8B7C4' }} transition={{ duration: 0.35 }}>
      <div className="flex items-center gap-3">
        <svg width="62" height="62" viewBox="0 0 100 100" className="overflow-visible">
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <motion.path d="M30 38C30 22 42 15 55 15C67 15 78 23 78 39C78 53 65 58 56 68C50 74 47 81 45 89" fill="none" stroke="#2D1A1D" strokeWidth="5" strokeLinecap="round" />
            <motion.path d="M26 34C23 16 33 7 48 10C58 12 63 18 62 26C61 35 52 38 46 41C38 46 25 43 26 34Z" fill="#FFCEDB" opacity={brainStage === 1 ? 1 : 0.7} />
            <circle cx="44" cy="41" r="6" fill="#2D1A1D" />
            <circle cx="62" cy="41" r="6" fill="#2D1A1D" />
            <path d="M40 57C48 60 58 60 66 57" stroke="#2D1A1D" strokeWidth="4" strokeLinecap="round" fill="none" />
            {brainStage === 1 && <><path d="M24 26L18 18" stroke="#F58B74" strokeWidth="3" strokeLinecap="round" /><path d="M74 22L80 15" stroke="#F58B74" strokeWidth="3" strokeLinecap="round" /><circle cx="18" cy="18" r="4" fill="#FCD561" /><circle cx="80" cy="15" r="4" fill="#FCD561" /></>}
            {brainStage === 2 && <path d="M52 18L62 8" stroke="#8E8E8E" strokeWidth="3" strokeLinecap="round" />}
            {brainStage === 3 && <path d="M41 18C50 10 63 13 68 20" stroke="#7D7D7D" strokeWidth="3" strokeLinecap="round" />}
            {brainStage === 4 && <><circle cx="46" cy="38" r="4" fill="#8E8E8E" /><circle cx="60" cy="38" r="4" fill="#8E8E8E" /><path d="M43 56C48 58 57 58 63 56" stroke="#8E8E8E" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M61 18C66 24 70 18 68 13" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" /></>}
            {brainStage === 5 && <><circle cx="47" cy="40" r="3" fill="#6A6A6A" /><circle cx="59" cy="40" r="3" fill="#6A6A6A" /><path d="M46 55C52 58 58 58 64 55" stroke="#6A6A6A" strokeWidth="2.5" strokeLinecap="round" fill="none" /><path d="M68 21C68 18 70 15 75 15C79 15 82 19 82 23C82 27 79 29 75 29" stroke="#6A6A6A" strokeWidth="2.5" strokeLinecap="round" fill="none" /></>}
          </motion.g>
        </svg>

        <div className="flex flex-col">
          <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500">creativity</div>
          <div className="text-[26px] font-black leading-none text-[#2D1A1D]">{creativity}%</div>
          <div className="mt-1 text-[10px] text-[#2D1A1D]">{stageTexts[brainStage - 1] || stageTexts[0]}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
