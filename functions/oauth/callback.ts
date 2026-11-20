/**
 * Cloudflare Pages Function: menukar kode OAuth GitHub menjadi token untuk Decap CMS.
 *
 *   GET /oauth/callback?code=...&state=...
 *
 * Alur: halaman ini memberi tahu jendela Decap (opener) bahwa login selesai,
 * lalu mengirim token ke origin yang sama lewat postMessage, sesuai protokol Decap.
 * Environment variable: GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET (secret).
 */
interface Env {
  GITHUB_OAUTH_CLIENT_ID?: string;
  GITHUB_OAUTH_CLIENT_SECRET?: string;
}

function readCookie(header: string, name: string): string | undefined {
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1];
}

function page(payload: { token: string; provider: string }): string {
  // Escape "<" agar tidak bisa menutup tag <script> lebih awal.
  const data = JSON.stringify(payload).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="id">
  <head><meta charset="utf-8" /><meta name="robots" content="noindex" /><title>Login admin</title></head>
  <body>
    <p>Login berhasil. Jendela ini akan tertutup otomatis.</p>
    <script>
      (function () {
        var payload = ${data};
        function receive(e) {
          if (e.source !== window.opener || e.data !== 'authorizing:github') return;
          window.opener.postMessage('authorization:github:success:' + JSON.stringify(payload), e.origin);
          window.removeEventListener('message', receive, false);
          window.close();
        }
        window.addEventListener('message', receive, false);
        if (window.opener) window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}

function failure(message: string, status: number): Response {
  return new Response(message, { status, headers: { 'Cache-Control': 'no-store' } });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = readCookie(request.headers.get('Cookie') ?? '', 'pb_oauth_state');

  if (!code || !state || !expected || state !== expected) {
    return failure('Permintaan login tidak valid. Ulangi login dari halaman /admin.', 400);
  }

  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return failure('Login admin belum dikonfigurasi.', 503);
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL('/oauth/callback', request.url).toString(),
    }),
  });

  const data = (await tokenRes.json().catch(() => ({}))) as { access_token?: string };
  if (!data.access_token) {
    return failure('Gagal menukar kode login dengan GitHub. Ulangi login.', 502);
  }

  return new Response(page({ token: data.access_token, provider: 'github' }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'pb_oauth_state=; Max-Age=0; Path=/oauth; HttpOnly; Secure; SameSite=Lax',
    },
  });
};
