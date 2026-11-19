import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ADSENSE, SITE } from '@/lib/config';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({
    title: `${SITE.name} - Live Score, Jadwal & Berita Sepak Bola`,
    description: SITE.description,
    path: '/',
  }),
  title: {
    default: `${SITE.name} - Live Score, Jadwal & Berita Sepak Bola`,
    template: `%s | ${SITE.name}`,
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  other: {
    'google-adsense-account': ADSENSE.publisherId,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0b1a2e' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1a2e' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.language}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-navy-900"
        >
          Lewati ke konten utama
        </a>
        <Script
          id="adsbygoogle-init"
          src={`${ADSENSE.scriptUrl}?client=${ADSENSE.publisherId}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <SiteHeader />
        <main id="konten-utama" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
