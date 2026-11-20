import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { LegalPage, Operator } from '@/components/LegalPage';

export const metadata: Metadata = buildMetadata({
  title: 'Tentang Kami',
  description: 'Mengenal PojokBola: visi, cara kerja redaksi, sumber data pertandingan, dan komitmen kami kepada pembaca sepak bola.',
  path: '/tentang-kami/',
});

export default function TentangKamiPage() {
  return (
    <LegalPage title="Tentang Kami" description="Siapa kami, apa yang kami sajikan, dan bagaimana kami bekerja." updated="19 November 2026">
      <p>
        PojokBola adalah portal sepak bola untuk pembaca Indonesia dan internasional. Kami menyajikan live score, jadwal, hasil
        pertandingan, klasemen, statistik, dan berita sepak bola. Tagline kami: <em>Semua Informasi Sepak Bola Ada di Satu Pojok.</em>
      </p>
      <h2>Yang kami tawarkan</h2>
      <ul>
        <li>Skor dan status pertandingan, yang diperbarui dari penyedia data pihak ketiga.</li>
        <li>Klasemen, jadwal, hasil, dan pencetak gol terbanyak untuk kompetisi yang kami pantau.</li>
        <li>Berita dan analisis yang ditulis oleh penulis kami, dengan sumber yang dicantumkan.</li>
      </ul>
      <h2>Sumber data</h2>
      <p>
        Data pertandingan dan klasemen berasal dari Football-Data.org. Data tersebut kami tampilkan apa adanya, tetapi kami tidak
        menjamin ketepatan real-time secara mutlak. Kesalahan atau keterlambatan dari penyedia data dapat terjadi.
      </p>
      <h2>Pengelola</h2>
      <p>
        Nama pengelola: <Operator field="legalName" label="nama pengelola" />. Pemimpin Redaksi:{' '}
        <Operator field="editorInChief" label="nama pemimpin redaksi" />. Tahun berdiri:{' '}
        <Operator field="founded" label="tahun berdiri" />.
      </p>
      <p>
        Untuk detail kepenulisan dan struktur redaksi, baca <a className="text-pitch-600 underline" href="/pedoman-redaksi/">Pedoman Redaksi</a>{' '}
        dan <a className="text-pitch-600 underline" href="/redaksi/">Redaksi</a>.
      </p>
    </LegalPage>
  );
}
