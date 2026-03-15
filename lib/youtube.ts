/**
 * YouTube utilities: ID extraction and thumbnail generation.
 */

/** Extract a YouTube video ID from any common URL format or a raw ID. */
export function extractYouTubeId(input: string): string | null {
  if (!input?.trim()) return null
  const s = input.trim()

  // Already a bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,          // watch?v=
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,       // youtu.be/
    /embed\/([a-zA-Z0-9_-]{11})/,           // /embed/
    /shorts\/([a-zA-Z0-9_-]{11})/,          // /shorts/
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/, // /live/
  ]

  for (const pattern of patterns) {
    const m = s.match(pattern)
    if (m) return m[1]
  }
  return null
}

/** Return the YouTube thumbnail URL for a given video ID. */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high',
): string {
  const q = {
    default:  'default',
    medium:   'mqdefault',
    high:     'hqdefault',
    standard: 'sddefault',
    maxres:   'maxresdefault',
  }[quality]
  return `https://img.youtube.com/vi/${videoId}/${q}.jpg`
}

/** Return a YouTube embed URL, optionally autoplay. */
export function getYouTubeEmbedUrl(videoId: string, autoplay = true): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`
}
