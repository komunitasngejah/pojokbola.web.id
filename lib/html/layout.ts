import { esc, jsonForScript } from './escape';
import { SITE } from '@/lib/config';

export interface PageShell {
  title: string;
  description: string;
  path: string; // "/pertandingan/.../"
  body: string; // HTML sudah di-escape oleh pemanggil
  jsonLd?: unknown[];
  status?: number;
  noIndex?: boolean;
}

/** Kerangka HTML untuk halaman yang dirender di Pages Function. */
export function renderShell(p: PageShell): string {
  const canonical = new URL(p.path, SITE.url).toString();
  const robots = p.noIndex ? 'noindex, follow' : 'index, follow';
  const ld = (p.jsonLd ?? [])
    .map((o) => `<script type="application/ld+json">${jsonForScript(o)}</script>`)
    .join('\n    ');

  return `<!doctype html>
<html lang="${SITE.language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(p.title)} | ${esc(SITE.name)}</title>
  <meta name="description" content="${esc(p.description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:locale" content="${SITE.locale}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="/pojokbola-detail.css">
  ${ld}
</head>
<body>
  <header class="pb-top"><a href="/" class="pb-brand">${esc(SITE.name)}</a>
    <nav aria-label="Navigasi utama"><a href="/live-score/">Live Score</a> <a href="/jadwal/">Jadwal</a> <a href="/hasil/">Hasil</a> <a href="/klasemen/">Klasemen</a> <a href="/berita/">Berita</a></nav>
  </header>
  <main class="pb-main">
${p.body}
  </main>
  <footer class="pb-foot">© ${new Date().getFullYear()} ${esc(SITE.name)} · Data pertandingan dari penyedia data pihak ketiga.</footer>
</body>
</html>`;
}
