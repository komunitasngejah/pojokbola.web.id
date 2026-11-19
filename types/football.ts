/**
 * Tipe data internal PojokBola.
 * Semua provider API WAJIB dinormalisasi ke tipe ini (lihat lib/normalize),
 * sehingga komponen UI tidak bergantung pada format provider tertentu.
 */

export type MatchStatus =
  | 'SCHEDULED' // Dijadwalkan (belum dimulai)
  | 'LIVE' // Sedang berlangsung
  | 'HALFTIME' // Jeda babak pertama
  | 'FINISHED' // Selesai
  | 'POSTPONED' // Ditunda
  | 'SUSPENDED' // Dihentikan sementara
  | 'CANCELLED' // Dibatalkan
  | 'UNKNOWN'; // Status tidak dikenali provider

export interface Team {
  id: string;
  name: string;
  shortName: string | null;
  crestUrl: string | null;
}

export interface Competition {
  id: string;
  code: string; // mis. "PL", "PD", "CL"
  name: string;
  slug: string;
  areaName: string | null;
  emblemUrl: string | null;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: string;
  competition: Competition;
  season: string | null;
  matchday: number | null;
  kickoffUtc: string; // ISO 8601, selalu UTC
  status: MatchStatus;
  /** Menit pertandingan jika tersedia dari provider (null jika tidak ada). */
  minute: number | null;
  home: Team;
  away: Team;
  score: {
    fullTime: MatchScore;
    halfTime: MatchScore;
  };
  venue: string | null;
}

export interface StandingRow {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string | null;
}

export interface Standings {
  competition: Competition;
  season: string | null;
  rows: StandingRow[];
}

/** Bungkus respons standar untuk setiap endpoint internal. */
export interface ApiEnvelope<T> {
  data: T;
  /** Waktu data diambil dari provider (ISO 8601 UTC). */
  fetchedAt: string;
  /** Apakah data berasal dari cache. */
  cached: boolean;
  /** Pesan untuk UI bila data sebagian/tidak tersedia. */
  notice?: string;
}

export interface ApiErrorBody {
  error: {
    code: 'RATE_LIMITED' | 'UPSTREAM_UNAVAILABLE' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL';
    message: string;
  };
}

export interface TopScorer {
  rank: number;
  playerName: string;
  nationality: string | null;
  team: Team;
  goals: number;
  assists: number | null;
  playedMatches: number | null;
}

export interface Scorers {
  competition: Competition;
  season: string | null;
  rows: TopScorer[];
}
