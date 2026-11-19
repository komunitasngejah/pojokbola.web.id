'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiEnvelope, Scorers } from '@/types/football';
import { fetchApi, ClientApiError } from '@/lib/api/client';
import { formatDateTime } from '@/lib/format/time';
import { CardSkeleton, EmptyState, ErrorState } from './AsyncState';

/** Tabel pencetak gol terbanyak dengan pemilih kompetisi. */
export function ScorersTable({ competitionCode }: { competitionCode: string }) {
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; env?: ApiEnvelope<Scorers>; error?: string }>({
    status: 'loading',
  });

  const load = useCallback(async (signal?: AbortSignal) => {
    setState({ status: 'loading' });
    try {
      const env = await fetchApi<Scorers>(`/api/scorers?competition=${encodeURIComponent(competitionCode)}`, signal);
      setState({ status: 'ready', env });
    } catch (err) {
      if (signal?.aborted) return;
      setState({ status: 'error', error: err instanceof ClientApiError ? err.message : 'Terjadi kesalahan tak terduga.' });
    }
  }, [competitionCode]);

  useEffect(() => {
    const c = new AbortController();
    load(c.signal);
    return () => c.abort();
  }, [load]);

  if (state.status === 'loading') return <CardSkeleton count={1} />;
  if (state.status === 'error') return <ErrorState message={state.error ?? ''} onRetry={() => load()} />;

  const rows = state.env?.data.rows ?? [];
  if (rows.length === 0) {
    return <EmptyState title="Data statistik belum tersedia" text="Daftar pencetak gol untuk kompetisi ini belum tersedia." />;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Diperbarui {state.env ? formatDateTime(state.env.fetchedAt) : '-'}
        {state.env?.cached ? ' (cache)' : ''}
      </p>
      <div className="overflow-x-auto rounded-card border border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800">
        <table className="w-full min-w-[520px] text-sm tabular-nums">
          <caption className="sr-only">Pencetak gol terbanyak {state.env?.data.competition.name}</caption>
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-navy-900 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">#</th>
              <th scope="col" className="px-3 py-2 text-left">Pemain</th>
              <th scope="col" className="px-3 py-2 text-left">Klub</th>
              <th scope="col" className="px-2 py-2 text-center">Main</th>
              <th scope="col" className="px-2 py-2 text-center">Gol</th>
              <th scope="col" className="px-2 py-2 text-center">Assist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
            {rows.map((r) => (
              <tr key={`${r.rank}-${r.playerName}`} className="hover:bg-slate-50 dark:hover:bg-navy-900/60">
                <td className="px-3 py-2 font-semibold">{r.rank}</td>
                <td className="px-3 py-2 font-medium">{r.playerName}</td>
                <td className="px-3 py-2">{r.team.name}</td>
                <td className="px-2 py-2 text-center">{r.playedMatches ?? '-'}</td>
                <td className="px-2 py-2 text-center font-bold">{r.goals}</td>
                <td className="px-2 py-2 text-center">{r.assists ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
