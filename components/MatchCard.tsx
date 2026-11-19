import type { Match } from '@/types/football';
import { formatKickoffTime } from '@/lib/format/time';
import { StatusBadge } from './StatusBadge';

function TeamLogo({ name, src }: { name: string; src: string | null }) {
  // Logo ditampilkan dengan ukuran tetap agar tidak menyebabkan layout shift.
  if (!src) {
    return (
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500"
        aria-hidden="true"
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={32} height={32} loading="lazy" decoding="async" className="h-8 w-8 object-contain" />
  );
}

/** Kartu satu pertandingan. Dipakai di live score, jadwal, dan hasil. */
export function MatchCard({ match }: { match: Match }) {
  const isFinishedOrLive = match.status === 'FINISHED' || match.status === 'LIVE' || match.status === 'HALFTIME';
  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;
  const showScore = isFinishedOrLive && home !== null && away !== null;

  return (
    <article className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-navy-700 dark:bg-navy-800">
      <header className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="truncate font-medium">{match.competition.name}</span>
        <StatusBadge status={match.status} minute={match.minute} />
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <TeamLogo name={match.home.name} src={match.home.crestUrl} />
          <span className="truncate text-sm font-semibold text-navy-900 dark:text-white">{match.home.name}</span>
        </div>

        <div className="text-center text-lg font-bold tabular-nums text-navy-900 dark:text-white" aria-live="polite">
          {showScore ? `${home} - ${away}` : formatKickoffTime(match.kickoffUtc)}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2">
          <span className="truncate text-right text-sm font-semibold text-navy-900 dark:text-white">{match.away.name}</span>
          <TeamLogo name={match.away.name} src={match.away.crestUrl} />
        </div>
      </div>
    </article>
  );
}
