import Link from 'next/link';
import type { Metadata } from 'next';
import { loadClubSnapshot } from '@/lib/content/snapshot';
import { buildMetadata } from '@/lib/seo/metadata';
import { EmptyState } from '@/components/AsyncState';

export const metadata: Metadata = buildMetadata({
  title: 'Profil Klub Sepak Bola',
  description: 'Profil klub sepak bola dari liga Inggris, Spanyol, Italia, Jerman, dan Prancis: stadion, pelatih, dan skuad.',
  path: '/klub/',
});

export default function KlubIndexPage() {
  const { clubs, generatedAt } = loadClubSnapshot();
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Profil Klub</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Informasi klub diperbarui secara berkala{generatedAt ? `. Terakhir diperbarui ${new Date(generatedAt).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' })}` : ''}.
        </p>
      </header>
      {clubs.length === 0 ? (
        <EmptyState title="Profil klub belum tersedia" text="Profil klub akan tampil setelah data klub diambil dari penyedia data." />
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => (
            <li key={c.slug}>
              <Link href={`/klub/${c.slug}/`} className="flex min-h-11 items-center justify-between rounded-card border border-slate-200 bg-white p-3 font-medium hover:border-pitch-500 dark:border-navy-700 dark:bg-navy-800">
                <span className="truncate">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
