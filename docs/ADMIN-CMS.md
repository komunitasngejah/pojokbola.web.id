# Halaman Admin Artikel (Decap CMS)

Halaman: `https://pojokbola.web.id/admin/`

Halaman ini dipakai untuk membuat, mengedit, dan menghapus artikel di `content/articles/`. Setiap simpan menjadi commit ke branch `main`, lalu Cloudflare membangun ulang situs.

## Pengaturan satu kali

### 1. Buat GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**

- Application name: `PojokBola Admin`
- Homepage URL: `https://pojokbola.web.id`
- Authorization callback URL: `https://pojokbola.web.id/oauth/callback`

Setelah dibuat, salin **Client ID** dan buat **Client secret**.

### 2. Tambahkan secret di Cloudflare

Workers & Pages → pojokbola-web-id → Settings → Variables and Secrets:

| Nama | Tipe | Nilai |
|---|---|---|
| `GITHUB_OAUTH_CLIENT_ID` | Text | Client ID dari GitHub |
| `GITHUB_OAUTH_CLIENT_SECRET` | Secret | Client secret dari GitHub |

Lalu jalankan **Retry deployment**.

Jangan pernah menaruh nilai ini di repo atau di chat.

## Cara pakai

1. Buka `https://pojokbola.web.id/admin/` lalu klik **Login with GitHub**.
2. Setujui akses di jendela GitHub. Hanya akun yang punya izin tulis ke repo ini yang bisa menyimpan perubahan.
3. Pilih **Berita**:
   - **New Berita** untuk artikel baru.
   - Klik judul untuk mengedit.
   - Ikon tempat sampah untuk menghapus.
4. Isi kolom sesuai hint. Minimal: slug, judul, deskripsi, kategori, tanggal terbit, satu sumber, dan isi artikel minimal 300 kata.
5. Centang **Draft** jika belum mau tampil.
6. Klik **Publish** lalu **Publish now**.

Setelah itu tunggu deployment Cloudflare selesai (sekitar 5–15 menit). Artikel baru akan tampil dan masuk ke sitemap otomatis.

## Batasan yang perlu diingat

- Decap tidak memeriksa aturan kualitas. Jika artikel kurang dari 300 kata atau tidak punya sumber, build akan gagal dan situs tetap menampilkan versi sebelumnya. Cek status di Cloudflare → Deployments jika artikel baru tidak muncul.
- File `_template-artikel.md` ikut tampil di daftar. Jangan diedit; itu hanya contoh.
- Jangan ubah slug setelah artikel terbit, karena URL-nya berubah.
- Gambar diunggah ke `public/images/berita/`. Gunakan hanya gambar yang Anda miliki haknya.
- Sesudah artikel baru terbit, daftarkan URL-nya di Search Console dengan **URL inspection → Request indexing**.
