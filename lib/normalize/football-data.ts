import type { Competition, Match, MatchStatus, Standings, StandingRow, Team } from '@/types/football';

/**
 * Tipe respons mentah dari Football-Data.org (hanya bidang yang dipakai).
 * Tidak ada tipe mentah yang boleh keluar dari folder lib/.
 */
export interface FdTeam {
  id: number;
  name: string;
  shortName?: string | null;
  tla?: string | null;
  crest?: string | null;
}

export interface FdCompetition {
  id: number;
  code?: string;
  name: string;
  emblem?: string | null;
  area?: { name?: string | null } | null;
  currentSeason?: { startDate?: string; endDate?: string } | null;
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: string;
  minute?: number | null;
  matchday?: number | null;
  stage?: string | null;
  venue?: string | null;
  competition: FdCompetition;
  season?: { startDate?: string } | null;
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score: {
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
}

export interface FdMatchesResponse {
  matches: FdMatch[];
}

export interface FdStandingRow {
  position: number;
  team: FdTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string | null;
}

export interface FdStandingsResponse {
  competition: FdCompetition;
  season?: { startDate?: string } | null;
  standings: Array<{ type: string; table: FdStandingRow[] }>;
}

/** Peta status provider -> status internal PojokBola. */
const STATUS_MAP: Record<string, MatchStatus> = {
  SCHEDULED: 'SCHEDULED',
  TIMED: 'SCHEDULED',
  IN_PLAY: 'LIVE',
  PAUSED: 'HALFTIME',
  FINISHED: 'FINISHED',
  AWARDED: 'FINISHED',
  POSTPONED: 'POSTPONED',
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED',
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTeam(t: FdTeam): Team {
  return {
    id: String(t.id),
    name: t.name,
    shortName: t.shortName ?? t.tla ?? null,
    crestUrl: t.crest ?? null,
  };
}

export function normalizeCompetition(c: FdCompetition): Competition {
  return {
    id: String(c.id),
    code: c.code ?? '',
    name: c.name,
    slug: slugify(c.name),
    areaName: c.area?.name ?? null,
    emblemUrl: c.emblem ?? null,
  };
}

/**
 * Mengubah satu pertandingan mentah. Mengembalikan null bila data inti tidak valid
 * (misalnya tanggal tidak bisa dibaca), agar data rusak tidak tampil di situs.
 */
export function normalizeMatch(m: FdMatch): Match | null {
  const kickoff = new Date(m.utcDate);
  if (Number.isNaN(kickoff.getTime())) return null;

  const status = STATUS_MAP[m.status] ?? 'UNKNOWN';

  return {
    id: String(m.id),
    competition: normalizeCompetition(m.competition),
    season: m.season?.startDate ? m.season.startDate.slice(0, 4) : null,
    matchday: m.matchday ?? null,
    kickoffUtc: kickoff.toISOString(),
    status,
    minute: status === 'LIVE' && typeof m.minute === 'number' ? m.minute : null,
    home: normalizeTeam(m.homeTeam),
    away: normalizeTeam(m.awayTeam),
    score: {
      fullTime: { home: m.score.fullTime.home, away: m.score.fullTime.away },
      halfTime: { home: m.score.halfTime.home, away: m.score.halfTime.away },
    },
    venue: m.venue ?? null,
  };
}

export function normalizeStandings(res: FdStandingsResponse): Standings {
  // Ambil tabel "TOTAL" (klasemen keseluruhan), bukan HOME/AWAY.
  const total = res.standings.find((s) => s.type === 'TOTAL') ?? res.standings[0];
  const rows: StandingRow[] = (total?.table ?? []).map((r) => ({
    position: r.position,
    team: normalizeTeam(r.team),
    playedGames: r.playedGames,
    won: r.won,
    draw: r.draw,
    lost: r.lost,
    goalsFor: r.goalsFor,
    goalsAgainst: r.goalsAgainst,
    goalDifference: r.goalDifference,
    points: r.points,
    form: r.form ?? null,
  }));

  return {
    competition: normalizeCompetition(res.competition),
    season: res.season?.startDate ? res.season.startDate.slice(0, 4) : null,
    rows,
  };
}
