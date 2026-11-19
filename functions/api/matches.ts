/**
 * Cloudflare Pages Function: proxy server-side untuk daftar pertandingan.
 *
 *   GET /api/matches?from=2026-11-19&to=2026-11-19&competition=PL&status=LIVE
 *
 * - API key dibaca dari environment variable FOOTBALL_DATA_API_KEY (tidak pernah ke browser).
 * - Respons di-cache di edge (caches.default) untuk menjaga kuota API.
 * - Input divalidasi ketat. Error dikembalikan dengan status HTTP yang benar.
 *
 * Catatan: file ini dibundel oleh Cloudflare, bukan oleh Next.js.
 */
import { FootballDataProvider } from '../../lib/api/football-data';
import { ProviderError } from '../../lib/api/errors';
import { CACHE_TTL, SUPPORTED_COMPETITIONS } from '../../lib/config';
import type { ApiEnvelope, ApiErrorBody, Match } from '../../types/football';

interface Env {
  FOOTBALL_DATA_API_KEY?: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_STATUS = new Set(['SCHEDULED', 'TIMED', 'IN_PLAY', 'PAUSED', 'FINISHED', 'POSTPONED', 'CANCELLED']);
const ALLOWED_COMPETITION = new Set(SUPPORTED_COMPETITIONS.map((c) => c.providerCode));

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

function jsonResponse(body: unknown, status: number, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS,
      ...extra,
    },
  });
}

function errorResponse(err: ProviderError): Response {
  const body: ApiErrorBody = { error: { code: err.code, message: err.message } };
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
  if (err.retryAfter) headers['Retry-After'] = String(err.retryAfter);
  return jsonResponse(body, err.status, headers);
}

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Rentang tanggal maksimum 10 hari agar kuota tidak terbuang. */
function daysBetween(from: string, to: string): number {
  return (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const url = new URL(request.url);
  const from = url.searchParams.get('from') ?? new Date().toISOString().slice(0, 10);
  const to = url.searchParams.get('to') ?? from;
  const competition = url.searchParams.get('competition') ?? undefined;
  const status = url.searchParams.get('status') ?? undefined;

  // ---- Validasi input ----
  if (!isValidDate(from) || !isValidDate(to)) {
    return errorResponse(new ProviderError('BAD_REQUEST', 'Format tanggal harus YYYY-MM-DD.', 400));
  }
  if (daysBetween(from, to) < 0 || daysBetween(from, to) > 10) {
    return errorResponse(new ProviderError('BAD_REQUEST', 'Rentang tanggal maksimal 10 hari.', 400));
  }
  if (competition && !ALLOWED_COMPETITION.has(competition)) {
    return errorResponse(new ProviderError('BAD_REQUEST', 'Kompetisi tidak didukung.', 400));
  }
  if (status && !ALLOWED_STATUS.has(status)) {
    return errorResponse(new ProviderError('BAD_REQUEST', 'Status tidak valid.', 400));
  }

  // ---- Cache edge ----
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) {
    const cloned = new Response(hit.body, hit);
    cloned.headers.set('X-Cache', 'HIT');
    return cloned;
  }

  // ---- Panggil provider ----
  if (!env.FOOTBALL_DATA_API_KEY) {
    return errorResponse(new ProviderError('INTERNAL', 'Layanan data belum dikonfigurasi.', 500));
  }

  try {
    const provider = new FootballDataProvider(env.FOOTBALL_DATA_API_KEY);
    const matches: Match[] = await provider.getMatches({
      dateFrom: from,
      dateTo: to,
      competitionCode: competition,
      status,
    });

    const payload: ApiEnvelope<Match[]> = {
      data: matches,
      fetchedAt: new Date().toISOString(),
      cached: false,
    };

    const ttl = status === 'IN_PLAY' || status === 'PAUSED' ? CACHE_TTL.liveMatches : CACHE_TTL.todayMatches;
    const response = jsonResponse(payload, 200, {
      'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
      'X-Cache': 'MISS',
    });

    // Simpan salinan ke cache edge tanpa menunda respons.
    waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (err) {
    if (err instanceof ProviderError) return errorResponse(err);
    return errorResponse(new ProviderError('INTERNAL', 'Terjadi kesalahan pada server.', 500));
  }
};
