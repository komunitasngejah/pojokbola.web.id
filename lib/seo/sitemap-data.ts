import { CATEGORIES, COMPETITIONS, SITE } from '@/lib/config';
import { loadArticles, loadAuthors, EMPTY_SENTINEL } from '@/lib/content/loader';

export interface SitemapEntry {
  path: string; // selalu diawali "/" dan diakhiri "/"
  lastModified: string | null;
  priority: number;
  changeFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

/**
 * Sumber tunggal untuk sitemap. Hanya memuat URL canonical yang layak diindeks.
 * Halaman sentinel (_kosong) dan endpoint API tidak pernah dimasukkan.
 */
export function sitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: '/', lastModified: null, priority: 1, changeFrequency: 'hourly' },
    { path: '/live-score/', lastModified: null, priority: 0.9, changeFrequency: 'hourly' },
    { path: '/jadwal/', lastModified: null, priority: 0.8, changeFrequency: 'daily' },
    { path: '/hasil/', lastModified: null, priority: 0.8, changeFrequency: 'daily' },
    { path: '/klasemen/', lastModified: null, priority: 0.8, changeFrequency: 'daily' },
    { path: '/statistik/', lastModified: null, priority: 0.6, changeFrequency: 'weekly' },
    { path: '/kompetisi/', lastModified: null, priority: 0.7, changeFrequency: 'weekly' },
    { path: '/berita/', lastModified: null, priority: 0.9, changeFrequency: 'daily' },
    { path: '/transfer/', lastModified: null, priority: 0.7, changeFrequency: 'daily' },
    { path: '/penulis/', lastModified: null, priority: 0.4, changeFrequency: 'monthly' },
    { path: '/tentang-kami/', lastModified: null, priority: 0.4, changeFrequency: 'monthly' },
    { path: '/kontak/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/kebijakan-privasi/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/disclaimer/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/pedoman-redaksi/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/redaksi/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/koreksi-dan-hak-jawab/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/syarat-dan-ketentuan/', lastModified: null, priority: 0.3, changeFrequency: 'monthly' },
    { path: '/peta-situs/', lastModified: null, priority: 0.2, changeFrequency: 'monthly' },
  ];

  for (const c of COMPETITIONS) {
    entries.push({ path: `/kompetisi/${c.slug}/`, lastModified: null, priority: 0.7, changeFrequency: 'daily' });
  }
  for (const c of CATEGORIES) {
    entries.push({ path: `/berita/kategori/${c.slug}/`, lastModified: null, priority: 0.6, changeFrequency: 'daily' });
  }
  for (const a of loadAuthors()) {
    entries.push({ path: `/penulis/${a.slug}/`, lastModified: null, priority: 0.4, changeFrequency: 'monthly' });
  }
  for (const a of loadArticles()) {
    entries.push({
      path: `/berita/${a.slug}/`,
      lastModified: a.updatedAt ?? a.publishedAt,
      priority: 0.8,
      changeFrequency: 'weekly',
    });
  }

  return entries.filter((e) => !e.path.includes(EMPTY_SENTINEL));
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}
