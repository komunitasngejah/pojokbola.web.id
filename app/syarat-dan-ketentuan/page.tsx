import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Syarat dan Ketentuan',
  description: 'Syarat penggunaan situs PojokBola, termasuk hak kekayaan intelektual dan larangan penyalahgunaan.',
  path: '/syarat-dan-ketentuan/',
});

export default function SyaratPage() {
  return (
    <LegalPage title="Syarat dan Ketentuan" description="Ketentuan penggunaan situs PojokBola." updated="19 November 2026">
      <h2>Penggunaan</h2>
      <p>Dengan mengakses PojokBola, Anda setuju menggunakannya secara wajar dan sesuai hukum yang berlaku.</p>
      <h2>Hak kekayaan intelektual</h2>
      <p>Artikel, desain, dan konten orisinal PojokBola dilindungi. Anda boleh membagikan tautan ke artikel kami. Penggunaan ulang isi artikel memerlukan izin tertulis.</p>
      <h2>Larangan</h2>
      <ul>
        <li>Mengambil data secara otomatis dalam volume yang membebani layanan kami.</li>
        <li>Mencoba mengakses API internal atau mengganggu layanan.</li>
        <li>Menyalin artikel secara utuh untuk situs lain.</li>
      </ul>
      <h2>Batasan layanan</h2>
      <p>Layanan disediakan apa adanya. Ketersediaan dan ketepatan data bergantung pada penyedia pihak ketiga, sehingga kami tidak menjamin layanan bebas gangguan.</p>
      <h2>Perubahan ketentuan</h2>
      <p>Kami dapat memperbarui ketentuan ini sewaktu-waktu. Tanggal pembaruan terakhir ditampilkan di bagian atas halaman.</p>
    </LegalPage>
  );
}
