import { SITE } from '@/lib/config';

/** Semua tampilan waktu di situs memakai zona WIB (Asia/Jakarta). */
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: SITE.timezone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: SITE.timezone,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: SITE.timezone,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatKickoffTime(iso: string): string {
  return `${timeFormatter.format(new Date(iso))} WIB`;
}

export function formatLongDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${dateTimeFormatter.format(new Date(iso))} WIB`;
}

/** Tanggal YYYY-MM-DD menurut zona WIB, untuk parameter query. */
export function wibDateString(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(yyyyMmDd: string, days: number): string {
  const d = new Date(yyyyMmDd + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
