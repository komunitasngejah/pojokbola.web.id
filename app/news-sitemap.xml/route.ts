import { loadArticles } from '@/lib/content/loader';
import { SITE } from '@/lib/config';
import { absoluteUrl } from '@/lib/seo/sitemap-data';

/**
 * Google News sitemap: hanya artikel yang terbit dalam 2 hari terakhir.
 * Dibuat saat build, sehingga perlu dibangun ulang (rebuild) setiap hari
 * agar tetap akurat. Lihat README bagian "Sitemap berita".
 */
export const dynamic = 'force-static';

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function esc(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function GET() {
  const cutoff = Date.now() - TWO_DAYS_MS;
  const items = loadArticles()
    .filter((a) => new Date(a.publishedAt).getTime() >= cutoff)
    .map(
      (a) => `  <url>
    <loc>${esc(absoluteUrl(`/berita/${a.slug}/`))}</loc>
    <news:news>
      <news:publication>
        <news:name>${esc(SITE.name)}</news:name>
        <news:language>${SITE.language}</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
