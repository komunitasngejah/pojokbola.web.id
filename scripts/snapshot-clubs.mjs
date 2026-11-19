#!/usr/bin/env node
/**
 * Membuat / memperbarui snapshot profil klub di content/snapshots/clubs.json.
 *
 * - Jalankan sebelum build: `npm run build:prod`.
 * - Membutuhkan FOOTBALL_DATA_API_KEY. Tanpa key, script keluar dengan status 0
 *   dan snapshot lama tetap dipakai (build tidak gagal).
 * - Respek batas paket gratis (10 permintaan/menit): jeda 6,5 detik per permintaan.
 * - Klub yang snapshot-nya masih lebih baru dari MAX_AGE_DAYS dilewati (hemat kuota).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'content', 'snapshots', 'clubs.json');
const BASE = 'https://api.football-data.org/v4';
const MAX_AGE_DAYS = 7;
const THROTTLE_MS = 6500;

// Harus sama dengan providerCode di lib/config.ts.
const COMPETITION_CODES = [
  ['PL', 'Liga Inggris'],
  ['PD', 'Liga Spanyol'],
  ['SA', 'Liga Italia'],
  ['BL1', 'Liga Jerman'],
  ['FL1', 'Liga Prancis'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function api(token, pathname, attempt = 1) {
  const res = await fetch(BASE + pathname, { headers: { 'X-Auth-Token': token, Accept: 'application/json' } });
  if (res.status === 429 && attempt < 3) {
    const wait = Number(res.headers.get('Retry-After') ?? 60);
    console.log(`  batas permintaan tercapai, menunggu ${wait} detik...`);
    await sleep((Number.isFinite(wait) ? wait : 60) * 1000);
    return api(token, pathname, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} untuk ${pathname}`);
  return res.json();
}

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8'));
  } catch {
    return { generatedAt: null, clubs: [] };
  }
}

async function main() {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) {
    console.log('[snapshot] FOOTBALL_DATA_API_KEY tidak ada. Snapshot lama dipakai, build dilanjutkan.');
    return;
  }

  const existing = loadExisting();
  const byId = new Map(existing.clubs.map((c) => [c.id, c]));
  const ageLimit = Date.now() - MAX_AGE_DAYS * 86_400_000;

  // 1. Kumpulkan tim dan kompetisi yang mereka ikuti dari klasemen.
  const teams = new Map();
  for (const [code, label] of COMPETITION_CODES) {
    try {
      const data = await api(token, `/competitions/${code}/standings`);
      const table = (data.standings ?? []).find((s) => s.type === 'TOTAL')?.table ?? [];
      for (const row of table) {
        const id = String(row.team.id);
        if (!teams.has(id)) teams.set(id, { id, name: row.team.name, competitions: new Set() });
        teams.get(id).competitions.add(code);
      }
      console.log(`[snapshot] ${label}: ${table.length} tim`);
    } catch (err) {
      console.warn(`[snapshot] gagal mengambil klasemen ${label}: ${err.message}`);
    }
    await sleep(THROTTLE_MS);
  }

  if (teams.size === 0) {
    console.log('[snapshot] tidak ada tim yang berhasil diambil. Snapshot lama dipertahankan.');
    return;
  }

  // 2. Ambil profil klub yang belum segar.
  const out = new Map(byId);
  let fetched = 0;
  let skipped = 0;
  for (const t of teams.values()) {
    const prev = byId.get(t.id);
    const fresh = prev && Date.parse(prev.fetchedAt) >= ageLimit;
    if (fresh) {
      out.set(t.id, { ...prev, competitions: [...t.competitions] });
      skipped++;
      continue;
    }
    try {
      const d = await api(token, `/teams/${t.id}`);
      out.set(t.id, {
        id: String(d.id),
        name: d.name,
        slug: slugify(d.name),
        shortName: d.shortName ?? null,
        crestUrl: d.crest ?? null,
        founded: d.founded ?? null,
        venue: d.venue ?? null,
        address: d.address ?? null,
        website: d.website ?? null,
        clubColors: d.clubColors ?? null,
        coach: d.coach?.name ? { name: d.coach.name, nationality: d.coach.nationality ?? null } : null,
        competitions: [...t.competitions],
        squad: (d.squad ?? []).map((p) => ({
          name: p.name,
          position: p.position ?? null,
          nationality: p.nationality ?? null,
          dateOfBirth: p.dateOfBirth ?? null,
        })),
        fetchedAt: new Date().toISOString(),
      });
      fetched++;
      console.log(`[snapshot] diperbarui: ${d.name}`);
    } catch (err) {
      console.warn(`[snapshot] gagal ${t.name}: ${err.message}. Snapshot lama dipertahankan bila ada.`);
    }
    await sleep(THROTTLE_MS);
  }

  // 3. Tulis hasil dengan slug unik.
  const clubs = [...out.values()].sort((a, b) => a.name.localeCompare(b.name));
  const seen = new Set();
  for (const c of clubs) {
    if (seen.has(c.slug)) c.slug = `${c.slug}-${c.id}`;
    seen.add(c.slug);
  }
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), clubs }, null, 2) + '\n');
  console.log(`[snapshot] selesai: ${clubs.length} klub (${fetched} diperbarui, ${skipped} masih segar).`);
}

main().catch((err) => {
  // Snapshot gagal tidak boleh menggagalkan build.
  console.error('[snapshot] error tak terduga:', err);
  process.exit(0);
});
