import Link from 'next/link';
import type { Metadata } from 'next';
import { COMPETITIONS, CATEGORIES } from '@/lib/config';
import { loadArticles, loadAuthors } from '@/lib/content/loader';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = buildMetadata({
  title: 'Peta Situs',
  description: 'Daftar seluruh halaman utama PojokBola untuk memudahkan navigasi.',
  path: '/peta-situs/',
});

const LEGAL = [
  ['Tentang Kami', '/tentang-kami/'],
  ['Kontak', '/kontak/'],
  ['Kebijakan Privasi', '/kebijakan-privasi/'],
  ['Disclaimer', '/disclaimer/'],
  ['Pedoman Redaksi', '/pedoman-redaksi/'],
  ['Redaksi', '/redaksi/'],
  ['Koreksi dan Hak Jawab', '/koreksi-dan-hak-jawab/'],
  ['Syarat dan Ketentuan', '/syarat-dan-ketentuan/'],
];

function Group({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-bold">{title}</h2>
      <ul className="grid gap-1 text-sm sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-pitch-600 hover:underline">{i.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PetaSitusPage() {
  const articles = loadArticles();
  const authors = loadAuthors();
  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: 'Peta Situs' }]} />
      <h1 className="text-2xl font-extrabold">Peta Situs</h1>
      <Group
        title="Utama"
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'Live Score', href: '/live-score/' },
          { label: 'Jadwal', href: '/jadwal/' },
          { label: 'Hasil', href: '/hasil/' },
          { label: 'Klasemen', href: '/klasemen/' },
          { label: 'Kompetisi', href: '/kompetisi/' },
          { label: 'Berita', href: '/berita/' },
          { label: 'Transfer', href: '/transfer/' },
          { label: 'Statistik', href: '/statistik/' },
          { label: 'Penulis', href: '/penulis/' },
          { label: 'Tentang Kami', href: '/tentang-kami/' },
        ]}
      />
      <Group title="Kompetisi" items={COMPETITIONS.map((c) => ({ label: c.name, href: `/kompetisi/${c.slug}/` }))} />
      <Group title="Kategori berita" items={CATEGORIES.map((c) => ({ label: c.name, href: `/berita/kategori/${c.slug}/` }))} />
      {articles.length > 0 && (
        <Group title="Artikel" items={articles.map((a) => ({ label: a.title, href: `/berita/${a.slug}/` }))} />
      )}
      {authors.length > 0 && (
        <Group title="Penulis" items={authors.map((a) => ({ label: a.name, href: `/penulis/${a.slug}/` }))} />
      )}
      <Group title="Informasi" items={LEGAL.map(([label, href]) => ({ label, href }))} />
    </div>
  );
}
