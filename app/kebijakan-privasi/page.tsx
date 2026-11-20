import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage, Operator } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi PojokBola: data yang kami proses, penggunaan cookie, iklan Google AdSense, dan hak Anda sebagai pengguna.',
  path: '/kebijakan-privasi/',
});

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage title="Kebijakan Privasi" description="Bagaimana PojokBola memperlakukan informasi Anda." updated="19 November 2026">
      <p>
        Kebijakan ini menjelaskan informasi apa yang diproses saat Anda menggunakan PojokBola, dan untuk apa. Pengelola:{'Kang Ruli '}
        <Operator field="legalName" label="nama pengelola" />.
      </p>
      <h2>Informasi yang kami proses</h2>
      <ul>
        <li>
          <strong>Akun pengguna.</strong> Saat ini PojokBola tidak memiliki sistem akun dan tidak meminta data pribadi dari pembaca.
        </li>
        <li>
          <strong>Permintaan data pertandingan.</strong> Browser Anda meminta data ke server kami, bukan langsung ke penyedia data. Server kami
          yang kemudian mengambil data dari penyedia. Dengan demikian, penyedia data tidak menerima alamat IP Anda dari permintaan tersebut.
        </li>
        <li>
          <strong>Catatan akses server.</strong> Penyedia hosting dan CDN (Cloudflare) dapat mencatat alamat IP dan informasi permintaan
          untuk keamanan dan operasional sesuai kebijakan mereka.
        </li>
      </ul>
      <h2>Cookie dan iklan</h2>
      <p>
        PojokBola tidak menanam cookie pelacakan milik kami sendiri saat ini. Apabila kami menampilkan iklan Google AdSense di masa
        mendatang, Google dan mitranya dapat menggunakan cookie atau teknologi serupa untuk menampilkan iklan berdasarkan kunjungan Anda ke situs
        ini maupun situs lain. Anda dapat mengatur preferensi iklan melalui pengaturan Iklan Google di <em>adssettings.google.com</em>.
      </p>
      <p>
        Untuk pengguna di wilayah yang mewajibkan persetujuan, kami akan menyediakan pengelola persetujuan cookie sebelum iklan
        dipasang. Setelah itu, kebijakan ini akan diperbarui.
      </p>
      <h2>Tautan ke situs lain</h2>
      <p>Sumber berita dan tautan di situs kami dapat membawa Anda ke situs pihak ketiga. Kebijakan privasi situs tersebut berlaku terpisah.</p>
      <h2>Hak Anda</h2>
      <p>
        Sesuai Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022), Anda dapat meminta informasi tentang data pribadi yang kami
        proses. Hubungi kami melalui halaman <a className="text-pitch-600 underline" href="/kontak/">Kontak</a>.
      </p>
      <h2>Perubahan kebijakan</h2>
      <p>Kami dapat memperbarui kebijakan ini. Tanggal pembaruan terakhir selalu ditampilkan di bagian atas halaman.</p>
    </LegalPage>
  );
}
