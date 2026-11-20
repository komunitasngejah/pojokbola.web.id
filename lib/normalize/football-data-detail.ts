import type {
  Booking,
  ClubProfile,
  LineupPlayer,
  MatchDetail,
  MatchEvent,
  SquadMember,
  Substitution,
} from '@/types/football';
import { normalizeMatch, normalizeCompetition, type FdMatch } from './football-data';

/** Respons mentah /matches/{id}. Semua bidang opsional karena bergantung pada paket provider. */
export interface FdMatchDetail extends FdMatch {
  referees?: { name: string; role?: string | null; type?: string | null }[];
  goals?: {
    minute?: number | null;
    injuryTime?: number | null;
    type?: string | null;
    team?: { name?: string | null } | null;
    scorer?: { name?: string | null } | null;
    assist?: { name?: string | null } | null;
  }[];
  bookings?: {
    minute?: number | null;
    team?: { name?: string | null } | null;
    player?: { name?: string | null } | null;
    card?: string | null;
  }[];
  substitutions?: {
    minute?: number | null;
    team?: { name?: string | null } | null;
    playerOut?: { name?: string | null } | null;
    playerIn?: { name?: string | null } | null;
  }[];
  homeTeam: FdMatch['homeTeam'] & { lineup?: FdLineup[] };
  awayTeam: FdMatch['awayTeam'] & { lineup?: FdLineup[] };
}

interface FdLineup {
  name?: string | null;
  shirtNumber?: number | null;
  position?: string | null;
}

function toLineup(list: FdLineup[] | undefined): LineupPlayer[] {
  return (list ?? [])
    .filter((p) => p?.name)
    .map((p) => ({ name: p.name as string, shirtNumber: p.shirtNumber ?? null, position: p.position ?? null }));
}

const CARD_MAP: Record<string, Booking['card']> = {
  YELLOW_CARD: 'YELLOW',
  RED_CARD: 'RED',
  YELLOW_RED_CARD: 'YELLOW_RED',
};

export function normalizeMatchDetail(raw: FdMatchDetail): MatchDetail | null {
  const match = normalizeMatch(raw);
  if (!match) return null;

  const goals: MatchEvent[] = (raw.goals ?? []).map((g) => ({
    minute: g.minute ?? null,
    injuryTime: g.injuryTime ?? null,
    type: g.type ?? null,
    teamName: g.team?.name ?? null,
    scorer: g.scorer?.name ?? null,
    assist: g.assist?.name ?? null,
  }));

  const bookings: Booking[] = (raw.bookings ?? []).map((b) => ({
    minute: b.minute ?? null,
    teamName: b.team?.name ?? null,
    player: b.player?.name ?? null,
    card: CARD_MAP[b.card ?? ''] ?? 'UNKNOWN',
  }));

  const substitutions: Substitution[] = (raw.substitutions ?? []).map((s) => ({
    minute: s.minute ?? null,
    teamName: s.team?.name ?? null,
    playerIn: s.playerIn?.name ?? null,
    playerOut: s.playerOut?.name ?? null,
  }));

  const home = toLineup(raw.homeTeam.lineup);
  const away = toLineup(raw.awayTeam.lineup);

  return {
    match,
    venue: raw.venue ?? null,
    referees: (raw.referees ?? []).map((r) => ({ name: r.name, role: r.role ?? r.type ?? null })),
    goals,
    bookings,
    substitutions,
    lineups: home.length || away.length ? { home, away } : null,
  };
}

/** Respons mentah /teams/{id}. */
export interface FdTeamDetail {
  id: number;
  name: string;
  shortName?: string | null;
  crest?: string | null;
  founded?: number | null;
  venue?: string | null;
  address?: string | null;
  website?: string | null;
  clubColors?: string | null;
  coach?: { name?: string | null; nationality?: string | null } | null;
  runningCompetitions?: { id: number; code?: string; name: string }[];
  squad?: { name: string; position?: string | null; nationality?: string | null; dateOfBirth?: string | null }[];
}

export function normalizeClubProfile(t: FdTeamDetail): ClubProfile {
  const squad: SquadMember[] = (t.squad ?? []).map((p) => ({
    name: p.name,
    position: p.position ?? null,
    nationality: p.nationality ?? null,
    dateOfBirth: p.dateOfBirth ?? null,
  }));
  return {
    id: String(t.id),
    name: t.name,
    shortName: t.shortName ?? null,
    crestUrl: t.crest ?? null,
    founded: t.founded ?? null,
    venue: t.venue ?? null,
    address: t.address ?? null,
    website: t.website ?? null,
    clubColors: t.clubColors ?? null,
    coach: t.coach?.name ? { name: t.coach.name, nationality: t.coach.nationality ?? null } : null,
    competitions: (t.runningCompetitions ?? []).map((c) => ({ code: c.code ?? '', name: c.name })),
    squad,
  };
}

export { normalizeCompetition };
