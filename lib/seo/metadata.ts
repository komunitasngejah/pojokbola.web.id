import type { Metadata } from 'next';
import { SITE } from '@/lib/config';

interface PageSeoInput {
  title: string;
  description: string;
  /** Path relatif diawali "/" dan berakhiran "/", mis. "/live-score/". */
  path: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
}

/** Membuat metadata lengkap (title, description, canonical, OG, Twitter) untuk satu halaman. */
export function buildMetadata({ title, description, path, type = 'website', image, noIndex }: PageSeoInput): Metadata {
  const canonical = new URL(path, SITE.url).toString();
  const ogImage = image ?? new URL('/og-default.png', SITE.url).toString();

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE.name} - ${SITE.tagline}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/** BreadcrumbList. Item terakhir boleh tanpa URL (halaman saat ini). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).toString(),
    })),
  };
}

/**
 * Article / NewsArticle untuk satu artikel. Hanya berisi data yang benar-benar ada.
 * Tidak ada rating, review, atau field palsu.
 */
export function articleJsonLd(input: {
  type: 'NewsArticle' | 'Article';
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string | null;
  authors: { name: string; path: string }[];
  image: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    headline: input.title,
    description: input.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': new URL(input.path, SITE.url).toString() },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: input.authors.map((a) => ({
      '@type': 'Person',
      name: a.name,
      url: new URL(a.path, SITE.url).toString(),
    })),
    publisher: { '@id': `${SITE.url}/#organization` },
    image: input.image ? new URL(input.image, SITE.url).toString() : undefined,
    inLanguage: SITE.language,
  };
}

/** Structured data Organization & WebSite (untuk halaman beranda). */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: new URL('/logo.png', SITE.url).toString(),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: SITE.language,
        publisher: { '@id': `${SITE.url}/#organization` },
      },
    ],
  };
}
