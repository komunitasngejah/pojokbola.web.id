/**
 * Cloudflare Pages Function: pertandingan satu klub dalam rentang tanggal.
 *   GET /api/team-matches?team=57&from=2026-11-15&to=2026-11-24
 * Rentang maksimal 10 hari. Cache edge 2 menit.
 */
import { FootballDataProvider } from '../../lib/api/football-data';
import { ProviderError } from '../../lib/api/errors';
import type { ApiEnvelope, ApiErrorBody, Match } from '../../types/football';

interface Env {
  FOOTBALL_DATA_API_KEY?: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

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
  const team = url.searchParams.get('team') ?? '';
  const from = url.searchParams.get('from') ?? '';
  const to = url.searchParams.get('to') ?? '';

  if (!/^\d{1,10}$/.test(team)) return fail(new ProviderError('BAD_REQUEST', 'ID klub tidak valid.', 400));
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    return fail(new ProviderError('BAD_REQUEST', 'Format tanggal harus YYYY-MM-DD.', 400));
  }
  const days = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
  if (!(days >= 0 && days <= 10)) return fail(new ProviderError('BAD_REQUEST', 'Rentang tanggal maksimal 10 hari.', 400));

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) {
    const cloned = new Response(hit.body, hit);
    cloned.headers.set('X-Cache', 'HIT');
    return cloned;
  }

  if (!env.FOOTBALL_DATA_API_KEY) return fail(new ProviderError('INTERNAL', 'Layanan data belum dikonfigurasi.', 500));

  try {
    const provider = new FootballDataProvider(env.FOOTBALL_DATA_API_KEY);
    const data: Match[] = await provider.getTeamMatches(team, from, to);
    const payload: ApiEnvelope<Match[]> = { data, fetchedAt: new Date().toISOString(), cached: false };
    const response = json(payload, 200, { 'Cache-Control': 'public, max-age=120, s-maxage=120', 'X-Cache': 'MISS' });
    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    if (err instanceof ProviderError) return fail(err);
    return fail(new ProviderError('INTERNAL', 'Terjadi kesalahan pada server.', 500));
  }
};
