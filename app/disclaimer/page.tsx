import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Disclaimer',
  description: 'Batasan tanggung jawab PojokBola atas data pertandingan, berita, dan tautan pihak ketiga.',
  path: '/disclaimer/',
});

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" description="Batasan informasi di PojokBola." updated="19 November 2026">
      <h2>Data pertandingan</h2>
      <p>
        Skor, jadwal, dan klasemen berasal dari penyedia data pihak ketiga. Data dapat terlambat, tidak lengkap, atau berubah tanpa
        pemberitahuan, misalnya karena keputusan wasit atau pembaruan resmi dari penyelenggara. Untuk keputusan penting, rujuk sumber resmi
        penyelenggara kompetisi.
      </p>
      <h2>Berita dan analisis</h2>
      <p>
        Artikel adalah pandangan redaksi dan penulis kami, berdasarkan sumber yang dicantumkan pada setiap artikel. Analisis dan prediksi
        bersifat opini dan tidak menjamin hasil pertandingan.
      </p>
      <h2>Bukan saran taruhan atau finansial</h2>
      <p>
        PojokBola tidak menyediakan saran taruhan, perjudian, atau investasi. Konten kami tidak boleh dijadikan dasar keputusan keuangan.
        Jika Anda terlibat dalam aktivitas tersebut, pertimbangkan risikonya dengan saksama.
      </p>
      <h2>Tautan pihak ketiga</h2>
      <p>Kami tidak bertanggung jawab atas isi situs lain yang ditautkan dari PojokBola.</p>
      <h2>Merek dan logo</h2>
      <p>
        Nama klub, kompetisi, dan logo yang tampil di situs adalah milik masing-masing pemilik hak. Penampilannya hanya untuk keperluan
        informasi.
      </p>
    </LegalPage>
  );
}
