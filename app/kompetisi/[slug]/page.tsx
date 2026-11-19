import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPETITIONS, findCompetitionBySlug } from '@/lib/config';
import { buildMetadata } from '@/lib/seo/metadata';
import { CompetitionPanel } from '@/components/CompetitionPanel';
import { EmptyState } from '@/components/AsyncState';

interface Props {
  params: { slug: string };
}

/** Membuat satu halaman statis per kompetisi saat build. */
export function generateStaticParams() {
  return COMPETITIONS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const comp = findCompetitionBySlug(params.slug);
  if (!comp) return {};
  return buildMetadata({
    title: `${comp.name}: Klasemen, Jadwal & Hasil`,
    description: `Klasemen, jadwal pertandingan, dan hasil terbaru ${comp.name} di PojokBola.`,
    path: `/kompetisi/${comp.slug}/`,
  });
}

export default function KompetisiPage({ params }: Props) {
  const comp = findCompetitionBySlug(params.slug);
  if (!comp) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold">{comp.name}</h1>
      </header>

      {comp.providerCode ? (
        <CompetitionPanel competitionCode={comp.providerCode} />
      ) : (
        <EmptyState
          title="Data belum tersedia"
          text={`Data ${comp.name} belum tersedia dari penyedia data kami saat ini. Halaman ini akan diperbarui ketika sumber datanya tersambung.`}
        />
      )}
    </div>
  );
}
