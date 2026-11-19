'use client';

import { useMemo, useState } from 'react';
import { MatchList } from './MatchList';
import { addDays, wibDateString } from '@/lib/format/time';
import { SUPPORTED_COMPETITIONS } from '@/lib/config';
import type { Match } from '@/types/football';

/** Batas rentang tanggal yang diizinkan proxy API (10 hari). */
const MAX_RANGE_DAYS = 10;

interface Props {
  mode: 'jadwal' | 'hasil';
}

/**
 * Halaman jadwal (pertandingan mendatang) dan hasil (pertandingan selesai).
 * Filter: rentang tanggal, kompetisi, dan klub. Semua tanggal berdasarkan WIB.
 */
export function MatchSchedule({ mode }: Props) {
  const today = wibDateString();
  const isJadwal = mode === 'jadwal';

  const [from, setFrom] = useState(isJadwal ? today : addDays(today, -6));
  const [to, setTo] = useState(isJadwal ? addDays(today, 6) : today);
  const [competition, setCompetition] = useState('');
  const [club, setClub] = useState('');

  const rangeDays = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
  const rangeValid = rangeDays >= 0 && rangeDays <= MAX_RANGE_DAYS - 1;

  const query = useMemo(() => {
    const p = new URLSearchParams({ from, to });
    p.set('status', isJadwal ? 'SCHEDULED' : 'FINISHED');
    if (competition) p.set('competition', competition);
    return p.toString();
  }, [from, to, competition, isJadwal]);

  const onlyStatuses: Match['status'][] = isJadwal ? ['SCHEDULED'] : ['FINISHED'];

  return (
    <div className="space-y-5">
      <form
        className="grid gap-3 rounded-card border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-navy-700 dark:bg-navy-800"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Filter pertandingan"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Dari tanggal</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 dark:border-navy-700 dark:bg-navy-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Sampai tanggal</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 dark:border-navy-700 dark:bg-navy-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Kompetisi</span>
          <select
            value={competition}
            onChange={(e) => setCompetition(e.target.value)}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 dark:border-navy-700 dark:bg-navy-900"
          >
            <option value="">Semua kompetisi</option>
            {SUPPORTED_COMPETITIONS.map((c) => (
              <option key={c.slug} value={c.providerCode ?? ''}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Cari klub</span>
          <input
            type="search"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            placeholder="mis. Arsenal"
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 dark:border-navy-700 dark:bg-navy-900"
          />
        </label>
        {!rangeValid && (
          <p role="alert" className="text-sm text-amber-700 sm:col-span-2 lg:col-span-4 dark:text-amber-300">
            Rentang tanggal harus berurutan dan maksimal {MAX_RANGE_DAYS} hari.
          </p>
        )}
      </form>

      {rangeValid && (
        <MatchList
          key={`${query}|${club}`}
          query={query}
          onlyStatuses={onlyStatuses}
          clubQuery={club}
          emptyTitle={isJadwal ? 'Belum ada jadwal pada rentang ini' : 'Belum ada hasil pada rentang ini'}
          emptyText="Coba ubah rentang tanggal, kompetisi, atau kata kunci klub."
        />
      )}
    </div>
  );
}
