import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage, Operator } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Koreksi dan Hak Jawab',
  description: 'Cara mengajukan koreksi kesalahan fakta atau hak jawab atas artikel PojokBola.',
  path: '/koreksi-dan-hak-jawab/',
});

export default function KoreksiPage() {
  return (
    <LegalPage title="Koreksi dan Hak Jawab" description="Prosedur jika Anda menemukan kesalahan atau merasa dirugikan oleh pemberitaan." updated="19 November 2026">
      <h2>Ajukan koreksi</h2>
      <p>Jika Anda menemukan kesalahan fakta, kirim email ke <strong><Operator field="contactEmail" label="email redaksi" /></strong> dengan menyertakan:</p>
      <ul>
        <li>Tautan atau judul artikel.</li>
        <li>Bagian yang keliru.</li>
        <li>Sumber yang benar, jika ada.</li>
      </ul>
      <h2>Hak jawab</h2>
      <p>Pihak yang merasa dirugikan oleh suatu artikel dapat mengajukan hak jawab dengan identitas yang jelas. Jawaban akan dimuat tanpa perubahan substansi dan sesuai ketentuan hukum yang berlaku.</p>
      <h2>Proses</h2>
      <ul>
        <li>Permintaan kami tinjau oleh editor dalam waktu yang wajar.</li>
        <li>Jika benar, artikel diperbaiki dan catatan koreksi ditampilkan pada artikel.</li>
        <li>Jika tidak terbukti, kami akan memberi tahu alasannya.</li>
      </ul>
    </LegalPage>
  );
}
