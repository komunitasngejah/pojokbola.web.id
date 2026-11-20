/**
 * Identitas pengelola PojokBola. SEMUA nilai `null` adalah data yang BELUM diberikan/diverifikasi.
 * Jangan mengisi nilai ini dengan tebakan. Halaman legal akan menampilkan penanda
 * "belum diisi" yang terlihat sampai nilainya diisi di file ini.
 *
 * Sebelum mengajukan AdSense, semua field wajib di bawah harus terisi dengan data sebenarnya.
 */
export const OPERATOR = {
  legalName: 'Kang Ruli' as string | null, // nama badan hukum atau nama pengelola perorangan
  address: 'Bandung, Jawa Barat' as string | null, // alamat surat (boleh ditampilkan sesuai kebijakan Anda)
  contactEmail: 'kangrulidkv@gmail.com' as string | null, // mis. redaksi@pojokbola.web.id, setelah dibuat dan diverifikasi
  editorInChief: 'Kang Ruli' as string | null, // Pemimpin Redaksi
  founded: '2020' null as string | null, // tahun berdiri, mis. "2026"
} as const;

export type OperatorField = keyof typeof OPERATOR;
