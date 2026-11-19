import Link from 'next/link';
import { SITE } from '@/lib/config';

const LEGAL_LINKS = [
  { href: '/kebijakan-privasi/', label: 'Kebijakan Privasi' },
  { href: '/disclaimer/', label: 'Disclaimer' },
  { href: '/pedoman-redaksi/', label: 'Pedoman Redaksi' },
  { href: '/redaksi/', label: 'Redaksi' },
  { href: '/koreksi-dan-hak-jawab/', label: 'Koreksi & Hak Jawab' },
  { href: '/syarat-dan-ketentuan/', label: 'Syarat & Ketentuan' },
  { href: '/kontak/', label: 'Kontak' },
  { href: '/peta-situs/', label: 'Peta Situs' },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white dark:border-navy-700 dark:bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-base font-bold text-navy-900 dark:text-white">{SITE.name}</p>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{SITE.description}</p>

        <nav aria-label="Tautan kebijakan dan informasi" className="mt-6">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-700 hover:text-pitch-600 dark:text-slate-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-500">
          © {new Date().getFullYear()} {SITE.name}. Data pertandingan disediakan oleh penyedia API pihak ketiga dan dapat
          berubah tanpa pemberitahuan.
        </p>
      </div>
    </footer>
  );
}
