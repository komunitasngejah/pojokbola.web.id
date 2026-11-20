import type { ApiEnvelope, ApiErrorBody } from '@/types/football';

/**
 * Pemanggil API untuk sisi browser. Hanya memanggil proxy internal /api/...
 * Tidak pernah memanggil provider sepak bola langsung dan tidak memuat API key.
 */
export class ClientApiError extends Error {
  constructor(
    message: string,
    readonly code: ApiErrorBody['error']['code'] | 'NETWORK',
  ) {
    super(message);
    this.name = 'ClientApiError';
  }
}

export async function fetchApi<T>(path: string, signal?: AbortSignal): Promise<ApiEnvelope<T>> {
  let res: Response;
  try {
    res = await fetch(path, { headers: { Accept: 'application/json' }, signal });
  } catch {
    throw new ClientApiError('Koneksi bermasalah. Periksa internet Anda lalu coba lagi.', 'NETWORK');
  }

  if (!res.ok) {
    let message = 'Data sedang tidak tersedia. Silakan coba beberapa saat lagi.';
    let code: ApiErrorBody['error']['code'] = 'UPSTREAM_UNAVAILABLE';
    try {
      const body = (await res.json()) as ApiErrorBody;
      message = body.error.message;
      code = body.error.code;
    } catch {
      // Respons bukan JSON; gunakan pesan default.
    }
    throw new ClientApiError(message, code);
  }

  return (await res.json()) as ApiEnvelope<T>;
}
