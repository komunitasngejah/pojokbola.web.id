import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage, Operator } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Redaksi',
  description: 'Susunan redaksi PojokBola, termasuk pemimpin redaksi dan kontak redaksi.',
  path: '/redaksi/',
});

export default function RedaksiPage() {
  return (
    <LegalPage title="Redaksi" description="Pihak yang bertanggung jawab atas konten PojokBola." updated="19 November 2026">
      <p>
        Pemimpin Redaksi: <Operator field="editorInChief" label="nama pemimpin redaksi" />.
      </p>
      <p>
        Pengelola: <Operator field="legalName" label="nama pengelola" />.
      </p>
      <p>
        Kontak redaksi: <Operator field="contactEmail" label="email redaksi" />.
      </p>
      <h2>Daftar penulis</h2>
      <p>
        Profil setiap penulis dapat dilihat di halaman <a className="text-pitch-600 underline" href="/penulis/">Penulis</a>.
      </p>
      <h2>Tanggung jawab</h2>
      <p>Pemimpin Redaksi bertanggung jawab atas isi redaksional sesuai <a className="text-pitch-600 underline" href="/pedoman-redaksi/">Pedoman Redaksi</a>.</p>
    </LegalPage>
  );
}
