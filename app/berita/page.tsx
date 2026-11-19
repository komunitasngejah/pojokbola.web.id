import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES } from '@/lib/config';
import { loadArticles } from '@/lib/content/loader';
import { buildMetadata } from '@/lib/seo/metadata';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/AsyncState';

export const metadata: Metadata = buildMetadata({
  title: 'Berita Sepak Bola Terbaru',
  description:
    'Berita dan analisis sepak bola original dari redaksi PojokBola, mencakup liga Indonesia, liga Eropa, Liga Champions, dan timnas Indonesia.',
  path: '/berita/',
});

export default function BeritaPage() {
  const articles = loadArticles();

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-extrabold">Berita Sepak Bola</h1>
        <nav aria-label="Kategori berita">
          <ul className="flex flex-wrap gap-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/berita/kategori/${c.slug}/`}
                  className="inline-flex min-h-9 items-center rounded-full bg-white px-3 font-medium ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-navy-800 dark:ring-navy-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {articles.length === 0 ? (
        <EmptyState
          title="Belum ada artikel"
          text="Artikel akan tampil di sini setelah melalui penulisan, pemeriksaan fakta, dan persetujuan editor."
        />
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
