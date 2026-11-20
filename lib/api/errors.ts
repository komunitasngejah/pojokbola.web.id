/**
 * Error khusus untuk lapisan API. Semua error dari provider diubah
 * menjadi kelas ini agar penanganannya seragam di server maupun UI.
 */
export type ApiErrorCode =
  | 'RATE_LIMITED'
  | 'UPSTREAM_UNAVAILABLE'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL';

export class ProviderError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  /** Detik sebelum boleh mencoba lagi (dari header Retry-After), jika ada. */
  readonly retryAfter?: number;

  constructor(code: ApiErrorCode, message: string, status: number, retryAfter?: number) {
    super(message);
    this.name = 'ProviderError';
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

/** Mengubah status HTTP provider menjadi ProviderError yang tepat. */
export function fromHttpStatus(status: number, retryAfterHeader?: string | null): ProviderError {
  if (status === 429) {
    const retry = retryAfterHeader ? Number(retryAfterHeader) : 60;
    return new ProviderError(
      'RATE_LIMITED',
      'Batas permintaan API tercapai. Data akan diperbarui sebentar lagi.',
      429,
      Number.isFinite(retry) ? retry : 60,
    );
  }
  if (status === 404) {
    return new ProviderError('NOT_FOUND', 'Data tidak ditemukan.', 404);
  }
  if (status === 400) {
    return new ProviderError('BAD_REQUEST', 'Permintaan tidak valid.', 400);
  }
  return new ProviderError(
    'UPSTREAM_UNAVAILABLE',
    'Data pertandingan sedang tidak tersedia. Silakan coba beberapa saat lagi.',
    502,
  );
}
