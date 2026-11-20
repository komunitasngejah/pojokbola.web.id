import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { MatchSchedule } from '@/components/MatchSchedule';

export const metadata: Metadata = buildMetadata({
  title: 'Jadwal Pertandingan Sepak Bola',
  description:
    'Jadwal pertandingan sepak bola mendatang dengan waktu kick-off WIB. Filter berdasarkan tanggal, kompetisi, dan klub.',
  path: '/jadwal/',
});

export default function JadwalPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Jadwal Pertandingan</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Waktu kick-off ditampilkan dalam WIB.</p>
      </header>
      <MatchSchedule mode="jadwal" />
    </div>
  );
}
