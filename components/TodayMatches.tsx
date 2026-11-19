'use client';

import { useMemo, useState } from 'react';
import { MatchList } from './MatchList';
import { addDays, wibDateString } from '@/lib/format/time';
import { COMPETITIONS } from '@/lib/config';

type Tab = 'semua' | 'live' | 'hari-ini' | 'akan-datang' | 'selesai';

const TABS: { key: Tab; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'live', label: 'Sedang Berlangsung' },
  { key: 'hari-ini', label: 'Hari Ini' },
  { key: 'akan-datang', label: 'Akan Datang' },
  { key: 'selesai', label: 'Selesai' },
];

/**
 * Widget pertandingan yang dipakai di Beranda dan Live Score.
 * Tanggal dihitung di browser dengan zona WIB (Asia/Jakarta).
 */
export function TodayMatches({ showFilters = true }: { showFilters?: boolean }) {
  const [tab, setTab] = useState<Tab>('semua');
  const [competition, setCompetition] = useState<string>('');

  const today = wibDateString();
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (tab === 'live') {
      params.set('from', today);
      params.set('to', today);
      params.set('status', 'IN_PLAY');
    } else if (tab === 'akan-datang') {
      params.set('from', today);
      params.set('to', addDays(today, 2));
      params.set('status', 'SCHEDULED');
    } else if (tab === 'selesai') {
      params.set('from', addDays(today, -2));
      params.set('to', today);
      params.set('status', 'FINISHED');
    } else {
      params.set('from', today);
      params.set('to', today);
    }
    if (competition) params.set('competition', competition);
    return params.toString();
  }, [tab, competition, today]);

  return (
    <section aria-label="Daftar pertandingan" className="space-y-4">
      {showFilters && (
        <div className="space-y-3">
          <div role="tablist" aria-label="Filter status pertandingan" className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? 'bg-pitch-600 text-white'
                    : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-navy-800 dark:text-slate-200 dark:ring-navy-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium">Kompetisi:</span>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              className="min-h-11 rounded-md border border-slate-300 bg-white px-3 dark:border-navy-700 dark:bg-navy-800"
            >
              <option value="">Semua kompetisi</option>
              {COMPETITIONS.filter((c) => c.providerCode).map((c) => (
                <option key={c.slug} value={c.providerCode ?? ''}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <MatchList
        key={query}
        query={query}
        refreshMs={tab === 'live' ? 30_000 : 0}
        emptyTitle={tab === 'live' ? 'Tidak ada pertandingan yang sedang berlangsung' : undefined}
        emptyText={
          tab === 'live'
            ? 'Pertandingan yang sedang berlangsung akan muncul otomatis di sini.'
            : undefined
        }
      />
    </section>
  );
}
