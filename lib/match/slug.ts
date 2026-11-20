import { slugify } from '@/lib/normalize/football-data';
import type { Match } from '@/types/football';

/**
 * Slug pertandingan: "{id}-{home}-vs-{away}". ID di depan dipakai untuk pencarian,
 * sehingga URL tetap valid walaupun nama klub berubah.
 * Dipakai di sisi klien dan server. Tidak memakai Node API.
 */
export function matchSlug(m: Pick<Match, 'id' | 'home' | 'away'>): string {
  return `${m.id}-${slugify(m.home.name)}-vs-${slugify(m.away.name)}`;
}

/** Mengambil ID dari slug. Mengembalikan null bila formatnya tidak valid. */
export function matchIdFromSlug(slug: string): string | null {
  const m = /^(\d+)-/.exec(slug);
  return m ? m[1] : null;
}
