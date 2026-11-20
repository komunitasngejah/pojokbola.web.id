import type { ClubProfile, Match, MatchDetail, Scorers, Standings } from '@/types/football';

/**
 * Kontrak abstraksi provider. Setiap provider (Football-Data.org, API-Football,
 * Sportmonks, dll.) WAJIB mengimplementasikan interface ini.
 * Dengan demikian, mengganti provider cukup membuat adapter baru.
 */
export interface FootballProvider {
  readonly name: string;

  /** Pertandingan dalam rentang tanggal (YYYY-MM-DD, zona waktu UTC). */
  getMatches(params: {
    dateFrom: string;
    dateTo: string;
    competitionCode?: string;
    status?: string;
  }): Promise<Match[]>;

  /** Klasemen satu kompetisi. `season` opsional, mis. "2025". */
  getStandings(competitionCode: string, season?: string): Promise<Standings>;

  /** Daftar pencetak gol terbanyak satu kompetisi. */
  getScorers(competitionCode: string, season?: string): Promise<Scorers>;

  /** Detail satu pertandingan (skor, kejadian, kartu, pergantian, susunan pemain jika tersedia). */
  getMatchDetail(matchId: string): Promise<MatchDetail>;

  /** Profil satu klub beserta skuad. */
  getTeam(teamId: string): Promise<ClubProfile>;

  /** Pertandingan satu klub dalam rentang tanggal (YYYY-MM-DD). */
  getTeamMatches(teamId: string, dateFrom: string, dateTo: string): Promise<Match[]>;
}
