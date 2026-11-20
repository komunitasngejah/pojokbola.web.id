/**
 * Pages Function: halaman detail pertandingan, dirender di server pada setiap permintaan
 * (dengan cache edge singkat). URL: /pertandingan/{id}-{home}-vs-{away}/
 *
 * Data detail datang dari API sehingga selalu segar. Halaman dirender menjadi HTML lengkap
 * agar dapat dirayapi Google tanpa menjalankan JavaScript.
 */
import { FootballDataProvider } from '../../lib/api/football-data';
import { ProviderError } from '../../lib/api/errors';
import { matchIdFromSlug, matchSlug } from '../../lib/match/slug';
import { esc } from '../../lib/html/escape';
import { renderDetail } from '../../lib/html/match-detail';
import { renderShell } from '../../lib/html/layout';
import { CACHE_TTL } from '../../lib/config';

interface Env {
  FOOTBALL_DATA_API_KEY?: string;
}

function html(body: string, status: number, extra: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      ...extra,
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ params, request, env, waitUntil }) => {
  const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const slug = String(rawSlug ?? '');
  const id = matchIdFromSlug(slug);

  const notFound = (message: string) =>
    html(
      renderShell({
        title: 'Pertandingan tidak ditemukan',
        description: 'Pertandingan yang Anda cari tidak ditemukan.',
        path: `/pertandingan/${slug}/`,
        noIndex: true,
        body: `<section class="pb-card"><h1>Pertandingan tidak ditemukan</h1><p class="pb-muted">${esc(message)}</p><p><a href="/jadwal/">Lihat jadwal pertandingan</a></p></section>`,
      }),
      404,
      { 'Cache-Control': 'public, max-age=300' },
    );

  if (!id) return notFound('Alamat pertandingan tidak valid.');

  const url = new URL(request.url);
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) {
    const cloned = new Response(hit.body, hit);
    cloned.headers.set('X-Cache', 'HIT');
    return cloned;
  }

  if (!env.FOOTBALL_DATA_API_KEY) {
    return html(
      renderShell({
        title: 'Layanan belum tersedia',
        description: 'Data pertandingan sedang tidak tersedia.',
        path: `/pertandingan/${slug}/`,
        noIndex: true,
        body: `<section class="pb-card"><h1>Data belum tersedia</h1><p class="pb-muted">Data pertandingan sedang tidak tersedia. Silakan coba beberapa saat lagi.</p></section>`,
      }),
      503,
      { 'Cache-Control': 'no-store' },
    );
  }

  try {
    const provider = new FootballDataProvider(env.FOOTBALL_DATA_API_KEY);
    const detail = await provider.getMatchDetail(id);

    // Slug canonical: bila nama klub di URL tidak sesuai data terbaru, arahkan ke slug yang benar.
    const canonicalSlug = matchSlug(detail.match);
    if (canonicalSlug !== slug) {
      return Response.redirect(new URL(`/pertandingan/${canonicalSlug}/`, url).toString(), 301);
    }

    const r = renderDetail(detail, slug);
    const page = renderShell({
      title: r.title,
      description: r.description,
      path: `/pertandingan/${slug}/`,
      body: r.body,
      jsonLd: r.ld,
    });

    const ttl = detail.match.status === 'LIVE' || detail.match.status === 'HALFTIME'
      ? CACHE_TTL.liveMatches
      : CACHE_TTL.matchDetail;
    const response = html(page, 200, {
      'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}`,
      'X-Cache': 'MISS',
    });
    waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    if (err instanceof ProviderError && err.code === 'NOT_FOUND') {
      return notFound('Pertandingan ini tidak ditemukan di penyedia data.');
    }
    const msg =
      err instanceof ProviderError ? err.message : 'Terjadi kesalahan pada server.';
    return html(
      renderShell({
        title: 'Data sedang tidak tersedia',
        description: 'Data pertandingan sedang tidak tersedia.',
        path: `/pertandingan/${slug}/`,
        noIndex: true,
        body: `<section class="pb-card"><h1>Data sedang tidak tersedia</h1><p class="pb-muted">${esc(msg)}</p><p><a href="/jadwal/">Kembali ke jadwal</a></p></section>`,
      }),
      503,
      { 'Cache-Control': 'no-store' },
    );
  }
};
