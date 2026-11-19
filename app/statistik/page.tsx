import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { StatistikPicker } from '@/components/StatistikPicker';

export const metadata: Metadata = buildMetadata({
  title: 'Statistik Sepak Bola: Pencetak Gol Terbanyak',
  description: 'Daftar pencetak gol terbanyak musim berjalan untuk liga Inggris, Spanyol, Italia, Jerman, Prancis, dan Eropa.',
  path: '/statistik/',
});

export default function StatistikPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Statistik</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pencetak gol terbanyak per kompetisi.</p>
      </header>
      <StatistikPicker />
    </div>
  );
}
