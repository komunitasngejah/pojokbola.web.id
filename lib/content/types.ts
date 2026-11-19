export interface ArticleSource {
  title: string;
  url: string;
}

/** Artikel yang sudah tervalidasi dan siap dirender. */
export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string; // slug kategori, lihat lib/config.ts CATEGORIES
  tags: string[];
  authorSlugs: string[];
  editor: string;
  publishedAt: string; // ISO 8601 dengan offset zona waktu
  updatedAt: string | null;
  image: string | null; // path di /public, mis. "/images/berita/contoh.webp"
  imageAlt: string;
  imageCaption: string | null;
  sources: ArticleSource[];
  wordCount: number;
  readingMinutes: number;
  html: string; // isi sudah dirender dari Markdown lalu disanitasi
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
}
