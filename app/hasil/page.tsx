import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { MatchSchedule } from '@/components/MatchSchedule';

export const metadata: Metadata = buildMetadata({
  title: 'Hasil Pertandingan Sepak Bola',
  description:
    'Hasil pertandingan sepak bola terbaru dengan skor akhir. Filter berdasarkan tanggal, kompetisi, dan klub.',
  path: '/hasil/',
});

export default function HasilPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Hasil Pertandingan</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Menampilkan pertandingan yang sudah selesai.</p>
      </header>
      <MatchSchedule mode="hasil" />
    </div>
  );
}
