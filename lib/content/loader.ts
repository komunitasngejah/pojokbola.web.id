import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { CATEGORIES } from '@/lib/config';
import type { Article, ArticleSource, Author } from './types';

/**
 * Pemuat konten berbasis file (Markdown + frontmatter).
 * Dijalankan saat build (static export). Artikel yang melanggar aturan kualitas
 * akan MENGGAGALKAN build, sehingga konten tipis atau tanpa sumber tidak pernah terbit.
 *
 * Aturan:
 * - File berawalan "_" dan frontmatter `draft: true` tidak dipublikasikan.
 * - Wajib: title, description (50–160 karakter), category, authors, editor, publishedAt, sources.
 * - Minimal 300 kata dan minimal 1 sumber.
 */

const ROOT = process.cwd();
const ARTICLE_DIR = path.join(ROOT, 'content', 'articles');
const AUTHOR_DIR = path.join(ROOT, 'content', 'authors');

const MIN_WORDS = 300;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readDirSafe(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith('_'));
}

function fail(file: string, message: string): never {
  throw new Error(`[konten] ${file}: ${message}`);
}

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const v = data[key];
  if (typeof v !== 'string' || v.trim() === '') fail(file, `field "${key}" wajib diisi.`);
  return v.trim();
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'blockquote',
    'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 'code', 'pre',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel', 'target'],
    img: ['src', 'alt', 'width', 'height', 'loading'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      },
    }),
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: 'lazy', decoding: 'async' },
    }),
  },
};

/**
 * Slug sentinel untuk route dinamis saat belum ada konten. Next.js static export
 * mewajibkan minimal satu entri di generateStaticParams. Slug valid tidak boleh
 * memuat underscore, sehingga sentinel ini tidak akan bentrok dengan konten nyata.
 */
export const EMPTY_SENTINEL = '_kosong';

export function staticParamsOrSentinel<T extends { slug: string }>(items: T[]): { slug: string }[] {
  return items.length > 0 ? items.map((i) => ({ slug: i.slug })) : [{ slug: EMPTY_SENTINEL }];
}

function toDate(value: unknown, file: string, key: string, required: true): Date;
function toDate(value: unknown, file: string, key: string, required: false): Date | null;
function toDate(value: unknown, file: string, key: string, required: boolean): Date | null {
  if (value === null || value === undefined || value === '') {
    if (required) fail(file, `field "${key}" wajib diisi.`);
    return null;
  }
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) fail(file, `${key} tidak valid.`);
  return d;
}

export function countWords(text: string): number {
  return text.replace(/[#*_>`~\-[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function parseSources(raw: unknown, file: string): ArticleSource[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    fail(file, 'minimal satu sumber wajib dicantumkan di "sources".');
  }
  return raw.map((s, i) => {
    const title = typeof s?.title === 'string' ? s.title.trim() : '';
    const url = typeof s?.url === 'string' ? s.url.trim() : '';
    if (!title) fail(file, `sumber ke-${i + 1} tidak memiliki "title".`);
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      fail(file, `sumber ke-${i + 1} memiliki URL tidak valid.`);
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      fail(file, `sumber ke-${i + 1} harus memakai http(s).`);
    }
    return { title, url: parsed.toString() };
  });
}

export function loadAuthors(): Author[] {
  return readDirSafe(AUTHOR_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(AUTHOR_DIR, f), 'utf8')) as Record<string, unknown>;
      if (raw.draft === true) return null;
      const slug = requireString(raw, 'slug', f);
      if (!SLUG_RE.test(slug)) fail(f, 'slug penulis hanya boleh huruf kecil, angka, dan tanda hubung.');
      return {
        slug,
        name: requireString(raw, 'name', f),
        role: requireString(raw, 'role', f),
        bio: requireString(raw, 'bio', f),
      } satisfies Author;
    })
    .filter((a): a is Author => a !== null);
}

export function loadArticles(): Article[] {
  const authors = new Set(loadAuthors().map((a) => a.slug));
  const categories = new Set(CATEGORIES.map((c) => c.slug));

  const articles: Article[] = [];
  const seenSlugs = new Set<string>();

  for (const file of readDirSafe(ARTICLE_DIR).filter((f) => f.endsWith('.md'))) {
    const source = fs.readFileSync(path.join(ARTICLE_DIR, file), 'utf8');
    const { data, content } = matter(source);

    if (data.draft === true) continue;

    const slug = requireString(data, 'slug', file);
    if (!SLUG_RE.test(slug)) fail(file, 'slug hanya boleh huruf kecil, angka, dan tanda hubung.');
    if (seenSlugs.has(slug)) fail(file, `slug "${slug}" duplikat.`);
    seenSlugs.add(slug);

    const title = requireString(data, 'title', file);
    if (title.length > 70) fail(file, 'judul maksimal 70 karakter agar tidak terpotong di hasil pencarian.');

    const description = requireString(data, 'description', file);
    if (description.length < 50 || description.length > 160) {
      fail(file, 'deskripsi harus 50–160 karakter.');
    }

    const category = requireString(data, 'category', file);
    if (!categories.has(category)) fail(file, `kategori "${category}" tidak dikenal.`);

    const authorSlugs = Array.isArray(data.authors) ? (data.authors as string[]) : [];
    if (authorSlugs.length === 0) fail(file, 'minimal satu penulis wajib dicantumkan di "authors".');
    for (const a of authorSlugs) {
      if (!authors.has(a)) fail(file, `penulis "${a}" tidak ditemukan atau masih draft.`);
    }

    const editor = requireString(data, 'editor', file);

    // gray-matter mengubah timestamp tanpa tanda kutip menjadi objek Date, jadi terima keduanya.
    const publishedAt = toDate(data.publishedAt, file, 'publishedAt', true) as Date;
    const updatedAt = toDate(data.updatedAt, file, 'updatedAt', false);

    const sources = parseSources(data.sources, file);

    const words = countWords(content);
    if (words < MIN_WORDS) fail(file, `isi artikel hanya ${words} kata; minimal ${MIN_WORDS} kata.`);

    const rawHtml = marked.parse(content, { async: false }) as string;
    const html = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);

    articles.push({
      slug,
      title,
      description,
      category,
      tags: Array.isArray(data.tags) ? (data.tags as string[]).map(String) : [],
      authorSlugs,
      editor,
      publishedAt: publishedAt.toISOString(),
      updatedAt: updatedAt ? updatedAt.toISOString() : null,
      image: typeof data.image === 'string' ? data.image : null,
      imageAlt: typeof data.imageAlt === 'string' ? data.imageAlt : title,
      imageCaption: typeof data.imageCaption === 'string' ? data.imageCaption : null,
      sources,
      wordCount: words,
      readingMinutes: Math.max(1, Math.round(words / 200)),
      html,
    });
  }

  return articles.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return loadArticles().find((a) => a.slug === slug);
}

export function articlesByCategory(category: string): Article[] {
  return loadArticles().filter((a) => a.category === category);
}

export function articlesByAuthor(authorSlug: string): Article[] {
  return loadArticles().filter((a) => a.authorSlugs.includes(authorSlug));
}
