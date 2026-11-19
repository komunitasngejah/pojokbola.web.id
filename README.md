# PojokBola (pojokbola.web.id)

Portal sepak bola Indonesia dan internasional: live score, jadwal, hasil, klasemen, dan berita.

> **Tagline:** Semua Informasi Sepak Bola Ada di Satu Pojok.

## Status proyek

Ini adalah **fondasi tahap 1**. Yang sudah ada dan terverifikasi build:

| Area | Status |
|---|---|
| Next.js 14 (static export) + TypeScript + Tailwind | Selesai, build berhasil |
| Lapisan API (adapter Football-Data.org, normalisasi, error handler) | Selesai |
| Proxy server-side `/api/matches` (Cloudflare Pages Functions, cache edge, validasi input) | Selesai |
| Beranda, Live Score (filter status, kompetisi, auto-refresh) | Selesai |
| Komponen navigasi responsif, skeleton, empty state, error state | Selesai |
| Metadata SEO dasar, JSON-LD Organization & WebSite | Selesai |
| Halaman klasemen, jadwal, hasil, kompetisi, klub, detail pertandingan | **Belum** (tahap 2) |
| Sistem berita (CMS/Markdown), halaman penulis & redaksi | **Belum** (tahap 3) |
| Halaman legal (Tentang Kami, Kebijakan Privasi, Disclaimer, dll.) | **Belum** (tahap 4) |
| `robots.txt`, `sitemap.xml`, RSS | **Belum** (tahap 4) |
| Integrasi AdSense (`ads.txt`, slot iklan, consent) | **Belum**; hanya dibuka setelah akun disetujui |

**Catatan jujur:** beberapa tautan navigasi (mis. `/klasemen/`, `/jadwal/`) sudah ada di menu tetapi halamannya belum dibuat, sehingga akan 404 sampai tahap 2 selesai. Ini sengaja tidak disembunyikan.

**Liga Indonesia dan Piala Asia** belum tersedia di Football-Data.org. Keduanya ditandai `providerCode: null` di `lib/config.ts` dan akan menampilkan pesan "data belum tersedia" sampai sumber data yang sesuai ditambahkan.

## Stack

- Next.js 14 dengan `output: 'export'` (HTML statis, dapat dirayapi Google)
- React 18, TypeScript (strict), Tailwind CSS, Lucide Icons
- Cloudflare Pages (hosting statis) + Pages Functions (proxy API)
- Football-Data.org v4 sebagai provider API pertama

## Arsitektur singkat

```
Browser ──► /api/matches (Pages Function) ──► api.football-data.org/v4
                 │  • API key hanya di env server
                 │  • cache edge (30–120 detik)
                 │  • validasi input (tanggal, kompetisi, status)
                 ▼
          normalisasi ke tipe internal (types/football.ts)
```

- `lib/api/provider.ts` — kontrak `FootballProvider`. Provider baru cukup mengimplementasikan interface ini.
- `lib/api/football-data.ts` — adapter Football-Data.org.
- `lib/normalize/` — mengubah respons mentah provider menjadi tipe internal. Tipe mentah tidak keluar dari folder ini.
- `lib/api/errors.ts` — kelas error seragam dan pemetaan status HTTP (termasuk 429 dan timeout).
- `functions/api/matches.ts` — proxy server-side.
- `lib/config.ts` — nama situs, daftar kompetisi, dan TTL cache, dalam satu tempat.

## Instalasi lokal

Persyaratan: Node.js 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # lalu isi FOOTBALL_DATA_API_KEY dengan token Anda
npm run dev                  # http://localhost:3000
```

Untuk menguji proxy API secara lokal bersama Pages Functions:

```bash
npm run build
npx wrangler pages dev out --compatibility-date=2024-09-23
```

Simpan token untuk Wrangler di file `.dev.vars` (sudah di-ignore Git):

```
FOOTBALL_DATA_API_KEY=token_asli_anda
```

## Pemeriksaan

```bash
npm run typecheck                                  # tipe aplikasi
npx -p typescript tsc -p functions/tsconfig.json   # tipe Pages Functions
npm run build                                      # build produksi
```

## Keamanan API key

- Token **tidak pernah** masuk ke kode frontend. Hanya `functions/` yang membacanya.
- Jangan beri prefix `NEXT_PUBLIC_` pada variabel token.
- File `.env*` dan `.dev.vars` tidak boleh di-commit. Nilai di `.env.example` adalah placeholder.
- Jika token pernah terekspos (mis. di tangkapan layar atau commit), segera regenerasi di dashboard provider.

## Deployment ke Cloudflare Pages

1. Push repository ke GitHub.
2. Di Cloudflare Dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Pengaturan build:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: `20` (tambahkan variabel `NODE_VERSION=20`)
4. Di **Settings → Environment variables** (Production), tambahkan:
   - `FOOTBALL_DATA_API_KEY` (secret, tipe *Encrypted*)
   - `NEXT_PUBLIC_SITE_URL` = `https://pojokbola.web.id`
5. Tambahkan custom domain `pojokbola.web.id` dan atur redirect `www` ke apex (atau sebaliknya) agar hanya satu hostname yang aktif.

## Konfigurasi domain

- Pastikan HTTPS aktif dan HTTP diarahkan ke HTTPS (Cloudflare: *SSL/TLS → Always Use HTTPS*).
- Satu versi hostname saja. Redirect `www.pojokbola.web.id` ke `pojokbola.web.id` (atau kebalikannya, pilih satu dan konsisten).

## Google Search Console (dikerjakan setelah tahap 4)

1. Tambahkan properti dengan tipe *Domain* untuk `pojokbola.web.id`.
2. Verifikasi melalui DNS TXT, atau isi `NEXT_PUBLIC_GSC_VERIFICATION` dengan kode meta tag.
3. Kirim `https://pojokbola.web.id/sitemap.xml` setelah file tersebut tersedia.
4. Gunakan *URL Inspection → Request indexing* untuk halaman penting. Pengindeksan tidak dijamin instan.

## Google AdSense (dikerjakan setelah akun disetujui)

- Jangan menampilkan iklan sebelum akun AdSense disetujui dan kode iklan tersedia.
- Isi `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` dengan publisher ID asli, lalu buat `ads.txt` dengan baris resmi dari AdSense.
- Jangan membuat `ads.txt` dengan ID palsu.
- Halaman legal (Kebijakan Privasi, Disclaimer, Kontak) harus lengkap sebelum pengajuan.

## Lisensi & data

Data pertandingan dimiliki dan dilisensikan oleh penyedia API masing-masing. Pastikan paket API yang digunakan mengizinkan penayangan data di situs publik.
