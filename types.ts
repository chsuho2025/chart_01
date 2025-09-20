export interface RankHistory {
  date: string; // "YYYY-MM-DD format."
  rank: number; // The rank on that date.
}

export interface Song {
  rank: number; // The song's current rank on the chart (1-20).
  title: string; // The title of the song.
  artist: string; // The artist(s) of the song.
  isRising: boolean; // True if the song is seeing a rapid surge in popularity.
  rankHistory: RankHistory[]; // An array of the song's rank for the last 7 days
  youtubeUrl: string; // A valid YouTube search URL for the song's official music video.
}

export interface ProcessedSong extends Song {
  rankChange: number | 'NEW';
  trendStatus: 'rising' | 'falling' | 'neutral';
}