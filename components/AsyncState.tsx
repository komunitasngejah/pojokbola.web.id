import { AlertTriangle, Inbox } from 'lucide-react';

/** Skeleton loading untuk daftar kartu. */
export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Memuat data">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-card border border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-800"
        />
      ))}
      <span className="sr-only">Memuat data…</span>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-slate-300 bg-white p-8 text-center dark:border-navy-700 dark:bg-navy-800">
      <Inbox size={28} className="text-slate-400" aria-hidden="true" />
      <p className="font-semibold">{title}</p>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-card border border-amber-300 bg-amber-50 p-6 text-center dark:border-amber-700 dark:bg-amber-950/40">
      <AlertTriangle size={28} className="text-amber-600" aria-hidden="true" />
      <p className="font-semibold text-amber-900 dark:text-amber-200">Data tidak dapat dimuat</p>
      <p className="max-w-md text-sm text-amber-800 dark:text-amber-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-md bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-700"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
