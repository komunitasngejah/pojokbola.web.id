/**
 * Konfigurasi situs terpusat. Ubah nilai di sini, bukan di banyak file.
 */

export const SITE = {
  name: 'PojokBola',
  domain: 'pojokbola.web.id',
  // Nilai tetap: Pages Function berjalan di Workers yang tidak memiliki `process`.
  url: 'https://pojokbola.web.id',
  locale: 'id_ID',
  language: 'id',
  tagline: 'Semua Informasi Sepak Bola Ada di Satu Pojok.',
  description:
    'PojokBola menyajikan live score, jadwal, hasil pertandingan, klasemen, dan berita sepak bola Indonesia dan internasional.',
  timezone: 'Asia/Jakarta', // WIB (UTC+07:00)
} as const;

/**
 * Kompetisi yang ditampilkan. `providerCode` adalah kode di Football-Data.org.
 * `null` berarti belum tersedia di provider aktif (akan menampilkan pesan "data belum tersedia").
 * Liga Indonesia belum dicakup oleh Football-Data.org; perlu provider lain atau sumber resmi lain.
 */
export interface CompetitionConfig {
  slug: string;
  name: string;
  providerCode: string | null;
}

export const COMPETITIONS: CompetitionConfig[] = [
  { slug: 'liga-indonesia', name: 'Liga Indonesia', providerCode: null },
  { slug: 'liga-inggris', name: 'Liga Inggris', providerCode: 'PL' },
  { slug: 'liga-spanyol', name: 'Liga Spanyol', providerCode: 'PD' },
  { slug: 'liga-italia', name: 'Liga Italia', providerCode: 'SA' },
  { slug: 'liga-jerman', name: 'Liga Jerman', providerCode: 'BL1' },
  { slug: 'liga-prancis', name: 'Liga Prancis', providerCode: 'FL1' },
  { slug: 'liga-champions', name: 'Liga Champions', providerCode: 'CL' },
  { slug: 'liga-europa', name: 'Liga Europa', providerCode: 'EL' },
  { slug: 'piala-dunia', name: 'Piala Dunia', providerCode: 'WC' },
  { slug: 'piala-asia', name: 'Piala Asia', providerCode: null },
];

/** Kompetisi yang didukung provider (dipakai untuk filter & sitemap). */
export const SUPPORTED_COMPETITIONS = COMPETITIONS.filter((c) => c.providerCode !== null);

export function findCompetitionBySlug(slug: string): CompetitionConfig | undefined {
  return COMPETITIONS.find((c) => c.slug === slug);
}

/** Kategori berita. Slug dipakai di URL: /berita/kategori/[slug]/ */
export const CATEGORIES: { slug: string; name: string }[] = [
  { slug: 'liga-indonesia', name: 'Liga Indonesia' },
  { slug: 'liga-inggris', name: 'Liga Inggris' },
  { slug: 'liga-spanyol', name: 'Liga Spanyol' },
  { slug: 'liga-italia', name: 'Liga Italia' },
  { slug: 'liga-jerman', name: 'Liga Jerman' },
  { slug: 'liga-champions', name: 'Liga Champions' },
  { slug: 'timnas-indonesia', name: 'Timnas Indonesia' },
  { slug: 'transfer-pemain', name: 'Transfer Pemain' },
  { slug: 'analisis', name: 'Analisis' },
  { slug: 'prediksi', name: 'Prediksi' },
  { slug: 'teknologi-sepak-bola', name: 'Teknologi Sepak Bola' },
];

export function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Batas waktu cache (detik) per jenis data. Menjaga kuota API tetap aman. */
export const CACHE_TTL = {
  liveMatches: 30, // pertandingan berlangsung: sering diperbarui
  todayMatches: 120,
  standings: 3600, // klasemen berubah beberapa kali seminggu
  matchDetail: 60,
} as const;
