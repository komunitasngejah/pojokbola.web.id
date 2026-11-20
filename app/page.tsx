import Link from 'next/link';
import { SITE, COMPETITIONS } from '@/lib/config';
import { organizationJsonLd } from '@/lib/seo/metadata';
import { TodayMatches } from '@/components/TodayMatches';
import { ArticleCard } from '@/components/ArticleCard';
import { loadArticles } from '@/lib/content/loader';

export default function HomePage() {
  const jsonLd = organizationJsonLd();
  const latest = loadArticles().slice(0, 3);

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section aria-labelledby="judul-beranda" className="rounded-card bg-navy-900 p-6 text-white sm:p-8">
        <h1 id="judul-beranda" className="text-2xl font-extrabold sm:text-3xl">
          {SITE.tagline}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">{SITE.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/live-score/" className="min-h-11 rounded-md bg-live-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-live-600">
            Live Score
          </Link>
          <Link href="/klasemen/" className="min-h-11 rounded-md bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20">
            Klasemen
          </Link>
        </div>
      </section>

      <section aria-labelledby="judul-pertandingan-hari-ini" className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 id="judul-pertandingan-hari-ini" className="text-xl font-bold">
            Pertandingan Hari Ini
          </h2>
          <Link href="/jadwal/" className="text-sm font-semibold text-pitch-600 hover:underline">
            Lihat jadwal
          </Link>
        </div>
        <TodayMatches />
      </section>

      <section aria-labelledby="judul-kompetisi" className="space-y-3">
        <h2 id="judul-kompetisi" className="text-xl font-bold">
          Kompetisi
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {COMPETITIONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/kompetisi/${c.slug}/`}
                className="flex min-h-11 items-center rounded-card border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:border-pitch-500 dark:border-navy-700 dark:bg-navy-800"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="judul-berita" className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 id="judul-berita" className="text-xl font-bold">
            Berita Sepak Bola Terbaru
          </h2>
          <Link href="/berita/" className="text-sm font-semibold text-pitch-600 hover:underline">
            Semua berita
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="rounded-card border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-400">
            Belum ada artikel yang dipublikasikan. Artikel akan ditampilkan di sini setelah melalui proses penulisan dan
            pemeriksaan redaksi.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {latest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
