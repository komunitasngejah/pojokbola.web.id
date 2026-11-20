import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EMPTY_SENTINEL, loadAuthors, articlesByAuthor, staticParamsOrSentinel } from '@/lib/content/loader';
import { buildMetadata } from '@/lib/seo/metadata';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmptyState } from '@/components/AsyncState';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return staticParamsOrSentinel(loadAuthors());
}

export function generateMetadata({ params }: Props): Metadata {
  const author = loadAuthors().find((a) => a.slug === params.slug);
  if (!author) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${author.name}, ${author.role}`,
    description: author.bio.slice(0, 155),
    path: `/penulis/${author.slug}/`,
  });
}

export default function PenulisPage({ params }: Props) {
  const author = loadAuthors().find((a) => a.slug === params.slug);
  if (!author || params.slug === EMPTY_SENTINEL) notFound();
  const articles = articlesByAuthor(author.slug);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: 'Penulis', href: '/penulis/' }, { name: author.name }]} />

      <header className="space-y-2 rounded-card border border-slate-200 bg-white p-5 dark:border-navy-700 dark:bg-navy-800">
        <h1 className="text-2xl font-extrabold">{author.name}</h1>
        <p className="text-sm font-semibold text-pitch-600">{author.role}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">{author.bio}</p>
      </header>

      <section aria-labelledby="artikel-penulis" className="space-y-3">
        <h2 id="artikel-penulis" className="text-lg font-bold">
          Artikel dari {author.name}
        </h2>
        {articles.length === 0 ? (
          <EmptyState title="Belum ada artikel" text="Artikel dari penulis ini akan tampil setelah dipublikasikan." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
