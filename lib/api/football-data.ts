import type { Match, Standings } from '@/types/football';
import type { FootballProvider } from './provider';
import { ProviderError, fromHttpStatus } from './errors';
import {
  normalizeCompetition,
  normalizeMatch,
  normalizeStandings,
  type FdMatch,
  type FdStandingsResponse,
  type FdMatchesResponse,
} from '@/lib/normalize/football-data';

/**
 * Adapter untuk Football-Data.org v4.
 * Dokumentasi: https://docs.football-data.org/general/v4/index.html
 *
 * Token dibaca dari environment variable. Kode ini HANYA boleh dijalankan
 * di server (Cloudflare Pages Functions), tidak pernah di browser.
 */
const BASE_URL = 'https://api.football-data.org/v4';
const REQUEST_TIMEOUT_MS = 8000;

export class FootballDataProvider implements FootballProvider {
  readonly name = 'football-data.org';
  private readonly token: string;

  constructor(token: string) {
    if (!token) {
      throw new ProviderError('INTERNAL', 'Token API belum dikonfigurasi.', 500);
    }
    this.token = token;
  }

  private async request<T>(path: string, query?: Record<string, string | undefined>): Promise<T> {
    const url = new URL(BASE_URL + path);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value) url.searchParams.set(key, value);
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(url.toString(), {
        headers: { 'X-Auth-Token': this.token, Accept: 'application/json' },
        signal: controller.signal,
      });
    } catch {
      // Timeout atau jaringan terputus
      throw new ProviderError(
        'UPSTREAM_UNAVAILABLE',
        'Data pertandingan sedang tidak tersedia. Silakan coba beberapa saat lagi.',
        502,
      );
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      throw fromHttpStatus(res.status, res.headers.get('Retry-After'));
    }
    return (await res.json()) as T;
  }

  async getMatches(params: {
    dateFrom: string;
    dateTo: string;
    competitionCode?: string;
    status?: string;
  }): Promise<Match[]> {
    const path = params.competitionCode
      ? `/competitions/${encodeURIComponent(params.competitionCode)}/matches`
      : '/matches';

    const data = await this.request<FdMatchesResponse>(path, {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      status: params.status,
    });

    return data.matches
      .map((m) => normalizeMatch(m))
      .filter((m): m is Match => m !== null);
  }

  async getStandings(competitionCode: string, season?: string): Promise<Standings> {
    const data = await this.request<FdStandingsResponse>(
      `/competitions/${encodeURIComponent(competitionCode)}/standings`,
      { season },
    );
    return normalizeStandings(data);
  }

  async getMatchById(matchId: string): Promise<Match> {
    const data = await this.request<FdMatch>(`/matches/${encodeURIComponent(matchId)}`);
    const match = normalizeMatch(data);
    if (!match) {
      throw new ProviderError('NOT_FOUND', 'Pertandingan tidak ditemukan.', 404);
    }
    return match;
  }
}

export { normalizeCompetition };
