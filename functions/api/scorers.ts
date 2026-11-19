/**
 * Cloudflare Pages Function: pencetak gol terbanyak satu kompetisi.
 *   GET /api/scorers?competition=PL&season=2025
 * API key tetap di server. Cache edge 1 jam.
 */
import { FootballDataProvider } from '../../lib/api/football-data';
import { ProviderError } from '../../lib/api/errors';
import { CACHE_TTL, SUPPORTED_COMPETITIONS } from '../../lib/config';
import type { ApiEnvelope, ApiErrorBody, Scorers } from '../../types/football';

interface Env {
  FOOTBALL_DATA_API_KEY?: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
const ALLOWED = new Set(SUPPORTED_COMPETITIONS.map((c) => c.providerCode));

function json(body: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS, ...extra },
  });
}

function fail(err: ProviderError): Response {
  const body: ApiErrorBody = { error: { code: err.code, message: err.message } };
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
  if (err.retryAfter) headers['Retry-After'] = String(err.retryAfter);
  return json(body, err.status, headers);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const url = new URL(request.url);
  const competition = url.searchParams.get('competition') ?? '';
  const season = url.searchParams.get('season') ?? undefined;

  if (!ALLOWED.has(competition)) return fail(new ProviderError('BAD_REQUEST', 'Kompetisi tidak didukung.', 400));
  if (season !== undefined && !/^\d{4}$/.test(season)) {
    return fail(new ProviderError('BAD_REQUEST', 'Format musim harus tahun, mis. 2025.', 400));
  }

  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) {
    const cloned = new Response(hit.body, hit);
    cloned.headers.set('X-Cache', 'HIT');
    return cloned;
  }

  if (!env.FOOTBALL_DATA_API_KEY) return fail(new ProviderError('INTERNAL', 'Layanan data belum dikonfigurasi.', 500));

  try {
    const provider = new FootballDataProvider(env.FOOTBALL_DATA_API_KEY);
    const data: Scorers = await provider.getScorers(competition, season);
    const payload: ApiEnvelope<Scorers> = { data, fetchedAt: new Date().toISOString(), cached: false };
    const ttl = CACHE_TTL.standings;
    const response = json(payload, 200, {
      'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
      'X-Cache': 'MISS',
    });
    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    if (err instanceof ProviderError) return fail(err);
    return fail(new ProviderError('INTERNAL', 'Terjadi kesalahan pada server.', 500));
  }
};
