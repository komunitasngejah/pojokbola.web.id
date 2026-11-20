import type { MetadataRoute } from 'next';
import { absoluteUrl, sitemapEntries } from '@/lib/seo/sitemap-data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map((e) => ({
    url: absoluteUrl(e.path),
    lastModified: e.lastModified ?? undefined,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
