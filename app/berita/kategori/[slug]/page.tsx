import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, findCategory } from '@/lib/config';
import { articlesByCategory } from '@/lib/content/loader';
import { buildMetadata } from '@/lib/seo/metadata';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmptyState } from '@/components/AsyncState';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = findCategory(params.slug);
  if (!cat) return {};
  return buildMetadata({
    title: `Berita ${cat.name} Terbaru`,
    description: `Kumpulan berita dan analisis ${cat.name} dari redaksi PojokBola, lengkap dengan sumber dan tanggal publikasi.`,
    path: `/berita/kategori/${cat.slug}/`,
  });
}

export default function KategoriPage({ params }: Props) {
  const cat = findCategory(params.slug);
  if (!cat) notFound();
  const articles = articlesByCategory(cat.slug);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: 'Berita', href: '/berita/' }, { name: cat.name }]} />
      <h1 className="text-2xl font-extrabold">Berita {cat.name}</h1>

      {articles.length === 0 ? (
        <EmptyState title="Belum ada artikel di kategori ini" text="Silakan lihat kategori lain atau kembali nanti." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
