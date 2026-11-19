'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiEnvelope, Standings } from '@/types/football';
import { fetchApi, ClientApiError } from '@/lib/api/client';
import { formatDateTime } from '@/lib/format/time';
import { CardSkeleton, EmptyState, ErrorState } from './AsyncState';

/**
 * Tabel klasemen. Pada layar kecil, tabel digulir di dalam kartunya sendiri,
 * sehingga halaman tetap tidak memiliki horizontal overflow.
 */
export function StandingsTable({ competitionCode, season }: { competitionCode: string; season?: string }) {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'error';
    env?: ApiEnvelope<Standings>;
    error?: string;
  }>({ status: 'loading' });

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setState({ status: 'loading' });
      const q = new URLSearchParams({ competition: competitionCode });
      if (season) q.set('season', season);
      try {
        const env = await fetchApi<Standings>(`/api/standings?${q.toString()}`, signal);
        setState({ status: 'ready', env });
      } catch (err) {
        if (signal?.aborted) return;
        setState({
          status: 'error',
          error: err instanceof ClientApiError ? err.message : 'Terjadi kesalahan tak terduga.',
        });
      }
    },
    [competitionCode, season],
  );

  useEffect(() => {
    const c = new AbortController();
    load(c.signal);
    return () => c.abort();
  }, [load]);

  if (state.status === 'loading') return <CardSkeleton count={1} />;
  if (state.status === 'error') return <ErrorState message={state.error ?? ''} onRetry={() => load()} />;

  const rows = state.env?.data.rows ?? [];
  if (rows.length === 0) {
    return <EmptyState title="Klasemen belum tersedia" text="Data klasemen untuk musim ini belum tersedia dari penyedia data." />;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Musim {state.env?.data.season ?? '-'} · Diperbarui {state.env ? formatDateTime(state.env.fetchedAt) : '-'}
        {state.env?.cached ? ' (cache)' : ''}
      </p>
      <div className="overflow-x-auto rounded-card border border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800">
        <table className="w-full min-w-[640px] text-sm tabular-nums">
          <caption className="sr-only">Klasemen {state.env?.data.competition.name}</caption>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-navy-900 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">#</th>
              <th scope="col" className="px-3 py-2 text-left">Klub</th>
              <th scope="col" className="px-2 py-2 text-center" title="Main">Main</th>
              <th scope="col" className="px-2 py-2 text-center" title="Menang">Menang</th>
              <th scope="col" className="px-2 py-2 text-center" title="Seri">Seri</th>
              <th scope="col" className="px-2 py-2 text-center" title="Kalah">Kalah</th>
              <th scope="col" className="px-2 py-2 text-center" title="Gol memasukkan">GM</th>
              <th scope="col" className="px-2 py-2 text-center" title="Gol kemasukan">GK</th>
              <th scope="col" className="px-2 py-2 text-center" title="Selisih gol">SG</th>
              <th scope="col" className="px-3 py-2 text-center font-bold">Poin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
            {rows.map((r) => (
              <tr key={r.team.id} className="hover:bg-slate-50 dark:hover:bg-navy-900/60">
                <td className="px-3 py-2 font-semibold">{r.position}</td>
                <td className="px-3 py-2 font-medium">{r.team.name}</td>
                <td className="px-2 py-2 text-center">{r.playedGames}</td>
                <td className="px-2 py-2 text-center">{r.won}</td>
                <td className="px-2 py-2 text-center">{r.draw}</td>
                <td className="px-2 py-2 text-center">{r.lost}</td>
                <td className="px-2 py-2 text-center">{r.goalsFor}</td>
                <td className="px-2 py-2 text-center">{r.goalsAgainst}</td>
                <td className="px-2 py-2 text-center">{r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}</td>
                <td className="px-3 py-2 text-center font-bold">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        GM = gol memasukkan, GK = gol kemasukan, SG = selisih gol.
      </p>
    </div>
  );
}
