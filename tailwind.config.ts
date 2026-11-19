import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Hijau lapangan (aksen utama)
        pitch: {
          50: '#effaf3',
          100: '#d7f3e1',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        // Navy gelap (header & teks utama)
        navy: {
          700: '#1e3a5f',
          800: '#152a47',
          900: '#0b1a2e',
        },
        // Merah untuk status LIVE
        live: {
          500: '#e11d48',
          600: '#be123c',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
