'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ApiEnvelope, Match } from '@/types/football';
import { fetchApi, ClientApiError } from '@/lib/api/client';
import { formatDateTime } from '@/lib/format/time';
import { MatchCard } from './MatchCard';
import { CardSkeleton, EmptyState, ErrorState } from './AsyncState';

interface Props {
  /** Query string tanpa tanda "?", mis. "from=2026-11-19&to=2026-11-19". */
  query: string;
  emptyTitle?: string;
  emptyText?: string;
  /** Filter status di sisi klien (mis. hanya LIVE). */
  onlyStatuses?: Match['status'][];
  /** Filter nama klub di sisi klien (tidak peka huruf besar/kecil). */
  clubQuery?: string;
  /** Interval pembaruan otomatis dalam milidetik. 0 = tidak auto-refresh. */
  refreshMs?: number;
}

/**
 * Menampilkan daftar pertandingan dari proxy internal /api/matches.
 * Menangani loading (skeleton), kosong (empty state), dan gagal (error state).
 */
export function MatchList({ query, emptyTitle, emptyText, onlyStatuses, clubQuery, refreshMs = 0 }: Props) {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'error';
    envelope?: ApiEnvelope<Match[]>;
    error?: string;
  }>({ status: 'loading' });

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const env = await fetchApi<Match[]>(`/api/matches?${query}`, signal);
        setState({ status: 'ready', envelope: env });
      } catch (err) {
        if (signal?.aborted) return;
        setState({
          status: 'error',
          error: err instanceof ClientApiError ? err.message : 'Terjadi kesalahan tak terduga.',
        });
      }
    },
    [query],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    if (!refreshMs) return () => controller.abort();

    const timer = setInterval(() => load(controller.signal), refreshMs);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [load, refreshMs]);

  if (state.status === 'loading') return <CardSkeleton />;
  if (state.status === 'error') return <ErrorState message={state.error ?? ''} onRetry={() => load()} />;

  const needle = clubQuery?.trim().toLowerCase() ?? '';
  const matches = (state.envelope?.data ?? []).filter(
    (m) =>
      (!onlyStatuses || onlyStatuses.includes(m.status)) &&
      (!needle || m.home.name.toLowerCase().includes(needle) || m.away.name.toLowerCase().includes(needle)),
  );

  return (
    <div className="space-y-3">
      {state.envelope?.fetchedAt && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Diperbarui: {formatDateTime(state.envelope.fetchedAt)}
          {state.envelope.cached ? ' (dari cache)' : ''}
        </p>
      )}

      {matches.length === 0 ? (
        <EmptyState
          title={emptyTitle ?? 'Belum ada pertandingan'}
          text={emptyText ?? 'Tidak ada pertandingan untuk pilihan ini. Coba ubah filter atau tanggal.'}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
