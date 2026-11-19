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
| Klasemen (`/klasemen/`), proxy `/api/standings` (cache 1 jam) | Selesai (tahap 2) |
| Jadwal (`/jadwal/`) dan Hasil (`/hasil/`) dengan filter tanggal, kompetisi, klub | Selesai (tahap 2) |
| Indeks kompetisi dan halaman per kompetisi (`/kompetisi/[slug]/`) | Selesai (tahap 2) |
| Komponen navigasi responsif, skeleton, empty state, error state | Selesai |
| Metadata SEO dasar, JSON-LD Organization & WebSite | Selesai |
| Detail pertandingan (`/pertandingan/[slug]/`), Pages Function, render HTML di server | Selesai (tahap 5) |
| Profil klub (`/klub/[slug]/`), static snapshot dari `content/snapshots/clubs.json` | Selesai (tahap 5) |
| Jadwal & hasil per klub, proxy `/api/team-matches` | Selesai (tahap 5) |
| Sistem berita berbasis Markdown (`/berita/`, `/berita/[slug]/`, `/berita/kategori/[slug]/`) dengan gerbang kualitas saat build | Selesai (tahap 3) |
| Profil penulis (`/penulis/`, `/penulis/[slug]/`) | Selesai (tahap 3) |
| RSS feed (`/rss.xml`, 50 artikel terbaru) | Selesai (tahap 3) |
| Transfer (`/transfer/`) dan Statistik pencetak gol (`/statistik/`, proxy `/api/scorers`) | Selesai (tahap 4) |
| Sembilan halaman legal dan kepercayaan (Tentang Kami, Kontak, Kebijakan Privasi, Disclaimer, Pedoman Redaksi, Redaksi, Koreksi & Hak Jawab, Syarat & Ketentuan, Peta Situs) | Selesai, **menunggu data pengelola** (lihat di bawah) |
| `robots.txt`, `sitemap.xml`, `news-sitemap.xml` | Selesai (tahap 4) |
| Halaman legal (Kebijakan Privasi, Disclaimer, Kontak, dll.) | **Belum** (tahap 4) |
| Integrasi AdSense (`ads.txt`, slot iklan, consent) | **Belum**; hanya dibuka setelah akun disetujui |
| Detail pertandingan & profil klub | **Belum**, menunggu keputusan arsitektur |

**Catatan jujur:** tautan menu/footer untuk `/berita/`, `/transfer/`, `/statistik/`, `/tentang-kami/`, dan halaman legal sudah ada, tetapi halamannya belum dibuat sehingga akan 404 sampai tahap berikutnya selesai.

**Detail pertandingan dan profil klub belum dibuat.** Di static export, Next.js harus tahu semua slug saat build (`generateStaticParams`). Daftar pertandingan dan klub tidak bisa diambil lengkap dari API saat build tanpa menghabiskan kuota, jadi pendekatannya perlu dipilih dulu: (a) halaman dinamis lewat Pages Function, atau (b) snapshot data harian yang dibuat saat build. Keputusan ini perlu dikonfirmasi.

**Liga Indonesia dan Piala Asia** belum tersedia di Football-Data.org. Keduanya ditandai `providerCode: null` di `lib/config.ts` dan akan menampilkan pesan "data belum tersedia" sampai sumber data yang sesuai ditambahkan.

## Menulis dan menerbitkan artikel

1. Salin `content/articles/_template-artikel.md` menjadi `content/articles/<slug>.md`.
2. Isi frontmatter dengan data nyata. Penulis harus sudah ada di `content/authors/` dan tidak berstatus draft.
3. Tulis isi dalam Markdown, minimal 300 kata, dengan kalimat sendiri.
4. Cantumkan minimal satu sumber yang dapat diverifikasi di `sources`.
5. Hapus `draft: true` hanya setelah editor memeriksa artikel.
6. Jalankan `npm run build`. Jika ada aturan yang dilanggar, build gagal dan pesannya menunjuk ke file yang bermasalah.

Build akan menolak artikel dengan judul lebih dari 70 karakter, deskripsi di luar 50–160 karakter, kategori tak dikenal, penulis tanpa profil, atau isi kurang dari 300 kata. Aturan ini sengaja dibuat untuk menjaga kualitas dan kelayakan AdSense.

Halaman `/berita/_kosong/` dan `/penulis/_kosong/` adalah sentinel teknis agar static export tetap berjalan saat belum ada konten. Keduanya diberi `noindex` dan diarahkan ke 404 lewat `public/_redirects`.

## Arsitektur data (hibrida)

| Fitur | Teknologi |
|---|---|
| Beranda, berita, halaman legal | Static HTML (dibuat saat build) |
| Live Score, klasemen, jadwal, hasil, statistik | Proxy `/api/*` (Pages Functions) dengan cache edge |
| Detail pertandingan `/pertandingan/{id}-{home}-vs-{away}/` | Pages Function, render HTML di server, cache 60 detik (live) atau 5 menit |
| Profil klub `/klub/[slug]/` | Static snapshot, diperbarui berkala |
| Jadwal klub | Proxy `/api/team-matches` (client) |

### Snapshot profil klub

`scripts/snapshot-clubs.mjs` mengambil tim dari klasemen lalu profilnya (stadion, pelatih, skuad) dari API, dan menulis
`content/snapshots/clubs.json`. Script ini:

- Tanpa `FOOTBALL_DATA_API_KEY`, melewati pengambilan dan membiarkan snapshot lama. Build tetap berjalan.
- Mematuhi batas paket gratis dengan jeda 6,5 detik per permintaan dan menunggu saat menerima 429.
- Melewati klub yang snapshot-nya masih lebih baru dari 7 hari.

Build produksi: `npm run build:prod` (menjalankan snapshot lalu `next build`). Gunakan perintah ini sebagai
**Build command** di Cloudflare Pages.

**Jadwal refresh berkala:** atur build terjadwal di Cloudflare (Deploy Hook yang dipanggil dengan cron harian).
Dengan demikian profil klub dan sitemap berita tetap segar.

### Catatan Pages Function

- Function berjalan di Workers, bukan Node. Jangan memakai `process` atau modul Node di kode yang dipakai Function.
  Konfigurasi situs (`lib/config.ts`) sengaja tidak membaca `process.env`.
- Halaman detail pertandingan tidak masuk sitemap karena jumlahnya dinamis. Ia tetap dapat dirayapi lewat tautan
  dari Jadwal, Hasil, dan halaman klub.

## Data pengelola (WAJIB sebelum publik dan sebelum AdSense)

Identitas pengelola disimpan di `lib/legal/operator.ts`. Semua nilainya saat ini `null`, dan halaman legal menampilkan penanda kuning
"[... belum diisi]" sampai diisi. Field yang harus diisi dengan data sebenarnya:

- `legalName`: nama badan hukum atau nama pengelola
- `address`: alamat surat
- `contactEmail`: email redaksi/kontak yang sudah aktif
- `editorInChief`: nama Pemimpin Redaksi
- `founded`: tahun berdiri

Jangan mengisi field ini dengan tebakan. Jika data belum pasti, biarkan penanda tetap terlihat.

## Sitemap dan sitemap berita

- `/sitemap.xml` memuat seluruh halaman publik canonical, termasuk kategori, kompetisi, penulis, dan artikel. Halaman sentinel `_kosong` dan endpoint API tidak pernah dimasukkan.
- `/news-sitemap.xml` memuat artikel yang terbit dalam 2 hari terakhir, sesuai format Google News. Karena situs statis, daftar ini dihitung saat build. **Jadwalkan build ulang setiap hari** (mis. Cron Trigger atau Deploy Hook Cloudflare) agar tetap akurat.

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

## Google AdSense

- Publisher ID: `ca-pub-5334893977573745`, disimpan di `lib/config.ts` (`ADSENSE.publisherId`). ID ini publik dan juga tercantum di `ads.txt`.
- `public/ads.txt` berisi baris resmi: `google.com, pub-5334893977573745, DIRECT, f08c47fec0942fa0`. Cloudflare Pages menyajikan file ini di `https://pojokbola.web.id/ads.txt`.
- Meta `google-adsense-account` dan skrip `adsbygoogle.js` terpasang di setiap halaman, termasuk halaman detail pertandingan yang dirender Pages Function.
- **Belum ada slot iklan.** Tampilan iklan dikendalikan dari dashboard AdSense (Auto ads). Biarkan dimatikan sampai akun disetujui.
- **Sebelum mengaktifkan iklan:** pasang pengelola persetujuan cookie (CMP) untuk pengunjung di wilayah yang mewajibkannya (EEA, Inggris, dll.). Ini belum diimplementasikan.

## Deploy ke GitHub dan Cloudflare Pages

1. **GitHub:** buat repository kosong (mis. `pojokbola-web`), lalu di folder proyek:
   ```bash
   git remote add origin https://github.com/<akun>/pojokbola-web.git
   git push -u origin master
   ```
2. **Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git → pilih repository.
   - Build command: `npm run build:prod`
   - Build output directory: `out`
   - Environment variables: `NODE_VERSION=20`, `FOOTBALL_DATA_API_KEY` (Encrypted).
3. **Domain:** tambahkan `pojokbola.web.id` sebagai custom domain.
4. **Refresh harian:** buat Deploy Hook di Cloudflare, lalu jadwalkan pemanggilannya setiap hari (mis. dengan GitHub Actions `schedule`).
5. **Verifikasi setelah deploy:**
   - `https://pojokbola.web.id/ads.txt` harus menampilkan baris publisher di atas.
   - Lihat sumber halaman dan pastikan ada `<meta name="google-adsense-account" ...>`.

## Lisensi & data

Data pertandingan dimiliki dan dilisensikan oleh penyedia API masing-masing. Pastikan paket API yang digunakan mengizinkan penayangan data di situs publik.
