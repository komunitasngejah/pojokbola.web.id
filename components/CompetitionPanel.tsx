'use client';

import { useMemo } from 'react';
import { MatchList } from './MatchList';
import { StandingsTable } from './StandingsTable';
import { addDays, wibDateString } from '@/lib/format/time';

/**
 * Isi halaman satu kompetisi: klasemen + jadwal 7 hari ke depan + hasil 7 hari terakhir.
 * Tanggal dihitung di browser (WIB), bukan saat build.
 */
export function CompetitionPanel({ competitionCode }: { competitionCode: string }) {
  const today = wibDateString();

  const upcomingQuery = useMemo(
    () => new URLSearchParams({ from: today, to: addDays(today, 6), status: 'SCHEDULED', competition: competitionCode }).toString(),
    [today, competitionCode],
  );
  const resultsQuery = useMemo(
    () => new URLSearchParams({ from: addDays(today, -6), to: today, status: 'FINISHED', competition: competitionCode }).toString(),
    [today, competitionCode],
  );

  return (
    <div className="space-y-8">
      <section aria-labelledby="klasemen-kompetisi" className="space-y-3">
        <h2 id="klasemen-kompetisi" className="text-xl font-bold">
          Klasemen
        </h2>
        <StandingsTable competitionCode={competitionCode} />
      </section>

      <section aria-labelledby="jadwal-kompetisi" className="space-y-3">
        <h2 id="jadwal-kompetisi" className="text-xl font-bold">
          Jadwal 7 Hari ke Depan
        </h2>
        <MatchList
          query={upcomingQuery}
          onlyStatuses={['SCHEDULED']}
          emptyTitle="Belum ada jadwal"
          emptyText="Belum ada pertandingan terjadwal dalam 7 hari ke depan."
        />
      </section>

      <section aria-labelledby="hasil-kompetisi" className="space-y-3">
        <h2 id="hasil-kompetisi" className="text-xl font-bold">
          Hasil 7 Hari Terakhir
        </h2>
        <MatchList
          query={resultsQuery}
          onlyStatuses={['FINISHED']}
          emptyTitle="Belum ada hasil"
          emptyText="Belum ada pertandingan selesai dalam 7 hari terakhir."
        />
      </section>
    </div>
  );
}
