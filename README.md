# PojokBola.web.id — Cloudflare Pages starter

Starter portal sepak bola: live score, jadwal, klasemen, pencarian klub, detail pertandingan dan profil klub. Frontend statis; API key hanya berada di Cloudflare Pages Functions.

## 1. Siapkan API-Football
1. Daftar/login di https://www.api-football.com/
2. Ambil API key dari dashboard.
3. Periksa kuota dan cakupan liga pada paket akun. Live data tidak tersedia untuk semua kompetisi dan pembaruan mengikuti provider.
4. Jangan masukkan API key ke file HTML, JavaScript frontend, GitHub, atau repository publik.

## 2. Upload ke GitHub
1. Buat repository baru bernama `pojokbola`.
2. Extract ZIP ini di komputer.
3. Upload seluruh isi folder (index.html, assets, functions, dll.) ke root repository, bukan folder ZIP-nya.
4. Commit ke branch `main`.

Struktur penting:
```
index.html
assets/app.js
assets/style.css
functions/api/[[path]].js
functions/match/[id].js
functions/club/[id].js
robots.txt
sitemap.xml
_headers
```

## 3. Hubungkan Cloudflare Pages
1. Login https://dash.cloudflare.com/
2. Workers & Pages → Create → Pages → Connect to Git.
3. Pilih repository `pojokbola`, production branch `main`.
4. Framework preset: None.
5. Build command: kosongkan.
6. Build output directory: `/` (root).
7. Deploy.

Jika dashboard meminta direktori output, isi `.` atau `/` sesuai pilihan yang diterima UI. Jangan set `functions` sebagai output directory. Folder `functions` harus berada di root proyek.

## 4. Pasang API key sebagai secret
Cloudflare Dashboard → Workers & Pages → pilih project Pages → Settings → Variables and Secrets → Add.
- Type: Secret
- Variable name: `API_FOOTBALL_KEY`
- Value: tempel API key dari API-Football
Simpan, lalu lakukan redeploy (Retry deployment / Create new deployment) agar environment tersedia pada deployment baru.

Untuk pengujian lokal dengan Wrangler, buat `.dev.vars` (JANGAN commit):
```
API_FOOTBALL_KEY=isi_api_key_anda
```

## 5. Hubungkan domain
Pages project → Custom domains → Set up a custom domain → `pojokbola.web.id`.
Ikuti instruksi DNS Cloudflare sampai status domain Active. Jika domain memakai nameserver Cloudflare, biarkan Cloudflare membuat record yang diminta. Pastikan HTTPS aktif.

## 6. Uji endpoint
Ganti domain sesuai domain aktif:
- `/api/live`
- `/api/fixtures?date=2026-11-20`
- `/api/standings?league=39&season=2026`
- `/api/teams?search=Persib`
- `/match/ID_PERTANDINGAN`
- `/club/ID_KLUB`

ID kompetisi/klub/pertandingan harus berasal dari API-Football. Musim untuk liga Eropa biasanya memakai tahun awal musim; verifikasi musim aktif melalui endpoint leagues/seasons provider. Liga Indonesia tidak otomatis memiliki ID yang sama di semua provider.

## 7. Endpoint yang tersedia
- `GET /api/live`
- `GET /api/fixtures?date=YYYY-MM-DD`
- `GET /api/standings?league=39&season=2026`
- `GET /api/teams?search=Persib`
- `GET /api/teams?id=ID`
- `GET /api/fixtures/events?fixture=ID`
- `GET /api/fixtures/lineups?fixture=ID`
- `GET /api/fixtures/statistics?fixture=ID`

## 8. Catatan SEO dan AdSense
- Detail pertandingan dan klub dirender sebagai HTML oleh Pages Functions agar crawler menerima konten awal.
- Homepage dan halaman lain tetap HTML statis.
- Sitemap saat ini hanya berisi homepage. Untuk SEO skala besar, buat sitemap dinamis berisi URL pertandingan/klub yang benar-benar tersedia, batasi URL, dan perbarui secara berkala.
- Tambahkan halaman Tentang, Kontak, Kebijakan Privasi, Disclaimer, Pedoman Redaksi, serta konten editorial orisinal sebelum mengajukan AdSense.
- Jangan membuat halaman tipis/duplikat untuk setiap ID. Pastikan halaman memiliki data yang bermakna.
- Tidak ada konfigurasi yang menjamin indeks Google atau persetujuan AdSense.
- Pastikan hak penggunaan logo, foto, merek kompetisi dan data sesuai ketentuan provider dan pemegang hak.

## 9. Troubleshooting
- `503 API key belum dipasang`: secret belum dibuat atau deployment belum diulang.
- `401/403`: key salah, akun/paket tidak mengizinkan endpoint, atau kuota/pembatasan provider.
- `429`: batas permintaan/kuota provider tercapai. Tingkatkan cache dan kurangi polling.
- Tidak ada pertandingan: bisa memang tidak ada laga live atau kompetisi tidak memiliki cakupan live.
- Halaman klub/pertandingan 404: ID tidak ditemukan pada API.
- Pastikan folder `functions` sejajar dengan `index.html`, bukan berada di dalam `assets`.

## Dokumentasi
- API-Football: https://www.api-football.com/documentation-v3
- Cloudflare Pages Git integration: https://developers.cloudflare.com/pages/get-started/git-integration/
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/
- Cloudflare Pages bindings: https://developers.cloudflare.com/pages/functions/bindings/
