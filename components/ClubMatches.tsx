'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ApiEnvelope, Match } from '@/types/football';
import { fetchApi, ClientApiError } from '@/lib/api/client';
import { addDays, formatKickoffTime, wibDateString } from '@/lib/format/time';
import { matchSlug } from '@/lib/match/slug';
import { StatusBadge } from './StatusBadge';
import { CardSkeleton, EmptyState, ErrorState } from './AsyncState';

/** Jadwal dan hasil satu klub: 4 hari lalu sampai 5 hari ke depan (WIB). */
export function ClubMatches({ teamId }: { teamId: string }) {
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; matches?: Match[]; error?: string }>({
    status: 'loading',
  });

  useEffect(() => {
    const c = new AbortController();
    const today = wibDateString();
    const q = new URLSearchParams({ team: teamId, from: addDays(today, -4), to: addDays(today, 5) });
    fetchApi<Match[]>(`/api/team-matches?${q.toString()}`, c.signal)
      .then((env: ApiEnvelope<Match[]>) => setState({ status: 'ready', matches: env.data }))
      .catch((err) => {
        if (c.signal.aborted) return;
        setState({ status: 'error', error: err instanceof ClientApiError ? err.message : 'Terjadi kesalahan.' });
      });
    return () => c.abort();
  }, [teamId]);

  if (state.status === 'loading') return <CardSkeleton count={2} />;
  if (state.status === 'error') return <ErrorState message={state.error ?? ''} />;
  const matches = state.matches ?? [];
  if (matches.length === 0) {
    return <EmptyState title="Tidak ada pertandingan" text="Tidak ada jadwal atau hasil dalam rentang ini." />;
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-card border border-slate-200 bg-white dark:divide-navy-700 dark:border-navy-700 dark:bg-navy-800">
      {matches.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-3 p-3 text-sm">
          <div className="min-w-0">
            <p className="truncate font-medium">
              {m.home.name} vs {m.away.name}
            </p>
            <p className="text-xs text-slate-500">
              {m.competition.name} · {formatKickoffTime(m.kickoffUtc)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={m.status} minute={m.minute} />
            <Link href={`/pertandingan/${matchSlug(m)}/`} className="text-xs font-semibold text-pitch-600 hover:underline">
              Detail
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
