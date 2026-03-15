/**
 * Service icon map and colour-theme definitions used both in the public
 * Services section and in the admin ServiceForm picker.
 */
import type { ReactNode } from 'react'

const CLS = 'w-7 h-7'
const S   = 'currentColor'

// ── Icons ──────────────────────────────────────────────────────────────────

export const SERVICE_ICONS: Record<string, ReactNode> = {
  film: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h1.5m-1.5 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5" />
    </svg>
  ),
  broadcast: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  ),
  camera: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  globe: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  book: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  image: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  sparkles: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  chart: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  code: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  cube: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  lightning: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  rocket: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  eye: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  palette: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  microphone: (
    <svg className={CLS} fill="none" viewBox="0 0 24 24" stroke={S} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
}

export const SERVICE_ICON_LABELS: Record<string, string> = {
  film:       'Film / Grid',
  broadcast:  'Broadcast',
  camera:     'Video Camera',
  globe:      'Globe',
  book:       'Book',
  image:      'Image',
  sparkles:   'Sparkles / AI',
  chart:      'Chart',
  code:       'Code',
  cube:       'Cube / 3D',
  lightning:  'Lightning',
  rocket:     'Rocket',
  eye:        'Eye',
  palette:    'Palette',
  microphone: 'Microphone',
}

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS)

// ── Colour themes ───────────────────────────────────────────────────────────

export type ServiceTheme = {
  name:   string
  color:  string   // Tailwind bg-gradient class fragment
  border: string   // Tailwind hover:border class
  glow:   string   // rgba string for radial gradient
  accent: string   // hex colour for tinted elements
}

export const SERVICE_THEMES: Record<string, ServiceTheme> = {
  cyan: {
    name:   'Cyan / Blue',
    color:  'from-cyan-500/20 to-blue-500/5',
    border: 'hover:border-cyan-400/30',
    glow:   'rgba(34,211,238,0.12)',
    accent: '#22d3ee',
  },
  indigo: {
    name:   'Indigo / Purple',
    color:  'from-indigo-500/20 to-purple-500/5',
    border: 'hover:border-indigo-400/30',
    glow:   'rgba(99,102,241,0.12)',
    accent: '#818cf8',
  },
  blue: {
    name:   'Blue / Cyan',
    color:  'from-blue-500/20 to-cyan-500/5',
    border: 'hover:border-blue-400/30',
    glow:   'rgba(59,130,246,0.12)',
    accent: '#60a5fa',
  },
  teal: {
    name:   'Teal / Cyan',
    color:  'from-teal-500/20 to-cyan-500/5',
    border: 'hover:border-teal-400/30',
    glow:   'rgba(20,184,166,0.12)',
    accent: '#2dd4bf',
  },
  rose: {
    name:   'Rose / Pink',
    color:  'from-rose-500/20 to-pink-500/5',
    border: 'hover:border-rose-400/30',
    glow:   'rgba(244,63,94,0.12)',
    accent: '#fb7185',
  },
  violet: {
    name:   'Violet / Purple',
    color:  'from-violet-500/20 to-purple-500/5',
    border: 'hover:border-violet-400/30',
    glow:   'rgba(139,92,246,0.12)',
    accent: '#a78bfa',
  },
  amber: {
    name:   'Amber / Orange',
    color:  'from-amber-500/20 to-orange-500/5',
    border: 'hover:border-amber-400/30',
    glow:   'rgba(245,158,11,0.12)',
    accent: '#fbbf24',
  },
  emerald: {
    name:   'Emerald / Green',
    color:  'from-emerald-500/20 to-green-500/5',
    border: 'hover:border-emerald-400/30',
    glow:   'rgba(16,185,129,0.12)',
    accent: '#34d399',
  },
  pink: {
    name:   'Pink / Rose',
    color:  'from-pink-500/20 to-rose-500/5',
    border: 'hover:border-pink-400/30',
    glow:   'rgba(236,72,153,0.12)',
    accent: '#f472b6',
  },
}

export const SERVICE_THEME_NAMES = Object.keys(SERVICE_THEMES)
