'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE } from '@/lib/config';

/** Navigasi utama. Urutan & label sesuai spesifikasi. */
export const NAV_ITEMS = [
  { href: '/', label: 'Beranda' },
  { href: '/live-score/', label: 'Live Score' },
  { href: '/jadwal/', label: 'Jadwal Bola' },
  { href: '/hasil/', label: 'Hasil Pertandingan' },
  { href: '/klasemen/', label: 'Klasemen' },
  { href: '/kompetisi/', label: 'Kompetisi' },
  { href: '/berita/', label: 'Berita' },
  { href: '/transfer/', label: 'Transfer' },
  { href: '/statistik/', label: 'Statistik' },
  { href: '/tentang-kami/', label: 'Tentang Kami' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-800 bg-navy-900 text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight" aria-label={`${SITE.name} - Beranda`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pitch-500 text-sm font-black">PB</span>
          <span className="text-lg">{SITE.name}</span>
        </Link>

        {/* Navigasi desktop */}
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="rounded-md px-2.5 py-1.5 text-slate-200 hover:bg-navy-700 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tombol menu mobile (target sentuh min. 44px) */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-navy-700 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Navigasi mobile" className="border-t border-navy-800 bg-navy-900 lg:hidden">
          <ul className="grid grid-cols-2 gap-1 p-3 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-slate-100 hover:bg-navy-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
