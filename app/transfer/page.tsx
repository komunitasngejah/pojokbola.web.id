import type { Metadata } from 'next';
import { articlesByCategory } from '@/lib/content/loader';
import { buildMetadata } from '@/lib/seo/metadata';
import { ArticleCard } from '@/components/ArticleCard';
import { EmptyState } from '@/components/AsyncState';

export const metadata: Metadata = buildMetadata({
  title: 'Transfer Pemain Sepak Bola Terbaru',
  description: 'Berita transfer pemain sepak bola terbaru dari redaksi PojokBola, disertai sumber dan tanggal publikasi.',
  path: '/transfer/',
});

export default function TransferPage() {
  const articles = articlesByCategory('transfer-pemain');
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold">Transfer Pemain</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Kabar transfer hanya kami terbitkan setelah dikonfirmasi sumber yang dapat diverifikasi. Rumor belum terkonfirmasi tidak
          kami tampilkan sebagai fakta.
        </p>
      </header>
      {articles.length === 0 ? (
        <EmptyState title="Belum ada berita transfer" text="Berita transfer akan tampil di sini setelah melalui pemeriksaan redaksi." />
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
