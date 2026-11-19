import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findCategory } from '@/lib/config';
import { EMPTY_SENTINEL, loadArticles, loadAuthors, staticParamsOrSentinel } from '@/lib/content/loader';
import { formatLongDate } from '@/lib/format/time';
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return staticParamsOrSentinel(loadArticles());
}

export function generateMetadata({ params }: Props): Metadata {
  const article = loadArticles().find((a) => a.slug === params.slug);
  if (!article) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/berita/${article.slug}/`,
    type: 'article',
    image: article.image ?? undefined,
  });
}

export default function ArticlePage({ params }: Props) {
  const articles = loadArticles();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article || params.slug === EMPTY_SENTINEL) notFound();

  const authors = loadAuthors().filter((a) => article.authorSlugs.includes(a.slug));
  const category = findCategory(article.category);
  const path = `/berita/${article.slug}/`;

  const analytical = article.category === 'analisis' || article.category === 'prediksi';
  const jsonLd = articleJsonLd({
    type: analytical ? 'Article' : 'NewsArticle',
    title: article.title,
    description: article.description,
    path,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    authors: authors.map((a) => ({ name: a.name, path: `/penulis/${a.slug}/` })),
    image: article.image,
  });

  const crumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Berita', path: '/berita/' },
    ...(category ? [{ name: category.name, path: `/berita/kategori/${category.slug}/` }] : []),
    { name: article.title, path },
  ];

  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(crumbs.map((c) => ({ name: c.name, path: c.path }))),
          ),
        }}
      />

      <Breadcrumbs
        items={[
          { name: 'Beranda', href: '/' },
          { name: 'Berita', href: '/berita/' },
          ...(category ? [{ name: category.name, href: `/berita/kategori/${category.slug}/` }] : []),
          { name: article.title },
        ]}
      />

      <article className="space-y-5">
        <header className="space-y-3">
          {category && (
            <p className="text-xs font-bold uppercase tracking-wide text-pitch-600">{category.name}</p>
          )}
          <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">{article.title}</h1>
          <p className="text-base text-slate-600 dark:text-slate-300">{article.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
            <span>
              Penulis:{' '}
              {authors.map((a, i) => (
                <span key={a.slug}>
                  {i > 0 && ', '}
                  <Link href={`/penulis/${a.slug}/`} className="font-semibold text-slate-800 hover:text-pitch-600 dark:text-slate-200">
                    {a.name}
                  </Link>
                </span>
              ))}
            </span>
            <span>Editor: {article.editor}</span>
          </div>
          <p className="text-sm text-slate-500">
            Dipublikasikan {formatLongDate(article.publishedAt)}
            {article.updatedAt && ` · Diperbarui ${formatLongDate(article.updatedAt)}`} · {article.readingMinutes} menit baca
          </p>
        </header>

        {article.image && (
          <figure className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.imageAlt}
              width={1200}
              height={675}
              decoding="async"
              className="aspect-video w-full rounded-card object-cover"
            />
            {article.imageCaption && (
              <figcaption className="text-xs text-slate-500">{article.imageCaption}</figcaption>
            )}
          </figure>
        )}

        {/* HTML sudah dirender dari Markdown dan disanitasi saat build (lib/content/loader.ts). */}
        <div
          className="prose-pojok space-y-4 text-base leading-relaxed text-slate-800 dark:text-slate-200 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_a]:text-pitch-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-pitch-500 [&_blockquote]:pl-4 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        <section aria-labelledby="sumber" className="space-y-2 rounded-card border border-slate-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
          <h2 id="sumber" className="text-base font-bold">
            Sumber
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {article.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="nofollow noopener noreferrer" target="_blank" className="text-pitch-600 underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {article.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-xs">
            {article.tags.map((t) => (
              <li key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-navy-800 dark:text-slate-300">
                #{t}
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm text-slate-600 dark:text-slate-400">
          Menemukan kesalahan? Baca{' '}
          <Link href="/koreksi-dan-hak-jawab/" className="text-pitch-600 underline">
            kebijakan koreksi dan hak jawab
          </Link>
          .
        </p>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="terkait" className="space-y-3">
          <h2 id="terkait" className="text-lg font-bold">
            Artikel Terkait
          </h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/berita/${r.slug}/`} className="font-medium text-pitch-600 hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
