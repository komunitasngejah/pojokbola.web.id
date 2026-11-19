import type { ReactNode } from 'react';
import { OPERATOR, type OperatorField } from '@/lib/legal/operator';
import { Breadcrumbs } from './Breadcrumbs';

/** Menampilkan nilai identitas pengelola, atau penanda terlihat jika belum diisi. */
export function Operator({ field, label }: { field: OperatorField; label: string }) {
  const value = OPERATOR[field];
  if (value) return <>{value}</>;
  return (
    <mark className="rounded bg-amber-200 px-1 font-semibold text-amber-900 dark:bg-amber-700 dark:text-amber-50">
      [{label} belum diisi]
    </mark>
  );
}

export function LegalPage({
  title,
  description,
  updated,
  children,
}: {
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: title }]} />
      <header className="space-y-2">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <p className="text-xs text-slate-500">Terakhir diperbarui: {updated}</p>
      </header>
      <div className="space-y-4 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}
