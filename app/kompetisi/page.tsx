import Link from 'next/link';
import type { Metadata } from 'next';
import { COMPETITIONS } from '@/lib/config';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Kompetisi Sepak Bola',
  description: 'Daftar kompetisi sepak bola yang dipantau PojokBola: liga domestik, Liga Champions, Liga Europa, dan turnamen internasional.',
  path: '/kompetisi/',
});

export default function KompetisiIndexPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Kompetisi</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pilih kompetisi untuk melihat klasemen, jadwal, dan hasil.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMPETITIONS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/kompetisi/${c.slug}/`}
              className="flex min-h-11 items-center justify-between rounded-card border border-slate-200 bg-white p-4 font-semibold hover:border-pitch-500 dark:border-navy-700 dark:bg-navy-800"
            >
              <span>{c.name}</span>
              {!c.providerCode && <span className="text-xs font-normal text-slate-500">Segera</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
