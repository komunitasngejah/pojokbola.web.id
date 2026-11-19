import type { Match, Scorers, Standings } from '@/types/football';

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

  /** Detail satu pertandingan. */
  getMatchById(matchId: string): Promise<Match>;
}
