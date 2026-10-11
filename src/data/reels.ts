import { Reel, TasteProfile } from '../types';

const sampleVideoUrls = [
  'https://videos.pexels.com/video-files/855749/855749-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/857156/857156-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/853908/853908-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/4945122/4945122-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/3062549/3062549-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/853634/853634-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/2839228/2839228-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/2879147/2879147-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/4405347/4405347-hd_1920_1080_25fps.mp4'
];

const samplePosters = [
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80'
];

export const defaultBoringTopics = ['science explainers', 'DIY/craft', 'coding', 'history', 'nature documentaries'];

export function buildReelList(profile: TasteProfile | null): Reel[] {
  const boring = profile?.boring?.length ? profile.boring : defaultBoringTopics;
  const likes = profile?.liked?.length ? profile.liked : ['vlogs', 'lifestyle'];

  const reels: Reel[] = [];

  for (let i = 0; i < 220; i += 1) {
    const isInjected = i > 12 && i % 5 === 0;
    const isMirror = i > 16 && i % 10 === 0;
    const isProbe = i > 0 && i % 5 === 0 && i < 40;

    let kind: Reel['kind'] = 'normal';
    let topics: string[] = likes.slice(0, 2);
    let caption = 'A soft little ritual for a better day.';

    if (isInjected) {
      kind = 'injected';
      topics = boring.slice(0, 2);
      caption = 'Why am I seeing this? Because you said you find it boring — we\'re testing that.';
    } else if (isMirror) {
      kind = 'mirror';
      topics = ['dopamine', 'sleep', 'attention'];
      caption = 'A quick reality check on what the algorithm does to attention.';
    } else if (isProbe) {
      kind = 'probe';
      topics = ['calibration', 'reaction'];
      caption = 'This was a quick calibration check.';
    }

    reels.push({
      id: `reel-${i}`,
      creator: `@creator${(i % 10) + 1}`,
      caption,
      videoUrl: sampleVideoUrls[i % sampleVideoUrls.length],
      posterUrl: samplePosters[i % samplePosters.length],
      topics,
      kind,
      durationSec: 18 + (i % 7) * 3
    });
  }

  return reels;
}
