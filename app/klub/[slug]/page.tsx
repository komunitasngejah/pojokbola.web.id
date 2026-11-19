import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EMPTY_SENTINEL, staticParamsOrSentinel } from '@/lib/content/loader';
import { findClub, groupSquad, loadClubSnapshot, POSITION_LABEL } from '@/lib/content/snapshot';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ClubMatches } from '@/components/ClubMatches';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return staticParamsOrSentinel(loadClubSnapshot().clubs);
}

export function generateMetadata({ params }: Props): Metadata {
  const club = findClub(params.slug);
  if (!club) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `Profil ${club.name}: Stadion, Pelatih & Skuad`,
    description: `Profil ${club.name}: stadion${club.venue ? ` ${club.venue}` : ''}, pelatih${club.coach ? ` ${club.coach.name}` : ''}, dan daftar skuad terbaru.`,
    path: `/klub/${club.slug}/`,
    image: club.crestUrl ?? undefined,
  });
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0 dark:border-navy-700">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium">{value || '-'}</dd>
    </div>
  );
}

export default function KlubPage({ params }: Props) {
  const club = findClub(params.slug);
  if (!club || params.slug === EMPTY_SENTINEL) notFound();

  const groups = groupSquad(club.squad);
  const crumbs = [
    { name: 'Beranda', path: '/' },
    { name: 'Klub', path: '/klub/' },
    { name: club.name, path: `/klub/${club.slug}/` },
  ];
  const ldBreadcrumb = breadcrumbJsonLd(crumbs);

  return (
    <div className="space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
      <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: 'Klub', href: '/klub/' }, { name: club.name }]} />

      <header className="flex items-center gap-4">
        {club.crestUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={club.crestUrl} alt={`Logo ${club.name}`} width={64} height={64} className="h-16 w-16 object-contain" />
        )}
        <div>
          <h1 className="text-2xl font-extrabold">{club.name}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{club.competitions.join(' · ')}</p>
        </div>
      </header>

      <section aria-labelledby="info-klub" className="rounded-card border border-slate-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
        <h2 id="info-klub" className="mb-2 text-lg font-bold">
          Informasi Klub
        </h2>
        <dl>
          <Fact label="Stadion" value={club.venue} />
          <Fact label="Berdiri" value={club.founded ? String(club.founded) : null} />
          <Fact label="Pelatih" value={club.coach?.name} />
          <Fact label="Warna klub" value={club.clubColors} />
          <Fact label="Alamat" value={club.address} />
          <Fact label="Situs resmi" value={club.website} />
        </dl>
      </section>

      <section aria-labelledby="skuad" className="space-y-3">
        <h2 id="skuad" className="text-lg font-bold">
          Skuad
        </h2>
        {Object.keys(groups).length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">Data skuad belum tersedia.</p>
        ) : (
          Object.entries(groups).map(([pos, players]) => (
            <div key={pos} className="rounded-card border border-slate-200 bg-white p-4 dark:border-navy-700 dark:bg-navy-800">
              <h3 className="mb-2 text-sm font-bold text-pitch-600">{POSITION_LABEL[pos] ?? pos}</h3>
              <ul className="grid gap-1 text-sm sm:grid-cols-2">
                {players.map((p) => (
                  <li key={p.name}>
                    {p.name}
                    {p.nationality && <span className="text-slate-500"> · {p.nationality}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <section aria-labelledby="jadwal-klub" className="space-y-3">
        <h2 id="jadwal-klub" className="text-lg font-bold">
          Jadwal dan Hasil Terbaru
        </h2>
        <ClubMatches teamId={club.id} />
      </section>

      <p className="text-xs text-slate-500">
        Profil diambil dari penyedia data pada {new Date(club.fetchedAt).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' })}.
      </p>
    </div>
  );
}
