import type { MatchStatus } from '@/types/football';

const LABELS: Record<MatchStatus, string> = {
  SCHEDULED: 'Akan datang',
  LIVE: 'LIVE',
  HALFTIME: 'Jeda',
  FINISHED: 'Selesai',
  POSTPONED: 'Ditunda',
  SUSPENDED: 'Dihentikan',
  CANCELLED: 'Dibatalkan',
  UNKNOWN: 'Belum diketahui',
};

export function StatusBadge({ status, minute }: { status: MatchStatus; minute?: number | null }) {
  if (status === 'LIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-live-500 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
        LIVE{typeof minute === 'number' ? ` ${minute}'` : ''}
      </span>
    );
  }

  const tone =
    status === 'FINISHED'
      ? 'bg-slate-200 text-slate-700'
      : status === 'POSTPONED' || status === 'SUSPENDED' || status === 'CANCELLED'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-pitch-100 text-pitch-700';

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>{LABELS[status]}</span>
  );
}
