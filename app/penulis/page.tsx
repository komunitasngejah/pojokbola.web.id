import Link from 'next/link';
import type { Metadata } from 'next';
import { loadAuthors } from '@/lib/content/loader';
import { buildMetadata } from '@/lib/seo/metadata';
import { EmptyState } from '@/components/AsyncState';

export const metadata: Metadata = buildMetadata({
  title: 'Penulis PojokBola',
  description: 'Profil penulis dan kontributor PojokBola beserta latar belakang dan artikel yang mereka tulis.',
  path: '/penulis/',
});

export default function PenulisIndexPage() {
  const authors = loadAuthors();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Penulis</h1>
      {authors.length === 0 ? (
        <EmptyState title="Profil penulis belum tersedia" text="Profil penulis akan ditampilkan di sini." />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((a) => (
            <li key={a.slug}>
              <Link href={`/penulis/${a.slug}/`} className="block rounded-card border border-slate-200 bg-white p-4 hover:border-pitch-500 dark:border-navy-700 dark:bg-navy-800">
                <p className="font-bold">{a.name}</p>
                <p className="text-sm text-pitch-600">{a.role}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
