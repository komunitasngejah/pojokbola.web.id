import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/config';

/** robots.txt. Halaman publik boleh dirayapi; endpoint API internal tidak perlu diindeks. */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/oauth/'],
      },
    ],
    sitemap: [new URL('/sitemap.xml', SITE.url).toString(), new URL('/news-sitemap.xml', SITE.url).toString()],
    host: SITE.url,
  };
}
