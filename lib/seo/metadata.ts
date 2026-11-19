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
