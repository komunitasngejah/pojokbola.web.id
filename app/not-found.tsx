import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-pitch-600">Error 404</p>
      <h1 className="text-2xl font-extrabold">Halaman tidak ditemukan</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak pernah ada.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/" className="min-h-11 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white">
          Kembali ke Beranda
        </Link>
        <Link href="/live-score/" className="min-h-11 rounded-md bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-slate-300 dark:bg-navy-800">
          Live Score
        </Link>
      </div>
    </div>
  );
}
