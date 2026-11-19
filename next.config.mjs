/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: setiap halaman dibuat sebagai HTML saat build,
  // sehingga bisa dirayapi Google dan di-host gratis di Cloudflare Pages.
  output: 'export',
  // Semua URL berakhir dengan "/" agar konsisten dengan sitemap (mis. /live-score/).
  trailingSlash: true,
  images: {
    unoptimized: true, // Cloudflare Pages tidak menjalankan optimasi gambar Next.js
  },
  reactStrictMode: true,
};

export default nextConfig;
