import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage, Operator } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Kontak',
  description: 'Hubungi redaksi dan pengelola PojokBola untuk pertanyaan, kerja sama, atau masukan.',
  path: '/kontak/',
});

export default function KontakPage() {
  return (
    <LegalPage title="Kontak" description="Cara menghubungi PojokBola." updated="19 November 2026">
      <p>
        Untuk pertanyaan umum, masukan, atau kerja sama, hubungi kami melalui email:{' '}
        <strong><Operator field="contactEmail" label="email kontak" /></strong>.
      </p>
      <h2>Untuk koreksi berita</h2>
      <p>
        Jika Anda menemukan kesalahan dalam artikel, ikuti prosedur di{' '}
        <a className="text-pitch-600 underline" href="/koreksi-dan-hak-jawab/">Koreksi dan Hak Jawab</a>.
      </p>
      <h2>Alamat</h2>
      <p>
        <Operator field="address" label="alamat surat" />
      </p>
      <h2>Catatan waktu respons</h2>
      <p>Kami berusaha membalas dalam beberapa hari kerja. Kami tidak dapat menanggapi permintaan yang tidak menyertakan identitas dan keterangan yang jelas.</p>
    </LegalPage>
  );
}
