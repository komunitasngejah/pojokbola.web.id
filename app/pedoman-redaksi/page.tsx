import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Pedoman Redaksi',
  description: 'Standar penulisan, verifikasi fakta, sumber, dan pemeriksaan editor yang diterapkan PojokBola.',
  path: '/pedoman-redaksi/',
});

export default function PedomanRedaksiPage() {
  return (
    <LegalPage title="Pedoman Redaksi" description="Standar yang kami terapkan pada setiap artikel." updated="19 November 2026">
      <h2>1. Karya orisinal</h2>
      <p>Setiap artikel ditulis dengan kalimat sendiri. Kami tidak menyalin atau menerjemahkan berita lain tanpa tambahan nilai dan tanpa sumber.</p>
      <h2>2. Sumber wajib</h2>
      <p>Setiap artikel mencantumkan minimal satu sumber yang dapat diverifikasi. Sumber diutamakan dari pernyataan resmi klub, federasi, penyelenggara, atau media kredibel.</p>
      <h2>3. Verifikasi fakta</h2>
      <p>Angka, skor, tanggal, dan pernyataan kutipan diperiksa ulang sebelum terbit. Rumor yang belum dikonfirmasi tidak diterbitkan sebagai fakta.</p>
      <h2>4. Pemeriksaan editor</h2>
      <p>Setiap artikel diperiksa oleh editor sebelum dipublikasikan. Penulis dan editor dicantumkan pada artikel.</p>
      <h2>5. Konten buatan AI</h2>
      <p>Kami tidak menerbitkan konten yang dihasilkan secara otomatis tanpa pemeriksaan dan penulisan manusia yang bertanggung jawab.</p>
      <h2>6. Judul dan konten</h2>
      <p>Judul harus sesuai isi artikel. Kami tidak menggunakan judul yang menyesatkan atau sensasional tanpa dasar.</p>
      <h2>7. Pemisahan opini dan fakta</h2>
      <p>Analisis dan prediksi diberi label jelas dan dibedakan dari berita.</p>
      <h2>8. Koreksi</h2>
      <p>Kesalahan kami koreksi secara terbuka. Lihat <a className="text-pitch-600 underline" href="/koreksi-dan-hak-jawab/">Koreksi dan Hak Jawab</a>.</p>
    </LegalPage>
  );
}
