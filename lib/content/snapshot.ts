import fs from 'node:fs';
import path from 'node:path';
import type { ClubProfile, SquadMember } from '@/types/football';

/** Satu klub di snapshot: profil plus slug dan waktu pengambilan. */
export interface SnapshotClub extends Omit<ClubProfile, 'competitions'> {
  slug: string;
  competitions: string[]; // kode kompetisi, mis. "PL"
  fetchedAt: string;
}

export interface ClubSnapshot {
  generatedAt: string | null;
  clubs: SnapshotClub[];
}

const FILE = path.join(process.cwd(), 'content', 'snapshots', 'clubs.json');

export function loadClubSnapshot(): ClubSnapshot {
  if (!fs.existsSync(FILE)) return { generatedAt: null, clubs: [] };
  const raw = JSON.parse(fs.readFileSync(FILE, 'utf8')) as ClubSnapshot;
  return { generatedAt: raw.generatedAt ?? null, clubs: raw.clubs ?? [] };
}

export function findClub(slug: string): SnapshotClub | undefined {
  return loadClubSnapshot().clubs.find((c) => c.slug === slug);
}

/** Kelompokkan skuad per posisi untuk tampilan. */
export function groupSquad(squad: SquadMember[]): Record<string, SquadMember[]> {
  const order = ['Goalkeeper', 'Defence', 'Midfield', 'Offence'];
  const groups: Record<string, SquadMember[]> = {};
  for (const p of squad) {
    const key = p.position ?? 'Lainnya';
    (groups[key] ??= []).push(p);
  }
  const sorted: Record<string, SquadMember[]> = {};
  for (const k of [...order, ...Object.keys(groups).filter((k) => !order.includes(k))]) {
    if (groups[k]) sorted[k] = groups[k];
  }
  return sorted;
}

export const POSITION_LABEL: Record<string, string> = {
  Goalkeeper: 'Penjaga Gawang',
  Defence: 'Bek',
  Midfield: 'Gelandang',
  Offence: 'Penyerang',
  Lainnya: 'Lainnya',
};
