import Link from 'next/link';
import type { Article } from '@/lib/content/types';
import { findCategory } from '@/lib/config';
import { formatLongDate } from '@/lib/format/time';

/** Kartu ringkasan artikel. Dirender di server (HTML statis, bisa dirayapi Google). */
export function ArticleCard({ article }: { article: Article }) {
  const category = findCategory(article.category);
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800">
      {article.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image}
          alt={article.imageAlt}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {category && <span className="text-xs font-bold uppercase tracking-wide text-pitch-600">{category.name}</span>}
        <h3 className="text-base font-bold leading-snug">
          <Link href={`/berita/${article.slug}/`} className="hover:text-pitch-600">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{article.description}</p>
        <p className="mt-auto pt-2 text-xs text-slate-500">
          {formatLongDate(article.publishedAt)} · {article.readingMinutes} menit baca
        </p>
      </div>
    </article>
  );
}
