import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { StandingsPicker } from '@/components/StandingsPicker';

export const metadata: Metadata = buildMetadata({
  title: 'Klasemen Liga Sepak Bola',
  description:
    'Klasemen liga sepak bola terbaru: posisi, main, menang, seri, kalah, gol, selisih gol, dan poin untuk liga Inggris, Spanyol, Italia, Jerman, Prancis, dan Eropa.',
  path: '/klasemen/',
});

export default function KlasemenPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Klasemen</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pilih kompetisi untuk melihat klasemen musim berjalan.</p>
      </header>
      <StandingsPicker />
    </div>
  );
}
