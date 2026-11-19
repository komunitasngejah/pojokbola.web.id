'use client';

import { useState } from 'react';
import { ScorersTable } from './ScorersTable';
import { SUPPORTED_COMPETITIONS } from '@/lib/config';

export function StatistikPicker() {
  const [code, setCode] = useState(SUPPORTED_COMPETITIONS[0]?.providerCode ?? '');
  return (
    <div className="space-y-4">
      <label className="flex flex-col gap-1 text-sm sm:max-w-xs">
        <span className="font-medium">Pilih kompetisi</span>
        <select
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="min-h-11 rounded-md border border-slate-300 bg-white px-3 dark:border-navy-700 dark:bg-navy-800"
        >
          {SUPPORTED_COMPETITIONS.map((c) => (
            <option key={c.slug} value={c.providerCode ?? ''}>{c.name}</option>
          ))}
        </select>
      </label>
      <ScorersTable key={code} competitionCode={code} />
    </div>
  );
}
