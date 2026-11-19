import { esc } from './escape';
import { SITE } from '@/lib/config';
import { formatDateTime, formatKickoffTime } from '@/lib/format/time';
import type { LineupPlayer, MatchDetail } from '@/types/football';

export const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: 'Akan datang',
  LIVE: 'LIVE',
  HALFTIME: 'Jeda',
  FINISHED: 'Selesai',
  POSTPONED: 'Ditunda',
  SUSPENDED: 'Dihentikan',
  CANCELLED: 'Dibatalkan',
  UNKNOWN: 'Belum diketahui',
};

const GOAL_TYPE_LABEL: Record<string, string> = {
  PENALTY: 'penalti',
  OWN: 'gol bunuh diri',
  REGULAR: '',
};

export const CARD_LABEL: Record<string, string> = {
  YELLOW: 'Kuning',
  RED: 'Merah',
  YELLOW_RED: 'Kuning kedua (merah)',
  UNKNOWN: 'Kartu',
};

function html(body: string, status: number, extra: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      ...extra,
    },
  });
}

function minuteLabel(min: number | null, injury: number | null): string {
  if (min === null) return '-';
  return injury ? `${min}+${injury}'` : `${min}'`;
}

function section(title: string, inner: string): string {
  return `<section class="pb-card"><h2 style="font-size:1.05rem;margin:0 0 .5rem">${esc(title)}</h2>${inner}</section>`;
}

function lineupColumn(teamName: string, players: LineupPlayer[]): string {
  const items = players
    .map((p) => `<li>${p.shirtNumber ? `${esc(p.shirtNumber)}. ` : ''}${esc(p.name)}</li>`)
    .join('');
  return `<div><p style="font-weight:700;margin:.25rem 0">${esc(teamName)}</p><ol class="pb-muted" style="padding-left:1.1rem;margin:0">${items}</ol></div>`;
}

export function renderDetail(d: MatchDetail, slug: string): { title: string; description: string; body: string; ld: unknown[] } {
  const m = d.match;
  const home = m.home.name;
  const away = m.away.name;
  const scoreHome = m.score.fullTime.home;
  const scoreAway = m.score.fullTime.away;
  const hasScore = scoreHome !== null && scoreAway !== null && m.status !== 'SCHEDULED';
  const scoreText = hasScore ? `${scoreHome} - ${scoreAway}` : 'vs';
  const statusLabel = STATUS_LABEL[m.status] ?? 'Belum diketahui';
  const isLive = m.status === 'LIVE' || m.status === 'HALFTIME';

  const title = `${home} vs ${away}: ${hasScore ? scoreText : formatKickoffTime(m.kickoffUtc)}`;
  const description = hasScore
    ? `Skor ${home} ${scoreText} ${away} di ${m.competition.name}. Detail gol, kartu, dan pergantian pemain.`
    : `Jadwal ${home} vs ${away} di ${m.competition.name}, kick-off ${formatKickoffTime(m.kickoffUtc)}.`;

  const crumbs = `<nav class="pb-crumbs" aria-label="Breadcrumb"><a href="/">Beranda</a> / <a href="/jadwal/">Jadwal</a> / ${esc(m.competition.name)}</nav>`;

  const header = `<section class="pb-card">
    <p class="pb-muted">${esc(m.competition.name)}${m.matchday ? ` · Pekan ${m.matchday}` : ''}</p>
    <div class="pb-score">
      <div class="team">${esc(home)}</div>
      <div><div class="num">${esc(scoreText)}</div><span class="pb-badge${isLive ? ' live' : ''}">${esc(statusLabel)}${isLive && m.minute !== null ? ` ${m.minute}'` : ''}</span></div>
      <div class="team">${esc(away)}</div>
    </div>
    <p class="pb-muted" style="text-align:center;margin:.75rem 0 0">Kick-off ${esc(formatDateTime(m.kickoffUtc))}${d.venue ? ` · ${esc(d.venue)}` : ''}</p>
  </section>`;

  const goalsInner = d.goals.length
    ? `<table class="pb-table"><thead><tr><th>Menit</th><th>Tim</th><th>Pencetak</th><th>Assist</th></tr></thead><tbody>${d.goals
        .map((g) => `<tr><td>${esc(minuteLabel(g.minute, g.injuryTime))}</td><td>${esc(g.teamName ?? '-')}</td><td>${esc(g.scorer ?? '-')}${GOAL_TYPE_LABEL[g.type ?? ''] ? ` <span class="pb-muted">(${esc(GOAL_TYPE_LABEL[g.type ?? ''])})</span>` : ''}</td><td>${esc(g.assist ?? '-')}</td></tr>`)
        .join('')}</tbody></table>`
    : `<p class="pb-muted">Belum ada gol yang tercatat.</p>`;

  const bookingsInner = d.bookings.length
    ? `<table class="pb-table"><thead><tr><th>Menit</th><th>Tim</th><th>Pemain</th><th>Kartu</th></tr></thead><tbody>${d.bookings
        .map((b) => `<tr><td>${esc(minuteLabel(b.minute, null))}</td><td>${esc(b.teamName ?? '-')}</td><td>${esc(b.player ?? '-')}</td><td>${esc(CARD_LABEL[b.card])}</td></tr>`)
        .join('')}</tbody></table>`
    : `<p class="pb-muted">Tidak ada kartu yang tercatat.</p>`;

  const subsInner = d.substitutions.length
    ? `<table class="pb-table"><thead><tr><th>Menit</th><th>Tim</th><th>Masuk</th><th>Keluar</th></tr></thead><tbody>${d.substitutions
        .map((s) => `<tr><td>${esc(minuteLabel(s.minute, null))}</td><td>${esc(s.teamName ?? '-')}</td><td>${esc(s.playerIn ?? '-')}</td><td>${esc(s.playerOut ?? '-')}</td></tr>`)
        .join('')}</tbody></table>`
    : `<p class="pb-muted">Belum ada pergantian pemain yang tercatat.</p>`;

  const lineupInner = d.lineups
    ? `<div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        ${lineupColumn(home, d.lineups.home)}
        ${lineupColumn(away, d.lineups.away)}
      </div>`
    : `<p class="pb-muted">Susunan pemain belum tersedia pada paket data saat ini.</p>`;

  const refInner = d.referees.length
    ? `<ul style="margin:0;padding-left:1.1rem">${d.referees.map((r) => `<li>${esc(r.name)}${r.role ? ` <span class="pb-muted">(${esc(r.role)})</span>` : ''}</li>`).join('')}</ul>`
    : `<p class="pb-muted">Data wasit belum tersedia.</p>`;

  const body = [
    crumbs,
    header,
    section('Gol', goalsInner),
    section('Kartu', bookingsInner),
    section('Pergantian pemain', subsInner),
    section('Susunan pemain', lineupInner),
    section('Wasit', refInner),
    `<p class="pb-muted">Halaman ini diperbarui otomatis dari data penyedia. Sumber: <a href="https://www.football-data.org">Football-Data.org</a>.</p>`,
  ].join('\n');

  // Structured data SportsEvent hanya bila field wajibnya tersedia dan akurat.
  const ld: unknown[] = [];
  const eventLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${home} vs ${away}`,
    startDate: m.kickoffUtc,
    sport: 'Soccer',
    competitor: [
      { '@type': 'SportsTeam', name: home },
      { '@type': 'SportsTeam', name: away },
    ],
    url: new URL(`/pertandingan/${slug}/`, SITE.url).toString(),
  };
  if (d.venue) eventLd.location = { '@type': 'Place', name: d.venue };
  ld.push(eventLd);

  return { title, description, body, ld };
}
