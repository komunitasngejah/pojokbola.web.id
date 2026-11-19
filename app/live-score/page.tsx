import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { TodayMatches } from '@/components/TodayMatches';

export const metadata: Metadata = buildMetadata({
  title: 'Live Score Sepak Bola Hari Ini',
  description:
    'Live score sepak bola hari ini: skor real-time, status pertandingan, dan jadwal untuk liga Inggris, Spanyol, Italia, Jerman, Prancis, dan Eropa.',
  path: '/live-score/',
});

export default function LiveScorePage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Live Score</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Skor diperbarui otomatis. Semua waktu ditampilkan dalam WIB.
        </p>
      </header>
      <TodayMatches />
    </div>
  );
}
